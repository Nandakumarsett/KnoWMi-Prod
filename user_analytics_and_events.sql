-- ================================================
-- KnoWMi User Event Analytics SQL Migration
-- Run this script in your Supabase SQL Editor
-- ================================================

-- 1. Add dedicated analytics & event columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS signup_date TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS is_purchased BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS purchased_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_checkout_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS checkout_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- 2. Backfill existing profiles
UPDATE public.profiles 
SET signup_date = COALESCE(signup_date, created_at, now()),
    is_purchased = CASE 
      WHEN status IN ('paid', 'team') OR role = 'owner' OR COALESCE(amount_paid, 0) > 0 THEN true 
      ELSE false 
    END;

-- 3. Create central user_analytics_events log table
CREATE TABLE IF NOT EXISTS public.user_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL, -- e.g. 'user_signup', 'user_login', 'checkout_initiated', 'purchase_completed', 'profile_updated', 'tee_claimed'
  event_data JSONB DEFAULT '{}'::jsonb,
  page_url TEXT DEFAULT '',
  visitor_fp TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable RLS and add public INSERT / SELECT policy
ALTER TABLE public.user_analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert to user_analytics_events" ON public.user_analytics_events;
CREATE POLICY "Allow public insert to user_analytics_events" 
ON public.user_analytics_events 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow users and admins read user_analytics_events" ON public.user_analytics_events;
CREATE POLICY "Allow users and admins read user_analytics_events" 
ON public.user_analytics_events 
FOR SELECT 
USING (true);

-- 5. Index for ultra-fast SQL queries on event analytics
CREATE INDEX IF NOT EXISTS idx_user_analytics_events_user ON public.user_analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_events_profile ON public.user_analytics_events(profile_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_events_name ON public.user_analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_user_analytics_events_created ON public.user_analytics_events(created_at);

-- 6. Trigger to automatically populate signup_date and is_purchased on new/updated profiles
CREATE OR REPLACE FUNCTION public.sync_profile_analytics_fields()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.signup_date IS NULL THEN
    NEW.signup_date := NEW.created_at;
  END IF;

  IF NEW.status IN ('paid', 'team') OR NEW.role = 'owner' OR COALESCE(NEW.amount_paid, 0) > 0 THEN
    NEW.is_purchased := true;
    IF NEW.purchased_at IS NULL THEN
      NEW.purchased_at := now();
    END IF;
  ELSE
    NEW.is_purchased := false;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_profile_analytics ON public.profiles;
CREATE TRIGGER trg_sync_profile_analytics
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_profile_analytics_fields();

-- 7. Unified SQL View: vw_user_analytics_summary
-- Run `SELECT * FROM vw_user_analytics_summary;` to see full user metrics in one view!
CREATE OR REPLACE VIEW public.vw_user_analytics_summary AS
SELECT 
  p.id AS profile_id,
  p.user_id,
  p.first_name,
  p.last_name,
  p.wm_code,
  p.status,
  p.role,
  p.signup_date,
  p.is_purchased,
  p.purchased_at,
  p.last_checkout_at,
  p.checkout_count,
  p.last_login_at,
  COUNT(DISTINCT e.id) AS total_events_logged,
  COUNT(DISTINCT CASE WHEN e.event_name = 'checkout_initiated' THEN e.id END) AS logged_checkout_count,
  COUNT(DISTINCT CASE WHEN e.event_name = 'purchase_completed' THEN e.id END) AS logged_purchase_count,
  COUNT(DISTINCT CASE WHEN e.event_name = 'user_login' THEN e.id END) AS logged_login_count
FROM public.profiles p
LEFT JOIN public.user_analytics_events e ON e.profile_id = p.id OR e.user_id = p.user_id
GROUP BY p.id, p.user_id, p.first_name, p.last_name, p.wm_code, p.status, p.role, p.signup_date, p.is_purchased, p.purchased_at, p.last_checkout_at, p.checkout_count, p.last_login_at;

GRANT SELECT ON public.vw_user_analytics_summary TO authenticated, anon, service_role;

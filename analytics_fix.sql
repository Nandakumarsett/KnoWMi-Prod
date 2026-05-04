-- ================================================
-- REAL-TIME ANALYTICS FIX (KnoWMi)
-- Run this in your Supabase SQL Editor
-- ================================================

-- 1. Create the Daily Rollup Table
CREATE TABLE IF NOT EXISTS public.profile_view_daily (
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  day DATE NOT NULL,
  total_views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  qr_views INTEGER DEFAULT 0,
  social_views INTEGER DEFAULT 0,
  direct_views INTEGER DEFAULT 0,
  mobile_views INTEGER DEFAULT 0,
  desktop_views INTEGER DEFAULT 0,
  PRIMARY KEY (profile_id, day)
);

-- 2. Create the Raw Events Table (for Last Hour/Live metrics)
CREATE TABLE IF NOT EXISTS public.profile_view_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT now(),
  visitor_fp TEXT,
  referrer TEXT,
  device_type TEXT,
  browser TEXT,
  country TEXT,
  city TEXT,
  is_repeat BOOLEAN DEFAULT false
);

-- 3. Create the Bloom Filter Table (for Privacy-Safe Unique Tracking)
CREATE TABLE IF NOT EXISTS public.profile_visitor_bloom (
  profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  filter_bits BYTEA,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. THE CORE FUNCTION: increment_daily_views
-- This handles the heavy lifting of updating stats in real-time
CREATE OR REPLACE FUNCTION public.increment_daily_views(
  p_id UUID,
  p_day DATE,
  p_is_qr BOOLEAN,
  p_is_social BOOLEAN,
  p_is_direct BOOLEAN,
  p_is_mobile BOOLEAN,
  p_is_unique BOOLEAN
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.profile_view_daily (
    profile_id, 
    day, 
    total_views, 
    unique_views, 
    qr_views, 
    social_views, 
    direct_views, 
    mobile_views,
    desktop_views
  )
  VALUES (
    p_id, 
    p_day, 
    1, 
    CASE WHEN p_is_unique THEN 1 ELSE 0 END,
    CASE WHEN p_is_qr THEN 1 ELSE 0 END,
    CASE WHEN p_is_social THEN 1 ELSE 0 END,
    CASE WHEN p_is_direct THEN 1 ELSE 0 END,
    CASE WHEN p_is_mobile THEN 1 ELSE 0 END,
    CASE WHEN NOT p_is_mobile THEN 1 ELSE 0 END
  )
  ON CONFLICT (profile_id, day)
  DO UPDATE SET
    total_views = profile_view_daily.total_views + 1,
    unique_views = profile_view_daily.unique_views + (CASE WHEN p_is_unique THEN 1 ELSE 0 END),
    qr_views = profile_view_daily.qr_views + (CASE WHEN p_is_qr THEN 1 ELSE 0 END),
    social_views = profile_view_daily.social_views + (CASE WHEN p_is_social THEN 1 ELSE 0 END),
    direct_views = profile_view_daily.direct_views + (CASE WHEN p_is_direct THEN 1 ELSE 0 END),
    mobile_views = profile_view_daily.mobile_views + (CASE WHEN p_is_mobile THEN 1 ELSE 0 END),
    desktop_views = profile_view_daily.desktop_views + (CASE WHEN NOT p_is_mobile THEN 1 ELSE 0 END);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Enable Real-Time on events table (For Live Counter)
-- (Already enabled as per user error, keeping as reference)
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.profile_view_events;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.scans;

-- 6. Grant Permissions
GRANT ALL ON public.profile_view_daily TO service_role;
GRANT ALL ON public.profile_view_events TO service_role;
GRANT ALL ON public.profile_visitor_bloom TO service_role;
GRANT ALL ON public.scans TO service_role;

-- 7. Public Read Access (for Public Profile Counters)
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view scan counts" ON public.scans;
CREATE POLICY "Public can view scan counts" ON public.scans FOR SELECT USING (true);

ALTER TABLE public.profile_view_daily ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view daily stats" ON public.profile_view_daily;
CREATE POLICY "Public can view daily stats" ON public.profile_view_daily FOR SELECT USING (true);

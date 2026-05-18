-- =========================================================================
-- KNOWNMI SCHEMA MIGRATION: PUBLIC PULSE VIEWS & INTELLIGENT WM-CODE PREFIX
-- =========================================================================
-- Run this entire script in your Supabase SQL Editor (https://supabase.com)
-- This will:
--  1. Set up public SELECT policies for all analytics tables so guests can see Pulse view count
--  2. Upgrade the automatic WM-Code generation triggers to intelligently use first_name from
--     identities, falling back to profiles.first_name (username) and email prefix
--  3. Prevent any future duplicate username (first_name) signup collisions
-- =========================================================================

-- -------------------------------------------------------------------------
-- PART 1: PUBLIC SELECT & INSERT ACCESS FOR REAL-TIME ANALYTICS (PULSE FIXED!)
-- -------------------------------------------------------------------------

-- A. Enable RLS and Grant SELECT & INSERT policies for raw view events
ALTER TABLE public.profile_view_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select profile_view_events" ON public.profile_view_events;
CREATE POLICY "Public select profile_view_events" ON public.profile_view_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert profile_view_events" ON public.profile_view_events;
CREATE POLICY "Public insert profile_view_events" ON public.profile_view_events FOR INSERT WITH CHECK (true);

-- B. Enable RLS and Grant SELECT & INSERT policies for QR scan events
ALTER TABLE public.qr_scan_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select qr_scan_events" ON public.qr_scan_events;
CREATE POLICY "Public select qr_scan_events" ON public.qr_scan_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert qr_scan_events" ON public.qr_scan_events;
CREATE POLICY "Public insert qr_scan_events" ON public.qr_scan_events FOR INSERT WITH CHECK (true);

-- C. Enable RLS and Grant SELECT & INSERT policies for generic scans
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select scans" ON public.scans;
CREATE POLICY "Public select scans" ON public.scans FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert scans" ON public.scans;
CREATE POLICY "Public insert scans" ON public.scans FOR INSERT WITH CHECK (true);

-- D. Enable RLS and Grant SELECT & INSERT policies for link clicks
ALTER TABLE public.link_click_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public select link_click_events" ON public.link_click_events;
CREATE POLICY "Public select link_click_events" ON public.link_click_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert link_click_events" ON public.link_click_events;
CREATE POLICY "Public insert link_click_events" ON public.link_click_events FOR INSERT WITH CHECK (true);

-- -------------------------------------------------------------------------
-- PART 2: SMART SEQUENTIAL WM-CODE PREFIX GENERATOR
-- -------------------------------------------------------------------------

-- Drop old functions first to prevent parameter conflicts
DROP FUNCTION IF EXISTS public.generate_wm_code();
DROP FUNCTION IF EXISTS public.generate_wm_code(text);

CREATE OR REPLACE FUNCTION public.generate_wm_code(p_prefix TEXT DEFAULT 'USR')
RETURNS TEXT AS $$
DECLARE
  clean_prefix TEXT := 'USR';
  num_part TEXT;
BEGIN
  -- Extract only letters and numbers, capitalize, and take first 3 chars
  clean_prefix := UPPER(SUBSTRING(REGEXP_REPLACE(COALESCE(p_prefix, 'USR'), '[^a-zA-Z0-9]', '', 'g') FROM 1 FOR 3));
  
  -- If prefix is shorter than 3 characters, pad with 'X'
  IF LENGTH(clean_prefix) < 3 THEN
    clean_prefix := clean_prefix || REPEAT('X', 3 - LENGTH(clean_prefix));
  END IF;
  
  -- Get next sequence number and pad to 3 digits
  num_part := LPAD(nextval('public.wm_code_seq')::TEXT, 3, '0');
  RETURN 'WM-' || clean_prefix || '-' || num_part;
END;
$$ LANGUAGE plpgsql;

-- -------------------------------------------------------------------------
-- PART 3: UPGRADE AUTOMATIC TRIGGERS (NEW SIGNUPS & IDENTITY SYNC)
-- -------------------------------------------------------------------------

-- A. Automatic New User Handler (Trigger on auth.users INSERT)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  first_name_input TEXT;
  email_username TEXT;
  chosen_prefix TEXT;
  final_username TEXT;
BEGIN
  first_name_input := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  email_username := split_part(NEW.email, '@', 1);
  
  IF first_name_input <> '' AND LOWER(first_name_input) <> 'user' THEN
    chosen_prefix := first_name_input;
  ELSE
    chosen_prefix := email_username;
  END IF;

  -- Format chosen_prefix for username fallback
  final_username := chosen_prefix;
  
  -- Bulletproof: If this username is already taken, append a 4-character unique suffix
  IF EXISTS (SELECT 1 FROM public.profiles WHERE first_name = final_username) THEN
    final_username := final_username || SUBSTRING(gen_random_uuid()::text FROM 1 FOR 4);
  END IF;

  INSERT INTO public.profiles (user_id, first_name, wm_code, secure_slug, invited_by)
  VALUES (
    NEW.id, 
    final_username,
    public.generate_wm_code(chosen_prefix),
    public.generate_secure_slug(),
    (NEW.raw_user_meta_data->>'invited_by')::UUID
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- B. Smart Sync Trigger Function for first_name/identity Updates
CREATE OR REPLACE FUNCTION public.sync_wm_code_prefix()
RETURNS TRIGGER AS $$
DECLARE
  v_email TEXT;
  v_username TEXT;
  v_first_name_from_identity TEXT;
  v_prefix TEXT;
  v_seq_part TEXT;
  v_old_prefix TEXT;
BEGIN
  -- 1. STABILITY RULE: If the existing code is already custom, keep it!
  IF OLD.wm_code IS NOT NULL AND OLD.wm_code LIKE 'WM-%-%' THEN
    v_old_prefix := split_part(OLD.wm_code, '-', 2);
    
    -- If the old prefix is a custom 3-letter alphabetic prefix (not USR and not a number), keep it!
    IF v_old_prefix <> 'USR' AND v_old_prefix ~ '^[A-Za-z]{3}$' THEN
      NEW.wm_code := OLD.wm_code;
      RETURN NEW;
    END IF;
  END IF;

  -- 2. Extract first_name from active or first identity in JSONB persona_data
  BEGIN
    SELECT 
      COALESCE(
        (
          SELECT elem->>'first_name'
          FROM jsonb_array_elements(COALESCE(NEW.persona_data->'identities', '[]'::jsonb)) elem
          WHERE (elem->>'active')::boolean = true
          LIMIT 1
        ),
        (
          SELECT elem->>'first_name'
          FROM jsonb_array_elements(COALESCE(NEW.persona_data->'identities', '[]'::jsonb)) elem
          LIMIT 1
        ),
        ''
      ) INTO v_first_name_from_identity;
  EXCEPTION WHEN OTHERS THEN
    v_first_name_from_identity := '';
  END;

  -- Clean the extracted name
  v_first_name_from_identity := REGEXP_REPLACE(COALESCE(v_first_name_from_identity, ''), '[^a-zA-Z0-9]', '', 'g');

  -- 3. Choose prefix
  IF v_first_name_from_identity <> '' AND LOWER(v_first_name_from_identity) <> 'user' THEN
    v_prefix := v_first_name_from_identity;
  ELSE
    -- Fallback to the profiles.first_name column (username)
    v_prefix := COALESCE(NEW.first_name, '');
    v_prefix := REGEXP_REPLACE(v_prefix, '[^a-zA-Z0-9]', '', 'g');
    
    -- Fallback to email username if still empty/default
    IF v_prefix = '' OR LOWER(v_prefix) = 'user' THEN
      SELECT email INTO v_email FROM auth.users WHERE id = NEW.user_id;
      v_username := COALESCE(split_part(v_email, '@', 1), 'USR');
      v_prefix := REGEXP_REPLACE(v_username, '[^a-zA-Z0-9]', '', 'g');
    END IF;
  END IF;

  -- 4. Format to exactly 3 uppercase letters/digits
  v_prefix := UPPER(SUBSTRING(v_prefix FROM 1 FOR 3));
  IF LENGTH(v_prefix) < 3 THEN
    v_prefix := v_prefix || REPEAT('X', 3 - LENGTH(v_prefix));
  END IF;

  -- 5. Preserve the same sequence number suffix!
  IF OLD.wm_code IS NOT NULL AND OLD.wm_code LIKE 'WM-%-%' THEN
    v_seq_part := split_part(OLD.wm_code, '-', 3);
  ELSE
    v_seq_part := LPAD(nextval('public.wm_code_seq')::TEXT, 3, '0');
  END IF;

  NEW.wm_code := 'WM-' || v_prefix || '-' || v_seq_part;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-enable the sync trigger on profiles
DROP TRIGGER IF EXISTS trg_sync_wm_code_prefix ON public.profiles;
CREATE TRIGGER trg_sync_wm_code_prefix
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_wm_code_prefix();

-- -------------------------------------------------------------------------
-- PART 4: BACKPORT / UPDATE EXISTING USERS WHO HAVE THE "922" OR "USR" PREFIX
-- -------------------------------------------------------------------------
-- This runs the smart trigger above for all existing profiles to resolve 
-- the numerical "922" or fallback "USR" prefixes using their custom first_names.
UPDATE public.profiles SET first_name = first_name;

-- =========================================================================
-- SUCCESS! Migration Complete.
-- =========================================================================

-- ==============================================================
-- KnoWMi Schema Migration: Intelligent Alphanumeric WM-Code Prefix
-- ==============================================================
-- Run this script in your Supabase SQL Editor to instantly update
-- the WM-Code logic to use the first 3 letters of a user's first name
-- with their email username prefix as a signup fallback.
-- It keeps the exact same sequence number so no IDs are corrupted!
-- ==============================================================

-- 1. Upgrade the code generator function
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

-- 2. Upgrade the automatic new user handler trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  first_name_input TEXT;
  email_username TEXT;
  chosen_prefix TEXT;
BEGIN
  first_name_input := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  email_username := split_part(NEW.email, '@', 1);
  
  IF first_name_input <> '' AND LOWER(first_name_input) <> 'user' THEN
    chosen_prefix := first_name_input;
  ELSE
    chosen_prefix := email_username;
  END IF;

  INSERT INTO public.profiles (user_id, first_name, wm_code, secure_slug, invited_by)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    public.generate_wm_code(chosen_prefix),
    public.generate_secure_slug(),
    (NEW.raw_user_meta_data->>'invited_by')::UUID
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create the smart sync trigger function for first_name updates
CREATE OR REPLACE FUNCTION public.sync_wm_code_prefix()
RETURNS TRIGGER AS $$
DECLARE
  v_email TEXT;
  v_username TEXT;
  v_first_name TEXT;
  v_prefix TEXT;
  v_seq_part TEXT;
BEGIN
  -- Get the email from auth.users
  SELECT email INTO v_email FROM auth.users WHERE id = NEW.user_id;
  v_username := COALESCE(split_part(v_email, '@', 1), 'USR');
  v_username := REGEXP_REPLACE(v_username, '[^a-zA-Z0-9]', '', 'g');
  
  v_first_name := COALESCE(NEW.first_name, '');
  v_first_name := REGEXP_REPLACE(v_first_name, '[^a-zA-Z0-9]', '', 'g');

  -- Choose prefix: Use first_name if filled and not default 'User' or empty, else email prefix
  IF v_first_name <> '' AND LOWER(v_first_name) <> 'user' THEN
    v_prefix := v_first_name;
  ELSE
    v_prefix := v_username;
  END IF;

  -- Format to exactly 3 uppercase letters/digits
  v_prefix := UPPER(SUBSTRING(v_prefix FROM 1 FOR 3));
  IF LENGTH(v_prefix) < 3 THEN
    v_prefix := v_prefix || REPEAT('X', 3 - LENGTH(v_prefix));
  END IF;

  -- Keep existing sequential number suffix if present, otherwise generate next
  IF OLD.wm_code IS NOT NULL AND OLD.wm_code LIKE 'WM-%-%' THEN
    v_seq_part := split_part(OLD.wm_code, '-', 3);
  ELSE
    v_seq_part := LPAD(nextval('public.wm_code_seq')::TEXT, 3, '0');
  END IF;

  NEW.wm_code := 'WM-' || v_prefix || '-' || v_seq_part;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Enable the sync trigger on profiles
DROP TRIGGER IF EXISTS trg_sync_wm_code_prefix ON public.profiles;
CREATE TRIGGER trg_sync_wm_code_prefix
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_wm_code_prefix();

-- 5. OPTIONAL: Update all existing users who have placeholder "User" or numerical random codes in their profile
-- (uncomment the line below in Supabase SQL editor if you want to backport the clean letters to existing members!)
-- UPDATE public.profiles SET first_name = first_name WHERE first_name <> 'User';

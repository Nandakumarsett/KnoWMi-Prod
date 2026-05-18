-- ================================================
-- KnoWMi Database Schema (WM-CODE Version)
-- ================================================

-- 1. Global sequence for sequential WM numbers
CREATE SEQUENCE IF NOT EXISTS public.wm_code_seq START 1;

-- 2. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT NOT NULL UNIQUE, -- Enforced unique "User Name"
  last_name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  status TEXT DEFAULT 'free' CHECK (status IN ('free', 'paid')),
  plan_type TEXT DEFAULT NULL,
  amount_paid INTEGER DEFAULT 0,
  role TEXT DEFAULT 'customer' CHECK (role IN ('owner', 'ambassador', 'collaborator', 'customer')),
  wm_code TEXT UNIQUE, -- Renamed from pt_code
  invited_by UUID REFERENCES public.profiles(id),
  admin_note TEXT DEFAULT '',
  -- Persona Fields
  bio TEXT DEFAULT '',
  tagline TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  whatsapp_number TEXT DEFAULT '',
  website_url TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  secure_slug TEXT UNIQUE, -- Random string for obfuscated URLs (e.g. knowme.in/p/djsfhdnke)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. WM Code Generation Function
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

-- 4. Secure Slug Generation Function (for obfuscated URLs)
CREATE OR REPLACE FUNCTION public.generate_secure_slug()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := '';
  i INTEGER := 0;
BEGIN
  FOR i IN 1..10 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 5. Automatically create a profile for every new user
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

-- 6. Trigger to automatically keep the WM Code prefix updated when first_name is updated
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

DROP TRIGGER IF EXISTS trg_sync_wm_code_prefix ON public.profiles;
CREATE TRIGGER trg_sync_wm_code_prefix
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_wm_code_prefix();

-- (Policies and other functions remain the same, just ensure they use public.profiles)
-- ... [Rest of the file follows same logic but using wm_code column] ...

-- 2. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies

-- Users can view and manage their own full profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Staff/Admin policies (Full Access)
DROP POLICY IF EXISTS "Staff can view all profiles" ON public.profiles;
CREATE POLICY "Staff can view all profiles" ON public.profiles FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role IN ('owner', 'ambassador', 'collaborator')
));

DROP POLICY IF EXISTS "Owners can update any profile" ON public.profiles;
CREATE POLICY "Owners can update any profile" ON public.profiles FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role = 'owner'
));

-- 4. Create a Public View (Sanitized Data)
-- This view allows anyone to see public persona details without leaking sensitive info like phone/notes/paid amount
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles AS
SELECT 
    id, first_name, last_name, bio, tagline, 
    instagram_url, linkedin_url, whatsapp_number, website_url, 
    avatar_url, secure_slug, wm_code, status, role, is_verified, 
    persona_data, created_at
FROM public.profiles;

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- 4. Utility Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Removed duplicate handle_new_user to avoid confusion

-- 6. Admin RPC Functions
CREATE OR REPLACE FUNCTION get_all_profiles()
RETURNS SETOF public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Security Check: Only staff can call this
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('owner', 'ambassador', 'collaborator')
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY SELECT * FROM public.profiles ORDER BY created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION update_profile_admin(p_profile_id UUID, p_status TEXT, p_amount INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Security Check: Only Owner can modify financial status
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.profiles 
  SET status = p_status, amount_paid = p_amount, updated_at = now()
  WHERE id = p_profile_id;
END;
$$;

CREATE OR REPLACE FUNCTION update_profile_admin_role(p_profile_id UUID, p_new_role TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Security Check: Only Owner can change roles
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.profiles 
  SET role = p_new_role, updated_at = now()
  WHERE id = p_profile_id;
END;
$$;

CREATE OR REPLACE FUNCTION insert_profile_admin(p_user_id UUID, p_first_name TEXT, p_role TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, role, referral_code)
  VALUES (p_user_id, p_first_name, p_role, UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 6)));
END;
$$;

-- 7. Scans Table (For Customer Analytics)
CREATE TABLE IF NOT EXISTS public.scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  scanned_at TIMESTAMPTZ DEFAULT now(),
  city TEXT DEFAULT 'Unknown',
  device TEXT DEFAULT 'Unknown',
  browser TEXT DEFAULT 'Unknown',
  os TEXT DEFAULT 'Unknown',
  ip_address TEXT -- Optional, for debugging
);

-- Enable RLS on scans
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view scans for their own profile
DROP POLICY IF EXISTS "Users can view own scans" ON public.scans;
CREATE POLICY "Users can view own scans"
  ON public.scans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = scans.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- Policy: Anyone can insert a scan (to allow capturing anonymous QR scans)
DROP POLICY IF EXISTS "Anyone can insert scans" ON public.scans;
CREATE POLICY "Anyone can insert scans"
  ON public.scans FOR INSERT
  WITH CHECK (true);

-- 8. Admin RPC: Get aggregated scan stats for a user
CREATE OR REPLACE FUNCTION get_user_stats(p_profile_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_scans', COUNT(*),
    'unique_days', COUNT(DISTINCT DATE(scanned_at)),
    'top_city', (SELECT city FROM public.scans WHERE profile_id = p_profile_id GROUP BY city ORDER BY COUNT(*) DESC LIMIT 1),
    'last_scan', MAX(scanned_at)
  ) INTO result
  FROM public.scans
  WHERE profile_id = p_profile_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- 8. Merch Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE,
  item_name TEXT NOT NULL,
  item_type TEXT DEFAULT 'tshirt',
  sku TEXT,
  size TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  shipping_address TEXT,
  delivery_city TEXT,
  tracking_info TEXT,
  estimated_delivery TEXT,
  model_image_url TEXT,
  cancellation_reason TEXT,
  qr_code_link TEXT, -- Link to the profile that was on the shirt
  order_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS public.order_num_seq START 1001;

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own orders." ON public.orders;
CREATE POLICY "Users can view their own orders." 
  ON public.orders FOR SELECT 
  USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = profile_id));

DROP POLICY IF EXISTS "Owners can manage all orders." ON public.orders;
CREATE POLICY "Owners can manage all orders." 
  ON public.orders FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'owner'));

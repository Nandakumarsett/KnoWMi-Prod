-- =========================================================================
-- KNOWNMI SCHEMA MIGRATION: CRITICAL SECURITY FIXES & PRIVACY PATCHES
-- =========================================================================

-- 1. Secure insert_profile_admin RPC Function
-- Prevents unauthorized profile inserts and privilege escalation
CREATE OR REPLACE FUNCTION public.insert_profile_admin(p_user_id UUID, p_first_name TEXT, p_role TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Security Check: Only verified owner admins can create/insert team profiles
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  INSERT INTO public.profiles (user_id, first_name, role, referral_code)
  VALUES (p_user_id, p_first_name, p_role, UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 6)));
END;
$$;

-- 2. Secure get_user_stats RPC Function
-- Restricts access to scan metrics (views, last scan, top location) to only the profile owner or staff
CREATE OR REPLACE FUNCTION public.get_user_stats(p_profile_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Security Check: Only the profile owner or a staff member can view metrics
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = p_profile_id AND (user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role IN ('owner', 'ambassador', 'collaborator')
    ))
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

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
$$;

-- 3. Revoke public execution of increment_daily_views
-- Restricts execution to database triggers and backend service_role only
REVOKE EXECUTE ON FUNCTION public.increment_daily_views(UUID, DATE, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_daily_views(UUID, DATE, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN) TO service_role;

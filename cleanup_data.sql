-- ========================================================
-- KnoWMi Database Cleanup & Owner Assignment Script
-- ========================================================
-- INSTRUCTIONS:
-- 1. Open your Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Go to the SQL Editor on the left sidebar
-- 3. Click "New query"
-- 4. Paste this entire script and click "Run"
-- ========================================================

DO $$
DECLARE
  v_owner_user_id UUID;
  v_owner_profile_id UUID;
  v_target_email TEXT := 'nandakumarsettivanyam@gmail.com';
BEGIN
  -- 1. Find the owner's user ID from auth.users
  SELECT id INTO v_owner_user_id 
  FROM auth.users 
  WHERE email = v_target_email
  LIMIT 1;
  
  IF v_owner_user_id IS NULL THEN
    RAISE EXCEPTION 'Owner email (%) not found in auth.users. Please ensure the user has signed up.', v_target_email;
  END IF;

  -- 2. Find the owner's profile ID
  SELECT id INTO v_owner_profile_id 
  FROM public.profiles 
  WHERE user_id = v_owner_user_id
  LIMIT 1;

  IF v_owner_profile_id IS NULL THEN
    RAISE EXCEPTION 'Profile for owner email not found in public.profiles. Ensure they have completed signup.';
  END IF;

  -- 3. Delete all analytics events where OTHER profiles are the TARGET
  RAISE NOTICE 'Deleting analytics data targeted at other profiles...';
  DELETE FROM public.profile_view_events WHERE profile_id != v_owner_profile_id;
  DELETE FROM public.profile_view_daily WHERE profile_id != v_owner_profile_id;
  DELETE FROM public.qr_scan_events WHERE profile_id != v_owner_profile_id;
  DELETE FROM public.scans WHERE profile_id != v_owner_profile_id;
  DELETE FROM public.profile_visitor_bloom WHERE profile_id != v_owner_profile_id;
  DELETE FROM public.orders WHERE profile_id != v_owner_profile_id;

  -- 3.5 FIX: Nullify foreign keys on remaining records (Owner's records) 
  -- that were made by test profiles (e.g. a test profile viewed the Owner's profile)
  RAISE NOTICE 'Removing references to test profiles to prevent foreign key errors...';
  
  -- If a test profile viewed the owner, clear their viewer_id so we can delete the test profile
  UPDATE public.profile_view_events 
  SET viewer_id = NULL 
  WHERE viewer_id != v_owner_profile_id;

  -- If the owner was invited by a test profile, clear it
  UPDATE public.profiles 
  SET invited_by = NULL 
  WHERE invited_by != v_owner_profile_id;

  -- 4. Delete all OTHER profiles safely now
  RAISE NOTICE 'Deleting all other profiles...';
  DELETE FROM public.profiles WHERE id != v_owner_profile_id;

  -- 5. Update the owner profile to be 001 and have the owner role
  RAISE NOTICE 'Updating owner profile to WM-NAN-001 and granting Owner role...';
  UPDATE public.profiles 
  SET 
    wm_code = 'WM-NAN-001',
    role = 'owner',
    status = 'paid'
  WHERE id = v_owner_profile_id;

  RAISE NOTICE '========================================================';
  RAISE NOTICE 'Cleanup completed successfully!';
  RAISE NOTICE 'Owner Profile ID: %', v_owner_profile_id;
  RAISE NOTICE 'Owner Navbar tag and Leaderboard status should now be active.';
  RAISE NOTICE '========================================================';
END $$;

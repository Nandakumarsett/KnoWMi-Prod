CREATE OR REPLACE FUNCTION public.claim_factory_tee(p_factory_id TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_profile_id UUID;
BEGIN
  -- Get the current user's actual profile ID
  SELECT id INTO v_user_profile_id FROM public.profiles WHERE user_id = auth.uid();
  
  IF v_user_profile_id IS NULL THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  -- Ensure the factory tee exists and is unclaimed (user_id IS NULL)
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_factory_id::UUID AND user_id IS NULL) THEN
    RAISE EXCEPTION 'Invalid or already claimed tee';
  END IF;

  -- Link the physical product to the user's actual digital identity
  -- By setting their secure_slug to the factory QR code ID, the QR now points to them!
  UPDATE public.profiles 
  SET secure_slug = p_factory_id
  WHERE id = v_user_profile_id;

  -- Delete the blank factory profile row (cleanup)
  DELETE FROM public.profiles WHERE id = p_factory_id::UUID;
END;
$$;

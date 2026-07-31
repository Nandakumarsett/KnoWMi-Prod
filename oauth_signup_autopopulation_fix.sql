-- Update handle_new_user trigger to handle Google OAuth metadata and automatically generate unique first_name handles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  first_name_input TEXT;
  email_username TEXT;
  chosen_prefix TEXT;
  base_username TEXT;
  final_username TEXT;
  counter INTEGER := 0;
  username_exists BOOLEAN;
BEGIN
  -- 1. Try to get first name input from frontend signup metadata
  first_name_input := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  
  -- 2. If it's not provided (e.g., OAuth/Google), try to extract from full name or name in Google metadata
  IF first_name_input = '' THEN
    first_name_input := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '');
  END IF;

  -- 3. Extract prefix from email if still empty
  email_username := split_part(NEW.email, '@', 1);

  IF first_name_input <> '' AND LOWER(first_name_input) <> 'user' THEN
    base_username := first_name_input;
  ELSE
    base_username := email_username;
  END IF;

  -- 4. Clean the username: convert to lowercase, keep only letters, numbers, hyphens, and underscores
  base_username := LOWER(REGEXP_REPLACE(base_username, '[^a-zA-Z0-9_-]', '', 'g'));
  
  -- If cleaning resulted in empty string, fallback to email prefix
  IF base_username = '' THEN
    base_username := LOWER(REGEXP_REPLACE(email_username, '[^a-zA-Z0-9_-]', '', 'g'));
  END IF;
  
  -- If still empty, fallback to 'user'
  IF base_username = '' THEN
    base_username := 'user';
  END IF;

  final_username := base_username;

  -- 5. Loop to ensure uniqueness of final_username
  LOOP
    SELECT EXISTS (
      SELECT 1 FROM public.profiles WHERE LOWER(first_name) = LOWER(final_username)
    ) INTO username_exists;
    
    IF NOT username_exists THEN
      EXIT;
    END IF;
    
    counter := counter + 1;
    final_username := base_username || counter::TEXT;
  END LOOP;

  -- Set chosen prefix for pt_code/wm_code generation
  chosen_prefix := final_username;

  INSERT INTO public.profiles (
    user_id, 
    first_name, 
    wm_code, 
    secure_slug, 
    invited_by,
    terms_accepted,
    terms_accepted_at
  )
  VALUES (
    NEW.id, 
    final_username,
    public.generate_wm_code(chosen_prefix),
    public.generate_secure_slug(),
    (NEW.raw_user_meta_data->>'invited_by')::UUID,
    COALESCE((NEW.raw_user_meta_data->>'terms_accepted')::BOOLEAN, false),
    CASE WHEN (NEW.raw_user_meta_data->>'terms_accepted')::BOOLEAN = true THEN now() ELSE null END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

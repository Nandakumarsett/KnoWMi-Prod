-- Add terms acceptance fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ DEFAULT null;

-- Update trigger function to handle terms acceptance from user metadata
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
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    public.generate_wm_code(chosen_prefix),
    public.generate_secure_slug(),
    (NEW.raw_user_meta_data->>'invited_by')::UUID,
    COALESCE((NEW.raw_user_meta_data->>'terms_accepted')::BOOLEAN, false),
    CASE WHEN (NEW.raw_user_meta_data->>'terms_accepted')::BOOLEAN = true THEN now() ELSE null END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

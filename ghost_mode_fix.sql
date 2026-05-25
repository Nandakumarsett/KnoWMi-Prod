-- 1. Add the ghost_mode column to the underlying profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ghost_mode BOOLEAN DEFAULT false;

-- 2. Recreate the public_profiles view to include the new ghost_mode column
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles AS
SELECT 
    id, user_id, first_name, last_name, bio, tagline, 
    instagram_url, linkedin_url, whatsapp_number, website_url, 
    avatar_url, secure_slug, wm_code, status, role, is_verified, 
    persona_data, created_at, ghost_mode
FROM public.profiles;

-- 3. Grant select permissions back to the view
GRANT SELECT ON public.public_profiles TO anon, authenticated;

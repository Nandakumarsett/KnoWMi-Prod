-- =========================================================================
-- KNOWNMI SCHEMA MIGRATION: ADD USER_ID TO PUBLIC_PROFILES VIEW
-- =========================================================================
-- Run this in your Supabase SQL Editor (https://supabase.com)
-- This drops and recreates the public_profiles view to include the user_id column.
-- This allows ScanHandler to trigger scan alert push notifications successfully.
-- =========================================================================

DROP VIEW IF EXISTS public.public_profiles CASCADE;

CREATE VIEW public.public_profiles AS
SELECT 
    id, 
    user_id, 
    first_name, 
    last_name, 
    bio, 
    tagline, 
    instagram_url, 
    linkedin_url, 
    whatsapp_number, 
    website_url, 
    avatar_url, 
    secure_slug, 
    wm_code, 
    status, 
    role, 
    is_verified, 
    persona_data, 
    created_at
FROM public.profiles;

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- =========================================================================
-- SUCCESS! Migration Complete. Please scan your Identity Pass to test.
-- =========================================================================

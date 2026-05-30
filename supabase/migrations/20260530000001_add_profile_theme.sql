-- Add profile_theme to profiles table to support visual themes
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_theme TEXT DEFAULT 'default';

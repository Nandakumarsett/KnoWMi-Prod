-- Allow user_id to be null so we can generate unclaimed profiles at the factory
ALTER TABLE public.profiles ALTER COLUMN user_id DROP NOT NULL;

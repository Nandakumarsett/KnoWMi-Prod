-- Allow owners to generate/insert new profiles (for the Factory Bulk Generator)
DROP POLICY IF EXISTS "Owners can insert any profile" ON public.profiles;

CREATE POLICY "Owners can insert any profile" ON public.profiles 
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

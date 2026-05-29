-- =======================================================
-- KnoWMi Deletion Management & Secure User Cleanup Setup
-- =======================================================

-- 1. Create a secure owner-authorized user deletion RPC function
CREATE OR REPLACE FUNCTION public.delete_user_admin(p_user_id UUID, p_request_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Security Check: Only Owner can delete users
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- 1. Update status to completed in deletion_requests
  UPDATE public.deletion_requests 
  SET status = 'completed', processed_at = now() 
  WHERE id = p_request_id;

  -- 2. Delete the user from auth.users (cascade deletes public.profiles)
  IF p_user_id IS NOT NULL THEN
    DELETE FROM auth.users WHERE id = p_user_id;
  END IF;
END;
$$;

-- 2. RLS Policies for deletion_requests Table
ALTER TABLE public.deletion_requests ENABLE ROW LEVEL SECURITY;

-- Allow users to update/cancel their own deletion request
DROP POLICY IF EXISTS "Users update own deletion request" ON public.deletion_requests;
CREATE POLICY "Users update own deletion request"
  ON public.deletion_requests FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow owner admins to manage/read all deletion requests
DROP POLICY IF EXISTS "Owners manage all deletion requests" ON public.deletion_requests;
CREATE POLICY "Owners manage all deletion requests"
  ON public.deletion_requests FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'owner'
  ));

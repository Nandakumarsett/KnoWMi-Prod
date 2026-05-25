CREATE TABLE IF NOT EXISTS public.network_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  visitor_name TEXT NOT NULL,
  visitor_email TEXT NOT NULL,
  visitor_social TEXT,
  visitor_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.network_connections ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (so public visitors can leave their card)
DROP POLICY IF EXISTS "Anyone can insert network connections" ON public.network_connections;
CREATE POLICY "Anyone can insert network connections" 
  ON public.network_connections FOR INSERT 
  WITH CHECK (true);

-- Allow profile owners to view their own connections
DROP POLICY IF EXISTS "Users can view their own network connections" ON public.network_connections;
CREATE POLICY "Users can view their own network connections" 
  ON public.network_connections FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = network_connections.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

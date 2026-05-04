-- ================================================
-- Link Click Tracking Table
-- ================================================

CREATE TABLE IF NOT EXISTS public.link_click_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  link_type TEXT NOT NULL, -- e.g., 'instagram', 'linkedin', 'whatsapp'
  link_url TEXT,
  scanner_fp TEXT, -- To track unique individuals
  clicked_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.link_click_events ENABLE ROW LEVEL SECURITY;

-- Owner can view their own link click events
CREATE POLICY "owner reads own link click events" ON public.link_click_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = link_click_events.profile_id 
      AND profiles.user_id = auth.uid()
    )
  );

-- Anyone can insert a link click event
CREATE POLICY "anyone can insert link click events" ON public.link_click_events
  FOR INSERT WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS link_click_profile_idx ON public.link_click_events(profile_id);
CREATE INDEX IF NOT EXISTS link_click_fp_idx ON public.link_click_events(scanner_fp);

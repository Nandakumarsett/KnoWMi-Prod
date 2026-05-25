-- Migration: Create link_click_events table

CREATE TABLE IF NOT EXISTS public.link_click_events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    platform text NOT NULL,
    url text NOT NULL,
    visitor_fp text,
    viewer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    clicked_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster analytics querying
CREATE INDEX IF NOT EXISTS link_click_events_profile_id_idx ON public.link_click_events(profile_id);

-- Enable RLS
ALTER TABLE public.link_click_events ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert a link click event
CREATE POLICY "Anyone can insert link clicks"
    ON public.link_click_events
    FOR INSERT
    WITH CHECK (true);

-- Policy: Profile owners can view their own link clicks
CREATE POLICY "Users can view their own link clicks"
    ON public.link_click_events
    FOR SELECT
    USING (auth.uid() = profile_id);

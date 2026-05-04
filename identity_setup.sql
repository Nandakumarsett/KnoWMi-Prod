-- ================================================
-- KnoWMi Identity Setup - Schema and Completion Score
-- ================================================

-- 1. Create profile_persona_data table
CREATE TABLE IF NOT EXISTS public.profile_persona_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  persona TEXT NOT NULL,  -- 'developer' | 'student' | 'creator' | 'gamer' | 'fitness' | 'influencer'
  data JSONB NOT NULL DEFAULT '{}',  -- all persona-specific fields stored here
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id, persona)
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profile_persona_data ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
DROP POLICY IF EXISTS "owner full access" ON public.profile_persona_data;
CREATE POLICY "owner full access" ON public.profile_persona_data
  USING (profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "public read" ON public.profile_persona_data;
CREATE POLICY "public read" ON public.profile_persona_data
  FOR SELECT USING (true);

-- 4. Profile completion score computation
CREATE OR REPLACE FUNCTION public.profile_completion_score(p_profile_id UUID, p_persona TEXT)
RETURNS INT LANGUAGE plpgsql STABLE AS $$
DECLARE
  v_data JSONB;
  v_score INT := 0;
BEGIN
  SELECT data INTO v_data FROM public.profile_persona_data
  WHERE profile_id = p_profile_id AND persona = p_persona;
  IF v_data IS NULL THEN RETURN 0; END IF;
  
  -- The application layer computes higher precision weight maps,
  -- this handles basic presence as fallback.
  IF v_data ? 'tagline' THEN v_score := v_score + 10; END IF;
  IF v_data ? 'about' OR v_data ? 'university' OR v_data ? 'gamer_tag' THEN v_score := v_score + 15; END IF;
  RETURN v_score;
END;
$$;

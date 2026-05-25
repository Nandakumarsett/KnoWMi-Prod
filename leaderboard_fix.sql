-- ==============================================================================
-- KnoWMi LEADERBOARD VIEWS FIX
-- Run this script in your Supabase SQL Editor to restore real-time Leaderboard data
-- ==============================================================================

-- 1. Create a dynamic view for Profile Scores
DROP VIEW IF EXISTS public.public_leaderboard CASCADE;
DROP VIEW IF EXISTS public.profile_scores CASCADE;

CREATE VIEW public.profile_scores AS
SELECT 
  p.id as profile_id,
  p.first_name as username,
  -- Score Algorithm: Ranked strictly by Total Views
  (
    SELECT COUNT(*) FROM public.profile_view_events WHERE profile_id = p.id
  ) as knowmi_score,
  p.updated_at
FROM public.profiles p;

-- 2. Create the dynamic view for the Leaderboard
CREATE VIEW public.public_leaderboard AS
WITH ranked_profiles AS (
  SELECT 
    ps.profile_id as id,
    ps.knowmi_score,
    ps.username,
    ROW_NUMBER() OVER (ORDER BY ps.knowmi_score DESC, p.updated_at DESC) as rank,
    (PERCENT_RANK() OVER (ORDER BY ps.knowmi_score DESC, p.updated_at DESC)) * 100 as percentile,
    0 as rank_delta, -- Future: implement historical rank delta tracking
    COALESCE(p.first_name, p.user_id::text) as display_name,
    p.avatar_url,
    p.bio,
    p.wm_code,
    p.secure_slug,
    -- Extract category from JSON, fallback to 'Professional'
    COALESCE(p.persona_data->>'category', 'Professional') as profile_category,
    p.updated_at
  FROM public.profile_scores ps
  JOIN public.profiles p ON p.id = ps.profile_id
)
SELECT 
  *,
  CASE 
    WHEN rank = 1 THEN 'top1'
    WHEN percentile <= 1 THEN 'top1pct'
    WHEN percentile <= 10 THEN 'top10pct'
    WHEN rank <= 100 THEN 'top100'
    ELSE null
  END as badge
FROM ranked_profiles;

-- 3. Grant Permissions to allow the frontend to read these views without RLS blocking
GRANT SELECT ON public.profile_scores TO anon, authenticated;
GRANT SELECT ON public.public_leaderboard TO anon, authenticated;

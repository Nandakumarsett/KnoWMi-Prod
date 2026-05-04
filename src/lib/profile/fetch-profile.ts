import { supabase } from '../supabase'
import { ProfileData, PersonaType } from '../../types/profile'

export async function fetchProfile(slug: string): Promise<ProfileData | null> {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)
  
  let profile: any = null

  // 1. Try fetching from profiles first to get the most up-to-date data
  let query = supabase.from('profiles').select('*')
  if (isUUID) {
    query = query.eq('id', slug)
  } else {
    query = query.eq('secure_slug', slug)
  }

  const { data: pData, error: pError } = await query.maybeSingle()
  if (pData && !pError) {
    profile = pData
  } else {
    // 2. Fallback to public_profiles
    let fallbackQuery = supabase.from('public_profiles').select('*')
    if (isUUID) {
      fallbackQuery = fallbackQuery.eq('id', slug)
    } else {
      fallbackQuery = fallbackQuery.eq('secure_slug', slug)
    }
    const { data: fallbackData } = await fallbackQuery.maybeSingle()
    if (fallbackData) {
      profile = fallbackData
    }
  }

  if (!profile) {
    console.error('Error fetching profile')
    return null
  }

  // Map database fields to ProfileData interface
  // Handling both legacy and new column names
  const social_links = [
    { platform: 'instagram', url: profile.instagram || profile.instagram_url },
    { platform: 'linkedin', url: profile.linkedin || profile.linkedin_url },
    { platform: 'github', url: profile.github || profile.github_url },
    { platform: 'twitter', url: profile.twitter || profile.twitter_url },
    { platform: 'youtube', url: profile.youtube || profile.youtube_url },
    { platform: 'website', url: profile.website || profile.website_url },
    { platform: 'whatsapp', url: profile.whatsapp || profile.whatsapp_number }
  ].filter(link => link.url)

  return {
    id: profile.id,
    username: profile.secure_slug || profile.first_name?.toLowerCase(),
    display_name: `${profile.first_name} ${profile.last_name || ''}`.trim(),
    first_name: profile.first_name,
    last_name: profile.last_name,
    avatar_url: profile.avatar_url,
    member_id: String(profile.wm_code || profile.member_id || '').replace('PT-', 'WM-') || `WM-${profile.first_name?.substring(0,3).toUpperCase()}-001`,
    persona: (profile.persona || profile.persona_type || 'developer').toLowerCase() as PersonaType,
    mood: profile.mood || 'Expressive & Curious',
    bio: profile.bio,
    pulse: profile.pulse_score || 95,
    tier: profile.tier || 'Elite',
    is_verified: profile.is_verified || true,
    joined_at: profile.created_at,
    social_links,
    persona_data: (() => {
      let pData = profile.persona_data || {}
      if (pData.identities && Array.isArray(pData.identities)) {
        const active = pData.identities.find((i: any) => i.active) || pData.identities[0]
        if (active) {
          return { ...active.data, ...pData, type: active.persona_type }
        }
      } else if (pData[profile.persona || profile.persona_type || 'developer']) {
        return { ...pData[profile.persona || profile.persona_type || 'developer'], ...pData }
      }
      return { ...pData, type: profile.persona_type || 'developer' }
    })()
  }
}

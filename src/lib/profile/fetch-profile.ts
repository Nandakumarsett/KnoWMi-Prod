import { supabase } from '../supabase'
import { ProfileData, PersonaType } from '../../types/profile'
import { computeCompletionScore } from '../identity/completion-score'

export async function fetchProfile(slug: string): Promise<ProfileData | null> {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)
  
  let profile: any = null

  // 1. Fetch full record (safe because we filter before returning)
  let query = supabase.from('profiles').select('*')
  if (isUUID) {
    query = query.eq('id', slug)
  } else {
    query = query.or(`secure_slug.eq."${slug}",first_name.eq."${slug}"`)
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
      fallbackQuery = fallbackQuery.or(`secure_slug.eq."${slug}",first_name.eq."${slug}"`)
    }
    const { data: fallbackData } = await fallbackQuery.maybeSingle()
    if (fallbackData) {
      profile = fallbackData
    }
  }

  if (!profile) {
    return null
  }

  // Define Whitelist of public fields to prevent leakage
  const PUBLIC_WHITELIST = [
    'id', 'user_id', 'secure_slug', 'first_name', 'last_name', 'avatar_url', 
    'persona', 'persona_type', 'persona_data', 'bio', 'mood', 'status', 
    'role', 'is_verified', 'created_at', 'wm_code', 'member_id',
    'instagram', 'instagram_url', 'linkedin', 'linkedin_url', 'github', 
    'github_url', 'twitter', 'twitter_url', 'youtube', 'youtube_url', 
    'website', 'website_url', 'whatsapp', 'whatsapp_number'
  ]

  // Create a clean public object
  const publicProfile: any = {}
  PUBLIC_WHITELIST.forEach(field => {
    if (profile[field] !== undefined) {
      publicProfile[field] = profile[field]
    }
  })

  // Normalize URLs logic...
  const normalizeUrl = (platform: string, value: string) => {
    if (!value) return '';
    let clean = value.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
    
    if (platform === 'website') return `https://${clean}`;
    if (platform === 'whatsapp') {
      const nums = clean.replace(/\D/g, '');
      return nums ? `https://wa.me/${nums}` : '';
    }

    if (clean.includes(platform + '.com') || clean.includes(platform + '.in')) {
      return `https://${clean}`;
    }

    clean = clean.replace(/^@/, '').replace(/^\//, '');
    
    switch (platform) {
      case 'instagram': return `https://www.instagram.com/${clean}`;
      case 'linkedin': return `https://www.linkedin.com/in/${clean}`;
      case 'github': return `https://github.com/${clean}`;
      case 'twitter': return `https://twitter.com/${clean}`;
      case 'youtube': return `https://www.youtube.com/@${clean}`;
      default: return `https://${clean}`;
    }
  };

  const social_links = [
    { platform: 'instagram', url: normalizeUrl('instagram', publicProfile.instagram || publicProfile.instagram_url) },
    { platform: 'linkedin', url: normalizeUrl('linkedin', publicProfile.linkedin || publicProfile.linkedin_url) },
    { platform: 'github', url: normalizeUrl('github', publicProfile.github || publicProfile.github_url) },
    { platform: 'twitter', url: normalizeUrl('twitter', publicProfile.twitter || publicProfile.twitter_url) },
    { platform: 'youtube', url: normalizeUrl('youtube', publicProfile.youtube || publicProfile.youtube_url) },
    { platform: 'website', url: normalizeUrl('website', publicProfile.website || publicProfile.website_url) },
    { platform: 'whatsapp', url: normalizeUrl('whatsapp', publicProfile.whatsapp || publicProfile.whatsapp_number) }
  ].filter(link => link.url)

  const fn = (publicProfile.first_name || '').trim()
  const ln = (publicProfile.last_name || '').trim()
  const firstNameIsSlug = fn.includes('_') || (fn === fn.toLowerCase() && !fn.includes(' ') && fn.length > 0)
  let builtDisplayName: string
  if (firstNameIsSlug && ln) {
    builtDisplayName = ln
  } else if (fn && ln) {
    builtDisplayName = `${fn} ${ln}`
  } else {
    builtDisplayName = fn || ln || publicProfile.secure_slug || 'KnoWMi User'
  }

  return {
    id: publicProfile.id,
    user_id: publicProfile.user_id || publicProfile.id,
    username: publicProfile.secure_slug || fn.toLowerCase(),
    display_name: builtDisplayName,
    first_name: fn,
    last_name: ln,
    avatar_url: publicProfile.avatar_url,
    member_id: String(publicProfile.wm_code || publicProfile.member_id || '').replace('PT-', 'WM-') || `WM-${fn.substring(0,3).toUpperCase()}-001`,
    persona: (publicProfile.persona || publicProfile.persona_type || 'developer').toLowerCase() as PersonaType,
    mood: publicProfile.mood || 'Expressive & Curious',
    bio: publicProfile.bio,
    pulse: (() => {
      const { score } = computeCompletionScore(
        (publicProfile.persona || publicProfile.persona_type || 'developer').toLowerCase(),
        publicProfile.persona_data || {}
      )
      return score || 20 
    })(),
    tier: publicProfile.status === 'paid' ? 'Creator' : (publicProfile.status === 'team' ? 'Team' : 'Starter'),
    is_verified: publicProfile.is_verified ?? (publicProfile.status === 'paid'),
    joined_at: publicProfile.created_at,
    social_links,
    persona_data: (() => {
      let pData = publicProfile.persona_data || {}
      if (pData.identities && Array.isArray(pData.identities)) {
        const active = pData.identities.find((i: any) => i.active) || pData.identities[0]
        if (active) {
          return { ...active.data, ...pData, type: active.persona_type }
        }
      } else if (pData[publicProfile.persona || publicProfile.persona_type || 'developer']) {
        return { ...pData[publicProfile.persona || publicProfile.persona_type || 'developer'], ...pData }
      }
      return { ...pData, type: publicProfile.persona_type || 'developer' }
    })()
  }
}

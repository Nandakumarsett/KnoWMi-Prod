import React from 'react'
import { ProfileData, CreatorData } from '../../../types/profile'
import { PulseBar } from '../shared/PulseBar'
import { VerifiedBadge } from '../shared/VerifiedBadge'
import { ProfileAvatar } from '../shared/ProfileAvatar'
import { getAssetUrl } from '../../../lib/supabase'
import { 
  LayoutGrid, Instagram, Youtube, Twitter, Github, 
  Share2, Sparkles, TrendingUp, Camera, Play, Film, MapPin, 
  Trophy, Mail, MessageCircle, Facebook, Linkedin, Globe, Activity, X, Lock, QrCode
} from 'lucide-react'
import { trackLinkClick } from '../../../lib/analytics/track'
import { useGatedLink } from '../../../hooks/useGatedLink'

const PLATFORM_ICONS: Record<string, any> = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  'twitter / x': Twitter,
  facebook: Facebook,
  linkedin: Linkedin,
  threads: Twitter,
  behance: LayoutGrid,
  dribbble: Globe,
  medium: Sparkles,
  github: Github,
  tiktok: Share2,
  twitch: Twitter
}

export function CreatorProfile({ profile, stats }: { profile: ProfileData, stats?: any }) {
  const [avatarError, setAvatarError] = React.useState(false);
  const data = (profile.persona_data || {}) as CreatorData
  const activeTheme = (profile.profile_theme || 'default').toLowerCase()
  const { isGated, handleGatedClick, GateModal } = useGatedLink()
  const [selectedWork, setSelectedWork] = React.useState<any>(null)
  const [showFomoModal, setShowFomoModal] = React.useState(false)
  
  const liveViews = stats?.totalViews || 0
  const topCity = stats?.topCities?.[0]?.city || 'Global'
  const isFreeProfile = profile.tier === 'Starter' || profile.tier === 'Free' || profile.status === 'free' || (!profile.status && (!profile.tier || profile.tier === 'Starter'))

  const getThumbnail = (work: any) => {
    if (work.external_url) {
      const url = work.external_url
      const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)
      if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`
      if (url.includes('vimeo.com')) {
        const id = url.split('/').pop()
        return `https://vumbnail.com/${id}.jpg`
      }
      return null
    }
    const mediaUrl = work.thumbnail_url || work.img || (work.type !== 'video' ? work.url : null)
    if (!mediaUrl) return null
    return getAssetUrl(mediaUrl)
  }

  const getEmbedUrl = (url: string) => {
    if (!url) return ''
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`
    if (url.includes('vimeo.com')) {
      const id = url.split('/').pop()
      return `https://player.vimeo.com/video/${id}?autoplay=1`
    }
    return url
  }

  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    return `https://${url}`
  }

  // PLATFORM BRAND STYLES MAP
  const brandStyles: Record<string, string> = {
    instagram: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white',
    youtube: 'bg-[#FF0000] text-white',
    twitter: 'bg-[#000000] text-white',
    'twitter / x': 'bg-[#000000] text-white',
    threads: 'bg-[#000000] text-white',
    facebook: 'bg-[#1877F2] text-white',
    linkedin: 'bg-[#0077B5] text-white',
    behance: 'bg-[#1769ff] text-white',
    dribbble: 'bg-[#ea4c89] text-white',
    medium: 'bg-[#000000] text-white',
    github: 'bg-[#181717] text-white'
  }

  const logoNames: Record<string, string> = {
    instagram: 'instagram',
    youtube: 'youtube',
    twitter: 'x',
    'twitter / x': 'x',
    threads: 'threads',
    facebook: 'facebook',
    linkedin: 'linkedin',
    behance: 'behance',
    dribbble: 'dribbble',
    medium: 'medium',
    github: 'github'
  }

  // ----------------------------------------------------
  // LAYOUT 0: ORIGINAL CLASSIC STYLE (Classic Theme)
  // ----------------------------------------------------
  if (activeTheme === 'classic') {
    const getPlaceColor = (city: string) => {
      const c = city.toLowerCase();
      if (c.includes('bengaluru') || c.includes('bangalore') || c.includes('karnataka') || c.includes('mysuru') || c.includes('hubballi') || c.includes('mangalore')) return '#D71920';
      if (c.includes('chennai') || c.includes('madras') || c.includes('tamil nadu') || c.includes('coimbatore') || c.includes('madurai')) return '#F9CD05';
      if (c.includes('mumbai') || c.includes('bombay') || c.includes('maharashtra') || c.includes('pune') || c.includes('nagpur')) return '#004BA0';
      if (c.includes('kolkata') || c.includes('calcutta') || c.includes('west bengal')) return '#3A225D';
      if (c.includes('hyderabad') || c.includes('telangana') || c.includes('andhra') || c.includes('vijayawada') || c.includes('visakhapatnam')) return '#F26522';
      if (c.includes('rajasthan') || c.includes('jaipur') || c.includes('jodhpur') || c.includes('udaipur')) return '#EA1A85';
      if (c.includes('delhi')) return '#17479E';
      if (c.includes('punjab') || c.includes('ludhiana') || c.includes('amritsar') || c.includes('chandigarh')) return '#DD1F2D';
      if (c.includes('gujarat') || c.includes('ahmedabad') || c.includes('surat') || c.includes('vadodara')) return '#1C1C3C';
      if (c.includes('lucknow') || c.includes('kanpur') || c.includes('agra') || c.includes('uttar pradesh')) return '#00AEEF';
      return '#1A1A1A';
    };
    const cityColor = getPlaceColor(topCity);

    return (
      <div className="w-full pb-12 relative overflow-hidden bg-white rounded-[40px] border border-[#E5D5C4] shadow-2xl">
        <div className="absolute inset-0 pointer-events-none z-0">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i}
              className="absolute animate-float-sparkle"
              style={{ 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                fontSize: `${Math.random() * 10 + 5}px`
              }}
            >
              {i % 4 === 0 ? '🦋' : '✨'}
            </div>
          ))}
        </div>

        <section className="relative z-10 text-left">
          <div className="w-full h-48 sm:h-64 relative bg-[#1A1A1A] overflow-hidden rounded-t-[40px]">
            {data.featured_work_url ? (
              <img src={getAssetUrl(data.featured_work_url)} className="absolute inset-0 w-full h-full object-cover animate-fadeIn" alt="Profile Banner" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-rose-600" />
            )}
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/0 to-transparent via-[25%]" />
            <div className="absolute top-6 right-8 text-white/40 z-20">
              <Sparkles size={28} className="animate-pulse" />
            </div>
          </div>

          <div className="relative h-12 px-8 z-30">
            <div className="absolute -top-24 sm:-top-32 left-1/2 -translate-x-1/2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <div 
                className="w-40 h-40 sm:w-48 sm:h-48 p-1.5 rounded-full"
                style={{ background: 'linear-gradient(135deg, #C1440E, #F97316)' }}
              >
                <div className="w-full h-full bg-white p-1 rounded-full overflow-hidden shadow-inner">
                  {!avatarError && profile.avatar_url ? (
                    <img src={getAssetUrl(profile.avatar_url)} alt={profile.display_name} className="w-full h-full object-cover rounded-full" onError={() => setAvatarError(true)} />
                  ) : (
                    <div className="w-full h-full object-cover rounded-full flex items-center justify-center bg-neutral-200 text-neutral-600 font-bold text-4xl rounded-full" style={{ fontFamily: 'sans-serif' }}>
                      {profile.display_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
              </div>
              {profile.is_verified && (
                <div className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border border-neutral-100">
                  <VerifiedBadge isVerified={profile.is_verified} accentColor="#C1440E" />
                </div>
              )}
            </div>
          </div>

          <div className="px-8 pt-6 relative z-20">
              <div className="flex flex-col items-center mb-10">
                <div className="text-center">
                  <h1 className="text-4xl font-black tracking-tight text-neutral-900 mb-2 uppercase italic leading-tight">{profile.display_name}</h1>
                  <p className="text-xs font-black text-orange-600 uppercase tracking-[0.4em] leading-none mt-2 mb-4">
                    {data.type || 'CREATIVE PROFESSIONAL'}
                  </p>
                  {profile.bio && (
                    <p className="text-sm font-black text-neutral-800 leading-tight italic max-w-lg mx-auto">
                      {profile.bio}
                    </p>
                  )}
                </div>
              </div>

              <div 
                className={`mb-16 animate-fadeIn w-full -mt-6 ${isFreeProfile ? 'cursor-pointer hover:opacity-85 transition-opacity' : ''}`}
                onClick={() => isFreeProfile && setShowFomoModal(true)}
              >
                <div className="flex justify-evenly items-start w-full">
                  <div className="flex flex-col items-center text-center">
                    <span className={`text-4xl font-black text-neutral-900 leading-none mb-3 ${isFreeProfile ? 'blur-[6px] select-none opacity-50 inline-block px-2' : ''}`}>{isFreeProfile ? '8,204' : liveViews}</span>
                    <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Profile Views</p>
                  </div>
                  <div className="flex flex-col items-center text-center transform translate-x-4">
                    <span className={`text-4xl font-black leading-none mb-3 ${isFreeProfile ? 'blur-[6px] select-none opacity-50 inline-block px-2' : ''}`} style={{ color: cityColor }}>{isFreeProfile ? 'New York' : topCity}</span>
                    <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Most Scanned Place</p>
                  </div>
                </div>
              </div>

              {data.about && (
                <div className="mb-8">
                  <p className="text-[13px] font-black uppercase tracking-[0.2em] text-neutral-900 mb-1">Professional Narrative</p>
                  <p className="text-base text-neutral-600 leading-relaxed bg-neutral-50/30 py-4 px-6 rounded-[24px] border border-neutral-100/50 max-w-2xl italic">
                    "{data.about}"
                  </p>
                </div>
              )}

              {data.platforms && data.platforms.length > 0 && (
                <div className="mb-12">
                  <p className="text-[13px] font-black uppercase tracking-[0.2em] text-neutral-900 mb-6">Where you can find me</p>
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-start gap-3 sm:gap-8 overflow-x-auto no-scrollbar pb-2">
                    {data.platforms.map(p => {
                      const platform = p.platform?.toLowerCase()
                      const Icon = PLATFORM_ICONS[platform] || Share2
                      const style = brandStyles[platform] || 'bg-neutral-900 text-white'
                      const logo = logoNames[platform]

                      return (
                        <a 
                          key={p.platform} 
                          href={ensureAbsoluteUrl(p.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url));
                            if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank');
                          }}
                          className="group flex flex-col items-center gap-3 transition-transform hover:scale-105 shrink-0 social-link-item cursor-pointer"
                        >
                          <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg ${style} transition-shadow group-hover:shadow-xl p-3 sm:p-3.5 relative overflow-hidden`}>
                            {logo ? (
                              <img 
                                src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${logo}.svg`}
                                className="w-full h-full object-contain filter invert"
                                alt={p.platform}
                                style={{ filter: 'brightness(0) invert(1)' }}
                              />
                            ) : null}
                            <Icon size={24} className={logo ? 'hidden' : `sm:hidden ${logo ? '' : 'sm:block'}`} />
                            <Icon size={28} className={logo ? 'hidden' : 'hidden sm:block'} />
                            {isGated && (
                              <div className="absolute inset-0 rounded-2xl bg-black/20 flex items-center justify-center">
                                <Lock size={18} className="text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]" strokeWidth={2.5} />
                              </div>
                            )}
                          </div>
                          <div className="text-center hidden sm:block">
                            <p className="text-[10px] font-black uppercase text-neutral-900 tracking-tighter">{p.platform}</p>
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}

              {data.content_formats && data.content_formats.length > 0 && (
                <div className="mb-12">
                  <p className="text-[13px] font-black uppercase tracking-[0.2em] text-neutral-900 mb-4">Core Specialization</p>
                  <div className="flex flex-wrap gap-2">
                    {data.content_formats.map(format => (
                      <span key={format} className="px-4 py-2 rounded-xl bg-orange-50 text-xs font-black uppercase tracking-widest text-orange-600 border border-orange-100">
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {data.works && data.works.length > 0 && (
                <div className="mb-12">
                  <p className="text-[13px] font-black uppercase tracking-[0.2em] text-neutral-900 mb-6">Recent Showcase</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {data.works.map((w, i) => {
                      const thumb = getThumbnail(w)
                      return (
                        <div 
                          key={i} 
                          onClick={() => setSelectedWork(w)}
                          className="group relative rounded-[32px] overflow-hidden bg-neutral-100 border border-neutral-100 shadow-sm hover:shadow-xl transition-all aspect-video cursor-pointer"
                        >
                          <img src={thumb || 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=2070'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={w.title} />
                          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{w.title}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <section className="px-0 mb-6 relative z-10">
                <div className="flex flex-col items-center text-center gap-8 bg-neutral-50/50 p-8 rounded-[32px] border border-neutral-100/50">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center gap-2 mb-2 whitespace-nowrap">
                      <Sparkles size={16} className="text-orange-500" />
                      <span className="text-[13px] font-black uppercase tracking-[0.2em] text-neutral-900">Open for Collaboration</span>
                    </div>
                    <p className="text-xs text-neutral-500 font-medium italic">
                      {data.collab_types || 'Available for strategic creative partnerships.'}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 w-full">
                    {data.contact_email && (
                      <a href={`mailto:${data.contact_email}`} className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-neutral-200 rounded-2xl hover:border-orange-500 hover:text-orange-500 transition-all text-xs font-black uppercase tracking-widest text-neutral-900 shadow-sm whitespace-nowrap flex-1 min-w-[160px]">
                        <Mail size={16} /> Email Me
                      </a>
                    )}
                    {data.contact_whatsapp && (
                      <a href={`https://wa.me/${data.contact_whatsapp.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-8 py-3.5 bg-neutral-900 rounded-2xl hover:bg-orange-600 transition-all text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-neutral-900/10 whitespace-nowrap flex-1 min-w-[160px]">
                        <MessageCircle size={16} /> WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </section>

          </div>
        </section>
        <GateModal />
      </div>
    )
  }

  // ----------------------------------------------------
  // LAYOUT 1: BRUTALIST HIGH-FASHION (Minimal Theme)
  // ----------------------------------------------------
  if (activeTheme === 'minimal') {
    return (
      <div className="w-full pb-24 relative bg-white text-black font-sans min-h-screen">
        {/* Top Header / Menu */}
        <div className="absolute top-6 right-6 z-40 flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-bold uppercase tracking-widest block">Scan to Connect</span>
          </div>
          <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
            <QrCode size={18} className="text-black" />
          </div>
        </div>

        {/* Banner (Background) */}
        {data.featured_work_url && (
          <div 
            className="absolute top-0 left-0 w-full h-64 sm:h-80 z-0 pointer-events-none opacity-40 mix-blend-multiply"
            style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)' }}
          >
            <img src={getAssetUrl(data.featured_work_url)} alt="Banner" className="w-full h-full object-cover grayscale" />
          </div>
        )}

        <div className="px-6 sm:px-12 pt-32 max-w-4xl mx-auto flex flex-col items-center relative z-10">
          
          {/* Profile Pic */}
          <div className="w-full mb-6 flex justify-center">
             <div className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
               {!avatarError && profile.avatar_url ? (
                    <img src={getAssetUrl(profile.avatar_url)} alt={profile.display_name} className="w-full h-full object-cover grayscale" onError={() => setAvatarError(true)} />
                  ) : (
                    <div className="w-full h-full object-cover grayscale flex items-center justify-center bg-neutral-200 text-neutral-600 font-bold text-4xl " style={{ fontFamily: 'sans-serif' }}>
                      {profile.display_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
             </div>
          </div>

          {/* Typographic Header */}
          <div className="text-center w-full mb-6">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase leading-none mb-4">
              {profile.display_name}
            </h1>
            <p className="text-sm sm:text-base font-bold tracking-widest uppercase border-y-2 border-black py-2 inline-block">
              {data.type || 'DIGITAL CREATOR'}
            </p>
          </div>

          {/* Tagline / Bio */}
          {profile.bio && (
            <div className="mb-10 w-full text-center max-w-lg mx-auto">
              <p className="text-sm font-bold tracking-widest uppercase italic">
                "{profile.bio}"
              </p>
            </div>
          )}

          {/* Stats Bar */}
          <div className="w-full border-4 border-black p-4 sm:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-wrap justify-center sm:justify-between items-center gap-4 mb-10 bg-white">
            <div className={`text-center ${isFreeProfile ? 'cursor-pointer hover:opacity-80' : ''}`} onClick={() => isFreeProfile && setShowFomoModal(true)}>
              <span className="text-[10px] font-black uppercase tracking-widest block mb-1">VIEWS</span>
              <span className={`text-2xl font-black ${isFreeProfile ? 'blur-[4px]' : ''}`}>{isFreeProfile ? '4.2K' : liveViews}</span>
            </div>
            <div className="hidden sm:block w-0.5 h-8 bg-black"></div>
            <div className="text-center">
              <span className="text-[10px] font-black uppercase tracking-widest block mb-1">LOCATION</span>
              <span className="text-xl font-black uppercase">{topCity}</span>
            </div>
            <div className="hidden sm:block w-0.5 h-8 bg-black"></div>
            <div className="text-center">
              <span className="text-[10px] font-black uppercase tracking-widest block mb-1">VIBE SCORE</span>
              <span className="text-3xl font-black flex items-end gap-1">92<span className="text-xs mb-1">/100</span></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 w-full text-left mb-12">
            {/* Work List */}
            {data.content_formats && data.content_formats.length > 0 && (
              <div>
                <h3 className="font-black text-2xl uppercase tracking-tighter mb-4 border-b-4 border-black pb-2">WORK</h3>
                <ul className="space-y-3">
                  {data.content_formats.map(format => (
                    <li key={format} className="font-bold text-sm uppercase tracking-widest flex items-center gap-3">
                      <div className="w-2 h-2 bg-black"></div> {format}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* About / Narrative */}
            {data.about && (
              <div>
                <h3 className="font-black text-2xl uppercase tracking-tighter mb-4 border-b-4 border-black pb-2">NARRATIVE</h3>
                <p className="text-xs font-bold leading-relaxed">
                  {data.about}
                </p>
              </div>
            )}
          </div>

          {/* Socials */}
          {data.platforms && data.platforms.length > 0 && (
            <div className="w-full text-center mb-10">
              <h3 className="font-black text-2xl uppercase tracking-tighter mb-6 border-b-4 border-black pb-2 text-left">SOCIALS</h3>
              <div className="flex flex-wrap gap-4 justify-start">
                {data.platforms.map(p => {
                  const platform = p.platform?.toLowerCase()
                  const Icon = PLATFORM_ICONS[platform] || Share2
                  return (
                    <a
                      key={p.platform}
                      href={ensureAbsoluteUrl(p.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url));
                        if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank');
                      }}
                      className="w-14 h-14 border-4 border-black flex items-center justify-center bg-white hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] relative cursor-pointer"
                    >
                      <Icon size={24} />
                      {isGated && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                          <Lock size={14} className="text-white" />
                        </div>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Contact / Action */}
          <div className="w-full mt-4">
             {data.contact_email && (
               <a href={`mailto:${data.contact_email}`} className="block w-full py-5 bg-black text-white text-center font-black text-xl uppercase tracking-widest hover:bg-white hover:text-black hover:border-4 hover:border-black transition-all">
                 LET'S CONNECT &rarr;
               </a>
             )}
          </div>

        </div>
        <GateModal />
      </div>
    )
  }

  // ----------------------------------------------------
  // LAYOUT 2: SYNTHWAVE / CYBERPUNK CONSOLE (Neon Theme)
  // ----------------------------------------------------
  if (activeTheme === 'neon') {
    return (
      <div className="w-full pb-24 relative bg-[#0D0B1A] text-white font-sans overflow-x-hidden min-h-screen">
        
        {/* Neon Background Accents & Banner */}
        {data.featured_work_url && (
          <div className="absolute top-0 left-0 w-full h-72 sm:h-96 opacity-40 mix-blend-screen pointer-events-none z-0" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)' }}>
            <img src={getAssetUrl(data.featured_work_url)} className="w-full h-full object-cover filter contrast-125 saturate-150 grayscale" alt="Banner" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#FF2D78]/40 via-purple-600/20 to-transparent mix-blend-overlay" />
          </div>
        )}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#FF2D78]/20 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Right Actions */}
        <div className="absolute top-6 right-6 z-40 flex flex-col items-end gap-2">
           <div className="flex items-center gap-3 bg-black/40 border border-[#FF2D78]/50 px-3 py-1.5 rounded-md backdrop-blur-md shadow-[0_0_10px_rgba(255,45,120,0.3)]">
             <span className="text-[9px] font-bold uppercase tracking-widest text-[#FF2D78]">Scan to Connect</span>
             <QrCode size={16} className="text-[#FF2D78]" />
           </div>
           <div className="w-8 h-8 flex flex-col justify-center gap-1.5 items-end cursor-pointer group mt-2">
             <div className="w-6 h-0.5 bg-[#FF2D78] shadow-[0_0_5px_rgba(255,45,120,0.8)] group-hover:w-8 transition-all"></div>
             <div className="w-8 h-0.5 bg-[#FF2D78] shadow-[0_0_5px_rgba(255,45,120,0.8)]"></div>
             <div className="w-4 h-0.5 bg-[#FF2D78] shadow-[0_0_5px_rgba(255,45,120,0.8)] group-hover:w-8 transition-all"></div>
           </div>
        </div>

        <div className="px-6 sm:px-12 pt-24 max-w-4xl mx-auto flex flex-col items-center relative z-20">
          
          {/* Avatar with Neon Ring */}
          <div className="relative mb-8">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 bg-gradient-to-br from-[#FF2D78] to-purple-600 shadow-[0_0_30px_rgba(255,45,120,0.6)] animate-pulse" style={{ animationDuration: '3s' }}>
              <div className="w-full h-full rounded-full bg-[#0D0B1A] overflow-hidden p-1">
                {!avatarError && profile.avatar_url ? (
                    <img src={getAssetUrl(profile.avatar_url)} alt={profile.display_name} className="w-full h-full object-cover rounded-full filter contrast-125 saturate-50" onError={() => setAvatarError(true)} />
                  ) : (
                    <div className="w-full h-full object-cover rounded-full filter contrast-125 saturate-50 flex items-center justify-center bg-neutral-200 text-neutral-600 font-bold text-4xl rounded-full" style={{ fontFamily: 'sans-serif' }}>
                      {profile.display_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Headers */}
          <div className="text-center w-full mb-6">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] mb-2">
              {profile.display_name}
            </h1>
            <h2 className="text-sm sm:text-base font-black tracking-[0.3em] uppercase text-[#FF2D78] drop-shadow-[0_0_8px_rgba(255,45,120,0.8)]">
              {data.type || 'DIGITAL CREATOR'}
            </h2>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="w-full max-w-lg mx-auto text-center mb-10">
              <p className="text-sm text-gray-300 leading-relaxed font-light">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Stats Bar */}
          <div className="w-full max-w-3xl border border-white/10 bg-black/40 backdrop-blur-md rounded-2xl p-6 mb-10 flex flex-wrap justify-between items-center gap-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className={`text-center flex-1 min-w-[80px] ${isFreeProfile ? 'cursor-pointer hover:opacity-80' : ''}`} onClick={() => isFreeProfile && setShowFomoModal(true)}>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">VIEWS</span>
              <span className={`text-2xl font-black text-white border-b-2 border-[#FF2D78] pb-1 inline-block ${isFreeProfile ? 'blur-[4px]' : ''}`}>{isFreeProfile ? '4.2K' : liveViews}</span>
            </div>
            <div className="text-center flex-1 min-w-[80px]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">LOCATION</span>
              <span className="text-xl font-black text-white border-b-2 border-[#FF2D78] pb-1 inline-block truncate max-w-full uppercase">{topCity}</span>
            </div>
            <div className="text-center flex-1 min-w-[120px]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF2D78] block mb-2 drop-shadow-[0_0_5px_rgba(255,45,120,0.8)]">VIBE SCORE</span>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-[#FF2D78] drop-shadow-[0_0_8px_rgba(255,45,120,0.8)] flex items-baseline gap-1">92<span className="text-sm text-gray-400">/100</span></span>
                <div className="w-full h-1 bg-white/10 mt-2 rounded-full overflow-hidden">
                  <div className="w-[92%] h-full bg-[#FF2D78] shadow-[0_0_10px_rgba(255,45,120,1)]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-3xl mb-12">
            {/* What I Do */}
            {data.content_formats && data.content_formats.length > 0 && (
              <div className="bg-black/30 border border-[#FF2D78]/30 rounded-2xl p-6 shadow-[inset_0_0_20px_rgba(255,45,120,0.05)]">
                <h3 className="font-bold text-sm uppercase tracking-[0.2em] text-[#FF2D78] mb-5">WHAT I DO</h3>
                <ul className="space-y-4">
                  {data.content_formats.map(format => (
                    <li key={format} className="text-sm text-gray-200 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D78] shadow-[0_0_8px_rgba(255,45,120,1)]"></div>
                      <span className="font-medium tracking-wide">{format}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Narrative */}
            {data.about && (
              <div className="bg-black/30 border border-cyan-500/30 rounded-2xl p-6 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]">
                <h3 className="font-bold text-sm uppercase tracking-[0.2em] text-cyan-400 mb-5">NARRATIVE</h3>
                <p className="text-xs text-gray-300 leading-relaxed font-light">
                  {data.about}
                </p>
              </div>
            )}
          </div>

          {/* Social Links */}
          {data.platforms && data.platforms.length > 0 && (
            <div className="w-full text-center mb-10">
              <div className="flex flex-wrap gap-5 justify-center">
                {data.platforms.map(p => {
                  const platform = p.platform?.toLowerCase()
                  const Icon = PLATFORM_ICONS[platform] || Share2
                  return (
                    <a
                      key={p.platform}
                      href={ensureAbsoluteUrl(p.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url));
                        if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank');
                      }}
                      className="w-12 h-12 rounded-full border border-[#FF2D78]/50 flex items-center justify-center bg-black/50 text-[#FF2D78] hover:bg-[#FF2D78] hover:text-white hover:shadow-[0_0_20px_rgba(255,45,120,0.8)] transition-all cursor-pointer relative"
                    >
                      <Icon size={20} />
                      {isGated && (
                        <div className="absolute inset-0 bg-black/80 rounded-full flex items-center justify-center">
                          <Lock size={12} className="text-white" />
                        </div>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {data.contact_email && (
            <div className="w-full flex justify-center pb-8">
              <a href={`mailto:${data.contact_email}`} className="px-10 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all">
                INITIATE CONTACT
              </a>
            </div>
          )}

          {/* FOMO Modal */}
          {showFomoModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
              <div className="bg-[#0D0B1A] border-2 border-[#FF2D78] rounded-[24px] p-8 max-w-sm w-full shadow-[0_0_40px_rgba(255,45,120,0.3)] relative animate-zoomIn text-center">
                <button onClick={() => setShowFomoModal(false)} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-[#FF2D78] transition-colors">
                  <X size={20} />
                </button>
                <Activity size={48} className="text-[#FF2D78] mx-auto mb-6 animate-pulse" />
                <h3 className="text-xl font-black text-white tracking-tight mb-2 uppercase">Unlock Telemetry</h3>
                <p className="text-xs font-light text-gray-400 mb-8 leading-relaxed">Upgrade to full tier to view real-time profile scans and audience telemetry.</p>
                <button onClick={() => window.location.href = '/#pricing'} className="w-full py-4 bg-[#FF2D78] hover:bg-[#D41C5C] text-white font-black text-[10px] uppercase tracking-widest rounded-full transition-all shadow-[0_0_15px_rgba(255,45,120,0.5)]">
                  🔒 CLAIM TEE
                </button>
              </div>
            </div>
          )}

        </div>
        <GateModal />
      </div>
    )
  }

  // ----------------------------------------------------
  // LAYOUT 3: GLOW EDITORIAL (Default / Glow Theme)
  // ----------------------------------------------------
  return (
    <div className="w-full pb-16 relative bg-[#08060e] text-white font-sans min-h-screen overflow-x-hidden selection:bg-fuchsia-500/30 selection:text-fuchsia-100">
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
          
          .glow-theme { font-family: 'Outfit', sans-serif; }
          
          .glow-orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            pointer-events: none;
            animation: orbFloat 20s ease-in-out infinite;
          }
          @keyframes orbFloat {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(30px, -20px) scale(1.1); }
            50% { transform: translate(-20px, 15px) scale(0.95); }
            75% { transform: translate(15px, 25px) scale(1.05); }
          }
          
          .name-glow {
            text-shadow: 0 0 30px rgba(168, 85, 247, 0.6),
                         0 0 60px rgba(168, 85, 247, 0.3),
                         0 0 100px rgba(236, 72, 153, 0.2);
            animation: nameBreath 4s ease-in-out infinite;
          }
          @keyframes nameBreath {
            0%, 100% { text-shadow: 0 0 30px rgba(168,85,247,0.6), 0 0 60px rgba(168,85,247,0.3), 0 0 100px rgba(236,72,153,0.2); }
            50% { text-shadow: 0 0 40px rgba(168,85,247,0.8), 0 0 80px rgba(168,85,247,0.4), 0 0 120px rgba(236,72,153,0.3); }
          }
          
          .glow-glass {
            background: rgba(255, 255, 255, 0.04);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(168, 85, 247, 0.1);
            border-radius: 20px;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
          }
          .glow-glass:hover {
            border-color: rgba(168, 85, 247, 0.3);
            box-shadow: 0 4px 30px rgba(168, 85, 247, 0.08);
          }
          
          .glow-section-label {
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: rgba(168, 85, 247, 0.7);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .glow-section-label::after {
            content: '';
            flex-grow: 1;
            height: 1px;
            background: linear-gradient(90deg, rgba(168, 85, 247, 0.2), transparent);
          }
          
          .glow-fade { animation: glowFadeUp 0.6s ease-out forwards; opacity: 0; transform: translateY(18px); }
          @keyframes glowFadeUp { to { opacity: 1; transform: translateY(0); } }
          
          .avatar-glow-ring {
            background: linear-gradient(135deg, #a855f7, #ec4899, #a855f7);
            background-size: 200% 200%;
            animation: ringShift 4s ease infinite;
            padding: 3px;
            border-radius: 24px;
          }
          @keyframes ringShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }

          .glow-tag {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 6px 14px;
            background: rgba(168, 85, 247, 0.08);
            border: 1px solid rgba(168, 85, 247, 0.15);
            border-radius: 9999px;
            color: #d8b4fe;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.05em;
            transition: all 0.2s ease;
            white-space: nowrap;
          }
          .glow-tag:hover {
            background: rgba(168, 85, 247, 0.15);
            border-color: rgba(168, 85, 247, 0.4);
            box-shadow: 0 0 15px rgba(168, 85, 247, 0.12);
          }
          
          .glow-social-icon {
            width: 48px; height: 48px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(168,85,247,0.12);
            color: rgba(168,85,247,0.6);
            transition: all 0.3s ease;
            position: relative;
          }
          .glow-social-icon:hover {
            background: rgba(168,85,247,0.12);
            border-color: rgba(168,85,247,0.4);
            color: #d8b4fe;
            box-shadow: 0 0 20px rgba(168,85,247,0.15);
            transform: translateY(-2px);
          }
        `
      }} />

      {/* Ambient floating orbs */}
      <div className="glow-orb" style={{ top: '5%', left: '15%', width: '350px', height: '350px', background: 'rgba(168, 85, 247, 0.08)' }} />
      <div className="glow-orb" style={{ top: '60%', right: '10%', width: '280px', height: '280px', background: 'rgba(236, 72, 153, 0.06)', animationDelay: '5s' }} />
      <div className="glow-orb" style={{ bottom: '10%', left: '30%', width: '200px', height: '200px', background: 'rgba(139, 92, 246, 0.06)', animationDelay: '10s' }} />

      <main className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 pt-10 glow-theme">

        {/* ═══ BANNER ═══ */}
        {data.featured_work_url && (
          <div className="relative w-full h-48 sm:h-64 rounded-[24px] overflow-hidden mb-6 glow-fade" style={{ animationDelay: '0s' }}>
            <img src={getAssetUrl(data.featured_work_url)} alt="Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08060e] via-[#08060e]/40 to-transparent" />
          </div>
        )}

        {/* ═══ PROFILE HEADER ═══ */}
        <div className={`flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6 glow-fade ${data.featured_work_url ? '-mt-16 relative z-20' : ''}`} style={{ animationDelay: '0.1s' }}>
          <div className="shrink-0">
            <div className="avatar-glow-ring shadow-[0_0_40px_rgba(168,85,247,0.25)]">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[22px] overflow-hidden bg-[#0f0d18]">
                {!avatarError && profile.avatar_url ? (
                  <img src={getAssetUrl(profile.avatar_url)} alt={profile.display_name} className="w-full h-full object-cover" onError={() => setAvatarError(true)} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-900/30 text-purple-300 font-bold text-3xl">
                    {profile.display_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex-grow text-center sm:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-fuchsia-400/80 mb-1.5">
              {data.type || 'CONTENT CREATOR'}
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight name-glow mb-2" style={{ lineHeight: 1.15 }}>
              {profile.display_name}
            </h1>
            {profile.is_verified && (
              <div className="inline-flex mb-2"><VerifiedBadge isVerified={profile.is_verified} accentColor="#a855f7" /></div>
            )}
            {profile.bio && (
              <p className="text-[14px] text-purple-100/60 font-light leading-relaxed max-w-lg mt-1">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* ═══ STATS ROW ═══ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 glow-fade" style={{ animationDelay: '0.15s' }}>
          <div 
            className={`glow-glass p-5 text-center ${isFreeProfile ? 'cursor-pointer' : ''}`}
            onClick={() => isFreeProfile && setShowFomoModal(true)}
          >
            <Activity size={18} className="text-purple-400 mx-auto mb-1.5" />
            <div className={`text-xl font-bold text-white ${isFreeProfile ? 'blur-[4px]' : ''}`}>{isFreeProfile ? '8.2K' : liveViews}</div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-purple-200/40 mt-1">Profile Views</div>
          </div>
          <div className="glow-glass p-5 text-center">
            <MapPin size={18} className="text-fuchsia-400 mx-auto mb-1.5" />
            <div className="text-lg font-bold text-white truncate">{topCity}</div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-purple-200/40 mt-1">Top Location</div>
          </div>
          {data.content_formats && data.content_formats.length > 0 && (
            <div className="glow-glass p-5 text-center col-span-2 sm:col-span-1">
              <Camera size={18} className="text-violet-400 mx-auto mb-1.5" />
              <div className="text-lg font-bold text-white">{data.content_formats.length}</div>
              <div className="text-[9px] uppercase tracking-[0.15em] text-purple-200/40 mt-1">Content Types</div>
            </div>
          )}
        </div>

        {/* ═══ ABOUT & CONTENT FORMATS ═══ */}
        {(data.about || (data.content_formats && data.content_formats.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 glow-fade" style={{ animationDelay: '0.25s' }}>
            {data.about && (
              <div className="glow-glass p-6">
                <div className="glow-section-label"><Sparkles size={13} /> About Me</div>
                <p className="text-[13px] text-purple-100/70 leading-relaxed font-light">{data.about}</p>
              </div>
            )}
            {data.content_formats && data.content_formats.length > 0 && (
              <div className="glow-glass p-6">
                <div className="glow-section-label"><Film size={13} /> Content Formats</div>
                <div className="flex flex-wrap gap-2">
                  {data.content_formats.map(format => (
                    <span key={format} className="glow-tag">
                      <Camera size={11} className="text-purple-400/50" /> {format}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ SHOWCASE / WORKS ═══ */}
        {data.works && data.works.length > 0 && (
          <div className="mb-6 glow-fade" style={{ animationDelay: '0.35s' }}>
            <div className="glow-section-label mb-4"><Play size={13} /> Showcase</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.works.map((w, i) => {
                const thumb = getThumbnail(w)
                return (
                  <div 
                    key={i}
                    onClick={() => setSelectedWork(w)}
                    className="group relative rounded-[16px] overflow-hidden glow-glass cursor-pointer aspect-video"
                  >
                    <img 
                      src={thumb || 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=800'} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      alt={w.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08060e]/90 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2">
                        {w.type === 'video' && <Play size={14} className="text-fuchsia-400" />}
                        <span className="text-[12px] font-semibold text-white">{w.title}</span>
                      </div>
                      {w.description && <p className="text-[10px] text-purple-200/50 mt-0.5 line-clamp-1">{w.description}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ═══ SOCIAL PLATFORMS ═══ */}
        {data.platforms && data.platforms.length > 0 && (
          <div className="glow-glass p-6 mb-6 glow-fade" style={{ animationDelay: '0.45s' }}>
            <div className="glow-section-label"><Share2 size={13} /> Where to Find Me</div>
            <div className="flex flex-wrap gap-3">
              {data.platforms.map(p => {
                const platform = p.platform?.toLowerCase()
                const Icon = PLATFORM_ICONS[platform] || Share2
                return (
                  <a
                    key={p.platform}
                    href={ensureAbsoluteUrl(p.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url));
                      if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank');
                    }}
                    className="glow-social-icon cursor-pointer"
                    title={p.platform}
                  >
                    <Icon size={20} />
                    {isGated && (
                      <div className="absolute inset-0 bg-[#08060e]/80 rounded-[14px] flex items-center justify-center backdrop-blur-[2px]">
                        <Lock size={12} className="text-purple-400" />
                      </div>
                    )}
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {/* ═══ COLLABORATION & CONTACT ═══ */}
        {(data.collab_types || data.contact_email || data.contact_whatsapp) && (
          <div className="glow-glass p-6 mb-6 glow-fade" style={{ animationDelay: '0.55s' }}>
            <div className="glow-section-label"><Sparkles size={13} /> Collaboration</div>
            {data.collab_types && (
              <p className="text-[13px] text-purple-100/60 font-light mb-4 italic">"{data.collab_types}"</p>
            )}
            <div className="flex flex-wrap gap-3">
              {data.contact_email && (
                <a 
                  href={`mailto:${data.contact_email}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600/80 to-fuchsia-600/80 text-white text-[11px] font-bold uppercase tracking-[0.15em] rounded-full hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all"
                >
                  <Mail size={14} /> Email Me
                </a>
              )}
              {data.contact_whatsapp && (
                <a 
                  href={`https://wa.me/${data.contact_whatsapp.replace(/\s+/g, '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366]/80 text-white text-[11px] font-bold uppercase tracking-[0.15em] rounded-full hover:shadow-[0_0_25px_rgba(37,211,102,0.3)] transition-all"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
              )}
            </div>
          </div>
        )}

      </main>

      {/* ═══ SELECTED WORK MODAL ═══ */}
      {selectedWork && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#08060e]/90 backdrop-blur-md" onClick={() => setSelectedWork(null)}>
          <div className="glow-glass p-6 max-w-2xl w-full relative border-purple-500/20 shadow-[0_0_60px_rgba(168,85,247,0.15)]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedWork(null)} className="absolute top-4 right-4 p-2 text-purple-400/50 hover:text-white transition-colors z-10">
              <X size={20} />
            </button>
            {selectedWork.external_url ? (
              <div className="w-full aspect-video rounded-[12px] overflow-hidden bg-black mb-4">
                <iframe src={getEmbedUrl(selectedWork.external_url)} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
              </div>
            ) : getThumbnail(selectedWork) ? (
              <div className="w-full aspect-video rounded-[12px] overflow-hidden bg-black mb-4">
                <img src={getThumbnail(selectedWork)} className="w-full h-full object-cover" alt={selectedWork.title} />
              </div>
            ) : null}
            <h3 className="text-lg font-bold text-white mb-1">{selectedWork.title}</h3>
            {selectedWork.description && <p className="text-[13px] text-purple-100/50 font-light">{selectedWork.description}</p>}
          </div>
        </div>
      )}

      {/* ═══ FOMO MODAL ═══ */}
      {showFomoModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#08060e]/90 backdrop-blur-md">
          <div className="glow-glass p-8 max-w-sm w-full relative text-center border-purple-500/30 shadow-[0_0_60px_rgba(168,85,247,0.2)]">
            <button onClick={() => setShowFomoModal(false)} className="absolute top-4 right-4 p-2 text-purple-400/50 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center mx-auto mb-5">
              <Lock size={24} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mb-2">Unlock Insights</h3>
            <p className="text-[13px] text-purple-100/50 font-light mb-6 leading-relaxed">Upgrade to view live scan metrics and audience analytics.</p>
            <button onClick={() => window.location.href = '/#pricing'} className="w-full py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-[11px] uppercase tracking-[0.15em] rounded-xl transition-all hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]">
              Claim Tee to Unlock
            </button>
          </div>
        </div>
      )}

      <GateModal />
    </div>
  )
}

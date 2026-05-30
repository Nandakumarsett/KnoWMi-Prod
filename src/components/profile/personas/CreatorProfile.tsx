import React from 'react'
import { ProfileData, CreatorData } from '../../../types/profile'
import { PulseBar } from '../shared/PulseBar'
import { VerifiedBadge } from '../shared/VerifiedBadge'
import { ProfileAvatar } from '../shared/ProfileAvatar'
import { getAssetUrl } from '../../../lib/supabase'
import { 
  LayoutGrid, Instagram, Youtube, Twitter, Github, 
  Share2, Sparkles, TrendingUp, Camera, Play, Film, MapPin, 
  Trophy, Mail, MessageCircle, Facebook, Linkedin, Globe, Activity, X, Lock
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
  // LAYOUT 1: BRUTALIST HIGH-FASHION (Minimal Theme)
  // ----------------------------------------------------
  if (activeTheme === 'minimal') {
    return (
      <div className="w-full pb-24 relative bg-[#F5F5F5] text-black font-mono selection:bg-yellow-300 selection:text-black min-h-screen">
        <style dangerouslySetInnerHTML={{ __html: `
          .brutalist-block {
            background: white;
            border: 4px solid black;
            box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
            transition: all 0.15s cubic-bezier(0.19, 1, 0.22, 1);
          }
          .brutalist-block:hover {
            transform: translate(-3px, -3px);
            box-shadow: 11px 11px 0px 0px rgba(0,0,0,1);
          }
          .brutalist-accent {
            background: #FACC15;
            border: 4px solid black;
            box-shadow: 6px 6px 0px 0px rgba(0,0,0,1);
          }
          .brutalist-btn {
            background: white;
            border: 3px solid black;
            box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);
            transition: all 0.1s ease;
          }
          .brutalist-btn:hover {
            background: #FACC15;
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px 0px rgba(0,0,0,1);
          }
        `}} />

        {/* Massive Brutalist Header Banner */}
        <section className="relative border-b-4 border-black h-56 bg-neutral-200 overflow-hidden flex items-center justify-center">
          {data.featured_work_url ? (
            <img src={getAssetUrl(data.featured_work_url)} className="absolute inset-0 w-full h-full object-cover grayscale contrast-150 brightness-95" alt="Banner" />
          ) : (
            <div className="absolute inset-0 bg-[#FACC15] flex items-center justify-center font-black text-4xl uppercase tracking-widest">
              CREATIVE LAB
            </div>
          )}
          <div className="absolute top-6 left-6 bg-black text-white px-4 py-2 font-black text-sm uppercase tracking-widest border-2 border-black">
            MINIMAL // BRUTALIST
          </div>
        </section>

        {/* Asymmetrical Overlapping Square Avatar */}
        <div className="relative h-12 px-6 sm:px-12 z-30 flex justify-start">
          <div className="absolute -top-20 w-36 h-36 border-4 border-black bg-white overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none">
            <img src={getAssetUrl(profile.avatar_url)} alt={profile.display_name} className="w-full h-full object-cover grayscale contrast-125" />
          </div>
        </div>

        <div className="px-6 sm:px-12 pt-14 max-w-5xl mx-auto">
          {/* Stark Identity Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            
            {/* Bio Column */}
            <div className="lg:col-span-8 space-y-6 text-left">
              <div className="brutalist-block p-6 sm:p-8">
                <span className="inline-block bg-[#FACC15] text-black px-3 py-1 font-black text-xs uppercase tracking-widest border-2 border-black mb-4">
                  {data.type || 'CREATIVE DIRECTOR'}
                </span>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase mb-4 leading-none">{profile.display_name}</h1>
                {profile.bio && (
                  <p className="text-sm font-bold leading-relaxed border-t-2 border-dashed border-black pt-4">
                    {profile.bio}
                  </p>
                )}
              </div>

              {/* Statement */}
              {data.about && (
                <div className="brutalist-block p-6 bg-white">
                  <h3 className="font-black uppercase tracking-widest text-xs border-b-2 border-black pb-2 mb-4">// CORE NARRATIVE</h3>
                  <p className="text-sm font-bold leading-relaxed">
                    "{data.about}"
                  </p>
                </div>
              )}
            </div>

            {/* Metrics column */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="brutalist-accent p-6 text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-800 block mb-1">TOTAL_SCANS</span>
                <span className={`text-4xl font-black block ${isFreeProfile ? 'blur-[6px]' : ''}`}>{isFreeProfile ? '8,204' : liveViews}</span>
              </div>
              
              <div className="brutalist-block p-6 text-left bg-white">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block mb-1">TOP_ORIGIN</span>
                <span className={`text-lg font-black block uppercase truncate ${isFreeProfile ? 'blur-[6px]' : ''}`}>{isFreeProfile ? 'New York' : topCity}</span>
              </div>

              {/* Contact Block */}
              <div className="brutalist-block p-6 bg-white text-left flex flex-col gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">// PING CHANNEL</span>
                {data.contact_email && (
                  <a href={`mailto:${data.contact_email}`} className="brutalist-btn py-3 px-4 font-black text-xs uppercase tracking-widest text-center block">
                    EMAIL OWNER
                  </a>
                )}
                {data.contact_whatsapp && (
                  <a href={`https://wa.me/${data.contact_whatsapp.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="brutalist-btn py-3 px-4 font-black text-xs uppercase tracking-widest text-center block">
                    WHATSAPP
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Connective Nodes */}
          {data.platforms && data.platforms.length > 0 && (
            <div className="mb-12 text-left">
              <h3 className="font-black text-lg uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-4 h-4 bg-black"></span> CONNECTIVE NODES
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                      className="brutalist-block p-4 flex flex-col items-center justify-center gap-3 group cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-black text-white flex items-center justify-center p-2.5 relative">
                        <Icon size={24} />
                        {isGated && (
                          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                            <Lock size={14} className="text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider">{p.platform}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Staggered Portfolio Works */}
          {data.works && data.works.length > 0 && (
            <div className="mb-12 text-left">
              <h3 className="font-black text-lg uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-4 h-4 bg-[#FACC15] border-2 border-black"></span> SELECTED WORKS Showcase
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {data.works.map((w, i) => {
                  const thumb = getThumbnail(w)
                  return (
                    <div 
                      key={i}
                      onClick={() => setSelectedWork(w)}
                      className="brutalist-block overflow-hidden group cursor-pointer aspect-video relative"
                    >
                      <img src={thumb || 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=2070'} className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0 group-hover:scale-105 duration-300" alt={w.title} />
                      <div className="absolute bottom-0 left-0 right-0 bg-white border-t-4 border-black p-4 flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-widest">{w.title}</span>
                        <Play size={14} className="text-black" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Specialized Brutalist tags */}
          {data.content_formats && data.content_formats.length > 0 && (
            <div className="mb-12 text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block mb-4">// SPECIALIZED FORMATS</span>
              <div className="flex flex-wrap gap-3">
                {data.content_formats.map(format => (
                  <span key={format} className="border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
                    {format}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Collab Banner */}
          <section className="brutalist-accent p-8 text-left mb-12">
            <h3 className="font-black text-xl uppercase tracking-widest mb-2 flex items-center gap-2">
              <Sparkles size={22} /> COLLABORATION INQUIRY
            </h3>
            <p className="text-xs font-black leading-relaxed mb-6 border-b border-black pb-4">
              {data.collab_types || 'Available for creative consultation and high-impact visual direction.'}
            </p>
            <div className="flex flex-wrap gap-4">
              {data.contact_email && (
                <a href={`mailto:${data.contact_email}`} className="px-6 py-3 bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-[4px_4px_0px_0px_rgba(250,204,21,1)] border-2 border-black">
                  SEND DISPATCH
                </a>
              )}
            </div>
          </section>

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
      <div className="w-full pb-24 relative bg-[#07020E] text-white font-sans overflow-hidden min-h-screen selection:bg-fuchsia-500 selection:text-white">
        
        {/* Deep Synthwave Laser grid overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-25 z-0" 
          style={{
            backgroundImage: 'linear-gradient(rgba(236, 72, 153, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(236, 72, 153, 0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            backgroundPosition: 'top center'
          }}
        />

        {/* Ambient Neon Glow balls */}
        <div className="absolute top-[80px] left-[-150px] w-[400px] h-[400px] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[100px] right-[-150px] w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Neon Cyber Header cover */}
        <section className="relative z-10 h-60 sm:h-72 overflow-hidden border-b-2 border-fuchsia-500 shadow-[0_0_20px_rgba(240,46,170,0.4)]">
          {data.featured_work_url ? (
            <img src={getAssetUrl(data.featured_work_url)} className="absolute inset-0 w-full h-full object-cover brightness-75 contrast-125" alt="Banner" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-900 via-purple-950 to-[#0c0421]" />
          )}
          {/* Scanlines layer */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none" />
          <div className="absolute bottom-6 right-6 bg-black/80 border border-fuchsia-500/60 px-4 py-2 rounded-md text-[10px] font-black text-fuchsia-400 tracking-widest backdrop-blur-md">
            SYSTEM // MODE: NEON_SYNTH
          </div>
        </section>

        {/* Overlapping glowing capsule avatar */}
        <div className="relative h-12 px-8 z-30 flex justify-center">
          <div className="absolute -top-20 w-36 h-36 rounded-full p-[2.5px] bg-gradient-to-tr from-fuchsia-500 via-purple-600 to-cyan-400 shadow-[0_0_25px_rgba(240,46,170,0.6)]">
            <div className="w-full h-full bg-[#0D0721] rounded-full overflow-hidden p-1.5">
              <img src={getAssetUrl(profile.avatar_url)} alt={profile.display_name} className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-12 pt-16 max-w-4xl mx-auto relative z-20">
          
          {/* Main Cyber Console block */}
          <div className="text-center mb-12 bg-neutral-950/80 border border-fuchsia-500/40 p-8 rounded-3xl backdrop-blur-md shadow-[0_0_20px_rgba(240,46,170,0.1)] relative">
            <div className="absolute top-3 left-6 text-[8px] font-black tracking-widest text-fuchsia-500/50 uppercase">// USER CONFIG ID</div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-fuchsia-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent uppercase italic mb-3 mt-2">
              {profile.display_name}
            </h1>
            <p className="text-[10px] font-black text-fuchsia-400 uppercase tracking-[0.4em] mb-6">// {data.type || 'VISUAL SYSTEMS CORE'}</p>
            {profile.bio && (
              <p className="text-sm border-t border-purple-950/80 pt-6 max-w-xl mx-auto text-purple-200 leading-relaxed font-medium">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Glowing Metrics Console */}
          <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto mb-12">
            <div className="bg-[#0f041d] border border-fuchsia-500/40 p-6 rounded-2xl text-center shadow-[0_0_15px_rgba(240,46,170,0.15)] hover:border-fuchsia-400 transition-colors">
              <span className={`text-4xl font-extrabold block text-fuchsia-400 tracking-wider ${isFreeProfile ? 'blur-[6px]' : ''}`}>{isFreeProfile ? '8,204' : liveViews}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mt-2 block">// INBOUND_SIGNALS</span>
            </div>
            <div className="bg-[#0f041d] border border-cyan-500/40 p-6 rounded-2xl text-center shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:border-cyan-400 transition-colors">
              <span className={`text-2xl font-extrabold block text-cyan-400 truncate ${isFreeProfile ? 'blur-[6px]' : ''}`}>{isFreeProfile ? 'New York' : topCity}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mt-2 block">// HOST_SECTOR</span>
            </div>
          </div>

          {/* Statement console */}
          {data.about && (
            <div className="mb-12 bg-neutral-950/70 border border-purple-900/40 p-6 rounded-3xl text-left shadow-[inset_0_0_15px_rgba(240,46,170,0.05)]">
              <span className="text-[9px] font-black tracking-widest text-fuchsia-400 block mb-3">// CREATIVE MANUAL DIALOGUE</span>
              <p className="text-base text-purple-100 leading-relaxed italic">
                "{data.about}"
              </p>
            </div>
          )}

          {/* Cyber Nodes Grid */}
          {data.platforms && data.platforms.length > 0 && (
            <div className="mb-12 text-left">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-400 mb-6">// ACTIVE NODE SHUNTS</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                      className="bg-neutral-950/90 border border-purple-900/50 hover:border-fuchsia-500 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-fuchsia-950/40 border border-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center relative">
                        <Icon size={20} />
                        {isGated && (
                          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-xl">
                            <Lock size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-purple-200">{p.platform}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Portfolio grid with glowing tags */}
          {data.works && data.works.length > 0 && (
            <div className="mb-12 text-left">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-400 mb-6">// VISUAL CORE SHOWCASE</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {data.works.map((w, i) => {
                  const thumb = getThumbnail(w)
                  return (
                    <div 
                      key={i}
                      onClick={() => setSelectedWork(w)}
                      className="bg-neutral-950/95 border border-purple-900/40 hover:border-fuchsia-400 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer aspect-video relative group"
                    >
                      <img src={thumb || 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=2070'} className="w-full h-full object-cover brightness-75 group-hover:brightness-95 transition-all duration-500" alt={w.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-5 flex flex-col justify-end text-left">
                        <span className="text-xs font-black uppercase tracking-wider text-white shadow-sm">{w.title}</span>
                      </div>
                      <div className="absolute top-4 right-4 bg-black/80 border border-fuchsia-500 px-2 py-0.5 rounded text-[8px] font-black tracking-widest text-fuchsia-400">
                        PLAYBACK
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Specialty tags */}
          {data.content_formats && data.content_formats.length > 0 && (
            <div className="mb-12 text-left">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-400 mb-4">// CORE PROTOCOLS</h4>
              <div className="flex flex-wrap gap-2">
                {data.content_formats.map(format => (
                  <span key={format} className="px-4 py-2 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs font-black uppercase tracking-wider text-fuchsia-300">
                    {format}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Collab Console */}
          <section className="bg-neutral-950/80 border border-fuchsia-500 p-8 rounded-3xl text-left shadow-[0_0_30px_rgba(240,46,170,0.15)] mb-10">
            <h3 className="font-extrabold text-xl uppercase tracking-widest mb-2 text-fuchsia-400 flex items-center gap-2">
              <Sparkles size={20} className="animate-pulse" /> CORE COLLABORATIVE INTERACTION
            </h3>
            <p className="text-xs text-purple-200 leading-relaxed mb-6 border-b border-purple-900/30 pb-4">
              {data.collab_types || 'Ready for creative partnership, high-fidelity strategy, and visual consults.'}
            </p>
            <div className="flex flex-wrap gap-4">
              {data.contact_email && (
                <a href={`mailto:${data.contact_email}`} className="px-6 py-3.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(240,46,170,0.4)] active:scale-95">
                  DISPATCH EMAIL
                </a>
              )}
              {data.contact_whatsapp && (
                <a href={`https://wa.me/${data.contact_whatsapp.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="px-6 py-3.5 bg-[#120524] border border-cyan-500 text-cyan-400 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95">
                  WHATSAPP SYNC
                </a>
              )}
            </div>
          </section>

        </div>
        <GateModal />
      </div>
    )
  }

  // ----------------------------------------------------
  // LAYOUT 3: GLOW EDITORIAL MAGAZINE (Default / Glow Theme)
  // ----------------------------------------------------
  return (
    <div className="w-full pb-24 relative overflow-hidden bg-[#FAF7F2] rounded-[48px] border border-[#E9DFCE] shadow-2xl min-h-screen">
      
      {/* Floating Organic Warm Flares */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-gradient-to-tr from-rose-200/30 via-amber-100/20 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[5%] w-[400px] h-[400px] bg-gradient-to-tr from-amber-100/30 via-orange-100/20 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Sparkles Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute animate-float-sparkle"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${Math.random() * 12 + 6}px`
            }}
          >
            {i % 3 === 0 ? '✨' : '🦋'}
          </div>
        ))}
      </div>

      {/* Premium Hero Banner Cover */}
      <section className="relative z-10">
        <div className="w-full h-56 sm:h-72 relative bg-neutral-900 overflow-hidden rounded-t-[48px]">
          {data.featured_work_url ? (
            <img src={getAssetUrl(data.featured_work_url)} className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-1000" alt="Profile Banner" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-rose-500 to-amber-500" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/10 to-transparent" />
        </div>

        {/* Centered Overlapping Circle Avatar with Thick Cream Border */}
        <div className="relative h-12 px-8 z-30">
          <div className="absolute -top-24 sm:-top-32 left-1/2 -translate-x-1/2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
            <div 
              className="w-44 h-44 sm:w-52 sm:h-52 p-2 rounded-full"
              style={{ background: 'linear-gradient(135deg, #C1440E, #F97316)' }}
            >
              <div className="w-full h-full bg-[#FAF7F2] p-1.5 rounded-full overflow-hidden">
                <img src={getAssetUrl(profile.avatar_url)} alt={profile.display_name} className="w-full h-full object-cover rounded-full" />
              </div>
            </div>
            {profile.is_verified && (
              <div className="absolute bottom-2 right-2 w-11 h-11 bg-[#FAF7F2] rounded-full shadow-lg flex items-center justify-center border border-[#E9DFCE]">
                <VerifiedBadge isVerified={profile.is_verified} accentColor="#C1440E" />
              </div>
            )}
          </div>
        </div>

        <div className="px-6 sm:px-12 pt-16 max-w-5xl mx-auto relative z-20">
          
          {/* Identity Grid: Left Title Block, Right Profile Narrative */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
            
            {/* Title / Name details block */}
            <div className="lg:col-span-6 text-center lg:text-left">
              <span className="inline-block bg-orange-600/10 text-orange-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] mb-4">
                {data.type || 'CREATIVE PROFESSIONAL'}
              </span>
              <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-neutral-900 uppercase italic leading-tight">
                {profile.display_name}
              </h1>
              {profile.bio && (
                <p className="text-base text-neutral-600 leading-relaxed font-sans italic mt-6 border-l-4 border-orange-500 pl-4 text-left max-w-lg mx-auto lg:mx-0">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Metrics & Mini-Narrative Card block */}
            <div className="lg:col-span-6 space-y-6">
              {/* Premium Analytics grid */}
              <div 
                className={`grid grid-cols-2 gap-4 ${isFreeProfile ? 'cursor-pointer hover:opacity-85 transition-all' : ''}`}
                onClick={() => isFreeProfile && setShowFomoModal(true)}
              >
                <div className="bg-white/80 border border-[#E9DFCE] p-6 rounded-3xl shadow-sm text-center backdrop-blur-sm">
                  <span className={`text-4xl font-extrabold text-neutral-900 leading-none mb-2 block ${isFreeProfile ? 'blur-[6px]' : ''}`}>{isFreeProfile ? '8,204' : liveViews}</span>
                  <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Profile Views</p>
                </div>
                <div className="bg-white/80 border border-[#E9DFCE] p-6 rounded-3xl shadow-sm text-center backdrop-blur-sm">
                  <span className={`text-3xl font-serif italic font-black text-orange-600 leading-none mb-2 block ${isFreeProfile ? 'blur-[6px] truncate' : ''}`}>{isFreeProfile ? 'New York' : topCity}</span>
                  <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Top Origin</p>
                </div>
              </div>

              {/* Curated About Statement */}
              {data.about && (
                <div className="bg-white/60 border border-[#E9DFCE] p-6 rounded-3xl text-left backdrop-blur-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Narrative Profile</span>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium italic">
                    "{data.about}"
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Social Platforms Row (High-End icons) */}
          {data.platforms && data.platforms.length > 0 && (
            <div className="mb-16 text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 block mb-6">// SOCIAL MATRIX CONNECTOR</span>
              <div className="flex flex-wrap items-center justify-start gap-4">
                {data.platforms.map(p => {
                  const platform = p.platform?.toLowerCase()
                  const Icon = PLATFORM_ICONS[platform] || Share2
                  const style = brandStyles[platform] || 'bg-neutral-950 text-white'
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
                      className="group flex items-center gap-3 transition-all hover:scale-105 shrink-0 cursor-pointer"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${style} transition-shadow group-hover:shadow-xl p-4 relative overflow-hidden`}>
                        {logo ? (
                          <img 
                            src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${logo}.svg`}
                            className="w-full h-full object-contain filter invert"
                            alt={p.platform}
                            style={{ filter: 'brightness(0) invert(1)' }}
                          />
                        ) : (
                          <Icon size={24} />
                        )}
                        {isGated && (
                          <div className="absolute inset-0 rounded-2xl bg-black/20 flex items-center justify-center">
                            <Lock size={16} className="text-white drop-shadow-md" strokeWidth={2.5} />
                          </div>
                        )}
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Showcase works responsive grid */}
          {data.works && data.works.length > 0 && (
            <div className="mb-16 text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 block mb-6">// SELECTED SHOWCASE PROJECTS</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {data.works.map((w, i) => {
                  const thumb = getThumbnail(w)
                  return (
                    <div 
                      key={i} 
                      onClick={() => setSelectedWork(w)}
                      className="group relative rounded-[36px] overflow-hidden bg-neutral-100 border border-[#E9DFCE] shadow-md hover:shadow-2xl transition-all aspect-video cursor-pointer"
                    >
                      <img src={thumb || 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=2070'} className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-105" alt={w.title} />
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex justify-between items-center text-left">
                        <span className="text-xs font-black text-white uppercase tracking-wider">{w.title}</span>
                        <Play size={16} className="text-white opacity-70 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Core Specialization badges */}
          {data.content_formats && data.content_formats.length > 0 && (
            <div className="mb-16 text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 block mb-4">// CORE SKILLS & CHANNELS</span>
              <div className="flex flex-wrap gap-2">
                {data.content_formats.map(format => (
                  <span key={format} className="px-4 py-2.5 rounded-full bg-orange-50/70 border border-[#E9DFCE] text-xs font-black uppercase tracking-widest text-orange-700 shadow-sm">
                    {format}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Elegant Contact / Collab block */}
          <section className="relative z-10 mb-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/70 border border-[#E9DFCE] p-8 sm:p-10 rounded-[36px] backdrop-blur-md">
              <div className="text-left flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-orange-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-900">Collaboration Engine</span>
                </div>
                <p className="text-xs text-neutral-500 font-medium italic">
                  {data.collab_types || 'Open for high-end artistic direction, photography campaigns, and strategic creative partnerships.'}
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                {data.contact_email && (
                  <a href={`mailto:${data.contact_email}`} className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-[#E9DFCE] rounded-2xl hover:border-orange-500 hover:text-orange-600 transition-all text-xs font-black uppercase tracking-widest text-neutral-900 shadow-sm flex-1 sm:flex-initial">
                    <Mail size={16} /> Send Mail
                  </a>
                )}
                {data.contact_whatsapp && (
                  <a href={`https://wa.me/${data.contact_whatsapp.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 rounded-2xl hover:bg-orange-600 transition-all text-xs font-black uppercase tracking-widest text-white shadow-lg flex-1 sm:flex-initial">
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                )}
              </div>
            </div>
          </section>

        </div>
      </section>

      {/* Previews Modal */}
      {selectedWork && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 animate-fadeIn backdrop-blur-md"
          style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}
          onClick={() => setSelectedWork(null)}
        >
          <div className="absolute top-6 right-6 z-50">
            <button onClick={() => setSelectedWork(null)} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all">
              <X size={24} /> 
            </button>
          </div>
          
          <div className="relative w-full max-w-5xl aspect-video rounded-[32px] overflow-hidden bg-black shadow-2xl animate-zoomIn" onClick={e => e.stopPropagation()}>
            {selectedWork.external_url ? (
              <iframe src={getEmbedUrl(selectedWork.external_url)} className="w-full h-full border-none" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            ) : selectedWork.type === 'video' ? (
              <video src={getAssetUrl(selectedWork.url || selectedWork.img)} controls autoPlay className="w-full h-full object-contain" />
            ) : (
              <img src={getAssetUrl(selectedWork.url || selectedWork.img)} className="w-full h-full object-contain" alt={selectedWork.title} />
            )}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none text-left">
               <h4 className="text-xl font-bold text-white uppercase tracking-wider">{selectedWork.title}</h4>
            </div>
          </div>
        </div>
      )}

      {/* FOMO Modal */}
      {showFomoModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#FAF7F2] border border-[#E9DFCE] rounded-[36px] p-8 max-w-sm w-full shadow-2xl relative animate-zoomIn text-center">
            <button onClick={() => setShowFomoModal(false)} className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-50 transition-all">
              <X size={20} />
            </button>
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shadow-inner">
                <Activity size={32} className="animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-black text-neutral-900 tracking-tight mb-2 uppercase italic font-serif">Unlock Analytics</h3>
            <p className="text-xs font-bold text-neutral-500 mb-6 leading-relaxed">Upgrade to full tier to view scans telemetry in real-time.</p>
            <div className="space-y-3">
              <button onClick={() => window.location.href = '/#pricing'} className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md">
                🔒 Claim Tee & Unlock
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes floatSparkle {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.15; }
          50% { transform: translateY(-30px) rotate(15deg) scale(1.3); opacity: 0.85; }
        }
        .animate-float-sparkle { animation: floatSparkle 6s ease-in-out infinite; }
        @keyframes zoomIn { from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-zoomIn { animation: zoomIn 0.25s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
      `}</style>
      <GateModal />
    </div>
  )
}

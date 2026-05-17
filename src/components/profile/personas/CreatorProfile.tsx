import React from 'react'
import { ProfileData, CreatorData } from '../../../types/profile'
import { PulseBar } from '../shared/PulseBar'
import { VerifiedBadge } from '../shared/VerifiedBadge'
import { ProfileAvatar } from '../shared/ProfileAvatar'
import { getAssetUrl } from '../../../lib/supabase'
import { 
  LayoutGrid, Instagram, Youtube, Twitter, Github, 
  Share2, Sparkles, TrendingUp, Camera, Play, Film, MapPin, 
  Trophy, Mail, MessageCircle, Facebook, Linkedin, Globe, Activity
} from 'lucide-react'

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
  const data = profile.persona_data as CreatorData
  const accent = '#F97316'
  const [selectedWork, setSelectedWork] = React.useState<any>(null);
  
  const liveViews = stats?.totalViews || 0;
  const topCity = stats?.topCities?.[0]?.city || 'Global';
  const isFreeProfile = profile.tier === 'Starter' || profile.tier === 'Free' || profile.status === 'free' || (!profile.status && (!profile.tier || profile.tier === 'Starter'));

  const getPlaceColor = (city: string) => {
    const c = city.toLowerCase();
    // Karnataka (Bengaluru) - Red
    if (c.includes('bengaluru') || c.includes('bangalore') || c.includes('karnataka') || c.includes('mysuru') || c.includes('hubballi') || c.includes('mangalore')) return '#D71920';
    // Tamil Nadu (Chennai) - Yellow
    if (c.includes('chennai') || c.includes('madras') || c.includes('tamil nadu') || c.includes('coimbatore') || c.includes('madurai')) return '#F9CD05';
    // Maharashtra (Mumbai) - Royal Blue
    if (c.includes('mumbai') || c.includes('bombay') || c.includes('maharashtra') || c.includes('pune') || c.includes('nagpur')) return '#004BA0';
    // West Bengal (Kolkata) - Purple
    if (c.includes('kolkata') || c.includes('calcutta') || c.includes('west bengal')) return '#3A225D';
    // Telangana / Andhra (Hyderabad) - Orange
    if (c.includes('hyderabad') || c.includes('telangana') || c.includes('andhra') || c.includes('vijayawada') || c.includes('visakhapatnam')) return '#F26522';
    // Rajasthan - Pink
    if (c.includes('rajasthan') || c.includes('jaipur') || c.includes('jodhpur') || c.includes('udaipur')) return '#EA1A85';
    // Delhi - Blue
    if (c.includes('delhi')) return '#17479E';
    // Punjab - Red
    if (c.includes('punjab') || c.includes('ludhiana') || c.includes('amritsar') || c.includes('chandigarh')) return '#DD1F2D';
    // Gujarat - Navy Blue
    if (c.includes('gujarat') || c.includes('ahmedabad') || c.includes('surat') || c.includes('vadodara')) return '#1C1C3C';
    // Uttar Pradesh (Lucknow) - Sky Blue
    if (c.includes('lucknow') || c.includes('kanpur') || c.includes('agra') || c.includes('uttar pradesh')) return '#00AEEF';
    
    return '#1A1A1A'; // Default Ink
  };

  const cityColor = getPlaceColor(topCity);

  const getThumbnail = (work: any) => {
    if (work.external_url) {
      const url = work.external_url;
      // Robust YouTube ID extraction
      const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
      if (ytMatch) {
        return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
      }
      // Vimeo
      if (url.includes('vimeo.com')) {
        const id = url.split('/').pop();
        return `https://vumbnail.com/${id}.jpg`;
      }
      return null;
    }
    
    // If it's a video and we don't have an explicit thumbnail, don't return the video URL as a thumbnail
    const mediaUrl = work.thumbnail_url || work.img || (work.type !== 'video' ? work.url : null);
    if (!mediaUrl) return null;
    
    return getAssetUrl(mediaUrl);
  };

  const renderedWorks = React.useMemo(() => {
    const works = data.works;
    if (!works || works.length === 0) return null;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {works.map((w, i) => {
          const isExternal = !!w.external_url;
          const targetUrl = w.external_url || getAssetUrl(w.url || w.img);
          const thumb = getThumbnail(w);
          
          const CardContent = (
            <div className="relative h-full w-full">
              {w.type === 'video' && !isExternal ? (
                <video 
                  src={getAssetUrl(w.url || w.img)} 
                  poster={thumb || undefined}
                  playsInline 
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={thumb || 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=2070&auto=format&fit=crop'} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={w.title} 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=2070&auto=format&fit=crop';
                  }}
                />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                    {w.type === 'video' || isExternal ? <Film size={20} /> : <Play size={20} className="fill-white" />}
                 </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{w.title}</span>
              </div>
            </div>
          );

          return (
            <div 
              key={i} 
              onClick={() => setSelectedWork(w)}
              className="group relative rounded-[32px] overflow-hidden bg-neutral-100 border border-neutral-100 shadow-sm hover:shadow-xl transition-all aspect-video cursor-pointer"
            >
              {CardContent}
            </div>
          );
        })}
      </div>
    );
  }, [data.works, getThumbnail, setSelectedWork]);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    // Vimeo
    if (url.includes('vimeo.com')) {
      const id = url.split('/').pop();
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    return url;
  };

  return (
    <div className="w-full pb-12 relative overflow-hidden bg-white rounded-[40px] border border-[#E5D5C4] shadow-2xl">
      {/* Floating Butterflies & Glitters Background Layer */}
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

      {/* Premium Hero Banner Section - TOTAL COVER STYLE */}
      <section className="relative z-10">
        <div className="w-full h-48 sm:h-64 relative bg-[#1A1A1A] overflow-hidden rounded-t-[40px]">
          {/* The Banner Image: Total Cover */}
          {data.featured_work_url ? (
            <img 
              src={getAssetUrl(data.featured_work_url)} 
              className="absolute inset-0 w-full h-full object-cover animate-fadeIn" 
              alt="Profile Banner"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-rose-600" />
          )}
          
          {/* Top/Side Vignette for Depth */}
          <div className="absolute inset-0 bg-black/10" />
          
          {/* THE 25% FEATHER: Minimal smooth bottom fade out */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/0 to-transparent via-[25%]" />
          
          <div className="absolute top-6 right-8 text-white/40 z-20">
            <Sparkles size={28} className="animate-pulse" />
          </div>
        </div>

        {/* Centered Overlapping Avatar - Deeper Integration */}
        <div className="relative h-12 px-8 z-30">
          <div className="absolute -top-24 sm:-top-32 left-1/2 -translate-x-1/2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div 
              className="w-40 h-40 sm:w-48 sm:h-48 p-1.5 rounded-full"
              style={{ background: 'linear-gradient(135deg, #C1440E, #F97316)' }}
            >
              <div className="w-full h-full bg-white p-1 rounded-full overflow-hidden shadow-inner">
                <img src={getAssetUrl(profile.avatar_url)} alt={profile.display_name} className="w-full h-full object-cover rounded-full" />
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

            {/* KnoWMi Pulse - Minimalistic Analytics */}
            <div className="mb-16 animate-fadeIn w-full -mt-6">
              <div className="flex justify-evenly items-start w-full">
                <div className="flex flex-col items-center text-center">
                  <span className={`text-4xl font-black text-neutral-900 leading-none mb-3 ${isFreeProfile ? 'blur-[8px] select-none opacity-50' : ''}`}>{isFreeProfile ? '8,204' : liveViews}</span>
                  <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Profile Views</p>
                </div>
                <div className="flex flex-col items-center text-center transform translate-x-4">
                  <span className={`text-4xl font-black leading-none mb-3 ${isFreeProfile ? 'blur-[8px] select-none opacity-50' : ''}`} style={{ color: cityColor }}>{isFreeProfile ? 'New York' : topCity}</span>
                  <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Most Scanned Place</p>
                </div>
              </div>
            </div>

            {/* Professional Narrative - Moved Up for priority */}
            {data.about && (
              <div className="mb-8">
                <p className="text-[13px] font-black uppercase tracking-[0.2em] text-neutral-900 mb-1">Professional Narrative</p>
                <p className="text-base text-neutral-600 leading-relaxed bg-neutral-50/30 py-4 px-6 rounded-[24px] border border-neutral-100/50 max-w-2xl italic">
                  "{data.about}"
                </p>
              </div>
            )}

            {/* Network Presence - Moved Down */}
            {data.platforms && data.platforms.length > 0 && (
              <div className="mb-12">
                <p className="text-[13px] font-black uppercase tracking-[0.2em] text-neutral-900 mb-6">Where you can find me</p>
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-start gap-3 sm:gap-8 overflow-x-auto no-scrollbar pb-2">
                  {data.platforms.map(p => {
                    const platform = p.platform?.toLowerCase();
                    const Icon = PLATFORM_ICONS[platform] || Share2;
                    
                    // Original Brand Colors
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
                    };

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
                    };

                    const style = brandStyles[platform] || 'bg-neutral-900 text-white';
                    const logo = logoNames[platform];

                    const ensureAbsoluteUrl = (url: string) => {
                      if (!url) return '';
                      if (url.startsWith('http://') || url.startsWith('https://')) return url;
                      return `https://${url}`;
                    };

                    return (
                      <a 
                        key={p.platform} 
                        href={ensureAbsoluteUrl(p.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col items-center gap-3 transition-transform hover:scale-105 shrink-0"
                      >
                        <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg ${style} transition-shadow group-hover:shadow-xl p-3 sm:p-3.5 relative overflow-hidden`}>
                          {logo ? (
                            <img 
                              src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${logo}.svg`}
                              className="w-full h-full object-contain filter invert"
                              alt={p.platform}
                              style={{ filter: 'brightness(0) invert(1)' }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <Icon size={24} className={logo ? 'hidden' : `sm:hidden ${logo ? '' : 'sm:block'}`} />
                          <Icon size={28} className={logo ? 'hidden' : 'hidden sm:block'} />
                        </div>
                        <div className="text-center hidden sm:block">
                          <p className="text-[10px] font-black uppercase text-neutral-900 tracking-tighter">{p.platform}</p>
                          <p className="text-[9px] font-bold text-neutral-400 truncate max-w-[80px]">
                            {p.url?.split('/').filter(Boolean).pop()?.replace('@', '') || 'Profile'}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}


            {/* Specialty Formats / Specialized in */}
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
            
            {/* Achievements & Milestones */}
            {data.achievements && data.achievements.length > 0 && (
              <div className="mb-12">
                <p className="text-[13px] font-black uppercase tracking-[0.2em] text-neutral-900 mb-4">Career Milestones</p>
                <div className="flex flex-wrap gap-3">
                  {data.achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs font-bold text-amber-700 shadow-sm">
                      <Trophy size={14} className="text-amber-500" />
                      {ach}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <p className="text-[13px] font-black uppercase tracking-[0.2em] text-neutral-900 mb-2">Influence Analytics</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/50 text-center shadow-sm">
                <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Total Reach</div>
                <div className="text-2xl font-black text-neutral-900">{data.total_reach || '-'}</div>
              </div>
              <div className="bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/50 text-center shadow-sm">
                <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Engagement</div>
                <div className="text-2xl font-black text-neutral-900">{data.engagement_rate || '-'}</div>
              </div>
              <div className="bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/50 text-center shadow-sm">
                <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Avg. Views</div>
                <div className="text-2xl font-black text-neutral-900">{data.avg_views || '-'}</div>
              </div>
            </div>
        </div>
      </section>

      {/* Recent Works / Portfolio Section */}
      <section className="px-8 relative z-10 mb-12">
          <div className="mb-8">
             <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-neutral-900 mb-1">Curated Showcase</h4>
             <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Recent Creative Works</p>
          </div>
         {renderedWorks}
      </section>

      {/* Minimalistic Collab & Contact Row */}
      <section className="px-8 mb-12 relative z-10">
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
              <a 
                href={`mailto:${data.contact_email}`}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-neutral-200 rounded-2xl hover:border-orange-500 hover:text-orange-500 transition-all text-xs font-black uppercase tracking-widest text-neutral-900 shadow-sm whitespace-nowrap flex-1 min-w-[160px]"
              >
                <Mail size={16} />
                Email Me
              </a>
            )}
            {data.contact_whatsapp && (
              <a 
                href={`https://wa.me/${data.contact_whatsapp.replace(/\s+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-neutral-900 rounded-2xl hover:bg-orange-600 transition-all text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-neutral-900/10 whitespace-nowrap flex-1 min-w-[160px]"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {/* PREVIEWS & LIGHTBOX MODAL */}
      {selectedWork && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 animate-fadeIn backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0,0,0,0.95)' }}
          onClick={() => setSelectedWork(null)}
        >
          <div className="absolute top-6 right-6 z-50">
            <button 
              onClick={() => setSelectedWork(null)}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all"
            >
              <Globe size={24} className="rotate-45" /> 
            </button>
          </div>
          
          <div 
            className="relative w-full max-w-5xl aspect-video rounded-[40px] overflow-hidden bg-black shadow-2xl animate-zoomIn"
            onClick={e => e.stopPropagation()}
          >
            {selectedWork.external_url ? (
              <iframe 
                src={getEmbedUrl(selectedWork.external_url)}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : selectedWork.type === 'video' ? (
              <video 
                src={getAssetUrl(selectedWork.url || selectedWork.img)} 
                controls 
                autoPlay 
                className="w-full h-full object-contain"
              />
            ) : (
              <img 
                src={getAssetUrl(selectedWork.url || selectedWork.img)} 
                className="w-full h-full object-contain"
                alt={selectedWork.title}
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
               <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2" style={{ fontFamily: 'Fraunces, serif' }}>
                 {selectedWork.title}
               </h4>
               <p className="text-xs font-bold text-white/60 uppercase tracking-[0.3em]">
                 {selectedWork.external_url ? 'EXTERNAL MASTERPIECE' : selectedWork.type === 'video' ? 'MOTION MASTERPIECE' : 'STILL GRAPHIC'}
               </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes floatSparkle {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.2; }
          50% { transform: translateY(-40px) rotate(20deg) scale(1.4); opacity: 0.9; }
        }
        .animate-float-sparkle {
          animation: floatSparkle 5s ease-in-out infinite;
        }
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-zoomIn {
          animation: zoomIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

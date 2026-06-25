import React from 'react'
import { ProfileData, DeveloperData } from '../../../types/profile'
import { getAssetUrl } from '../../../lib/supabase'
import { 
  Monitor, Code2, Database, Layout, Box, Globe, ExternalLink, 
  Terminal, Mail, Calendar, Lock, Shield, Cpu, RefreshCw, Layers,
  FileText, Star, MessageCircle, Phone, Video,
  Github, Twitter, Linkedin
} from 'lucide-react'
import { ProfileCTAs } from '../shared/ProfileCTAs'
import { trackLinkClick } from '../../../lib/analytics/track'
import { useGatedLink } from '../../../hooks/useGatedLink'

const COMMUNICATION_APPS = ['whatsapp', 'email', 'phone', 'instagram', 'snapchat', 'telegram', 'facebook', 'messenger', 'discord', 'x', 'twitter'];
const isCommunicationApp = (platform: string) => COMMUNICATION_APPS.includes(platform.toLowerCase());

function getPlatformIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes('github')) return { Icon: Github, color: '#1A1A1A' };
  if (p.includes('twitter') || p.includes('x')) return { Icon: Twitter, color: '#000000' };
  if (p.includes('linkedin')) return { Icon: Linkedin, color: '#0A66C2' };
  if (p.includes('stackoverflow')) return { Icon: Database, color: '#F48024' };
  return { Icon: Globe, color: '#71B5F5' };
}

export function DeveloperProfile({ profile, stats, hideHeader = false }: { profile: ProfileData, stats?: any, hideHeader?: boolean }) {
  const [avatarError, setAvatarError] = React.useState(false);
  const data = (profile.persona_data || {}) as DeveloperData;
  const activeTheme = (profile.profile_theme || 'default').toLowerCase();
  const { isGated, handleGatedClick, GateModal, handlePrivacyClick, PrivacyModal, setShowGate, user } = useGatedLink();

  const liveViews = stats?.totalViews || 0;
  const uniqueViews = stats?.uniqueViews || 0;
  const topCity = stats?.topCities?.[0]?.city || '';
  const isFreeProfile = profile.status !== 'paid' && profile.role !== 'owner' && profile.role !== 'staff';

  const visiblePlatforms = (data.platforms || []).filter((p: any) => {
    if (!p.url) return false;
    const isComm = isCommunicationApp(p.platform || '');
    return !(isComm && (!!user && profile.ghost_mode));
  });

  const aboutMeLanguages = (data.about?.languages && data.about.languages.length > 0)
    ? data.about.languages
    : [];

  const techStack = (data.tech_stack && data.tech_stack.length > 0)
    ? data.tech_stack
    : [];

  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return ''
    let cleaned = url.trim();
    cleaned = cleaned.replace(/^https?:\/+/i, 'https://');
    while (cleaned.startsWith('/')) {
      cleaned = cleaned.substring(1);
    }
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
      return cleaned;
    }
    return `https://${cleaned}`;
  }

  // ----------------------------------------------------
  // LAYOUT 0: ORIGINAL CLASSIC STYLE (Classic Theme)
  // ----------------------------------------------------
  if (activeTheme === 'classic') {
    return (
      <div className="min-h-screen bg-[#f8f9fa] text-neutral-900 font-mono relative overflow-x-hidden selection:bg-green-200 selection:text-green-800 p-4 sm:p-8">
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes float-slow {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              50% { transform: translateY(-15px) rotate(3deg); }
            }
            @keyframes float-medium {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              50% { transform: translateY(-25px) rotate(-3deg); }
            }
            @keyframes float-fast {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              50% { transform: translateY(-10px) rotate(5deg); }
            }
            .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
            .animate-float-medium { animation: float-medium 7s ease-in-out infinite; }
            .animate-float-fast { animation: float-fast 5s ease-in-out infinite; }
          `}} />

        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06] z-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8) 1.2px, transparent 1.2px), linear-gradient(90deg, rgba(0, 0, 0, 0.8) 1.2px, transparent 1.2px)',
            backgroundSize: '44px 44px',
            backgroundPosition: 'center center'
          }}
        />

        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-40">
          <div className="absolute top-[12%] left-[8%] text-neutral-300 animate-float-slow"><Terminal size={32} strokeWidth={1.5} /></div>
          <div className="absolute top-[25%] right-[10%] text-neutral-300 animate-float-medium"><span className="text-[32px] font-sans font-extralight">{'{ }'}</span></div>
          <div className="absolute top-[38%] left-[12%] text-neutral-300 animate-float-fast"><Database size={28} strokeWidth={1.5} /></div>
          <div className="absolute top-[52%] right-[8%] text-neutral-300 animate-float-slow"><Code2 size={32} strokeWidth={1.5} /></div>
        </div>

        {!hideHeader && (
          <div className="w-full h-48 sm:h-64 relative bg-[#f0f2f5] overflow-hidden rounded-t-[32px] sm:rounded-t-[40px] rounded-b-none z-10 border-b border-neutral-200">
            {data.featured_work_url ? (
              <img src={getAssetUrl(data.featured_work_url)} className="absolute inset-0 w-full h-full object-cover" alt="Banner" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-[#f8f9fa]/20 to-transparent" />
          </div>
        )}

        <main className={`w-full max-w-[550px] sm:max-w-[570px] mx-auto pb-20 px-4 flex flex-col items-center relative z-20 ${!hideHeader ? '' : 'pt-12 sm:pt-16'}`}>
          {!hideHeader && (
            <>
              <div className="relative -mt-24 sm:-mt-[120px] flex flex-col items-center z-30">
                <div className="relative p-[4px] rounded-full bg-white shadow-xl shadow-neutral-300/60">
                  <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden bg-neutral-100 border-4 border-white">
                    {!avatarError && profile.avatar_url ? (
                        <img
                      src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=f0f0f0&color=22c55e`}
                      className="w-full h-full object-cover"
                      alt={profile.display_name}
                    onError={() => setAvatarError(true)} />
                      ) : (
                        <div className="w-full h-full object-cover flex items-center justify-center bg-neutral-200 text-neutral-600 font-bold text-4xl " style={{ fontFamily: 'sans-serif' }}>
                          {profile.display_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="mt-3 mb-2 text-center">
                <h1 className="text-[28px] font-mono font-black text-neutral-950 tracking-widest leading-tight">
                  {(profile.display_name || 'NEW USER').toUpperCase()}
                </h1>
                <p className="text-neutral-800 font-black text-base sm:text-lg tracking-widest mt-1.5 uppercase">
                  {data.about?.role || data.tagline || 'SYSTEM ENGINEER'}
                </p>
              </div>

              {profile.bio && (
                <p className="text-neutral-800 font-sans text-[15px] sm:text-[16px] text-center mt-1.5 mb-2.5 max-w-[92%] leading-relaxed font-extrabold">
                  {profile.bio}
                </p>
              )}

              {visiblePlatforms && visiblePlatforms.length > 0 && (
                <div className="w-full flex flex-wrap justify-center gap-6 mt-2 mb-4 z-20">
                  {visiblePlatforms.map((p, i) => {
                    if (!p.url) return null
                    const { Icon } = getPlatformIcon(p.platform || '')
                    const isBlurred = isCommunicationApp(p.platform || '') && !user;
                    return (
                      <a
                        key={i}
                        href={isBlurred ? undefined : ensureAbsoluteUrl(p.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (isBlurred) {
                            e.preventDefault();
                            setShowGate(true);
                            return;
                          }
                          handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url));
                          if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank');
                        }}
                        className={`relative hover:scale-110 transition-transform duration-300 text-neutral-500 hover:text-[#0A66C2] social-link-item cursor-pointer ${isBlurred ? 'opacity-70' : ''}`}
                      >
                        <div className={`w-full h-full flex items-center justify-center ${isBlurred ? 'ghost-blur-item' : ''}`}>
                          <Icon size={20} />
                        </div>
                        {isBlurred && (
                          <div className="absolute inset-0 flex items-center justify-center z-10">
                            <Lock size={12} className="text-neutral-700" strokeWidth={2.5} />
                          </div>
                        )}
                      </a>
                    )
                  })}
                </div>
              )}
              {user && profile.ghost_mode && (
                <div className="w-full text-center mt-2 mb-4 animate-fadeIn z-20">
                  <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-widest shadow-sm">
                    <Lock size={12} /> Privacy Mode enabled
                  </p>
                </div>
              )}
            </>
          )}

          {data.about?.status && (
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-green-100 border-2 border-green-300 text-green-950 font-mono text-[13px] sm:text-[14px] font-black uppercase tracking-widest mt-2 shadow-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
              </span>
              {data.about.status === 'Working at Company' && data.about.company ? `Currently at ${data.about.company}` : data.about.status}
            </div>
          )}

          {/* STATS GRID */}
          <div 
            className={`w-full grid grid-cols-2 gap-2 mt-6 bg-white border-2 border-neutral-300 rounded-[20px] p-4 shadow-md font-mono text-center relative z-20 ${isFreeProfile ? 'cursor-pointer hover:border-green-500 transition-colors' : ''}`}
            onClick={() => isFreeProfile && setShowGate(true)}
          >
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Impressions</span>
              <span className={`text-lg font-black text-neutral-900 mt-1 ${isFreeProfile ? 'blur-[4px] select-none opacity-50' : ''}`}>
                {liveViews}
              </span>
            </div>
            <div className="flex flex-col items-center border-l border-neutral-200">
              <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Top City</span>
              <span className={`text-xs font-black text-neutral-900 mt-1.5 truncate max-w-full px-1 ${isFreeProfile ? 'blur-[4px] select-none opacity-50' : ''}`}>
                {topCity || 'N/A'}
              </span>
            </div>
          </div>

          <div className="w-full max-w-sm mt-4 z-20">
            <ProfileCTAs profile={profile} accentColor="#16a34a" />
          </div>

          {(data.about?.role || data.about?.status || data.about?.company || data.about?.mission) && (
            <div className="w-full mt-10 text-left bg-white border-2 border-neutral-300 border-l-[6px] border-l-green-600 rounded-[32px] rounded-l-none p-8 shadow-xl relative group hover:shadow-2xl hover:border-neutral-400 transition-all duration-300">
              <div className="absolute -top-4 -left-3 rotate-[-10deg] z-40 bg-gradient-to-r from-amber-500 to-orange-600 border-2 border-white text-white px-3 py-1.5 rounded-2xl shadow-lg select-none pointer-events-none">
                <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 font-mono">⚡️ SUPER_CHARGED</span>
              </div>
              <div className="absolute top-6 right-6 flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span className="block text-[13px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-6 mt-2">About Me</span>
              <div className="space-y-4 font-mono text-sm">
                {data.about?.role && (
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <span className="text-neutral-500 font-bold text-[12px] uppercase tracking-wider"><Terminal size={12} className="inline mr-1" /> ROLE</span>
                    <span className="text-neutral-900 font-black text-[15px]">{data.about.role}</span>
                  </div>
                )}
                {data.about?.status && (
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <span className="text-neutral-500 font-bold text-[12px] uppercase tracking-wider">STATUS</span>
                    <span className="text-green-700 font-black text-[15px]">{data.about.status}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {((aboutMeLanguages && aboutMeLanguages.length > 0) || (techStack && techStack.length > 0)) && (
            <div className="w-full mt-10 bg-white border-2 border-neutral-300 rounded-[32px] p-8 shadow-xl space-y-8 relative">
              {aboutMeLanguages && aboutMeLanguages.length > 0 && (
                <div>
                  <span className="block text-[13px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-4">Core Languages</span>
                  <div className="flex flex-wrap gap-2.5">
                    {aboutMeLanguages.map((l, i) => (
                      <span key={i} className="text-[12px] bg-neutral-50 text-neutral-500 px-4 py-2 rounded-xl border border-neutral-300 font-black uppercase shadow-sm">{l}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {data.projects && data.projects.length > 0 && (
            <div className="w-full mt-10 text-left">
              <span className="block text-[13px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-6">Featured Projects</span>
              <div className="space-y-6">
                {data.projects.map((project: any, i: number) => (
                  <div key={i} className="bg-white border-2 border-neutral-300 rounded-[32px] p-6 shadow-lg relative group hover:border-green-500 transition-colors duration-300">
                    {project.stars !== undefined && project.stars > 0 && (
                      <div className="absolute top-6 right-6 flex items-center gap-1.5 text-orange-500 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                        <Star size={14} className="fill-orange-500" />
                        <span className="text-xs font-black">{project.stars}</span>
                      </div>
                    )}
                    <h4 className="text-lg font-black text-neutral-900 mb-2">{project.name}</h4>
                    {project.description && (
                      <p className="text-sm text-neutral-600 mb-4 pr-16">{project.description}</p>
                    )}
                    {(project.live_url || project.github_url) && (
                      <a
                        href={ensureAbsoluteUrl(project.live_url || project.github_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-green-600 hover:text-green-700 bg-green-50 px-4 py-2 rounded-xl border border-green-200 transition-colors"
                      >
                        Launch Project <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(data.contact_email || data.contact_whatsapp || data.quick_talk_url || data.collab_types) && (
            <div className="w-full mt-10 bg-white border-2 border-neutral-300 rounded-[32px] p-8 shadow-xl relative">
              <span className="block text-[13px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-6">Collaboration & Contact</span>
              
              {data.collab_types && (
                <p className="text-sm text-neutral-800 font-bold mb-6 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                  <span className="text-neutral-500 uppercase text-[10px] tracking-widest block mb-1">Looking for</span>
                  {data.collab_types}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                {data.contact_email && (
                  <a href={`mailto:${data.contact_email}`} className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white rounded-xl text-[12px] font-black uppercase tracking-wider hover:bg-neutral-800 transition-colors">
                    <Mail size={16} /> Email
                  </a>
                )}
                {data.contact_whatsapp && (
                  <a href={`https://wa.me/${data.contact_whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-xl text-[12px] font-black uppercase tracking-wider hover:bg-[#128C7E] transition-colors">
                    <Phone size={16} /> WhatsApp
                  </a>
                )}
                {data.quick_talk_url && (
                  <a href={ensureAbsoluteUrl(data.quick_talk_url)} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-[12px] font-black uppercase tracking-wider hover:bg-blue-700 transition-colors privacy-target">
                    <Video size={16} /> Book Chat
                  </a>
                )}
              </div>
            </div>
          )}

          {data.resume_url && (
            <div className="w-full mt-8 flex justify-center z-20">
              <a 
                href={data.resume_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-[20px] font-black text-[14px] uppercase tracking-widest hover:scale-105 transition-transform duration-300 shadow-xl shadow-neutral-900/20"
              >
                <FileText size={20} /> View Documentation (CV)
              </a>
            </div>
          )}

        </main>
        <GateModal />
        <PrivacyModal />
      </div>
    )
  }

  // ----------------------------------------------------
  // LAYOUT 1: ARCHITECTURAL SCHEMATIC (Blueprint Theme)
  // ----------------------------------------------------
  if (activeTheme === 'blueprint') {
    return (
      <div className="min-h-screen bg-[#001B2E] text-[#64FFDA] font-mono relative overflow-x-hidden selection:bg-[#64FFDA] selection:text-[#001B2E] p-4 sm:p-8 flex flex-col justify-start items-center">
        {/* CSS rules for blueprints */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .grid-blueprint {
              background-image: 
                linear-gradient(rgba(100, 255, 218, 0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(100, 255, 218, 0.15) 1px, transparent 1px),
                linear-gradient(rgba(100, 255, 218, 0.05) 20px, transparent 20px),
                linear-gradient(90deg, rgba(100, 255, 218, 0.05) 20px, transparent 20px);
              background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
              background-position: center center;
            }
            .blueprint-border {
              border: 1px solid rgba(100, 255, 218, 0.3);
              box-shadow: inset 0 0 20px rgba(100, 255, 218, 0.05);
            }
          `
        }} />

        {/* Blueprint Banner (Background) */}
        {!hideHeader && data.featured_work_url && (
          <div 
            className="absolute top-0 left-0 w-full h-64 sm:h-80 z-0 pointer-events-none opacity-30 mix-blend-screen"
            style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)' }}
          >
            <img src={getAssetUrl(data.featured_work_url)} className="w-full h-full object-cover filter contrast-125 sepia-[0.5] hue-rotate-180" alt="Banner" />
          </div>
        )}

        {/* Technical drafting grid background */}
        <div className="absolute inset-0 pointer-events-none grid-blueprint z-0 opacity-80" />
        
        {/* Blueprint outer frame with drafting details */}
        <div className="absolute top-4 left-4 right-4 bottom-4 border border-[#64FFDA]/30 pointer-events-none z-10 p-4 hidden md:flex flex-col justify-between text-[10px] text-[#64FFDA]/50 select-none">
          <div className="flex justify-between">
            <span>SYS_ID: PEHCHAAN_DEV_PRTCL</span>
            <span>MODEL: X-99-V2</span>
            <span>GRID_REF: [X_1920, Y_1080]</span>
          </div>
          <div className="flex justify-between">
            <span>SCALE: 1:1 [NATIVE]</span>
            <span>SPEC: BLUEPRINT_SCHEMA</span>
            <span>STATUS: ONLINE</span>
          </div>
        </div>

        <main className={`w-full max-w-[620px] mx-auto pb-24 px-4 flex flex-col items-center relative z-20 ${hideHeader ? "pt-12 sm:pt-16" : "pt-8"}`}>
          
          {/* Schematic Blueprint Title Card block */}
          {!hideHeader && (
            <div className="w-full blueprint-border bg-[#001B2E]/90 backdrop-blur-md p-8 mb-8 text-left relative overflow-hidden group hover:border-[#64FFDA]/60 transition-colors duration-500">
              {/* Corner Crosshairs */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#64FFDA]" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#64FFDA]" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#64FFDA]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#64FFDA]" />

              <div className="absolute top-3 right-4 text-[9px] text-[#64FFDA]/60 font-mono tracking-widest">// VIEW_01</div>
              
              <div className="flex flex-col sm:flex-row items-center gap-8 pb-6 border-b border-[#64FFDA]/20">
                {/* Technical square photo frame */}
                <div className="relative shrink-0">
                  <div className="w-36 h-36 blueprint-border p-1.5 bg-[#001B2E] relative group-hover:shadow-[0_0_20px_rgba(100,255,218,0.2)] transition-shadow duration-500">
                    <div className="w-full h-full border border-dashed border-[#64FFDA]/50 overflow-hidden bg-[#0A192F]">
                      {!avatarError && profile.avatar_url ? (
                      <img
                        src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=0A192F&color=64FFDA`}
                        className="w-full h-full object-cover filter contrast-125 saturate-50 brightness-90 mix-blend-screen opacity-90"
                        alt={profile.display_name}
                      onError={() => setAvatarError(true)} />
                    ) : (
                      <div className="w-full h-full object-cover filter contrast-125 saturate-50 brightness-90 mix-blend-screen opacity-90 flex items-center justify-center bg-neutral-200 text-neutral-600 font-bold text-4xl " style={{ fontFamily: 'sans-serif' }}>
                        {profile.display_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    </div>
                  </div>
                </div>

                <div className="text-center sm:text-left flex-grow mt-4 sm:mt-0">
                  <div className="text-[10px] text-[#64FFDA]/70 font-bold uppercase tracking-[0.2em] mb-2">// ENTITY_IDENTIFIER</div>
                  <h1 className="text-3xl sm:text-4xl font-light text-white tracking-widest uppercase mb-3">
                    {profile.display_name}
                  </h1>
                  <p className="text-sm font-medium text-[#64FFDA] uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2">
                    <Monitor size={16} className="opacity-70" /> {data.about?.role || 'SYSTEM ARCHITECT'}
                  </p>
                </div>
              </div>

              {profile.bio && (
                <div className="mt-6">
                  <span className="text-[10px] text-[#64FFDA]/50 block uppercase font-bold mb-2">// INIT_PARAMS</span>
                  <p className="text-sm leading-relaxed text-[#8892B0] pl-4 border-l border-[#64FFDA]/40">
                    {profile.bio}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STATS GRID */}
          <div 
            className={`w-full blueprint-border bg-[#001B2E]/90 backdrop-blur-md p-6 mb-8 text-center relative group hover:border-[#64FFDA]/60 transition-colors duration-500 ${isFreeProfile ? 'cursor-pointer' : ''}`}
            onClick={() => isFreeProfile && setShowGate(true)}
          >
            {/* Corner Crosshairs */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#64FFDA]/50" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#64FFDA]/50" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#64FFDA]/50" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#64FFDA]/50" />
            
            <div className="grid grid-cols-2 gap-2 font-mono">
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-[#64FFDA]/50 uppercase tracking-widest font-bold">IMPRESSIONS</span>
                <span className={`text-xl font-light text-white mt-1.5 ${isFreeProfile ? 'blur-[4px] select-none opacity-50' : ''}`}>
                  {liveViews}
                </span>
              </div>
              <div className="flex flex-col items-center border-l border-[#64FFDA]/20">
                <span className="text-[9px] text-[#64FFDA]/50 uppercase tracking-widest font-bold">TOP_CITY</span>
                <span className={`text-xs font-light text-white mt-2 truncate max-w-full px-1 ${isFreeProfile ? 'blur-[4px] select-none opacity-50' : ''}`}>
                  {topCity.toUpperCase() || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Infrastructure Specs */}
          {(data.about?.status || data.about?.company || data.about?.mission) && (
            <div className="w-full blueprint-border bg-[#001B2E]/90 backdrop-blur-md p-8 mb-8 text-left relative group hover:border-[#64FFDA]/60 transition-colors duration-500">
              <h3 className="text-xs font-medium uppercase text-white tracking-[0.2em] mb-6 flex items-center gap-3">
                <span className="text-[#64FFDA]">01.</span> NODE CONFIGURATION
                <div className="flex-grow h-px bg-gradient-to-r from-[#64FFDA]/20 to-transparent ml-2" />
              </h3>
              <div className="space-y-4 text-sm text-[#8892B0]">
                {data.about.status && (
                  <div className="flex justify-between items-center py-2 border-b border-[#64FFDA]/10">
                    <span className="text-[#64FFDA]/60">STATUS:</span>
                    <span className="text-white">{data.about.status}</span>
                  </div>
                )}
                {data.about.company && (
                  <div className="flex justify-between items-center py-2 border-b border-[#64FFDA]/10">
                    <span className="text-[#64FFDA]/60">DEPLOYMENT:</span>
                    <span className="text-white">{data.about.company}</span>
                  </div>
                )}
                {data.about.mission && (
                  <div className="pt-2">
                    <span className="text-[#64FFDA]/60 block mb-2">OBJECTIVE:</span>
                    <p className="bg-[#0A192F] p-4 border border-[#64FFDA]/20 text-[#8892B0]">
                      {data.about.mission}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Compiled Modules */}
          {((aboutMeLanguages && aboutMeLanguages.length > 0) || (techStack && techStack.length > 0)) && (
            <div className="w-full blueprint-border bg-[#001B2E]/90 backdrop-blur-md p-8 mb-8 text-left relative group hover:border-[#64FFDA]/60 transition-colors duration-500">
              <h3 className="text-xs font-medium uppercase text-white tracking-[0.2em] mb-6 flex items-center gap-3">
                <span className="text-[#64FFDA]">02.</span> TECHNICAL PROTOCOLS
                <div className="flex-grow h-px bg-gradient-to-r from-[#64FFDA]/20 to-transparent ml-2" />
              </h3>
              
              {aboutMeLanguages && aboutMeLanguages.length > 0 && (
                <div className="mb-8">
                  <span className="text-[10px] text-[#64FFDA]/60 uppercase block mb-3">// SYNTAX</span>
                  <div className="flex flex-wrap gap-2">
                    {aboutMeLanguages.map((l, idx) => (
                      <span key={idx} className="border border-[#64FFDA]/30 bg-[#0A192F] px-4 py-2 text-[11px] uppercase text-[#64FFDA] hover:bg-[#64FFDA]/10 transition-colors duration-200">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {techStack && techStack.length > 0 && (
                <div>
                  <span className="text-[10px] text-[#64FFDA]/60 uppercase block mb-3">// COMPONENTS</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {techStack.map(tech => (
                      <div key={tech} className="border border-[#64FFDA]/20 bg-[#0A192F] p-3 text-center hover:border-[#64FFDA]/50 hover:bg-[#64FFDA]/5 transition-all duration-300">
                        <span className="text-[11px] uppercase text-[#8892B0] hover:text-[#64FFDA] transition-colors">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <div className="w-full mb-8 text-left">
              <span className="block text-[10px] text-[#64FFDA]/60 uppercase tracking-[0.2em] mb-4">// 03. SCHEMATIC RELEASES</span>
              <div className="space-y-4">
                {data.projects.map((project: any, i: number) => (
                  <div key={i} className="blueprint-border bg-[#001B2E]/90 p-6 relative group hover:border-[#64FFDA]/60 transition-colors duration-500">
                    <div className="absolute top-4 right-4 text-[10px] text-[#64FFDA]/40 font-mono flex items-center gap-2">
                      {project.stars !== undefined && project.stars > 0 && (
                        <span className="flex items-center gap-1 text-orange-400">
                          <Star size={10} className="fill-orange-400" /> {project.stars}
                        </span>
                      )}
                      v1.0.{i}
                    </div>
                    <h4 className="text-lg font-light text-white mb-2 uppercase flex items-center gap-3">
                      <Box size={18} className="text-[#64FFDA]" /> {project.name}
                    </h4>
                    {project.description && (
                      <p className="text-sm text-[#8892B0] leading-relaxed mb-4">
                        {project.description}
                      </p>
                    )}
                    {project.live_url && (
                      <a
                        href={ensureAbsoluteUrl(project.live_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[11px] uppercase text-[#64FFDA] hover:text-white transition-colors"
                      >
                        Launch Schema <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Platforms */}
          {data.platforms && data.platforms.length > 0 && (
            <div className="w-full text-left mb-8">
              <span className="block text-[10px] text-[#64FFDA]/60 uppercase tracking-[0.2em] mb-4">// 04. INTEGRATED CHANNELS</span>
              <div className="flex flex-wrap gap-3">
                {visiblePlatforms.map((p, i) => {
                  if (!p.url) return null
                  const { Icon } = getPlatformIcon(p.platform || '')
                  const isBlurred = isCommunicationApp(p.platform || '') && !user;
                  return (
                    <a
                      key={i}
                      href={isBlurred ? undefined : ensureAbsoluteUrl(p.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (isBlurred) {
                          e.preventDefault();
                          setShowGate(true);
                          return;
                        }
                        handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url));
                        if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank');
                      }}
                      className="blueprint-border bg-[#0A192F] hover:bg-[#64FFDA]/10 px-5 py-3 text-xs flex items-center gap-3 transition-all duration-300 relative group cursor-pointer"
                    >
                      <div className={`flex items-center gap-3 ${isBlurred ? 'ghost-blur-item' : ''}`}>
                        <Icon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[11px] uppercase text-[#8892B0] group-hover:text-[#64FFDA] transition-colors">{p.platform}</span>
                      </div>
                      {isBlurred && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#0A192F]/40">
                          <Lock size={14} className="text-[#64FFDA]" strokeWidth={2.5} />
                        </div>
                      )}
                    </a>
                  )
                })}
                {user && profile.ghost_mode && (
                  <div className="w-full text-center py-2 animate-fadeIn">
                    <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-widest shadow-sm">
                      <Lock size={12} /> Privacy Mode enabled
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Contact & Collab */}
          {!(user && profile.ghost_mode) && (data.contact_email || data.contact_whatsapp || data.quick_talk_url || data.collab_types) && (
            <div className="w-full blueprint-border bg-[#001B2E]/90 backdrop-blur-md p-8 mb-8 text-left relative group hover:border-[#64FFDA]/60 transition-colors duration-500">
              <h3 className="text-xs font-medium uppercase text-white tracking-[0.2em] mb-6 flex items-center gap-3">
                <span className="text-[#64FFDA]">05.</span> COMM_PROTOCOLS
                <div className="flex-grow h-px bg-gradient-to-r from-[#64FFDA]/20 to-transparent ml-2" />
              </h3>

              {data.collab_types && (
                <div className="mb-6">
                  <span className="text-[10px] text-[#64FFDA]/60 uppercase block mb-2">// DIRECTIVES</span>
                  <p className="text-sm text-[#8892B0] border-l border-[#64FFDA]/40 pl-4">{data.collab_types}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                {data.contact_email && (
                  <a 
                    href={!user ? undefined : `mailto:${data.contact_email}`}
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        setShowGate(true);
                      }
                    }}
                    className={`text-xs uppercase text-[#64FFDA] border border-[#64FFDA]/30 px-4 py-2 flex items-center gap-2 hover:bg-[#64FFDA]/10 transition-colors cursor-pointer relative ${!user ? 'opacity-70' : ''}`}
                  >
                    <div className={`flex items-center gap-2 ${!user ? 'ghost-blur-item' : ''}`}>
                      <Mail size={14} /> PING_MAIL
                    </div>
                    {!user && <Lock size={12} className="text-[#64FFDA]" />}
                  </a>
                )}
                {data.contact_whatsapp && (
                  <a 
                    href={!user ? undefined : `https://wa.me/${data.contact_whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        setShowGate(true);
                      }
                    }}
                    className={`text-xs uppercase text-[#25D366] border border-[#25D366]/30 px-4 py-2 flex items-center gap-2 hover:bg-[#25D366]/10 transition-colors cursor-pointer relative ${!user ? 'opacity-70' : ''}`}
                  >
                    <div className={`flex items-center gap-2 ${!user ? 'ghost-blur-item' : ''}`}>
                      <Phone size={14} /> EXT_COMMS
                    </div>
                    {!user && <Lock size={12} className="text-[#25D366]" />}
                  </a>
                )}
                {data.quick_talk_url && (
                  <a 
                    href={!user ? undefined : ensureAbsoluteUrl(data.quick_talk_url)}
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        setShowGate(true);
                      }
                    }}
                    className={`text-xs uppercase text-[#58A6FF] border border-[#58A6FF]/30 px-4 py-2 flex items-center gap-2 hover:bg-[#58A6FF]/10 transition-colors privacy-target cursor-pointer relative ${!user ? 'opacity-70' : ''}`}
                  >
                    <div className={`flex items-center gap-2 ${!user ? 'ghost-blur-item' : ''}`}>
                      <Video size={14} /> SYNC_LINK
                    </div>
                    {!user && <Lock size={12} className="text-[#58A6FF]" />}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Resume */}
          {data.resume_url && (
            <div className="w-full mb-8 flex justify-center z-20">
              <a 
                href={data.resume_url}
                target="_blank"
                rel="noreferrer"
                className="blueprint-border bg-[#64FFDA]/10 hover:bg-[#64FFDA]/20 text-[#64FFDA] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 transition-all duration-300"
              >
                <FileText size={16} /> EXTRACT_DOCS (CV)
              </a>
            </div>
          )}

          {/* Connection Actions */}
          <div className="w-full mb-8 z-20">
            <ProfileCTAs profile={profile} accentColor="#64FFDA" />
          </div>

        </main>
        <GateModal />
        <PrivacyModal />
      </div>
    )
  }

  // ----------------------------------------------------
  // LAYOUT 2: GLOWING CYBER-DECK TACTICAL HUD (Hacker Theme)
  // ----------------------------------------------------
  if (activeTheme === 'hacker') {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#00FF41] font-mono relative overflow-x-hidden selection:bg-[#00FF41] selection:text-black p-4 sm:p-8 flex flex-col justify-start items-center">
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes crt-flicker {
              0% { opacity: 0.97; }
              50% { opacity: 1; }
              100% { opacity: 0.98; }
            }
            @keyframes scanline {
              0% { transform: translateY(-100vh); }
              100% { transform: translateY(100vh); }
            }
            .crt-overlay {
              background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
              background-size: 100% 4px;
              animation: crt-flicker 0.15s infinite;
            }
            .hacker-glow {
              text-shadow: 0 0 5px #00FF41, 0 0 10px #00FF41;
            }
            .hacker-border {
              border: 1px solid #00FF41;
              box-shadow: 0 0 10px rgba(0, 255, 65, 0.2), inset 0 0 10px rgba(0, 255, 65, 0.1);
            }
            .hacker-border:hover {
              box-shadow: 0 0 15px rgba(0, 255, 65, 0.4), inset 0 0 15px rgba(0, 255, 65, 0.2);
            }
            .matrix-bg {
              background-color: #0D0D0D;
              background-image: radial-gradient(circle at 50% 50%, rgba(0, 255, 65, 0.05) 0%, transparent 60%);
            }
          `
        }} />
        
        {/* CRT Scanline Overlay & Scanning Bar */}
        <div className="absolute inset-0 pointer-events-none z-50 crt-overlay opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 pointer-events-none z-40 bg-gradient-to-b from-transparent via-[#00FF41]/10 to-transparent h-32 animate-[scanline_8s_linear_infinite] opacity-50" />

        {/* Hacker Banner (Background) */}
        {!hideHeader && data.featured_work_url && (
          <div 
            className="absolute top-0 left-0 w-full h-64 sm:h-80 z-0 pointer-events-none opacity-30 mix-blend-screen"
            style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)' }}
          >
            <img src={getAssetUrl(data.featured_work_url)} className="w-full h-full object-cover filter brightness-75 contrast-125 sepia-[1] hue-rotate-50 saturate-200" alt="Banner" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9IiMwMGZmNDEiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] pointer-events-none" />
          </div>
        )}

        <main className={`w-full max-w-[620px] mx-auto pb-24 px-4 flex flex-col items-center relative z-20 ${hideHeader ? "pt-12 sm:pt-16" : "pt-8"}`}>
          
          {!hideHeader && (
            <div className="w-full hacker-border bg-black/80 p-6 mb-8 text-left relative overflow-hidden">
              <div className="text-[10px] text-[#00FF41]/70 mb-4 font-bold uppercase tracking-widest flex items-center justify-between">
                <span>root@system:~# whoami</span>
                <span className="animate-pulse">_</span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative group">
                  <div className="w-32 h-32 hacker-border p-1 bg-black relative">
                    <div className="w-full h-full overflow-hidden relative">
                      {!avatarError && profile.avatar_url ? (
                      <img
                        src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=000&color=00FF41`}
                        className="w-full h-full object-cover filter contrast-150 saturate-0"
                        alt={profile.display_name}
                      onError={() => setAvatarError(true)} />
                    ) : (
                      <div className="w-full h-full object-cover filter contrast-150 saturate-0 flex items-center justify-center bg-neutral-200 text-neutral-600 font-bold text-4xl " style={{ fontFamily: 'sans-serif' }}>
                        {profile.display_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                      <div className="absolute inset-0 bg-[#00FF41]/20 mix-blend-color pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="text-center sm:text-left flex-grow">
                  <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-widest uppercase mb-2 hacker-glow">
                    {profile.display_name || 'UNKNOWN_USER'}
                  </h1>
                  <p className="text-sm text-[#00FF41] uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2">
                    <Terminal size={14} /> {data.about?.role || 'ROOT_ACCESS'}
                  </p>
                  {profile.bio && (
                    <p className="text-xs leading-relaxed text-[#00FF41]/80 mt-4 border-l-2 border-[#00FF41]/50 pl-3">
                      <span className="text-[#00FF41] opacity-50 mr-2">&gt;</span>{profile.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STATS GRID */}
          <div 
            className={`w-full hacker-border bg-black/80 p-5 mb-8 text-center relative ${isFreeProfile ? 'cursor-pointer' : ''}`}
            onClick={() => isFreeProfile && setShowGate(true)}
          >
            <div className="absolute top-2 right-4 text-[8px] text-[#00FF41]/40 font-mono tracking-widest">SYS_METRICS</div>
            <div className="grid grid-cols-3 gap-2 font-mono">
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-[#00FF41]/60 uppercase tracking-widest">IMPR_CNT</span>
                <span className={`text-lg font-bold text-[#00FF41] hacker-glow mt-1.5 ${isFreeProfile ? 'blur-[4px] select-none opacity-50' : ''}`}>
                  {liveViews}
                </span>
              </div>
              <div className="flex flex-col items-center border-x border-[#00FF41]/30">
                <span className="text-[9px] text-[#00FF41]/60 uppercase tracking-widest">SESS_CNT</span>
                <span className={`text-lg font-bold text-[#00FF41] hacker-glow mt-1.5 ${isFreeProfile ? 'blur-[4px] select-none opacity-50' : ''}`}>
                  {uniqueViews}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-[#00FF41]/60 uppercase tracking-widest">LOC_REF</span>
                <span className={`text-xs font-bold text-[#00FF41] hacker-glow mt-2 truncate max-w-full px-1 ${isFreeProfile ? 'blur-[4px] select-none opacity-50' : ''}`}>
                  {topCity.toUpperCase() || 'NULL'}
                </span>
              </div>
            </div>
          </div>

          {(data.about?.status || data.about?.company || data.about?.mission) && (
            <div className="w-full hacker-border bg-black/80 p-6 mb-8 text-left relative">
              <h3 className="text-sm font-bold uppercase text-[#00FF41] tracking-widest mb-4 flex items-center gap-2 border-b border-[#00FF41]/30 pb-2">
                <Layers size={14} /> SYS_VARS
              </h3>
              <div className="space-y-3 text-xs">
                {data.about.status && (
                  <p className="flex items-center gap-3">
                    <span className="text-[#00FF41]/60 w-24">STATUS:</span> 
                    <span className="text-white bg-[#00FF41]/10 px-2 py-0.5 border border-[#00FF41]/30">{data.about.status}</span>
                  </p>
                )}
                {data.about.company && (
                  <p className="flex items-center gap-3">
                    <span className="text-[#00FF41]/60 w-24">HOST:</span> 
                    <span className="text-white">{data.about.company}</span>
                  </p>
                )}
                {data.about.mission && (
                  <div className="pt-2">
                    <span className="text-[#00FF41]/60 block mb-2">DIRECTIVE:</span>
                    <p className="text-[#00FF41]/90 p-3 border border-[#00FF41]/30 bg-[#00FF41]/5">
                      {data.about.mission}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {((aboutMeLanguages && aboutMeLanguages.length > 0) || (techStack && techStack.length > 0)) && (
            <div className="w-full hacker-border bg-black/80 p-6 mb-8 text-left">
              <h3 className="text-sm font-bold uppercase text-[#00FF41] tracking-widest mb-6 flex items-center gap-2 border-b border-[#00FF41]/30 pb-2">
                <Code2 size={14} /> EXECUTABLES
              </h3>
              
              {aboutMeLanguages && aboutMeLanguages.length > 0 && (
                <div className="mb-6">
                  <span className="text-[10px] text-[#00FF41]/60 uppercase tracking-widest block mb-3"># LANGUAGES</span>
                  <div className="flex flex-wrap gap-2">
                    {aboutMeLanguages.map((l, idx) => (
                      <span key={idx} className="border border-[#00FF41]/50 bg-black px-3 py-1 text-xs uppercase text-white hover:bg-[#00FF41] hover:text-black transition-colors cursor-default">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {techStack && techStack.length > 0 && (
                <div>
                  <span className="text-[10px] text-[#00FF41]/60 uppercase tracking-widest block mb-3"># MODULES</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {techStack.map(tech => (
                      <div key={tech} className="border border-[#00FF41]/30 bg-[#00FF41]/5 p-2 text-center hover:bg-[#00FF41]/20 transition-colors">
                        <span className="text-xs uppercase text-white">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {data.projects && data.projects.length > 0 && (
            <div className="w-full mb-8 text-left">
              <span className="block text-[10px] text-[#00FF41]/60 uppercase tracking-widest mb-3"># ACTIVE_PROCESSES</span>
              <div className="space-y-4">
                {data.projects.map((project: any, i: number) => (
                  <div key={i} className="hacker-border bg-black/80 p-5 hover:bg-[#00FF41]/5 transition-colors relative">
                    <div className="absolute top-4 right-4 text-[10px] text-[#00FF41]/40 font-mono flex items-center gap-2">
                      {project.stars !== undefined && project.stars > 0 && (
                        <span className="flex items-center gap-1 text-orange-400">
                          <Star size={10} className="fill-orange-400" /> {project.stars}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2 uppercase flex items-center gap-2">
                      <RefreshCw size={12} className="text-[#00FF41]" /> {project.name}
                    </h4>
                    {project.description && (
                      <p className="text-xs text-[#00FF41]/80 mb-3 pl-3 border-l border-[#00FF41]/30">
                        {project.description}
                      </p>
                    )}
                    {project.live_url && (
                      <a
                        href={ensureAbsoluteUrl(project.live_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] uppercase text-[#00FF41] hover:text-white border-b border-[#00FF41] pb-0.5 inline-flex items-center gap-1"
                      >
                        EXECUTE <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {visiblePlatforms && visiblePlatforms.length > 0 && (
            <div className="w-full text-left mb-8">
              <span className="block text-[10px] text-[#00FF41]/60 uppercase tracking-widest mb-3"># NETWORK_NODES</span>
              <div className="flex flex-wrap gap-3">
                {visiblePlatforms.map((p, i) => {
                  if (!p.url) return null
                  const { Icon } = getPlatformIcon(p.platform || '')
                  const isBlurred = isCommunicationApp(p.platform || '') && !user;
                  return (
                    <a
                      key={i}
                      href={isBlurred ? undefined : ensureAbsoluteUrl(p.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (isBlurred) {
                          e.preventDefault();
                          setShowGate(true);
                          return;
                        }
                        handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url));
                        if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank');
                      }}
                      className="hacker-border bg-black hover:bg-[#00FF41] hover:text-black px-4 py-2 text-xs flex items-center gap-2 transition-all relative cursor-pointer"
                    >
                      <div className={`flex items-center gap-2 ${isBlurred ? 'ghost-blur-item' : ''}`}>
                        {Icon ? (
                          <Icon size={12} />
                        ) : (
                          <Globe size={12} />
                        )}
                        <span className="uppercase font-bold">{p.platform}</span>
                      </div>
                      {isBlurred && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40">
                          <Lock size={12} className="text-[#00FF41]" strokeWidth={2.5} />
                        </div>
                      )}
                    </a>
                  )
                })}
                {user && profile.ghost_mode && (
                  <div className="w-full text-center py-2 animate-fadeIn">
                    <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-widest shadow-sm">
                      <Lock size={12} /> Privacy Mode enabled
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!(user && profile.ghost_mode) && (data.contact_email || data.contact_whatsapp || data.quick_talk_url || data.collab_types) && (
            <div className="w-full hacker-border bg-black/80 p-6 mb-8 text-left relative">
              <h3 className="text-sm font-bold uppercase text-[#00FF41] tracking-widest mb-4 flex items-center gap-2 border-b border-[#00FF41]/30 pb-2">
                <Layers size={14} /> SYS_ADMIN_CONTACTS
              </h3>
              
              {data.collab_types && (
                <div className="mb-4 pt-2">
                  <span className="text-[#00FF41]/60 block mb-2 text-xs">DIRECTIVE:</span>
                  <p className="text-[#00FF41]/90 p-3 border border-[#00FF41]/30 bg-[#00FF41]/5 text-xs">
                    {data.collab_types}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 mt-4">
                {data.contact_email && (
                  <a 
                    href={!user ? undefined : `mailto:${data.contact_email}`}
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        setShowGate(true);
                      }
                    }}
                    className={`text-xs uppercase text-[#00FF41] border border-[#00FF41]/50 bg-black px-4 py-2 flex items-center gap-2 hover:bg-[#00FF41] hover:text-black transition-colors cursor-pointer relative ${!user ? 'opacity-70' : ''}`}
                  >
                    <div className={`flex items-center gap-2 ${!user ? 'ghost-blur-item' : ''}`}>
                      <Mail size={14} /> /bin/mail
                    </div>
                    {!user && <Lock size={12} className="text-[#00FF41]" />}
                  </a>
                )}
                {data.contact_whatsapp && (
                  <a 
                    href={!user ? undefined : `https://wa.me/${data.contact_whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        setShowGate(true);
                      }
                    }}
                    className={`text-xs uppercase text-[#00FF41] border border-[#00FF41]/50 bg-black px-4 py-2 flex items-center gap-2 hover:bg-[#00FF41] hover:text-black transition-colors cursor-pointer relative ${!user ? 'opacity-70' : ''}`}
                  >
                    <div className={`flex items-center gap-2 ${!user ? 'ghost-blur-item' : ''}`}>
                      <Phone size={14} /> /dev/tty
                    </div>
                    {!user && <Lock size={12} className="text-[#00FF41]" />}
                  </a>
                )}
                {data.quick_talk_url && (
                  <a 
                    href={!user ? undefined : ensureAbsoluteUrl(data.quick_talk_url)}
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        setShowGate(true);
                      }
                    }}
                    className={`text-xs uppercase text-[#00FF41] border border-[#00FF41]/50 bg-black px-4 py-2 flex items-center gap-2 hover:bg-[#00FF41] hover:text-black transition-colors privacy-target cursor-pointer relative ${!user ? 'opacity-70' : ''}`}
                  >
                    <div className={`flex items-center gap-2 ${!user ? 'ghost-blur-item' : ''}`}>
                      <Video size={14} /> ./tcp_sync
                    </div>
                    {!user && <Lock size={12} className="text-[#00FF41]" />}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Hacker Resume */}
          {data.resume_url && (
            <div className="w-full mb-8 flex justify-center z-20">
              <a 
                href={data.resume_url}
                target="_blank"
                rel="noreferrer"
                className="hacker-border bg-[#00FF41]/10 hover:bg-[#00FF41]/20 text-[#00FF41] px-8 py-4 text-xs font-bold uppercase tracking-widest flex items-center gap-3 transition-all duration-300"
              >
                <FileText size={16} /> &gt; ./download_cv.sh
              </a>
            </div>
          )}

          <div className="w-full mb-8 z-20">
            <ProfileCTAs profile={profile} accentColor="#00FF41" />
          </div>

        </main>
        <GateModal />
        <PrivacyModal />
      </div>
    )
  }

   // ----------------------------------------------------
  // LAYOUT 3: RETRO TERMINAL EMULATOR (Terminal Theme)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3] font-mono relative overflow-x-hidden selection:bg-[#58A6FF] selection:text-[#0D1117] flex flex-col justify-start">
      {/* Terminal Title Bar */}
      <div className="w-full bg-[#161B22] px-4 py-2 flex items-center justify-between select-none border-b border-[#30363D] sticky top-0 z-50">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        <div className="text-xs font-medium text-[#8B949E] flex-grow text-center">
          bash - {profile.display_name?.toLowerCase().replace(/\s+/g, '_') || 'developer'}
        </div>
        <div className="w-12"></div>
      </div>

      {/* Terminal Banner (Background) */}
      {!hideHeader && data.featured_work_url && (
        <div 
          className="absolute top-[41px] left-0 w-full h-64 sm:h-80 z-0 pointer-events-none opacity-20 mix-blend-screen"
          style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)' }}
        >
          <img src={getAssetUrl(data.featured_work_url)} className="w-full h-full object-cover filter contrast-125 saturate-50" alt="Banner" />
        </div>
      )}

      <main className={`w-full max-w-3xl mx-auto pb-24 px-4 sm:px-8 flex flex-col items-start relative z-20 text-sm sm:text-base ${hideHeader ? "pt-12 sm:pt-16" : "pt-8"}`}>
        
        {!hideHeader && (
          <div className="w-full flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-10">
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 border-2 border-[#30363D] p-1">
                {!avatarError && profile.avatar_url ? (
                      <img
                  src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=0D1117&color=E6EDF3`}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  alt={profile.display_name}
                onError={() => setAvatarError(true)} />
                    ) : (
                      <div className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 flex items-center justify-center bg-neutral-200 text-neutral-600 font-bold text-4xl " style={{ fontFamily: 'sans-serif' }}>
                        {profile.display_name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
              </div>
            </div>

            <div className="flex flex-col text-center sm:text-left mt-2 sm:mt-0">
              <div className="flex items-center gap-2 mb-2 justify-center sm:justify-start flex-wrap">
                <span className="text-[#3FB950] font-bold">~</span>
                <span className="text-[#8B949E]">$</span>
                <span className="text-white font-bold text-xl">{profile.display_name}</span>
              </div>
              <div className="text-[#8B949E] mb-3">
                Role: <span className="text-[#58A6FF]">{data.about?.role || 'Software Engineer'}</span>
              </div>
              {profile.bio && (
                <p className="text-[#8B949E] text-sm leading-relaxed max-w-lg">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        )}

        {/* STATS GRID */}
        <div className="w-full mb-8">
          <div className="flex gap-2 mb-3">
            <span className="text-[#3FB950] font-bold">~</span>
            <span className="text-[#8B949E]">$</span>
            <span className="text-white">sys_stats --verbose</span>
          </div>
          <div 
            className={`w-full border border-[#30363D] bg-[#161B22] p-4 font-mono text-center relative ${isFreeProfile ? 'cursor-pointer hover:border-[#8B949E] transition-colors' : ''}`}
            onClick={() => isFreeProfile && setShowGate(true)}
          >
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-[#8B949E] uppercase tracking-wider">impressions</span>
                <span className={`text-base font-bold text-white mt-1 ${isFreeProfile ? 'blur-[4px] select-none opacity-50' : ''}`}>
                  {liveViews}
                </span>
              </div>
              <div className="flex flex-col items-center border-l border-[#30363D]">
                <span className="text-[10px] text-[#8B949E] uppercase tracking-wider">top_city</span>
                <span className={`text-xs font-bold text-[#58A6FF] mt-1.5 truncate max-w-full px-1 ${isFreeProfile ? 'blur-[4px] select-none opacity-50' : ''}`}>
                  {topCity.toLowerCase().replace(/\s+/g, '_') || 'n_a'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {(data.about?.status || data.about?.company || data.about?.mission) && (
          <div className="w-full mb-8">
            <div className="flex gap-2 mb-3">
              <span className="text-[#3FB950] font-bold">~</span>
              <span className="text-[#8B949E]">$</span>
              <span className="text-white">cat status.txt</span>
            </div>
            <div className="pl-4 py-2 border-l-2 border-[#30363D] space-y-2 text-[#8B949E]">
              {data.about.status && <p>State: <span className="text-[#E6EDF3]">{data.about.status}</span></p>}
              {data.about.company && <p>Host: <span className="text-[#E6EDF3]">{data.about.company}</span></p>}
              {data.about.mission && <p>Goal: <span className="text-[#E6EDF3]">{data.about.mission}</span></p>}
            </div>
          </div>
        )}

        {((aboutMeLanguages && aboutMeLanguages.length > 0) || (techStack && techStack.length > 0)) && (
          <div className="w-full mb-8">
            <div className="flex gap-2 mb-4">
              <span className="text-[#3FB950] font-bold">~</span>
              <span className="text-[#8B949E]">$</span>
              <span className="text-white">ls -la ./skills</span>
            </div>
            <div className="pl-4 space-y-3">
              {aboutMeLanguages && aboutMeLanguages.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="text-[#FF7B72] shrink-0 font-bold">drwxr-xr-x</span>
                  <span className="text-[#8B949E] shrink-0 w-24">languages</span>
                  <div className="flex flex-wrap gap-2">
                    {aboutMeLanguages.map((l, i) => (
                      <span key={i} className="text-[#58A6FF] bg-[#58A6FF]/10 px-2 py-0.5 rounded">{l}</span>
                    ))}
                  </div>
                </div>
              )}
              {techStack && techStack.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="text-[#FF7B72] shrink-0 font-bold">drwxr-xr-x</span>
                  <span className="text-[#8B949E] shrink-0 w-24">tools</span>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map(tech => (
                      <span key={tech} className="text-[#E6EDF3] bg-[#8B949E]/10 px-2 py-0.5 rounded">{tech}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {data.projects && data.projects.length > 0 && (
          <div className="w-full mb-8">
            <div className="flex gap-2 mb-4">
              <span className="text-[#3FB950] font-bold">~</span>
              <span className="text-[#8B949E]">$</span>
              <span className="text-white">./projects.sh</span>
            </div>
            <div className="pl-4 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {data.projects.map((project: any, i: number) => (
                <div key={i} className="border border-[#30363D] p-4 bg-[#161B22] hover:border-[#8B949E] transition-colors relative group">
                  <div className="absolute top-4 right-4 text-[10px] text-[#8B949E] font-mono flex items-center gap-2">
                    {project.stars !== undefined && project.stars > 0 && (
                      <span className="flex items-center gap-1 text-[#FFBD2E]">
                        ★ {project.stars}
                      </span>
                    )}
                  </div>
                  <h4 className="text-[#58A6FF] font-medium mb-2 flex items-center gap-2">
                    {project.name}
                  </h4>
                  {project.description && (
                    <p className="text-[#8B949E] text-xs mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  {project.live_url && (
                    <a
                      href={ensureAbsoluteUrl(project.live_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3FB950] hover:text-white text-xs transition-colors inline-flex items-center gap-1 mt-auto"
                    >
                      Execute &gt;_
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {visiblePlatforms && visiblePlatforms.length > 0 && (
          <div className="w-full mb-8">
            <div className="flex gap-2 mb-4">
              <span className="text-[#3FB950] font-bold">~</span>
              <span className="text-[#8B949E]">$</span>
              <span className="text-white">netstat -a | grep CONNECTED</span>
            </div>
            <div className="pl-4 flex flex-col gap-2">
              {visiblePlatforms.map((p, i) => {
                if (!p.url) return null;
                const isBlurred = isCommunicationApp(p.platform || '') && !user;
                return (
                  <a
                    key={i}
                    href={isBlurred ? undefined : ensureAbsoluteUrl(p.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (isBlurred) {
                        e.preventDefault();
                        setShowGate(true);
                        return;
                      }
                      handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url));
                      if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank');
                    }}
                    className="text-[#E6EDF3] hover:text-[#58A6FF] flex items-center gap-3 group bg-[#161B22] border border-[#30363D] px-3 py-2 hover:bg-[#30363D]/50 transition-colors relative cursor-pointer"
                  >
                    <div className={`flex items-center gap-3 ${isBlurred ? 'ghost-blur-item' : ''}`}>
                      <span className="text-[#3FB950] font-bold text-xs">tcp</span>
                      <span className="text-[#8B949E] text-xs w-20 truncate">{p.platform?.toLowerCase()}:80</span>
                      <span className="text-[#8B949E] text-xs w-24">ESTABLISHED</span>
                    </div>
                    {isBlurred && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#161B22]/40">
                        <Lock size={12} className="text-[#3FB950]" strokeWidth={2.5} />
                      </div>
                    )}
                  </a>
                )
              })}
              {user && profile.ghost_mode && (
                <div className="w-full text-center py-2 animate-fadeIn">
                  <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-widest shadow-sm">
                    <Lock size={12} /> Privacy Mode enabled
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {!(user && profile.ghost_mode) && (data.contact_email || data.contact_whatsapp || data.quick_talk_url || data.collab_types) && (
          <div className="w-full mb-8">
            <div className="flex gap-2 mb-4">
              <span className="text-[#3FB950] font-bold">~</span>
              <span className="text-[#8B949E]">$</span>
              <span className="text-white">cat contact.txt</span>
            </div>
            <div className="pl-4 py-2 border-l-2 border-[#30363D] space-y-3">
              {data.collab_types && (
                <p className="text-[#8B949E]">
                  # LOOKING FOR: <span className="text-[#E6EDF3]">{data.collab_types}</span>
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                {data.contact_email && (
                  <a 
                    href={!user ? undefined : `mailto:${data.contact_email}`}
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        setShowGate(true);
                      }
                    }}
                    className={`text-[#58A6FF] hover:text-white transition-colors flex items-center gap-2 text-xs cursor-pointer relative ${!user ? 'opacity-70' : ''}`}
                  >
                    <div className={`flex items-center gap-2 ${!user ? 'ghost-blur-item' : ''}`}>
                      <Mail size={14} /> {data.contact_email}
                    </div>
                    {!user && <Lock size={12} className="text-[#58A6FF]" />}
                  </a>
                )}
                {data.contact_whatsapp && (
                  <a 
                    href={!user ? undefined : `https://wa.me/${data.contact_whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        setShowGate(true);
                      }
                    }}
                    className={`text-[#3FB950] hover:text-white transition-colors flex items-center gap-2 text-xs cursor-pointer relative ${!user ? 'opacity-70' : ''}`}
                  >
                    <div className={`flex items-center gap-2 ${!user ? 'ghost-blur-item' : ''}`}>
                      <Phone size={14} /> WhatsApp
                    </div>
                    {!user && <Lock size={12} className="text-[#3FB950]" />}
                  </a>
                )}
                {data.quick_talk_url && (
                  <a 
                    href={!user ? undefined : ensureAbsoluteUrl(data.quick_talk_url)}
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        setShowGate(true);
                      }
                    }}
                    className={`text-[#FFBD2E] hover:text-white transition-colors flex items-center gap-2 text-xs privacy-target cursor-pointer relative ${!user ? 'opacity-70' : ''}`}
                  >
                    <div className={`flex items-center gap-2 ${!user ? 'ghost-blur-item' : ''}`}>
                      <Video size={14} /> Schedule Sync
                    </div>
                    {!user && <Lock size={12} className="text-[#FFBD2E]" />}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {data.resume_url && (
          <div className="w-full mb-8">
            <div className="flex gap-2 mb-4">
              <span className="text-[#3FB950] font-bold">~</span>
              <span className="text-[#8B949E]">$</span>
              <span className="text-white">cat resume.pdf</span>
            </div>
            <div className="pl-4">
              <a 
                href={data.resume_url}
                target="_blank"
                rel="noreferrer"
                className="text-[#E6EDF3] hover:text-[#58A6FF] flex items-center gap-3 bg-[#161B22] border border-[#30363D] px-4 py-3 hover:bg-[#30363D]/50 transition-colors w-max"
              >
                <FileText size={16} /> Open Document
              </a>
            </div>
          </div>
        )}

        <div className="w-full mt-4 mb-12 flex gap-2 items-center">
          <span className="text-[#3FB950] font-bold">~</span>
          <span className="text-[#8B949E]">$</span>
          <span className="w-2.5 h-5 bg-[#E6EDF3] animate-pulse" />
        </div>

        <div className="w-full mt-auto pt-8 border-t border-[#30363D] z-20">
          <ProfileCTAs profile={profile} accentColor="#58A6FF" />
        </div>

      </main>
      <GateModal />
      <PrivacyModal />
    </div>
  )
}

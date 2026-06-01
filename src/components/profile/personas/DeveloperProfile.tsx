import React from 'react'
import { ProfileData, DeveloperData } from '../../../types/profile'
import { getAssetUrl } from '../../../lib/supabase'
import { 
  Monitor, Code2, Database, Layout, Box, Globe, ExternalLink, 
  Terminal, Mail, Calendar, Lock, Shield, Cpu, RefreshCw, Layers
} from 'lucide-react'
import { ProfileCTAs } from '../shared/ProfileCTAs'
import { trackLinkClick } from '../../../lib/analytics/track'
import { useGatedLink } from '../../../hooks/useGatedLink'

function getPlatformIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes('github')) return { logo: 'github', color: '#1A1A1A' };
  if (p.includes('twitter') || p.includes('x')) return { logo: 'x', color: '#000000' };
  if (p.includes('linkedin')) return { logo: 'linkedin', color: '#0A66C2' };
  if (p.includes('stackoverflow')) return { logo: 'stackoverflow', color: '#F48024' };
  return { logo: 'globe', color: '#71B5F5' };
}

export function DeveloperProfile({ profile }: { profile: ProfileData }) {
  const data = (profile.persona_data || {}) as DeveloperData;
  const activeTheme = (profile.profile_theme || 'default').toLowerCase();
  const { isGated, handleGatedClick, GateModal } = useGatedLink();

  const aboutMeLanguages = (data.about?.languages && data.about.languages.length > 0)
    ? data.about.languages
    : [];

  const techStack = (data.tech_stack && data.tech_stack.length > 0)
    ? data.tech_stack
    : [];

  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    return `https://${url}`
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

        <div className="w-full h-48 sm:h-64 relative bg-[#f0f2f5] overflow-hidden rounded-t-[32px] sm:rounded-t-[40px] rounded-b-none z-10 border-b border-neutral-200">
          {data.featured_work_url ? (
            <img src={getAssetUrl(data.featured_work_url)} className="absolute inset-0 w-full h-full object-cover" alt="Banner" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-[#f8f9fa]/20 to-transparent" />
        </div>

        <main className="w-full max-w-[550px] sm:max-w-[570px] mx-auto pb-20 px-4 flex flex-col items-center relative z-20">
          <div className="relative -mt-24 sm:-mt-[120px] flex flex-col items-center z-30">
            <div className="relative p-[4px] rounded-full bg-white shadow-xl shadow-neutral-300/60">
              <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden bg-neutral-100 border-4 border-white">
                <img
                  src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=f0f0f0&color=22c55e`}
                  className="w-full h-full object-cover"
                  alt={profile.display_name}
                />
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

          {data.platforms && data.platforms.length > 0 && (
            <div className="w-full flex flex-wrap justify-center gap-6 mt-2 mb-4 z-20">
              {data.platforms.map((p, i) => {
                if (!p.url) return null
                const { logo } = getPlatformIcon(p.platform || '')
                return (
                  <a
                    key={i}
                    href={ensureAbsoluteUrl(p.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url));
                      if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank');
                    }}
                    className="relative hover:scale-110 transition-transform duration-300 text-neutral-500 hover:text-[#0A66C2] social-link-item cursor-pointer"
                  >
                    {logo && logo !== 'globe' ? (
                      <img 
                        src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${logo}.svg`}
                        className="w-5 h-5 object-contain"
                        style={{ filter: 'brightness(0)' }}
                        alt={p.platform}
                      />
                    ) : (
                      <Globe size={20} />
                    )}
                    {isGated && (
                      <div className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center">
                        <Lock size={16} className="text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]" strokeWidth={2.5} />
                      </div>
                    )}
                  </a>
                )
              })}
            </div>
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

        </main>
        <GateModal />
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

        <main className="w-full max-w-[620px] mx-auto pb-24 pt-8 px-4 flex flex-col items-center relative z-20">
          
          {/* Schematic Blueprint Title Card block */}
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
                    <img
                      src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=0A192F&color=64FFDA`}
                      className="w-full h-full object-cover filter contrast-125 saturate-50 brightness-90 mix-blend-screen opacity-90"
                      alt={profile.display_name}
                    />
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
                    <div className="absolute top-4 right-4 text-[10px] text-[#64FFDA]/40 font-mono">v1.0.{i}</div>
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
                {data.platforms.map((p, i) => {
                  if (!p.url) return null
                  const { logo } = getPlatformIcon(p.platform || '')
                  return (
                    <a
                      key={i}
                      href={ensureAbsoluteUrl(p.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url));
                        if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank');
                      }}
                      className="blueprint-border bg-[#0A192F] hover:bg-[#64FFDA]/10 px-5 py-3 text-xs flex items-center gap-3 transition-all duration-300 relative group"
                    >
                      {logo && logo !== 'globe' ? (
                        <img 
                          src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${logo}.svg`}
                          className="w-4 h-4 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                          style={{ filter: 'invert(87%) sepia(26%) saturate(692%) hue-rotate(107deg) brightness(101%) contrast(105%)' }}
                          alt={p.platform}
                        />
                      ) : (
                        <Globe size={16} className="text-[#64FFDA] opacity-70 group-hover:opacity-100" />
                      )}
                      <span className="text-[11px] uppercase text-[#8892B0] group-hover:text-[#64FFDA] transition-colors">{p.platform}</span>
                      {isGated && (
                        <div className="absolute inset-0 bg-[#001B2E]/80 flex items-center justify-center">
                          <Lock size={14} className="text-[#64FFDA]" />
                        </div>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Connection Actions */}
          <div className="w-full mb-8 z-20">
            <ProfileCTAs profile={profile} accentColor="#64FFDA" />
          </div>

        </main>
        <GateModal />
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

        <main className="w-full max-w-[620px] mx-auto pb-24 pt-8 px-4 flex flex-col items-center relative z-20">
          
          <div className="w-full hacker-border bg-black/80 p-6 mb-8 text-left relative overflow-hidden">
            <div className="text-[10px] text-[#00FF41]/70 mb-4 font-bold uppercase tracking-widest flex items-center justify-between">
              <span>root@system:~# whoami</span>
              <span className="animate-pulse">_</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative group">
                <div className="w-32 h-32 hacker-border p-1 bg-black relative">
                  <div className="w-full h-full overflow-hidden relative">
                    <img
                      src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=000&color=00FF41`}
                      className="w-full h-full object-cover filter contrast-150 saturate-0"
                      alt={profile.display_name}
                    />
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

          {data.platforms && data.platforms.length > 0 && (
            <div className="w-full text-left mb-8">
              <span className="block text-[10px] text-[#00FF41]/60 uppercase tracking-widest mb-3"># NETWORK_NODES</span>
              <div className="flex flex-wrap gap-3">
                {data.platforms.map((p, i) => {
                  if (!p.url) return null
                  const { logo } = getPlatformIcon(p.platform || '')
                  return (
                    <a
                      key={i}
                      href={ensureAbsoluteUrl(p.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url));
                        if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank');
                      }}
                      className="hacker-border bg-black hover:bg-[#00FF41] hover:text-black px-4 py-2 text-xs flex items-center gap-2 transition-all relative"
                    >
                      {logo && logo !== 'globe' ? (
                        <img 
                          src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${logo}.svg`}
                          className="w-3.5 h-3.5 object-contain filter brightness-0 invert"
                          alt={p.platform}
                        />
                      ) : (
                        <Globe size={12} />
                      )}
                      <span className="uppercase font-bold">{p.platform}</span>
                      {isGated && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                          <Lock size={12} className="text-[#00FF41]" />
                        </div>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          <div className="w-full mb-8 z-20">
            <ProfileCTAs profile={profile} accentColor="#00FF41" />
          </div>

        </main>
        <GateModal />
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

      <main className="w-full max-w-3xl mx-auto pb-24 pt-8 px-4 sm:px-8 flex flex-col items-start relative z-20 text-sm sm:text-base">
        
        <div className="w-full flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-10">
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 border-2 border-[#30363D] p-1">
              <img
                src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=0D1117&color=E6EDF3`}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                alt={profile.display_name}
              />
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

        {data.platforms && data.platforms.length > 0 && (
          <div className="w-full mb-8">
            <div className="flex gap-2 mb-4">
              <span className="text-[#3FB950] font-bold">~</span>
              <span className="text-[#8B949E]">$</span>
              <span className="text-white">netstat -a | grep CONNECTED</span>
            </div>
            <div className="pl-4 flex flex-col gap-2">
              {data.platforms.map((p, i) => {
                if (!p.url) return null
                return (
                  <a
                    key={i}
                    href={ensureAbsoluteUrl(p.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url));
                      if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank');
                    }}
                    className="text-[#E6EDF3] hover:text-[#58A6FF] flex items-center gap-3 group bg-[#161B22] border border-[#30363D] px-3 py-2 hover:bg-[#30363D]/50 transition-colors"
                  >
                    <span className="text-[#3FB950] font-bold text-xs">tcp</span>
                    <span className="text-[#8B949E] text-xs w-20 truncate">{p.platform?.toLowerCase()}:80</span>
                    <span className="text-[#8B949E] text-xs w-24">ESTABLISHED</span>
                    {isGated && <Lock size={12} className="text-[#FF7B72] ml-auto" />}
                  </a>
                )
              })}
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
    </div>
  )
}

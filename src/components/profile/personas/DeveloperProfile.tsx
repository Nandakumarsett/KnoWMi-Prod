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
  // LAYOUT 1: ARCHITECTURAL SCHEMATIC (Blueprint Theme)
  // ----------------------------------------------------
  if (activeTheme === 'blueprint') {
    return (
      <div className="min-h-screen bg-[#061426] text-[#71B5F5] font-mono relative overflow-x-hidden selection:bg-[#71B5F5] selection:text-[#061426] p-4 sm:p-8">
        
        {/* Drafting Grid Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 z-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(113,181,245,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(113,181,245,0.15) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            backgroundPosition: 'top left'
          }}
        />
        
        {/* Architectural border specifications */}
        <div className="absolute top-3 left-3 right-3 bottom-3 border border-dashed border-[#71B5F5]/20 pointer-events-none z-10 flex justify-between p-3 text-[8px] text-[#71B5F5]/30 select-none">
          <span>COORDS: [A1] // W_WIDTH: 100%</span>
          <span>DRAFTING: SCALE_NTS</span>
          <span>SYSTEM_MODEL: REV_1.04</span>
        </div>

        <main className="w-full max-w-[640px] mx-auto pb-24 pt-10 px-4 flex flex-col items-center relative z-20">
          
          {/* Schematic Square Frame Avatar */}
          <div className="relative mb-8">
            <div className="w-40 h-40 border border-[#71B5F5] p-2 bg-[#061426] relative">
              <div className="absolute -top-1 -left-1 text-[8px] text-[#71B5F5]/50">[X]</div>
              <div className="absolute -bottom-1 -right-1 text-[8px] text-[#71B5F5]/50">[Y]</div>
              <div className="w-full h-full border border-dashed border-[#71B5F5]/60 overflow-hidden bg-[#0A223D]">
                <img
                  src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=061426&color=71b5f5`}
                  className="w-full h-full object-cover filter contrast-125 saturate-50 brightness-90"
                  alt={profile.display_name}
                />
              </div>
            </div>
          </div>

          {/* Blueprint Title Block */}
          <div className="w-full border-2 border-[#71B5F5] bg-[#0A223D]/95 p-6 mb-8 text-left shadow-[4px_4px_0px_0px_rgba(113,181,245,0.2)]">
            <div className="flex justify-between items-center text-[9px] font-black uppercase text-[#71B5F5]/50 mb-3 border-b border-[#71B5F5]/20 pb-2">
              <span>// SCHEMATIC DRAFT //</span>
              <span>ENG_UNIT: CORE</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-wider uppercase leading-none mb-3">
              {(profile.display_name || 'SYSTEMS_ENG')}
            </h1>
            <p className="text-xs font-bold text-[#71B5F5] uppercase tracking-widest flex items-center gap-2">
              <Terminal size={12} /> CLASS: {data.about?.role || 'ARCHITECT CORE'}
            </p>
            {profile.bio && (
              <p className="text-xs leading-relaxed text-[#71B5F5]/80 mt-4 border-l-2 border-[#71B5F5]/60 pl-3 italic">
                "{profile.bio}"
              </p>
            )}
          </div>

          {/* Blueprint Specs Node Box */}
          {(data.about?.status || data.about?.company || data.about?.mission) && (
            <div className="w-full border border-[#71B5F5] bg-[#0A223D]/50 p-6 mb-8 text-left relative">
              <div className="absolute top-0 right-0 bg-[#71B5F5] text-[#061426] px-2 py-0.5 text-[8px] font-bold">SPEC_01</div>
              <h3 className="text-xs font-black uppercase text-white tracking-[0.2em] mb-4 border-b border-[#71B5F5]/20 pb-2">
                [01] SYSTEM INFRASTRUCTURE
              </h3>
              <div className="space-y-3 text-xs">
                {data.about.status && (
                  <p><span className="text-[#71B5F5]/50 font-black">NODE_STATUS:</span> {data.about.status}</p>
                )}
                {data.about.company && (
                  <p><span className="text-[#71B5F5]/50 font-black">DEPLOYMENT:</span> {data.about.company}</p>
                )}
                {data.about.mission && (
                  <div className="pt-2 border-t border-dashed border-[#71B5F5]/10 mt-2">
                    <span className="text-[#71B5F5]/50 font-black block mb-1">OBJECTIVE:</span>
                    <p className="text-[#71B5F5]/90 leading-relaxed font-sans text-xs">{data.about.mission}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Technical Protocols (Tech Stack) */}
          {((aboutMeLanguages && aboutMeLanguages.length > 0) || (techStack && techStack.length > 0)) && (
            <div className="w-full border border-[#71B5F5] bg-[#0A223D]/50 p-6 mb-8 text-left relative">
              <div className="absolute top-0 right-0 bg-[#71B5F5] text-[#061426] px-2 py-0.5 text-[8px] font-bold">SPEC_02</div>
              <h3 className="text-xs font-black uppercase text-white tracking-[0.2em] mb-6 border-b border-[#71B5F5]/20 pb-2">
                [02] COMPILED MODULES
              </h3>
              
              {aboutMeLanguages && aboutMeLanguages.length > 0 && (
                <div className="mb-6">
                  <span className="text-[9px] font-black text-[#71B5F5]/60 uppercase block mb-3">LANGUAGES:</span>
                  <div className="flex flex-wrap gap-2">
                    {aboutMeLanguages.map((l, idx) => (
                      <span key={idx} className="border border-[#71B5F5]/40 bg-[#061426] px-3 py-1 text-[10px] font-black uppercase text-[#71B5F5]">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {techStack && techStack.length > 0 && (
                <div>
                  <span className="text-[9px] font-black text-[#71B5F5]/60 uppercase block mb-4">COMPONENTS:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {techStack.map(tech => (
                      <div key={tech} className="border border-[#71B5F5]/20 bg-[#061426] p-3 text-center hover:border-[#71B5F5] transition-colors duration-250">
                        <span className="text-[9px] font-black uppercase truncate block w-full">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Released Architectures */}
          {data.projects && data.projects.length > 0 && (
            <div className="w-full mb-8 text-left">
              <span className="block text-[10px] font-black text-[#71B5F5]/70 uppercase tracking-[0.25em] mb-4">// [03] ARCHITECTURAL RELEASES //</span>
              <div className="space-y-6">
                {data.projects.map((project: any, i: number) => (
                  <div key={i} className="border-2 border-[#71B5F5] bg-[#0A223D]/95 p-6 relative shadow-[4px_4px_0px_0px_rgba(113,181,245,0.15)]">
                    <h4 className="text-lg font-black text-white mb-2 uppercase flex items-center gap-2">
                      <Cpu size={16} className="text-[#71B5F5]" /> {project.name}
                    </h4>
                    {project.description && (
                      <p className="text-xs text-[#71B5F5]/80 leading-relaxed mb-4 font-sans font-semibold">
                        {project.description}
                      </p>
                    )}
                    {project.live_url && (
                      <a
                        href={ensureAbsoluteUrl(project.live_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-white hover:text-[#71B5F5] transition-colors border-b border-[#71B5F5] pb-0.5"
                      >
                        Launch Schema <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Platforms Node links */}
          {data.platforms && data.platforms.length > 0 && (
            <div className="w-full text-left mb-8">
              <span className="block text-[10px] font-black text-[#71B5F5]/70 uppercase tracking-[0.25em] mb-4">// [04] INTEGRATED CHANNELS //</span>
              <div className="flex flex-wrap gap-4">
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
                      className="border border-[#71B5F5]/50 bg-[#0A223D] hover:bg-[#71B5F5] hover:text-[#061426] px-4 py-2.5 text-xs flex items-center gap-2 transition-colors relative cursor-pointer"
                    >
                      {logo && logo !== 'globe' ? (
                        <img 
                          src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${logo}.svg`}
                          className="w-4 h-4 filter invert object-contain brightness-0 group-hover:brightness-100"
                          style={{ filter: 'brightness(0) invert(1)' }}
                          alt={p.platform}
                        />
                      ) : (
                        <Globe size={14} />
                      )}
                      <span className="text-[9px] font-black uppercase">{p.platform}</span>
                      {isGated && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Lock size={12} className="text-white" />
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
            <ProfileCTAs profile={profile} accentColor="#71B5F5" />
          </div>

          {/* Schematic buttons */}
          {(data.contact_email || data.quick_talk_url) && (
            <div className="grid grid-cols-2 gap-4 w-full text-left">
              {data.contact_email && (
                <a href={`mailto:${data.contact_email}`} className="border border-[#71B5F5] bg-[#71B5F5] text-[#061426] hover:bg-transparent hover:text-[#71B5F5] py-4 text-center font-black text-xs uppercase tracking-widest transition-all">
                  Contact Architect
                </a>
              )}
              {data.quick_talk_url && (
                <a href={ensureAbsoluteUrl(data.quick_talk_url)} target="_blank" rel="noopener noreferrer" className="border border-[#71B5F5] bg-[#0A223D] text-[#71B5F5] hover:bg-[#71B5F5] hover:text-[#061426] py-4 text-center font-black text-xs uppercase tracking-widest transition-all">
                  Request Sync
                </a>
              )}
            </div>
          )}

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
      <div className="min-h-screen bg-black text-[#39FF14] font-mono relative overflow-x-hidden selection:bg-[#39FF14] selection:text-black p-4 sm:p-8">
        
        {/* CRT Scanline Overlay */}
        <div className="fixed inset-0 pointer-events-none z-15 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] opacity-40 pointer-events-none" />

        {/* Ambient background glows */}
        <div className="absolute top-[10%] left-[5%] w-[350px] h-[350px] bg-emerald-950/20 rounded-full blur-[100px] pointer-events-none" />

        <main className="w-full max-w-[620px] mx-auto pb-24 pt-10 px-4 flex flex-col items-center relative z-20">
          
          {/* Glowing CRT Frame Avatar */}
          <div className="relative mb-8">
            <div className="w-40 h-40 border border-[#39FF14] p-1.5 bg-black shadow-[0_0_20px_rgba(57,255,20,0.4)]">
              <div className="w-full h-full overflow-hidden relative">
                <img
                  src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=000&color=39ff14`}
                  className="w-full h-full object-cover filter brightness-110 contrast-125 saturate-50"
                  alt={profile.display_name}
                />
                <div className="absolute inset-0 bg-[#39FF14]/15 pointer-events-none" />
              </div>
            </div>
            <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 bg-black border border-[#39FF14] px-4 py-0.5 text-[8px] font-bold text-[#39FF14] tracking-widest shadow-[0_0_8px_rgba(57,255,20,0.3)]">
              NODE_SECTOR_09
            </div>
          </div>

          {/* Tactical HUD Header */}
          <div className="w-full border border-[#39FF14] bg-black p-6 mb-8 text-left shadow-[0_0_15px_rgba(57,255,20,0.15)] relative">
            <div className="absolute top-2 right-4 text-[7px] text-[#39FF14]/60 animate-pulse">// HUD ACTIVE</div>
            <div className="text-[9px] text-[#39FF14]/50 mb-2 font-bold uppercase tracking-wider">root@knowmi:~# info_check</div>
            
            <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-1 drop-shadow-[0_0_6px_rgba(57,255,20,0.7)]">
              {(profile.display_name || 'NULL_NODE')}
            </h1>
            <p className="text-xs font-bold text-[#39FF14] uppercase tracking-wider flex items-center gap-1.5 mt-1.5">
              <Shield size={12} /> CLASS: {data.about?.role || 'HACKER ENG'}
            </p>
            {profile.bio && (
              <p className="text-xs leading-relaxed text-[#39FF14]/80 mt-4 border-l border-[#39FF14] pl-3">
                "{profile.bio}"
              </p>
            )}
          </div>

          {/* System status environment */}
          {(data.about?.status || data.about?.company || data.about?.mission) && (
            <div className="w-full border border-[#39FF14]/60 bg-black p-6 mb-8 text-left relative">
              <h3 className="text-xs font-black uppercase text-[#39FF14] tracking-[0.2em] mb-4 border-b border-[#39FF14]/20 pb-2 flex items-center gap-2">
                <Shield size={12} /> SYSTEM STATE PARAMETERS
              </h3>
              <div className="space-y-3.5 text-xs">
                {data.about.status && (
                  <p><span className="text-[#39FF14]/50 font-bold">STATE_STATUS:</span> {data.about.status}</p>
                )}
                {data.about.company && (
                  <p><span className="text-[#39FF14]/50 font-bold">SYS_HOST:</span> {data.about.company}</p>
                )}
                {data.about.mission && (
                  <div className="pt-2 border-t border-dashed border-[#39FF14]/20">
                    <span className="text-[#39FF14]/50 font-bold block mb-1">CORE_MISSION:</span>
                    <p className="text-[#39FF14]/90 leading-relaxed font-sans text-xs font-semibold">{data.about.mission}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Compiler Stack (Tech) */}
          {((aboutMeLanguages && aboutMeLanguages.length > 0) || (techStack && techStack.length > 0)) && (
            <div className="w-full border border-[#39FF14]/60 bg-black p-6 mb-8 text-left">
              <h3 className="text-xs font-black uppercase text-[#39FF14] tracking-[0.2em] mb-6 border-b border-[#39FF14]/20 pb-2">
                # COMPILED COMPILERS
              </h3>
              
              {aboutMeLanguages && aboutMeLanguages.length > 0 && (
                <div className="mb-6">
                  <span className="text-[9px] font-black text-[#39FF14]/50 uppercase tracking-widest block mb-3">LANGUAGES:</span>
                  <div className="flex flex-wrap gap-2.5">
                    {aboutMeLanguages.map((l, idx) => (
                      <span key={idx} className="border border-[#39FF14] bg-black px-3 py-1.5 text-[10px] font-black uppercase">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {techStack && techStack.length > 0 && (
                <div>
                  <span className="text-[9px] font-black text-[#39FF14]/50 uppercase tracking-widest block mb-4">RESOURCES:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {techStack.map(tech => (
                      <div key={tech} className="border border-[#39FF14]/30 bg-black p-3 text-center hover:border-[#39FF14] transition-all">
                        <span className="text-[9px] font-black uppercase truncate block w-full text-[#39FF14]/90">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Masterpieces Grid */}
          {data.projects && data.projects.length > 0 && (
            <div className="w-full mb-8 text-left">
              <span className="block text-[9px] font-black text-[#39FF14]/60 uppercase tracking-[0.25em] mb-4">// DEPLOYED_CORES //</span>
              <div className="space-y-6">
                {data.projects.map((project: any, i: number) => (
                  <div key={i} className="border border-[#39FF14] bg-black p-6 shadow-[0_0_12px_rgba(57,255,20,0.1)] hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] transition-shadow duration-300">
                    <h4 className="text-lg font-black text-white mb-2 uppercase flex items-center gap-2">
                      <Terminal size={16} className="text-[#39FF14]" /> {project.name}
                    </h4>
                    {project.description && (
                      <p className="text-xs text-[#39FF14]/80 leading-relaxed mb-4 font-sans font-semibold">
                        {project.description}
                      </p>
                    )}
                    {project.live_url && (
                      <a
                        href={ensureAbsoluteUrl(project.live_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase text-[#39FF14] hover:text-white border-b border-[#39FF14] pb-0.5 transition-colors"
                      >
                        RUN MODULE <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Platforms Node links */}
          {data.platforms && data.platforms.length > 0 && (
            <div className="w-full text-left mb-8">
              <span className="block text-[9px] font-black text-[#39FF14]/60 uppercase tracking-[0.25em] mb-4">// DECK_SHUNTS //</span>
              <div className="flex flex-wrap gap-4">
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
                      className="border border-[#39FF14]/40 hover:border-[#39FF14] bg-black hover:bg-[#39FF14] hover:text-black px-4 py-2.5 text-xs flex items-center gap-2 transition-all relative cursor-pointer"
                    >
                      {logo && logo !== 'globe' ? (
                        <img 
                          src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${logo}.svg`}
                          className="w-4 h-4 filter invert object-contain"
                          style={{ filter: 'brightness(0) invert(1)' }}
                          alt={p.platform}
                        />
                      ) : (
                        <Globe size={14} />
                      )}
                      <span className="text-[9px] font-black uppercase">{p.platform}</span>
                      {isGated && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <Lock size={12} className="text-white" />
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
            <ProfileCTAs profile={profile} accentColor="#39FF14" />
          </div>

          {/* Buttons */}
          {(data.contact_email || data.quick_talk_url) && (
            <div className="grid grid-cols-2 gap-4 w-full text-left">
              {data.contact_email && (
                <a href={`mailto:${data.contact_email}`} className="border border-[#39FF14] bg-[#39FF14] text-black hover:bg-transparent hover:text-[#39FF14] py-4 text-center font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_12px_rgba(57,255,20,0.2)]">
                  PING SYSTEM
                </a>
              )}
              {data.quick_talk_url && (
                <a href={ensureAbsoluteUrl(data.quick_talk_url)} target="_blank" rel="noopener noreferrer" className="border border-[#39FF14] bg-black text-[#39FF14] hover:bg-[#39FF14] hover:text-black py-4 text-center font-black text-xs uppercase tracking-widest transition-all">
                  SYNC LINK
                </a>
              )}
            </div>
          )}

        </main>
        <GateModal />
      </div>
    )
  }

  // ----------------------------------------------------
  // LAYOUT 3: RETRO TERMINAL EMULATOR (Default / Terminal Theme)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F0EEE9] text-neutral-800 font-mono relative overflow-x-hidden selection:bg-neutral-300 selection:text-neutral-900 p-4 sm:p-8">
      
      {/* High-Contrast Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.05] z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8) 1.2px, transparent 1.2px), linear-gradient(90deg, rgba(0, 0, 0, 0.8) 1.2px, transparent 1.2px)',
          backgroundSize: '36px 36px',
          backgroundPosition: 'center center'
        }}
      />

      <main className="w-full max-w-[620px] mx-auto pb-24 pt-10 px-4 flex flex-col items-center relative z-20">

        {/* Retro UNIX Desktop Workstation Chassis */}
        <div className="w-full border-4 border-[#3D3A36] bg-[#FFFFFF] rounded-2xl shadow-[12px_12px_0px_0px_#3D3A36] overflow-hidden flex flex-col mb-12 relative">
          
          {/* Physical Sticker sheets applied at slight angles */}
          <div className="absolute top-28 -left-4 select-none opacity-90 rotate-[-12deg] z-40 bg-[#FFD166] border-2 border-[#3D3A36] text-black px-2.5 py-1 text-[8px] font-black uppercase tracking-wider font-mono">
            ⚡️ React Inside
          </div>
          
          <div className="absolute top-44 -right-5 select-none opacity-90 rotate-[15deg] z-40 bg-[#EF476F] border-2 border-[#3D3A36] text-white px-2.5 py-1 text-[8px] font-black uppercase tracking-wider font-mono">
            STABLE CORE
          </div>

          {/* Workstation Header Window Bar */}
          <div className="bg-[#E4E0D5] border-b-4 border-[#3D3A36] px-5 py-3.5 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-[#EF476F] border-2 border-[#3D3A36]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#FFD166] border-2 border-[#3D3A36]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#06D6A0] border-2 border-[#3D3A36]" />
            </div>
            <div className="text-[10px] font-black text-[#3D3A36] uppercase tracking-widest font-mono">
              index.sh - profile - 80x24
            </div>
            <div className="w-10"></div>
          </div>

          <div className="p-6 sm:p-8 flex flex-col items-center">
            
            {/* Round Avatar with retro border inside window chassis */}
            <div className="relative mb-6">
              <div className="w-36 h-36 rounded-full border-4 border-[#3D3A36] p-1 bg-white">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=ffffff&color=3d3a36`}
                    className="w-full h-full object-cover"
                    alt={profile.display_name}
                  />
                </div>
              </div>
            </div>

            {/* Workstation Identity */}
            <div className="text-center w-full">
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-wider uppercase mb-1">
                {(profile.display_name || 'NEW USER').toUpperCase()}
              </h1>
              <p className="text-xs font-black text-emerald-600 tracking-widest mt-1.5 uppercase bg-emerald-50 border-2 border-emerald-500/30 px-3 py-1.5 rounded-md inline-block">
                // {data.about?.role || 'CORE ENGINEER'}
              </p>
              {profile.bio && (
                <p className="text-xs leading-relaxed text-neutral-600 mt-6 border-t-2 border-dashed border-neutral-200 pt-5 text-left italic font-bold">
                  "{profile.bio}"
                </p>
              )}
            </div>

            {/* System variables prompt logs */}
            {(data.about?.status || data.about?.company || data.about?.mission) && (
              <div className="w-full text-left mt-8 border-2 border-[#3D3A36] bg-[#FAF8F5] p-5 relative">
                <span className="absolute -top-3.5 left-4 bg-white border-2 border-[#3D3A36] px-2 py-0.5 text-[8px] font-black text-[#3D3A36] uppercase tracking-wider">
                  $ printenv env_vars
                </span>
                <div className="space-y-3 font-mono text-xs pt-1.5">
                  {data.about.status && (
                    <p><span className="text-neutral-500 font-bold">STATUS =</span> {data.about.status}</p>
                  )}
                  {data.about.company && (
                    <p><span className="text-neutral-500 font-bold">SYS_HOST =</span> {data.about.company}</p>
                  )}
                  {data.about.mission && (
                    <div className="pt-2 border-t border-dashed border-neutral-200">
                      <span className="text-neutral-500 font-bold block mb-1">MISSION =</span>
                      <p className="text-neutral-700 leading-relaxed font-sans text-xs">{data.about.mission}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Compiler stack list */}
            {((aboutMeLanguages && aboutMeLanguages.length > 0) || (techStack && techStack.length > 0)) && (
              <div className="w-full text-left mt-8 border-2 border-[#3D3A36] bg-[#FAF8F5] p-5 relative">
                <span className="absolute -top-3.5 left-4 bg-white border-2 border-[#3D3A36] px-2 py-0.5 text-[8px] font-black text-[#3D3A36] uppercase tracking-wider">
                  $ list --stack
                </span>
                
                {aboutMeLanguages && aboutMeLanguages.length > 0 && (
                  <div className="mb-4 pt-1.5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Languages:</span>
                    <div className="flex flex-wrap gap-2">
                      {aboutMeLanguages.map((l, i) => (
                        <span key={i} className="text-[10px] bg-neutral-100 border border-neutral-300 px-3 py-1 font-black uppercase text-neutral-600">{l}</span>
                      ))}
                    </div>
                  </div>
                )}

                {techStack && techStack.length > 0 && (
                  <div>
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Components:</span>
                    <div className="flex flex-wrap gap-2">
                      {techStack.map(tech => (
                        <span key={tech} className="text-[10px] bg-white border border-[#3D3A36] px-3 py-1 font-black uppercase text-[#3D3A36] shadow-[2px_2px_0px_0px_#3D3A36]">{tech}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Released projects */}
            {data.projects && data.projects.length > 0 && (
              <div className="w-full text-left mt-8 border-2 border-[#3D3A36] bg-[#FAF8F5] p-5 relative">
                <span className="absolute -top-3.5 left-4 bg-white border-2 border-[#3D3A36] px-2 py-0.5 text-[8px] font-black text-[#3D3A36] uppercase tracking-wider">
                  $ ls ./releases
                </span>
                <div className="space-y-4 pt-1.5">
                  {data.projects.map((project: any, i: number) => (
                    <div key={i} className="border-b border-neutral-200 last:border-0 pb-4 last:pb-0">
                      <h4 className="text-sm font-black text-neutral-900 uppercase flex items-center gap-1.5">
                        <Terminal size={14} className="text-emerald-600" /> {project.name}
                      </h4>
                      {project.description && (
                        <p className="text-xs text-neutral-500 leading-relaxed font-sans mt-1">
                          {project.description}
                        </p>
                      )}
                      {project.live_url && (
                        <a
                          href={ensureAbsoluteUrl(project.live_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 hover:text-emerald-700 transition-colors border-b border-emerald-500 pb-0.5 mt-2"
                        >
                          RUN MODULE <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social channels */}
            {data.platforms && data.platforms.length > 0 && (
              <div className="w-full text-left mt-8 border-2 border-[#3D3A36] bg-[#FAF8F5] p-5 relative">
                <span className="absolute -top-3.5 left-4 bg-white border-2 border-[#3D3A36] px-2 py-0.5 text-[8px] font-black text-[#3D3A36] uppercase tracking-wider">
                  $ sh show_connections.sh
                </span>
                <div className="flex flex-wrap gap-4 pt-2">
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
                        className="border border-[#3D3A36] bg-white hover:bg-neutral-100 px-3 py-1.5 text-xs flex items-center gap-2 transition-all relative shadow-[2px_2px_0px_0px_#3D3A36] cursor-pointer"
                      >
                        {logo && logo !== 'globe' ? (
                          <img 
                            src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${logo}.svg`}
                            className="w-3.5 h-3.5 filter invert object-contain"
                            style={{ filter: 'brightness(0)' }}
                            alt={p.platform}
                          />
                        ) : (
                          <Globe size={12} />
                        )}
                        <span className="text-[9px] font-black uppercase text-[#3D3A36]">{p.platform}</span>
                        {isGated && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Lock size={12} className="text-white" />
                          </div>
                        )}
                      </a>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Connection Actions */}
            <div className="w-full mt-8 z-20 border-t-2 border-dashed border-neutral-200 pt-6">
              <ProfileCTAs profile={profile} accentColor="#10B981" />
            </div>

            {/* Workstation buttons */}
            {(data.contact_email || data.quick_talk_url) && (
              <div className="grid grid-cols-2 gap-4 w-full text-left mt-6">
                {data.contact_email && (
                  <a href={`mailto:${data.contact_email}`} className="border-4 border-[#3D3A36] bg-[#3D3A36] text-white hover:bg-white hover:text-black py-3.5 text-center font-black text-xs uppercase tracking-widest transition-all shadow-[4px_4px_0px_0px_#FFD166]">
                    SYNC EMAIL
                  </a>
                )}
                {data.quick_talk_url && (
                  <a href={ensureAbsoluteUrl(data.quick_talk_url)} target="_blank" rel="noopener noreferrer" className="border-4 border-[#3D3A36] bg-white text-[#3D3A36] hover:bg-[#3D3A36] hover:text-white py-3.5 text-center font-black text-xs uppercase tracking-widest transition-all">
                    TALK SCHEDULE
                  </a>
                )}
              </div>
            )}

          </div>

        </div>

      </main>
      <GateModal />
    </div>
  )
}

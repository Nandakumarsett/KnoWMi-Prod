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
          className="fixed inset-0 pointer-events-none opacity-[0.06] z-0"
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
      <div className="min-h-screen bg-[#071324] text-[#71B5F5] font-mono relative overflow-x-hidden selection:bg-[#71B5F5] selection:text-[#071324] p-4 sm:p-8 flex flex-col justify-start items-center">
        {/* CSS rules for blueprints */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes scan-horizontal {
              0% { transform: translateY(-100%); }
              100% { transform: translateY(100%); }
            }
            @keyframes laser-glow {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 0.7; }
            }
            .grid-blueprint {
              background-image: 
                linear-gradient(rgba(113, 181, 245, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(113, 181, 245, 0.1) 1px, transparent 1px),
                linear-gradient(rgba(113, 181, 245, 0.05) 5px, transparent 5px),
                linear-gradient(90deg, rgba(113, 181, 245, 0.05) 5px, transparent 5px);
              background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px;
            }
            .vector-dashed {
              background-image: repeating-linear-gradient(90deg, #71B5F5 0px, #71B5F5 4px, transparent 4px, transparent 8px);
            }
          `
        }} />

        {/* Technical drafting grid background */}
        <div className="fixed inset-0 pointer-events-none grid-blueprint z-0 opacity-70" />
        
        {/* Glowing blueprint laser line */}
        <div className="fixed inset-x-0 h-[2px] bg-sky-500/20 shadow-[0_0_15px_#71B5F5] pointer-events-none animate-[scan-horizontal_12s_linear_infinite] z-10" />

        {/* Blueprint outer frame with drafting details */}
        <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-double border-[#71B5F5]/30 pointer-events-none z-10 p-4 hidden md:flex flex-col justify-between text-[10px] text-[#71B5F5]/50 select-none">
          <div className="flex justify-between">
            <span>DRAFT_ID: PEHCHAAN_DEV_PRTCL</span>
            <span>SYSTEM_MODEL: R-105-V2</span>
            <span>COORD_SPACE: [X_MAX: 1920, Y_MAX: 1080]</span>
          </div>
          <div className="flex justify-between">
            <span>CAD_SCALE: 1:1 [FULL_RESOLUTION]</span>
            <span>SPEC: CREATIVE_SCHEMA_TEES</span>
            <span>STATUS: RENDER_STABLE</span>
          </div>
        </div>

        <main className="w-full max-w-[620px] mx-auto pb-24 pt-8 px-4 flex flex-col items-center relative z-20">
          
          {/* Schematic Blueprint Title Card block */}
          <div className="w-full border-2 border-[#71B5F5] bg-[#071324]/90 backdrop-blur-md p-6 mb-8 text-left shadow-[5px_5px_0px_0px_rgba(113,181,245,0.3)] relative overflow-hidden">
            {/* Corner Crosshairs */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#71B5F5]" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#71B5F5]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#71B5F5]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#71B5F5]" />

            {/* Subdued design vector markings */}
            <div className="absolute top-2 right-4 text-[8px] text-[#71B5F5]/60 font-mono tracking-widest">// ARCH_DRAFT_VIEW_01</div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#71B5F5]/30">
              {/* Technical square photo frame with blueprint vectors */}
              <div className="relative shrink-0">
                <div className="w-32 h-32 border-2 border-[#71B5F5] p-1 bg-[#071324] relative shadow-[0_0_15px_rgba(113,181,245,0.1)]">
                  {/* Dimension lines */}
                  <div className="absolute -top-6 left-0 right-0 flex items-center justify-between text-[8px] text-[#71B5F5]/70">
                    <span>|</span>
                    <span className="border-b border-dashed border-[#71B5F5]/50 flex-grow mx-1 text-center font-bold">120 mm</span>
                    <span>|</span>
                  </div>
                  <div className="absolute -left-6 top-0 bottom-0 flex flex-col items-center justify-between text-[8px] text-[#71B5F5]/70 [writing-mode:vertical-lr]">
                    <span>|</span>
                    <span className="border-b border-dashed border-[#71B5F5]/50 flex-grow my-1 text-center font-bold">120 mm</span>
                    <span>|</span>
                  </div>
                  <div className="w-full h-full border border-dashed border-[#71B5F5]/60 overflow-hidden bg-[#0A223D]">
                    <img
                      src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=071324&color=71b5f5`}
                      className="w-full h-full object-cover filter contrast-125 saturate-50 brightness-90 mix-blend-screen"
                      alt={profile.display_name}
                    />
                  </div>
                </div>
              </div>

              <div className="text-center sm:text-left flex-grow mt-2 sm:mt-0">
                <div className="text-[10px] text-[#71B5F5]/70 font-bold uppercase tracking-[0.2em] mb-1.5">// SYSTEM_IDENTIFIER //</div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-widest uppercase mb-2 leading-none drop-shadow-[0_0_8px_rgba(113,181,245,0.4)]">
                  {profile.display_name}
                </h1>
                <p className="text-xs font-bold text-[#71B5F5] uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2">
                  <Terminal size={14} className="animate-pulse" /> CLASS: {data.about?.role || 'ARCHITECT CORE'}
                </p>
              </div>
            </div>

            {profile.bio && (
              <div className="mt-4 pt-2">
                <span className="text-[9px] text-[#71B5F5]/50 block uppercase font-bold mb-1">// INTENT_SUMMARY_LOG</span>
                <p className="text-xs leading-relaxed text-sky-200/90 pl-3 border-l-2 border-[#71B5F5] italic font-semibold">
                  "{profile.bio}"
                </p>
              </div>
            )}
          </div>

          {/* Infrastructure Specs */}
          {(data.about?.status || data.about?.company || data.about?.mission) && (
            <div className="w-full border-2 border-[#71B5F5] bg-[#071324]/80 backdrop-blur-md p-6 mb-8 text-left relative shadow-[5px_5px_0px_0px_rgba(113,181,245,0.2)]">
              <div className="absolute top-0 right-0 bg-[#71B5F5] text-[#071324] px-2 py-0.5 text-[8px] font-bold">NODE_01_SPECS</div>
              <h3 className="text-sm font-black uppercase text-white tracking-[0.2em] mb-4 border-b border-[#71B5F5]/30 pb-2">
                [01] NODE CONFIGURATION
              </h3>
              <div className="space-y-3.5 text-xs">
                {data.about.status && (
                  <div className="flex justify-between items-center py-1 border-b border-[#71B5F5]/10">
                    <span className="text-[#71B5F5]/60 font-black">NODE_STATE:</span>
                    <span className="text-white font-bold">{data.about.status}</span>
                  </div>
                )}
                {data.about.company && (
                  <div className="flex justify-between items-center py-1 border-b border-[#71B5F5]/10">
                    <span className="text-[#71B5F5]/60 font-black">DEPLOYMENT_SITE:</span>
                    <span className="text-white font-bold">{data.about.company}</span>
                  </div>
                )}
                {data.about.mission && (
                  <div className="pt-2">
                    <span className="text-[#71B5F5]/60 font-black block mb-1.5">STRUCTURAL_GOAL:</span>
                    <p className="text-sky-200 leading-relaxed font-sans text-xs bg-[#0b213b]/50 p-3 border border-[#71B5F5]/20 font-semibold rounded-md">
                      {data.about.mission}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Compiled Modules (Tech Stack) */}
          {((aboutMeLanguages && aboutMeLanguages.length > 0) || (techStack && techStack.length > 0)) && (
            <div className="w-full border-2 border-[#71B5F5] bg-[#071324]/80 backdrop-blur-md p-6 mb-8 text-left relative shadow-[5px_5px_0px_0px_rgba(113,181,245,0.2)]">
              <div className="absolute top-0 right-0 bg-[#71B5F5] text-[#071324] px-2 py-0.5 text-[8px] font-bold">NODE_02_COMPILERS</div>
              <h3 className="text-sm font-black uppercase text-white tracking-[0.2em] mb-6 border-b border-[#71B5F5]/30 pb-2">
                [02] TECHNICAL PROTOCOLS
              </h3>
              
              {aboutMeLanguages && aboutMeLanguages.length > 0 && (
                <div className="mb-6">
                  <span className="text-[10px] font-black text-[#71B5F5]/60 uppercase block mb-3">// SYNTAX_LANGUAGES</span>
                  <div className="flex flex-wrap gap-2">
                    {aboutMeLanguages.map((l, idx) => (
                      <span key={idx} className="border border-[#71B5F5]/50 bg-[#0A223D] px-3.5 py-1.5 text-[10px] font-black uppercase text-white hover:bg-[#71B5F5] hover:text-[#071324] transition-colors duration-200">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {techStack && techStack.length > 0 && (
                <div>
                  <span className="text-[10px] font-black text-[#71B5F5]/60 uppercase block mb-3">// ENGINE_COMPONENTS</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {techStack.map(tech => (
                      <div key={tech} className="border border-[#71B5F5]/30 bg-[#071324] p-3 text-center hover:border-[#71B5F5] hover:bg-[#0b213b]/60 transition-all duration-200 relative group">
                        <span className="text-[10px] font-black uppercase truncate block w-full text-[#71B5F5] group-hover:text-white">{tech}</span>
                        <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#71B5F5]/40 group-hover:bg-[#71B5F5]" />
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
              <span className="block text-[10px] font-black text-[#71B5F5]/60 uppercase tracking-[0.25em] mb-4 px-2">// [03] ARCHITECTURAL RELEASES //</span>
              <div className="space-y-6">
                {data.projects.map((project: any, i: number) => (
                  <div key={i} className="border-2 border-[#71B5F5] bg-[#071324]/90 p-6 relative shadow-[5px_5px_0px_0px_rgba(113,181,245,0.2)]">
                    <div className="absolute top-2 right-4 text-[8px] text-[#71B5F5]/40 font-mono">RELEASE_0{i+1}</div>
                    <h4 className="text-base font-black text-white mb-2.5 uppercase flex items-center gap-2">
                      <Cpu size={16} className="text-[#71B5F5]" /> {project.name}
                    </h4>
                    {project.description && (
                      <p className="text-xs text-sky-200/80 leading-relaxed mb-4 font-sans font-semibold">
                        {project.description}
                      </p>
                    )}
                    {project.live_url && (
                      <a
                        href={ensureAbsoluteUrl(project.live_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-[#71B5F5] hover:text-white transition-colors border-b border-[#71B5F5] pb-0.5"
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
              <span className="block text-[10px] font-black text-[#71B5F5]/60 uppercase tracking-[0.25em] mb-4 px-2">// [04] INTEGRATED CHANNELS //</span>
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
                      className="border-2 border-[#71B5F5] bg-[#071324] hover:bg-[#71B5F5] hover:text-[#071324] px-4 py-2.5 text-xs flex items-center gap-2.5 transition-colors relative cursor-pointer shadow-[3px_3px_0px_0px_rgba(113,181,245,0.25)] font-black text-white hover:shadow-none"
                    >
                      {logo && logo !== 'globe' ? (
                        <img 
                          src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${logo}.svg`}
                          className="w-4 h-4 object-contain filter brightness-0 invert"
                          style={{ filter: 'brightness(0) invert(1)' }}
                          alt={p.platform}
                        />
                      ) : (
                        <Globe size={14} />
                      )}
                      <span className="text-[10px] font-black uppercase">{p.platform}</span>
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
                <a href={`mailto:${data.contact_email}`} className="border-2 border-[#71B5F5] bg-[#71B5F5] text-[#071324] hover:bg-transparent hover:text-[#71B5F5] py-4 text-center font-black text-xs uppercase tracking-widest transition-all shadow-[4px_4px_0px_0px_rgba(113,181,245,0.25)] text-center flex items-center justify-center">
                  Contact Architect
                </a>
              )}
              {data.quick_talk_url && (
                <a href={ensureAbsoluteUrl(data.quick_talk_url)} target="_blank" rel="noopener noreferrer" className="border-2 border-[#71B5F5] bg-[#071324] text-[#71B5F5] hover:bg-[#71B5F5] hover:text-[#071324] py-4 text-center font-black text-xs uppercase tracking-widest transition-all shadow-[4px_4px_0px_0px_rgba(113,181,245,0.25)] text-center flex items-center justify-center">
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
      <div className="min-h-screen bg-black text-[#39FF14] font-mono relative overflow-x-hidden selection:bg-[#39FF14] selection:text-black p-4 sm:p-8 flex flex-col justify-start items-center">
        {/* CSS styles for hackers */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes crt-flicker {
              0% { opacity: 0.97; }
              50% { opacity: 1; }
              100% { opacity: 0.98; }
            }
            @keyframes cursor-blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
            @keyframes text-glow-pulse {
              0%, 100% { text-shadow: 0 0 6px rgba(57, 255, 20, 0.4); }
              50% { text-shadow: 0 0 14px rgba(57, 255, 20, 0.8); }
            }
            .glow-hacker-text {
              animation: text-glow-pulse 4s ease-in-out infinite;
            }
            .crt-scanlines {
              background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
              background-size: 100% 3px, 6px 100%;
            }
          `
        }} />
        
        {/* CRT Scanline Overlay */}
        <div className="fixed inset-0 pointer-events-none z-10 crt-scanlines opacity-50 pointer-events-none" />

        {/* Ambient background glows */}
        <div className="absolute top-[10%] left-[5%] w-[350px] h-[350px] bg-emerald-950/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[5%] w-[350px] h-[350px] bg-green-950/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />

        <main className="w-full max-w-[620px] mx-auto pb-24 pt-8 px-4 flex flex-col items-center relative z-20">
          
          {/* Glowing CRT Frame Avatar */}
          <div className="relative mb-10 group">
            <div className="w-40 h-40 border-2 border-[#39FF14] p-2 bg-black shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_35px_rgba(57,255,20,0.6)] transition-all duration-300 relative">
              <div className="w-full h-full overflow-hidden relative border border-[#39FF14]/50">
                <img
                  src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=000&color=39ff14`}
                  className="w-full h-full object-cover filter brightness-110 contrast-125 saturate-0"
                  alt={profile.display_name}
                />
                <div className="absolute inset-0 bg-[#39FF14]/15 pointer-events-none" />
              </div>
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-[#39FF14]" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#39FF14]" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#39FF14]" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#39FF14]" />
            </div>
            <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 bg-black border border-[#39FF14] px-4 py-0.5 text-[8px] font-bold text-[#39FF14] tracking-widest shadow-[0_0_8px_rgba(57,255,20,0.3)] uppercase">
              NODE_SECTOR_09
            </div>
          </div>

          {/* Tactical HUD Header */}
          <div className="w-full border border-[#39FF14] bg-black/95 p-6 mb-8 text-left shadow-[0_0_15px_rgba(57,255,20,0.15)] relative">
            <div className="absolute top-2 right-4 text-[7px] text-[#39FF14]/70 animate-pulse">// HUD STATUS: ACTIVE</div>
            <div className="text-[9px] text-[#39FF14]/50 mb-2.5 font-bold uppercase tracking-wider">root@knowmi:~# info_check</div>
            
            <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-1.5 drop-shadow-[0_0_8px_rgba(57,255,20,0.7)] glow-hacker-text">
              {(profile.display_name || 'NULL_NODE')}
            </h1>
            <p className="text-xs font-bold text-[#39FF14] uppercase tracking-widest flex items-center gap-2 mt-2">
              <Shield size={12} className="animate-pulse" /> CLASS: {data.about?.role || 'HACKER ENG'}
            </p>
            {profile.bio && (
              <div className="mt-4 pt-3 border-t border-[#39FF14]/20 flex gap-2">
                <span className="text-[#39FF14] text-xs font-bold shrink-0">&gt;</span>
                <p className="text-xs leading-relaxed text-[#39FF14]/90 font-semibold font-mono italic">
                  "{profile.bio}"
                </p>
              </div>
            )}
          </div>

          {/* System status environment */}
          {(data.about?.status || data.about?.company || data.about?.mission) && (
            <div className="w-full border border-[#39FF14] bg-black/90 p-6 mb-8 text-left relative shadow-[0_0_15px_rgba(57,255,20,0.1)]">
              <h3 className="text-xs font-black uppercase text-[#39FF14] tracking-[0.2em] mb-4 border-b border-[#39FF14]/20 pb-2 flex items-center gap-2">
                <Shield size={12} /> SYSTEM STATE PARAMETERS
              </h3>
              <div className="space-y-4 text-xs">
                {data.about.status && (
                  <p className="flex items-center gap-3">
                    <span className="text-[#39FF14]/50 font-bold shrink-0">STATE_STATUS :</span> 
                    <span className="text-white bg-[#0e3b0b]/40 px-2 py-0.5 border border-[#39FF14]/30">{data.about.status}</span>
                  </p>
                )}
                {data.about.company && (
                  <p className="flex items-center gap-3">
                    <span className="text-[#39FF14]/50 font-bold shrink-0">SYS_HOST     :</span> 
                    <span className="text-white font-bold">{data.about.company}</span>
                  </p>
                )}
                {data.about.mission && (
                  <div className="pt-2.5 border-t border-dashed border-[#39FF14]/20">
                    <span className="text-[#39FF14]/50 font-bold block mb-1.5">CORE_MISSION :</span>
                    <p className="text-[#39FF14]/90 leading-relaxed font-sans text-xs bg-[#0e3b0b]/20 p-3 border border-[#39FF14]/30 font-semibold rounded-md relative overflow-hidden">
                      {data.about.mission}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Compiler Stack (Tech) */}
          {((aboutMeLanguages && aboutMeLanguages.length > 0) || (techStack && techStack.length > 0)) && (
            <div className="w-full border border-[#39FF14] bg-black/90 p-6 mb-8 text-left shadow-[0_0_15px_rgba(57,255,20,0.1)]">
              <h3 className="text-xs font-black uppercase text-[#39FF14] tracking-[0.2em] mb-6 border-b border-[#39FF14]/20 pb-2">
                # COMPILED MODULES
              </h3>
              
              {aboutMeLanguages && aboutMeLanguages.length > 0 && (
                <div className="mb-6">
                  <span className="text-[10px] font-black text-[#39FF14]/50 uppercase tracking-widest block mb-3">&gt;_ LANGUAGES</span>
                  <div className="flex flex-wrap gap-2.5">
                    {aboutMeLanguages.map((l, idx) => (
                      <span key={idx} className="border border-[#39FF14] bg-black px-3.5 py-1.5 text-[10px] font-black uppercase text-white shadow-[0_0_8px_rgba(57,255,20,0.2)]">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {techStack && techStack.length > 0 && (
                <div>
                  <span className="text-[10px] font-black text-[#39FF14]/50 uppercase tracking-widest block mb-3">&gt;_ COMPILER_ELEMENTS</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {techStack.map(tech => (
                      <div key={tech} className="border border-[#39FF14]/40 bg-[#0e3b0b]/10 p-3 text-center hover:border-[#39FF14] hover:bg-[#39FF14]/10 transition-all duration-200">
                        <span className="text-[10px] font-black uppercase truncate block w-full text-white">{tech}</span>
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
              <span className="block text-[10px] font-black text-[#39FF14]/50 uppercase tracking-[0.25em] mb-4 px-2">// DEPLOYED_CORES //</span>
              <div className="space-y-6">
                {data.projects.map((project: any, i: number) => (
                  <div key={i} className="border border-[#39FF14] bg-black/95 p-6 shadow-[0_0_12px_rgba(57,255,20,0.1)] hover:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all duration-300 relative">
                    <div className="absolute top-2 right-4 text-[7px] text-[#39FF14]/40">PID_0{i+1}</div>
                    <h4 className="text-base font-black text-white mb-2.5 uppercase flex items-center gap-2">
                      <Terminal size={16} className="text-[#39FF14] animate-pulse" /> {project.name}
                    </h4>
                    {project.description && (
                      <p className="text-xs text-[#39FF14]/85 leading-relaxed mb-4 font-sans font-semibold">
                        {project.description}
                      </p>
                    )}
                    {project.live_url && (
                      <a
                        href={ensureAbsoluteUrl(project.live_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-[#39FF14] hover:text-white border-b border-[#39FF14] pb-0.5 transition-colors duration-200"
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
              <span className="block text-[10px] font-black text-[#39FF14]/50 uppercase tracking-[0.25em] mb-4 px-2">// DECK_SHUNTS //</span>
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
                      className="border border-[#39FF14] bg-black hover:bg-[#39FF14] hover:text-black px-4 py-2.5 text-xs flex items-center gap-2.5 transition-all duration-200 relative cursor-pointer font-black text-white hover:shadow-[0_0_12px_rgba(57,255,20,0.5)]"
                    >
                      {logo && logo !== 'globe' ? (
                        <img 
                          src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${logo}.svg`}
                          className="w-4 h-4 object-contain filter brightness-0 invert hover:brightness-100"
                          style={{ filter: 'brightness(0) invert(1)' }}
                          alt={p.platform}
                        />
                      ) : (
                        <Globe size={14} />
                      )}
                      <span className="text-[10px] font-black uppercase">{p.platform}</span>
                      {isGated && (
                        <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                          <Lock size={12} className="text-white" />
                        </div>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Buttons */}
          {(data.contact_email || data.quick_talk_url) && (
            <div className="grid grid-cols-2 gap-4 w-full text-left">
              {data.contact_email && (
                <a href={`mailto:${data.contact_email}`} className="border border-[#39FF14] bg-[#39FF14] text-black hover:bg-transparent hover:text-[#39FF14] py-4 text-center font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)] text-center flex items-center justify-center">
                  PING SYSTEM
                </a>
              )}
              {data.quick_talk_url && (
                <a href={ensureAbsoluteUrl(data.quick_talk_url)} target="_blank" rel="noopener noreferrer" className="border border-[#39FF14] bg-black text-[#39FF14] hover:bg-[#39FF14] hover:text-black py-4 text-center font-black text-xs uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] text-center flex items-center justify-center">
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
    <div className="min-h-screen bg-[#EBE9E4] text-[#2C2925] font-mono relative overflow-x-hidden selection:bg-[#EAE4D3] selection:text-neutral-900 p-4 sm:p-8 flex flex-col justify-start items-center">
      {/* High-Contrast Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.06] z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center'
        }}
      />

      <main className="w-full max-w-[620px] mx-auto pb-24 pt-8 px-4 flex flex-col items-center relative z-20">

        {/* Retro UNIX Desktop Workstation Chassis */}
        <div className="w-full border-4 border-[#2C2925] bg-[#FFFFFF] rounded-2xl shadow-[12px_12px_0px_0px_#2C2925] overflow-hidden flex flex-col mb-12 relative">
          
          {/* Physical Sticker sheets applied at slight angles */}
          <div className="absolute top-28 -left-4 select-none opacity-95 rotate-[-12deg] z-40 bg-[#FFD166] border-2 border-[#2C2925] text-black px-3.5 py-1.5 text-[9px] font-black uppercase tracking-wider font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]">
            ⚡️ React Inside
          </div>
          
          <div className="absolute top-52 -right-5 select-none opacity-95 rotate-[15deg] z-40 bg-[#EF476F] border-2 border-[#2C2925] text-white px-3.5 py-1.5 text-[9px] font-black uppercase tracking-wider font-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]">
            STABLE CORE
          </div>

          {/* Workstation Header Window Bar */}
          <div className="bg-[#DDD8CC] border-b-4 border-[#2C2925] px-5 py-3.5 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-[#EF476F] border-2 border-[#2C2925] shadow-inner" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#FFD166] border-2 border-[#2C2925] shadow-inner" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#06D6A0] border-2 border-[#2C2925] shadow-inner" />
            </div>
            <div className="text-[10px] font-black text-[#2C2925] uppercase tracking-widest font-mono select-none">
              index.sh - profile - 80x24
            </div>
            <div className="w-10"></div>
          </div>

          <div className="p-6 sm:p-8 flex flex-col items-center">
            
            {/* Round Avatar with retro border inside window chassis */}
            <div className="relative mb-6">
              <div className="w-36 h-36 rounded-full border-4 border-[#2C2925] p-1.5 bg-white shadow-[4px_4px_0px_0px_rgba(44,41,37,0.1)]">
                <div className="w-full h-full rounded-full overflow-hidden border border-[#2C2925]/30">
                  <img
                    src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=ffffff&color=2c2925`}
                    className="w-full h-full object-cover"
                    alt={profile.display_name}
                  />
                </div>
              </div>
            </div>

            {/* Workstation Identity */}
            <div className="text-center w-full">
              <h1 className="text-2xl sm:text-3xl font-black text-[#2C2925] tracking-widest uppercase mb-2">
                {(profile.display_name || 'NEW USER').toUpperCase()}
              </h1>
              <p className="text-xs font-black text-emerald-700 tracking-widest mt-1.5 uppercase bg-emerald-50 border-2 border-emerald-600/30 px-4 py-2 rounded-lg inline-block">
                // {data.about?.role || 'CORE ENGINEER'}
              </p>
              {profile.bio && (
                <div className="text-xs leading-relaxed text-[#5C564E] mt-6 border-t-2 border-dashed border-[#DDD8CC] pt-5 text-left italic font-bold">
                  "{profile.bio}"
                </div>
              )}
            </div>

            {/* System variables prompt logs */}
            {(data.about?.status || data.about?.company || data.about?.mission) && (
              <div className="w-full text-left mt-8 border-2 border-[#2C2925] bg-[#FAF8F4] p-5 relative shadow-[4px_4px_0px_0px_rgba(44,41,37,0.15)]">
                <span className="absolute -top-3.5 left-4 bg-white border-2 border-[#2C2925] px-3.5 py-0.5 text-[9px] font-black text-[#2C2925] uppercase tracking-wider">
                  $ printenv env_vars
                </span>
                <div className="space-y-3.5 font-mono text-xs pt-1.5">
                  {data.about.status && (
                    <p><span className="text-[#5C564E] font-bold">STATUS =</span> <span className="text-neutral-900 font-bold">{data.about.status}</span></p>
                  )}
                  {data.about.company && (
                    <p><span className="text-[#5C564E] font-bold">SYS_HOST =</span> <span className="text-neutral-900 font-bold">{data.about.company}</span></p>
                  )}
                  {data.about.mission && (
                    <div className="pt-2.5 border-t border-dashed border-[#DDD8CC]">
                      <span className="text-[#5C564E] font-bold block mb-1.5">MISSION =</span>
                      <p className="text-neutral-700 leading-relaxed font-sans text-xs bg-white p-3 border border-[#2C2925]/20 font-semibold rounded-md">{data.about.mission}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Compiler stack list */}
            {((aboutMeLanguages && aboutMeLanguages.length > 0) || (techStack && techStack.length > 0)) && (
              <div className="w-full text-left mt-8 border-2 border-[#2C2925] bg-[#FAF8F4] p-5 relative shadow-[4px_4px_0px_0px_rgba(44,41,37,0.15)]">
                <span className="absolute -top-3.5 left-4 bg-white border-2 border-[#2C2925] px-3.5 py-0.5 text-[9px] font-black text-[#2C2925] uppercase tracking-wider">
                  $ list --stack
                </span>
                
                {aboutMeLanguages && aboutMeLanguages.length > 0 && (
                  <div className="mb-4 pt-2">
                    <span className="text-[9px] font-bold text-[#8C8377] uppercase tracking-widest block mb-2">Languages:</span>
                    <div className="flex flex-wrap gap-2.5">
                      {aboutMeLanguages.map((l, i) => (
                        <span key={i} className="text-[10px] bg-white border-2 border-[#2C2925] px-3.5 py-1.5 font-black uppercase text-neutral-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">{l}</span>
                      ))}
                    </div>
                  </div>
                )}

                {techStack && techStack.length > 0 && (
                  <div className="pt-1.5">
                    <span className="text-[9px] font-bold text-[#8C8377] uppercase tracking-widest block mb-2">Components:</span>
                    <div className="flex flex-wrap gap-2.5">
                      {techStack.map(tech => (
                        <span key={tech} className="text-[10px] bg-white border-2 border-[#2C2925] px-3.5 py-1.5 font-black uppercase text-[#2C2925] shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]">{tech}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Released projects */}
            {data.projects && data.projects.length > 0 && (
              <div className="w-full text-left mt-8 border-2 border-[#2C2925] bg-[#FAF8F4] p-5 relative shadow-[4px_4px_0px_0px_rgba(44,41,37,0.15)]">
                <span className="absolute -top-3.5 left-4 bg-white border-2 border-[#2C2925] px-3.5 py-0.5 text-[9px] font-black text-[#2C2925] uppercase tracking-wider">
                  $ ls ./releases
                </span>
                <div className="space-y-5 pt-2">
                  {data.projects.map((project: any, i: number) => (
                    <div key={i} className="border-b border-[#2C2925]/20 last:border-0 pb-4 last:pb-0">
                      <h4 className="text-sm font-black text-neutral-900 uppercase flex items-center gap-2">
                        <Terminal size={14} className="text-emerald-700 animate-pulse" /> {project.name}
                      </h4>
                      {project.description && (
                        <p className="text-xs text-[#5C564E] leading-relaxed font-sans mt-1.5 font-semibold">
                          {project.description}
                        </p>
                      )}
                      {project.live_url && (
                        <a
                          href={ensureAbsoluteUrl(project.live_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-700 hover:text-emerald-800 transition-colors border-b-2 border-emerald-700 pb-0.5 mt-2.5"
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
              <div className="w-full text-left mt-8 border-2 border-[#2C2925] bg-[#FAF8F4] p-5 relative shadow-[4px_4px_0px_0px_rgba(44,41,37,0.15)]">
                <span className="absolute -top-3.5 left-4 bg-white border-2 border-[#2C2925] px-3.5 py-0.5 text-[9px] font-black text-[#2C2925] uppercase tracking-wider">
                  $ sh connections.sh
                </span>
                <div className="flex flex-wrap gap-4 pt-2.5">
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
                        className="border-2 border-[#2C2925] bg-white hover:bg-neutral-50 px-3.5 py-2 text-xs flex items-center gap-2.5 transition-all relative shadow-[3px_3px_0px_0px_rgba(44,41,37,0.15)] cursor-pointer text-[#2C2925] font-black hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(44,41,37,0.15)]"
                      >
                        {logo && logo !== 'globe' ? (
                          <img 
                            src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${logo}.svg`}
                            className="w-3.5 h-3.5 object-contain"
                            style={{ filter: 'brightness(0)' }}
                            alt={p.platform}
                          />
                        ) : (
                          <Globe size={12} />
                        )}
                        <span className="text-[10px] font-black uppercase text-[#2C2925]">{p.platform}</span>
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
            <div className="w-full mt-8 border-t-2 border-dashed border-[#DDD8CC] pt-6 z-20">
              <ProfileCTAs profile={profile} accentColor="#10B981" />
            </div>

            {/* Workstation buttons */}
            {(data.contact_email || data.quick_talk_url) && (
              <div className="grid grid-cols-2 gap-4 w-full text-left mt-6">
                {data.contact_email && (
                  <a href={`mailto:${data.contact_email}`} className="border-4 border-[#2C2925] bg-[#2C2925] text-white hover:bg-white hover:text-black py-4 text-center font-black text-xs uppercase tracking-widest transition-all shadow-[4px_4px_0px_0px_#FFD166] text-center flex items-center justify-center animate-bounce" style={{ animationDuration: '3s' }}>
                    SYNC EMAIL
                  </a>
                )}
                {data.quick_talk_url && (
                  <a href={ensureAbsoluteUrl(data.quick_talk_url)} target="_blank" rel="noopener noreferrer" className="border-4 border-[#2C2925] bg-white text-[#2C2925] hover:bg-[#2C2925] hover:text-white py-4 text-center font-black text-xs uppercase tracking-widest transition-all shadow-[4px_4px_0px_0px_rgba(44,41,37,0.15)] text-center flex items-center justify-center">
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

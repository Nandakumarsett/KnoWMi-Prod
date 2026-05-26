import React from 'react'
import { ProfileData, DeveloperData } from '../../../types/profile'
import { getAssetUrl } from '../../../lib/supabase'
import { UserPlus, Share2, X, Github, Twitter, Linkedin, Monitor, Code2, Database, Layout, Box, Globe, ExternalLink, FileText, Star, Terminal, Mail, Calendar } from 'lucide-react'
import { ProfileCTAs } from '../shared/ProfileCTAs'
import { trackLinkClick } from '../../../lib/analytics/track'
// Simple helper to pick an icon and color for tech stack items
function getTechIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('react') || n.includes('next')) return { icon: <Monitor size={28} />, color: '#0088CC' };
  if (n.includes('node') || n.includes('js') || n.includes('javascript') || n.includes('typescript')) return { icon: <Code2 size={28} />, color: '#3c763d' };
  if (n.includes('python') || n.includes('django')) return { icon: <Code2 size={28} />, color: '#1f4e79' };
  if (n.includes('aws') || n.includes('cloud')) return { icon: <Box size={28} />, color: '#d06000' };
  if (n.includes('docker') || n.includes('container')) return { icon: <Box size={28} />, color: '#005f9e' };
  if (n.includes('git')) return { icon: <Github size={28} />, color: '#c0392b' };
  if (n.includes('sql') || n.includes('data') || n.includes('mongo')) return { icon: <Database size={28} />, color: '#2c3e50' };
  if (n.includes('html') || n.includes('css') || n.includes('web')) return { icon: <Layout size={28} />, color: '#d35400' };
  return { icon: <Code2 size={28} />, color: '#2c3e50' };
}

function getPlatformIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes('github')) return { icon: <Github size={24} />, color: '#1A1A1A' };
  if (p.includes('twitter') || p.includes('x')) return { icon: <Twitter size={24} />, color: '#1DA1F2' };
  if (p.includes('linkedin')) return { icon: <Linkedin size={24} />, color: '#0A66C2' };
  if (p.includes('stackoverflow')) return { icon: <Code2 size={24} />, color: '#F48024' }; // Fallback icon
  return { icon: <Globe size={24} />, color: '#1A1A1A' };
}

export function DeveloperProfile({ profile }: { profile: ProfileData }) {
  const data = (profile.persona_data || {}) as DeveloperData;

  const aboutMeLanguages = (data.about?.languages && data.about.languages.length > 0)
    ? data.about.languages
    : [];

  const techStack = (data.tech_stack && data.tech_stack.length > 0)
    ? data.tech_stack
    : [];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-900 font-mono relative overflow-x-hidden selection:bg-green-200 selection:text-green-800">

      {/* Floating Keyframes Style */}
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
          .animate-float-slow {
            animation: float-slow 10s ease-in-out infinite;
          }
          .animate-float-medium {
            animation: float-medium 7s ease-in-out infinite;
          }
          .animate-float-fast {
            animation: float-fast 5s ease-in-out infinite;
          }
        `}} />

      {/* High-Contrast Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.06] z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8) 1.2px, transparent 1.2px), linear-gradient(90deg, rgba(0, 0, 0, 0.8) 1.2px, transparent 1.2px)',
          backgroundSize: '44px 44px',
          backgroundPosition: 'center center'
        }}
      />

      {/* Floating Background Icons (Light drifting symbols for visual texture) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-40">
        <div className="absolute top-[12%] left-[8%] text-neutral-300 animate-float-slow">
          <Terminal size={32} strokeWidth={1.5} />
        </div>
        <div className="absolute top-[25%] right-[10%] text-neutral-300 animate-float-medium">
          <span className="text-[32px] font-sans font-extralight">{'{ }'}</span>
        </div>
        <div className="absolute top-[38%] left-[12%] text-neutral-300 animate-float-fast">
          <Database size={28} strokeWidth={1.5} />
        </div>
        <div className="absolute top-[52%] right-[8%] text-neutral-300 animate-float-slow">
          <Code2 size={32} strokeWidth={1.5} />
        </div>
        <div className="absolute top-[68%] left-[6%] text-neutral-300 animate-float-medium">
          <Globe size={28} strokeWidth={1.5} />
        </div>
        <div className="absolute top-[82%] right-[12%] text-neutral-300 animate-float-fast">
          <Box size={30} strokeWidth={1.5} />
        </div>
        <div className="absolute top-[90%] left-[15%] text-neutral-300 animate-float-slow">
          <span className="text-[26px] font-sans font-extralight">{'</>'}</span>
        </div>
      </div>

      {/* Banner Image Overlay (Top Cover) */}
      <div className="w-full h-48 sm:h-64 relative bg-[#f0f2f5] overflow-hidden rounded-t-[32px] sm:rounded-t-[40px] rounded-b-none z-10 border-b border-neutral-200">
        {data.featured_work_url ? (
          <img src={getAssetUrl(data.featured_work_url)} className="absolute inset-0 w-full h-full object-cover" alt="Banner" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
        )}
        {/* White Feather overlay seamlessly blending cover into main content */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-[#f8f9fa]/20 to-transparent" />
      </div>

      {/* Top Header (Absolute over Banner - X is hidden on desktop view) */}
      <header className="absolute top-0 w-full z-50 px-6 py-6 flex justify-end items-center md:hidden">
        <button onClick={() => window.history.back()} className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-xl flex items-center justify-center text-neutral-600 hover:text-neutral-900 border border-neutral-300 shadow-md transition-all z-50 relative">
          <X size={20} />
        </button>
      </header>

      {/* Spaced Main Container - w-full max-w-[550px] sm:max-w-[570px] */}
      <main className="w-full max-w-[550px] sm:max-w-[570px] mx-auto pb-20 px-4 flex flex-col items-center relative z-20">

        {/* Avatar Container - Centered Overlapping Banner (Increased picture size to w-36 / sm:w-48!) */}
        <div className="relative -mt-24 sm:-mt-[120px] flex flex-col items-center z-30">
          {/* Custom Avatar Border Shape - Circular Curved Edges */}
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

        {/* Name & Tagline - TIGHT SPACING */}
        <div className="mt-3 mb-2 text-center">
          <h1 className="text-[28px] font-mono font-black text-neutral-950 tracking-widest leading-tight">
            {(profile.display_name || 'NEW USER').toUpperCase()}
          </h1>
          <p className="text-neutral-800 font-black text-base sm:text-lg tracking-widest mt-1.5 uppercase">
            {data.about?.role || data.tagline || 'SYSTEM ENGINEER'}
          </p>
        </div>

        {/* Public Bio - TIGHT SPACING */}
        {profile.bio && (
          <p className="text-neutral-800 font-sans text-[15px] sm:text-[16px] text-center mt-1.5 mb-2.5 max-w-[92%] leading-relaxed font-extrabold">
            {profile.bio}
          </p>
        )}

        {/* SOCIAL LINKS (Moved near profile pic) - TIGHT SPACING */}
        {data.platforms && data.platforms.length > 0 && (
          <div className="w-full flex flex-wrap justify-center gap-6 mt-2 mb-4 z-20">
            {data.platforms.map((p, i) => {
              if (!p.url) return null;
              const { icon, color } = getPlatformIcon(p.platform || '');
              // Adjust GitHub icon color to be visible on white background
              const displayColor = (p.platform?.toLowerCase() === 'github') ? '#1A1A1A' : color;
              return (
                <a
                  key={i}
                  href={p.url.startsWith('http') ? p.url : `https://${p.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackLinkClick(profile.id, p.platform || 'unknown', p.url)}
                  className="hover:scale-110 transition-transform duration-300 text-neutral-500 hover:text-neutral-900"
                  style={{ color: displayColor }}
                  aria-label={p.platform}
                >
                  {icon}
                </a>
              )
            })}
          </div>
        )}

        {/* Status Badge - TIGHT SPACING */}
        {data.about?.status && (
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl bg-green-100 border-2 border-green-300 text-green-950 font-mono text-[13px] sm:text-[14px] font-black uppercase tracking-widest mt-2 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
            </span>
            {data.about.status === 'Working at Company' && data.about.company
              ? `Currently at ${data.about.company}`
              : data.about.status}
          </div>
        )}

        {/* Connection CTAs */}
        <div className="w-full max-w-sm mt-4 z-20">
          <ProfileCTAs profile={profile} accentColor="#16a34a" />
        </div>

        {/* ABOUT ME IDE Card - Tighter Gaps, Bigger Text, Overlapping corner sticker! */}
        {(data.about?.role || data.about?.status || data.about?.company || data.about?.mission) && (
          <div className="w-full mt-10 text-left bg-white border-2 border-neutral-300 border-l-[6px] border-l-green-600 rounded-[32px] rounded-l-none p-8 shadow-xl relative group hover:shadow-2xl hover:border-neutral-400 transition-all duration-300">

            {/* Physical Laptop Sticker 1 - Overlapping Top Left corner cleanly! */}
            <div className="absolute -top-4 -left-3 rotate-[-10deg] z-40 bg-gradient-to-r from-amber-500 to-orange-600 border-2 border-white text-white px-3 py-1.5 rounded-2xl shadow-lg select-none pointer-events-none transform hover:scale-110 hover:rotate-[-6deg] transition-all duration-300">
              <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 font-mono">
                ⚡️ SUPER_CHARGED
              </span>
            </div>

            {/* Decorative IDE buttons */}
            <div className="absolute top-6 right-6 flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>

            <span className="block text-[13px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-6 mt-2">About Me</span>
            <div className="space-y-4 font-mono text-sm">
              {data.about?.role && (
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <span className="text-neutral-500 font-bold text-[12px] uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal size={12} className="text-green-600" /> ROLE
                  </span>
                  <span className="text-neutral-900 font-black text-[15px]">{data.about.role}</span>
                </div>
              )}
              {data.about?.status && (
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <span className="text-neutral-500 font-bold text-[12px] uppercase tracking-wider flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" /> STATUS
                  </span>
                  <span className="text-green-700 font-black text-[15px]">{data.about.status}</span>
                </div>
              )}
              {data.about?.company && (
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <span className="text-neutral-500 font-bold text-[12px] uppercase tracking-wider flex items-center gap-1.5">
                    <Box size={12} className="text-blue-600" /> ORGANIZATION
                  </span>
                  <span className="text-neutral-900 font-black text-[15px]">{data.about.company}</span>
                </div>
              )}
              {data.about?.mission && (
                <div className="pt-2 text-left">
                  <span className="block text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1.5">MISSION</span>
                  <p className="text-[14px] text-neutral-700 leading-relaxed font-sans font-medium">{data.about.mission}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TECH STACK & LANGUAGES - Physical Sticker overlapping top-right! */}
        {((aboutMeLanguages && aboutMeLanguages.length > 0) || (techStack && techStack.length > 0)) && (
          <div className="w-full mt-10 bg-white border-2 border-neutral-300 rounded-[32px] p-8 shadow-xl space-y-8 group/tech hover:shadow-2xl hover:border-neutral-400 transition-all duration-300 relative">

            {/* Physical Laptop Sticker 2 - Overlapping Top Right corner cleanly! */}
            <div className="absolute -top-4 -right-3 rotate-[8deg] z-40 bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-white text-white px-3 py-1.5 rounded-2xl shadow-lg select-none pointer-events-none transform hover:scale-110 hover:rotate-[14deg] transition-all duration-300">
              <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 font-mono">
                🚀 SHIP_EVERYDAY
              </span>
            </div>

            {aboutMeLanguages && aboutMeLanguages.length > 0 && (
              <div>
                <span className="block text-[13px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-4">Core Languages</span>
                <div className="flex flex-wrap gap-2.5">
                  {aboutMeLanguages.map((l, i) => (
                    <span key={i} className="text-[12px] bg-neutral-50 hover:bg-green-50 hover:text-green-800 hover:border-green-300 transition-colors text-neutral-800 px-4 py-2 rounded-xl border border-neutral-300 font-black uppercase tracking-wider cursor-default shadow-sm">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {techStack && techStack.length > 0 && (
              <div>
                <span className="block text-[13px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-6">Technologies & Frameworks</span>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                  {techStack.map(tech => {
                    const { icon, color } = getTechIcon(tech);
                    return (
                      <div key={tech} className="flex flex-col items-center gap-2 group cursor-pointer">
                        <div
                          className="w-14 h-14 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-white group-hover:shadow-md transition-all duration-300"
                          style={{ '--hover-color': color } as React.CSSProperties}
                          onMouseEnter={e => {
                            e.currentTarget.style.color = color;
                            e.currentTarget.style.borderColor = `${color}60`;
                            e.currentTarget.style.boxShadow = `0 10px 15px -3px ${color}30, 0 4px 6px -4px ${color}30`;
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.color = '';
                            e.currentTarget.style.borderColor = '';
                            e.currentTarget.style.boxShadow = '';
                          }}
                        >
                          {icon}
                        </div>
                        <span className="text-[11px] font-black text-neutral-600 tracking-wider group-hover:text-neutral-900 transition-colors uppercase">{tech}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* RECENT WORKS (PROJECTS) */}
        {data.projects && data.projects.length > 0 && (
          <div className="w-full mt-12 text-left relative z-10">
            <span className="block text-[13px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-6 ml-1">Built Masterpieces</span>
            <div className="space-y-8">
              {data.projects.map((project: any, i: number) => (
                <div key={i} className="bg-white border-2 border-neutral-300 rounded-[32px] overflow-hidden group hover:border-green-500 hover:shadow-2xl transition-all duration-300 shadow-xl">
                  {project.url && (
                    <div className="w-full h-56 bg-[#f0f2f5] overflow-hidden relative border-b border-neutral-200">
                      {/* Browser-style address bar mockup */}
                      <div className="absolute top-0 w-full bg-neutral-100/95 border-b border-neutral-200 py-2 px-4 flex items-center gap-2 z-20">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                          <div className="w-2 h-2 rounded-full bg-yellow-400" />
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 bg-white border border-neutral-300 rounded-md text-[11px] font-sans text-neutral-500 px-3 py-0.5 truncate text-center max-w-[280px] mx-auto uppercase tracking-wider font-bold">
                          {project.name.toLowerCase().replace(/\s+/g, '-')}.knowmi.me
                        </div>
                      </div>
                      <img src={getAssetUrl(project.url)} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 pt-8" alt={project.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-20 pointer-events-none" />
                    </div>
                  )}
                  <div className="p-8 relative">

                    {/* Physical Laptop Sticker 3 - Stuck neatly on the inside top-right padding bounds! */}
                    <div className="absolute -top-4 right-6 rotate-[6deg] z-40 bg-gradient-to-r from-green-500 to-emerald-600 border-2 border-white text-white px-3 py-1.5 rounded-2xl shadow-lg select-none pointer-events-none transform hover:scale-110 transition-all duration-300">
                      <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 font-mono">
                        🛡️ VERIFIED_BUILDER
                      </span>
                    </div>

                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-2xl font-black text-neutral-950 flex items-center gap-3 font-mono">
                        <Terminal size={24} className="text-green-600" />
                        {project.name}
                      </h3>
                    </div>
                    {project.stars > 0 && (
                      <div className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-4">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-black">{project.stars} Stars</span>
                      </div>
                    )}
                    {project.description && (
                      <p className="text-[15px] sm:text-[16px] text-neutral-700 leading-relaxed mb-6 font-sans font-medium">
                        {project.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4">
                      {(project.live_url || project.github_url) && (
                        <a
                          href={(project.live_url || project.github_url).startsWith('http') ? (project.live_url || project.github_url) : `https://${project.live_url || project.github_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 text-[13px] sm:text-sm font-black uppercase tracking-widest text-white hover:bg-neutral-800 bg-neutral-900 border border-neutral-950 px-6 py-3.5 rounded-xl transition-all shadow-md active:scale-95 duration-150"
                        >
                          <ExternalLink size={16} /> View Project
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT ACTIONS */}
        {(data.contact_email || data.quick_talk_url) && (
          <div className="w-full mt-10 grid grid-cols-2 gap-4 relative z-10 text-left">
            {data.contact_email ? (
              <a
                href={`mailto:${data.contact_email}`}
                className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-[20px] bg-neutral-900 border-2 border-neutral-950 text-white font-black text-sm uppercase tracking-widest hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-md"
              >
                <Mail size={16} /> Email Me
              </a>
            ) : <div />}

            {data.quick_talk_url ? (
              <a
                href={data.quick_talk_url.startsWith('http') ? data.quick_talk_url : `https://${data.quick_talk_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-[20px] bg-white border-2 border-neutral-300 text-neutral-900 font-black text-sm uppercase tracking-widest hover:bg-neutral-50 hover:border-neutral-400 transition-all active:scale-[0.98] shadow-md"
              >
                <Calendar size={16} /> Quick Talk
              </a>
            ) : <div />}
          </div>
        )}

        {/* COMMAND CENTER / CV */}
        {data.resume_url && (
          <div className="w-full mt-10 relative z-10 text-left">
            <span className="block text-[13px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-4 ml-1">Engineering CV</span>
            <a
              href={getAssetUrl(data.resume_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-6 rounded-[24px] bg-white border-2 border-neutral-300 group hover:border-neutral-400 transition-all active:scale-[0.98] shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-neutral-50/50 group-hover:bg-neutral-100 transition-colors animate-pulse pointer-events-none" />

              {/* Physical Laptop Sticker 4 - Overlaps the bottom-right corner beautifully! */}
              <div className="absolute -bottom-4 right-10 rotate-[-5deg] z-40 bg-gradient-to-r from-yellow-500 to-amber-600 border-2 border-white text-white px-3 py-1.5 rounded-2xl shadow-lg select-none pointer-events-none transform hover:scale-110 transition-transform duration-300">
                <span className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 font-mono">
                  💻 100%_HARDWARE
                </span>
              </div>

              <div className="flex items-center gap-5 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-800 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-lg font-black text-neutral-950 tracking-wide">Professional Resume</p>
                  <p className="text-[12px] sm:text-[13px] font-black text-neutral-500 uppercase tracking-widest mt-1">Download Full PDF</p>
                </div>
              </div>
              <ExternalLink size={20} className="text-neutral-400 group-hover:text-neutral-900 transition-colors relative z-10" />
            </a>
          </div>
        )}

      </main>
    </div>
  )
}

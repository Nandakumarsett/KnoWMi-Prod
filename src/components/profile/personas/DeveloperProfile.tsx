import React from 'react'
import { ProfileData, DeveloperData } from '../../../types/profile'
import { ProfileCTAs } from '../shared/ProfileCTAs'
import { PulseBar } from '../shared/PulseBar'
import { SocialGrid } from '../shared/SocialGrid'
import { VerifiedBadge } from '../shared/VerifiedBadge'
import { ProfileAvatar } from '../shared/ProfileAvatar'
import { Github, ExternalLink, Code2, Terminal, FileText, Trophy } from 'lucide-react'

// Syntax Highlighting Utility
function highlightCode(code: string): string {
  if (!code) return ''
  return code
    .replace(/(const|let|var)/g, '<span style="color:#ff7b72">$1</span>')
    .replace(/('.*?')/g, '<span style="color:#a5d6ff">$1</span>')
    .replace(/(\[.*?\])/g, '<span style="color:#a8f0a8">$1</span>')
    .replace(/(role|mission|languages):/g, '<span style="color:#79c0ff">$1</span>:')
}

export function DeveloperProfile({ profile }: { profile: ProfileData }) {
  const data = profile.persona_data as DeveloperData
  const accentGreen = '#3fb950'

  const formatUrl = (url: string) => {
    if (!url) return '#'
    return url.startsWith('http') ? url : `https://${url}`
  }
  
  const aboutMeCode = data.about ? `const aboutMe = {
  role: '${data.about.role || ''}',
  mission: '${data.about.mission || ''}',
  languages: [${(data.about.languages || []).map(l => `'${l}'`).join(', ')}]
};` : ''

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-mono selection:bg-[#3fb95033] selection:text-[#3fb950]">
      {/* Header Bar */}
      <header className="fixed top-0 w-full z-50 bg-[#161b22] border-b border-[#30363d] px-6 py-4 flex justify-between items-center backdrop-blur-md bg-opacity-80">
        <div className="flex items-center gap-2">
          <img src="/logo-square.png" className="w-6 h-6 object-cover rounded" alt="KW" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#8b949e]">
            {profile.first_name ? `${profile.first_name}'s Profile` : "Your Profile"}
          </span>
        </div>
        <div className="text-[10px] font-bold text-[#3fb950] animate-pulse uppercase tracking-widest">
          {'>'} SCAN ME...
        </div>
      </header>

      <main className="max-w-[480px] mx-auto pt-24 pb-12 px-6 flex flex-col items-center">
        {/* Hexagon Avatar */}
        <div className="relative mb-8 group transition-transform duration-500 group-hover:scale-105">
          <ProfileAvatar
            src={profile.avatar_url}
            name={profile.display_name}
            size={128}
            shape="hexagon"
            accentColor={accentGreen}
          />
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#161b22] border border-[#30363d] rounded-xl flex items-center justify-center text-[#3fb950] shadow-2xl">
            <Code2 size={20} />
          </div>
        </div>

        {/* Name & Tagline */}
        <h1 className="text-4xl font-black uppercase tracking-tight text-center mb-2 font-display">
          {profile.display_name}
        </h1>
        <p className="text-sm text-[#3fb950] font-black uppercase tracking-[0.4em] mb-8 text-center">
          {data.about?.role || data.tagline || 'SYSTEM ENGINEER'}
        </p>

        <VerifiedBadge isVerified={profile.is_verified} accentColor={accentGreen} />

        {/* Stat Pills */}
        <div className="grid grid-cols-2 gap-4 w-full mt-10">
           <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 text-center group hover:border-[#3fb95066] transition-colors shadow-lg">
             <span className="block text-[10px] font-bold text-[#8b949e] uppercase tracking-widest mb-1">Commits</span>
             <span className="text-3xl font-black text-[#3fb950]">{data.commits || 0}+</span>
           </div>
           <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 text-center group hover:border-[#79c0ff66] transition-colors shadow-lg">
             <span className="block text-[10px] font-bold text-[#8b949e] uppercase tracking-widest mb-1">Collaborations</span>
             <span className="text-3xl font-black text-[#79c0ff]">{data.collabs || 0}+</span>
           </div>
        </div>

        {/* CTAs */}
        <ProfileCTAs profile={profile} accentColor={accentGreen} />

        {/* Sections */}
        <div className="w-full mt-12 space-y-12">
          {/* About Me Code Block */}
          {aboutMeCode && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#8b949e]">System Overview</span>
                <div className="flex-1 h-px bg-[#30363d]" />
              </div>
              <pre 
                className="p-8 rounded-2xl bg-[#161b22] border border-[#30363d] overflow-x-auto text-[14px] leading-relaxed shadow-2xl"
                style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
                dangerouslySetInnerHTML={{ __html: highlightCode(aboutMeCode) }}
              />
            </section>
          )}

          {/* Professional CV Section */}
          {data.resume_url && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#8b949e]">Engineering CV</span>
                <div className="flex-1 h-px bg-[#30363d]" />
              </div>
              <a 
                href={formatUrl(data.resume_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-8 rounded-2xl bg-[#161b22] border border-[#30363d] group hover:border-[#3fb95066] transition-all active:scale-[0.98] shadow-xl"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl bg-[#3fb9501a] text-[#3fb950] flex items-center justify-center shadow-inner">
                    <FileText size={28} />
                  </div>
                  <div>
                    <p className="text-md font-black text-[#e6edf3]">Professional Resume</p>
                    <p className="text-[10px] font-bold text-[#3fb950] uppercase tracking-widest mt-0.5">Download Full PDF ↓</p>
                  </div>
                </div>
                <ExternalLink size={20} className="text-[#30363d] group-hover:text-[#3fb950] transition-colors" />
              </a>
            </section>
          )}

          {/* Tech Stack */}
          {data.tech_stack && data.tech_stack.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#8b949e]">Technology Stack</span>
                <div className="flex-1 h-px bg-[#30363d]" />
              </div>
              <div className="flex flex-wrap gap-2">
                {data.tech_stack.map(tech => (
                  <div key={tech} className="px-4 py-2 rounded-xl bg-[#161b22] border border-[#30363d] text-[11px] font-bold uppercase tracking-widest hover:border-[#3fb950] transition-colors flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#3fb950]" />
                    {tech}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8b949e]">Projects</span>
                <div className="flex-1 h-px bg-[#30363d]" />
              </div>
              <div className="space-y-4">
                {data.projects.map(project => (
                  <div key={project.name} className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-[#3fb95033] transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-[#79c0ff] flex items-center gap-2 group-hover:text-[#3fb950] transition-colors">
                        <Terminal size={16} />
                        {project.name}
                      </h3>
                      {project.stars && (
                        <span className="text-[10px] font-bold text-[#e3b341]">★ {project.stars}</span>
                      )}
                    </div>
                    <p className="text-xs text-[#8b949e] leading-relaxed mb-4">{project.description}</p>
                    <div className="flex gap-3">
                      {project.github_url && (
                        <a href={formatUrl(project.github_url)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] font-black uppercase text-[#8b949e] hover:text-[#e6edf3] transition-colors">
                          <Github size={12} /> Source
                        </a>
                      )}
                      {project.live_url && (
                        <a href={formatUrl(project.live_url)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] font-black uppercase text-[#8b949e] hover:text-[#e6edf3] transition-colors">
                          <ExternalLink size={12} /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {data.achievements && data.achievements.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8b949e]">Achievements</span>
                <div className="flex-1 h-px bg-[#30363d]" />
              </div>
              <div className="grid grid-cols-1 gap-3">
                {data.achievements.map((ach: string | any, i: number) => {
                  const label = typeof ach === 'string' ? ach : ach.label;
                  const icon = typeof ach === 'string' ? '🏆' : ach.icon;
                  return (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-[#161b22] border border-[#30363d] hover:bg-[#3fb9500a] transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-[#3fb9501a] text-[#3fb950] flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                        {icon}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#e6edf3]">{label}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Social Links Row */}
        <div className="mt-12 w-full">
           <SocialGrid links={profile.social_links} style="row" />
        </div>

        {/* Pulse Bar Footer */}
        <PulseBar pulse={profile.pulse} tier={profile.tier} accentColor={accentGreen} />
      </main>
    </div>
  )
}

import React from 'react'
import { ProfileData, DeveloperData } from '../../../types/profile'
import { getAssetUrl } from '../../../lib/supabase'
import { UserPlus, Share2, X, Github, Twitter, Linkedin, Monitor, Code2, Database, Layout, Box, Globe, ExternalLink, FileText, Star, Terminal } from 'lucide-react'

// Simple helper to pick an icon and color for tech stack items
function getTechIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('react') || n.includes('next')) return { icon: <Monitor size={28} />, color: '#61DAFB' };
  if (n.includes('node') || n.includes('js') || n.includes('javascript') || n.includes('typescript')) return { icon: <Code2 size={28} />, color: '#68A063' };
  if (n.includes('python') || n.includes('django')) return { icon: <Code2 size={28} />, color: '#3776AB' };
  if (n.includes('aws') || n.includes('cloud')) return { icon: <Box size={28} />, color: '#FF9900' };
  if (n.includes('docker') || n.includes('container')) return { icon: <Box size={28} />, color: '#2496ED' };
  if (n.includes('git')) return { icon: <Github size={28} />, color: '#F05032' };
  if (n.includes('sql') || n.includes('data') || n.includes('mongo')) return { icon: <Database size={28} />, color: '#336791' };
  if (n.includes('html') || n.includes('css') || n.includes('web')) return { icon: <Layout size={28} />, color: '#E34F26' };
  return { icon: <Code2 size={28} />, color: '#8b949e' };
}

function getPlatformIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes('github')) return { icon: <Github size={24} />, color: '#1A1A1A' };
  if (p.includes('twitter') || p.includes('x')) return { icon: <Twitter size={24} />, color: '#1DA1F2' };
  if (p.includes('linkedin')) return { icon: <Linkedin size={24} />, color: '#0A66C2' };
  if (p.includes('stackoverflow')) return { icon: <Code2 size={24} />, color: '#F48024' }; // Fallback icon
  return { icon: <Globe size={24} />, color: '#8b949e' };
}

export function DeveloperProfile({ profile }: { profile: ProfileData }) {
  const data = profile.persona_data as DeveloperData;

  const aboutMeLanguages = (data.about?.languages && data.about.languages.length > 0) 
    ? data.about.languages 
    : ['JavaScript', 'Python', 'C++'];

  const techStack = (data.tech_stack && data.tech_stack.length > 0) 
    ? data.tech_stack 
    : ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'Git'];

  return (
    <div className="min-h-screen bg-white text-neutral-800 font-mono relative overflow-x-hidden selection:bg-green-100 selection:text-green-800">
      
      {/* Floating Keyframes Style */}
      <style dangerouslySetInnerHTML={{ __html: `
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

      {/* Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 z-0" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)', 
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center'
        }} 
      />

      {/* Floating Background Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div className="absolute top-[12%] left-[8%] text-neutral-200 animate-float-slow">
          <Terminal size={32} strokeWidth={1} />
        </div>
        <div className="absolute top-[25%] right-[10%] text-neutral-200 animate-float-medium">
          <span className="text-[32px] font-sans font-extralight">{'{ }'}</span>
        </div>
        <div className="absolute top-[38%] left-[12%] text-neutral-200 animate-float-fast">
          <Database size={28} strokeWidth={1} />
        </div>
        <div className="absolute top-[52%] right-[8%] text-neutral-200 animate-float-slow">
          <Code2 size={32} strokeWidth={1} />
        </div>
        <div className="absolute top-[68%] left-[6%] text-neutral-200 animate-float-medium">
          <Globe size={28} strokeWidth={1} />
        </div>
        <div className="absolute top-[82%] right-[12%] text-neutral-200 animate-float-fast">
          <Box size={30} strokeWidth={1} />
        </div>
        <div className="absolute top-[90%] left-[15%] text-neutral-200 animate-float-slow">
          <span className="text-[26px] font-sans font-extralight">{'</>'}</span>
        </div>
      </div>

      {/* Banner Image Overlay (Top Cover) */}
      <div className="w-full h-48 sm:h-64 relative bg-white overflow-hidden rounded-t-[32px] sm:rounded-t-[40px] rounded-b-[40px] z-10 border-b border-neutral-100">
        {data.featured_work_url ? (
          <img src={getAssetUrl(data.featured_work_url)} className="absolute inset-0 w-full h-full object-cover" alt="Banner" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-neutral-100" />
        )}
        {/* Feather overlay matching creator section style */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
      </div>

      {/* Top Header (Absolute over Banner - X is hidden on desktop view) */}
      <header className="absolute top-0 w-full z-50 px-6 py-6 flex justify-end items-center md:hidden">
        <button onClick={() => window.history.back()} className="w-10 h-10 bg-white/85 backdrop-blur-md rounded-xl flex items-center justify-center text-neutral-500 hover:text-neutral-900 border border-neutral-200 shadow-sm transition-all z-50 relative">
          <X size={20} />
        </button>
      </header>

      <main className="max-w-[480px] mx-auto pb-20 px-6 flex flex-col items-center relative z-20">
        
        {/* Avatar Container - Centered Overlapping Banner */}
        <div className="relative -mt-16 sm:-mt-20 flex flex-col items-center z-30">
          {/* Custom Avatar Border Shape - Circular Curved Edges */}
          <div className="relative p-[3px] rounded-full bg-white shadow-xl shadow-neutral-200/80">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-neutral-100 border-4 border-white">
              <img 
                src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=f0f0f0&color=22c55e`} 
                className="w-full h-full object-cover" 
                alt={profile.display_name} 
              />
            </div>
          </div>
        </div>

        {/* Name & Tagline */}
        <div className="mt-4 sm:mt-5 mb-4 text-center">
          <h1 className="text-[28px] font-mono font-black text-neutral-900 tracking-widest leading-tight">
            {(profile.display_name || 'NEW USER').toUpperCase()}
          </h1>
          <p className="text-neutral-500 font-bold text-sm tracking-widest mt-2">
            {data.about?.role || data.tagline || 'SYSTEM ENGINEER'}
          </p>
        </div>

        {/* Public Bio */}
        {profile.bio && (
          <p className="text-neutral-500 font-sans text-sm text-center mt-2 mb-6 max-w-[90%] leading-relaxed">
            {profile.bio}
          </p>
        )}

        {/* SOCIAL LINKS (Moved near profile pic) */}
        {data.platforms && data.platforms.length > 0 && (
          <div className="w-full flex flex-wrap justify-center gap-6 mt-4 mb-10 z-20">
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
                   className="hover:scale-110 transition-transform duration-300 text-neutral-400 hover:text-neutral-900"
                   style={{ color: displayColor }}
                   aria-label={p.platform}
                 >
                   {icon}
                 </a>
               )
             })}
          </div>
        )}

        {/* Status Badge */}
        {data.about?.status && (
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-green-50 border border-green-200 text-green-700 font-mono text-[11px] font-black uppercase tracking-widest mt-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {data.about.status === 'Working at Company' && data.about.company 
              ? `Currently at ${data.about.company}`
              : data.about.status}
          </div>
        )}

        {/* ABOUT ME Minimal Layout */}
        <div className="w-full mt-10 text-left bg-white border border-neutral-200/60 rounded-[32px] p-8 shadow-xl shadow-neutral-100/50 relative overflow-hidden">
           <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-6">About Me</span>
           <div className="space-y-4 font-mono text-sm">
             <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
               <span className="text-neutral-400 text-[10px] uppercase tracking-wider">ROLE</span>
               <span className="text-neutral-800 font-black text-[13px]">{data.about?.role || 'Full Stack Developer'}</span>
             </div>
             <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
               <span className="text-neutral-400 text-[10px] uppercase tracking-wider">STATUS</span>
               <span className="text-green-600 font-black text-[13px]">{data.about?.status || 'Active'}</span>
             </div>
             {data.about?.company && (
               <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                 <span className="text-neutral-400 text-[10px] uppercase tracking-wider">ORGANIZATION</span>
                 <span className="text-neutral-800 font-black text-[13px]">{data.about.company}</span>
               </div>
             )}
             {data.about?.mission && (
               <div className="pt-2 text-left">
                 <span className="block text-[9px] text-neutral-400 uppercase tracking-widest mb-1.5">MISSION</span>
                 <p className="text-xs text-neutral-500 leading-relaxed font-sans">{data.about.mission}</p>
               </div>
             )}
           </div>
        </div>

        {/* TECH STACK & LANGUAGES */}
        <div className="w-full mt-10 bg-white border border-neutral-200/60 rounded-[32px] p-8 shadow-xl shadow-neutral-100/50 space-y-8">
           {aboutMeLanguages && aboutMeLanguages.length > 0 && (
             <div>
               <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-4">Core Languages</span>
               <div className="flex flex-wrap gap-2">
                 {aboutMeLanguages.map((l, i) => (
                   <span key={i} className="text-[10px] bg-neutral-50 text-neutral-700 px-3 py-1.5 rounded-xl border border-neutral-200 font-black uppercase tracking-wider">
                     {l}
                   </span>
                 ))}
               </div>
             </div>
           )}

           <div>
             <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-6">Technologies & Frameworks</span>
             <div className="grid grid-cols-3 sm:flex sm:flex-wrap justify-start gap-8">
               {techStack.map(tech => {
                 const { icon, color } = getTechIcon(tech);
                 return (
                   <div key={tech} className="flex flex-col items-center gap-3 group">
                     <div className="text-neutral-400 group-hover:scale-110 transition-transform duration-300" style={{ '--hover-color': color } as React.CSSProperties} onClick={e => e.currentTarget.style.color = color}>
                       {icon}
                     </div>
                     <span className="text-[10px] font-bold text-neutral-500 tracking-wider group-hover:text-neutral-900 transition-colors">{tech}</span>
                   </div>
                 )
               })}
             </div>
           </div>
        </div>

        {/* RECENT WORKS (PROJECTS) */}
        {data.projects && data.projects.length > 0 && (
          <div className="w-full mt-12 text-left relative z-10">
             <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-6 ml-1">Built Masterpieces</span>
             <div className="space-y-6">
                {data.projects.map((project: any, i: number) => (
                  <div key={i} className="bg-white border border-neutral-200/60 rounded-[32px] overflow-hidden group hover:border-neutral-300 transition-colors shadow-xl shadow-neutral-100/50">
                    {project.url && (
                      <div className="w-full h-48 bg-neutral-50 overflow-hidden relative">
                        <img src={getAssetUrl(project.url)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={project.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-30" />
                      </div>
                    )}
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-black text-neutral-900 flex items-center gap-3">
                          <Terminal size={20} className="text-green-600" />
                          {project.name}
                        </h3>
                        {project.stars > 0 && (
                          <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                            <Star size={12} fill="currentColor" />
                            <span className="text-[10px] font-black">{project.stars}</span>
                          </div>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-sm text-neutral-500 leading-relaxed mb-6 font-sans">
                          {project.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4">
                        {(project.live_url || project.github_url) && (
                          <a 
                            href={(project.live_url || project.github_url).startsWith('http') ? (project.live_url || project.github_url) : `https://${project.live_url || project.github_url}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white hover:bg-neutral-800 bg-neutral-900 px-4 py-2.5 rounded-xl transition-colors shadow-md"
                          >
                            <ExternalLink size={14} /> View Project
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* COMMAND CENTER / CV */}
        {data.resume_url && (
          <div className="w-full mt-10 relative z-10 text-left">
             <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-4 ml-1">Engineering CV</span>
             <a 
               href={getAssetUrl(data.resume_url)}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center justify-between p-6 rounded-[24px] bg-white border border-neutral-200/60 group hover:border-neutral-300 transition-all active:scale-[0.98] shadow-xl shadow-neutral-100/50 relative overflow-hidden"
             >
               <div className="absolute inset-0 bg-neutral-50/50 group-hover:bg-neutral-50 transition-colors" />
               <div className="flex items-center gap-5 relative z-10">
                 <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-800 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                   <FileText size={24} />
                 </div>
                 <div>
                   <p className="text-md font-black text-neutral-900 tracking-wide">Professional Resume</p>
                   <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1">Download Full PDF</p>
                 </div>
               </div>
               <ExternalLink size={20} className="text-neutral-300 group-hover:text-neutral-900 transition-colors relative z-10" />
             </a>
          </div>
        )}

      </main>
    </div>
  )
}

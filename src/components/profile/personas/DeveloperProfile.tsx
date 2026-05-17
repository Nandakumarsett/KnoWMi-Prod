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
  if (p.includes('github')) return { icon: <Github size={24} />, color: '#ffffff' };
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
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-mono relative overflow-x-hidden selection:bg-[#3fb95033] selection:text-[#3fb950]">
      
      {/* Matrix / Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 z-0" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(63, 185, 80, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(63, 185, 80, 0.15) 1px, transparent 1px)', 
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center'
        }} 
      />

      {/* Banner Image Overlay (Top Cover) */}
      <div className="w-full h-48 sm:h-64 relative bg-[#0d1117] overflow-hidden rounded-b-[40px] z-10">
        {data.featured_work_url ? (
          <img src={getAssetUrl(data.featured_work_url)} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Banner" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#161b22] to-[#0d1117]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-black/40" />
      </div>

      {/* Top Header (Absolute over Banner) */}
      <header className="absolute top-0 w-full z-50 px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 bg-[#0d1117]/60 px-3 py-1.5 rounded-lg backdrop-blur-md">
          <span className="text-lg font-black tracking-tighter text-white flex items-center font-sans">
             K<span className="text-[#F97316]">W</span> <span className="ml-2 text-xs uppercase tracking-widest text-neutral-400">KnoWMi</span>
          </span>
        </div>
        <button onClick={() => window.history.back()} className="w-10 h-10 bg-[#161b22]/60 backdrop-blur-md rounded-xl flex items-center justify-center text-neutral-400 hover:text-white border border-[#30363d] transition-all z-50 relative">
          <X size={20} />
        </button>
      </header>

      <main className="max-w-[480px] mx-auto pb-20 px-6 flex flex-col items-center relative z-20">
        
        {/* Avatar Container - Centered Overlapping Banner */}
        <div className="relative h-16 w-full flex justify-center z-30">
          <div className="absolute -top-24 sm:-top-32 left-1/2 -translate-x-1/2 flex flex-col items-center">
            {/* Green Glow behind */}
            <div className="absolute inset-0 bg-[#3fb950] opacity-30 blur-3xl rounded-full scale-150 animate-pulse" />
            
            {/* Custom Avatar Border Shape */}
            <div className="relative p-[2px] rounded-[32px] bg-gradient-to-b from-[#3fb950] to-[#161b22] shadow-2xl">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[30px] overflow-hidden bg-[#161b22] border-4 border-[#0d1117]">
                <img 
                  src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=161b22&color=3fb950`} 
                  className="w-full h-full object-cover" 
                  alt={profile.display_name} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Name & Tagline */}
        <div className="mt-[72px] sm:mt-24 mb-4 text-center">
          <h1 className="text-[28px] font-mono font-bold text-white tracking-widest leading-tight">
            {(profile.display_name || 'NEW USER').toUpperCase()}
          </h1>
          <p className="text-[#a1a1aa] font-mono text-sm tracking-widest mt-2">
            {data.about?.role || data.tagline || 'SYSTEM ENGINEER'}
          </p>
        </div>

        {/* Public Bio */}
        {profile.bio && (
          <p className="text-[#8b949e] font-sans text-sm text-center mt-2 mb-6 max-w-[90%] leading-relaxed">
            {profile.bio}
          </p>
        )}

        {/* SOCIAL LINKS (Moved near profile pic) */}
        {data.platforms && data.platforms.length > 0 && (
          <div className="w-full flex flex-wrap justify-center gap-6 mt-4 mb-10 z-20">
             {data.platforms.map((p, i) => {
               if (!p.url) return null;
               const { icon, color } = getPlatformIcon(p.platform || '');
               return (
                 <a 
                   key={i} 
                   href={p.url.startsWith('http') ? p.url : `https://${p.url}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="hover:scale-110 transition-transform duration-300"
                   style={{ color: color }}
                   aria-label={p.platform}
                 >
                   {icon}
                 </a>
               )
             })}
          </div>
        )}

        {/* Stats */}

        {/* TECH STACK */}
        <div className="w-full mt-10 bg-[#161b22] border border-[#30363d] rounded-[32px] p-8 shadow-xl">
           <span className="block text-[11px] font-bold text-[#8b949e] uppercase tracking-[0.2em] mb-8">Tech Stack</span>
           <div className="grid grid-cols-3 sm:flex sm:flex-wrap justify-between gap-y-8 gap-x-2">
             {techStack.map(tech => {
               const { icon, color } = getTechIcon(tech);
               return (
                 <div key={tech} className="flex flex-col items-center gap-3 group">
                   <div className="text-[#8b949e] group-hover:scale-110 transition-transform duration-300" style={{ color: color }}>
                     {icon}
                   </div>
                   <span className="text-[10px] font-bold text-[#8b949e] tracking-wider group-hover:text-white transition-colors">{tech}</span>
                 </div>
               )
             })}
           </div>
        </div>

        {/* RECENT WORKS (PROJECTS) */}
        {data.projects && data.projects.length > 0 && (
          <div className="w-full mt-12 text-left relative z-10">
             <span className="block text-[11px] font-bold text-[#8b949e] uppercase tracking-[0.2em] mb-6 ml-1">Built Masterpieces</span>
             <div className="space-y-6">
               {data.projects.map((project: any, i: number) => (
                 <div key={i} className="bg-[#161b22] border border-[#30363d] rounded-[32px] overflow-hidden group hover:border-[#3fb950] transition-colors shadow-xl">
                   {project.url && (
                     <div className="w-full h-48 bg-[#0d1117] overflow-hidden relative">
                       <img src={getAssetUrl(project.url)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={project.name} />
                       <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] to-transparent opacity-80" />
                     </div>
                   )}
                   <div className="p-8">
                     <div className="flex justify-between items-start mb-3">
                       <h3 className="text-xl font-bold text-white flex items-center gap-3">
                         <Terminal size={20} className="text-[#3fb950]" />
                         {project.name}
                       </h3>
                       {project.stars > 0 && (
                         <div className="flex items-center gap-1.5 text-[#e3b341] bg-[#e3b341]/10 px-3 py-1 rounded-full border border-[#e3b341]/20">
                           <Star size={12} fill="currentColor" />
                           <span className="text-[10px] font-bold">{project.stars}</span>
                         </div>
                       )}
                     </div>
                     {project.description && (
                       <p className="text-sm text-[#8b949e] leading-relaxed mb-6">
                         {project.description}
                       </p>
                     )}
                     <div className="flex flex-wrap gap-4">
                       {project.github_url && (
                         <a href={project.github_url.startsWith('http') ? project.github_url : `https://${project.github_url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-[#3fb950] transition-colors bg-[#0d1117] px-4 py-2.5 rounded-xl border border-[#30363d]">
                           <Github size={14} /> Source Code
                         </a>
                       )}
                       {project.live_url && (
                         <a href={project.live_url.startsWith('http') ? project.live_url : `https://${project.live_url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#161b22] hover:bg-[#3fb950]/90 bg-[#3fb950] px-4 py-2.5 rounded-xl transition-colors">
                           <ExternalLink size={14} /> Live Demo
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
             <span className="block text-[11px] font-bold text-[#8b949e] uppercase tracking-[0.2em] mb-4 ml-1">Engineering CV</span>
             <a 
               href={getAssetUrl(data.resume_url)}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center justify-between p-6 rounded-[24px] bg-[#161b22] border border-[#3fb950]/30 group hover:border-[#3fb950] transition-all active:scale-[0.98] shadow-xl relative overflow-hidden"
             >
               <div className="absolute inset-0 bg-[#3fb950]/5 group-hover:bg-[#3fb950]/10 transition-colors" />
               <div className="flex items-center gap-5 relative z-10">
                 <div className="w-12 h-12 rounded-xl bg-[#0d1117] border border-[#3fb950]/20 text-[#3fb950] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                   <FileText size={24} />
                 </div>
                 <div>
                   <p className="text-md font-bold text-white tracking-wide">Professional Resume</p>
                   <p className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest mt-1">Download Full PDF</p>
                 </div>
               </div>
               <ExternalLink size={20} className="text-[#30363d] group-hover:text-[#3fb950] transition-colors relative z-10" />
             </a>
          </div>
        )}

      </main>
    </div>
  )
}

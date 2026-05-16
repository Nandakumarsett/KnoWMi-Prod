import { useState, useEffect } from 'react'
import { useReveal } from '../hooks/useReveal'
import { supabase, getAssetUrl } from '../lib/supabase'
import { X, Instagram, Youtube, Twitter, Github, Share2, Terminal, ExternalLink, GraduationCap, FileText, Globe, Trophy, Sparkles, TrendingUp, Music, BookOpen, Rocket, Play, Camera, Film } from 'lucide-react'

const initialPersonas = [
  {
    id: 'influencer', emoji: '🎬', name: 'Content Creator',
    desc: 'Turn every follower request into a real connection and professional collab.', color: '#F97316', bg: '#FFF7ED',
    data: {
      name: 'Sneha Kapoor',
      handle: '@sneha.kapoor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80',
      type: 'LIFESTYLE CREATOR',
      tagline: 'Building a community around sustainable luxury and mindful living.',
      stats: [{ l: 'Reach', v: '120K+' }, { l: 'Engagement', v: '4.8%' }],
      links: [
        { icon: Instagram, label: 'Instagram', sub: '120K Followers' },
        { icon: Youtube, label: 'YouTube', sub: '45K Subscribers' }
      ],
      works: [
        { title: 'The Minimalist Home', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', type: 'image' },
        { title: 'Travel Edit 2024', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80', type: 'image' }
      ]
    }
  },
  {
    id: 'developer', emoji: '💻', name: 'Tech',
    desc: 'The ultimate bridge between your code, GitHub, and your professional network.', color: '#3B82F6', bg: '#EFF6FF',
    data: {
      name: 'Aryan Sharma',
      role: 'Full-Stack Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
      mission: 'Engineering the future of decentralized identity.',
      languages: ['TypeScript', 'Go', 'Python'],
      stats: [{ l: 'GitHub Stars', v: '2.1K' }, { l: 'Projects', v: '12+' }],
      projects: [
        { name: 'KnoWMi Protocol', desc: 'Web3 identity layer' },
        { name: 'GitFlow CLI', desc: 'Developer productivity tool' }
      ],
      works: []
    }
  },
  {
    id: 'student', emoji: '🎓', name: 'Student',
    desc: 'Your campus identity, social links, and digital resume in one scan.', color: '#10B981', bg: '#ECFDF5',
    data: {
      name: 'Karan Mehta',
      university: 'IIT DELHI · CS 2025',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
      bio: "Interning @Google. Building a fintech startup on the side.",
      stats: [{ l: 'CGPA', v: '9.2' }, { l: 'Scans', v: '512' }],
      sections: [
        { icon: BookOpen, title: 'Currently Studying', val: 'Algorithms & Distributed Systems' },
        { icon: FileText, title: 'Digital Resume', val: 'Download PDF ↓', highlight: true }
      ],
      works: []
    }
  },
]

function PreviewContent({ persona }) {
  const d = persona.data;

  // Shared works component to handle images vs videos
  const WorksGrid = ({ works }) => {
    if (!works || works.length === 0) return null;
    return (
      <div className="grid grid-cols-1 gap-4">
        {works.map((w, i) => (
          <div key={i} className="group relative rounded-[32px] overflow-hidden bg-neutral-100 border border-neutral-100 shadow-sm hover:shadow-xl transition-all aspect-video">
            {w.type === 'video' ? (
              <video 
                src={getAssetUrl(w.img)} 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="w-full h-full object-cover"
              />
            ) : (
              <img src={getAssetUrl(w.img)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <div className="flex justify-between items-center w-full translate-y-4 group-hover:translate-y-0 transition-transform">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{w.title}</span>
                {w.type === 'video' ? <Film size={16} className="text-white" /> : <Play size={16} className="text-white fill-white" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (persona.id === 'influencer') {
    return (
      <div className="bg-white min-h-full pb-10 relative overflow-hidden">
        {/* Floating Butterflies & Glitters */}
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
        
        <div className="h-44 bg-gradient-to-br from-orange-500 to-rose-500 relative z-10">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="absolute -bottom-8 left-8 p-1.5 bg-white rounded-full shadow-2xl">
             <img src={getAssetUrl(d.avatar)} className="w-24 h-24 rounded-full object-cover border-2 border-orange-50" alt="" />
          </div>
          <div className="absolute top-4 right-8 text-white/60"><Sparkles size={28} className="animate-pulse" /></div>
        </div>
        <div className="pt-12 px-8 relative z-20">
           <div className="flex items-center gap-2 mb-1">
             <h3 className="text-3xl font-black text-neutral-900 uppercase tracking-tighter" style={{ fontFamily: 'Fraunces, serif' }}>{d.name}</h3>
             <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-[10px] text-white">✓</div>
           </div>
           <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] mb-4">{d.type}</p>
           <p className="text-sm italic text-neutral-500 border-l-2 border-orange-200 pl-4 mb-10 leading-relaxed">"{d.tagline}"</p>
           
           <div className="grid grid-cols-2 gap-4 mb-10">
             {d.stats.map(s => (
               <div key={s.l} className="bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/50 text-center shadow-sm">
                 <div className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-1">{s.l}</div>
                 <div className="text-xl font-black text-neutral-900">{s.v}</div>
               </div>
             ))}
           </div>

           <div className="mb-10">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                  <TrendingUp size={16} />
                </div>
                <div>
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-900">Network Presence</h4>
                   <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Connect across ecosystems</p>
                </div>
             </div>
             <div className="grid grid-cols-1 gap-3">
               {d.links.map(l => (
                 <div key={l.label} className="p-5 rounded-3xl bg-white/40 backdrop-blur-md border border-white/50 flex items-center gap-4 hover:bg-white hover:shadow-lg transition-all cursor-pointer group">
                   <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                     <l.icon size={20} className="text-neutral-900" />
                   </div>
                   <div>
                      <div className="text-xs font-black text-neutral-900">{l.label}</div>
                      <div className="text-[10px] text-neutral-400">{l.sub}</div>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                  <Camera size={16} />
                </div>
                <div>
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-900">Recent Works</h4>
                   <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">A curated visual showcase</p>
                </div>
             </div>
             <WorksGrid works={d.works} />
           </div>
        </div>

        <style>{`
          @keyframes floatSparkle {
            0%, 100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.2; }
            50% { transform: translateY(-40px) rotate(20deg) scale(1.4); opacity: 0.9; }
          }
          .animate-float-sparkle {
            animation: floatSparkle 5s ease-in-out infinite;
          }
        `}</style>
      </div>
    )
  }

  if (persona.id === 'developer') {
    return (
      <div className="bg-[#0d1117] min-h-full pb-10 text-[#e6edf3] font-mono relative overflow-hidden">
        {/* Terminal Grid Background */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        <header className="p-6 border-b border-[#30363d] flex justify-between items-center bg-[#161b22] relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
          <span className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest">system_identity</span>
        </header>
        <div className="p-8 relative z-10">
           <div className="flex items-center gap-6 mb-10">
             <div className="p-1 rounded-2xl border-2 border-[#3fb950] bg-[#161b22] shadow-[0_0_20px_rgba(63,185,80,0.2)]">
               <img src={getAssetUrl(d.avatar)} className="w-20 h-20 rounded-xl object-cover" alt="" />
             </div>
             <div>
               <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{d.name}</h3>
               <p className="text-[10px] text-[#3fb950] font-black uppercase tracking-[0.4em]">{d.role}</p>
             </div>
           </div>

           <div className="bg-[#161b22] rounded-2xl p-6 border border-[#30363d] mb-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Terminal size={40} />
             </div>
             <div className="text-[#79c0ff] text-xs mb-2">const identity = {'{'}</div>
             <div className="pl-4 text-xs space-y-1">
               <div>mission: <span className="text-[#a5d6ff]">"{d.mission}"</span>,</div>
               <div>stack: [<span className="text-[#a5d6ff]">{d.languages.map(l => `"${l}"`).join(', ')}</span>]</div>
             </div>
             <div className="text-[#79c0ff] text-xs mt-2">{'}'}</div>
           </div>

           <div className="grid grid-cols-2 gap-4 mb-10">
             {d.stats.map(s => (
               <div key={s.l} className="bg-[#161b22] p-5 rounded-2xl border border-[#30363d] text-center group hover:border-[#3fb95033] transition-colors">
                 <div className="text-[8px] font-bold text-[#8b949e] uppercase tracking-widest mb-1">{s.l}</div>
                 <div className="text-xl font-bold text-white group-hover:text-[#3fb950] transition-colors">{s.v}</div>
               </div>
             ))}
           </div>

           <div className="space-y-4">
             <div className="flex items-center gap-3 mb-6">
                <Terminal size={16} className="text-[#3fb950]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Featured Repositories</span>
                <div className="flex-1 h-px bg-[#30363d]" />
             </div>
             {d.projects.map(p => (
               <div key={p.name} className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-[#3fb950] transition-all group">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-bold text-[#79c0ff] group-hover:text-[#3fb950] transition-colors">{p.name}</div>
                    <ExternalLink size={14} className="text-[#8b949e]" />
                  </div>
                  <div className="text-[11px] text-[#8b949e] leading-relaxed">{p.desc}</div>
                  <div className="mt-4 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#f1e05a]" />
                    <span className="text-[10px] text-[#8b949e]">JavaScript</span>
                  </div>
               </div>
             ))}
           </div>
           
           {d.works?.length > 0 && (
             <div className="mt-10">
               <div className="flex items-center gap-3 mb-6">
                  <Camera size={16} className="text-[#3fb950]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Recent Works</span>
                  <div className="flex-1 h-px bg-[#30363d]" />
               </div>
               <WorksGrid works={d.works} />
             </div>
           )}
        </div>
      </div>
    )
  }

  if (persona.id === 'student') {
    return (
      <div className="bg-[#fffcf8] min-h-full pb-10 relative overflow-hidden">
        {/* Academic Layer (Math symbols, numbers) - Increased visibility */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.12] font-serif text-neutral-900 leading-none z-0">
           <div className="absolute top-10 left-10 text-6xl">π</div>
           <div className="absolute top-40 right-20 text-8xl">Σ</div>
           <div className="absolute bottom-20 left-20 text-7xl">√x</div>
           <div className="absolute top-1/2 left-1/4 text-4xl">E=mc²</div>
           <div className="absolute bottom-40 right-10 text-6xl">∫</div>
           <div className="absolute top-20 right-1/3 text-4xl">λ</div>
           <div className="absolute bottom-10 right-1/4 text-7xl">∞</div>
           <div className="absolute top-1/3 right-5 text-5xl">Δ</div>
           <div className="absolute bottom-1/4 left-1/3 text-3xl">f(x)</div>
        </div>

        <div className="p-8 relative z-10">
           <div className="flex flex-col items-center text-center mb-12">
             <div className="relative mb-8">
                <div className="absolute -top-6 -right-6 text-4xl animate-bounce">🎓</div>
                <div className="w-28 h-28 rounded-[40px] border-4 border-white shadow-2xl overflow-hidden bg-white rotate-3">
                  <img src={getAssetUrl(d.avatar)} className="w-full h-full object-cover -rotate-3" alt="" />
                </div>
             </div>
             <h3 className="text-4xl font-black text-neutral-900 tracking-tighter mb-1" style={{ fontFamily: 'Fraunces, serif' }}>{d.name}</h3>
             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">{d.university}</p>
             <p className="text-sm text-neutral-500 italic mt-4 px-6 leading-relaxed">"{d.bio}"</p>
           </div>

           <div className="grid grid-cols-2 gap-4 mb-12">
             {d.stats.map(s => (
               <div key={s.l} className="bg-white/60 backdrop-blur-md p-6 rounded-[32px] border-2 border-white/50 text-center shadow-sm hover:shadow-md transition-shadow">
                 <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{s.l}</div>
                 <div className="text-3xl font-black text-neutral-900">{s.v}</div>
               </div>
             ))}
           </div>

           <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <Trophy size={16} />
                </div>
                <div>
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-900">Academic Highlights</h4>
                   <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Credentials & Achievements</p>
                </div>
             </div>
             {d.sections.map(s => (
               <div key={s.title} className={`p-6 rounded-[32px] border-2 border-[#f0e7d8] flex items-center gap-5 transition-all hover:scale-[1.02] ${s.highlight ? 'bg-emerald-500 text-white border-transparent shadow-xl shadow-emerald-500/20' : 'bg-white/80 backdrop-blur-sm'}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${s.highlight ? 'bg-white/20' : 'bg-emerald-50 text-emerald-500'}`}>
                    <s.icon size={28} />
                  </div>
                  <div>
                    <div className={`text-[10px] font-black uppercase tracking-widest ${s.highlight ? 'text-white/70' : 'text-neutral-400'}`}>{s.title}</div>
                    <div className={`text-md font-black ${s.highlight ? 'text-white' : 'text-neutral-900'}`}>{s.val}</div>
                  </div>
               </div>
             ))}
           </div>

           {d.works?.length > 0 && (
             <div className="mt-14">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <Camera size={16} />
                  </div>
                  <div>
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-900">Recent Works</h4>
                     <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Gallery & Portfolio</p>
                  </div>
               </div>
               <WorksGrid works={d.works} />
             </div>
           )}

           <div className="mt-14 text-center">
              <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-8">Professional Ecosystem</div>
              <div className="flex justify-center gap-8">
                <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer">
                  <Instagram size={20} className="text-neutral-400" />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer">
                  <Youtube size={20} className="text-neutral-400" />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer">
                  <Twitter size={20} className="text-neutral-400" />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer">
                  <Github size={20} className="text-neutral-400" />
                </div>
              </div>
           </div>
        </div>
      </div>
    )
  }

  return null;
}

function ProfileModal({ persona, onClose }) {
  const isDark = persona.id === 'developer';

  return (
    <div 
      className={`fixed inset-0 z-[20000] flex items-center justify-center p-6 sm:p-12 animate-fadeIn transition-colors duration-500 ${isDark ? 'bg-black/80 backdrop-blur-2xl' : 'bg-white/80 backdrop-blur-xl'}`} 
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-[440px] h-full max-h-[82vh] overflow-y-auto relative rounded-[48px] animate-profilePop preview-modal-container custom-scrollbar overflow-hidden shadow-[0_20px_100px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)] ${isDark ? 'shadow-[0_0_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)]' : ''}`}
        style={{ 
          background: persona.id === 'developer' ? '#0d1117' : persona.id === 'student' ? '#fff9f0' : '#fff',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className={`absolute top-6 right-6 z-[21000] w-12 h-12 rounded-full backdrop-blur-xl flex items-center justify-center transition-all shadow-sm hover:scale-110 active:scale-95 border ${isDark ? 'bg-white/10 text-white border-white/10 hover:bg-white/20' : 'bg-black/10 text-black/60 border-black/5 hover:bg-black/20 hover:text-black'}`}
        >
          <X size={24} />
        </button>
        <div className="preview-content-wrapper min-h-full">
          <PreviewContent persona={persona} />
        </div>
      </div>

      <style>{`
        @keyframes profilePop {
          from { transform: scale(0.95) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}

export default function Personas() {
  const ref = useReveal()
  const [active, setActive] = useState(null)
  const [dynamicPersonas, setDynamicPersonas] = useState(initialPersonas)

  useEffect(() => {
    const loadDynamicData = () => {
      const saved = localStorage.getItem('homepage_previews')
      if (saved) {
        try {
          const custom = JSON.parse(saved)
          setDynamicPersonas(prev => prev.map(p => {
            const c = custom[p.id === 'influencer' ? 'influencer' : p.id]
            if (c) {
              return {
                ...p,
                data: {
                  ...p.data,
                  name: c.name || p.data.name,
                  tagline: c.tagline || p.data.tagline,
                  bio: c.bio || p.data.bio,
                  mission: c.mission || p.data.mission,
                  avatar: c.avatar || p.data.avatar,
                  works: c.works || p.data.works
                }
              }
            }
            return p
          }))
        } catch (e) { console.error(e) }
      }
    }

    loadDynamicData()
    window.addEventListener('storage', loadDynamicData)
    return () => window.removeEventListener('storage', loadDynamicData)
  }, [])

  return (
    <section id="personas" className="section-pad snap-section min-h-screen flex items-center" style={{ background: 'var(--off)' }} ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">
              Pick Your Identity
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-black text-black mb-6 tracking-tight leading-[1.05]">
            What do they see <br />
            <span className="text-orange-500 italic">when they scan you?</span>
          </h2>
          <p className="text-lg text-neutral-400 font-medium max-w-xl mx-auto">
            Each tee unlocks a different profile built for your world. Tap a persona below to see it live.
          </p>
        </div>

        <div className="personas-grid reveal" role="list">
          {dynamicPersonas.map(p => (
            <div key={p.id} role="listitem" onClick={() => setActive(p)}
              className="persona-card"
              style={{ '--pc': p.color }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = `0 16px 40px ${p.color}22`
                e.currentTarget.style.borderColor = p.color
                e.currentTarget.querySelector('.pname').style.color = p.color
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.querySelector('.pname').style.color = 'var(--ink)'
              }}>
              <span className="persona-emoji" role="img" aria-label={p.name}>{p.emoji}</span>
              <div className="pname persona-name" style={{ color: 'var(--ink)' }}>{p.name}</div>
              <div className="persona-desc">{p.desc}</div>
              <div className="mt-3 text-[11px] font-semibold transition-colors" style={{ color: p.color }}>
                Tap to preview →
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 reveal">
          <p className="text-sm mb-4" style={{ color: 'var(--ink3)' }}>
            Not sure which fits you? You can always update your persona later — for free.
          </p>
          <a href="#pricing" className="btn-primary btn-base px-7 py-3.5 text-sm inline-flex items-center gap-2">
            Choose Your Persona →
          </a>
        </div>
      </div>

      {active && <ProfileModal persona={active} onClose={() => setActive(null)} />}

      <style>{`
        .personas-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 24px;
          margin: 56px auto 0;
          max-width: 900px;
        }
        .persona-card {
          border-radius: 24px;
          padding: 32px 24px;
          text-align: center;
          border: 1.5px solid var(--border);
          background: #fff;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .persona-emoji { font-size: 40px; margin-bottom: 16px; display: block; }
        .persona-name { font-family: 'Fraunces',serif; font-size: 16px; font-weight: 700; transition: color 0.2s; }
        .persona-desc { font-size: 12px; color: var(--ink4); margin-top: 8px; line-height: 1.5; }
        @media (max-width: 900px) { .personas-grid { grid-template-columns: repeat(2,1fr); gap: 16px; } }
        @media (max-width: 480px) { .personas-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  )
}

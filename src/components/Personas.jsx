import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supabase, getAssetUrl } from '../lib/supabase'

gsap.registerPlugin(ScrollTrigger)
import { X, Instagram, Youtube, Twitter, Github, Share2, Terminal, ExternalLink, GraduationCap, FileText, Globe, Trophy, Sparkles, TrendingUp, Music, BookOpen, Rocket, Play, Camera, Film } from 'lucide-react'
import { DeveloperProfile } from './profile/personas/DeveloperProfile'
import { StudentProfile } from './profile/personas/StudentProfile'
import { CreatorProfile } from './profile/personas/CreatorProfile'

const initialPersonas = [
  {
    id: 'influencer', emoji: '🎬', name: 'Content Creator',
    desc: 'Turn every follower request into a real connection and professional collab.', color: '#F97316', bg: '#FFF7ED',
    data: {
      name: 'Sneha Kapoor',
      handle: '@sneha.kapoor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80',
      banner: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
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

  if (persona.id === 'developer') {
    const mockProfile = {
      id: 'mock-dev',
      display_name: persona.data.name,
      avatar_url: persona.data.avatar,
      bio: persona.data.mission,
      persona: 'developer',
      tier: 'Creator',
      pulse: 820,
      persona_data: {
        about: {
          role: persona.data.role || 'Full-Stack Developer',
          status: 'Available for work',
          company: 'KnoWMi Protocol',
          mission: persona.data.mission
        },
        featured_work_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        platforms: [
          { platform: 'github', url: 'https://github.com' },
          { platform: 'twitter', url: 'https://twitter.com' },
          { platform: 'linkedin', url: 'https://linkedin.com' }
        ],
        tech_stack: persona.data.languages || ['TypeScript', 'Go', 'Python'],
        projects: persona.data.projects?.map(p => ({
          name: p.name,
          description: p.desc,
          stars: 42,
          url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
          github_url: 'https://github.com'
        })) || [
          { name: 'KnoWMi Protocol', description: 'Web3 identity layer', stars: 2100, github_url: 'https://github.com' },
          { name: 'GitFlow CLI', description: 'Developer productivity tool', stars: 450, github_url: 'https://github.com' }
        ],
        resume_url: 'https://knowmi.me',
        contact_email: 'aryan@knowmi.me',
        quick_talk_url: 'https://calendly.com'
      }
    };
    return <DeveloperProfile profile={mockProfile} />;
  }

  if (persona.id === 'student') {
    const mockProfile = {
      id: 'mock-student',
      display_name: persona.data.name,
      avatar_url: persona.data.avatar,
      bio: persona.data.bio,
      persona: 'student',
      tier: 'Creator',
      pulse: 820,
      profile_theme: 'classic',
      persona_data: {
        university: 'IIT DELHI',
        major: 'Computer Science & Engineering',
        graduation_year: '2025',
        gpa: '9.2',
        mood: '🔥 GRINDING',
        featured_work_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        platforms: [
          { platform: 'github', url: 'https://github.com' },
          { platform: 'instagram', url: 'https://instagram.com' },
          { platform: 'linkedin', url: 'https://linkedin.com' }
        ],
        projects: [
          { name: 'StartUp India', description: 'Building a micro-lending app for local merchants.', emoji: '🚀', tech: ['React Native', 'Firebase'], github_url: 'https://github.com' },
          { name: 'Distributed Consensus', description: 'Raft consensus implementation in Rust.', emoji: '🧠', tech: ['Rust', 'gRPC'], github_url: 'https://github.com' }
        ],
        skills: ['Algorithms', 'Data Structures', 'System Design', 'React', 'Rust'],
        achievements: [
          { title: 'Google Summer of Code', description: 'Contributor to CNCF Kubernetes project.', year: '2024' },
          { title: 'Kaggle Gold Medalist', description: 'Ranked top 1% in Global DL challenge.', year: '2023' }
        ],
        resume_url: 'https://knowmi.me',
        playlist_url: 'https://spotify.com',
        playlist_name: 'Coding Focus',
        campus_rank_pct: 2,
        courses_completed: 14,
        study_buddies: 28
      }
    };
    return <StudentProfile profile={mockProfile} stats={{ totalViews: 820 }} />;
  }

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
    const mockProfile = {
      id: 'mock-creator',
      display_name: persona.data.name || 'Swetha Kumari',
      avatar_url: persona.data.avatar,
      bio: persona.data.tagline || 'Building a community around sustainable luxury and mindful living.',
      persona: 'creator',
      tier: 'Pro',
      pulse: 15420,
      profile_theme: 'glow',
      persona_data: {
        type: 'creator',
        tagline: persona.data.tagline,
        featured_work_url: persona.data.banner || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
        content_formats: ['Vlogs', 'Reels', 'Photography'],
        platforms: persona.data.links?.map(l => ({
          platform: l.label.toLowerCase(),
          url: `https://${l.label.toLowerCase()}.com`,
          followers: l.sub
        })) || [
          { platform: 'instagram', url: 'https://instagram.com', followers: '120K+' },
          { platform: 'youtube', url: 'https://youtube.com', followers: '45K' }
        ],
        works: persona.data.works?.map(w => ({
          title: w.title,
          url: w.img,
          type: w.type || 'image'
        })) || [],
        total_reach: persona.data.stats?.[0]?.v || '120K+',
        engagement_rate: persona.data.stats?.[1]?.v || '4.8%',
        location: 'Mumbai, India',
        achievements: [
          { icon: 'Award', label: 'Top Lifestyle Creator 2023' },
          { icon: 'Star', label: 'Brand Ambassador' }
        ],
        // Adding more detailed mock data to fill out the profile
        availability_status: 'Selective',
        response_time: 'Within 24 hours',
        preferred_contact_method: 'Email',
        collab_types_tags: ['Sponsored Posts', 'Brand Ambassador', 'Event Appearances', 'UGC Content'],
        rate_range_min: 50000,
        rate_range_max: 200000,
        turnaround_time: '3-5 Days',
        deliverable_formats: ['4K Video', 'Raw Images', 'Stories'],
        audience_age_group: '18-34 years',
        audience_interests: ['Fashion', 'Travel', 'Wellness', 'Tech'],
        visual_style: 'Cinematic',
        posting_frequency: 'Daily',
        past_collaborations: [
          {
            brand_name: 'Nykaa',
            campaign_description: 'Pink Friday Sale Ambassador',
            logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&q=80'
          },
          {
            brand_name: 'Dyson',
            campaign_description: 'Airwrap Product Launch Video',
            logo_url: 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?auto=format&fit=crop&w=128&q=80'
          },
          {
            brand_name: 'L\'Oréal',
            campaign_description: 'Skincare Routine Integration',
            logo_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=128&q=80'
          }
        ]
      }
    };
    return <CreatorProfile profile={mockProfile} stats={{ totalViews: 15420, topCities: [{ city: 'Mumbai' }] }} />;
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

export default function Personas() {
  const [dynamicPersonas, setDynamicPersonas] = useState(initialPersonas)
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const trackRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll = (e) => {
    if (window.innerWidth >= 1024) return
    const container = e.currentTarget
    const cardWidth = container.offsetWidth
    const scrollLeft = container.scrollLeft
    const idx = Math.round(scrollLeft / cardWidth)
    setActiveIndex(idx)
  }

  const navigateTo = (idx) => {
    const container = scrollContainerRef.current
    if (!container) return
    const cardWidth = container.offsetWidth
    container.scrollTo({
      left: idx * cardWidth,
      behavior: 'smooth'
    })
  }

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

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      )

      let mm = gsap.matchMedia()

      mm.add("(min-width: 1024px)", () => {
        let panels = gsap.utils.toArray(".persona-panel");
        
        gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            snap: 1 / (panels.length - 1),
            // Reduce scroll distance so it's much faster to cycle through profiles
            end: () => "+=" + window.innerWidth * 1.2,
          }
        });
      })

      mm.add("(max-width: 1023px)", () => {
        let panels = gsap.utils.toArray(".persona-panel");
        gsap.set(panels, { opacity: 1, y: 0 });

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 60%",
          once: true,
          onEnter: () => {
            const container = scrollContainerRef.current;
            if (!container) return;
            gsap.fromTo(container,
              { scrollLeft: 0 },
              {
                scrollLeft: 80,
                duration: 0.6,
                ease: "power2.out",
                yoyo: true,
                repeat: 1,
                repeatDelay: 0.3
              }
            );
          }
        });
      })

    }, sectionRef)
    return () => ctx.revert()
  }, [dynamicPersonas])

  return (
    <section id="personas" className="bg-black relative overflow-hidden" ref={sectionRef}>
      {/* Ambient glow */}
      <div className="absolute bottom-1/4 right-0 w-1/3 h-[500px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 lg:min-h-screen flex flex-col justify-center pt-20 lg:pt-24 pb-8">
        <div className="max-w-[1400px] mx-auto px-6 w-full shrink-0" ref={headerRef}>
          <div className="text-center mb-6 lg:mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-lg bg-orange-500 border-[3px] border-black shadow-[3px_3px_0px_#000]">
              <span className="text-[10px] font-black uppercase tracking-widest text-black">
                Pick Your Identity
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-[1.05] uppercase">
              What do they see <br />
              <span className="bg-orange-500 text-black px-3 py-1 inline-block mt-2 rounded-lg border-[3px] border-black shadow-[5px_5px_0px_#000] rotate-1">when they scan you?</span>
            </h2>
            <p className="text-base lg:text-lg text-neutral-400 font-medium max-w-xl mx-auto">
              Each tee unlocks a different profile built for your world.
            </p>
            <div className="lg:hidden flex items-center justify-center gap-1.5 text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mt-4 animate-pulse">
              <span>Swipe to explore profiles</span>
              <span>↔</span>
            </div>
          </div>
        </div>

        {/* Horizontal track wrapper */}
        <div 
          className="w-full overflow-x-auto lg:overflow-hidden no-scrollbar snap-x snap-mandatory px-[7.5vw] lg:px-0" 
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          <div className="flex flex-row w-max lg:w-[300vw] gap-4 lg:gap-0" ref={trackRef}>
            {dynamicPersonas.map((p, idx) => {
              const isDark = p.id === 'developer'
              return (
                <div 
                  key={p.id} 
                  className="persona-panel w-[85vw] lg:w-[100vw] px-4 sm:px-6 py-8 sm:py-12 lg:py-0 flex items-center justify-center shrink-0 snap-center"
                >
                  <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-16 items-center">
                    
                    {/* Left: Text Content */}
                    <div className="text-center lg:text-left order-2 lg:order-1 flex flex-col justify-center">
                      <h3 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-4" style={{ color: p.color }}>
                        {p.name}
                      </h3>
                      <p className="text-lg lg:text-xl text-neutral-400 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                        {p.desc}
                      </p>
                      <div className="flex justify-center lg:justify-start">
                        <a href="#pricing" className="px-8 py-4 text-sm inline-flex items-center justify-center gap-2 text-black border-[3px] border-black rounded-lg font-black uppercase tracking-wider transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_#000]" style={{ backgroundColor: p.color }}>
                          Choose {p.name}
                        </a>
                      </div>
                    </div>

                    {/* Right: Mock Phone */}
                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                      <div 
                        className={`w-full max-w-[300px] sm:max-w-[360px] h-[60vh] sm:h-[55vh] lg:h-[65vh] max-h-[700px] overflow-y-auto overflow-x-hidden rounded-xl custom-scrollbar relative border-2 sm:border-[3px] border-white shadow-[4px_4px_0px_#F97316] sm:shadow-[8px_8px_0px_#F97316] ${isDark ? 'bg-[#0d1117]' : p.id === 'student' ? 'bg-[#fafafa]' : 'bg-white'}`}
                      >
                         <div className="w-[142.86%] origin-top-left scale-[0.70] min-h-[142.86%] sm:w-[133.33%] sm:scale-[0.75] sm:min-h-[133.33%] pointer-events-none select-none">
                            <PreviewContent persona={p} />
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>


      </div>

      <style>{`
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
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  )
}

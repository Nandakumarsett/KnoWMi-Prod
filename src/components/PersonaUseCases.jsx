import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, GraduationCap, Code, Camera } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const useCases = [
  {
    id: 'students',
    icon: <GraduationCap size={24} />,
    title: 'For Students',
    benefit: 'Stop handing out paper. Start standing out.',
    desc: 'At hackathons, fests, and networking events — your tee speaks before you do. One scan: your LinkedIn, resume, and projects, live.',
    image: 'https://images.unsplash.com/photo-1523240715630-36d93339008f?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'creators',
    icon: <Camera size={24} />,
    title: 'For Creators',
    benefit: 'Your content is everywhere. Now so are you.',
    desc: 'Turn every "where do I follow you?" into an instant connection. No more fumbling. Your audience finds you — by scanning your tee.',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'developers',
    icon: <Code size={24} />,
    title: 'For Developers',
    benefit: 'Your GitHub speaks. Make them listen.',
    desc: 'At meetups, conferences, and hackathons — skip the small talk. Let your profile do it. GitHub, portfolio, socials. One scan away.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop'
  }
]

export default function PersonaUseCases() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const cardsRef = useRef([])
  const tagsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      // Cards Stagger
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current[0],
            start: 'top 85%',
          }
        }
      )

      // Tags Stagger
      gsap.fromTo(tagsRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: '.tags-container',
            start: 'top 90%',
          }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="use-cases" className="py-32 bg-[#0a0a0a] min-h-screen flex items-center" ref={sectionRef}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-24" ref={headerRef}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6 text-orange-500 text-[10px] font-black uppercase tracking-widest">
            Built For You
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight leading-[1.05]">
            Who wears <br />
            <span className="text-orange-500 italic">KnoWMi?</span>
          </h2>
          <p className="text-lg text-neutral-400 font-medium max-w-xl mx-auto">
            Anyone who's tired of being forgotten. Creators, students, founders, techies — your tee tells your story.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {useCases.map((uc, i) => (
            <div key={uc.id} ref={el => cardsRef.current[i] = el} className="group relative bg-[#111] rounded-[3rem] p-10 border border-white/10 hover:shadow-[0_0_40px_rgba(249,115,22,0.1)] hover:border-orange-500/30 transition-all duration-500 overflow-hidden flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="relative z-10 w-full flex flex-col items-center lg:items-start">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-8">
                  {uc.icon}
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">{uc.title}</h3>
                <h4 className="text-2xl font-display font-black text-white mb-4 leading-tight">{uc.benefit}</h4>
                <p className="text-sm text-neutral-400 font-medium leading-relaxed mb-8 mx-auto lg:mx-0">
                  {uc.desc}
                </p>
                <a href="#pricing" className="flex items-center justify-center lg:justify-start gap-2 text-orange-500 font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all w-full lg:w-auto">
                   Get Yours <ArrowRight size={14} />
                </a>
              </div>
              
              <div className="absolute bottom-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
                 {uc.icon}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center tags-container">
          <p className="text-sm text-neutral-400 font-medium mb-6">Also perfect for:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Entrepreneurs', 'Artists', 'Founders', 'Freelancers', 'Athletes'].map((p, i) => (
                <span key={p} ref={el => tagsRef.current[i] = el} className="px-6 py-3 rounded-2xl bg-[#111] border border-white/10 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-orange-500 hover:border-orange-500/30 hover:bg-orange-500/10 transition-colors cursor-pointer">
                  {p}
                </span>
              ))}
           </div>
        </div>
      </div>
    </section>
  )
}

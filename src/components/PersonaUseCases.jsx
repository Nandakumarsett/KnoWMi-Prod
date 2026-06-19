import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const useCases = [
  {
    id: 'students',
    emoji: '🎓',
    title: 'For Students',
    benefit: 'Stop handing out paper. Start standing out.',
    desc: 'At hackathons, fests, and networking events — your tee speaks before you do.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&fit=crop&auto=format&q=80',
  },
  {
    id: 'creators',
    emoji: '🎬',
    title: 'For Creators',
    benefit: 'Your content is everywhere. Now so are you.',
    desc: 'Turn every "where do I follow you?" into an instant connection.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&fit=crop&auto=format&q=80',
  },
  {
    id: 'tech',
    emoji: '💻',
    title: 'For Tech',
    benefit: 'Your GitHub speaks. Make them listen.',
    desc: 'At meetups and conferences — skip the small talk. One scan away.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&fit=crop&auto=format&q=80',
  },
]

export default function PersonaUseCases() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const cardsRef = useRef([])
  const counterRef = useRef(null)
  const tagsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )

      // Cards stagger reveal
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current[0],
            start: 'top 85%',
          },
        }
      )

      // CountUp animation for scan counter
      if (counterRef.current) {
        const obj = { val: 0 }
        gsap.to(obj, {
          val: 12847,
          duration: 2.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: counterRef.current,
            start: 'top 85%',
          },
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = Math.floor(obj.val).toLocaleString('en-IN')
            }
          },
        })
      }

      // Tags stagger
      gsap.fromTo(
        tagsRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: '.puc-tags-container',
            start: 'top 90%',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="use-cases"
      className="py-32 bg-[#0a0a0a] relative overflow-hidden"
      ref={sectionRef}
    >
      <style>{`
        @keyframes arrowPulse {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }
        .puc-arrow-cta {
          animation: arrowPulse 1.4s ease-in-out infinite;
          display: inline-block;
        }
        .puc-card-img {
          transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .puc-card:hover .puc-card-img {
          transform: scale(1.05);
        }
      `}</style>

      {/* Decorative blocks */}
      <div className="absolute top-10 right-10 w-24 h-24 border-[3px] border-orange-500/20 rounded-lg rotate-12 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-16 h-16 bg-orange-500/10 border-[3px] border-orange-500/20 rounded-md -rotate-6 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
        {/* Section Header */}
        <div className="text-center mb-20" ref={headerRef}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-orange-500 border-[3px] border-black mb-6 text-black text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_#000]">
            Built For You
          </div>
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-display font-black text-white mb-6 tracking-tight leading-[1.0]">
            Who wears <br />
            <span className="bg-orange-500 text-black px-4 py-1 rounded-md inline-block mt-2 -rotate-1">KnoWMi?</span>
          </h2>
          <p className="text-lg text-neutral-400 font-medium max-w-xl mx-auto mb-10">
            Anyone who&apos;s tired of being forgotten. Creators, students, founders, techies — your tee tells your story.
          </p>

          {/* Live Scan Counter */}
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-lg bg-[#1a1a1a] border-[3px] border-white shadow-[4px_4px_0px_#F97316]">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
            <span className="text-neutral-300 text-sm font-black">Total QR Scans Today:</span>
            <span
              ref={counterRef}
              className="text-xl font-black text-orange-500"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              0
            </span>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid lg:grid-cols-3 gap-6 xl:gap-8">
          {useCases.map((uc, i) => (
            <div
              key={uc.id}
              ref={el => (cardsRef.current[i] = el)}
              className="puc-card group relative rounded-xl overflow-hidden border-[3px] border-white flex flex-col cursor-pointer bg-[#1a1a1a] h-[500px] shadow-[6px_6px_0px_#F97316] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[9px_9px_0px_#F97316] transition-all duration-300"
            >
              {/* 60% Background Image Area */}
              <div className="relative h-[60%] w-full overflow-hidden">
                <img
                  src={uc.image}
                  alt={uc.title}
                  className="puc-card-img w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: 'none', transform: 'none' }}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
                {/* Bottom fade overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                
                {/* Large emoji badge at top */}
                <div className="absolute top-5 left-5 text-4xl bg-[#1a1a1a] border-[3px] border-black rounded-lg w-14 h-14 flex items-center justify-center shadow-[3px_3px_0px_#000] z-10 select-none">
                  {uc.emoji}
                </div>
              </div>

              {/* 30% Content Area */}
              <div className="relative z-10 px-8 pt-2 flex flex-col justify-end h-[30%]">
                <span className="bg-orange-500 text-black px-3 py-1 rounded-md border-2 border-black font-black text-[11px] uppercase tracking-[0.15em] inline-block mb-2">
                  {uc.title}
                </span>
                <h3 className="text-2xl font-display font-black text-white leading-tight mb-2">
                  {uc.benefit}
                </h3>
                <p className="text-sm text-neutral-400 font-medium leading-relaxed line-clamp-2">
                  {uc.desc}
                </p>
              </div>

              {/* 10% Highlight / CTA Area */}
              <div className="relative z-10 px-8 flex items-center h-[10%] pb-6">
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 bg-orange-500 text-black px-5 py-2 rounded-lg border-[3px] border-black shadow-[3px_3px_0px_#000] font-black text-[11px] uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  Get Yours{' '}
                  <span className="puc-arrow-cta text-lg">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Also perfect for tags */}
        <div className="mt-16 text-center puc-tags-container">
          <p className="text-sm text-neutral-400 font-medium mb-6">Also perfect for:</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Entrepreneurs', 'Artists', 'Founders', 'Freelancers', 'Athletes'].map((p, i) => (
              <span
                key={p}
                ref={el => (tagsRef.current[i] = el)}
                className="px-6 py-3 rounded-lg bg-[#1a1a1a] border-[3px] border-white text-[10px] font-black uppercase tracking-widest text-neutral-300 hover:bg-orange-500 hover:text-black hover:border-black hover:shadow-none shadow-[3px_3px_0px_#F97316] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

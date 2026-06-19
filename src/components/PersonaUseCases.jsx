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
        .puc-card {
          transition: border-color 0.35s ease, box-shadow 0.35s ease;
        }
        .puc-card:hover {
          border-color: rgb(249 115 22 / 0.6) !important;
          box-shadow: 0 0 50px rgba(249,115,22,0.15);
        }
      `}</style>

      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-[400px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
        {/* Section Header */}
        <div className="text-center mb-20" ref={headerRef}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6 text-orange-500 text-[10px] font-black uppercase tracking-widest">
            Built For You
          </div>
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-display font-black text-white mb-6 tracking-tight leading-[1.0]">
            Who wears <br />
            <span className="text-orange-500 italic">KnoWMi?</span>
          </h2>
          <p className="text-lg text-neutral-400 font-medium max-w-xl mx-auto mb-10">
            Anyone who&apos;s tired of being forgotten. Creators, students, founders, techies — your tee tells your story.
          </p>

          {/* Live Scan Counter */}
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
            <span className="text-neutral-400 text-sm font-medium">Total QR Scans Today:</span>
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
              className="puc-card group relative rounded-[2.5rem] overflow-hidden border border-white/10 min-h-[420px] flex flex-col justify-end cursor-pointer"
            >
              {/* Full-bleed background image */}
              <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
                <img
                  src={uc.image}
                  alt={uc.title}
                  className="puc-card-img w-full h-full object-cover object-center"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
              </div>

              {/* Gradient overlay — fully transparent at top, dark only at bottom 50% for text */}
              <div className="absolute inset-0 rounded-[2.5rem]" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0.1) 65%, transparent 100%)' }} />

              {/* Large emoji badge at top */}
              <div className="absolute top-6 left-6 text-5xl drop-shadow-lg z-10 select-none">
                {uc.emoji}
              </div>

              {/* Card content at bottom */}
              <div className="relative z-10 p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-2">
                  {uc.title}
                </p>
                <h3 className="text-3xl font-display font-black text-white leading-tight mb-3">
                  {uc.benefit}
                </h3>
                <p className="text-sm text-neutral-400 font-medium leading-relaxed mb-6">
                  {uc.desc}
                </p>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 text-orange-500 font-black text-[11px] uppercase tracking-widest group-hover:text-orange-400 transition-colors"
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
                className="px-6 py-3 rounded-2xl bg-[#111] border border-white/10 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-orange-500 hover:border-orange-500/30 hover:bg-orange-500/10 transition-colors cursor-pointer"
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

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Twitter, Linkedin, Github, Instagram } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const marqueeItems = [
  '🇮🇳 Made in India', '⚡ Instant QR Profile', '📦 Pan India Delivery',
  '🎨 Custom Print', '🔗 Link Bio + Social', '✅ Scan & Connect',
  '🏆 12,000+ Wearers', '🌟 4.9 Star Rated', '🎓 College Events',
]

/* ─────────────────────────── MARQUEE ─────────────────────────── */
export function Marquee() {
  return (
    <div
      className="overflow-hidden py-3.5"
      style={{
        background: '#0a0a0a',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
      aria-label="Feature highlights"
      aria-hidden="true"
    >
      <div className="flex">
        <div className="marquee-track flex">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="text-[10px] font-black uppercase tracking-[0.2em] px-8 flex items-center gap-2 whitespace-nowrap text-white/50"
            >
              {item}
              <span className="w-1 h-1 rounded-full bg-orange-500/50" />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────── SOCIAL PROOF STRIP ────────────────────── */
const stats = [
  { value: '12,000+', label: 'Tees Shipped', icon: '👕' },
  { value: '4.9★', label: 'Rating', icon: '⭐' },
  { value: '2.1M+', label: 'QR Scans', icon: '📲' },
  { value: '48hr', label: 'Delivery', icon: '🚀' },
]

export function SocialProofStrip() {
  return (
    <section className="py-10 bg-[#0d0d0d] border-y border-white/5 relative overflow-hidden">
      <style>{`
        @keyframes statGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(249,115,22,0.5); }
          50% { text-shadow: 0 0 40px rgba(249,115,22,0.9), 0 0 80px rgba(249,115,22,0.3); }
        }
        .stat-value {
          animation: statGlow 2.5s ease-in-out infinite;
        }
      `}</style>
      {/* Orange ambient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/3 to-transparent pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-white/10">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2 px-6">
              <span className="text-3xl mb-1">{s.icon}</span>
              <span
                className="stat-value text-3xl md:text-4xl font-display font-black text-orange-500"
                style={{ animationDelay: `${i * 0.4}s` }}
              >
                {s.value}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── STEP VISUALS ─────────────────────── */

/** Step 1: Floating shirt image */
function WearItVisual() {
  return (
    <div className="relative flex items-center justify-center h-52">
      <style>{`
        @keyframes floatShirt {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-14px) rotate(-3deg); }
        }
        .float-shirt { animation: floatShirt 3.2s ease-in-out infinite; }
      `}</style>
      <div className="float-shirt drop-shadow-[0_20px_40px_rgba(249,115,22,0.25)]">
        <img
          src="/assets/scrolly/tshirt_front_v3.png"
          alt="KnoWMi Tee"
          className="h-44 w-auto object-contain"
          loading="lazy"
        />
      </div>
    </div>
  )
}

/** Step 2: Glowing QR scanner animation */
function ScanItVisual() {
  return (
    <div className="relative flex items-center justify-center h-52">
      <style>{`
        @keyframes scanLine {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
        @keyframes cornerPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .scan-line {
          animation: scanLine 2s ease-in-out infinite;
          position: absolute;
          left: 8px; right: 8px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #f97316, transparent);
          box-shadow: 0 0 12px rgba(249,115,22,0.8);
          border-radius: 99px;
        }
        .qr-corner { animation: cornerPulse 1.5s ease-in-out infinite; }
      `}</style>
      <div className="relative w-36 h-36 border border-white/10 rounded-2xl bg-white/3 overflow-hidden">
        {/* QR dot grid (decorative) */}
        <div className="absolute inset-2 grid grid-cols-7 gap-0.5 opacity-20">
          {Array.from({ length: 49 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[2px] bg-white"
              style={{ opacity: Math.random() > 0.4 ? 1 : 0 }}
            />
          ))}
        </div>
        {/* Corner brackets */}
        <div className="absolute top-1.5 left-1.5 w-5 h-5 border-t-2 border-l-2 border-orange-500 rounded-tl-md qr-corner" />
        <div className="absolute top-1.5 right-1.5 w-5 h-5 border-t-2 border-r-2 border-orange-500 rounded-tr-md qr-corner" style={{ animationDelay: '0.3s' }} />
        <div className="absolute bottom-1.5 left-1.5 w-5 h-5 border-b-2 border-l-2 border-orange-500 rounded-bl-md qr-corner" style={{ animationDelay: '0.6s' }} />
        <div className="absolute bottom-1.5 right-1.5 w-5 h-5 border-b-2 border-r-2 border-orange-500 rounded-br-md qr-corner" style={{ animationDelay: '0.9s' }} />
        {/* Scan line */}
        <div className="scan-line" />
      </div>
    </div>
  )
}

/** Step 3: Mini profile card */
function RememberedVisual() {
  return (
    <div className="relative flex items-center justify-center h-52">
      <style>{`
        @keyframes profilePop {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 32px rgba(249,115,22,0.1); }
          50% { transform: scale(1.03); box-shadow: 0 16px 48px rgba(249,115,22,0.25); }
        }
        .profile-card { animation: profilePop 3s ease-in-out infinite; }
      `}</style>
      <div className="profile-card w-56 bg-[#1a1a1a] border border-white/10 rounded-3xl p-5 text-center">
        <img
          src="https://i.pravatar.cc/100?u=knowmi_demo"
          alt="Profile avatar"
          className="w-14 h-14 rounded-full mx-auto mb-3 border-2 border-orange-500/50 object-cover"
        />
        <p className="text-sm font-black text-white mb-0.5">Arjun Mehta</p>
        <p className="text-[10px] text-neutral-500 font-medium mb-3">Full-Stack Dev · Mumbai</p>
        <div className="flex justify-center gap-3">
          <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-orange-500 hover:border-orange-500/40 transition-colors">
            <Twitter size={12} />
          </div>
          <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-orange-500 hover:border-orange-500/40 transition-colors">
            <Linkedin size={12} />
          </div>
          <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-orange-500 hover:border-orange-500/40 transition-colors">
            <Github size={12} />
          </div>
          <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-orange-500 hover:border-orange-500/40 transition-colors">
            <Instagram size={12} />
          </div>
        </div>
        <div className="mt-3 text-[9px] font-black uppercase tracking-widest text-orange-500">
          ● Live Profile
        </div>
      </div>
    </div>
  )
}

const steps = [
  {
    num: '01',
    title: 'Wear It',
    desc: 'A premium 220 GSM tee that carries your entire digital world. People notice. Conversations start.',
    Visual: WearItVisual,
  },
  {
    num: '02',
    title: 'Scan It',
    desc: 'Instantly pulls up your live profile on any phone camera. No app. No friction. Just magic.',
    Visual: ScanItVisual,
  },
  {
    num: '03',
    title: "You're Remembered",
    desc: 'Your links, portfolio, and story — all in one place. Every scan becomes a connection that lasts.',
    Visual: RememberedVisual,
  },
]

/* ─────────────────────── HOW IT WORKS ─────────────────────── */
export function HowItWorks() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const stepsRef = useRef([])
  const lineRef = useRef(null)

  useEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia()

      // Desktop Animation (pinned scroll)
      mm.add('(min-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=2000',
            scrub: 1,
            pin: true,
          },
        })

        gsap.set(headerRef.current, { opacity: 0, y: 50 })
        gsap.set(stepsRef.current, { opacity: 0, y: 50, scale: 0.9 })
        gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' })

        tl.to(headerRef.current, { opacity: 1, y: 0, duration: 1 })
          .to(stepsRef.current[0], { opacity: 1, y: 0, scale: 1, duration: 1 })
          .to(lineRef.current, { scaleX: 0.5, duration: 1 }, '+=0.5')
          .to(stepsRef.current[0], { opacity: 0.4, scale: 0.95, duration: 1 }, '<')
          .to(stepsRef.current[1], { opacity: 1, y: 0, scale: 1, duration: 1 }, '<')
          .to(lineRef.current, { scaleX: 1, duration: 1 }, '+=0.5')
          .to(stepsRef.current[1], { opacity: 0.4, scale: 0.95, duration: 1 }, '<')
          .to(stepsRef.current[2], { opacity: 1, y: 0, scale: 1, duration: 1 }, '<')
          .to(stepsRef.current, { opacity: 1, scale: 1, duration: 1 }, '+=0.5')
          .to({}, { duration: 1 })
      })

      // Mobile Animation
      mm.add('(max-width: 1023px)', () => {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            },
          }
        )

        stepsRef.current.forEach((step, i) => {
          gsap.fromTo(
            step,
            { opacity: 0, y: 30, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: 'back.out(1.5)',
              scrollTrigger: {
                trigger: step,
                start: 'top 85%',
              },
            }
          )
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="how-it-works"
      className="py-32 bg-black min-h-screen flex items-center"
      ref={sectionRef}
    >
      <div className="max-w-[1200px] mx-auto px-6 w-full">
        {/* Header */}
        <div className="text-center mb-20" ref={headerRef}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6 text-orange-500 text-[10px] font-black uppercase tracking-widest">
            How It Works
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight leading-[1.05]">
            It&apos;s stupidly simple.
            <br />
            <span className="text-orange-500 italic">That&apos;s the point.</span>
          </h2>
          <p className="text-lg text-neutral-400 font-medium max-w-xl mx-auto">
            No complicated setup. No downloaded apps. Just a tee that works as hard as you do.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16 relative">
          {/* Connection Line (Desktop) */}
          <div
            className="hidden lg:block absolute top-[90px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0"
            ref={lineRef}
          />

          {steps.map((step, i) => {
            const { Visual } = step
            return (
              <div
                key={i}
                className="relative z-10 flex flex-col items-center text-center"
                ref={el => (stepsRef.current[i] = el)}
              >
                {/* Huge decorative step number */}
                <div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 text-[8rem] font-black leading-none select-none pointer-events-none"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '1px rgba(255,255,255,0.04)',
                    fontFamily: 'var(--font-display)',
                  }}
                  aria-hidden="true"
                >
                  {step.num}
                </div>

                {/* Visual demo */}
                <div className="relative z-10 w-full">
                  <Visual />
                </div>

                <h3 className="text-2xl font-display font-black mb-3 text-white mt-4">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-500 font-medium leading-relaxed max-w-[260px]">
                  {step.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

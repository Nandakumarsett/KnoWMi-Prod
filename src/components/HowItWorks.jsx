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

/** Step 1: Person wearing a KnoWMi tshirt with QR on back (HD generated) */
function WearItVisual() {
  return (
    <div className="relative flex items-center justify-center h-52">
      <style>{`
        @keyframes floatPerson {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .float-person { animation: floatPerson 3.5s ease-in-out infinite; }
      `}</style>
      <div className="float-person relative w-44 h-48 overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(249,115,22,0.3)]">
        <img
          src="/assets/scrolly/knowmi_wear_it.png"
          alt="Person wearing KnoWMi tee with QR code"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
      </div>
    </div>
  )
}

/** Step 2: Real QR code + scanner overlay (scan line contained inside QR box) */
function ScanItVisual() {
  return (
    <div className="relative flex items-center justify-center h-52">
      <style>{`
        @keyframes scanLineQR {
          0%   { top: 6px;  opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { top: calc(100% - 8px); opacity: 0; }
        }
        @keyframes cornerPulseQR {
          0%, 100% { opacity: 0.55; }
          50%       { opacity: 1; }
        }
        @keyframes scannerFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        .scan-line-qr {
          animation: scanLineQR 2.2s ease-in-out infinite;
          position: absolute;
          left: 6px; right: 6px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #f97316 40%, #f97316 60%, transparent);
          box-shadow: 0 0 10px rgba(249,115,22,0.9);
          border-radius: 99px;
          z-index: 20;
        }
        .qr-corner-br { animation: cornerPulseQR 1.5s ease-in-out infinite; }
        .scanner-float { animation: scannerFloat 4s ease-in-out infinite; }
      `}</style>

      {/* Phone-like frame holding the QR scanner */}
      <div className="scanner-float relative">
        {/* QR code image */}
        <div
          className="relative w-40 h-40 rounded-xl overflow-hidden bg-white p-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          style={{ isolation: 'isolate' }}
        >
          {/* Real QR pattern using SVG */}
          <svg viewBox="0 0 37 37" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Top-left finder */}
            <rect x="1" y="1" width="9" height="9" rx="1" fill="#111"/>
            <rect x="2.5" y="2.5" width="6" height="6" rx="0.5" fill="white"/>
            <rect x="3.5" y="3.5" width="4" height="4" fill="#111"/>
            {/* Top-right finder */}
            <rect x="27" y="1" width="9" height="9" rx="1" fill="#111"/>
            <rect x="28.5" y="2.5" width="6" height="6" rx="0.5" fill="white"/>
            <rect x="29.5" y="3.5" width="4" height="4" fill="#111"/>
            {/* Bottom-left finder */}
            <rect x="1" y="27" width="9" height="9" rx="1" fill="#111"/>
            <rect x="2.5" y="28.5" width="6" height="6" rx="0.5" fill="white"/>
            <rect x="3.5" y="29.5" width="4" height="4" fill="#111"/>
            {/* Data modules (random pattern) */}
            {[
              [12,1],[14,1],[16,1],[18,1],[20,1],[22,1],[24,1],
              [11,3],[13,3],[15,3],[19,3],[21,3],[23,3],[25,3],
              [12,5],[14,5],[16,5],[20,5],[22,5],[24,5],
              [11,7],[15,7],[17,7],[19,7],[23,7],[25,7],
              [12,9],[14,9],[18,9],[20,9],[22,9],
              [1,11],[3,11],[5,11],[7,11],[11,11],[13,11],[15,11],[17,11],[19,11],[21,11],[23,11],[25,11],[27,11],[29,11],[31,11],[33,11],[35,11],
              [1,13],[5,13],[9,13],[13,13],[17,13],[21,13],[25,13],[29,13],[33,13],
              [1,15],[3,15],[7,15],[11,15],[13,15],[17,15],[19,15],[23,15],[27,15],[31,15],[35,15],
              [1,17],[5,17],[9,17],[11,17],[15,17],[19,17],[21,17],[25,17],[29,17],[33,17],
              [1,19],[3,19],[7,19],[13,19],[17,19],[21,19],[23,19],[27,19],[31,19],[35,19],
              [1,21],[5,21],[9,21],[11,21],[13,21],[19,21],[23,21],[25,21],[27,21],[33,21],
              [1,23],[3,23],[5,23],[7,23],[9,23],[11,23],[13,23],[17,23],[21,23],[25,23],[29,23],[31,23],[33,23],[35,23],
              [11,25],[13,25],[17,25],[19,25],[23,25],[27,25],[31,25],[35,25],
              [12,27],[14,27],[18,27],[22,27],[24,27],[26,27],[30,27],[34,27],
              [11,29],[13,29],[15,29],[19,29],[21,29],[25,29],[27,29],[29,29],[33,29],[35,29],
              [12,31],[16,31],[18,31],[20,31],[24,31],[28,31],[30,31],[34,31],
              [11,33],[13,33],[17,33],[19,33],[21,33],[23,33],[27,33],[29,33],[31,33],[35,33],
              [12,35],[14,35],[16,35],[20,35],[22,35],[26,35],[28,35],[30,35],[32,35],[34,35],
            ].map(([x,y],i) => (
              <rect key={i} x={x} y={y} width="2" height="2" fill="#111" />
            ))}
          </svg>

          {/* Scanner overlay — completely clipped inside QR box */}
          <div className="absolute inset-0 rounded-xl overflow-hidden" style={{ zIndex: 10 }}>
            {/* Corner brackets */}
            <div className="absolute top-1.5 left-1.5 w-6 h-6 border-t-[3px] border-l-[3px] border-orange-500 rounded-tl qr-corner-br" />
            <div className="absolute top-1.5 right-1.5 w-6 h-6 border-t-[3px] border-r-[3px] border-orange-500 rounded-tr qr-corner-br" style={{ animationDelay: '0.3s' }} />
            <div className="absolute bottom-1.5 left-1.5 w-6 h-6 border-b-[3px] border-l-[3px] border-orange-500 rounded-bl qr-corner-br" style={{ animationDelay: '0.6s' }} />
            <div className="absolute bottom-1.5 right-1.5 w-6 h-6 border-b-[3px] border-r-[3px] border-orange-500 rounded-br qr-corner-br" style={{ animationDelay: '0.9s' }} />
            {/* Scan line stays inside QR */}
            <div className="scan-line-qr" />
          </div>
        </div>

        {/* "Scanning..." label */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Scanning…</span>
        </div>
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
          {/* Connection Line — sits below visuals at title level, never overlaps them */}
          <div
            className="hidden lg:block absolute top-[248px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-orange-500/0 via-orange-500/40 to-orange-500/0"
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

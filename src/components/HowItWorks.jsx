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
      className="overflow-hidden py-4"
      style={{
        background: '#0a0a0a',
        borderTop: '3px solid #F97316',
        borderBottom: '3px solid #F97316',
      }}
      aria-label="Feature highlights"
      aria-hidden="true"
    >
      <div className="flex">
        <div className="marquee-track flex">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="text-xs font-black uppercase tracking-[0.2em] px-8 flex items-center gap-2 whitespace-nowrap text-white"
            >
              {item}
              <span className="w-2 h-2 rounded-sm bg-orange-500 border border-black" />
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
    <div
      className="overflow-hidden py-6"
      style={{
        background: '#0a0a0a',
        borderTop: '3px solid #fff',
        borderBottom: '3px solid #fff',
      }}
      aria-label="Social proof stats"
      aria-hidden="true"
    >
      <div className="flex">
        <div className="marquee-track flex items-center">
          {[...stats, ...stats, ...stats, ...stats, ...stats, ...stats].map((s, i) => (
            <span
              key={i}
              className="text-base sm:text-lg md:text-2xl font-black uppercase tracking-[0.1em] px-10 flex items-center gap-3 whitespace-nowrap text-white"
            >
              <span className="text-xl sm:text-2xl">{s.icon}</span>
              <span className="text-orange-500">{s.value}</span>
              <span className="text-neutral-400">{s.label}</span>
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 border border-black ml-4" />
            </span>
          ))}
        </div>
      </div>
    </div>
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
      <div className="float-person relative w-44 h-48 overflow-hidden rounded-xl border-[3px] border-white shadow-[4px_4px_0px_#F97316]">
        <img
          src="/assets/scrolly/knowmi_wear_it.png"
          alt="Person wearing KnoWMi tee with QR code"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
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
          height: 3px;
          background: #f97316;
          border-radius: 0;
          z-index: 20;
        }
        .qr-corner-br { animation: cornerPulseQR 1.5s ease-in-out infinite; }
        .scanner-float { animation: scannerFloat 4s ease-in-out infinite; }
      `}</style>

      {/* Phone-like frame holding the QR scanner */}
      <div className="scanner-float relative">
        {/* QR code image */}
        <div
          className="relative w-40 h-40 rounded-xl overflow-hidden bg-white p-2 border-[3px] border-black shadow-[4px_4px_0px_#F97316]"
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
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-sm bg-orange-500 opacity-75" />
            <span className="relative inline-flex rounded-sm h-2.5 w-2.5 bg-orange-500" />
          </span>
          <span className="text-[11px] font-black uppercase tracking-widest text-orange-500">Scanning…</span>
        </div>
      </div>
    </div>
  )
}

/** Step 3: Mini profile card */
function RememberedVisual() {
  return (
    <div className="relative flex items-center justify-center h-52">
      <div className="w-56 bg-white border-[3px] border-black rounded-xl p-5 text-center shadow-[5px_5px_0px_#F97316]">
        <img
          src="https://i.pravatar.cc/100?u=knowmi_demo"
          alt="Profile avatar"
          className="w-14 h-14 rounded-xl mx-auto mb-3 border-[3px] border-orange-500 object-cover"
        />
        <p className="text-sm font-black text-neutral-900 mb-0.5">Arjun Mehta</p>
        <p className="text-[10px] text-neutral-500 font-black uppercase mb-3">Full-Stack Dev · Mumbai</p>
        <div className="flex justify-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border-[2px] border-black flex items-center justify-center text-white hover:bg-orange-500 hover:text-black transition-colors">
            <Twitter size={13} />
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border-[2px] border-black flex items-center justify-center text-white hover:bg-orange-500 hover:text-black transition-colors">
            <Linkedin size={13} />
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border-[2px] border-black flex items-center justify-center text-white hover:bg-orange-500 hover:text-black transition-colors">
            <Github size={13} />
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border-[2px] border-black flex items-center justify-center text-white hover:bg-orange-500 hover:text-black transition-colors">
            <Instagram size={13} />
          </div>
        </div>
        <div className="mt-3 text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 border-[2px] border-orange-500 rounded-lg py-1 px-2 inline-block">
          ● Live Profile
        </div>
      </div>
    </div>
  )
}

const steps = [
  {
    num: '01',
    title: 'WEAR IT',
    desc: 'A premium 220 GSM tee that carries your entire digital world. People notice. Conversations start.',
    Visual: WearItVisual,
    accent: '#F97316',
  },
  {
    num: '02',
    title: 'SCAN IT',
    desc: 'Instantly pulls up your live profile on any phone camera. No app. No friction. Just magic.',
    Visual: ScanItVisual,
    accent: '#EC4899',
  },
  {
    num: '03',
    title: "YOU'RE REMEMBERED",
    desc: 'Your links, portfolio, and story — all in one place. Every scan becomes a connection that lasts.',
    Visual: RememberedVisual,
    accent: '#22D3EE',
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
        gsap.set(stepsRef.current, { opacity: 0, y: 50, scale: 0.9, filter: 'brightness(1)' })
        gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' })

        tl.to(headerRef.current, { opacity: 1, y: 0, duration: 1 })
          .to(stepsRef.current[0], { opacity: 1, y: 0, scale: 1, duration: 1 })
          .to(lineRef.current, { scaleX: 0.5, duration: 1 }, '+=0.5')
          .to(stepsRef.current[0], { filter: 'brightness(0.4)', scale: 0.95, duration: 1 }, '<')
          .to(stepsRef.current[1], { opacity: 1, y: 0, scale: 1, duration: 1 }, '<')
          .to(lineRef.current, { scaleX: 1, duration: 1 }, '+=0.5')
          .to(stepsRef.current[1], { filter: 'brightness(0.4)', scale: 0.95, duration: 1 }, '<')
          .to(stepsRef.current[2], { opacity: 1, y: 0, scale: 1, duration: 1 }, '<')
          .to(stepsRef.current, { filter: 'brightness(1)', scale: 1, duration: 1 }, '+=0.5')
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
      className="py-12 md:py-32 bg-[#0a0a0a] min-h-0 md:min-h-screen flex items-center"
      ref={sectionRef}
    >
      <div className="max-w-[1200px] mx-auto px-6 w-full">
        {/* Header */}
        <div className="text-center mb-6 md:mb-20" ref={headerRef}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-orange-500 text-black border-[3px] border-black shadow-[3px_3px_0px_#000] mb-6 text-[11px] font-black uppercase tracking-widest">
            How It Works
          </div>
          <h2 className="text-2xl md:text-5xl lg:text-7xl font-black text-white mb-3 md:mb-6 tracking-tight leading-[1.05]">
            IT&apos;S STUPIDLY SIMPLE.
            <br />
            <span className="text-orange-500" style={{ WebkitTextStroke: '2px #F97316' }}>THAT&apos;S THE POINT.</span>
          </h2>
          <p className="text-lg text-neutral-300 font-black max-w-xl mx-auto">
            No complicated setup. No downloaded apps. Just a tee that works as hard as you do.
          </p>
        </div>

        {/* Steps grid — scrollable flex on mobile, grid on sm+ */}
        <div className="flex overflow-x-auto sm:grid sm:grid-cols-3 gap-6 sm:gap-12 lg:gap-16 relative pb-6 snap-x snap-mandatory no-scrollbar">
          {/* Connection Line — solid brutal style */}
          <div
            className="hidden lg:block absolute top-[248px] left-[15%] right-[15%] h-[3px] bg-orange-500"
            ref={lineRef}
          />

          {steps.map((step, i) => {
            const { Visual } = step
            return (
              <div
                key={i}
                className="relative z-10 flex-shrink-0 w-[290px] sm:w-auto snap-center flex flex-col items-center text-center bg-[#1a1a1a] border-2 sm:border-[3px] border-white rounded-xl p-6 shadow-[3px_3px_0px_#F97316] sm:shadow-[5px_5px_0px_#F97316] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150"
                ref={el => (stepsRef.current[i] = el)}
              >
                {/* Step number badge */}
                <div
                  className="w-14 h-14 rounded-xl font-black text-2xl flex items-center justify-center border-[3px] border-black shadow-[3px_3px_0px_#000] mb-4 text-black flex-shrink-0"
                  style={{ backgroundColor: step.accent }}
                >
                  {step.num}
                </div>

                {/* Visual demo */}
                <div className="block w-full max-w-[240px] mx-auto relative z-10 border-[2px] border-white/20 rounded-xl p-2 mb-4 bg-[#111]">
                  <Visual />
                </div>

                <h3 className="text-xl sm:text-base md:text-2xl font-black mb-3 text-white uppercase tracking-wide leading-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-400 font-bold leading-relaxed max-w-[260px]">
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

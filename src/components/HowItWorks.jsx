import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Shirt, Smartphone, Zap } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const marqueeItems = [
  '🇮🇳 Made in India', '⚡ Instant QR Profile', '📦 Pan India Delivery',
  '🎨 Custom Print', '🔗 Link Bio + Social', '✅ Scan & Connect',
  '🏆 12,000+ Wearers', '🌟 4.9 Star Rated', '🎓 College Events',
]

const steps = [
  {
    icon: <Shirt size={32} className="text-orange-500" strokeWidth={1.5} />,
    title: 'Wear It',
    desc: 'A premium 220 GSM tee that carries your entire digital world. People notice. Conversations start.',
    color: 'var(--saffron)',
    bg: 'var(--saffron-light)',
  },
  {
    icon: <Smartphone size={32} className="text-orange-500" strokeWidth={1.5} />,
    title: 'Scan It',
    desc: 'Instantly pulls up your live profile on any phone camera. No app. No friction. Just magic.',
    color: 'var(--green-india)',
    bg: 'var(--green-light)',
  },
  {
    icon: <Zap size={32} className="text-orange-500" strokeWidth={1.5} />,
    title: 'You\'re Remembered',
    desc: 'Your links, portfolio, and story — all in one place. Every scan becomes a connection that lasts.',
    color: 'var(--navy)',
    bg: 'var(--navy-light)',
  },
]

export function Marquee() {
  return (
    <div
      className="overflow-hidden py-3.5"
      style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      aria-label="Feature highlights"
      aria-hidden="true"
    >
      <div className="flex">
        <div className="marquee-track flex">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="text-[10px] font-black uppercase tracking-[0.2em] px-8 flex items-center gap-2 whitespace-nowrap text-white/50">
              {item}
              <span className="w-1 h-1 rounded-full bg-orange-500/50" />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function HowItWorks() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const stepsRef = useRef([])
  const lineRef = useRef(null)

  useEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      // Desktop Cinematic Animation
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=2000',
            scrub: 1,
            pin: true,
          }
        });

        // Initial states
        gsap.set(headerRef.current, { opacity: 0, y: 50 });
        gsap.set(stepsRef.current, { opacity: 0, y: 50, scale: 0.9 });
        gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' });

        tl.to(headerRef.current, { opacity: 1, y: 0, duration: 1 })
          .to(stepsRef.current[0], { opacity: 1, y: 0, scale: 1, duration: 1 })
          .to(lineRef.current, { scaleX: 0.5, duration: 1 }, "+=0.5")
          .to(stepsRef.current[0], { opacity: 0.4, scale: 0.95, duration: 1 }, "<")
          .to(stepsRef.current[1], { opacity: 1, y: 0, scale: 1, duration: 1 }, "<")
          .to(lineRef.current, { scaleX: 1, duration: 1 }, "+=0.5")
          .to(stepsRef.current[1], { opacity: 0.4, scale: 0.95, duration: 1 }, "<")
          .to(stepsRef.current[2], { opacity: 1, y: 0, scale: 1, duration: 1 }, "<")
          .to(stepsRef.current, { opacity: 1, scale: 1, duration: 1 }, "+=0.5")
          .to({}, { duration: 1 });
      });

      // Mobile / Tablet Animation
      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: 30 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 1, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            }
          }
        );

        stepsRef.current.forEach((step, i) => {
          gsap.fromTo(step,
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
              }
            }
          );
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" className="py-32 bg-black min-h-screen flex items-center" ref={sectionRef}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-24" ref={headerRef}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6 text-orange-500 text-[10px] font-black uppercase tracking-widest">
            How It Works
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight leading-[1.05]">
            It's stupidly simple.<br />
            <span className="text-orange-500 italic">That's the point.</span>
          </h2>
          <p className="text-lg text-neutral-400 font-medium max-w-xl mx-auto">
            No complicated setup. No downloaded apps. Just a tee that works as hard as you do.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-12 lg:gap-24 relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-[45px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0" ref={lineRef} />
          
          {steps.map((step, i) => (
            <div key={i} className="text-center relative z-10" ref={el => stepsRef.current[i] = el}>
              <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-10 group-hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                {step.icon}
              </div>
              <h3 className="text-2xl font-display font-black mb-4 text-white">
                {step.title}
              </h3>
              <p className="text-sm text-neutral-500 font-medium leading-relaxed max-w-[260px] mx-auto">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

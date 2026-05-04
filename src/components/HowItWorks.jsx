import { useReveal } from '../hooks/useReveal'
import { Shirt, Smartphone, Zap } from 'lucide-react'

const marqueeItems = [
  '🇮🇳 Made in India', '⚡ Instant QR Profile', '📦 Pan India Delivery',
  '🎨 Custom Print', '🔗 Link Bio + Social', '✅ Scan & Connect',
  '🏆 12,000+ Wearers', '🌟 4.9 Star Rated', '🎓 College Events',
]

const steps = [
  {
    icon: <Shirt size={32} className="text-orange-500" strokeWidth={1.5} />,
    title: 'Wear It',
    desc: 'Premium 220 GSM cotton meets your unique digital soul. Built for comfort, designed for identity.',
    color: 'var(--saffron)',
    bg: 'var(--saffron-light)',
  },
  {
    icon: <Smartphone size={32} className="text-orange-500" strokeWidth={1.5} />,
    title: 'Scan It',
    desc: 'Instant profile access with any smartphone camera. No apps. No friction. Just connection.',
    color: 'var(--green-india)',
    bg: 'var(--green-light)',
  },
  {
    icon: <Zap size={32} className="text-orange-500" strokeWidth={1.5} />,
    title: 'Connect Instantly',
    desc: 'Share your links, portfolio, and socials in one go. Turn every hello into a lasting legacy.',
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
  const ref = useReveal()

  return (
    <section id="how-it-works" className="py-32 bg-[#FDFDFB] snap-section min-h-screen flex items-center" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-24 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-6 text-orange-600 text-[10px] font-black uppercase tracking-widest">
            The Experience
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-black text-black mb-6 tracking-tight leading-[1.05]">
            Simple. Human. <br />
            <span className="text-orange-500 italic">Effective.</span>
          </h2>
          <p className="text-lg text-neutral-400 font-medium max-w-xl mx-auto">
            Your digital identity, ready to wear in three simple steps.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-12 lg:gap-24 relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-[45px] left-[15%] right-[15%] h-px bg-neutral-100" />
          
          {steps.map((step, i) => (
            <div key={i} className={`reveal reveal-delay-${i + 1} text-center relative z-10`}>
              <div className="w-24 h-24 rounded-[2rem] bg-white border border-neutral-100 shadow-xl shadow-neutral-100 flex items-center justify-center mx-auto mb-10 group-hover:scale-105 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-2xl font-display font-black mb-4 text-black">
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

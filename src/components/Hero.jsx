import { useEffect, useRef } from 'react'
import PhoneMockup from './PhoneMockup'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const stats = [
  { num: '12K+', label: 'Profiles Scanned' },
  { num: '4.9★', label: 'User Rating' },
  { num: '100%', label: 'No App Needed' },
  { num: '48hrs', label: 'Ships Fast' },
]

const trustAvatars = [
  { initial: 'R', color: '#FF9933' },
  { initial: 'P', color: '#138808' },
  { initial: 'A', color: '#000080' },
  { initial: 'S', color: '#E07A00' },
  { initial: 'M', color: '#9B59B6' },
]

export default function Hero({ onOrderClick }) {
  const { user } = useAuth()
  const heroRef = useRef(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const items = el.querySelectorAll('[data-fade]')
    items.forEach((item, i) => {
      item.style.opacity = '0'
      item.style.transform = 'translate3d(0, 28px, 0)'
      setTimeout(() => {
        item.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)'
        item.style.opacity = '1'
        item.style.transform = 'translate3d(0, 0, 0)'
      }, 100 + i * 120)
    })
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full flex items-center overflow-hidden mesh-bg pt-32 z-0"
      aria-label="Hero section"
    >
      {/* Background orbs */}
      <div className="orb w-[500px] h-[500px] top-[-100px] left-[-100px]"
        style={{ background: 'rgba(255,153,51,0.10)' }} aria-hidden="true" />
      <div className="orb w-[400px] h-[400px] bottom-[-80px] right-[-80px]"
        style={{ background: 'rgba(0,0,128,0.06)' }} aria-hidden="true" />
      <div className="orb w-[300px] h-[300px] top-[40%] right-[20%]"
        style={{ background: 'rgba(19,136,8,0.05)' }} aria-hidden="true" />

      {/* Diagonal saffron accent stripe */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: '600px', height: '1200px',
          background: 'linear-gradient(135deg, transparent 40%, rgba(255,153,51,0.03) 50%, transparent 60%)',
          transform: 'rotate(-15deg)',
        }} />
      </div>

      {/* Decorative grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(232,232,238,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,232,238,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center py-12 lg:py-4">

          {/* Left copy */}
          <div className="max-w-[560px] flex flex-col items-center lg:items-start text-center lg:text-left mx-auto lg:mx-0">

            {/* Trust tags */}
            <div data-fade className="mb-6 flex items-center justify-center lg:justify-start gap-3 flex-wrap">
              <span className="tag" style={{ background: 'var(--saffron-light)', color: 'var(--saffron)' }}>
                <span>🇮🇳</span> India's First
              </span>
              <span className="tag" style={{ background: 'var(--green-light)', color: 'var(--green-india)' }}>
                ✦ Phygital Identity
              </span>
            </div>

            {/* Headline */}
            <h1 data-fade className="font-display font-black leading-[1.15] mb-6" style={{ fontSize: 'clamp(2rem, 5.5vw, 4rem)', color: 'var(--ink)' }}>
              <span className="block">You meet people.</span>
              <span className="block">They forget you.</span>
              <span className="block italic text-orange-500">Not anymore.</span>
            </h1>

            {/* Subhead */}
            <p data-fade className="text-lg leading-relaxed mb-4 font-medium mx-auto lg:mx-0" style={{ color: 'var(--ink3)', maxWidth: '480px' }}>
              KnoWMi is a <strong style={{ color: 'var(--ink)' }}>QR-powered identity tee</strong> that makes every handshake count. Scan it. See everything. Connect instantly.
            </p>
            <p data-fade className="text-sm leading-relaxed mb-10 font-medium mx-auto lg:mx-0 px-4 py-3 rounded-xl" style={{ color: 'var(--saffron)', background: 'var(--saffron-light)', maxWidth: '480px' }}>
              ⚡ No app needed. No awkward exchanges. Just wear it — and let them come to you.
            </p>

            {/* CTAs */}
            <div data-fade className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
              {user ? (
                <a href="/dashboard" className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-200 hover:bg-orange-600 transition-all flex items-center gap-2">
                  Go to Dashboard
                  <ArrowRight size={16} />
                </a>
              ) : (
                <a onClick={() => onOrderClick?.()} className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-200 hover:bg-orange-600 transition-all flex items-center gap-2" href="#collection">
                  Claim Your Tee
                  <ArrowRight size={16} />
                </a>
              )}
              <a href="#how-it-works" className="px-8 py-4 bg-white border border-neutral-200 text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:border-orange-500 transition-all">
                How It Works
              </a>
            </div>

            {/* Social proof */}
            <div data-fade className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex -space-x-2" aria-label="Customer avatars">
                {trustAvatars.map((a, i) => (
                  <div key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: a.color, zIndex: 5 - i }}>
                    {a.initial}
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#FF9933" aria-hidden="true">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                  <span className="text-xs font-semibold ml-1" style={{ color: 'var(--ink2)' }}>4.9</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--ink3)' }}>Worn by creators, founders & students across India</p>
              </div>
            </div>
          </div>

          {/* Right — Phone mockup */}
          <div className="flex flex-col items-center lg:items-end justify-center relative" data-fade>
            {/* Suggestion 1: Identity Pulse & Floating Tee Motion Graphic */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true">
              {/* Holographic background glow */}
              <div className="absolute w-[400px] h-[400px] rounded-full bg-orange-500/10 blur-[100px] animate-holographic" />
              
              {/* Floating Tee Silhouette */}
              <div className="absolute -left-32 top-1/2 -translate-y-1/2 opacity-10 lg:opacity-20 animate-float-slow hidden xl:block">
                 <svg viewBox="0 0 200 250" className="w-[450px] h-[450px] fill-current text-orange-500">
                    <path d="M40,50 Q100,30 160,50 L190,90 L165,115 L155,108 L155,230 Q100,245 45,230 L45,108 L35,115 L10,90 Z" />
                    {/* Integrated Scan Line */}
                    <rect x="40" y="80" width="120" height="2" fill="white" className="animate-scan-glow" style={{ filter: 'blur(1px)' }} />
                 </svg>
              </div>
            </div>

            {/* Floating stat cards */}
            <div className="absolute left-0 top-[15%] hidden xl:block" style={{ animation: 'float 4s ease-in-out infinite', animationDelay: '0.5s' }}>
              <div className="glass rounded-2xl px-4 py-3 shadow-lg" style={{ border: '1px solid rgba(255,153,51,0.2)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'var(--saffron-light)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--saffron)" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold" style={{ color: 'var(--ink)', fontFamily: 'Fraunces, serif' }}>247</div>
                    <div className="text-[10px]" style={{ color: 'var(--ink4)' }}>New scans today</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute right-0 bottom-[20%] hidden xl:block" style={{ animation: 'float 5s ease-in-out infinite', animationDelay: '1.2s' }}>
              <div className="glass rounded-2xl px-4 py-3 shadow-lg" style={{ border: '1px solid rgba(19,136,8,0.2)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'var(--green-light)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green-india)" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold" style={{ color: 'var(--ink)', fontFamily: 'Fraunces, serif' }}>Verified</div>
                    <div className="text-[10px]" style={{ color: 'var(--ink4)' }}>Identity profile</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:scale-[0.85] xl:scale-95 origin-center lg:origin-right transition-transform duration-500">
              <PhoneMockup />
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div data-fade className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-16">
          {stats.map((s, i) => (
            <div key={i} className="text-center p-4 rounded-2xl card-lift"
              style={{ background: i % 2 === 0 ? 'var(--saffron-light)' : 'var(--off)', border: '1px solid var(--border2)' }}>
              <div className="font-display font-bold text-2xl mb-0.5" style={{ color: i % 2 === 0 ? 'var(--saffron)' : 'var(--ink)' }}>{s.num}</div>
              <div className="text-xs font-medium" style={{ color: 'var(--ink4)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

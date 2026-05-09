import { useReveal } from '../hooks/useReveal'

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="9" height="9" rx="1.5"/><rect x="13" y="2" width="9" height="9" rx="1.5"/>
        <rect x="2" y="13" width="9" height="9" rx="1.5"/><rect x="13" y="13" width="9" height="9" rx="1.5"/>
      </svg>
    ),
    title: 'Dynamic QR Profile',
    desc: 'Update your bio, links, or portfolio any time — without reprinting your tee. The QR always points to your latest profile.',
    color: 'var(--saffron)',
    bg: 'var(--saffron-light)',
    size: 'large',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    title: 'Instant Connect',
    desc: 'No app needed to scan. Any smartphone camera works.',
    color: 'var(--green-india)',
    bg: 'var(--green-light)',
    size: 'small',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    title: 'Scan Analytics',
    desc: 'Track how many times your QR was scanned, from which city, and what links were clicked.',
    color: 'var(--navy)',
    bg: 'var(--navy-light)',
    size: 'small',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    ),
    title: 'All Your Links, One QR',
    desc: 'LinkedIn, Instagram, Twitter, GitHub, Linktree, portfolio — every link in one seamless profile page.',
    color: 'var(--saffron)',
    bg: 'var(--saffron-light)',
    size: 'small',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Premium Print Quality',
    desc: 'High-res QR code on 100% combed cotton. Durable, wash-safe, and still scannable after 50+ washes.',
    color: 'var(--green-india)',
    bg: 'var(--green-light)',
    size: 'small',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Team & Bulk Orders',
    desc: 'Ordering for your college fest, startup, or community? Special pricing and custom branding for 10+ tees.',
    color: 'var(--navy)',
    bg: 'var(--navy-light)',
    size: 'large',
  },
]

export default function Features() {
  const ref = useReveal()

  return (
    <section id="features" className="section-pad relative overflow-hidden snap-section min-h-screen flex items-center" ref={ref}>
      {/* Artistic background accents */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,153,51,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,0,128,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>
      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 reveal">
          <span className="tag mb-4 inline-block" style={{ background: 'var(--navy-light)', color: 'var(--navy)' }}>
            Features
          </span>
          <h2 className="font-display font-bold mb-3" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: 'var(--ink)' }}>
            Everything Your{' '}
            <span className="italic gradient-text">Identity Needs</span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--ink3)' }}>
            A tee that works harder than your business card — 24/7, no printing required.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
          {features.map((f, i) => (
            <div
              key={i}
              role="listitem"
              className={`reveal reveal-delay-${(i % 4) + 1} card-lift rounded-[2rem] p-5 relative overflow-hidden ${
                f.size === 'large' ? 'lg:col-span-2' : ''
              }`}
              style={{ background: '#fff', border: '1px solid var(--border)' }}
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: f.bg, color: f.color }}>
                {f.icon}
              </div>

              {/* Content */}
              <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--ink)' }}>
                {f.title}
              </h3>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--ink3)' }}>
                {f.desc}
              </p>

              {/* Subtle corner accent */}
              <div className="absolute bottom-0 right-0 w-24 h-24 rounded-tl-3xl pointer-events-none"
                style={{ background: `linear-gradient(135deg, transparent, ${f.bg})`, opacity: 0.6 }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

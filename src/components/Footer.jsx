import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { ArrowRight, Truck, Lock, Shield, Zap } from 'lucide-react'

export function CTASection({ onOrderClick }) {
  const ref = useReveal()

  return (
    <section className="section-pad relative overflow-hidden snap-section min-h-screen flex items-center" ref={ref} style={{ background: 'var(--ink)' }}>
      {/* Background mesh */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="orb w-96 h-96 -top-20 -left-20" style={{ background: 'rgba(255,153,51,0.12)' }} />
        <div className="orb w-80 h-80 -bottom-20 -right-20" style={{ background: 'rgba(0,0,128,0.15)' }} />
        <div className="orb w-60 h-60 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ background: 'rgba(19,136,8,0.08)' }} />
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="max-w-[800px] mx-auto px-6 text-center relative z-10">
        <div className="reveal">
          <span className="tag mb-8 inline-block" style={{ background: 'rgba(255,153,51,0.15)', color: 'var(--saffron)', border: '1px solid rgba(255,153,51,0.2)' }}>
            Founding Member Access
          </span>
          <h2 className="font-display font-black mb-6 text-white tracking-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1 }}>
            Wear Your Identity.<br />
            <span className="italic text-orange-500">Start Connecting Today.</span>
          </h2>
          <p className="text-xl mb-12 font-medium" style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '600px', margin: '0 auto 3rem' }}>
            One Tee. One Scan. Infinite Connections.
          </p>
        </div>

        <div className="reveal flex flex-wrap gap-5 justify-center mb-16">
          <a onClick={() => onOrderClick?.()} href="#collection" className="px-10 py-5 bg-orange-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center gap-2">
            Get Your Identity Tee
            <ArrowRight size={16} />
          </a>
          <a href="https://wa.me/917981325397" target="_blank" rel="noopener noreferrer"
            className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
            WhatsApp Us
          </a>
        </div>

        <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Free Shipping', sub: 'Across India', icon: <Truck size={20} /> },
            { label: 'Secure Checkout', sub: 'Encrypted Pay', icon: <Lock size={20} /> },
            { label: 'Easy Returns', sub: '7-Day Policy', icon: <Shield size={20} /> },
            { label: 'Founders Perk', sub: 'Lifetime Access', icon: <Zap size={20} /> },
          ].map((t, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-500">
                {t.icon}
              </div>
              <div className="text-center">
                <div className="text-xs font-black uppercase tracking-widest text-white mb-1">{t.label}</div>
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">{t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const links = {
    Product: [
      { name: 'How It Works', href: '/#how-it-works' },
      { name: 'Features', href: '/#features' },
      { name: 'Pricing', href: '/#pricing' },
      { name: 'Leaderboard', href: '/leaderboard' }
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Press Kit', href: '/press' },
      { name: 'Careers', href: '/about' }
    ],
    Support: [
      { name: 'FAQs', href: '/#faq' },
      { name: 'WhatsApp Support', href: 'https://wa.me/917981325397', external: true },
      { name: 'Return Policy', href: '/legal#refund' },
      { name: 'Track Order', href: '/track' }
    ],
    Legal: [
      { name: 'Privacy Policy', href: '/legal#privacy' },
      { name: 'Terms of Service', href: '/legal#terms' },
      { name: 'Refund Policy', href: '/legal#refund' },
      { name: 'Sitemap', href: '/' }
    ],
  }

  return (
    <footer style={{ background: '#05050a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex flex-col leading-none pt-1">
                <div className="relative">
                  <div 
                    className="absolute left-[35%] top-1/2 -translate-y-1/2 w-[50%] h-[120%] bg-orange-500/5 blur-[4px]" 
                    style={{ zIndex: -1 }}
                  />
                  <span style={{ 
                    fontFamily: "'Montserrat', sans-serif", 
                    fontSize: '32px', 
                    fontWeight: 900,
                    letterSpacing: '-0.06em',
                    display: 'block',
                    color: '#fff',
                    lineHeight: 0.9
                  }}>
                    KnoW<span style={{ color: 'var(--saffron)' }}>M</span>i
                  </span>
                </div>
                <span 
                  className="text-[10px] font-black tracking-[0.12em] text-white/30 mt-1.5 uppercase"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Scan Me. Know Me.
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.35)', maxWidth: '240px' }}>
              India's first QR-enabled identity t-shirt. Wear your world. Share your story.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,153,51,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,153,51,0.25)'; e.currentTarget.style.color = 'var(--saffron)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,153,51,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,153,51,0.25)'; e.currentTarget.style.color = 'var(--saffron)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,153,51,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,153,51,0.25)'; e.currentTarget.style.color = 'var(--saffron)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,153,51,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,153,51,0.25)'; e.currentTarget.style.color = 'var(--saffron)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4"
                style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'JetBrains Mono, monospace' }}>
                {group}
              </h3>
              <ul className="space-y-2.5" role="list">
                {items.map(item => (
                  <li key={item.name} role="listitem">
                    {item.href.startsWith('http') || item.href.startsWith('/#') || item.external ? (
                      <a href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="text-sm transition-colors duration-200"
                        style={{ color: 'rgba(255,255,255,0.35)' }}
                        onMouseEnter={e => { e.target.style.color = '#fff' }}
                        onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.35)' }}>
                        {item.name}
                      </a>
                    ) : (
                      <Link to={item.href}
                        className="text-sm transition-colors duration-200"
                        style={{ color: 'rgba(255,255,255,0.35)' }}
                        onMouseEnter={e => { e.target.style.color = '#fff' }}
                        onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.35)' }}>
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono, monospace' }}>
            © 2025 KnoWMi. All rights reserved. Made with ❤️ in India.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'JetBrains Mono, monospace' }}>Secure Cloud Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

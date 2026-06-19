import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { ArrowRight, Truck, Lock, Shield, Zap, Mail } from 'lucide-react'

export function CTASection({ onOrderClick }) {
  const ref = useReveal()

  return (
    <section className="section-pad relative overflow-hidden min-h-screen flex items-center bg-[#0a0a0a]" ref={ref}>
      {/* Background grid — raw, no orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="max-w-[800px] mx-auto px-6 text-center relative z-10">
        <div className="reveal">
          <span className="inline-block mb-8 px-5 py-2 bg-orange-500 text-black text-xs font-black uppercase tracking-widest border-[3px] border-black rounded-lg shadow-[3px_3px_0px_#000]">
            FOUNDING MEMBER ACCESS
          </span>
          <h2 className="font-black mb-6 text-white uppercase tracking-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1, fontFamily: "'Montserrat', sans-serif" }}>
            WEAR YOUR IDENTITY.<br />
            <span className="text-orange-500">START CONNECTING TODAY.</span>
          </h2>
          <p className="text-xl mb-12 font-bold text-neutral-500" style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>
            One Tee. One Scan. Infinite Connections.
          </p>
        </div>

        <div className="reveal flex flex-wrap gap-5 justify-center mb-16">
          <a onClick={() => onOrderClick?.()} href="#collection" className="px-10 py-5 bg-orange-500 text-black rounded-xl font-black text-sm uppercase tracking-widest border-[3px] border-black shadow-[5px_5px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150 flex items-center gap-2">
            Get Your Identity Tee
            <ArrowRight size={16} strokeWidth={3} />
          </a>
          <a href="mailto:support.knowmi@gmail.com"
            className="px-10 py-5 bg-[#1a1a1a] border-[3px] border-white text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-[5px_5px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150 flex items-center gap-2">
            <Mail size={16} strokeWidth={3} />
            Email Support
          </a>
        </div>

        <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Free Shipping', sub: 'Across India', icon: <Truck size={22} strokeWidth={3} /> },
            { label: 'Secure Checkout', sub: 'Encrypted Pay', icon: <Lock size={22} strokeWidth={3} /> },
            { label: 'Easy Returns', sub: '7-Day Policy', icon: <Shield size={22} strokeWidth={3} /> },
            { label: 'Founders Perk', sub: 'Lifetime Access', icon: <Zap size={22} strokeWidth={3} /> },
          ].map((t, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-[#1a1a1a] border-[3px] border-orange-500 flex items-center justify-center text-orange-500 shadow-[3px_3px_0px_#F97316]">
                {t.icon}
              </div>
              <div className="text-center">
                <div className="text-xs font-black uppercase tracking-widest text-white mb-1">{t.label}</div>
                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-tighter">{t.sub}</div>
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
      { name: 'Personas', href: '/#personas' },
      { name: 'Pricing', href: '/#pricing' },
      { name: 'Shop Collection', href: '/shop' },
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Leaderboard', href: '/leaderboard' },
    ],
    Support: [
      { name: 'Help Center', href: '/legal#help' },
      { name: 'Track My Order', href: '/track' },
      { name: 'Contact Us', href: 'mailto:support.knowmi@gmail.com', external: true },
      { name: 'WhatsApp Us', href: 'https://wa.me/917981325397', external: true },
    ],
    'Trust & Legal': [
      { name: 'Security & Data', href: '/legal#security' },
      { name: 'Privacy Policy', href: '/legal#privacy' },
      { name: 'Terms of Service', href: '/legal#terms' },
      { name: 'Shipping & Returns', href: '/legal#refund' },
    ],
  }

  const socialLinks = [
    {
      href: 'https://instagram.com/knowmi.in',
      label: 'Instagram',
      color: '#EC4899',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
    },
    {
      href: 'https://twitter.com/knowmi_in',
      label: 'Twitter',
      color: '#22D3EE',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>,
    },
    {
      href: 'https://linkedin.com/company/knowmi-india',
      label: 'LinkedIn',
      color: '#3B82F6',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>,
    },
    {
      href: 'https://youtube.com/@knowmi_india',
      label: 'YouTube',
      color: '#EF4444',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>,
    },
  ]


  return (
    <footer className="bg-[#050505] border-t-[4px] border-orange-500">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex flex-col leading-none pt-1">
                <span className="font-black text-white block" style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '32px',
                  letterSpacing: '-0.06em',
                  lineHeight: 0.9,
                }}>
                  Kno<span className="text-orange-500">WM</span>i
                </span>
                <span className="text-[10px] font-black tracking-[0.12em] text-neutral-500 mt-1.5 uppercase"
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                  Scan Me. Know Me.
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5 text-neutral-400 font-bold" style={{ maxWidth: '240px' }}>
              India's first QR-enabled identity t-shirt. Wear your world. Share your story.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title="Opens in a new tab"
                  className="w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px]"
                  style={{
                    background: '#1a1a1a',
                    border: `3px solid ${social.color}`,
                    color: social.color,
                    boxShadow: `3px 3px 0px ${social.color}`,
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-xs font-black uppercase tracking-wider mb-4 text-orange-500"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {group}
              </h3>
              <ul className="space-y-2.5" role="list">
                {items.map(item => (
                  <li key={item.name} role="listitem">
                    {item.href.startsWith('http') || item.href.startsWith('/#') || item.external ? (
                      <a href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="text-sm font-bold text-neutral-500 hover:text-white transition-colors duration-150">
                        {item.name}
                      </a>
                    ) : (
                      <Link to={item.href}
                        className="text-sm font-bold text-neutral-500 hover:text-white transition-colors duration-150">
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
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-[3px] border-white/20">
          <p className="text-xs font-bold text-neutral-500" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            © 2025 KnoWMi. All rights reserved. Made with ❤️ in India.
          </p>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border-[3px] border-orange-500 rounded-lg shadow-[3px_3px_0px_#F97316]">
            <Lock size={14} className="text-orange-500" strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">256-Bit SSL Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

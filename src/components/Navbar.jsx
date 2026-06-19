import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'

const navLinks = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Collection', href: '/#collection' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'FAQs', href: '/#faq' },
]

export default function Navbar({ onOrderClick, onAuthClick, isDark = false }) {
  const { user, profile, signOut, isStaff, isVerified, role } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', onScroll, { passive: true })
    
    const handleScrollSpy = () => {
      const sections = navLinks.map(link => {
        if (link.href.includes('#')) {
          const id = link.href.split('#')[1]
          return document.getElementById(id)
        }
        return null
      }).filter(Boolean)

      const scrollPos = window.scrollY + 200 // offset for navbar height + buffer

      sections.forEach(section => {
        const top = section.offsetTop
        const height = section.offsetHeight
        if (scrollPos >= top && scrollPos < top + height) {
          setActiveSection(`#${section.id}`)
        }
      })
    }

    window.addEventListener('scroll', handleScrollSpy)
    
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', handleScrollSpy)
    }
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return
    const handleClick = () => setDropdownOpen(false)
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [dropdownOpen])

  const firstName = profile?.first_name || user?.user_metadata?.first_name || 'User'
  const status = profile?.status || 'free'

  const useDarkTheme = isDark;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
        scrolled
          ? useDarkTheme 
            ? 'bg-[#0a0a0a] border-b-[3px] border-white shadow-[0_4px_0_#F97316]' 
            : 'bg-white border-b-[3px] border-black shadow-[0_4px_0_#000]'
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-[1200px] mx-auto pl-2 pr-4 md:px-6 flex items-center justify-between lg:justify-start h-20 lg:h-[110px] gap-0 w-full relative">
        {/* Logo */}
        <a href="/" className="flex items-center flex-shrink-0" aria-label="KnoWMi home">
          <div className="flex flex-col leading-none relative z-20">
            <div className="relative">
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '32px',
                }}
                className={`lg:text-[36px] font-black tracking-tight block leading-[0.9] ${useDarkTheme ? 'text-white' : 'text-[var(--ink)]'}`}
              >
                Kno<span className="text-orange-500">WM</span>i
              </span>
            </div>
            <span
              className={`text-[9px] lg:text-[11px] font-black tracking-[0.15em] mt-1 uppercase ${useDarkTheme ? 'text-white/60' : 'text-neutral-400'}`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Scan Me. Know Me.
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1.5 flex-1 justify-center">
          {navLinks.map(l => {
            const isActive = activeSection === l.href
            return (
              <a
                key={l.label}
                href={l.href}
                className={`px-4 py-2 rounded-xl text-[14px] font-bold transition-all duration-300 ${
                  isActive 
                    ? (useDarkTheme ? 'bg-white/20 shadow-lg scale-105' : 'bg-white shadow-lg shadow-neutral-200/50 scale-105')
                    : (useDarkTheme ? 'hover:bg-white/10' : 'hover:bg-neutral-50/50')
                }`}
                style={{ 
                  color: isActive ? (useDarkTheme ? '#fff' : 'var(--saffron)') : (useDarkTheme ? 'rgba(255,255,255,0.7)' : 'var(--ink3)'),
                  border: isActive ? (useDarkTheme ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--border2)') : '1px solid transparent'
                }}
              >
                {l.label}
              </a>
            )
          })}
        </div>

        {/* Desktop CTA / User Area */}
        <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0 justify-end">
          {user ? (
            /* Logged in: show name + badge */
            <div className="flex items-center gap-3 relative">
              <div className="relative">
                <button
                  onClick={e => { e.stopPropagation(); setDropdownOpen(!dropdownOpen) }}
                  className={`flex items-center gap-2.5 px-4 h-10 rounded-xl transition-all duration-200 ${useDarkTheme ? 'hover:bg-white/10' : 'hover:bg-[var(--off)]'}`}
                  style={{ border: useDarkTheme ? '1.5px solid rgba(255,255,255,0.2)' : '1.5px solid var(--border)' }}
                >
                  <span className="text-base font-bold" style={{ color: useDarkTheme ? '#fff' : 'var(--ink)' }}>{firstName}</span>
                  {profile ? (
                    role === 'owner' ? (
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                        style={{ background: 'var(--navy)', color: '#fff', border: '1px solid var(--navy)' }}
                      >
                        Owner
                      </span>
                    ) : (
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          background: status === 'paid' ? 'rgba(19,136,8,0.1)' : 'rgba(255,153,51,0.1)',
                          color: status === 'paid' ? '#138808' : '#E07A00',
                          border: `1px solid ${status === 'paid' ? 'rgba(19,136,8,0.2)' : 'rgba(255,153,51,0.2)'}`,
                        }}
                      >
                        {status === 'paid' ? '✓ Paid' : 'Free'}
                      </span>
                    )
                  ) : (
                    <div className="w-[52px] h-[18px] rounded-full bg-neutral-200 animate-pulse opacity-40" />
                  )}
                  {/* Caret */}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: useDarkTheme ? 'rgba(255,255,255,0.5)' : 'var(--muted)' }}>
                    <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+8px)] w-48 rounded-xl overflow-hidden shadow-xl"
                  style={{ background: 'var(--paper)', border: '1px solid var(--border)', zIndex: 100 }}
                >
                  {isStaff && (
                    <a href="/admin" className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors hover:bg-[var(--off)]" style={{ color: 'var(--sf)', borderBottom: '1px solid var(--border)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      Admin Panel
                    </a>
                  )}
                  {isVerified || role === 'owner' || status === 'paid' ? (
                    <>
                      <a href="/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors hover:bg-[var(--off)]" style={{ color: 'var(--ink)', borderBottom: '1px solid var(--border)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h7" /><path d="M16 5l-4 4-4-4" /><path d="M22 17l-3 3-3-3" /><path d="M19 14v6" /></svg>
                        Analytics Dashboard
                      </a>
                    </>
                  ) : (
                    <a href="/dashboard" className="flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:bg-[var(--off)]" style={{ color: 'var(--ink)', borderBottom: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h7" /><path d="M16 5l-4 4-4-4" /><path d="M22 17l-3 3-3-3" /><path d="M19 14v6" /></svg>
                        Analytics
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    </a>
                  )}
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors hover:bg-red-50 text-left"
                    style={{ color: '#dc2626' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m5 5H9" /></svg>
                    Sign Out
                  </button>
                </div>
              )}
              </div>

              {/* Standalone Avatar circle */}
              <Link 
                to={profile ? (profile.persona_data?.identities?.length > 0 ? `/p/${profile.secure_slug || profile.username || profile.id}` : '/dashboard?tab=profile') : '/dashboard'}
                className="hover:scale-105 transition-transform shrink-0 block relative z-10 cursor-pointer"
                title="View Profile"
              >
                <Avatar src={profile?.avatar_url} name={firstName} size="w-10 h-10 ring-2 ring-orange-500 ring-offset-2 shadow-sm" />
              </Link>
            </div>
          ) : (
            /* Not logged in: show Sign Up / Sign In */
            <>
              <button
                onClick={() => onAuthClick?.('signin')}
                className={`px-5 py-2.5 text-[13px] font-black uppercase tracking-wider rounded-lg border-[3px] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[3px_3px_0px_#000] ${useDarkTheme ? 'bg-black text-white border-white shadow-[3px_3px_0px_#fff]' : 'bg-white text-black border-black'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => onAuthClick?.('signup')}
                className="px-5 py-2.5 text-[13px] font-black uppercase tracking-wider rounded-lg bg-orange-500 text-black border-[3px] border-black shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
              >
                Sign Up Free
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 rounded-lg bg-orange-500 border-[3px] border-black text-black shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <div className="w-6 h-5 relative flex flex-col justify-between">
            <span className={`w-full h-1 bg-black rounded-full transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-full h-1 bg-black rounded-full transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`w-full h-1 bg-black rounded-full transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 bg-white border-t border-[var(--border2)] ${mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        role="menu"
        aria-hidden={!mobileOpen}
      >
        <div className="px-6 py-4 flex flex-col gap-1">
          {navLinks.map(l => (
            <a
              key={l.label}
              href={l.href}
              role="menuitem"
              className="px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-[var(--off)]"
              style={{ color: 'var(--ink2)' }}
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </a>
          ))}

          {/* Mobile auth area */}
          <div className="pt-3 pb-1 flex flex-col gap-2" style={{ borderTop: '1px solid var(--border)' }}>
            {user ? (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 px-3 py-2">
                  <Link to={profile ? (profile.persona_data?.identities?.length > 0 ? `/p/${profile.secure_slug || profile.username || profile.id}` : '/dashboard?tab=profile') : '/dashboard'} onClick={() => setMobileOpen(false)} className="block shrink-0">
                    <Avatar src={profile?.avatar_url} name={firstName} size="w-9 h-9 ring-2 ring-orange-500 ring-offset-2" />
                  </Link>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{firstName}</div>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        background: status === 'paid' ? 'rgba(19,136,8,0.1)' : 'rgba(255,153,51,0.1)',
                        color: status === 'paid' ? '#138808' : '#E07A00',
                      }}
                    >
                      {status === 'paid' ? '✓ Paid' : 'Free'}
                    </span>
                  </div>
                </div>
                {isStaff && (
                  <a href="/admin" onClick={() => setMobileOpen(false)} className="btn-outline btn-base py-3 text-sm rounded-xl w-full text-center" style={{ color: 'var(--sf)', borderColor: 'var(--sf)' }}>
                    Admin Panel
                  </a>
                )}
                <a href="/dashboard" onClick={() => setMobileOpen(false)} className="btn-outline btn-base py-3 text-sm rounded-xl w-full text-center" style={{ color: 'var(--ink)', borderColor: 'var(--border)' }}>
                  Analytics Dashboard
                </a>
                <button onClick={() => { signOut(); setMobileOpen(false) }} className="btn-outline btn-base py-3 text-sm rounded-xl w-full text-center" style={{ color: '#dc2626', borderColor: '#fca5a5' }}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { onAuthClick?.('signin'); setMobileOpen(false) }} className="w-full py-4 bg-white text-black border-[3px] border-black rounded-lg font-black text-sm tracking-widest uppercase shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                  Sign In
                </button>
                <button onClick={() => { onAuthClick?.('signup'); setMobileOpen(false) }} className="w-full mt-4 py-4 bg-orange-500 text-black border-[3px] border-black rounded-lg font-black text-sm tracking-widest uppercase shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                  Sign Up Free ↗
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

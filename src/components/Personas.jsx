import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'

const personas = [
  {
    id: 'gamer', emoji: '🎮', name: 'Gamer',
    desc: 'Share your stream and discord with your squad instantly.', color: '#7C3AED', bg: '#F5F3FF',
    profile: {
      avatar: '🎮', name: 'Aryan "XSlayer" Singh', role: 'Pro Gamer · Streamer',
      bio: "Ranked #1 BGMI India 2024. Streaming daily on Twitch. Let's play!",
      links: [
        { icon: '🎮', label: 'Twitch', sub: 'xslayer_live' },
        { icon: '💬', label: 'Discord', sub: 'XSlayer#0001' },
        { icon: '🎯', label: 'Steam', sub: 'xslayer99' },
        { icon: '📺', label: 'YouTube', sub: '@xslayergaming' },
      ],
      stat1: { val: '47K', label: 'Followers' }, stat2: { val: '1.2K', label: 'Scans' },
      bg: '#1a0533', card: '#2d1052', accent: '#7C3AED',
    },
  },
  {
    id: 'developer', emoji: '💻', name: 'Developer',
    desc: 'The ultimate bridge between your code and your network.', color: '#0EA5E9', bg: '#F0F9FF',
    profile: {
      avatar: '💻', name: 'Priya Sharma', role: 'Full-Stack Dev · Open Source',
      bio: "Building in React & Go. 40+ repos. Hire me or collab — I'm open.",
      links: [
        { icon: '🐙', label: 'GitHub', sub: 'priyasharma-dev' },
        { icon: '💼', label: 'LinkedIn', sub: '/in/priyasharmadev' },
        { icon: '📝', label: 'Blog', sub: 'priya.dev' },
        { icon: '🐦', label: 'Twitter', sub: '@priyabuilds' },
      ],
      stat1: { val: '2.1K', label: 'GitHub Stars' }, stat2: { val: '890', label: 'Scans' },
      bg: '#0c1a2e', card: '#0f2540', accent: '#0EA5E9',
    },
  },
  {
    id: 'influencer', emoji: '📸', name: 'Influencer',
    desc: 'Turn every follower request into a real connection.', color: '#FF9933', bg: '#FFF7ED',
    profile: {
      avatar: '📸', name: 'Sneha Kapoor', role: 'Content Creator · Lifestyle',
      bio: 'Delhi-based creator. Collab enquiries welcome. 200K+ across platforms.',
      links: [
        { icon: '📷', label: 'Instagram', sub: '@snehakapoor.creates' },
        { icon: '🎵', label: 'TikTok', sub: '@snehakapoor' },
        { icon: '▶️', label: 'YouTube', sub: 'Sneha Kapoor' },
        { icon: '💌', label: 'Email', sub: 'collabs@sneha.in' },
      ],
      stat1: { val: '200K', label: 'Followers' }, stat2: { val: '3.4K', label: 'Scans' },
      bg: '#2a1200', card: '#3d1c00', accent: '#FF9933',
    },
  },
  {
    id: 'student', emoji: '🎓', name: 'Student',
    desc: 'Your campus identity, social links, and bio in one scan.', color: '#6366F1', bg: '#EEF2FF',
    profile: {
      avatar: '🎓', name: 'Karan Mehta', role: 'IIT Delhi · CS 2025',
      bio: "Interning @Google Summer. Building a fintech startup on the side. Open to connections.",
      links: [
        { icon: '💼', label: 'LinkedIn', sub: 'karan-mehta-iitd' },
        { icon: '🐙', label: 'GitHub', sub: 'karanmehta25' },
        { icon: '📚', label: 'Notion', sub: "karan's notes" },
        { icon: '🎵', label: 'Spotify', sub: 'karan.mehta' },
      ],
      stat1: { val: '9.2', label: 'CGPA' }, stat2: { val: '512', label: 'Scans' },
      bg: '#0d0b2e', card: '#16134a', accent: '#6366F1',
    },
  },
  {
    id: 'fitness', emoji: '💪', name: 'Fitness',
    desc: 'Connect with your community and track your progress live.', color: '#EF4444', bg: '#FFF1F1',
    profile: {
      avatar: '💪', name: 'Vikram "Beast" Nair', role: 'IFBB Athlete · PT Coach',
      bio: 'Training 6 days a week since 2018. Online coaching available. Discipline over motivation.',
      links: [
        { icon: '🏃', label: 'Strava', sub: 'vikrambeast' },
        { icon: '📷', label: 'Instagram', sub: '@vikram.beast' },
        { icon: '▶️', label: 'YouTube', sub: 'Beast Fitness' },
        { icon: '📞', label: 'Coaching', sub: 'Book a session' },
      ],
      stat1: { val: '84kg', label: 'Stage Weight' }, stat2: { val: '1.8K', label: 'Scans' },
      bg: '#1c0000', card: '#2e0000', accent: '#EF4444',
    },
  },
  {
    id: 'creator', emoji: '🎨', name: 'Creator',
    desc: 'The most effective way to share your portfolio in the real world.', color: '#F59E0B', bg: '#FFFBEB',
    profile: {
      avatar: '🎨', name: 'Nanda Kumar', role: 'Founder & Creator',
      bio: 'Founder of KnoWMi. Building the future of wearable identity. Join the movement and wear your story.',
      links: [
        { icon: '💼', label: 'LinkedIn', sub: 'nandakumar-k' },
        { icon: '🎨', label: 'Portfolio', sub: 'behance.net/nanda' },
        { icon: '💬', label: 'WhatsApp', sub: 'Get in touch' },
        { icon: '💌', label: 'Email', sub: 'support.knowmi@gmail.com' },
      ],
      stat1: { val: '1.5K', label: 'Members' }, stat2: { val: '4.2K', label: 'Scans' },
      bg: '#1a1000', card: '#2b1a00', accent: '#F59E0B',
    },
  },
]

function ProfileModal({ persona, onClose }) {
  const p = persona.profile
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      role="dialog" aria-modal="true" aria-label={`${persona.name} demo profile`}>
      <div className="relative w-full max-w-sm rounded-3xl overflow-hidden"
        style={{ background: p.bg, boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${p.accent}30`, animation: 'profilePop .3s cubic-bezier(.34,1.56,.64,1)' }}>

        {/* Close */}
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
          aria-label="Close">✕</button>

        <div className="h-1" style={{ background: `linear-gradient(90deg, ${p.accent}, ${p.accent}88)` }} />

        <div className="flex justify-center pt-4 pb-1">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
            style={{ background: `${p.accent}22`, color: p.accent, fontFamily: 'JetBrains Mono,monospace', border: `1px solid ${p.accent}40` }}>
            Demo Profile
          </span>
        </div>

        <div className="flex flex-col items-center px-6 pt-4 pb-3">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center overflow-hidden mb-3"
            style={{ background: `${p.accent}22`, border: `2px solid ${p.accent}44` }}>
            {p.avatar.startsWith('/') ? (
              <img src="/assets/placeholder-avatar.png" alt={p.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl">{p.avatar}</span>
            )}
          </div>
          <h3 className="font-bold text-lg leading-tight text-center" style={{ color: '#fff', fontFamily: 'Fraunces,serif' }}>{p.name}</h3>
          <p className="text-xs mt-1 text-center" style={{ color: p.accent, fontFamily: 'JetBrains Mono,monospace', letterSpacing: '0.05em' }}>{p.role}</p>
          <p className="text-sm text-center mt-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{p.bio}</p>
          <div className="flex gap-6 mt-4">
            <div className="text-center">
              <div className="font-bold text-lg" style={{ color: p.accent, fontFamily: 'Fraunces,serif' }}>{p.stat1.val}</div>
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono,monospace' }}>{p.stat1.label}</div>
            </div>
            <div className="w-px self-stretch" style={{ background: `${p.accent}30` }} />
            <div className="text-center">
              <div className="font-bold text-lg" style={{ color: p.accent, fontFamily: 'Fraunces,serif' }}>{p.stat2.val}</div>
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono,monospace' }}>{p.stat2.label}</div>
            </div>
          </div>
        </div>

        <div className="px-5 pb-2 flex flex-col gap-2">
          {p.links.map(l => (
            <div key={l.label} className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ background: p.card, border: `1px solid ${p.accent}18` }}>
              <span className="text-lg w-7 flex items-center justify-center flex-shrink-0">{l.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate" style={{ color: '#fff' }}>{l.label}</div>
                <div className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'JetBrains Mono,monospace' }}>{l.sub}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.6 }}>
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
          ))}
        </div>

        <div className="px-5 pt-3 pb-2 flex items-center justify-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${p.accent}22` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="9" height="9" rx="1.5" fill={p.accent} opacity="0.9"/>
              <rect x="13" y="2" width="9" height="9" rx="1.5" fill={p.accent} opacity="0.7"/>
              <rect x="2" y="13" width="9" height="9" rx="1.5" fill={p.accent} opacity="0.7"/>
              <rect x="13" y="13" width="9" height="9" rx="1.5" fill={p.accent} opacity="0.9"/>
            </svg>
          </div>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.38)', fontFamily: 'JetBrains Mono,monospace' }}>
            Opens when someone scans your QR tee
          </span>
        </div>

        <div className="px-5 pb-5 pt-2">
          <button onClick={onClose} className="w-full py-3 rounded-2xl text-sm font-bold text-white transition-all"
            style={{ background: `linear-gradient(135deg, ${p.accent}, ${p.accent}bb)`, boxShadow: `0 4px 16px ${p.accent}44`, fontFamily: 'DM Sans,sans-serif' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${p.accent}55` }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 16px ${p.accent}44` }}>
            Get Your Own Profile →
          </button>
        </div>

        <style>{`@keyframes profilePop{from{transform:scale(.9) translateY(16px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}`}</style>
      </div>
    </div>
  )
}

export default function Personas() {
  const ref = useReveal()
  const [active, setActive] = useState(null)

  return (
    <section id="personas" className="section-pad snap-section min-h-screen flex items-center" style={{ background: 'var(--off)' }} ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">
              The Collection
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-black text-black mb-6 tracking-tight leading-[1.05]">
            Choose Your <br />
            <span className="text-orange-500 italic">Identity.</span>
          </h2>
          <p className="text-lg text-neutral-400 font-medium max-w-xl mx-auto">
            Each tee is a gateway to a tailored digital experience, designed for your specific community.
          </p>
        </div>

        <div className="personas-grid reveal" role="list">
          {personas.map(p => (
            <div key={p.id} role="listitem" onClick={() => setActive(p)}
              className="persona-card"
              style={{ '--pc': p.color }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = `0 16px 40px ${p.color}22`
                e.currentTarget.style.borderColor = p.color
                e.currentTarget.querySelector('.pname').style.color = p.color
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.querySelector('.pname').style.color = 'var(--ink)'
              }}>
              <span className="persona-emoji" role="img" aria-label={p.name}>{p.emoji}</span>
              <div className="pname persona-name" style={{ color: 'var(--ink)' }}>{p.name}</div>
              <div className="persona-desc">{p.desc}</div>
              <div className="mt-3 text-[11px] font-semibold transition-colors" style={{ color: p.color }}>
                Tap to preview →
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 reveal">
          <p className="text-sm mb-4" style={{ color: 'var(--ink3)' }}>
            Not sure which fits you? You can always update your persona later — for free.
          </p>
          <a href="#pricing" className="btn-primary btn-base px-7 py-3.5 text-sm inline-flex items-center gap-2">
            Choose Your Persona →
          </a>
        </div>
      </div>

      {active && <ProfileModal persona={active} onClose={() => setActive(null)} />}

      <style>{`
        .personas-grid {
          display: grid;
          grid-template-columns: repeat(6,1fr);
          gap: 12px;
          margin-top: 56px;
        }
        .persona-card {
          border-radius: 16px;
          padding: 24px 16px;
          text-align: center;
          border: 1.5px solid var(--border);
          background: #fff;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .persona-emoji { font-size: 32px; margin-bottom: 12px; display: block; }
        .persona-name { font-family: 'Fraunces',serif; font-size: 14px; font-weight: 700; transition: color 0.2s; }
        .persona-desc { font-size: 11px; color: var(--ink4); margin-top: 4px; line-height: 1.4; }
        @media (max-width: 900px) { .personas-grid { grid-template-columns: repeat(3,1fr); } }
        @media (max-width: 480px) { .personas-grid { grid-template-columns: repeat(2,1fr); } }
      `}</style>
    </section>
  )
}

import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];

export default function HeroCard({ todayScans, isLive, weekSparkline }) {
  const { value: animatedScans, ref } = useCountUp(todayScans);
  const maxBar = Math.max(...weekSparkline, 0);

  const heroText = todayScans === 0
    ? 'Wear your tee and get your first scan today 👕'
    : `${todayScans.toLocaleString('en-IN')} strangers saw your vibe today`;

  return (
    <div ref={ref} className="vibe-card" style={{
      background: 'var(--surface)', 
      border: '1px solid var(--border2)',
      borderRadius: 24, 
      padding: '40px 24px',
      position: 'relative', 
      overflow: 'hidden',
      textAlign: 'center',
    }}>

      {isLive && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          background: 'linear-gradient(to right, #1dce96, #10b981)',
          padding: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          zIndex: 10, boxShadow: '0 4px 12px rgba(29, 206, 150, 0.2)',
          animation: 'vibeSlideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: 'white',
            animation: 'vibePulse 1s ease-in-out infinite',
          }} />
          <span style={{ 
            fontFamily: 'Syne, sans-serif', fontSize: 10, color: 'white', 
            fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' 
          }}>
            Active Pulse: Someone is viewing you right now!
          </span>
        </div>
      )}

      <p style={{
        fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13,
        letterSpacing: '0.18em', color: 'var(--muted)', textTransform: 'uppercase',
        marginBottom: 16,
        marginTop: isLive ? 24 : 0
      }}>
        People who discovered you today
      </p>

      <p style={{
        fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: 84,
        color: 'var(--text)', lineHeight: 1, marginBottom: 16,
        letterSpacing: '-0.02em'
      }}>
        {animatedScans.toLocaleString('en-IN')}
      </p>

      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 17, color: 'var(--muted)', marginBottom: 24, maxWidth: 320, margin: '0 auto 28px', lineHeight: 1.4 }}>
        <strong style={{ color: 'var(--text)' }}>{heroText}</strong>
      </p>



      {/* Connectivity Indicator */}
      <div style={{
        position: 'absolute', top: 16, right: 16,
        display: 'flex', alignItems: 'center', gap: 6,
        opacity: 0.5
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#1dce96', boxShadow: '0 0 8px #1dce96'
        }} />
        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Live Engine Active
        </span>
      </div>

      {/* Sparkline Container - constrained width to prevent stretching */}
      <div style={{ marginTop: 24, maxWidth: 320, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 50, justifyContent: 'center' }}>
          {weekSparkline.map((val, i) => {
            const pct = maxBar > 0 ? val / maxBar : 0;
            const isToday = i === 6;
            const isHigh = pct >= 0.6;
            const heightPx = Math.max(pct * 50, 4); // 4px minimum height
            return (
              <div key={i} style={{ width: 12, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                <div style={{
                  width: '100%',
                  height: `${heightPx}px`,
                  background: isToday ? '#1dce96' : (isHigh ? 'var(--teal-glow)' : 'var(--surface2)'),
                  borderRadius: 4,
                  transition: 'height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10, justifyContent: 'center' }}>
          {DAY_LABELS.map((label, i) => (
            <div key={i} style={{ width: 12, textAlign: 'center', fontSize: 9, color: 'var(--muted)', fontFamily: 'DM Sans, sans-serif', overflow: 'visible' }}>
              {label.charAt(0)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


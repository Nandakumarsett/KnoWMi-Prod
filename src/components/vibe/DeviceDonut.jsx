import React, { useEffect, useRef, useState } from 'react';

const C = 2 * Math.PI * 55; // 345.575

export default function DeviceDonut({ mobile = 0, desktop = 0, tablet = 0, topOS = 'Android', peakHour = 'afternoon' }) {
  const [animated, setAnimated] = useState({ mobile: 0, desktop: 0, tablet: 0 });

  useEffect(() => {
    const start = performance.now();
    const dur = 800;
    const targets = { mobile, desktop, tablet };
    const animate = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimated({
        mobile: targets.mobile * eased,
        desktop: targets.desktop * eased,
        tablet: targets.tablet * eased,
      });
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [mobile, desktop, tablet]);

  const total = animated.mobile + animated.desktop + animated.tablet || 1;
  const mPct = animated.mobile / total * 100;
  const dPct = animated.desktop / total * 100;
  const tPct = animated.tablet / total * 100;

  const mDash = (mPct / 100) * C;
  const dDash = (dPct / 100) * C;
  const tDash = (tPct / 100) * C;

  const segments = [
    { dash: mDash, offset: 0, color: '#1dce96' },
    { dash: dDash, offset: -mDash, color: '#a78bfa' },
    { dash: tDash, offset: -(mDash + dDash), color: '#f5a623' },
  ];

  const dominant = mobile >= desktop && mobile >= tablet
    ? { pct: Math.round(mobile), label: 'mobile' }
    : desktop >= tablet
    ? { pct: Math.round(desktop), label: 'desktop' }
    : { pct: Math.round(tablet), label: 'tablet' };

  return (
    <div className="vibe-card" style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--r)', padding: '20px 18px', height: '100%',
      display: 'flex', flexDirection: 'column',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .vibe-donut-text-main { fill: #111111 !important; }
        .dark .vibe-donut-text-main, .vibe-page.dark .vibe-donut-text-main { fill: #ffffff !important; }
        .vibe-donut-text-sub { fill: #6b7280 !important; }
        .dark .vibe-donut-text-sub, .vibe-page.dark .vibe-donut-text-sub { fill: #9ca3af !important; }
      ` }} />

      <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 14 }}>
        Device breakdown
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {/* Donut SVG */}
        <svg width={150} height={150} style={{ flexShrink: 0 }}>
          {/* Track */}
          <circle cx={75} cy={75} r={55} fill="none" stroke="#ffffff08" strokeWidth={16} />
          {/* Segments */}
          {segments.map((seg, i) => (
            <circle key={i} cx={75} cy={75} r={55} fill="none"
              stroke={seg.color} strokeWidth={16}
              strokeDasharray={`${seg.dash} ${C}`}
              strokeDashoffset={seg.offset}
              transform="rotate(-90 75 75)"
              strokeLinecap="butt"
            />
          ))}
          <text x={75} y={72} textAnchor="middle" className="vibe-donut-text-main"
            style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20 }}>
            {Math.round(mPct)}%
          </text>
          <text x={75} y={88} textAnchor="middle" className="vibe-donut-text-sub"
            style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
            {dominant.label}
          </text>
        </svg>

        {/* Legend */}
        <div style={{ width: '100%', marginTop: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', gap: 12, marginBottom: 12 }}>
            {[
              { emoji: '📱', label: 'Mobile', pct: Math.round(mobile), color: 'var(--teal)' },
              { emoji: '💻', label: 'Desktop', pct: Math.round(desktop), color: 'var(--purple)' },
              { emoji: '📟', label: 'Tablet', pct: Math.round(tablet), color: 'var(--amber)' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 14 }}>{item.emoji}</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--muted)' }}>{item.label}</span>
                </div>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: item.color }}>{item.pct}%</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--muted)', lineHeight: 1.5, textAlign: 'center' }}>
              Most scans happen on <strong style={{ color: 'var(--text)' }}>{topOS}</strong> — between <strong style={{ color: 'var(--text)' }}>{peakHour}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

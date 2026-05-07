import React, { useEffect, useRef, useState } from 'react';

export default function CityCard({ topCities = [], totalCities = 0 }) {
  const [animated, setAnimated] = useState(topCities.map(() => 0));

  useEffect(() => {
    const start = performance.now();
    const dur = 700;
    const animate = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimated(topCities.map(c => c.barPct * eased));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [topCities]);

  return (
    <div className="vibe-card" style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--r)', padding: '20px 18px', height: '100%',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
          Scan locations
        </span>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--muted)' }}>
          {totalCities} {totalCities === 1 ? 'city' : 'cities'}
        </span>
      </div>

      {/* Map placeholder */}
      <div style={{
        background: 'var(--surface2)', borderRadius: 12, height: 120,
        border: '1px solid var(--border)', position: 'relative', overflow: 'hidden', marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyItems: 'center',
      }}>
        {/* Abstract Dotted Map Background */}
        <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.4 }}>
          <pattern id="dots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle fill="var(--muted)" cx="4" cy="4" r="1.5" opacity="0.5"></circle>
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)"></rect>
        </svg>

        {/* Global Shimmer Overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
          animation: 'shimmer 3s infinite linear',
          transform: 'skewX(-20deg)'
        }} />

        {/* Ping dots */}
        {[
          { size: 14, bg: '#10B981', left: '72%', top: '58%', delay: '0s', glow: 'rgba(16,185,129,0.4)' },
          { size: 10, bg: '#8B5CF6', left: '52%', top: '45%', delay: '0.6s', glow: 'rgba(139,92,246,0.4)' },
          { size: 8,  bg: '#F59E0B', left: '65%', top: '55%', delay: '1.1s', glow: 'rgba(245,158,11,0.4)' },
        ].map((dot, i) => (
          <div key={i} style={{
            position: 'absolute', left: dot.left, top: dot.top,
            width: dot.size, height: dot.size,
            borderRadius: '50%', background: dot.bg,
            boxShadow: `0 0 15px ${dot.glow}`,
            animation: `vibePing 2.5s ease-out ${dot.delay} infinite`,
          }}>
             <div style={{
               position: 'absolute', inset: 0, borderRadius: '50%', border: `1px solid ${dot.bg}`,
               animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
             }} />
          </div>
        ))}
        
        <div style={{
          position: 'absolute', bottom: 8, right: 12,
          padding: '4px 8px', background: 'var(--surface)',
          borderRadius: 8, border: '1px solid var(--border)',
          fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'var(--text)', fontWeight: 600,
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: 4
        }}>
          <div className="live-dot" style={{ width: 6, height: 6 }} /> Live Global Feed
        </div>
      </div>

      {/* City list */}
      {topCities.length === 0 ? (
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--muted)', textAlign: 'center', padding: '12px 0' }}>
          🌍 No scans yet — your first could come from anywhere
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topCities.map((city, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16 }}>{city.flag}</span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--text)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {city.city}
              </span>
              <div style={{ width: 80, height: 4, borderRadius: 2, background: 'var(--surface2)', flexShrink: 0 }}>
                <div style={{
                  height: '100%', borderRadius: 2, background: 'var(--teal)',
                  width: `${animated[i] || 0}%`, transition: 'none',
                }} />
              </div>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--muted)', minWidth: 28, textAlign: 'right' }}>
                {city.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

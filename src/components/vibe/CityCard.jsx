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
    <div style={{
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
        background: 'var(--surface2)', borderRadius: 10, height: 110,
        border: '1px solid var(--border)', position: 'relative', overflow: 'hidden', marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Ping dots */}
        {[
          { size: 14, bg: '#1dce9660', left: '72%', top: '58%', delay: '0s' },
          { size: 10, bg: '#a78bfa60', left: '52%', top: '45%', delay: '0.6s' },
          { size: 8,  bg: '#f5a62360', left: '65%', top: '55%', delay: '1.1s' },
        ].map((dot, i) => (
          <div key={i} style={{
            position: 'absolute', left: dot.left, top: dot.top,
            width: dot.size, height: dot.size,
            borderRadius: '50%', background: dot.bg,
            animation: `vibePing 2s ease-out ${dot.delay} infinite`,
          }} />
        ))}
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--muted)', position: 'relative', zIndex: 1 }}>
          🌏 Scan locations
        </span>
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

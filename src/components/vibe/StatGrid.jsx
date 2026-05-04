import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';

function StatCard({ emoji, value, label, sublabel, delta, color, suffix = '' }) {
  const { value: animated, ref } = useCountUp(typeof value === 'number' ? value : 0);
  const isUp = delta && delta.startsWith('↑');
  const isDown = delta && delta.startsWith('↓');

  return (
    <div ref={ref} style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--r)', padding: '18px 16px',
      transition: 'border-color .2s, transform .2s',
      cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ fontSize: 18, marginBottom: 10 }}>{emoji}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 28, letterSpacing: '-1px', color }}>
        {animated.toLocaleString('en-IN')}{suffix}
      </div>
      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{label}</div>
      {sublabel && (
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'var(--muted)', marginTop: 2, opacity: 0.7 }}>{sublabel}</div>
      )}
      {delta && delta !== '—' && (
        <div style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 500, marginTop: 6,
          color: isUp ? 'var(--teal)' : isDown ? 'var(--coral)' : 'var(--muted)',
        }}>
          {delta}
        </div>
      )}
    </div>
  );
}

export default function StatGrid({ totalViews, tshirtScans, profileQRScans, uniqueViews }) {
  return (
    <div style={{
      display: 'grid', 
      gridTemplateColumns: 'repeat(2, 1fr)', 
      gap: 12,
      width: '100%'
    }}>
      <StatCard emoji="👁️" value={totalViews} label="Total Views" sublabel="QR + Share links" delta={null} color="var(--teal)" />
      <StatCard emoji="👕" value={tshirtScans} label="QR T-shirt Scans" sublabel="From your tee only" delta={null} color="var(--amber)" />
      <StatCard emoji="📱" value={profileQRScans} label="Profile QR Scans" sublabel="Website related QR scans" delta={null} color="var(--purple)" />
      <StatCard emoji="🫂" value={uniqueViews} label="Unique Visitors" sublabel="Across all sources" delta={null} color="var(--teal)" />
    </div>
  );
}

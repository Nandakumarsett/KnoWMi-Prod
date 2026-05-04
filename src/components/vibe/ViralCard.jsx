import React, { useState } from 'react';

export default function ViralCard({ bestMoment }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (!bestMoment) return;
    const text = `I was scanned ${bestMoment.maxScansInDay} times in a single day on KnoWMi 🔥\nScan my QR to see my profile → knowmi.in`;
    if (navigator.share) {
      navigator.share({ title: 'My KnoWMi milestone', text });
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r)', padding: '20px 18px', height: '100%',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Glow orb */}
      <div style={{
        position: 'absolute', top: -40, right: -40, width: 150, height: 150,
        background: 'radial-gradient(circle, var(--coral-dim), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative' }}>
        {bestMoment ? (
          <>
            <p style={{
              fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: 11,
              letterSpacing: '0.1em', color: 'var(--coral)', textTransform: 'uppercase', marginBottom: 8,
            }}>
              🏆 All-time record
            </p>
            <h3 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18,
              color: 'var(--text)', lineHeight: 1.3, marginBottom: 8,
            }}>
              You were scanned <span style={{ color: 'var(--coral)' }}>{bestMoment.maxScansInDay.toLocaleString('en-IN')}</span> times in a single day
            </h3>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>
              On <strong style={{ color: 'var(--amber)' }}>{bestMoment.bestDate}</strong> — probably that event you went to 👀
            </p>
            <div style={{ flexGrow: 1 }} />
            <button
              onClick={handleShare}
              style={{
                background: 'var(--coral-dim)', border: '1px solid var(--coral-glow)',
                borderRadius: 20, padding: '7px 14px', marginTop: 'auto',
                fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 500,
                color: 'var(--coral)', cursor: 'pointer', transition: 'background .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--coral-glow)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--coral-dim)'}
            >
              {copied ? '✅ Copied!' : '🔥 Share this milestone'}
            </button>
          </>
        ) : (
          <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 16, color: 'var(--muted)', lineHeight: 1.5 }}>
            🌱 Your best moment is being written. Keep wearing it.
          </p>
        )}
      </div>
    </div>
  );
}

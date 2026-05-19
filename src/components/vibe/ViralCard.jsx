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
    <div className="vibe-card" style={{
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

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', flexGrow: 1 }}>
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

            {bestMoment.viewers && Array.isArray(bestMoment.viewers) && bestMoment.viewers.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {bestMoment.viewers.map((viewer, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: 'transparent',
                    border: '1px dashed var(--border)',
                    borderRadius: 16,
                    padding: '10px 12px',
                  }}>
                    {viewer.avatar ? (
                      <img 
                        src={viewer.avatar} 
                        alt={viewer.name} 
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid var(--coral-glow)',
                        }}
                      />
                    ) : (
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'var(--coral-dim)',
                        border: '1px solid var(--coral-glow)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--coral)',
                        fontWeight: 'bold',
                        fontSize: 14,
                        fontFamily: 'Syne, sans-serif'
                      }}>
                        👤
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <span style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'var(--text)',
                        lineHeight: 1.2
                      }}>
                        {viewer.name}
                      </span>
                      <span style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: 10,
                        color: 'var(--muted)',
                      }}>
                        Scanned on {new Date(viewer.viewedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at {new Date(viewer.viewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ flexGrow: 1 }} />
            <button
              onClick={handleShare}
              style={{
                background: 'var(--coral-dim)', border: '1px solid var(--coral-glow)',
                borderRadius: 20, padding: '7px 14px', marginTop: 'auto',
                fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 500,
                color: 'var(--coral)', cursor: 'pointer', transition: 'background .2s',
                alignSelf: 'flex-start'
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

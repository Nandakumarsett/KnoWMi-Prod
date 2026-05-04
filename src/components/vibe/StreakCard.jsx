import React from 'react';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function StreakCard({ current, currentStreak, best, status, weekDots, message }) {
  const finalStreak = typeof current === 'number' ? current : (typeof currentStreak === 'number' ? currentStreak : 0);
  const dots = weekDots && weekDots.length === 7 ? weekDots : Array.from({ length: 7 }, (_, i) => i >= 7 - finalStreak);

  let dynamicMessage = message;
  if (!dynamicMessage) {
    if (finalStreak === 0) {
      dynamicMessage = "Start scanning today to build your fresh new streak!";
    } else if (finalStreak === 1) {
      dynamicMessage = "You started your streak today! Keep going tomorrow!";
    } else {
      dynamicMessage = `Great job! You've sustained your activity for ${finalStreak} days in a row!`;
    }
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r)', 
      padding: '22px 20px', 
      height: '100%',
      position: 'relative', 
      overflow: 'hidden',
      display: 'flex', 
      flexDirection: 'column',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
      transition: 'border-color .2s, transform .2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Background Gradient Accent */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at top left, var(--purple-dim), transparent 60%)',
        pointerEvents: 'none',
        opacity: 0.6,
      }} />

      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Top Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Activity Record
            </span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--muted)' }}>
              Maintain consistency
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 36, color: 'var(--purple)', lineHeight: 1 }}>
              {finalStreak}
            </span>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: 11, color: 'var(--muted)' }}>
              days
            </span>
          </div>
        </div>

        {/* Calendar visual row of days */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {DAY_LABELS.map((day, i) => {
            const isToday = i === 6;
            const isActive = dots[i];
            let bg, color, border, fontWeight;
            
            if (isToday) { 
              bg = 'var(--purple)'; 
              color = '#fff'; 
              border = 'none'; 
              fontWeight = 600;
            } else if (isActive) { 
              bg = 'var(--purple-dim)'; 
              color = 'var(--purple)'; 
              border = '1px solid var(--purple-dim)'; 
              fontWeight = 600;
            } else { 
              bg = 'var(--surface2)'; 
              color = 'var(--muted)'; 
              border = '1px solid transparent'; 
              fontWeight = 400;
            }

            return (
              <div key={i} style={{
                borderRadius: '8px', 
                border,
                background: bg, 
                color, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                flex: 1,
                padding: '8px 0',
                transition: 'all 0.3s ease',
              }}>
                <span style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: fontWeight, 
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em'
                }}>
                  {day}
                </span>
                {isActive ? (
                  <span style={{ fontSize: 11, marginTop: 2 }}>🔥</span>
                ) : (
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--muted)', opacity: 0.3, marginTop: 6 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Motivational message/status at bottom */}
        <div style={{ 
          background: 'var(--surface2)',
          borderRadius: '10px',
          padding: '10px 14px',
          borderLeft: '3px solid var(--purple)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginTop: 'auto',
        }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>🔥</span>
          <p style={{ 
            fontFamily: 'DM Sans, sans-serif', 
            fontSize: 11.5, 
            color: 'var(--text)', 
            lineHeight: 1.4, 
            margin: 0,
            fontWeight: 500
          }}>
            {dynamicMessage}
          </p>
        </div>
      </div>
    </div>
  );
}

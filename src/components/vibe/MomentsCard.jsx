import React from 'react';

const COLOR_MAP = {
  teal:   { bg: 'var(--teal-dim)',   text: 'var(--teal)' },
  amber:  { bg: 'var(--amber-dim)',  text: 'var(--amber)' },
  coral:  { bg: 'var(--coral-dim)',  text: 'var(--coral)' },
  purple: { bg: 'var(--purple-dim)', text: 'var(--purple)' },
};

function MomentItem({ emoji, title, subtitle, value, glowColor, isLast }) {
  const colors = COLOR_MAP[glowColor] || COLOR_MAP.amber;
  return (
    <div style={{
      padding: '13px 18px',
      borderBottom: isLast ? 'none' : '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 12,
      transition: 'background .15s',
      cursor: 'default',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ fontSize: 20, flexShrink: 0 }}>{emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500, fontSize: 13, color: 'var(--text)', display: 'block' }}>{title}</span>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--muted)' }}>{subtitle}</span>
      </div>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: colors.bg, color: colors.text,
        fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {value}
      </div>
      <div style={{ flexGrow: 1 }} />
    </div>
  );
}

export default function MomentsCard({ moments }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--r)', overflow: 'hidden', height: '100%',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: '16px 18px 12px', borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
          Today's highlights
        </span>
        <span style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 500,
          padding: '3px 9px', borderRadius: 20,
          background: 'var(--amber-dim)', color: 'var(--amber)',
        }}>
          Live
        </span>
      </div>

      {(moments || []).map((m, i) => (
        <MomentItem
          key={i}
          emoji={m.emoji}
          title={m.title}
          subtitle={m.subtitle}
          value={m.value}
          glowColor={m.glowColor}
          isLast={i === moments.length - 1}
        />
      ))}
    </div>
  );
}

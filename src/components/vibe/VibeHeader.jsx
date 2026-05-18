import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function VibeHeader({ displayName, avatarUrl, profileSlug }) {
  const navigate = useNavigate();
  const initials = displayName ? displayName.charAt(0).toUpperCase() : '?';

  return (
    <div style={{
      padding: '28px 20px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px', color: 'var(--text)' }}>
        Kno<span style={{ color: 'var(--saffron)' }}>WM</span>i
      </span>

      <div 
        onClick={() => profileSlug && navigate(`/p/${profileSlug}`)}
        style={{
          width: 38, height: 38, borderRadius: '50%', overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--teal), var(--purple))',
          border: '2px solid var(--border2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          cursor: 'pointer'
        }}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: '#fff' }}>{initials}</span>
        )}
      </div>
    </div>
  );
}

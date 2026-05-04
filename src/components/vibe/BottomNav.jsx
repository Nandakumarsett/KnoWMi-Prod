import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { emoji: '📊', label: 'Stats',    path: '/dashboard/vibe' },
  { emoji: '🌍', label: 'Map',      path: '/dashboard/vibe/map' },
  { emoji: '👤', label: 'Profile',  path: null }, // dynamic
  { emoji: '⚙️', label: 'Settings', path: '/dashboard/settings' },
];

export default function BottomNav({ active = 'stats', username }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 420,
      background: '#0d0d14cc', backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border2)',
      padding: '10px 0 18px',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      zIndex: 100,
    }}>
      {NAV_ITEMS.map((item) => {
        const path = item.label === 'Profile' ? `/p/${username}` : item.path;
        const isActive = location.pathname === path || (item.label === 'Stats' && location.pathname === '/dashboard/vibe');
        return (
          <button
            key={item.label}
            onClick={() => path && navigate(path)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              color: isActive ? 'var(--teal)' : 'var(--muted)',
              fontFamily: 'DM Sans, sans-serif', fontSize: 10,
              transition: 'color .2s',
              padding: '4px 12px',
            }}
          >
            <span style={{ fontSize: 20 }}>{item.emoji}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

import React, { useState } from 'react';
import { getAssetUrl } from '../lib/supabase';

const deterministicColor = (name) => {
  const colors = ['#3B82F6', '#8B5CF6', '#14B8A6', '#F97316', '#EC4899']; // Blue, Purple, Teal, Orange, Pink
  let hash = 0;
  const safeName = name || 'User';
  for (let i = 0; i < safeName.length; i++) hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export default function Avatar({ src, name, username, size = "md", className = "" }) {
  const [imgError, setImgError] = useState(false);
  
  const dimensions = {
    sm: "w-8 h-8 text-[10px]",
    md: "w-12 h-12 text-lg",
    lg: "w-24 h-24 text-4xl",
    xl: "w-32 h-32 text-5xl",
    preview: "w-40 h-40 text-6xl"
  }[size] || size; // Allow custom tailwind classes too

  const initial = (name || username || 'U').charAt(0).toUpperCase();
  const assetSrc = getAssetUrl(src);

  if (assetSrc && assetSrc.trim() !== "" && !imgError) {
    return (
      <div className={`${dimensions} rounded-full border-2 border-white shadow-sm overflow-hidden bg-neutral-100 ${className}`}>
        <img
          src={assetSrc}
          alt={name || username || 'User'}
          onError={() => setImgError(true)}
          onContextMenu={(e) => e.preventDefault()}
          className="w-full h-full object-cover object-center select-none pointer-events-none"
          draggable="false"
        />
      </div>
    );
  }

  return (
    <div 
      style={{ backgroundColor: deterministicColor(username || name) }}
      className={`${dimensions} rounded-full flex items-center justify-center font-black text-white border-2 border-white shadow-sm uppercase ${className}`}
    >
      {initial}
    </div>
  );
}

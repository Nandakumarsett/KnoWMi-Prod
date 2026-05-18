import React, { useState } from 'react'
import { getAssetUrl } from '../../../lib/supabase'

interface ProfileAvatarProps {
  src: string | null | undefined
  name: string
  size?: number           // px size of the avatar
  shape?: 'circle' | 'hexagon' | 'rounded'
  accentColor?: string    // gradient/border accent
  className?: string
}

/** Deterministic color from name so initials always have a consistent bg */
function nameToColor(name: string): string {
  const palette = ['#3fb950', '#79c0ff', '#F97316', '#E84393', '#8B5CF6', '#14B8A6']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
}

const HEX_CLIP = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'

export function ProfileAvatar({
  src,
  name,
  size = 128,
  shape = 'circle',
  accentColor,
  className = ''
}: ProfileAvatarProps) {
  const [imgError, setImgError] = useState(false)
  const initial = (name || 'U').charAt(0).toUpperCase()
  const fallbackColor = nameToColor(name || 'User')
  
  // Mask the image source to prevent Supabase leak
  const assetSrc = getAssetUrl(src)
  const hasImage = assetSrc && assetSrc.trim() !== '' && !imgError

  const borderStyle = accentColor
    ? { background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`, padding: '2.5px' }
    : { background: 'transparent', padding: '0px' }

  const clipStyle = shape === 'hexagon' ? { clipPath: HEX_CLIP } : {}

  const wrapperStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    flexShrink: 0,
    ...(accentColor ? borderStyle : {}),
    ...(shape === 'hexagon' ? clipStyle : {}),
  }

  const innerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    ...(shape === 'hexagon' ? clipStyle : {}),
    ...(shape === 'rounded' ? { borderRadius: '24px' } : shape === 'circle' ? { borderRadius: '9999px' } : {}),
  }

  const outerRadius =
    shape === 'circle' ? 'rounded-full' :
    shape === 'rounded' ? 'rounded-3xl' : ''

  return (
    <div
      style={accentColor ? wrapperStyle : { width: `${size}px`, height: `${size}px`, flexShrink: 0, ...(shape === 'hexagon' ? clipStyle : {}) }}
      className={`${outerRadius} ${className} overflow-hidden`}
    >
      <div style={innerStyle}>
        {hasImage ? (
          <img
            src={assetSrc}
            alt={name}
            onContextMenu={(e) => e.preventDefault()}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center select-none pointer-events-none bg-neutral-100"
            draggable="false"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center font-black text-white"
            style={{ background: fallbackColor, fontSize: `${size * 0.35}px` }}
          >
            {initial}
          </div>
        )}
      </div>
    </div>
  )
}

import React, { useState } from 'react'

interface URLInputProps {
  value: string
  onChange: (url: string) => void
  placeholder?: string
  platform?: string
  onMetaFetched?: (meta: any) => void
}

export function URLInput({ value = '', onChange, placeholder = 'https://...', platform, onMetaFetched }: URLInputProps) {
  const [preview, setPreview] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleBlur = async () => {
    if (!value || !value.startsWith('http')) return
    
    setLoading(true)

    // 1. Check if it's GitHub
    if (value.includes('github.com/')) {
      const match = value.match(/github\.com\/([^/]+)\/([^/]+)/)
      if (match) {
        const [, owner, repo] = match
        try {
          const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
          if (res.ok) {
            const r = await res.json()
            const meta = {
              title: r.name,
              description: r.description,
              stars: r.stargazers_count,
              language: r.language
            }
            setPreview(meta)
            onMetaFetched?.(meta)
          }
        } catch (err) {
          console.error(err)
        }
      }
    } 
    // 2. Check if it's YouTube
    else if (value.includes('youtube.com/watch') || value.includes('youtu.be/')) {
      let id = ''
      if (value.includes('v=')) {
        id = value.split('v=')[1]?.split('&')[0] || ''
      } else if (value.includes('youtu.be/')) {
        id = value.split('youtu.be/')[1]?.split('?')[0] || ''
      }
      if (id) {
        const meta = {
          title: 'YouTube Video',
          thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
        }
        setPreview(meta)
        onMetaFetched?.(meta)
      }
    } 
    // 3. Simple fallback
    else {
      setPreview({ title: value.replace('https://', '').replace('www.', '').split('/')[0] })
    }
    
    setLoading(false)
  }

  return (
    <div className="space-y-2 w-full">
      <input
        type="url"
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
      />
      {loading && <p className="text-[10px] font-bold text-orange-400 animate-pulse uppercase tracking-wider">Fetching preview...</p>}
      {preview && (
        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
          {preview.thumbnail && (
            <img src={preview.thumbnail} alt="Preview" className="w-16 h-12 object-cover rounded-xl" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black truncate text-white">{preview.title || 'Link Preview'}</p>
            {preview.description && (
              <p className="text-[10px] text-white/50 truncate max-w-[280px]">{preview.description}</p>
            )}
            {preview.stars !== undefined && (
              <p className="text-[10px] font-bold text-[#E3B341]">★ {preview.stars} stars</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

import React, { useState } from 'react'

const EMOJI_SETS: Record<string, string[]> = {
  trophies: ['🏆', '🥇', '🥈', '🥉', '🎖️', '🏅', '🎗️', '⭐', '🌟', '💫'],
  sports:   ['⚽', '🏀', '🎮', '🎯', '🏋️', '🤸', '🏃', '🧘', '🚴', '🏊'],
  tech:     ['💻', '🚀', '⚡', '🔥', '💡', '🛠️', '📱', '🤖', '🧠', '🌐'],
  vibes:    ['😊', '🤔', '🔥', '💪', '✨', '🎵', '📚', '☕', '🎨', '🌈'],
  symbols:  ['✓', '★', '♦', '◆', '→', '↗', '⬡', '◉', '▶', '⚡']
}

interface EmojiPickerProps {
  value: string
  onChange: (emoji: string) => void
}

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-11 h-11 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-lg hover:bg-white/10 transition-colors"
      >
        {value || '🏆'}
      </button>

      {open && (
        <div className="absolute top-12 left-0 z-[100] bg-[#161b22] border border-white/10 rounded-2xl p-3 shadow-2xl w-[220px]">
          <div className="grid grid-cols-5 gap-1 max-h-[180px] overflow-y-auto">
            {Object.values(EMOJI_SETS).flat().map(emoji => (
              <button
                type="button"
                key={emoji}
                onClick={() => {
                  onChange(emoji)
                  setOpen(false)
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-base ${
                  emoji === value ? 'bg-white/20' : ''
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full mt-2 text-[10px] font-black uppercase text-center py-1 opacity-50 hover:opacity-100"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}

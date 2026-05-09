import React, { useState } from 'react'
import { X } from 'lucide-react'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  placeholder?: string
}

export function TagInput({ value = [], onChange, suggestions = [], placeholder = 'Press enter to add' }: TagInputProps) {
  const [input, setInput] = useState('')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = input.trim().replace(',', '')
      if (tag && !value.includes(tag)) {
        const newTags = [...value, tag]
        onChange(newTags)
      }
      setInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(t => t !== tagToRemove))
  }

  const addSuggestion = (tag: string) => {
    if (!value.includes(tag)) {
      onChange([...value, tag])
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2.5 rounded-2xl bg-white/5 border border-white/10 min-h-[48px] items-center">
        {value.map(tag => (
          <span 
            key={tag} 
            className="flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider"
          >
            {tag}
            <button onClick={() => removeTag(tag)} className="hover:text-red-500">
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent border-0 outline-none p-1 text-xs text-white"
        />
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {suggestions.map(s => {
            const has = value.includes(s)
            return (
              <button
                type="button"
                key={s}
                onClick={() => addSuggestion(s)}
                disabled={has}
                className={`text-[10px] px-2 py-1 rounded-full border transition-all ${
                  has ? 'bg-white/5 border-white/5 opacity-30 cursor-default' : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                + {s}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

import React, { useState } from 'react'
import { X, Plus } from 'lucide-react'

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
      <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-[#0a0a0a] border border-neutral-700 min-h-[44px] items-center">
        {value.map(tag => (
          <span 
            key={tag} 
            className="flex items-center gap-1 px-2.5 py-1 bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold"
          >
            {tag}
            <button onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors">
              <X size={12} />
            </button>
          </span>
        ))}
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent border-0 outline-none p-1 text-xs text-white font-medium placeholder:text-neutral-500"
          />
          {input.trim() && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                const tag = input.trim();
                if (tag && !value.includes(tag)) {
                  onChange([...value, tag]);
                  setInput('');
                }
              }}
              className="p-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all flex items-center justify-center shrink-0"
            >
              <Plus size={14} />
            </button>
          )}
        </div>
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {suggestions.map(s => {
            const has = value.includes(s)
            return (
              <button
                type="button"
                key={s}
                onClick={() => addSuggestion(s)}
                disabled={has}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                  has ? 'bg-neutral-900 border-neutral-800 text-neutral-600 cursor-default' : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-orange-500 hover:text-orange-400'
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

import React from 'react'
import { CompletionSection } from '../../types/identity'

interface CompletionRingProps {
  score: number
  incomplete: CompletionSection[]
  grade: 'starter' | 'building' | 'strong' | 'elite'
  onFillClick?: (anchor: string) => void
}

export function CompletionRing({ score, incomplete, grade, onFillClick }: CompletionRingProps) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const color = score >= 71 ? '#22c55e' : score >= 41 ? '#eab308' : '#ef4444'

  return (
    <div className="p-6 bg-white border border-[#E5D5C4] rounded-[12px] flex flex-col items-center shadow-sm text-white">
      <div className="relative flex items-center justify-center w-36 h-36 mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-[#E5D5C4]/30"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">{score}%</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-[#8C8276]">Profile Power</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-[#FDF6EC] border border-[#E5D5C4] rounded-full text-[#C1440E]">
          Grade: {grade}
        </span>
      </div>

      {incomplete.length > 0 && (
        <div className="w-full space-y-2 border-t border-[#E5D5C4] pt-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#5C5246] mb-2">Fill to boost power:</p>
          {incomplete.slice(0, 3).map(section => (
            <button
              type="button"
              key={section.id}
              onClick={() => onFillClick?.(section.anchor)}
              className="w-full flex justify-between items-center text-left py-2.5 px-3 rounded-[8px] hover:bg-[#FDF6EC] transition-all group"
            >
              <div>
                <span className="block text-xs font-bold text-white group-hover:text-[#C1440E] transition-colors">
                  {section.label}
                </span>
                <span className="text-[10px] font-black uppercase text-[#8C8276]">+{section.points} pts</span>
              </div>
              <span className="text-xs text-[#C1440E] opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">
                →
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

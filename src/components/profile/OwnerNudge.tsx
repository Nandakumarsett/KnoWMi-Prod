import React from 'react'

interface OwnerNudgeProps {
  section: string
  persona: string
  message: string
  cta: string
  anchor: string
}

export function OwnerNudge({ section, persona, message, cta, anchor }: OwnerNudgeProps) {
  return (
    <a 
      href={`/dashboard/identity?persona=${persona}#${anchor}`} 
      className="block border-2 border-dashed border-orange-500/30 rounded-2xl p-4 bg-orange-500/5 hover:bg-orange-500/10 transition-colors text-left text-decoration-none group mt-3"
    >
      <p className="text-xs font-bold text-orange-400 group-hover:text-orange-300 transition-colors">
        {message}
      </p>
      <p className="text-[10px] font-black uppercase tracking-widest text-orange-400/80 mt-1">
        {cta} →
      </p>
    </a>
  )
}

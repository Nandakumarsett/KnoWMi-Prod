import React from 'react'

export function SectionLabel({ children }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-black uppercase tracking-widest text-orange-600 mb-6">
      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
      {children}
    </div>
  )
}

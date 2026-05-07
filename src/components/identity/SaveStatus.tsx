import React from 'react'
import { Check, Loader2 } from 'lucide-react'

interface SaveStatusProps {
  status: 'idle' | 'saving' | 'saved' | 'error'
}

export function SaveStatus({ status }: SaveStatusProps) {
  if (status === 'idle') return null

  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-widest transition-opacity duration-300">
      {status === 'saving' && (
        <span className="text-orange-500 flex items-center gap-1 animate-pulse">
          <Loader2 size={12} className="animate-spin" /> Saving...
        </span>
      )}
      {status === 'saved' && (
        <span className="text-[#3fb950] flex items-center gap-1">
          <Check size={12} /> Saved
        </span>
      )}
      {status === 'error' && (
        <span className="text-red-500">
          Error — try again
        </span>
      )}
    </span>
  )
}

import React from 'react'
import { Sparkles } from 'lucide-react'

export function EmptyState({ 
  icon: Icon = Sparkles, 
  title = "No data yet", 
  message = "Start sharing your QR to see your pulse grow.",
  actionText,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-neutral-50/50 rounded-[3rem] border-2 border-dashed border-neutral-100">
      <div className="w-20 h-20 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-orange-500 mb-8 border border-neutral-100">
        <Icon size={32} />
      </div>
      <h3 className="text-2xl font-black text-neutral-900 mb-3 tracking-tight">{title}</h3>
      <p className="text-sm font-medium text-neutral-400 max-w-[280px] mb-10 leading-relaxed">{message}</p>
      {actionText && (
        <button 
          onClick={onAction}
          className="px-10 py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

import { Plus } from 'lucide-react'

interface EmptyStateProps {
  label: string
  isOwner?: boolean
  personaColor?: string
}

export function EmptyState({ label, isOwner, personaColor = '#F97316' }: EmptyStateProps) {
  return (
    <div className="w-full py-12 px-6 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center">
      <div 
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 opacity-20"
        style={{ background: personaColor }}
      >
        <Plus size={24} className="text-white" />
      </div>
      <p className="text-sm font-bold opacity-40 uppercase tracking-widest">{label}</p>
      {isOwner && (
        <button 
          className="mt-4 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
          style={{ color: personaColor }}
        >
          Add in Dashboard →
        </button>
      )}
    </div>
  )
}

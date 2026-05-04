interface PulseBarProps {
  pulse: number
  tier: string
  accentColor: string
}

export function PulseBar({ pulse, tier, accentColor }: PulseBarProps) {
  const getLevelLabel = (p: number) => {
    if (p <= 30) return 'STARTER'
    if (p <= 60) return 'ACTIVE'
    if (p <= 90) return 'PRO'
    return 'ELITE'
  }

  const level = getLevelLabel(pulse)

  return (
    <div className="w-full mt-auto pt-6 border-t border-white/10">
      <div className="flex justify-between items-end mb-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-black tracking-[0.2em] opacity-40 uppercase">Pulse Score</span>
          <span className="text-xl font-black" style={{ color: accentColor }}>{pulse}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black tracking-[0.2em] opacity-40 uppercase">Identity Tier</span>
          <span className="text-sm font-black italic uppercase tracking-tighter" style={{ color: accentColor }}>{tier}</span>
        </div>
      </div>
      
      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.2)]"
          style={{ 
            width: `${pulse}%`, 
            background: `linear-gradient(90deg, ${accentColor}dd, ${accentColor})` 
          }}
        />
      </div>
      
      <div className="flex justify-between mt-2">
        <span className="text-[9px] font-black opacity-30 tracking-widest uppercase">LVL: {level}</span>
        <span className="text-[9px] font-black opacity-30 tracking-widest uppercase">Live Activity</span>
      </div>
    </div>
  )
}

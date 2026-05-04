export function VerifiedBadge({ isVerified, accentColor }: { isVerified: boolean; accentColor: string }) {
  if (!isVerified) return null

  return (
    <div 
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border backdrop-blur-sm self-center"
      style={{ borderColor: `${accentColor}33` }}
    >
      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: accentColor }}>
        ✦ Founding Member
      </span>
    </div>
  )
}

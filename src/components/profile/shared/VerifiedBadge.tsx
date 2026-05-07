import { ShieldCheck } from 'lucide-react'

export function VerifiedBadge({ isVerified, accentColor }: { isVerified: boolean; accentColor: string }) {
  if (!isVerified) return null

  return (
    <div 
      className="flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-sm border"
      style={{ borderColor: `${accentColor}44`, color: accentColor }}
    >
      <ShieldCheck size={14} fill="currentColor" fillOpacity={0.1} />
    </div>
  )
}

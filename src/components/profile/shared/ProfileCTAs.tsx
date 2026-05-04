import { ProfileData } from '../../../types/profile'

interface ProfileCTAsProps {
  profile: ProfileData
  accentColor: string
}

export function ProfileCTAs({ profile, accentColor }: ProfileCTAsProps) {
  const handleSaveContact = () => {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${profile.display_name}`,
      `NICKNAME:${profile.username}`,
      `URL:${window.location.origin}/p/${profile.username}`,
      `NOTE:KnoWMi ${profile.persona} persona — ${profile.mood ?? ''}`,
      'END:VCARD'
    ].join('\n')
    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.display_name.replace(' ', '_')}.vcf`
    a.click()
  }

  const handleShare = async () => {
    const shareData = {
      title: `${profile.display_name} — KnoWMi`,
      text: `Check out ${profile.display_name}'s digital identity`,
      url: `${window.location.origin}/p/${profile.username}`,
    }
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(shareData.url)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="flex gap-3 mt-5 w-full">
      <button 
        onClick={handleSaveContact} 
        className="flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        style={{ background: accentColor }}
      >
        👤 Save Contact
      </button>
      <button 
        onClick={handleShare} 
        className="flex-1 py-3 px-4 rounded-xl font-bold transition-all hover:bg-white/5 active:scale-[0.98] border-2"
        style={{ borderColor: accentColor, color: accentColor }}
      >
        ↗ Share Profile
      </button>
    </div>
  )
}

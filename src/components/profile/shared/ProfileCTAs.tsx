import { useState } from 'react'
import { ProfileData } from '../../../types/profile'
import ShareBrandCardModal from '../../ShareBrandCardModal'

interface ProfileCTAsProps {
  profile: ProfileData
  accentColor: string
  onOpenShareModal?: () => void
}

export function ProfileCTAs({ profile, accentColor, onOpenShareModal }: ProfileCTAsProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false)

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
    if (onOpenShareModal) {
      onOpenShareModal()
    } else {
      setShareModalOpen(true)
    }
  }

  return (
    <>
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
          🎴 Brand Share Card
        </button>
      </div>

      <ShareBrandCardModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        profile={profile}
        username={profile.username}
      />
    </>
  )
}

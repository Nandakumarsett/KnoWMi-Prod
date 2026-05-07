import React from 'react'
import { ProfileData } from '../../types/profile'
import { PersonaRouter } from '../profile/PersonaRouter'

interface LivePreviewProps {
  profile: ProfileData
}

export function LivePreview({ profile }: LivePreviewProps) {
  return (
    <div className="sticky top-24 bg-white border border-[#E5D5C4] rounded-[12px] p-5 flex flex-col items-center shadow-sm">
      <div className="text-[10px] font-black tracking-widest text-center text-[#5C5246] uppercase mb-3 select-none flex items-center gap-1.5 justify-center">
        ✦ Live Profile Preview
      </div>
      <div className="relative w-[340px] h-[600px] border border-[#E5D5C4] rounded-[32px] overflow-hidden bg-[#FDF6EC] shadow-2xl flex flex-col">
        <div className="flex-1 overflow-y-auto select-none scale-[0.88] origin-top h-[113.6%] w-[113.6%] pb-8">
          <PersonaRouter profile={profile} />
        </div>
      </div>
      <p className="text-center text-[#8C8276] text-[10px] font-black uppercase tracking-widest mt-3 select-none">
        Updates instantly as you type
      </p>
    </div>
  )
}

import React from 'react'
import { ProfileData } from '../../types/profile'
import { PersonaRouter } from '../profile/PersonaRouter'

interface LivePreviewProps {
  profile: ProfileData
}

export function LivePreview({ profile }: LivePreviewProps) {
  return (
    <div className="sticky top-24 bg-white/5 border border-white/10 rounded-[32px] p-6">
      <div className="text-[10px] font-black tracking-widest text-center text-white/40 uppercase mb-4">
        👁 Live Profile Preview
      </div>
      <div className="relative w-full h-[640px] border border-white/10 rounded-[24px] overflow-hidden bg-[#0d1117] shadow-2xl">
        <div className="absolute inset-0 overflow-y-auto" style={{ transform: 'scale(0.7)', transformOrigin: 'top center', height: '142.85%', width: '142.85%' }}>
          <PersonaRouter profile={profile} />
        </div>
      </div>
      <p className="text-center text-white/30 text-[9px] font-black uppercase tracking-widest mt-4">
        updates instantly as you fill the form
      </p>
    </div>
  )
}

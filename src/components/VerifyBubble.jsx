import React from 'react'
import { useAuth } from '../context/AuthContext'
import { ShieldAlert } from 'lucide-react'

export default function VerifyBubble() {
  const { user, profile, isVerified, role } = useAuth()
  
  if (!user || isVerified || role === 'owner') return null

  return (
    <div className="fixed bottom-28 md:bottom-6 right-6 z-[9999] animate-bounce-slow will-change-transform">
      <a 
        href="/dashboard"
        className="group relative flex items-center gap-2 bg-white/90 backdrop-blur-md p-1.5 pr-4 rounded-full shadow-[0_15px_30px_rgba(224,123,26,0.2)] border-[1.5px] border-orange-500 transition-all hover:scale-105 active:scale-95"
      >
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg relative overflow-hidden">
          <ShieldAlert size={16} />
        </div>
        
        <div className="flex flex-col">
          <span className="text-[7px] font-black uppercase tracking-[0.1em] text-orange-500 leading-none mb-0.5">Secure</span>
          <span className="text-[10px] font-bold text-neutral-900 leading-none">Verify Email</span>
        </div>

        <div className="absolute inset-0 rounded-full border border-orange-500 animate-ping opacity-10 pointer-events-none" />
      </a>
    </div>
  )
}

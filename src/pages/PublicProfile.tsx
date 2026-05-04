import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchProfile } from '../lib/profile/fetch-profile'
import { ProfileData } from '../types/profile'
import { PersonaRouter } from '../components/profile/PersonaRouter'
import ProfileViewTracker from '../components/analytics/ProfileViewTracker'
import { Sparkles, X, UserPlus, Share2 } from 'lucide-react'
import { ProfileCTAs } from '../components/profile/shared/ProfileCTAs'
import { PulseBar } from '../components/profile/shared/PulseBar'
import { VerifiedBadge } from '../components/profile/shared/VerifiedBadge'
import { SocialGrid } from '../components/profile/shared/SocialGrid'
import { personaConfigs } from '../config/personaConfig'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function PublicProfile() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    async function loadProfile() {
      if (!username) return
      setLoading(true)
      const data = await fetchProfile(username)
      setProfile(data)
      setLoading(false)
    }
    loadProfile()
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <Sparkles className="animate-spin text-orange-500" size={32} />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center p-6 text-center text-white">
        <h1 className="text-4xl font-black mb-4 font-display uppercase tracking-tighter">404 Vibe Missing</h1>
        <p className="text-neutral-500 mb-8 max-w-xs">This digital identity hasn't been established on the protocol yet.</p>
        <button 
          onClick={() => navigate('/')} 
          className="px-8 py-3 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform"
        >
          Return to Base
        </button>
      </div>
    )
  }

  // Gate check if user is not signed in
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden selection:bg-orange-500/30">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-md w-full bg-white/[0.02] border border-white/10 p-8 sm:p-12 rounded-[40px] backdrop-blur-xl shadow-2xl relative z-10 space-y-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center text-orange-400">
            <Sparkles size={32} className="animate-pulse" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-black tracking-tight font-display uppercase tracking-tighter">
              Identity Locked
            </h1>
            <p className="text-sm text-neutral-400 font-medium leading-relaxed">
              Scan Detected! Please sign up or sign in to KnoWMi to unlock and view {profile.display_name}'s full persona profile.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={() => {
                localStorage.setItem('return_to', window.location.pathname)
                window.location.href = '/?auth=signin'
              }} 
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-[22px] font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-orange-500/20"
            >
              Sign In to View
            </button>
            <button 
              onClick={() => {
                localStorage.setItem('return_to', window.location.pathname)
                window.location.href = '/?auth=signup'
              }} 
              className="w-full py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-[22px] font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign Up for KnoWMi
            </button>
          </div>
        </div>
      </div>
    )
  }

  const pAlias = (profile.persona || '').toLowerCase()
  const activeConfig = personaConfigs[pAlias] || personaConfigs.developer
  const accentColor = activeConfig.theme.accent

  // Mobile View
  if (!isDesktop) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white font-sans selection:bg-orange-500/30 pb-12">
        <ProfileViewTracker profileId={profile.id} />
        
        {/* Top Header */}
        <header className="fixed top-0 w-full z-50 bg-[#161b22]/80 border-b border-white/5 px-6 py-3 backdrop-blur-md flex justify-between items-center">
          <div className="flex items-center gap-2">
             <img src="/logo-square.png" alt="Logo" className="w-6 h-6 rounded-lg object-cover" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
               {profile.first_name ? `${profile.first_name}` : "KnoWMi"}
             </span>
          </div>
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </header>

        {/* Small Button to view QR on Mobile */}
        <div className="pt-20 px-6 flex justify-center mb-6">
          <button 
            onClick={() => setShowQR(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-neutral-100 border border-white/10 rounded-[22px] font-black uppercase tracking-widest text-xs text-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-orange-500/10"
          >
            ✦ Tap to view QR
          </button>
        </div>

        {/* Full Mobile Persona Router below */}
        <div className="px-2">
          <PersonaRouter profile={profile} />
        </div>

        {/* QR Overlay Modal */}
        {showQR && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-6 select-none animate-fadeIn">
            <div className="bg-white rounded-[40px] p-8 max-w-sm w-full flex flex-col items-center relative shadow-2xl text-black">
              <button 
                onClick={() => setShowQR(false)} 
                className="absolute top-6 right-6 p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-all active:scale-95"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo-square.png" className="w-6 h-6 object-cover rounded" alt="KW" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Identity Protocol</span>
              </div>

              <div 
                className="w-52 h-52 p-1.5 shadow-xl rounded-[32px] mb-6 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${accentColor}, #F97316)` }}
              >
                <div className="w-full h-full bg-white p-1 rounded-[26px] overflow-hidden relative flex items-center justify-center">
                   <img 
                     src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`${window.location.origin}/p/${profile?.secure_slug || profile?.id}`)}`} 
                     className="w-full h-full object-contain" 
                     alt="QR Code" 
                   />
                   <div className="absolute inset-0 m-auto w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg border border-neutral-100 p-1">
                     <img src="/logo-square.png" className="w-full h-full object-contain" alt="Branding" />
                   </div>
                </div>
              </div>

              <h3 className="text-xl font-black tracking-tight mb-1 text-center font-display">{profile.display_name}</h3>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center">{profile.member_id}</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans selection:bg-orange-500/30">
      <ProfileViewTracker profileId={profile.id} />
      
      <header className="fixed top-0 w-full z-50 bg-[#161b22]/80 border-b border-white/5 px-8 py-4 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <img src="/logo-square.png" alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
             <span className="text-xs font-black uppercase tracking-[0.3em] opacity-40">
               {profile.first_name ? `${profile.first_name}'s Profile` : "Nanda's Profile"}
             </span>
          </div>
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto pt-28 pb-12 px-8">
        <div className="flex gap-12 items-start justify-center">
          
          {/* Left Column - Fixed Identity Card */}
          <div className="w-[380px] shrink-0 sticky top-28">
            <div className="bg-white rounded-[40px] p-10 shadow-2xl text-black flex flex-col items-center">
                <div className="relative mb-8 group cursor-pointer flex flex-col items-center" onClick={() => setShowQR(!showQR)}>
                   <div 
                     className={`w-48 h-48 p-1.5 shadow-xl transition-all duration-500 hover:scale-105 active:scale-95 ${showQR ? 'rounded-[32px]' : 'rounded-full'}`}
                     style={{ background: `linear-gradient(135deg, ${accentColor}, #F97316)` }}
                   >
                      <div className={`w-full h-full bg-white p-1 overflow-hidden relative flex items-center justify-center ${showQR ? 'rounded-[26px]' : 'rounded-full'}`}>
                         {showQR ? (
                           <div className="w-full h-full bg-white flex items-center justify-center relative p-2 select-none animate-fadeIn rounded-none">
                             <img 
                               src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`${window.location.origin}/p/${profile?.secure_slug || profile?.id}`)}`} 
                               className="w-full h-full object-contain" 
                               alt="QR Code" 
                             />
                             <div className="absolute inset-0 m-auto w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg border border-neutral-100 p-1">
                               <img src="/logo-square.png" className="w-full h-full object-contain" alt="Branding" />
                             </div>
                           </div>
                         ) : (
                           <img 
                             src={profile.avatar_url || ''} 
                             className="w-full h-full rounded-full object-cover select-none animate-fadeIn" 
                             alt={profile.display_name} 
                           />
                         )}
                      </div>
                   </div>
                   {!showQR && (
                     <div className="absolute bottom-2 right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border-2 border-white pointer-events-none">
                        <VerifiedBadge isVerified={profile.is_verified} accentColor={accentColor} />
                     </div>
                   )}
                   <div className="absolute -bottom-4 bg-orange-500/10 text-orange-600 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-orange-500/20 backdrop-blur-sm pointer-events-none shadow-sm flex items-center gap-1 select-none">
                     {showQR ? '↺ Tap for Photo' : '✦ Tap for QR'}
                   </div>
                </div>

              <h1 className="text-4xl font-black tracking-tight mb-2 text-center">{profile.display_name}</h1>
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-30 mb-6 text-center">{profile.member_id}</p>
              
              <div className="px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-8" style={{ background: `${accentColor}15`, color: accentColor }}>
                {profile.persona} Persona
              </div>

              <p className="text-sm text-neutral-500 text-center leading-relaxed mb-10 italic">
                "{profile.bio || profile.mood || 'Creating digital value.'}"
              </p>

              <ProfileCTAs profile={profile} accentColor={accentColor} />

              <div className="w-full mt-10">
                <SocialGrid links={profile.social_links} style="row" />
              </div>

              <div className="w-full mt-10">
                 <PulseBar pulse={profile.pulse} tier={profile.tier} accentColor={accentColor} />
              </div>
            </div>
          </div>

          {/* Right Column - Persona Specific Content */}
          <div className="flex-1 max-w-[680px] min-h-[600px] rounded-[40px] overflow-hidden border border-white/5 shadow-2xl">
             <PersonaRouter profile={profile} />
          </div>

        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-8 py-12 border-t border-white/5 flex justify-between items-center opacity-30">
        <p className="text-[10px] font-black uppercase tracking-widest">© 2024 KnoWMi Identity Platform</p>
        <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
           <span>Privacy</span>
           <span>Terms</span>
           <span>Protocol</span>
        </div>
      </footer>
    </div>
  )
}

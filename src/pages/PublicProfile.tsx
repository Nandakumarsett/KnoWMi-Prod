import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { fetchProfile } from '../lib/profile/fetch-profile'
import { ProfileData } from '../types/profile'
import { PersonaRouter } from '../components/profile/PersonaRouter'
import ProfileViewTracker from '../components/analytics/ProfileViewTracker'
import { Sparkles, X, UserPlus, Share2, ArrowLeft, Lock } from 'lucide-react'
import { ProfileCTAs } from '../components/profile/shared/ProfileCTAs'
import { PulseBar } from '../components/profile/shared/PulseBar'
import { VerifiedBadge } from '../components/profile/shared/VerifiedBadge'
import { SocialGrid } from '../components/profile/shared/SocialGrid'
import { ProfileAvatar } from '../components/profile/shared/ProfileAvatar'
import { personaConfigs } from '../config/personaConfig'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { getAnalyticsData } from '../lib/analytics/data-source'

export default function PublicProfile() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768)
  const [showQR, setShowQR] = useState(false)
  const [recentVisitors, setRecentVisitors] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)

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
      if (data?.id) {
        const analytics = await getAnalyticsData(data.id, 'all')
        setStats(analytics)
        setRecentVisitors(analytics.latestActivity || [])
      }
      setLoading(false)
    }
    loadProfile()
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center">
        <Sparkles className="animate-spin text-[#C1440E]" size={32} />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FDF6EC] flex flex-col items-center justify-center p-6 text-center text-[#1A1A1A]">
        <h1 className="text-4xl font-black mb-4 font-display uppercase tracking-tighter text-[#C1440E]">404 Vibe Missing</h1>
        <p className="text-[#5C5246] mb-8 max-w-xs">This digital identity hasn't been established on the protocol yet.</p>
        <button 
          onClick={() => navigate('/')} 
          className="px-8 py-3 bg-[#C1440E] hover:bg-[#A0350B] text-white rounded-[12px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
        >
          Return to Base
        </button>
      </div>
    )
  }

  // Gate check if user is not signed in
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-[#FDF6EC] flex flex-col items-center justify-center p-6 text-center text-[#1A1A1A] relative overflow-hidden selection:bg-orange-500/30">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-md w-full bg-white/60 border border-[#E5D5C4] p-8 sm:p-12 rounded-[24px] backdrop-blur-xl shadow-2xl relative z-10 space-y-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-[#C1440E]/10 border border-[#C1440E]/20 rounded-[12px] flex items-center justify-center text-[#C1440E]">
            <Sparkles size={32} className="animate-pulse" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-black tracking-tight font-display uppercase tracking-tighter text-[#C1440E]">
              Identity Locked
            </h1>
            <p className="text-sm text-[#5C5246] font-medium leading-relaxed">
              Scan Detected! Please sign up or sign in to KnoWMi to unlock and view {profile.display_name}'s full persona profile.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={() => {
                localStorage.setItem('return_to', window.location.pathname)
                window.location.href = '/?auth=signin'
              }} 
              className="w-full py-4 bg-[#C1440E] hover:bg-[#A0350B] text-white rounded-[12px] font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[#C1440E]/20"
            >
              Sign In to View
            </button>
            <button 
              onClick={() => {
                localStorage.setItem('return_to', window.location.pathname)
                window.location.href = '/?auth=signup'
              }} 
              className="w-full py-4 bg-white/40 hover:bg-white/60 text-[#1A1A1A] border border-[#E5D5C4] rounded-[12px] font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
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
  const fromSrc = searchParams.get('src')
  const fromTab = searchParams.get('from') || 'analytics'
  const accentColor = activeConfig?.theme?.accent || '#C1440E'
  const isOwnerOfProfile = user && user.id === profile.user_id
  const isFreeProfile = profile.tier === 'Starter' || profile.tier === 'Free' || profile.status === 'free' || (!profile.status && (!profile.tier || profile.tier === 'Starter'));

  // Sanitize display_name — strip accidental username/persona prefix concatenation
  // e.g. "tester_personaTester Persona" → "Tester Persona"
  const rawName = profile.display_name || ''
  const usernameRaw = profile.username || ''
  const personaRaw = profile.persona || ''

  let cleanDisplayName = rawName
  // Strip username prefix first (most common case)
  if (usernameRaw && rawName.toLowerCase().startsWith(usernameRaw.toLowerCase())) {
    cleanDisplayName = rawName.slice(usernameRaw.length).trim()
  } else if (personaRaw && rawName.toLowerCase().startsWith(personaRaw.toLowerCase())) {
    // Strip persona prefix as fallback
    cleanDisplayName = rawName.slice(personaRaw.length).trim()
  }
  // If stripping left nothing, fall back to original
  const safeDisplayName = cleanDisplayName || rawName || profile.username || 'KnoWMi User'

  // Friendly persona label from config
  const customType = profile.persona_data?.type;
  const personaLabel = (customType && customType.toLowerCase() !== pAlias) 
    ? customType 
    : (activeConfig?.name || personaRaw.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))


  const isDarkTheme = activeConfig?.theme?.color === 'dark' || activeConfig?.theme?.color === 'neon' || activeConfig?.theme?.color === 'purple' || activeConfig?.theme?.color === 'green' || activeConfig?.theme?.color === 'blue'
  const pageBg = activeConfig?.theme?.bg || '#FDF6EC'
  const textPrimary = isDarkTheme ? '#FFFFFF' : '#1A1A1A'
  const textSecondary = activeConfig?.theme?.textSecondary || '#5C5246'
  const cardBg = isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'white'
  const borderColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : '#E5D5C4'
  const headerBg = isDarkTheme ? 'rgba(13, 17, 23, 0.8)' : '#FDF6EC/80'

  // Mobile View
  if (!isDesktop) {
    return (
      <div className="min-h-screen text-[#1A1A1A] font-sans selection:bg-orange-500/30 pb-12" style={{ background: pageBg, color: textPrimary }}>
        <ProfileViewTracker profileId={profile.id} />
        
        {/* Top Header */}
        <header className="fixed top-0 w-full z-[120] border-b px-6 py-3 backdrop-blur-md flex justify-between items-center" style={{ background: headerBg, borderColor: borderColor }}>
          <div className="flex items-center gap-2">
             <img src="/logo-square.png" alt="Logo" className="w-6 h-6 rounded-lg object-cover" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: textPrimary }}>
                {safeDisplayName}
             </span>
          </div>
          {isOwnerOfProfile ? (
            <button 
              onClick={() => navigate(`/dashboard?tab=${fromTab}`)} 
              className="px-3 py-1.5 hover:bg-white/50 rounded-xl transition-all border border-[#E5D5C4] flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#C1440E] select-none shrink-0"
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <button 
              onClick={() => fromSrc === 'leaderboard' ? navigate('/leaderboard') : navigate('/')} 
              className="p-2 hover:bg-white/50 rounded-xl transition-all border border-[#E5D5C4] text-[#5C5246] select-none flex items-center justify-center shrink-0"
            >
              <X size={18} />
            </button>
          )}
        </header>

        {/* Small Button to view QR on Mobile */}
        <div className="pt-20 px-6 flex justify-center mb-6">
          {isFreeProfile ? (
            <button 
              onClick={() => setShowQR(true)}
              className="flex items-center gap-2 px-6 py-3 border border-orange-500/30 rounded-[12px] font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md bg-orange-500/5 text-orange-500"
            >
              🔒 Buy A Tee to Unlock your QR
            </button>
          ) : (
            <button 
              onClick={() => setShowQR(true)}
              className="flex items-center gap-2 px-6 py-3 border rounded-[12px] font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md"
              style={{ background: cardBg, borderColor: borderColor, color: textPrimary }}
            >
              ✦ Tap to view QR
            </button>
          )}
        </div>


        {isFreeProfile && (
          <div className="px-6 mb-6">
            <div 
              className="w-full p-6 rounded-2xl border border-dashed border-orange-500/30 text-center relative overflow-hidden backdrop-blur-md cursor-pointer hover:bg-orange-500/5 transition-colors group"
              style={{ background: isDarkTheme ? 'rgba(255,153,51,0.03)' : 'rgba(255,153,51,0.05)' }}
              onClick={() => window.location.href = '/#pricing'}
            >
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex flex-col items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-orange-500/15 text-orange-500">
                  Standard Tier
                </span>
                <h4 className="text-sm font-black tracking-tight" style={{ color: textPrimary }}>Buy a Tee to Unlock QR & Reach</h4>
                <p className="text-[11px] leading-relaxed max-w-[240px]" style={{ color: textSecondary, opacity: 0.8 }}>
                  Unlock dynamic physical scans, detailed custom themes, and full global connection analytics.
                </p>
                <button 
                  className="mt-3 px-6 py-2.5 bg-orange-500 group-hover:bg-orange-600 text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 pointer-events-none"
                >
                  Buy a Tee to Unlock 🚀
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Full Mobile Persona Router below */}
        <div className="px-2">
          <PersonaRouter profile={profile} recentVisitors={recentVisitors} stats={stats} />
        </div>

        {/* QR Overlay Modal */}
        {showQR && (
          <div className="fixed inset-0 z-[100] bg-[#1A1A1A]/60 backdrop-blur-md flex flex-col items-center justify-center p-6 select-none animate-fadeIn">
            <div className="bg-white rounded-[24px] p-8 max-w-sm w-full flex flex-col items-center relative shadow-2xl text-[#1A1A1A] border border-[#E5D5C4]">
              <button 
                onClick={() => setShowQR(false)} 
                className="absolute top-6 right-6 p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-all active:scale-95"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo-square.png" className="w-6 h-6 object-cover rounded" alt="KW" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5C5246]">Identity Protocol</span>
              </div>

              {isFreeProfile ? (
                <div 
                  className="w-52 h-52 bg-white/90 rounded-[12px] flex flex-col items-center justify-center p-4 text-center text-neutral-900 mb-6 relative overflow-hidden border border-neutral-200 shadow-sm backdrop-blur-sm cursor-pointer hover:bg-white/95 transition-colors group"
                  onClick={() => window.location.href = '/#pricing'}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent pointer-events-none" />
                  <Lock size={28} className="text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">Locked</span>
                  <p className="text-[11px] font-bold mt-1 text-neutral-600">Buy a Tee to Unlock QR</p>
                  <button className="mt-4 px-4 py-2 bg-orange-500 group-hover:bg-orange-600 text-white font-black text-[9px] uppercase tracking-widest rounded-lg transition-all active:scale-95 shadow-md shadow-orange-500/20 pointer-events-none">Upgrade 🚀</button>
                </div>
              ) : (
                <div 
                  className="w-52 h-52 p-1.5 shadow-xl rounded-[12px] mb-6 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, #F97316)` }}
                >
                      <div className="w-full h-full bg-white p-1 rounded-[10px] overflow-hidden relative flex items-center justify-center">
                         <img 
                           src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`${window.location.origin}/p/${profile?.secure_slug || profile?.id}`)}`} 
                           className="w-full h-full object-contain pointer-events-none select-none" 
                           draggable="false"
                           onDragStart={(e) => e.preventDefault()}
                           onContextMenu={(e) => e.preventDefault()}
                           alt="QR Code" 
                         />
                         <div className="absolute inset-0 z-10" />
                         <div className="absolute inset-0 m-auto w-8 h-8 bg-neutral-950 rounded-lg flex items-center justify-center shadow-lg border border-neutral-800 z-20 select-none">
                           <span className="text-[10px] font-black text-orange-500 tracking-wider font-sans leading-none">WM</span>
                         </div>
                      </div>
                </div>
              )}

              <h3 className="text-xl font-black tracking-tight mb-1 text-center font-display text-[#1A1A1A]">{profile.display_name}</h3>
              <p className="text-[10px] font-bold text-[#5C5246] uppercase tracking-widest text-center">{profile.member_id}</p>
              {profile.is_verified && (
                <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1">
                   ✦ Founding Member
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen font-sans selection:bg-orange-500/30" style={{ background: pageBg, color: textPrimary }}>
      <ProfileViewTracker profileId={profile.id} />
      
      <header className="fixed top-0 w-full z-[120] border-b px-8 py-4 backdrop-blur-md" style={{ background: headerBg, borderColor: borderColor }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <img src="/logo-square.png" alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
             <span className="text-xs font-black uppercase tracking-[0.3em] opacity-40" style={{ color: textPrimary }}>
               {safeDisplayName}'s Profile
             </span>
          </div>
          {isOwnerOfProfile ? (
            <button 
              onClick={() => navigate(`/dashboard?tab=${fromTab}`)} 
              className="px-4 py-2 hover:bg-white/50 rounded-xl transition-all border border-[#E5D5C4] flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#C1440E] select-none shrink-0"
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
          ) : (
            <button 
              onClick={() => fromSrc === 'leaderboard' ? navigate('/leaderboard') : navigate('/')} 
              className="p-2 hover:bg-white/50 rounded-xl transition-all border border-[#E5D5C4] text-[#5C5246] select-none flex items-center justify-center shrink-0"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto pt-28 pb-12 px-8">
        <div className="flex gap-12 items-start justify-center">
          
          {/* Left Column - Fixed Identity Card */}
          <div className="w-[380px] shrink-0 sticky top-28">
            <div className="rounded-[24px] p-10 shadow-2xl flex flex-col items-center border" style={{ background: cardBg, borderColor: borderColor, color: textPrimary }}>
                <div 
                  className="relative mb-8 group cursor-pointer flex flex-col items-center"
                  onClick={() => setShowQR(!showQR)}
                >
                   <div 
                     className={`w-48 h-48 p-1.5 shadow-xl transition-all duration-500 hover:scale-105 active:scale-95 ${showQR ? 'rounded-[12px]' : 'rounded-full'}`}
                     style={{ background: `linear-gradient(135deg, ${accentColor}, #F97316)` }}
                   >
                      <div className={`w-full h-full bg-white p-1 overflow-hidden relative flex items-center justify-center ${showQR ? 'rounded-[10px]' : 'rounded-full'}`}>
                         {showQR ? (
                           isFreeProfile ? (
                             <div 
                               className="w-full h-full bg-white/90 flex flex-col items-center justify-center p-4 text-center text-neutral-900 relative rounded-[10px] overflow-hidden animate-fadeIn select-none pointer-events-auto border border-neutral-200 cursor-pointer hover:bg-white/95 transition-colors group"
                               onClick={(e) => { e.stopPropagation(); window.location.href = '/#pricing'; }}
                             >
                               <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent pointer-events-none" />
                               <Lock size={28} className="text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                               <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">Locked</span>
                               <p className="text-[11px] font-bold mt-1 text-neutral-600">Buy a Tee to Unlock QR</p>
                               <button className="mt-4 px-4 py-2 bg-orange-500 group-hover:bg-orange-600 text-white font-black text-[9px] uppercase tracking-widest rounded-lg transition-all active:scale-95 z-20 relative shadow-md shadow-orange-500/20 pointer-events-none">Upgrade 🚀</button>
                             </div>
                           ) : (
                             <div className="w-full h-full bg-white flex items-center justify-center relative p-2 select-none animate-fadeIn rounded-none">
                               <img 
                                 src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`${window.location.origin}/p/${profile?.secure_slug || profile?.id}`)}`} 
                                 className="w-full h-full object-contain pointer-events-none" 
                                 draggable="false"
                                 onDragStart={(e) => e.preventDefault()}
                                 onContextMenu={(e) => e.preventDefault()} 
                                 alt="QR Code" 
                               />
                               <div className="absolute inset-0 z-10" />
                               <div className="absolute inset-0 m-auto w-8 h-8 bg-neutral-950 rounded-lg flex items-center justify-center shadow-lg border border-neutral-800 z-20 select-none">
                                 <span className="text-[10px] font-black text-orange-500 tracking-wider font-sans leading-none">WM</span>
                               </div>
                             </div>
                           )
                         ) : (
                           <ProfileAvatar
                              src={profile.avatar_url}
                              name={safeDisplayName}
                              size={176}
                              shape="circle"
                              className="select-none animate-fadeIn"
                            />
                         )}
                      </div>
                   </div>
                   {!showQR && (
                     <div className="absolute bottom-2 right-2 w-12 h-12 bg-white rounded-[12px] shadow-xl flex items-center justify-center border border-[#E5D5C4] pointer-events-none">
                        <VerifiedBadge isVerified={profile.is_verified} accentColor={accentColor} />
                     </div>
                   )}
                   <div className="absolute -bottom-4 bg-[#FDF6EC] text-[#C1440E] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#E5D5C4] backdrop-blur-sm pointer-events-none shadow-sm flex items-center gap-1 select-none animate-slideUp">
                     {showQR ? '↺ Tap for Photo' : '✦ Tap for QR'}
                   </div>
                </div>

              <h1 className="text-4xl font-black tracking-tight mb-2 text-center" style={{ color: textPrimary }}>{safeDisplayName}</h1>
              <div className="flex flex-col items-center mb-6">
                <p className="text-xs font-black uppercase tracking-[0.2em] opacity-30 text-[#1A1A1A]" style={{ color: textPrimary }}>{profile.member_id}</p>
                {profile.is_verified && (
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mt-2 flex items-center gap-1.5">
                    ✦ Founding Member
                  </p>
                )}
              </div>
              
              <div className="px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-8" style={{ background: `${accentColor}15`, color: accentColor }}>
                {personaLabel} Persona
              </div>

              <p className="text-sm text-center leading-relaxed mb-10 italic" style={{ color: textPrimary, opacity: 0.8 }}>
                "{profile.bio || profile.mood || 'Creating digital value.'}"
              </p>

              <ProfileCTAs profile={profile} accentColor={accentColor} />

              <div className="w-full mt-10">
                <SocialGrid links={profile.social_links} style="row" />
              </div>

              <div className="w-full mt-10">
                 <PulseBar pulse={profile.pulse} tier={profile.tier} accentColor={accentColor} />
              </div>

              {isFreeProfile && (
                <div 
                  className="w-full mt-8 p-6 rounded-2xl border border-dashed border-orange-500/30 text-center relative overflow-hidden backdrop-blur-md cursor-pointer hover:bg-orange-500/5 transition-colors group"
                  style={{ background: isDarkTheme ? 'rgba(255,153,51,0.03)' : 'rgba(255,153,51,0.05)' }}
                  onClick={() => window.location.href = '/#pricing'}
                >
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex flex-col items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-orange-500/15 text-orange-500">
                      Standard Tier
                    </span>
                    <h4 className="text-sm font-black tracking-tight" style={{ color: textPrimary }}>Buy a Tee to Unlock QR & Reach</h4>
                    <p className="text-[11px] leading-relaxed max-w-[240px]" style={{ color: textSecondary, opacity: 0.8 }}>
                      Unlock dynamic physical scans, detailed custom themes, and full global connection analytics.
                    </p>
                    <button 
                      className="mt-3 px-6 py-2.5 bg-orange-500 group-hover:bg-orange-600 text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 pointer-events-none"
                    >
                      Buy a Tee to Unlock 🚀
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 max-w-[680px] min-h-[600px] rounded-[24px] overflow-hidden border shadow-2xl p-6" style={{ background: cardBg, borderColor: borderColor }}>
             <PersonaRouter profile={profile} recentVisitors={recentVisitors} stats={stats} />
          </div>

        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-8 py-12 border-t flex justify-between items-center opacity-40" style={{ borderColor: borderColor }}>
        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: textPrimary }}>© 2024 KnoWMi Identity Protocol</p>
        <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest" style={{ color: textPrimary }}>
           <span>Privacy</span>
           <span>Terms</span>
           <span>Protocol</span>
        </div>
      </footer>
      {/* Floating Visitor CTA Pill */}
      {!user && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[340px] px-4 animate-slideUp">
          <div 
            onClick={() => window.location.href = '/?auth=signup'}
            className="bg-black/85 backdrop-blur-md border border-white/10 p-3.5 rounded-[20px] shadow-2xl flex items-center justify-between gap-4 cursor-pointer hover:bg-black transition-all hover:scale-[1.03] active:scale-[0.98] group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center text-white text-lg animate-pulse">
                ✦
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-0.5">Powered by KnoWMi</p>
                <p className="text-xs font-bold text-white tracking-wide">Claim Your Free Profile</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white group-hover:bg-orange-500 transition-colors">
              <ArrowLeft size={14} className="rotate-180" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

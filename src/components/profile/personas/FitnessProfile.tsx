import React, { useState, useEffect } from 'react'
import { ProfileData, FitnessData } from '../../../types/profile'
import { ProfileCTAs } from '../shared/ProfileCTAs'
import { PulseBar } from '../shared/PulseBar'
import { SocialGrid } from '../shared/SocialGrid'
import { VerifiedBadge } from '../shared/VerifiedBadge'
import { ProfileAvatar } from '../shared/ProfileAvatar'
import { Dumbbell, Target, Flame, MapPin, Award } from 'lucide-react'

export function FitnessProfile({ profile }: { profile: ProfileData }) {
  const data = profile.persona_data as FitnessData
  const accentRed = '#FF3B30'
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#FF3B3011] blur-[100px] rounded-full pointer-events-none" />

      <header className="px-6 py-6 flex justify-between items-center relative z-10 border-b border-[#222222]">
        <div className="flex items-center gap-2">
          <img src="/logo-square.png" className="w-6 h-6 object-cover rounded" alt="KW" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#888888]">
            {profile.first_name ? `${profile.first_name}'s Profile` : "Your Profile"}
          </span>
        </div>
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#111111] border border-[#222222] text-xs">×</div>
      </header>

      <main className="max-w-[480px] mx-auto pt-8 pb-12 px-6 relative z-10">
        {/* Avatar — shows full-bleed photo if available, else styled initials card */}
        <div className="w-full aspect-square rounded-3xl overflow-hidden mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 relative group">
          {profile.avatar_url && profile.avatar_url.trim() !== '' ? (
            <>
              <img
                src={profile.avatar_url}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex' }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                style={{ objectPosition: 'top' }}
                alt={profile.display_name}
              />
              {/* Fallback shown via onError */}
              <div
                className="w-full h-full absolute inset-0 items-center justify-center font-black text-white text-8xl"
                style={{ background: 'linear-gradient(135deg, #FF3B30, #F97316)', display: 'none' }}
              >
                {(profile.display_name || 'U').charAt(0).toUpperCase()}
              </div>
            </>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center font-black text-white text-8xl"
              style={{ background: 'linear-gradient(135deg, #FF3B30, #F97316)' }}
            >
              {(profile.display_name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-4xl font-black uppercase tracking-tight leading-none mb-2 font-display">
              {profile.display_name}
            </h1>
            <div className="flex items-center gap-3">
               <p className="text-sm text-[#888888] font-medium">{data.tagline || 'Fitness Enthusiast'}</p>
               {data.location && (
                 <span className="flex items-center gap-1 text-[10px] font-black uppercase text-[#FF3B30] tracking-widest">
                   <MapPin size={10} /> {data.location}
                 </span>
               )}
            </div>
          </div>
        </div>

        <VerifiedBadge isVerified={profile.is_verified} accentColor={accentRed} />

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 w-full mt-8">
           {[
             { label: 'STREAK', val: `${data.streak_days || 0}d`, color: '#FF3B30', icon: Flame },
             { label: 'PRs HIT', val: data.prs_count || 0, color: '#30D158', icon: Target },
             { label: 'WORKTS', val: data.total_workouts || 0, color: '#F97316', icon: Dumbbell }
           ].map(s => (
             <div key={s.label} className="bg-[#111111] border border-[#222222] rounded-3xl p-4 text-center">
                <s.icon size={16} className="mx-auto mb-2 opacity-40" style={{ color: s.color }} />
                <span className="block text-[8px] font-black text-[#888888] uppercase tracking-[0.2em] mb-1">{s.label}</span>
                <span className="text-xl font-black">{s.val}</span>
             </div>
           ))}
        </div>

        {/* CTAs */}
        <ProfileCTAs profile={profile} accentColor={accentRed} />

        {/* Sections */}
        <div className="w-full mt-12 space-y-12">
          {/* Current Goals */}
          {data.goals && data.goals.length > 0 && (
            <section>
               <div className="flex items-center gap-3 mb-8">
                  <Target size={18} className="text-[#FF3B30]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#888888]">Current Goals</span>
                  <div className="flex-1 h-px bg-[#222222]" />
               </div>
               <div className="space-y-8">
                  {data.goals.map((goal, i) => {
                    const pct = (goal.current / goal.target) * 100
                    return (
                      <div key={i} className="space-y-3">
                         <div className="flex justify-between items-end px-1">
                            <p className="font-black text-sm uppercase tracking-tight">{goal.label}</p>
                            <p className="text-xs font-black text-[#FF3B30]">{goal.current}{goal.unit === '%' ? '' : goal.unit}</p>
                         </div>
                         <div className="h-2.5 w-full bg-[#111111] rounded-full overflow-hidden border border-white/5">
                            <div 
                              className="h-full bg-gradient-to-r from-[#FF3B30] to-[#F97316] transition-all duration-1000 ease-out"
                              style={{ width: animated ? `${pct}%` : '0%' }}
                            />
                         </div>
                      </div>
                    )
                  })}
               </div>
            </section>
          )}

          {/* Disciplines */}
          {data.disciplines && data.disciplines.length > 0 && (
            <section>
               <div className="flex items-center gap-3 mb-6">
                  <Dumbbell size={18} className="text-[#30D158]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#888888]">Disciplines</span>
                  <div className="flex-1 h-px bg-[#222222]" />
               </div>
               <div className="flex flex-wrap gap-2">
                  {data.disciplines.map(tag => (
                    <span key={tag} className="px-5 py-2.5 rounded-2xl bg-[#111111] border border-[#222222] text-[10px] font-black uppercase tracking-widest text-white/80 hover:text-white hover:border-[#FF3B30] transition-all">
                      {tag}
                    </span>
                  ))}
               </div>
            </section>
          )}

          {/* Achievements */}
          {data.achievements && data.achievements.length > 0 && (
            <section>
               <div className="flex items-center gap-3 mb-6">
                  <Award size={18} className="text-[#F97316]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#888888]">Hall of Fame</span>
                  <div className="flex-1 h-px bg-[#222222]" />
               </div>
               <div className="space-y-3">
                  {data.achievements.map(ach => (
                    <div key={ach.label} className="flex items-center gap-4 p-5 rounded-3xl bg-[#111111] border border-[#222222] hover:bg-white/[0.02] transition-colors">
                       <div className="text-2xl">{ach.icon}</div>
                       <span className="text-[11px] font-black uppercase tracking-widest leading-none">{ach.label}</span>
                    </div>
                  ))}
               </div>
            </section>
          )}
        </div>

        <div className="mt-12 w-full">
           <SocialGrid links={profile.social_links} style="row" />
        </div>

        <PulseBar pulse={profile.pulse} tier={profile.tier} accentColor={accentRed} />
      </main>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { ProfileData, StudentData } from '../../../types/profile'
import { ProfileCTAs } from '../shared/ProfileCTAs'
import { PulseBar } from '../shared/PulseBar'
import { SocialGrid } from '../shared/SocialGrid'
import { VerifiedBadge } from '../shared/VerifiedBadge'
import { ProfileAvatar } from '../shared/ProfileAvatar'
import { GraduationCap, BookOpen, Music, Rocket } from 'lucide-react'
import { getAssetUrl } from '../../../lib/supabase'

const DOODLES = [
  { char: '★', color: '#FF6B9D', top: '15%', left: '10%', size: '24px' },
  { char: '✦', color: '#4A90E2', top: '25%', left: '85%', size: '20px' },
  { char: '✧', color: '#FFB800', top: '45%', left: '5%', size: '18px' },
  { char: '♪', color: '#F97316', top: '65%', left: '90%', size: '22px' },
  { char: '♫', color: '#4CAF50', top: '80%', left: '15%', size: '24px' },
  { char: '〜', color: '#4A90E2', top: '10%', left: '75%', size: '20px' },
  { char: '●', color: '#FF6B9D', top: '55%', left: '80%', size: '14px' },
  { char: '↗', color: '#F97316', top: '35%', left: '20%', size: '18px' },
  { char: '✨', color: '#FFB800', top: '70%', left: '5%', size: '22px' },
  { char: '★', color: '#4CAF50', top: '90%', left: '80%', size: '20px' },
]

const AVATAR_STYLES = [
  { bg: '#FFE4B5', skin: '#FFDBAC', hair: '#4A3728' },
  { bg: '#E8F5E9', skin: '#F4C194', hair: '#2C1810' },
  { bg: '#FFF0F5', skin: '#FDBCB4', hair: '#1A1A1A' },
  { bg: '#F0F8FF', skin: '#C68642', hair: '#3D2B1F' },
  { bg: '#F5F0FF', skin: '#8D5524', hair: '#000000' },
]

function VisitorAvatar({ visitor, index }: { visitor?: any; index: number }) {
  if (visitor) {
    return (
      <div 
        className="w-10 h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center overflow-hidden bg-neutral-100"
        style={{ marginLeft: index === 0 ? 0 : '-10px', zIndex: 20 - index }}
      >
        <img 
          src={getAssetUrl(visitor.avatar_url)} 
          alt="V" 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as any).src = `https://ui-avatars.com/api/?name=${visitor.first_name || 'U'}&background=random`;
          }}
        />
      </div>
    )
  }

  const style = AVATAR_STYLES[index % 5]
  return (
    <div 
      className="w-10 h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: style.bg, marginLeft: index === 0 ? 0 : '-10px', zIndex: 10 - index }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="45" r="18" fill={style.skin} />
        <circle cx="20" cy="18" r="8" fill={style.skin} />
        <path d="M12 12 Q20 4 28 12 Q28 18 20 20 Q12 18 12 12" fill={style.hair} />
        <circle cx="17" cy="17" r="1" fill="#000" />
        <circle cx="23" cy="17" r="1" fill="#000" />
        <path d="M17 21 Q20 23 23 21" stroke="#000" strokeWidth="0.5" fill="none" />
      </svg>
    </div>
  )
}

export function StudentProfile({ profile, visitors = [] }: { profile: ProfileData; visitors?: any[] }) {
  const data = profile.persona_data as StudentData
  const accentBlue = '#4A90E2'
  const accentPink = '#FF6B9D'
  const accentOrange = '#F97316'
  
  return (
    <div className="min-h-screen bg-[#FFFBF0] text-[#1a1a2e] relative overflow-hidden font-sans">
      {/* Background Doodles */}
      <div className="absolute inset-0 pointer-events-none">
        {DOODLES.map((d, i) => (
          <div 
            key={i}
            className="absolute animate-float-slow"
            style={{ 
              top: d.top, 
              left: d.left, 
              color: d.color, 
              fontSize: d.size,
              animationDelay: `${i * 0.5}s`,
              zIndex: 0
            }}
          >
            {d.char}
          </div>
        ))}
      </div>

      <header className="relative z-10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo-square.png" className="w-6 h-6 object-cover rounded" alt="KW" />
          <span className="text-sm font-black tracking-tight text-[#1a1a2e]">
            {profile.first_name ? `${profile.first_name}'s Profile` : "Your Profile"}
          </span>
        </div>
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white text-xs">×</div>
      </header>

      <main className="relative z-10 max-w-[480px] mx-auto pt-8 pb-12 px-6 flex flex-col items-center">
        {/* Avatar with Thought Bubble */}
        <div className="relative mb-6">
          <div className="p-[4px] rounded-full shadow-xl" style={{ background: 'linear-gradient(135deg, #FFB800, #FF6B9D)' }}>
            <ProfileAvatar
              src={profile.avatar_url}
              name={profile.display_name}
              size={120}
              shape="circle"
            />
          </div>
          <div className="absolute -top-2 -right-4 w-12 h-12 bg-white rounded-2xl shadow-lg border border-[#E8E0D0] flex items-center justify-center text-2xl animate-bounce">
            {data.thought_bubble || '💭'}
          </div>
        </div>

        {/* Name & Title */}
        <h1 className="text-3xl font-black text-center mb-1 text-[#4A90E2] font-display">
          {profile.display_name}
        </h1>
        {data.university && (
          <p className="text-sm text-[#6b6b8d] italic mb-4 text-center font-medium">
            {data.university}
          </p>
        )}

        {data.mood && (
          <div className="mb-6 px-4 py-1.5 rounded-full bg-[#FF6B9D15] text-[#FF6B9D] text-xs font-bold border border-[#FF6B9D33]">
            Mood: {data.mood} ✨
          </div>
        )}

        <VerifiedBadge isVerified={profile.is_verified} accentColor={accentOrange} />

        {/* Stat Pills */}
        <div className="grid grid-cols-2 gap-4 w-full mt-8">
          <div className="bg-white border-2 border-[#E8E0D0] rounded-3xl p-4 text-center shadow-sm">
            <span className="block text-[10px] font-black text-[#4A90E2] uppercase tracking-widest mb-1">Campus Rank</span>
            <span className="text-xl font-black text-[#1a1a2e]">{data.campus_rank_pct ? `Top ${data.campus_rank_pct}% ⭐` : '—'}</span>
          </div>
          <div className="bg-white border-2 border-[#E8E0D0] rounded-3xl p-4 text-center shadow-sm">
            <span className="block text-[10px] font-black text-[#4CAF50] uppercase tracking-widest mb-1">Study Buddies</span>
            <span className="text-xl font-black text-[#1a1a2e]">{data.study_buddies || 0}</span>
          </div>
        </div>

        {/* CTAs */}
        <ProfileCTAs profile={profile} accentColor={accentOrange} />

        {/* Sections */}
        <div className="w-full mt-12 space-y-10">
          {/* Currently Studying */}
          {(data.course || data.year) && (
            <section className="bg-white rounded-[32px] p-6 border-2 border-[#E8E0D0] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#4A90E2]" />
              <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#4A90E2] mb-4">
                <BookOpen size={14} /> Currently Studying
              </h3>
              <div className="space-y-1">
                {data.course && <p className="font-black text-lg text-[#1a1a2e]">{data.course}</p>}
                {data.year && <p className="text-sm text-[#6b6b8d] font-bold">{data.year}</p>}
              </div>
            </section>
          )}

          {/* My Playlist */}
          {(data.playlist_url || data.playlist_name) && (
            <section>
              <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1a1a2e] mb-4">
                <Music size={14} className="text-[#FF6B9D]" /> My Playlist
              </h3>
              <a 
                href={data.playlist_url || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-5 rounded-[32px] bg-white border-2 border-[#E8E0D0] hover:scale-[1.02] transition-transform group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#1DB954] flex items-center justify-center text-white shadow-lg">
                    <Music size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-[#1a1a2e] truncate">{data.playlist_name || '🎧 My Study Vibe'}</p>
                    <p className="text-xs font-bold text-[#1DB954] uppercase tracking-widest">Open in Spotify →</p>
                  </div>
                </div>
              </a>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section>
               <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1a1a2e] mb-4">
                <Rocket size={14} className="text-[#4A90E2]" /> Projects
              </h3>
              <div className="space-y-3">
                {data.projects.map(p => (
                  <div key={p.name} className="p-5 rounded-[32px] bg-white border-2 border-[#E8E0D0] flex items-center gap-4">
                     <div className="text-2xl">{p.emoji || '🚀'}</div>
                     <div className="flex-1 min-w-0">
                        <p className="font-black text-[#1a1a2e]">{p.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {p.tech?.map(t => (
                            <span key={t} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-[#6b6b8d]">{t}</span>
                          ))}
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent Visitors */}
          <section className="text-center">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-[#6b6b8d] mb-4">
              👥 Recent Visitors
            </h3>
            <div className="flex justify-center items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <VisitorAvatar key={i} index={i} visitor={visitors[i]?.visitor} />
              ))}
            </div>
          </section>
        </div>

        <div className="mt-12 w-full">
           <SocialGrid links={profile.social_links} style="row" />
        </div>

        <PulseBar pulse={profile.pulse} tier={profile.tier} accentColor={accentOrange} />
      </main>
    </div>
  )
}

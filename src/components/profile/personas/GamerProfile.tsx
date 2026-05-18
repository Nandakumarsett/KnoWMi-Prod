import React from 'react'
import { ProfileData, GamerData } from '../../../types/profile'
import { ProfileCTAs } from '../shared/ProfileCTAs'
import { PulseBar } from '../shared/PulseBar'
import { SocialGrid } from '../shared/SocialGrid'
import { VerifiedBadge } from '../shared/VerifiedBadge'
import { ProfileAvatar } from '../shared/ProfileAvatar'
import { Gamepad2, Trophy, Zap, Monitor, Crosshair } from 'lucide-react'

const RARITY_COLORS = {
  common: '#B0C4DE',
  rare: '#4169E1',
  epic: '#9B59B6',
  legendary: '#FFD700'
}

export function GamerProfile({ profile }: { profile: ProfileData }) {
  const data = profile.persona_data as GamerData
  const neonPrimary = '#00FFAA'
  const neonSecondary = '#FF00FF'
  
  return (
    <div className="min-h-screen bg-[#080810] text-[#EAEAFF] font-mono relative overflow-hidden">
      {/* Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00FFAA11] blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FF00FF11] blur-[120px] rounded-full" />

      <header className="px-6 py-6 flex justify-between items-center relative z-10 border-b border-[#1A1A30]">
        <div className="flex items-center gap-2">
          <img src="/logo-square.png" className="w-6 h-6 object-cover rounded" alt="KW" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#6060AA]">
            {profile.first_name ? `${profile.first_name}'s Profile` : "Your Profile"}
          </span>
        </div>
        <div className="px-3 py-1 rounded bg-[#1A1A30] border border-white/10 text-[9px] font-black uppercase tracking-widest hover:text-[#00FFAA] transition-colors cursor-pointer">
          [ESC] ×
        </div>
      </header>

      <main className="max-w-[480px] mx-auto pt-8 pb-12 px-6 relative z-10">
        {/* Gamer Tag & Avatar */}
        <div className="flex flex-col items-center mb-10">
           <div className="relative mb-6">
              <div className="p-[3px] rounded-3xl shadow-[0_0_30px_#00FFAA33] bg-gradient-to-br from-[#00FFAA] to-[#00BFFF]">
                <ProfileAvatar
                  src={profile.avatar_url}
                  name={profile.display_name}
                  size={128}
                  shape="rounded"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-[#00FFAA] text-black text-[10px] font-black uppercase rounded shadow-[0_0_15px_#00FFAA]">
                ▶ {data.status || 'ONLINE'}
              </div>
           </div>

           <h1 className="text-4xl font-black italic tracking-tighter mb-2 text-[#00FFAA] drop-shadow-[0_0_12px_#00FFAA66]">
             {`>${data.gamer_tag || profile.display_name.replace(' ', '')}`}
           </h1>
           
           <div className="flex gap-2">
              <VerifiedBadge isVerified={profile.is_verified} accentColor={neonPrimary} />
              {data.main_games?.[0]?.rank && (
                <div className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-[#6060AA]">
                  Rank: {data.main_games[0].rank}
                </div>
              )}
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 w-full mb-8">
           {[
             { label: 'K/D', val: data.stats?.kd_ratio || '0', color: '#00FFAA' },
             { label: 'WINS', val: data.stats?.total_wins || '0', color: '#FF00FF' },
             { label: 'HOURS', val: data.stats?.hours_played || '0', color: '#00BFFF' }
           ].map(s => (
             <div key={s.label} className="bg-[#0F0F1A] border border-[#1A1A30] rounded-2xl p-4 text-center group hover:border-white/20 transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: s.color }} />
                <span className="block text-[8px] font-black text-[#6060AA] uppercase tracking-widest mb-1">{s.label}</span>
                <span className="text-xl font-black tracking-tight" style={{ color: s.color }}>{s.val}</span>
             </div>
           ))}
        </div>

        {/* CTAs */}
        <div className="gamer-ctas">
          <style>{`
            .btn-neon { position: relative; overflow: hidden; background: #00FFAA; color: black; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; padding: 14px; border-radius: 12px; width: 100%; font-size: 13px; transition: all 0.3s; box-shadow: 0 0 20px #00FFAA33; }
            .btn-neon:hover { background: #EAEAFF; box-shadow: 0 0 30px #00FFAA66; transform: translateY(-2px); }
            .btn-neon-outline { background: transparent; border: 2px solid #1A1A30; color: #EAEAFF; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; padding: 14px; border-radius: 12px; width: 100%; font-size: 13px; transition: all 0.3s; }
            .btn-neon-outline:hover { border-color: #00FFAA; color: #00FFAA; text-shadow: 0 0 10px #00FFAA66; }
          `}</style>
          <div className="flex gap-3">
             <button className="btn-neon" onClick={() => alert('Add to squad!')}>[ ADD TO SQUAD ]</button>
             <button className="btn-neon-outline" onClick={() => alert('Profile shared!')}>[ SHARE ]</button>
          </div>
        </div>

        {/* Sections */}
        <div className="w-full mt-12 space-y-12">
          {/* Main Games */}
          {data.main_games && data.main_games.length > 0 && (
            <section>
               <div className="flex items-center gap-3 mb-6">
                  <Monitor size={16} className="text-[#00FFAA]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6060AA]">Main Games</span>
                  <div className="flex-1 h-px bg-[#1A1A30]" />
               </div>
               <div className="grid grid-cols-2 gap-3">
                  {data.main_games.map(game => (
                    <div key={game.name} className="p-4 rounded-2xl bg-[#0F0F1A] border border-[#1A1A30] flex items-center gap-3 hover:bg-[#1A1A30] transition-colors group">
                       <div className="w-10 h-10 rounded-xl bg-[#080810] flex items-center justify-center border border-white/5 group-hover:border-[#00FFAA33]">
                          <Zap size={20} className="text-[#6060AA] group-hover:text-[#00FFAA]" />
                       </div>
                       <div className="min-w-0">
                          <p className="text-xs font-black truncate">{game.name}</p>
                          <p className="text-[9px] font-bold text-[#00FFAA] tracking-widest">{game.rank}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
          )}

          {/* Achievements */}
          {data.achievements && data.achievements.length > 0 && (
            <section>
               <div className="flex items-center gap-3 mb-6">
                  <Trophy size={16} className="text-[#FF00FF]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6060AA]">Achievements</span>
                  <div className="flex-1 h-px bg-[#1A1A30]" />
               </div>
               <div className="space-y-3">
                  {data.achievements.map(ach => (
                    <div key={ach.label} className="p-4 rounded-2xl bg-[#0F0F1A] border border-[#1A1A30] flex items-center gap-4 group">
                       <div className="text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{ach.icon}</div>
                       <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black uppercase tracking-wider">{ach.label}</p>
                          <p className="text-[8px] font-black uppercase tracking-widest" style={{ color: RARITY_COLORS[ach.rarity || 'common'] }}>{ach.rarity} achievement</p>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
          )}
        </div>

        {/* Social Links Row */}
        <div className="mt-12 w-full">
           <SocialGrid links={profile.social_links} style="row" />
        </div>

        {/* Pulse Bar Footers (ENERGY version) */}
        <div className="mt-12 pt-8 border-t border-[#1A1A30]">
           <div className="flex justify-between items-end mb-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-[0.3em] text-[#6060AA] uppercase mb-1">Energy Levels</span>
                <span className="text-2xl font-black text-[#00FFAA]">{profile.pulse}/100</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black tracking-[0.3em] text-[#6060AA] uppercase mb-1">Status</span>
                <span className="text-sm font-black italic uppercase text-[#FF00FF]">{profile.tier}</span>
              </div>
           </div>
           <div className="h-4 w-full bg-[#1A1A30] rounded-lg overflow-hidden border border-white/5 relative">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-pulse" />
              <div 
                className="h-full bg-gradient-to-r from-[#00FFAA] to-[#00BFFF] transition-all duration-[2000ms] ease-in-out"
                style={{ width: `${profile.pulse}%` }}
              />
           </div>
        </div>
      </main>
    </div>
  )
}

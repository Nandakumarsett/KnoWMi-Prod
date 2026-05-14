import React from 'react'
import { ProfileData, StudentData } from '../../../types/profile'
import { PulseBar } from '../shared/PulseBar'
import { VerifiedBadge } from '../shared/VerifiedBadge'
import { ProfileAvatar } from '../shared/ProfileAvatar'
import { 
  GraduationCap, BookOpen, Rocket, FileText, 
  Globe, Trophy, Music, Sparkles 
} from 'lucide-react'
import { getAssetUrl } from '../../../lib/supabase'

export function StudentProfile({ profile }: { profile: ProfileData }) {
  const data = profile.persona_data as StudentData
  const accent = '#10B981' // Emerald
  
  return (
    <div className="w-full space-y-12 animate-fadeIn pb-12 relative overflow-hidden bg-[#fffcf8] rounded-[40px] border border-[#E5D5C4] shadow-2xl">
      {/* Academic Layer (Math symbols, numbers) - Same as preview */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-[0.12] font-serif text-neutral-900 leading-none z-0">
         <div className="absolute top-10 left-10 text-6xl">π</div>
         <div className="absolute top-40 right-20 text-8xl">Σ</div>
         <div className="absolute bottom-20 left-20 text-7xl">√x</div>
         <div className="absolute top-1/2 left-1/4 text-4xl">E=mc²</div>
         <div className="absolute bottom-40 right-10 text-6xl">∫</div>
         <div className="absolute top-20 right-1/3 text-4xl">λ</div>
         <div className="absolute bottom-10 right-1/4 text-7xl">∞</div>
         <div className="absolute top-1/3 right-5 text-5xl">Δ</div>
         <div className="absolute bottom-1/4 left-1/3 text-3xl">f(x)</div>
      </div>

      <main className="relative z-10 p-8">
        {/* Academic Hero */}
        <div className="flex flex-col items-center text-center mb-12">
           <div className="relative mb-8">
              <div className="absolute -top-6 -right-6 text-4xl animate-bounce">🎓</div>
              <div className="w-32 h-32 rounded-[40px] border-4 border-white shadow-2xl overflow-hidden bg-white rotate-3">
                <ProfileAvatar
                  src={profile.avatar_url}
                  name={profile.display_name}
                  size={128}
                  shape="square"
                  className="-rotate-3"
                />
              </div>
           </div>
           <div className="flex items-center gap-2 mb-1">
             <h1 className="text-4xl font-black text-neutral-900 tracking-tighter" style={{ fontFamily: 'Fraunces, serif' }}>
               {profile.display_name}
             </h1>
             <VerifiedBadge isVerified={profile.is_verified} accentColor={accent} />
           </div>
           <div className="flex items-center gap-4 mb-4">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">
                {data.university || 'KnoWMi SCHOLAR'} • CLASS OF 2024
              </p>
              {data.mood && (
                <div className="px-3 py-1 rounded-full bg-emerald-50 text-[10px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100">
                  {data.mood}
                </div>
              )}
           </div>
           <p className="text-base text-neutral-600 italic mt-6 px-6 leading-relaxed max-w-lg">
             "{data.bio || 'Dedicated to the pursuit of knowledge and digital excellence.'}"
           </p>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-12">
           <div className="bg-white/60 backdrop-blur-md p-6 rounded-[32px] border-2 border-white/50 text-center shadow-sm hover:shadow-md transition-shadow">
             <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Campus Rank</div>
             <div className="text-3xl font-black text-neutral-900">{data.campus_rank_pct ? `Top ${data.campus_rank_pct}%` : '—'}</div>
           </div>
           <div className="bg-white/60 backdrop-blur-md p-6 rounded-[32px] border-2 border-white/50 text-center shadow-sm hover:shadow-md transition-shadow">
             <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Study Buddies</div>
             <div className="text-3xl font-black text-neutral-900">{data.study_buddies || 0}</div>
           </div>
        </div>

        {/* Academic Highlights & Credentials */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                <Trophy size={20} />
              </div>
              <div>
                 <h4 className="text-xs font-black uppercase tracking-widest text-neutral-900">Academic Credentials</h4>
                 <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Verified credentials & course info</p>
              </div>
           </div>

           {/* Current Study Info Card */}
           <div className="p-8 rounded-[32px] border-2 border-[#f0e7d8] bg-emerald-500 text-white border-transparent shadow-xl shadow-emerald-500/20 flex items-center gap-6 transition-all hover:scale-[1.02]">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/20">
                <BookOpen size={32} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">Currently Studying</div>
                <div className="text-xl font-black">{data.course || 'Global Scholar'}</div>
                <div className="text-xs font-bold opacity-80">{data.year || 'Senior Year'}</div>
              </div>
           </div>

           {/* Projects Section */}
           {data.projects && data.projects.length > 0 && (
             <div className="space-y-4">
                <div className="flex items-center gap-3 mt-10 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <Rocket size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-neutral-900">Featured Projects</h4>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Key academic and side projects</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {data.projects.map((p, i) => (
                    <div key={i} className="p-6 rounded-[32px] border-2 border-[#f0e7d8] bg-white/80 backdrop-blur-sm flex items-center gap-5">
                      <div className="text-3xl">{p.emoji || '🚀'}</div>
                      <div>
                        <div className="text-sm font-black text-neutral-900">{p.name}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {p.tech?.map(t => (
                            <span key={t} className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
           )}

           {/* Extracurriculars: Hackathons & Clubs */}
           {( (data.hackathons && data.hackathons.length > 0) || (data.clubs && data.clubs.length > 0) ) && (
             <div className="mt-10 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-neutral-900">Campus Vibe</h4>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Hackathons, Clubs & Involvement</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                   {data.hackathons?.map(h => (
                     <span key={h.name} className="px-4 py-2 rounded-2xl bg-white border border-[#E5D5C4] text-[10px] font-black text-neutral-700 uppercase tracking-widest">
                       🏆 {h.name}
                     </span>
                   ))}
                   {data.clubs?.map(club => (
                     <span key={club} className="px-4 py-2 rounded-2xl bg-white border border-[#E5D5C4] text-[10px] font-black text-neutral-700 uppercase tracking-widest">
                       🤝 {club}
                     </span>
                   ))}
                </div>
             </div>
           )}

           {/* Playlist Section */}
           {(data.playlist_url || data.playlist_name) && (
              <div className="mt-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <Music size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-neutral-900">Study Playlist</h4>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">The background sound of progress</p>
                  </div>
                </div>
                <a 
                  href={data.playlist_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-6 rounded-[32px] border-2 border-[#f0e7d8] bg-[#1DB954] text-white flex items-center gap-5 hover:scale-[1.02] transition-all shadow-xl shadow-[#1DB954]/20"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Music size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/70">Spotify Playlist</div>
                    <div className="text-md font-black">{data.playlist_name || 'My Study Beats'}</div>
                  </div>
                </a>
              </div>
           )}

        {/* Professional Assets */}
        {(data.resume_url || data.website) && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.resume_url && (
              <a href={getAssetUrl(data.resume_url)} target="_blank" rel="noopener noreferrer" className="p-6 rounded-[32px] bg-white border-2 border-[#f0e7d8] flex items-center gap-4 group hover:border-emerald-500 transition-all">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText size={20} />
                </div>
                <span className="text-xs font-black text-neutral-900 uppercase tracking-widest">Resume</span>
              </a>
            )}
            {data.website && (
              <a href={data.website} target="_blank" rel="noopener noreferrer" className="p-6 rounded-[32px] bg-white border-2 border-[#f0e7d8] flex items-center gap-4 group hover:border-emerald-500 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe size={20} />
                </div>
                <span className="text-xs font-black text-neutral-900 uppercase tracking-widest">Portfolio</span>
              </a>
            )}
          </div>
        )}
      </div>

        {/* Pulse Bar Footer */}
        <div className="mt-12 relative z-10">
          <PulseBar pulse={profile.pulse} tier={profile.tier} accentColor={accent} />
        </div>
      </main>
    </div>
  )
}

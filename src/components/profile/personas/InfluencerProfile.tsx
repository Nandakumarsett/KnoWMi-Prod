import React from 'react'
import { ProfileData, InfluencerData } from '../../../types/profile'
import { ProfileCTAs } from '../shared/ProfileCTAs'
import { PulseBar } from '../shared/PulseBar'
import { SocialGrid } from '../shared/SocialGrid'
import { VerifiedBadge } from '../shared/VerifiedBadge'
import { ProfileAvatar } from '../shared/ProfileAvatar'
import { Instagram, Youtube, Share2, CheckCircle2, TrendingUp, Play } from 'lucide-react'

export function InfluencerProfile({ profile }: { profile: ProfileData }) {
  const data = profile.persona_data as InfluencerData
  const accent = '#F97316'
  const gradient = 'linear-gradient(135deg, #F97316, #E84393)'
  
  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans">
      {/* Top Gradient Strip */}
      <div className="h-2 w-full fixed top-0 z-[60]" style={{ background: gradient }} />

      <header className="px-6 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-2 z-50">
        <div className="flex items-center gap-2">
          <img src="/logo-square.png" className="w-6 h-6 object-cover rounded" alt="KW" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#666666]">
            {profile.first_name ? `${profile.first_name}'s Profile` : "Nanda's Profile"}
          </span>
        </div>
        <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[#F8F8F8] border border-[#EEEEEE] text-xs">×</div>
      </header>

      <main className="max-w-[480px] mx-auto pt-8 pb-12 px-6">
        {/* Large Centered Avatar */}
        <div className="flex flex-col items-center mb-8">
           <div className="relative mb-6">
              <div
                className="w-36 h-36 rounded-full p-1.5 shadow-2xl"
                style={{ background: gradient }}
              >
                <div className="w-full h-full rounded-full bg-white p-1">
                   <ProfileAvatar
                     src={profile.avatar_url}
                     name={profile.display_name}
                     size={128}
                     shape="circle"
                   />
                </div>
              </div>
              <div className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-[#F97316] border-2 border-white">
                 <CheckCircle2 size={24} fill="#F97316" className="text-white" />
              </div>
           </div>

           <h1 className="text-3xl font-black tracking-tight mb-1 text-center font-display">{profile.display_name}</h1>
           <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-widest">{data.tagline || 'Verified Creator'}</span>
              <div className="w-1 h-1 rounded-full bg-black/20" />
              <span className="text-xs font-medium text-[#666666]">India</span>
           </div>

           <p className="text-sm text-[#666666] text-center max-w-[80%] mx-auto mb-8 leading-relaxed">
             "{profile.bio || 'Creating content that connects.'}"
           </p>

           {/* Metrics Row */}
           <div className="grid grid-cols-2 gap-4 w-full px-2">
              <div className="bg-[#F8F8F8] border border-[#EEEEEE] rounded-[28px] p-5 text-center">
                 <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#666666] mb-1">Total Reach</p>
                 <p className="text-xl font-black text-[#F97316]">{data.total_reach || '0'}</p>
              </div>
              <div className="bg-[#F8F8F8] border border-[#EEEEEE] rounded-[28px] p-5 text-center">
                 <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#666666] mb-1">Avg. Engagement</p>
                 <p className="text-xl font-black text-[#E84393]">{data.avg_engagement || '0%'}</p>
              </div>
           </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
           <button 
             className="flex-[2] py-4 rounded-[24px] font-black text-white text-sm uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
             style={{ background: gradient }}
             onClick={() => alert('Collab logic!')}
           >
             COLLAB WITH ME
           </button>
           <button 
             className="flex-1 py-4 rounded-[24px] bg-[#F8F8F8] border border-[#EEEEEE] font-black text-[#0A0A0A] text-sm flex items-center justify-center gap-2 transition-all hover:bg-black/5"
             onClick={() => alert('Share logic!')}
           >
             <Share2 size={18} />
           </button>
        </div>

        {/* Sections */}
        <div className="w-full mt-12 space-y-12">
          {/* Platforms */}
          {data.platforms && data.platforms.length > 0 && (
            <section>
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#666666]">My Platforms</h3>
                  <TrendingUp size={16} className="text-[#F97316]" />
               </div>
               <div className="space-y-3">
                  {data.platforms.map(p => (
                    <div key={p.platform} className="p-5 rounded-[28px] bg-[#F8F8F8] border border-[#EEEEEE] flex items-center justify-between hover:bg-white transition-all hover:shadow-lg group">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                             {p.platform === 'instagram' ? <Instagram size={22} className="text-[#E84393]" /> : p.platform === 'youtube' ? <Youtube size={22} className="text-[#FF0000]" /> : <Share2 size={22} className="text-black" />}
                          </div>
                          <div>
                             <p className="font-black text-sm capitalize">{p.platform}</p>
                             <p className="text-[10px] font-bold text-[#666666] uppercase tracking-widest">{p.followers} {p.metric_label}</p>
                          </div>
                       </div>
                       <div className="w-8 h-8 rounded-full border border-[#EEEEEE] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play size={12} fill="currentColor" />
                       </div>
                    </div>
                  ))}
               </div>
            </section>
          )}

          {/* Categories */}
          {data.categories && data.categories.length > 0 && (
            <section>
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#666666] mb-6 text-center">Niche & Categories</h3>
               <div className="flex flex-wrap justify-center gap-2">
                  {data.categories.map(cat => (
                    <span key={cat} className="px-5 py-2.5 rounded-full bg-[#F8F8F8] border border-[#EEEEEE] text-[10px] font-black uppercase tracking-widest hover:border-[#F97316] hover:text-[#F97316] transition-all cursor-default">
                      {cat}
                    </span>
                  ))}
               </div>
            </section>
          )}

          {/* Collab Niche */}
          {data.collab_types && data.collab_types.length > 0 && (
            <section className="bg-black text-white rounded-[32px] p-8 text-center relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F97316] mb-4">Collab Niche</h3>
               <div className="flex flex-wrap justify-center gap-2">
                 {(Array.isArray(data.collab_types) ? data.collab_types : [data.collab_types]).map((ct: string) => (
                   <span key={ct} className="px-4 py-1.5 rounded-full bg-white/10 text-sm font-black uppercase tracking-wider border border-white/20">{ct}</span>
                 ))}
               </div>
            </section>
          )}
        </div>

        <div className="mt-16">
           <PulseBar pulse={profile.pulse} tier={profile.tier} accentColor={accent} />
        </div>
      </main>
    </div>
  )
}

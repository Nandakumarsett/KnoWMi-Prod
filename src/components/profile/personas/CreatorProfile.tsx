import React from 'react'
import { ProfileData, CreatorData } from '../../../types/profile'
import { ProfileCTAs } from '../shared/ProfileCTAs'
import { PulseBar } from '../shared/PulseBar'
import { SocialGrid } from '../shared/SocialGrid'
import { VerifiedBadge } from '../shared/VerifiedBadge'
import { EmptyState } from '../shared/EmptyState'
import { LayoutGrid, Palette, Image as ImageIcon, Video, FileText } from 'lucide-react'

export function CreatorProfile({ profile }: { profile: ProfileData }) {
  const data = profile.persona_data as CreatorData
  const accent = '#F97316'
  
  return (
    <div className="min-h-screen bg-[#FDF6EE] text-[#1A0A00] font-sans">
      <header className="px-6 py-5 flex justify-between items-center border-b border-[#F0E0CC]">
        <div className="flex items-center gap-2">
          <img src="/logo-square.png" className="w-5 h-5 object-cover rounded" alt="KW" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8C6B4A]">
            {profile.first_name ? `${profile.first_name}'s Profile` : "Nanda's Profile"}
          </span>
        </div>
        <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-[#F0E0CC] text-xs">×</div>
      </header>

      <main className="max-w-[480px] mx-auto pb-12">
        {/* Featured Hero Banner */}
        <div className="relative h-64 bg-[#F0E0CC] overflow-hidden group">
          {data.featured_work_url ? (
            <img src={data.featured_work_url} className="w-full h-full object-cover" alt="Featured Work" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#F9731633] to-[#E8439333]" />
          )}
          <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
        </div>

        <div className="px-6 -mt-10 relative z-10">
          <div className="flex items-end gap-5 mb-6">
            <div className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-2xl overflow-hidden rotate-[-2deg]">
              <img 
                src={profile.avatar_url || ''} 
                className="w-full h-full object-cover rounded-2xl" 
                alt={profile.display_name} 
              />
            </div>
            <div className="mb-2">
               <h1 className="text-2xl font-black tracking-tight font-display">{profile.display_name}</h1>
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-[#8C6B4A] uppercase tracking-widest">{data.type}</span>
                 <div className="w-1 h-1 rounded-full bg-[#F97316]" />
                 <VerifiedBadge isVerified={profile.is_verified} accentColor={accent} />
               </div>
            </div>
          </div>

          {data.tagline && (
            <p className="text-sm italic text-[#8C6B4A] leading-relaxed mb-8 border-l-4 border-[#F97316] pl-4">
              "{data.tagline}"
            </p>
          )}

          <ProfileCTAs profile={profile} accentColor={accent} />

          {/* Sections */}
          <div className="mt-12 space-y-12">
            {/* Works Grid */}
            {data.works && data.works.length > 0 && (
              <section>
                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#1A0A00] mb-6">
                  <Palette size={14} /> Selected Works
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {data.works.map((work, i) => (
                    <a 
                      key={i} 
                      href={work.url} 
                      className="aspect-square rounded-xl bg-white border border-[#F0E0CC] overflow-hidden group shadow-sm"
                    >
                      {work.thumbnail_url ? (
                        <img src={work.thumbnail_url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={work.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#F0E0CC]">
                           {work.type === 'video' ? <Video size={24} /> : work.type === 'article' ? <FileText size={24} /> : <ImageIcon size={24} />}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Content Formats */}
            {data.content_formats && data.content_formats.length > 0 && (
              <section>
                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#1A0A00] mb-6">
                  <Palette size={14} /> Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.content_formats.map(format => (
                    <span key={format} className="px-5 py-2.5 rounded-full bg-white border border-[#F0E0CC] text-[10px] font-black uppercase tracking-widest shadow-sm hover:border-[#F97316] transition-colors">
                      {format}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Platform Cards */}
            {data.platforms && data.platforms.length > 0 && (
              <section>
                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#1A0A00] mb-6">
                  <Palette size={14} /> Presence
                </h3>
                <div className="space-y-3">
                  {data.platforms.map(p => (
                    <a key={p.platform} href={p.url} className="flex items-center justify-between p-5 rounded-3xl bg-white border border-[#F0E0CC] shadow-sm hover:scale-[1.01] transition-transform">
                      <div className="flex items-center gap-4">
                         <span className="text-xl">{p.platform === 'instagram' ? '📸' : p.platform === 'youtube' ? '▶️' : '🎵'}</span>
                         <span className="font-black text-sm uppercase tracking-wider">{p.platform}</span>
                      </div>
                      <div className="text-right">
                         <p className="font-black text-[#F97316]">{p.followers}</p>
                         <p className="text-[8px] font-black uppercase opacity-40">{p.metric_label || 'followers'}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="mt-16">
            <PulseBar pulse={profile.pulse} tier={profile.tier} accentColor={accent} />
          </div>
        </div>
      </main>
    </div>
  )
}

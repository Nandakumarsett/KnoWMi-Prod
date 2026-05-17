import React from 'react'
import { ProfileData, StudentData } from '../../../types/profile'
import { ProfileAvatar } from '../shared/ProfileAvatar'
import { 
  GraduationCap, BookOpen, Rocket, FileText, 
  Globe, Music, Sparkles, Heart, Star, Users,
  Share2, UserPlus, QrCode, ExternalLink, Github, Linkedin, Twitter, Instagram,
  MessageCircle, Link as LinkIcon, Trophy, Target, Briefcase, Zap, Mail, Calendar, Ghost
} from 'lucide-react'
import { getAssetUrl } from '../../../lib/supabase'
import { QRCodeSVG } from 'qrcode.react'

export function StudentProfile({ profile }: { profile: ProfileData }) {
  const data = (profile.persona_data || {}) as StudentData
  if (!data || Object.keys(data).length === 0) {
    return <div className="p-10 text-center text-neutral-400 font-medium text-sm">Loading student identity...</div>
  }
  
  // Platform icon helper
  const getPlatformData = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return { icon: <Github size={20} />, color: '#181717', bg: 'bg-[#181717]/5', text: 'text-[#181717]', hoverBorder: 'hover:border-[#181717]/30' };
    if (p.includes('linkedin')) return { icon: <Linkedin size={20} />, color: '#0077B5', bg: 'bg-[#0077B5]/10', text: 'text-[#0077B5]', hoverBorder: 'hover:border-[#0077B5]/30' };
    if (p.includes('twitter') || p.includes('x')) return { icon: <Twitter size={20} />, color: '#1DA1F2', bg: 'bg-[#1DA1F2]/10', text: 'text-[#1DA1F2]', hoverBorder: 'hover:border-[#1DA1F2]/30' };
    if (p.includes('instagram')) return { icon: <Instagram size={20} />, color: '#E4405F', bg: 'bg-[#E4405F]/10', text: 'text-[#E4405F]', hoverBorder: 'hover:border-[#E4405F]/30' };
    if (p.includes('snapchat')) return { icon: <Ghost size={20} />, color: '#FFFC00', bg: 'bg-[#FFFC00]/20', text: 'text-neutral-900', hoverBorder: 'hover:border-[#FFFC00]/50' };
    if (p.includes('discord')) return { icon: <MessageCircle size={20} />, color: '#5865F2', bg: 'bg-[#5865F2]/10', text: 'text-[#5865F2]', hoverBorder: 'hover:border-[#5865F2]/30' };
    if (p.includes('behance')) return { icon: <LinkIcon size={20} />, color: '#1769FF', bg: 'bg-[#1769FF]/10', text: 'text-[#1769FF]', hoverBorder: 'hover:border-[#1769FF]/30' };
    if (p.includes('medium')) return { icon: <LinkIcon size={20} />, color: '#000000', bg: 'bg-neutral-100', text: 'text-black', hoverBorder: 'hover:border-black/30' };
    return { icon: <LinkIcon size={20} />, color: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-500', hoverBorder: 'hover:border-emerald-500/30' };
  };

  // Subtle Background Pattern
  const BackgroundPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0" 
         style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
  );

  const BackgroundAnimation = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute left-[10%] top-[15%] text-emerald-500/20 animate-float-slow">
        <Rocket size={40} />
      </div>
      <div className="absolute right-[15%] top-[30%] text-blue-500/10 animate-float-medium">
        <BookOpen size={60} />
      </div>
      <div className="absolute left-[20%] bottom-[30%] text-amber-500/20 animate-float-fast">
        <Star size={30} />
      </div>
      <div className="absolute right-[25%] bottom-[15%] text-emerald-500/10 animate-float-slow">
        <GraduationCap size={80} />
      </div>
      <div className="absolute left-[40%] top-[60%] text-indigo-500/10 animate-float-medium">
        <Sparkles size={50} />
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] relative overflow-hidden font-sans">
      <BackgroundPattern />
      <BackgroundAnimation />

      {/* HERO BANNER */}
      <div className="relative h-48 sm:h-64 w-full bg-neutral-200 overflow-hidden shadow-sm">
        {data.featured_work_url ? (
          <img 
            src={getAssetUrl(data.featured_work_url)} 
            className="w-full h-full object-cover" 
            alt="Profile Banner"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-400 via-teal-300 to-blue-400 flex items-center justify-center">
            <Sparkles size={48} className="text-white/30" />
          </div>
        )}
        {/* Soft gradient overlay for better blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-transparent to-transparent opacity-90" />
      </div>

      <main className="relative z-10 max-w-2xl mx-auto px-5 sm:px-8 -mt-20 sm:-mt-24 pb-24 flex flex-col items-center">
        
        {/* AVATAR & IDENTITY */}
        <div className="flex flex-col items-center w-full mb-4">
          <div className="relative mb-5 group flex items-center justify-center">
            {/* Thought Bubble */}
            {data.thought_bubble && (
              <div className="absolute -right-8 -top-4 sm:-right-12 sm:-top-4 z-20 animate-bounce delay-150">
                <div className="relative bg-white border border-neutral-100 rounded-2xl px-3 py-2 shadow-xl shadow-black/5 flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl leading-none">{data.thought_bubble}</span>
                  <div className="absolute -left-1.5 bottom-2 w-3 h-3 bg-white border-l border-b border-neutral-100 rotate-45 rounded-sm" />
                </div>
              </div>
            )}

            {/* Avatar Container - FIXED CENTERING */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1.5 sm:p-2 bg-white/80 backdrop-blur-xl shadow-2xl shadow-black/10 relative z-10 transition-transform duration-500 group-hover:scale-105 flex items-center justify-center mx-auto">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-neutral-50 bg-neutral-100 flex items-center justify-center relative">
                <ProfileAvatar
                  src={profile.avatar_url}
                  name={profile.display_name}
                  size={160}
                />
              </div>
              {/* Decorative Ring */}
              <div className="absolute inset-0 rounded-full border border-neutral-200/50 -m-3 sm:-m-4 opacity-50" />
            </div>
          </div>

          <div className="text-center w-full">
            <h1 className="text-2xl sm:text-4xl leading-tight font-black text-neutral-900 tracking-tight mb-1.5">
              {profile.display_name}
            </h1>
            <p className="text-emerald-500 font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-1.5">
              <GraduationCap size={18} /> Student @ {data.university || 'University'}
            </p>
          </div>
        </div>

        {/* BIO (Vibe moved to Academic Core) */}
        {data.bio && (
          <div className="w-full max-w-md mx-auto text-center mb-8 -mt-2">
            <p className="text-sm sm:text-[15px] text-neutral-500 leading-relaxed font-medium">
              "{data.bio}"
            </p>
          </div>
        )}

        {/* OPEN TO / AVAILABILITY (New High-Value Field) */}
        {data.availability && (
          <div className="w-full max-w-md mx-auto mb-10">
            <div className="bg-emerald-500 text-white rounded-[1.5rem] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 shadow-[0_8px_30px_rgba(16,185,129,0.2)]">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Briefcase size={20} className="text-white" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100 mb-0.5">Currently Open To</p>
                <p className="text-sm sm:text-base font-black tracking-wide">{data.availability}</p>
              </div>
            </div>
          </div>
        )}

        {/* STATS ROW */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 w-full mb-10">
          <div className="bg-white p-5 sm:p-6 rounded-3xl sm:rounded-[2rem] border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center flex flex-col justify-center transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5 sm:mb-2">Campus Rank</p>
            <div className="text-xl sm:text-2xl font-black text-neutral-900 flex items-center justify-center gap-1.5 sm:gap-2">
              Top {data.campus_rank_pct || '—'}% 
              <Trophy size={18} className="text-amber-400" />
            </div>
          </div>
          <div className="bg-white p-5 sm:p-6 rounded-3xl sm:rounded-[2rem] border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center flex flex-col justify-center transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5 sm:mb-2">Study Buddies</p>
            <div className="text-xl sm:text-2xl font-black text-neutral-900 flex items-center justify-center gap-1.5 sm:gap-2">
              {data.study_buddies || '0'}
              <Users size={18} className="text-emerald-400" />
            </div>
          </div>
        </div>

        {/* ABOUT ME */}
        {data.about_me && (
          <div className="w-full mb-10">
            <div className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 sm:p-8 opacity-5">
                <BookOpen size={80} className="sm:w-[120px] sm:h-[120px]" />
              </div>
              <div className="relative z-10">
                <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400" /> The Story
                </h4>
                <p className="text-sm sm:text-[15px] text-neutral-700 leading-relaxed sm:leading-loose font-medium text-left">
                  {data.about_me}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ACADEMIC CORE (Now includes Vibe Badge) */}
        <div className="w-full mb-10">
           <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-emerald-100/50 shadow-sm relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-10">
                <GraduationCap size={120} className="sm:w-[160px] sm:h-[160px]" />
              </div>
              
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-sm text-emerald-500 flex items-center justify-center shrink-0">
                   <GraduationCap size={28} strokeWidth={1.5} />
                </div>
                <div className="flex-1 text-left">
                   <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600/60 mb-2">Academic Core</h4>
                   <h3 className="text-lg sm:text-xl font-black text-neutral-900 leading-tight mb-2">
                     {data.course || 'Academic Major'}
                   </h3>
                   <div className="flex flex-wrap items-center gap-2 mt-3">
                     <span className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-full bg-white shadow-sm text-[10px] sm:text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
                       {data.year || 'Current Status'}
                     </span>
                     
                     {/* VIBE BADGE MOVED HERE */}
                     {data.mood && (
                       <span className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-full bg-amber-50 shadow-sm text-[10px] sm:text-[11px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5 border border-amber-100">
                         <Sparkles size={12} className="text-amber-500"/> {data.mood}
                       </span>
                     )}
                     
                     {data.batch_year && (
                       <span className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-full bg-white shadow-sm text-[10px] sm:text-[11px] font-bold text-neutral-600 uppercase tracking-wider flex items-center gap-1.5">
                         <Target size={12} className="text-emerald-500"/> {data.batch_year}
                       </span>
                     )}
                     {data.favorite_subject && (
                       <span className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-full bg-white shadow-sm text-[10px] sm:text-[11px] font-bold text-neutral-600 uppercase tracking-wider flex items-center gap-1.5">
                         <Star size={12} className="text-amber-500" fill="currentColor"/> {data.favorite_subject}
                       </span>
                     )}
                   </div>
                   
                   {data.website && (
                     <a href={data.website} target="_blank" rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 mt-4 sm:mt-5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-white border border-emerald-100 text-[10px] sm:text-xs font-black uppercase text-emerald-600 hover:bg-emerald-50 transition-colors shadow-sm group">
                       <Globe size={14} className="group-hover:rotate-12 transition-transform" />
                       Visit Portfolio
                     </a>
                   )}
                </div>
              </div>
           </div>
        </div>

        {/* SOCIAL PRESENCE */}
        {data?.platforms && data?.platforms?.length > 0 && (
          <div className="w-full mb-10">
            <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-4 sm:mb-6 px-2 text-center">Digital Footprint</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
              {data.platforms.map((p: any, i: number) => {
                const pData = getPlatformData(p.platform);
                return (
                  <a 
                    key={i}
                    href={p.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center justify-center gap-3 p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] bg-white border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${pData.hoverBorder} transition-all duration-300 group`}
                  >
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center ${pData.bg} ${pData.text} group-hover:scale-110 transition-transform duration-300`}>
                      {pData.icon}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover:${pData.text} transition-colors`}>{p.platform}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* INNOVATION LAB */}
        {data?.projects && data?.projects?.length > 0 && (
          <div className="w-full mb-10">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                <Rocket size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] text-neutral-900">Innovation Lab</h4>
                <p className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">Featured Projects & Builds</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:gap-6">
              {data.projects.map((p, i) => (
                <div key={i} className="bg-white p-5 sm:p-6 rounded-3xl sm:rounded-[2rem] border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                    <div className="w-full h-32 sm:w-28 sm:h-28 rounded-2xl sm:rounded-[1.5rem] bg-neutral-50 overflow-hidden shrink-0 border border-neutral-100 flex items-center justify-center relative">
                      {p.url ? (
                        <img src={getAssetUrl(p.url)} className="w-full h-full object-cover" alt={p.name} />
                      ) : (
                        <span className="text-4xl sm:text-5xl">{p.emoji || '🚀'}</span>
                      )}
                      {p.github_url && (
                        <a href={p.github_url} target="_blank" rel="noopener noreferrer" 
                           className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-neutral-700 hover:text-black hover:scale-110 transition-all">
                          <Github size={14} className="sm:w-4 sm:h-4" />
                        </a>
                      )}
                    </div>
                    
                    <div className="flex-1 text-left flex flex-col justify-center">
                      <div className="mb-3 sm:mb-4">
                        <h5 className="font-black text-neutral-900 text-lg sm:text-xl tracking-tight mb-1 sm:mb-1.5 group-hover:text-blue-500 transition-colors">{p.name}</h5>
                        {p.description && (
                          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-medium line-clamp-2">
                            {p.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {p.tech?.map(t => (
                          <span key={t} className="text-[9px] sm:text-[10px] font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg bg-neutral-50 text-neutral-600 border border-neutral-100 uppercase tracking-wider">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CORE SKILLS / SUPERPOWERS (New High-Value Field) */}
        {data.core_skills && data.core_skills.length > 0 && (
          <div className="w-full mb-10">
            <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-4 sm:mb-6 px-2 text-center">Core Superpowers</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {data.core_skills.map((skill: string, i: number) => (
                <span key={i} className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] sm:text-xs font-black text-indigo-600 tracking-wider flex items-center gap-2 shadow-sm">
                  <Zap size={14} className="text-indigo-400" /> {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* HOBBIES & INTERESTS */}
        {data.hobbies && data.hobbies.length > 0 && (
          <div className="w-full mb-10">
            <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-4 sm:mb-6 px-2 text-center">Hobbies & Interests</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {data.hobbies.map((hobby: string, i: number) => (
                <span key={i} className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-rose-50 border border-rose-100 text-[11px] sm:text-xs font-black text-rose-600 tracking-wider flex items-center gap-2 shadow-sm">
                  <Heart size={14} className="text-rose-400" /> {hobby}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* COMPACT CAMPUS VIBES -> PLAYLIST (Redesigned & Shrunk) */}
        {(data.playlist_url || data.playlist_name) && (
          <div className="w-full mb-10">
            <div className="bg-[#1A1A1A] p-4 sm:p-5 rounded-3xl sm:rounded-[2rem] shadow-xl relative overflow-hidden flex items-center justify-between gap-4">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Music size={100} className="text-white" />
              </div>
              
              <div className="relative z-10 flex items-center gap-3 sm:gap-4 overflow-hidden">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                  <Music size={16} className="text-emerald-400 sm:w-5 sm:h-5" />
                </div>
                <div className="flex flex-col justify-center text-left min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-0.5 truncate">On Repeat</p>
                  <p className="text-sm sm:text-base font-bold text-white truncate max-w-[150px] sm:max-w-xs">
                    {data.playlist_name || 'My Campus Playlist'}
                  </p>
                </div>
              </div>

              <div className="relative p-1.5 bg-white rounded-xl shadow-lg shrink-0 z-10 hover:scale-105 transition-transform duration-300">
                <div className="rounded-lg overflow-hidden border border-neutral-100 w-[60px] h-[60px] sm:w-[70px] sm:h-[70px]">
                  {data.playlist_url ? (
                    <QRCodeSVG 
                      value={data.playlist_url} 
                      width="100%"
                      height="100%"
                      level="H" 
                      includeMargin={false}
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-50">
                      <QrCode size={24} className="text-neutral-300" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROFESSIONAL GATEWAY */}
        {(data.resume || data.resume_url) && (
          <div className="w-full mb-10">
            <a href={getAssetUrl(data.resume || data.resume_url || '')} target="_blank" rel="noopener noreferrer" 
               className="bg-white p-5 sm:p-6 rounded-3xl sm:rounded-[2rem] border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center justify-between group transition-all">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-[1rem] bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] sm:text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Professional Gateway</span>
                  <p className="text-sm sm:text-base font-black text-neutral-900 mt-0.5 sm:mt-1">View Academic Resume</p>
                </div>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <ExternalLink size={16} />
              </div>
            </a>
          </div>
        )}

        {/* EVENTS & ACHIEVEMENTS BUNDLE */}
        {((data?.hackathons && data.hackathons.length > 0) || (data?.clubs && data.clubs.length > 0)) && (
          <div className="w-full mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Hackathons */}
            {data.hackathons && data.hackathons.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-neutral-100 shadow-sm text-left">
                <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-4 sm:mb-5 flex items-center gap-2">
                  <Trophy size={14} className="text-rose-400" /> Events
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.hackathons.map((h: any) => {
                    const name = typeof h === 'string' ? h : h.name;
                    return (
                      <span key={name} className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-neutral-50 border border-neutral-100 text-[10px] sm:text-[11px] font-bold text-neutral-700 tracking-wide">
                        {name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Clubs */}
            {data.clubs && data.clubs.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-neutral-100 shadow-sm text-left">
                <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-4 sm:mb-5 flex items-center gap-2">
                  <Users size={14} className="text-blue-400" /> Clubs & Societies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.clubs.map((club: any) => {
                    const name = typeof club === 'string' ? club : club.name;
                    return (
                      <span key={name} className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-neutral-50 border border-neutral-100 text-[10px] sm:text-[11px] font-bold text-neutral-700 tracking-wide">
                        {name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ACTION BUTTONS */}
        {(data.contact_email || data.quick_talk_url) && (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 w-full max-w-sm sm:max-w-md mx-auto mt-6 sm:mt-8">
            {data.contact_email ? (
              <a href={`mailto:${data.contact_email}`} className="bg-neutral-900 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-black text-[10px] sm:text-xs uppercase tracking-[0.15em] hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <Mail size={16} /> Email
              </a>
            ) : <div />}
            
            {data.quick_talk_url ? (
              <a href={data.quick_talk_url} target="_blank" rel="noopener noreferrer" className="bg-white text-neutral-900 py-3.5 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-black text-[10px] sm:text-xs uppercase tracking-[0.15em] border-2 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <Calendar size={16} /> Quick Talk
              </a>
            ) : <div />}
          </div>
        )}

      </main>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(10deg); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

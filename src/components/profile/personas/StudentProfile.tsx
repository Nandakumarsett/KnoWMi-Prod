import React from 'react'
import { ProfileData, StudentData } from '../../../types/profile'
import { ProfileAvatar } from '../shared/ProfileAvatar'
import { 
  GraduationCap, BookOpen, Rocket, FileText, 
  Globe, Music, Sparkles, Heart, Star, Users,
  Share2, UserPlus, QrCode, ExternalLink, Github, Linkedin, Twitter, Instagram,
  MessageCircle, Link as LinkIcon, Trophy, Target, Briefcase, Zap, Mail, Calendar, Ghost, Activity, X, Lock
} from 'lucide-react'
import { getAssetUrl } from '../../../lib/supabase'
import { QRCodeSVG } from 'qrcode.react'
import { ProfileCTAs } from '../shared/ProfileCTAs'
import { trackLinkClick } from '../../../lib/analytics/track'
import { useGatedLink } from '../../../hooks/useGatedLink'

const getTheme = (themeName?: string) => {
  switch (themeName?.toLowerCase()) {
    case 'campus':
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        textMain: 'text-blue-950',
        textSec: 'text-blue-700/80',
        accentText: 'text-blue-600',
        accentBg: 'bg-blue-600',
        accentGradient: 'linear-gradient(135deg, #2563eb, #60a5fa)',
        cardBg: 'bg-white',
        cardBorder: 'border-blue-100',
        cardBgLight: 'bg-blue-100/50',
        cardBgLighter: 'bg-blue-50',
        cardBorderLight: 'border-blue-200/50',
        playlistBg: 'bg-blue-950',
      };
    case 'night owl':
      return {
        bg: 'bg-slate-950',
        border: 'border-indigo-900/50',
        textMain: 'text-indigo-50',
        textSec: 'text-indigo-200/70',
        accentText: 'text-indigo-400',
        accentBg: 'bg-indigo-600',
        accentGradient: 'linear-gradient(135deg, #4f46e5, #818cf8)',
        cardBg: 'bg-slate-900',
        cardBorder: 'border-indigo-900/30',
        cardBgLight: 'bg-slate-800',
        cardBgLighter: 'bg-slate-900',
        cardBorderLight: 'border-indigo-900/30',
        playlistBg: 'bg-indigo-950',
      };
    case 'notebook':
    default:
      return {
        bg: 'bg-[#FAFAFA]',
        border: 'border-[#E5D5C4]',
        textMain: 'text-neutral-900',
        textSec: 'text-neutral-500',
        accentText: 'text-emerald-500',
        accentBg: 'bg-emerald-500',
        accentGradient: 'linear-gradient(135deg, #059669, #34D399)',
        cardBg: 'bg-white',
        cardBorder: 'border-neutral-100',
        cardBgLight: 'bg-emerald-50',
        cardBgLighter: 'bg-teal-50',
        cardBorderLight: 'border-emerald-100/50',
        playlistBg: 'bg-[#1A1A1A]',
      };
  }
};

export function StudentProfile({ profile, stats }: { profile: ProfileData, stats?: any }) {
  const data = (profile.persona_data || {}) as StudentData;
  const t = getTheme(profile.profile_theme);
  const { isGated, handleGatedClick, GateModal } = useGatedLink();
  const liveViews = stats?.totalViews || 0;
  const isFreeProfile = profile.tier === 'Starter' || profile.tier === 'Free' || profile.status === 'free' || (!profile.status && (!profile.tier || profile.tier === 'Starter'));
  const [showFomoModal, setShowFomoModal] = React.useState(false);
  
  if (!data || Object.keys(data).length === 0) {
    return <div className="p-10 text-center text-neutral-400 font-medium text-sm">Loading student identity...</div>
  }
  
  const getPlatformData = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return { icon: <Github size={20} />, color: '#181717', bg: 'bg-[#181717]/5', text: 'text-[#181717]', hoverBorder: 'hover:border-[#181717]/30' };
    if (p.includes('linkedin')) return { icon: <Linkedin size={20} />, color: '#0077B5', bg: 'bg-[#0077B5]/10', text: 'text-[#0077B5]', hoverBorder: 'hover:border-[#0077B5]/30' };
    if (p.includes('twitter') || p.includes('x')) return { icon: <Twitter size={20} />, color: '#1DA1F2', bg: 'bg-[#1DA1F2]/10', text: 'text-[#1DA1F2]', hoverBorder: 'hover:border-[#1DA1F2]/30' };
    if (p.includes('instagram')) return { icon: <Instagram size={20} />, color: '#E4405F', bg: 'bg-[#E4405F]/10', text: 'text-[#E4405F]', hoverBorder: 'hover:border-[#E4405F]/30' };
    if (p.includes('snapchat')) return { icon: <Ghost size={20} />, color: '#FFFC00', bg: 'bg-[#FFFC00]/20', text: t.textMain, hoverBorder: 'hover:border-[#FFFC00]/50' };
    if (p.includes('discord')) return { icon: <MessageCircle size={20} />, color: '#5865F2', bg: 'bg-[#5865F2]/10', text: 'text-[#5865F2]', hoverBorder: 'hover:border-[#5865F2]/30' };
    if (p.includes('behance')) return { icon: <LinkIcon size={20} />, color: '#1769FF', bg: 'bg-[#1769FF]/10', text: 'text-[#1769FF]', hoverBorder: 'hover:border-[#1769FF]/30' };
    if (p.includes('medium')) return { icon: <LinkIcon size={20} />, color: '#000000', bg: 'bg-neutral-100', text: 'text-black', hoverBorder: 'hover:border-black/30' };
    return { icon: <LinkIcon size={20} />, color: '#10B981', bg: 'bg-emerald-50', text: t.accentText, hoverBorder: 'hover:border-emerald-500/30' };
  };

  const BackgroundPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0" 
         style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
  );

  return (
    <div className={`w-full min-h-screen relative overflow-x-hidden ${t.bg} ${t.textMain} transition-colors duration-300 pb-20`}>
      <BackgroundPattern />

      {/* Floating Sparkles Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-40">
        <div className="absolute top-[10%] left-[5%] animate-float-slow text-neutral-300">🎓</div>
        <div className="absolute top-[22%] right-[8%] animate-float-medium text-neutral-300">💡</div>
        <div className="absolute top-[40%] left-[8%] animate-float-fast text-neutral-300">📚</div>
        <div className="absolute top-[60%] right-[6%] animate-float-slow text-neutral-300">🚀</div>
        <div className="absolute top-[78%] left-[10%] animate-float-medium text-neutral-300">✨</div>
      </div>

      {/* Hero Banner Section */}
      <div className="w-full h-44 sm:h-56 relative overflow-hidden bg-neutral-100 rounded-t-[32px] sm:rounded-t-[40px] z-10 border-b border-neutral-200/40">
        {data.featured_work_url ? (
          <img src={getAssetUrl(data.featured_work_url)} className="w-full h-full object-cover" alt="Banner" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-400 via-teal-300 to-blue-400 flex items-center justify-center">
            <Sparkles size={48} className="text-white/30" />
          </div>
        )}
        <div className={`absolute inset-0 bg-gradient-to-t ${t.bg === 'bg-slate-950' ? 'from-slate-950' : 'from-[#FAFAFA]'} via-transparent to-transparent opacity-90`} />
      </div>

      <main className="relative z-10 max-w-2xl mx-auto px-5 sm:px-8 -mt-20 sm:-mt-24 pb-24 flex flex-col items-center">
        
        {/* AVATAR & IDENTITY */}
        <div className="flex flex-col items-center w-full mb-4">
          <div className="relative mb-5 group flex items-center justify-center">
            {/* Mood Bubble */}
            {data.mood && (
              <div className="absolute -right-8 -top-2 sm:-right-12 sm:-top-2 z-30 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className={`relative ${t.bg === 'bg-slate-950' ? 'bg-slate-900 border-indigo-900/50 text-indigo-400' : 'bg-white border-emerald-100 text-emerald-600'} border-2 rounded-2xl px-3 py-2 shadow-xl flex items-center gap-1.5`}>
                  <span className="text-xs sm:text-sm font-black uppercase tracking-widest whitespace-nowrap">{data.mood}</span>
                  <div className={`absolute -left-1.5 bottom-3 w-3 h-3 ${t.bg === 'bg-slate-950' ? 'bg-slate-900 border-l-2 border-b-2 border-indigo-900/50' : 'bg-white border-l-2 border-b-2 border-emerald-100'} rotate-45 rounded-sm`} />
                </div>
              </div>
            )}

            {/* Avatar Container */}
            <div 
              className="w-40 h-40 sm:w-48 sm:h-48 p-1.5 rounded-full shadow-[0_20px_50px_rgba(16,185,129,0.2)] relative z-10 transition-transform duration-500 group-hover:scale-105 mx-auto flex items-center justify-center"
              style={{ background: t.accentGradient }}
            >
              <div className={`w-full h-full ${t.bg === 'bg-slate-950' ? 'bg-slate-900' : 'bg-white'} p-1 rounded-full overflow-hidden shadow-inner flex items-center justify-center relative`}>
                {profile.avatar_url ? (
                  <img 
                    src={getAssetUrl(profile.avatar_url)} 
                    alt={profile.display_name} 
                    className="w-full h-full object-cover rounded-full" 
                  />
                ) : (
                  <div className={`w-full h-full rounded-full flex items-center justify-center ${t.accentBg} text-white font-black text-4xl sm:text-5xl`}>
                    {profile.display_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </div>

            {/* Total Pulse Badge */}
            <div 
              className={`absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 z-40 ${isFreeProfile ? 'cursor-pointer hover:opacity-85 transition-opacity' : ''}`}
              onClick={() => isFreeProfile && setShowFomoModal(true)}
            >
              <div className={`bg-neutral-900 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 whitespace-nowrap`}>
                <Activity size={14} className="text-emerald-400 sm:w-4 sm:h-4 animate-pulse" />
                <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] ${isFreeProfile ? 'blur-[3px] select-none opacity-60 inline-block px-1' : ''}`}>{isFreeProfile ? '820' : liveViews} Pulse</span>
              </div>
            </div>
          </div>

          <div className="text-center w-full">
            <h1 className={`text-2xl sm:text-4xl leading-tight font-black ${t.textMain} tracking-tight mb-1.5`}>
              {profile.display_name}
            </h1>
            <p className={`${t.accentText} font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-1.5`}>
              <GraduationCap size={18} /> {data.university ? `Student @ ${data.university}` : 'Student'}
            </p>
          </div>
        </div>

        {/* BIO */}
        {data.bio && (
          <div className="w-full max-w-md mx-auto text-center mb-8 -mt-2">
            <p className={`text-sm sm:text-[15px] ${t.textSec} leading-relaxed font-medium`}>
              "{data.bio}"
            </p>
          </div>
        )}

        {/* Connection CTAs */}
        <div className="w-full max-w-sm mb-8 z-20">
          <ProfileCTAs profile={profile} accentColor={t.accentBg.includes('emerald') ? '#10B981' : t.accentBg.includes('blue') ? '#2563eb' : '#4f46e5'} />
        </div>

        {/* OPEN TO */}
        {data.availability && (
          <div className="w-full max-w-md mx-auto mb-10">
            <div className={`text-white rounded-[1.5rem] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 shadow-[0_8px_30px_rgba(16,185,129,0.2)]`} style={{ background: t.accentGradient }}>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Briefcase size={20} className="text-white" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/80 mb-0.5">Currently Open To</p>
                <p className="text-sm sm:text-base font-black tracking-wide">{data.availability}</p>
              </div>
            </div>
          </div>
        )}

        {/* STATS ROW */}
        {(data.campus_rank_pct || data.study_buddies) && (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 w-full mb-10">
            {data.campus_rank_pct && (
              <div className={`${t.cardBg} p-5 sm:p-6 rounded-3xl sm:rounded-[2rem] border ${t.cardBorder} shadow-sm text-center flex flex-col justify-center transition-all hover:shadow-md`}>
                <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${t.textSec} mb-1.5 sm:mb-2`}>Campus Rank</p>
                <div className={`text-xl sm:text-2xl font-black ${t.textMain} flex items-center justify-center gap-1.5 sm:gap-2`}>
                  Top {data.campus_rank_pct}% 
                  <Trophy size={18} className="text-amber-400" />
                </div>
              </div>
            )}
            {data.study_buddies && (
              <div className={`${t.cardBg} p-5 sm:p-6 rounded-3xl sm:rounded-[2rem] border ${t.cardBorder} shadow-sm text-center flex flex-col justify-center transition-all hover:shadow-md`}>
                <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${t.textSec} mb-1.5 sm:mb-2`}>Study Buddies</p>
                <div className={`text-xl sm:text-2xl font-black ${t.textMain} flex items-center justify-center gap-1.5 sm:gap-2`}>
                  {data.study_buddies}
                  <Users size={18} className={t.accentText} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ABOUT ME */}
        {data.about_me && (
          <div className="w-full mb-10">
            <div className={`${t.cardBg} p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border ${t.cardBorder} shadow-sm relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-6 sm:p-8 opacity-5">
                <BookOpen size={80} className="sm:w-[120px] sm:h-[120px]" />
              </div>
              <div className="relative z-10">
                <h4 className={`text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] ${t.textSec} mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${t.accentBg}`} /> The Story
                </h4>
                <p className={`text-sm sm:text-[15px] ${t.textSec} leading-relaxed sm:leading-loose font-medium text-left`}>
                  {data.about_me}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ACADEMIC CORE */}
        {(data.course || data.year || data.batch_year || data.favorite_subject || data.website) && (
          <div className="w-full mb-10">
             <div className={`${t.cardBgLight} p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border ${t.cardBorderLight} shadow-sm relative overflow-hidden`}>
                <div className="absolute -right-6 -bottom-6 opacity-10">
                  <GraduationCap size={120} className="sm:w-[160px] sm:h-[160px]" />
                </div>
                
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${t.cardBg} shadow-sm ${t.accentText} flex items-center justify-center shrink-0`}>
                     <GraduationCap size={28} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 text-left">
                     <h4 className={`text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] ${t.accentText} mb-2`}>Academic Core</h4>
                     {data.course && (
                       <h3 className={`text-lg sm:text-xl font-black ${t.textMain} leading-tight mb-2`}>
                         {data.course}
                       </h3>
                     )}
                     <div className="flex flex-wrap items-center gap-2 mt-3">
                       {data.year && (
                         <span className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-full ${t.cardBg} shadow-sm text-[10px] sm:text-[11px] font-bold ${t.textSec} uppercase tracking-wider`}>
                           {data.year}
                         </span>
                       )}
                       {data.batch_year && (
                         <span className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-full ${t.cardBg} shadow-sm text-[10px] sm:text-[11px] font-bold ${t.textSec} uppercase tracking-wider flex items-center gap-1.5`}>
                           <Target size={12} className={t.accentText}/> {data.batch_year}
                         </span>
                       )}
                       {data.favorite_subject && (
                         <span className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-full ${t.cardBg} shadow-sm text-[10px] sm:text-[11px] font-bold ${t.textSec} uppercase tracking-wider flex items-center gap-1.5`}>
                           <Star size={12} className="text-amber-500" fill="currentColor"/> {data.favorite_subject}
                         </span>
                       )}
                     </div>
                     
                     {data.website && (
                       <a href={data.website} target="_blank" rel="noopener noreferrer" 
                          className={`inline-flex items-center gap-2 mt-4 sm:mt-5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl ${t.cardBg} border ${t.cardBorder} text-[10px] sm:text-xs font-black uppercase ${t.accentText} hover:opacity-90 transition-colors shadow-sm group`}>
                         <Globe size={14} className="group-hover:rotate-12 transition-transform" />
                         Visit Portfolio
                       </a>
                     )}
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* SOCIAL PRESENCE */}
        {data?.platforms && data?.platforms?.length > 0 && (
          <div className="w-full mb-10">
            <h4 className={`text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] ${t.textSec} mb-4 sm:mb-6 px-2 text-center`}>Digital Footprint</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
              {data.platforms.map((p: any, i: number) => {
                const pData = getPlatformData(p.platform);
                const ensureAbsoluteUrl = (url: string) => {
                  if (!url) return '';
                  if (url.startsWith('http://') || url.startsWith('https://')) return url;
                  return `https://${url}`;
                };

                return (
                  <a 
                    key={i}
                    href={ensureAbsoluteUrl(p.url)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center justify-center gap-3 p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] ${t.cardBg} border ${t.cardBorder} shadow-sm hover:shadow-md transition-all duration-300 group relative social-link-item`}
                    onClick={(e) => {
                      handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url));
                      if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank');
                    }}
                  >
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center ${pData.bg} ${pData.text} group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}>
                      {pData.icon}
                      {isGated && (
                        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-black/20 flex items-center justify-center">
                          <Lock size={18} className="text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]" strokeWidth={2.5} />
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${t.textSec} group-hover:text-neutral-900 transition-colors`}>{p.platform}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {profile.ghost_mode && (
          <div className="w-full text-center mt-2 mb-8 animate-fadeIn">
            <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/5 text-red-500 text-[9px] font-black uppercase tracking-widest shadow-sm">
              <Lock size={12} /> Private Mode activated by Owner
            </p>
          </div>
        )}

        {/* INNOVATION LAB */}
        {data?.projects && data?.projects?.length > 0 && (
          <div className="w-full mb-10">
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-2">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${t.cardBgLight} ${t.accentText} flex items-center justify-center`}>
                <Rocket size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <h4 className={`text-xs sm:text-sm font-black uppercase tracking-[0.15em] ${t.textMain}`}>Innovation Lab</h4>
                <p className={`text-[9px] sm:text-[10px] font-bold ${t.textSec} uppercase tracking-widest mt-0.5`}>Featured Projects & Builds</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:gap-6">
              {data.projects.map((p, i) => (
                <div key={i} className={`${t.cardBg} p-5 sm:p-6 rounded-3xl sm:rounded-[2rem] border ${t.cardBorder} shadow-sm hover:shadow-md transition-all group`}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                    <div className={`w-full h-32 sm:w-28 sm:h-28 rounded-2xl sm:rounded-[1.5rem] ${t.bg === 'bg-slate-950' ? 'bg-slate-800' : 'bg-neutral-50'} overflow-hidden shrink-0 border ${t.cardBorder} flex items-center justify-center relative`}>
                      {p.url ? (
                        <img src={getAssetUrl(p.url)} className="w-full h-full object-cover" alt={p.name} />
                      ) : (
                        <span className="text-4xl sm:text-5xl">{p.emoji || '🚀'}</span>
                      )}
                      {p.github_url && (
                        <a href={p.github_url} target="_blank" rel="noopener noreferrer" 
                           className={`absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full ${t.cardBg} shadow-sm flex items-center justify-center ${t.textSec} hover:${t.textMain} hover:scale-110 transition-all`}>
                          <Github size={14} className="sm:w-4 sm:h-4" />
                        </a>
                      )}
                    </div>
                    
                    <div className="flex-1 text-left flex flex-col justify-center">
                      <div className="mb-3 sm:mb-4">
                        <h5 className={`font-black ${t.textMain} text-lg sm:text-xl tracking-tight mb-1 sm:mb-1.5 group-hover:${t.accentText} transition-colors`}>{p.name}</h5>
                        {p.description && (
                          <p className={`text-xs sm:text-sm ${t.textSec} leading-relaxed font-medium line-clamp-2`}>
                            {p.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {p.tech?.map(tech => (
                          <span key={tech} className={`text-[9px] sm:text-[10px] font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg ${t.bg === 'bg-slate-950' ? 'bg-slate-850' : 'bg-neutral-50'} ${t.textSec} border ${t.cardBorder} uppercase tracking-wider`}>
                            {tech}
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

        {/* CORE SKILLS */}
        {data.core_skills && data.core_skills.length > 0 && (
          <div className="w-full mb-10">
            <h4 className={`text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] ${t.textSec} mb-4 sm:mb-6 px-2 text-center`}>Core Superpowers</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {data.core_skills.map((skill: string, i: number) => (
                <span key={i} className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full ${t.cardBgLight} border ${t.cardBorderLight} text-[11px] sm:text-xs font-black ${t.accentText} tracking-wider flex items-center gap-2 shadow-sm`}>
                  <Zap size={14} className="opacity-70" /> {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* HOBBIES & INTERESTS */}
        {data.hobbies && data.hobbies.length > 0 && (
          <div className="w-full mb-10">
            <h4 className={`text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] ${t.textSec} mb-4 sm:mb-6 px-2 text-center`}>Hobbies & Interests</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {data.hobbies.map((hobby: string, i: number) => (
                <span key={i} className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-rose-50/10 border border-rose-100/20 text-[11px] sm:text-xs font-black text-rose-400 tracking-wider flex items-center gap-2 shadow-sm`}>
                  <Heart size={14} className="text-rose-400" /> {hobby}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* PLAYLIST */}
        {(data.playlist_url || data.playlist_name) && (
          <div className="w-full mb-10">
            <div className={`${t.playlistBg} p-4 sm:p-5 rounded-3xl sm:rounded-[2rem] shadow-xl relative overflow-hidden flex items-center justify-between gap-4`}>
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Music size={100} className="text-white" />
              </div>
              
              <div className="relative z-10 flex items-center gap-3 sm:gap-4 overflow-hidden">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                  <Music size={16} className={`${t.accentText} sm:w-5 sm:h-5`} />
                </div>
                <div className="flex flex-col justify-center text-left min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-0.5 truncate">On Repeat</p>
                  <p className="text-sm sm:text-base font-bold text-white truncate max-w-[150px] sm:max-w-xs">
                    {data.playlist_name || 'My Campus Playlist'}
                  </p>
                </div>
              </div>

              <div className="relative p-1.5 bg-white rounded-xl shadow-lg shrink-0 z-10 hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                <div className="rounded-lg overflow-hidden border border-neutral-100 w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] relative flex items-center justify-center">
                  {data.playlist_url ? (
                    <QRCodeSVG 
                      value={data.playlist_url} 
                      width="100%"
                      height="100%"
                      level="M" 
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
               className={`${t.cardBg} p-5 sm:p-6 rounded-3xl sm:rounded-[2rem] border ${t.cardBorder} hover:shadow-md flex items-center justify-between group transition-all`}>
              <div className="flex items-center gap-4 sm:gap-5">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-[1rem] ${t.cardBgLight} ${t.accentText} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <FileText size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div className="text-left">
                  <span className={`text-[9px] sm:text-[10px] font-black ${t.textSec} uppercase tracking-[0.2em]`}>Professional Gateway</span>
                  <p className={`text-sm sm:text-base font-black ${t.textMain} mt-0.5 sm:mt-1`}>View Academic Resume</p>
                </div>
              </div>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${t.cardBgLight} flex items-center justify-center ${t.accentText} group-hover:bg-indigo-600 group-hover:text-white transition-colors`}>
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
              <div className={`${t.cardBg} p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border ${t.cardBorder} shadow-sm text-left`}>
                <h4 className={`text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] ${t.textSec} mb-4 sm:mb-5 flex items-center gap-2`}>
                  <Trophy size={14} className="text-rose-400" /> Events
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.hackathons.map((h: any) => {
                    const name = typeof h === 'string' ? h : h.name;
                    return (
                      <span key={name} className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl ${t.bg === 'bg-slate-950' ? 'bg-slate-800' : 'bg-neutral-50'} border ${t.cardBorder} text-[10px] sm:text-[11px] font-bold ${t.textMain} tracking-wide`}>
                        {name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Clubs */}
            {data.clubs && data.clubs.length > 0 && (
              <div className={`${t.cardBg} p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border ${t.cardBorder} shadow-sm text-left`}>
                <h4 className={`text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] ${t.textSec} mb-4 sm:mb-5 flex items-center gap-2`}>
                  <Users size={14} className="text-blue-400" /> Clubs & Societies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.clubs.map((club: any) => {
                    const name = typeof club === 'string' ? club : club.name;
                    return (
                      <span key={name} className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl ${t.bg === 'bg-slate-950' ? 'bg-slate-800' : 'bg-neutral-50'} border ${t.cardBorder} text-[10px] sm:text-[11px] font-bold ${t.textMain} tracking-wide`}>
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
              <a href={`mailto:${data.contact_email}`} className={`bg-neutral-900 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-black text-[10px] sm:text-xs uppercase tracking-[0.15em] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md`}>
                <Mail size={16} /> Email
              </a>
            ) : <div />}
            
            {data.quick_talk_url ? (
              <a href={data.quick_talk_url} target="_blank" rel="noopener noreferrer" className={`py-3.5 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-black text-[10px] sm:text-xs uppercase tracking-[0.15em] border-2 ${t.cardBorder} hover:opacity-95 ${t.cardBg} ${t.textMain} active:scale-[0.98] transition-all flex items-center justify-center gap-2`}>
                <Calendar size={16} /> Quick Talk
              </a>
            ) : <div />}
          </div>
        )}

      </main>

      {/* Interactive FOMO Upsell Modal */}
      {showFomoModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className={`rounded-[32px] p-8 max-w-sm w-full border ${t.cardBorder} ${t.bg === 'bg-slate-950' ? 'bg-slate-900 text-indigo-100' : 'bg-white text-neutral-900'} shadow-2xl relative animate-zoomIn text-center`}>
            <button 
              onClick={() => setShowFomoModal(false)}
              className={`absolute top-4 right-4 p-2 text-neutral-400 hover:${t.textSec} rounded-full hover:bg-neutral-50/10 transition-all`}
            >
              <X size={20} />
            </button>
            
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className={`absolute inset-0 ${t.accentBg}/10 rounded-full blur-xl animate-pulse`} />
              <div className={`w-16 h-16 ${t.cardBgLight} ${t.accentText} rounded-2xl flex items-center justify-center shadow-inner`}>
                <Activity size={32} className="animate-pulse" />
              </div>
            </div>
            
            <h3 className={`text-xl font-black ${t.textMain} tracking-tight mb-2`}>Unlock Profile Analytics</h3>
            <p className={`text-xs font-bold ${t.textSec} mb-6 leading-relaxed`}>
              Your profile is actively receiving connections! Upgrading to a premium plan unlocks these features instantly:
            </p>
            
            <ul className="text-left space-y-3 mb-8 pl-4">
              <li className={`text-xs font-bold ${t.textSec} flex items-center gap-2`}>
                <span className="text-emerald-500 font-black">✓</span> 📈 Real-Time View Count Tracking
              </li>
              <li className={`text-xs font-bold ${t.textSec} flex items-center gap-2`}>
                <span className="text-emerald-500 font-black">✓</span> 📍 Global & Local City-by-City Scans
              </li>
              <li className={`text-xs font-bold ${t.textSec} flex items-center gap-2`}>
                <span className="text-emerald-500 font-black">✓</span> 📱 Detailed Browser & Device Insights
              </li>
              <li className={`text-xs font-bold ${t.textSec} flex items-center gap-2`}>
                <span className="text-emerald-500 font-black">✓</span> 👥 Unique vs. Repeat Visitor Scoring
              </li>
            </ul>
            
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = '/#pricing'}
                className={`w-full py-3.5 ${t.accentBg} text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-[0.98]`}
              >
                🔒 Buy A Tee to Unlock
              </button>
              <button 
                onClick={() => setShowFomoModal(false)}
                className={`w-full py-3 text-neutral-400 hover:${t.textSec} font-bold text-xs uppercase tracking-wider transition-colors`}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

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
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-zoomIn {
          animation: zoomIn 0.3s ease-out forwards;
        }
      `}</style>
      <GateModal />
    </div>
  )
}

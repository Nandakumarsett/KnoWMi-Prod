import React from 'react'
import { ProfileData, StudentData } from '../../../types/profile'
import { 
  GraduationCap, BookOpen, Rocket, FileText, 
  Globe, Music, Sparkles, Heart, Star, Users,
  Share2, UserPlus, QrCode as QrCodeIcon, ExternalLink, Github, Linkedin, Twitter, Instagram,
  MessageCircle, Link as LinkIcon, Trophy, Target, Briefcase, Zap, Mail, Calendar, Ghost, Activity, X, Lock
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { getAssetUrl } from '../../../lib/supabase'
import { ProfileCTAs } from '../shared/ProfileCTAs'
import { trackLinkClick } from '../../../lib/analytics/track'
import { useGatedLink } from '../../../hooks/useGatedLink'

const PLATFORM_ICONS: Record<string, any> = {
  instagram: Instagram,
  twitter: Twitter,
  'twitter / x': Twitter,
  linkedin: Linkedin,
  github: Github,
  snapchat: Ghost,
  discord: MessageCircle,
  behance: LinkIcon,
  medium: LinkIcon,
  youtube: LinkIcon,
  facebook: LinkIcon
}

export function StudentProfile({ profile, stats }: { profile: ProfileData, stats?: any }) {
  const [avatarError, setAvatarError] = React.useState(false);
  const data = (profile.persona_data || {}) as StudentData;
  const activeTheme = (profile.profile_theme || 'default').toLowerCase();
  const { isGated, handleGatedClick, GateModal } = useGatedLink();
  const liveViews = stats?.totalViews || 0;
  const isFreeProfile = profile.tier === 'Starter' || profile.tier === 'Free' || profile.status === 'free' || (!profile.status && (!profile.tier || profile.tier === 'Starter'));
  const [showFomoModal, setShowFomoModal] = React.useState(false);
  const [showSpotifyQR, setShowSpotifyQR] = React.useState(false);
  
  if (!data || Object.keys(data).length === 0) {
    return <div className="p-10 text-center text-neutral-400 font-medium text-sm">Loading student identity...</div>
  }
  
  const getPlatformData = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return { icon: <Github size={18} />, color: '#181717', bg: 'bg-[#181717]/5', text: 'text-[#181717]', hoverBorder: 'hover:border-[#181717]/30', logo: 'github' };
    if (p.includes('linkedin')) return { icon: <Linkedin size={18} />, color: '#0077B5', bg: 'bg-[#0077B5]/10', text: 'text-[#0077B5]', hoverBorder: 'hover:border-[#0077B5]/30', logo: 'linkedin' };
    if (p.includes('twitter') || p.includes('x')) return { icon: <Twitter size={18} />, color: '#1DA1F2', bg: 'bg-[#1DA1F2]/10', text: 'text-[#1DA1F2]', hoverBorder: 'hover:border-[#1DA1F2]/30', logo: 'x' };
    if (p.includes('instagram')) return { icon: <Instagram size={18} />, color: '#E4405F', bg: 'bg-[#E4405F]/10', text: 'text-[#E4405F]', hoverBorder: 'hover:border-[#E4405F]/30', logo: 'instagram' };
    if (p.includes('snapchat')) return { icon: <Ghost size={18} />, color: '#FFFC00', bg: 'bg-[#FFFC00]/20', text: 'text-[#FFFC00]', hoverBorder: 'hover:border-[#FFFC00]/50', logo: 'snapchat' };
    if (p.includes('discord')) return { icon: <MessageCircle size={18} />, color: '#5865F2', bg: 'bg-[#5865F2]/10', text: 'text-[#5865F2]', hoverBorder: 'hover:border-[#5865F2]/30', logo: 'discord' };
    if (p.includes('behance')) return { icon: <LinkIcon size={18} />, color: '#1769FF', bg: 'bg-[#1769FF]/10', text: 'text-[#1769FF]', hoverBorder: 'hover:border-[#1769FF]/30', logo: 'behance' };
    if (p.includes('medium')) return { icon: <LinkIcon size={18} />, color: '#000000', bg: 'bg-neutral-100', text: 'text-black', hoverBorder: 'hover:border-black/30', logo: 'medium' };
    return { icon: <LinkIcon size={18} />, color: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-500', hoverBorder: 'hover:border-emerald-500/30', logo: '' };
  };

  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    return `https://${url}`
  }

  // ----------------------------------------------------
  // LAYOUT 0: ORIGINAL CLASSIC STYLE (Classic Theme)
  // ----------------------------------------------------
  if (activeTheme === 'classic') {
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
      <div className="w-full pb-12 relative overflow-hidden bg-[#FAFAFA] rounded-[40px] border border-[#E5D5C4] shadow-2xl font-sans min-h-screen">
        <BackgroundPattern />
        <BackgroundAnimation />

        <div className="relative h-48 sm:h-64 w-full bg-neutral-200 overflow-hidden rounded-t-[40px] shadow-sm">
          {data.featured_work_url ? (
            <img src={getAssetUrl(data.featured_work_url)} className="w-full h-full object-cover" alt="Profile Banner" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-400 via-teal-300 to-blue-400 flex items-center justify-center">
              <Sparkles size={48} className="text-white/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-transparent to-transparent opacity-90" />
        </div>

        <main className="relative z-10 max-w-2xl mx-auto px-5 sm:px-8 -mt-20 sm:-mt-24 pb-24 flex flex-col items-center">
          <div className="flex flex-col items-center w-full mb-4">
            <div className="relative mb-5 group flex items-center justify-center">
              {data.mood && (
                <div className="absolute -right-8 -top-2 sm:-right-12 sm:-top-2 z-30 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="relative bg-white border-2 border-emerald-100 rounded-2xl px-3 py-2 shadow-xl shadow-emerald-500/10 flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-black text-emerald-600 uppercase tracking-widest whitespace-nowrap">{data.mood}</span>
                    <div className="absolute -left-1.5 bottom-3 w-3 h-3 bg-white border-l-2 border-b-2 border-emerald-100 rotate-45 rounded-sm" />
                  </div>
                </div>
              )}

              <div 
                className="w-40 h-40 sm:w-48 sm:h-48 p-1.5 rounded-full shadow-[0_20px_50px_rgba(16,185,129,0.2)] relative z-10 mx-auto flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #059669, #34D399)' }}
              >
                <div className="w-full h-full bg-white p-1 rounded-full overflow-hidden shadow-inner flex items-center justify-center relative">
                  {!avatarError && profile.avatar_url ? (
                    <img src={getAssetUrl(profile.avatar_url)} alt={profile.display_name} className="w-full h-full object-cover rounded-full" onError={() => setAvatarError(true)} />
                  ) : (
                    <div className="w-full h-full object-cover rounded-full flex items-center justify-center bg-neutral-200 text-neutral-600 font-bold text-4xl rounded-full" style={{ fontFamily: 'sans-serif' }}>
                      {profile.display_name?.charAt(0).toUpperCase() || ''}
                    </div>
                  )}
                </div>
              </div>

              <div 
                className={`absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 z-40 ${isFreeProfile ? 'cursor-pointer hover:opacity-85 transition-opacity' : ''}`}
                onClick={() => isFreeProfile && setShowFomoModal(true)}
              >
                <div className="bg-neutral-900 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-lg shadow-emerald-900/10 border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
                  <Activity size={14} className="text-emerald-400 sm:w-4 sm:h-4 animate-pulse" />
                  <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] ${isFreeProfile ? 'blur-[3px] select-none opacity-60 inline-block px-1' : ''}`}>{liveViews} Pulse</span>
                </div>
              </div>
            </div>

            <div className="text-center w-full">
              <h1 className="text-2xl sm:text-4xl leading-tight font-black text-neutral-900 tracking-tight mb-1.5 flex items-center justify-center gap-3">
                {profile.display_name} {data.mood && <span className="text-2xl sm:text-3xl">{data.mood}</span>}
              </h1>
              <p className="text-emerald-500 font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-1.5">
                <GraduationCap size={18} /> {data.course || ''} {data.university ? `@ ${data.university}` : ''}
              </p>
            </div>
          </div>

          {profile.bio && (
            <div className="w-full max-w-md mx-auto text-center mb-8 -mt-2">
              <p className="text-sm sm:text-[15px] text-neutral-500 leading-relaxed font-medium">
                "{profile.bio}"
              </p>
            </div>
          )}

          <div className="w-full max-w-md mb-8 z-20 flex flex-col items-center gap-4">
            <div className="w-full max-w-sm">
              <ProfileCTAs profile={profile} accentColor="#10B981" />
            </div>
            {(data.resume_url || data.website) && (
              <div className="flex gap-3 mt-2">
                {data.resume_url && (
                  <a href={data.resume_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-bold text-[14px] hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20">
                    <FileText size={18} /> View Resume
                  </a>
                )}
                {data.website && (
                  <a href={ensureAbsoluteUrl(data.website)} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-neutral-800 text-white px-5 py-2.5 rounded-2xl font-bold text-[14px] hover:bg-neutral-900 transition-colors shadow-lg shadow-neutral-900/20">
                    <Globe size={18} /> Portfolio
                  </a>
                )}
              </div>
            )}
          </div>

          {data.availability && (
            <div className="w-full max-w-md mx-auto mb-10">
              <div className="bg-emerald-500 text-white rounded-[1.5rem] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 shadow-[0_8px_30px_rgba(16,185,129,0.2)] text-left">
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

          {(data.campus_rank_pct || data.study_buddies) && (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 w-full mb-10">
              {data.campus_rank_pct && (
                <div className="bg-white p-5 sm:p-6 rounded-3xl sm:rounded-[2rem] border border-neutral-100 shadow-sm text-center flex flex-col justify-center transition-all">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5 sm:mb-2">Campus Rank</p>
                  <div className="text-xl sm:text-2xl font-black text-neutral-900 flex items-center justify-center gap-1.5 sm:gap-2">
                    Top {data.campus_rank_pct}% <Trophy size={18} className="text-amber-400" />
                  </div>
                </div>
              )}
              {data.study_buddies && (
                <div className="bg-white p-5 sm:p-6 rounded-3xl sm:rounded-[2rem] border border-neutral-100 shadow-sm text-center flex flex-col justify-center transition-all">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5 sm:mb-2">Study Buddies</p>
                  <div className="text-xl sm:text-2xl font-black text-neutral-900 flex items-center justify-center gap-1.5 sm:gap-2">
                    {data.study_buddies} <Users size={18} className="text-emerald-400" />
                  </div>
                </div>
              )}
            </div>
          )}

          {(data.year || data.batch_year || data.courses_completed || data.favorite_subject) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 w-full mb-10">
              {data.year && (
                <div className="bg-white p-5 sm:p-6 rounded-3xl sm:rounded-[2rem] border border-neutral-100 shadow-sm text-center flex flex-col justify-center transition-all">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5 sm:mb-2">Year</p>
                  <div className="text-xl sm:text-2xl font-black text-neutral-900 flex items-center justify-center gap-1.5 sm:gap-2">
                    {data.year}
                  </div>
                </div>
              )}
              {data.batch_year && (
                <div className="bg-white p-5 sm:p-6 rounded-3xl sm:rounded-[2rem] border border-neutral-100 shadow-sm text-center flex flex-col justify-center transition-all">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5 sm:mb-2">Batch</p>
                  <div className="text-xl sm:text-2xl font-black text-neutral-900 flex items-center justify-center gap-1.5 sm:gap-2">
                    {data.batch_year}
                  </div>
                </div>
              )}
              {data.courses_completed && (
                <div className="bg-white p-5 sm:p-6 rounded-3xl sm:rounded-[2rem] border border-neutral-100 shadow-sm text-center flex flex-col justify-center transition-all">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5 sm:mb-2">Courses</p>
                  <div className="text-xl sm:text-2xl font-black text-neutral-900 flex items-center justify-center gap-1.5 sm:gap-2">
                    {data.courses_completed} <BookOpen size={18} className="text-blue-400" />
                  </div>
                </div>
              )}
              {data.favorite_subject && (
                <div className="bg-white p-5 sm:p-6 rounded-3xl sm:rounded-[2rem] border border-neutral-100 shadow-sm text-center flex flex-col justify-center transition-all">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1.5 sm:mb-2">Fav Subject</p>
                  <div className="text-lg sm:text-xl font-black text-neutral-900 flex items-center justify-center gap-1.5 sm:gap-2 leading-tight">
                    {data.favorite_subject}
                  </div>
                </div>
              )}
            </div>
          )}

          {profile.bio && (
            <div className="w-full mb-10">
              <div className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-neutral-100 shadow-sm relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 p-6 sm:p-8 opacity-5">
                  <BookOpen size={80} className="sm:w-[120px] sm:h-[120px]" />
                </div>
                <div className="relative z-10">
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-neutral-600 mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3">
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400" /> The Story
                  </h4>
                  <p className="text-sm sm:text-[15px] text-neutral-700 leading-relaxed sm:leading-loose font-medium text-left">
                    {profile.bio}
                  </p>
                </div>
              </div>
            </div>
          )}

          {data.projects && data.projects.length > 0 && (
            <div className="w-full mb-10 text-left">
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-neutral-600 mb-4 sm:mb-6 px-2 text-center">Projects</h4>
              <div className="space-y-4">
                {data.projects.map((proj: any, i: number) => (
                  <div key={i} className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-100 shadow-sm flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{proj.emoji || ''}</span>
                      <h3 className="text-xl font-black text-neutral-900">{proj.name}</h3>
                    </div>
                    {proj.description && <p className="text-neutral-600 text-sm">{proj.description}</p>}
                    <div className="flex flex-wrap gap-2 mt-1">
                      {proj.tech?.map((t: string, j: number) => (
                        <span key={j} className="px-3 py-1 bg-neutral-100 rounded-full text-xs font-bold text-neutral-600">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {data.hackathons && data.hackathons.length > 0 && (
            <div className="w-full mb-10 text-left">
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-neutral-600 mb-4 sm:mb-6 px-2 text-center">Hackathons & Events</h4>
              <div className="space-y-3">
                {data.hackathons.map((h: any, i: number) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm flex items-center justify-between">
                    <div>
                      <h5 className="font-black text-neutral-900">{h.name}</h5>
                      {h.achievement && <p className="text-emerald-600 text-sm font-bold mt-1">{h.achievement}</p>}
                    </div>
                    <span className="text-neutral-400 font-black text-sm">{h.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data?.platforms && data?.platforms?.length > 0 && (
            <div className="w-full mb-10 text-left">
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-neutral-600 mb-4 sm:mb-6 px-2 text-center">Digital Footprint</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
                {data.platforms.map((p: any, i: number) => {
                  const pData = getPlatformData(p.platform);
                  return (
                    <a 
                      key={i}
                      href={ensureAbsoluteUrl(p.url)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center justify-center gap-3 p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] bg-white border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${pData.hoverBorder} transition-all duration-300 group relative social-link-item cursor-pointer`}
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
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover:text-emerald-500 transition-colors">{p.platform}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {data.core_skills && data.core_skills.length > 0 && (
            <div className="w-full mb-10 text-left">
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-neutral-600 mb-4 sm:mb-6 px-2 text-center">Core Superpowers</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {data.core_skills.map((skill: string, i: number) => (
                  <span key={i} className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] sm:text-xs font-black text-indigo-600 tracking-wider flex items-center gap-2 shadow-sm">
                    <Zap size={14} className="text-indigo-400" /> {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(data.clubs?.length > 0 || data.hobbies?.length > 0) && (
            <div className="w-full mb-10 text-left">
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-neutral-600 mb-4 sm:mb-6 px-2 text-center">Interests & Activities</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {data.clubs?.map((club: string, i: number) => (
                  <span key={`club-${i}`} className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-blue-50 border border-blue-100 text-[11px] sm:text-xs font-black text-blue-600 tracking-wider flex items-center gap-2 shadow-sm">
                    <Users size={14} className="text-blue-400" /> {club}
                  </span>
                ))}
                {data.hobbies?.map((hobby: string, i: number) => (
                  <span key={`hobby-${i}`} className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-pink-50 border border-pink-100 text-[11px] sm:text-xs font-black text-pink-600 tracking-wider flex items-center gap-2 shadow-sm">
                    <Sparkles size={14} className="text-pink-400" /> {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.thought_bubble && (
            <div className="w-full mb-10 text-center">
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-neutral-600 mb-4 sm:mb-6 px-2">Advice I Live By</h4>
              <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100 italic text-emerald-800 text-lg font-medium">
                "{data.thought_bubble}"
              </div>
            </div>
          )}

          {data.upcoming_events && data.upcoming_events.length > 0 && (
            <div className="w-full mb-10 text-left">
              <h4 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-neutral-600 mb-4 sm:mb-6 px-2 text-center">Upcoming Events</h4>
              <div className="space-y-3">
                {data.upcoming_events.map((ev: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Calendar size={18} />
                      </div>
                      <span className="font-bold text-neutral-900">{ev.title}</span>
                    </div>
                    <span className="text-sm font-medium text-neutral-500">{ev.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}


          {(data.contact_email || data.quick_talk_url) && (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 w-full max-w-sm sm:max-w-md mx-auto mt-6 sm:mt-8">
              {data.contact_email ? (
                <a href={`mailto:${data.contact_email}`} className="bg-neutral-900 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-black text-[10px] sm:text-xs uppercase tracking-[0.15em] hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md">
                  <Mail size={16} /> Email
                </a>
              ) : <div />}
              
              {data.quick_talk_url ? (
                <a href={ensureAbsoluteUrl(data.quick_talk_url)} target="_blank" rel="noopener noreferrer" className="bg-white text-neutral-900 py-3.5 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-black text-[10px] sm:text-xs uppercase tracking-[0.15em] border-2 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
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
          .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
          .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
          .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
        `}</style>
      </div>
    )
  }

  // ----------------------------------------------------
  // LAYOUT 1: CAMPUS VARSITY STYLE (Campus Theme)
  // ----------------------------------------------------
  if (activeTheme === 'campus') {
    return (
      <div className="w-full relative text-black min-h-screen cork-bg overflow-hidden font-sans pb-24">
        <style dangerouslySetInnerHTML={{
          __html: `
          .cork-bg {
            background-color: #d1bfae;
            background-image: url('https://www.transparenttextures.com/patterns/cork-board.png');
          }
          .cork-shadow {
            box-shadow: 2px 4px 10px rgba(0,0,0,0.3);
          }
          .cork-shadow-lg {
            box-shadow: 4px 8px 20px rgba(0,0,0,0.4);
          }
          .pushpin {
            position: absolute;
            top: 8px;
            left: 50%;
            transform: translateX(-50%);
            width: 14px;
            height: 14px;
            border-radius: 50%;
            box-shadow: inset -2px -2px 4px rgba(0,0,0,0.5), 2px 2px 4px rgba(0,0,0,0.4);
            z-index: 10;
          }
          .pin-red { background: radial-gradient(circle at 30% 30%, #ff4d4d, #B91C1C); }
          .pin-blue { background: radial-gradient(circle at 30% 30%, #4da6ff, #005ce6); }
          .pin-green { background: radial-gradient(circle at 30% 30%, #4dff4d, #00b300); }
          .pin-yellow { background: radial-gradient(circle at 30% 30%, #ffff4d, #e6e600); }
          .pin-white { background: radial-gradient(circle at 30% 30%, #ffffff, #cccccc); }
          
          .paper-holes {
            position: absolute;
            top: 0; left: 0; bottom: 0;
            width: 24px;
            background-image: radial-gradient(circle at 12px 50%, #9e7f61 5px, transparent 6px);
            background-size: 100% 32px;
            background-position: 0 16px;
            border-right: 1px solid rgba(0,0,0,0.05);
            z-index: 5;
          }
          
          .lined-paper {
            background-color: #FDF9F1;
            background-image: linear-gradient(#cbd5e1 1px, transparent 1px);
            background-size: 100% 32px;
            background-position: 0 16px;
          }
          .margin-line {
            position: absolute;
            top: 0; bottom: 0;
            left: 36px;
            width: 2px;
            background-color: rgba(239, 68, 68, 0.4);
            z-index: 4;
          }
          .solid-paper {
            background-color: #FDF9F1;
          }
        `}} />

        {/* Banner (Background) */}
        {data.featured_work_url && (
          <div 
            className="absolute top-0 left-0 w-full h-72 sm:h-96 z-0 pointer-events-none opacity-90"
            style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)' }}
          >
             <img src={getAssetUrl(data.featured_work_url)} className="w-full h-full object-cover" alt="Banner" />
          </div>
        )}

        <main className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-12 flex flex-col items-center gap-6">
          
          {/* Row 1: Main ID Card + Polaroids */}
          <div className="w-full flex flex-wrap md:flex-nowrap justify-center items-start gap-8 relative">
             
             {/* Polaroid Photo */}
             <div className="w-40 h-48 sm:w-48 sm:h-56 shrink-0 bg-white p-3 pb-12 cork-shadow-lg -rotate-[4deg] z-20 transition-transform duration-300 hover:rotate-0 hover:scale-105 mt-2 md:-mr-12">
                <div className="pushpin pin-blue" />
                <div className="w-full h-full bg-neutral-200 overflow-hidden">
                  {!avatarError && profile.avatar_url ? (
                    <img src={getAssetUrl(profile.avatar_url)} alt={profile.display_name} className="w-full h-full object-cover grayscale sepia-[0.2]" onError={() => setAvatarError(true)} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-300 text-neutral-600 font-bold text-4xl font-sans">
                      {profile.display_name?.charAt(0).toUpperCase() || ''}
                    </div>
                  )}
                </div>
             </div>
             
             {/* Main Lined Paper */}
             <div className="w-full max-w-2xl bg-[#FDF9F1] lined-paper pt-8 pb-10 pr-6 pl-12 sm:pl-16 cork-shadow-lg relative rotate-1 z-10 min-h-[220px]">
                <div className="pushpin pin-red absolute top-3 left-[50%]" />
                <div className="paper-holes" />
                <div className="margin-line" />
                
                <h1 className="text-4xl sm:text-5xl font-bold text-[#1e3a8a] mb-2 mt-2 leading-[32px]" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                  {profile.display_name}
                </h1>
                
                <div className="text-2xl font-bold text-[#B91C1C] mt-4 leading-[32px]" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                  {data.university || ''}
                </div>
                <div className="text-xl text-[#4a5568] leading-[32px]" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                  {data.course || ''}
                  {(data.year || data.batch_year) ? ' | ' : ''}
                  {data.year ? `Year ${data.year}` : ''}
                  {(data.year && data.batch_year) ? ' - ' : ''}
                  {data.batch_year ? `Batch of ${data.batch_year}` : ''}
                </div>
                
                {profile.bio && (
                  <p className="text-xl text-[#2d3748] mt-4 max-w-md leading-[32px]" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                    "{profile.bio}"
                  </p>
                )}
             </div>
          </div>

          {/* Row 2: Stats Sticky Notes */}
          <div className="w-full flex flex-wrap justify-center gap-4 sm:gap-6 mt-2">
             
             {/* Spotify QR */}
             {data.playlist_url && (
               <div onClick={() => setShowSpotifyQR(true)} className="flex-1 min-w-[90px] max-w-[125px] aspect-square bg-[#C3E7AD] p-2 text-center cork-shadow rotate-2 relative flex flex-col items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                  <div className="pushpin pin-white" />
                  <span className="text-lg font-bold block mt-1 text-white leading-tight" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>{data.playlist_name || ''}</span>
                  <div className="bg-white p-1 rounded mt-1 shadow-sm w-12 h-12 flex items-center justify-center">
                    <QRCodeSVG value={ensureAbsoluteUrl(data.playlist_url)} size={40} style={{ width: '100%', height: '100%' }} fgColor="#1DB954" bgColor="transparent" />
                  </div>
               </div>
             )}
             
             {/* Rank */}
             <div className="flex-1 min-w-[90px] max-w-[125px] aspect-square bg-[#FCEB9C] p-4 text-center cork-shadow -rotate-2 relative flex flex-col items-center justify-center">
                <div className="pushpin pin-blue" />
                <span className="text-lg font-medium block mt-2 text-neutral-800" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Rank</span>
                <span className="text-3xl font-bold text-[#1e3a8a] mt-1 block" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>{data.campus_rank_pct ? `Top ${data.campus_rank_pct}%` : ''}</span>
                <Star size={16} className="absolute bottom-3 left-3 text-[#1e3a8a]" strokeWidth={1.5} />
             </div>
             
             {/* Courses */}
             <div className="flex-1 min-w-[90px] max-w-[125px] aspect-square bg-[#C3E7AD] p-4 text-center cork-shadow rotate-1 relative flex flex-col items-center justify-center">
                <div className="pushpin pin-green" />
                <span className="text-lg font-medium block mt-2 text-neutral-800" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Courses</span>
                <span className="text-3xl font-bold text-[#1e3a8a] mt-1 block" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>{data.courses_completed || 0}</span>
                <span className="text-sm text-neutral-600 block mt-1" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Completed</span>
             </div>
             
             {/* Study Buddies */}
             <div className="flex-1 min-w-[90px] max-w-[125px] aspect-square bg-[#BCE2EE] p-4 text-center cork-shadow -rotate-1 relative flex flex-col items-center justify-center">
                <div className="pushpin pin-blue" />
                <span className="text-lg font-medium block mt-2 text-neutral-800" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Study Buddies</span>
                <span className="text-3xl font-bold text-[#1e3a8a] mt-1 block" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>{data.study_buddies || 0}</span>
                <span className="text-sm text-neutral-600 block mt-1" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Buddies</span>
             </div>
             
             {/* Scan Count */}
             <div className="flex-1 min-w-[90px] max-w-[125px] aspect-square bg-[#F6C1D6] p-4 text-center cork-shadow rotate-2 relative flex flex-col items-center justify-center cursor-pointer" onClick={() => isFreeProfile && setShowFomoModal(true)}>
                <div className="pushpin pin-white" />
                <span className="text-lg font-medium block mt-2 text-neutral-800" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Scan Count</span>
                <span className={`text-3xl font-bold text-[#1e3a8a] mt-1 block ${isFreeProfile ? 'blur-[4px]' : ''}`} style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                  {liveViews}
                </span>
                <Activity size={16} className="absolute bottom-3 right-3 text-[#1e3a8a]" strokeWidth={1.5} />
             </div>
          </div>

          {/* Grid Layout Rows */}
          <div className="w-full max-w-5xl flex flex-wrap justify-center items-stretch gap-6 mt-4">
            
            {/* Row 3: About Me, Clubs, Skills */}
            {profile.bio && (
              <div className="w-full flex-1 min-w-[280px] max-w-[400px] bg-[#FDF9F1] p-6 pb-8 pl-10 cork-shadow -rotate-1 relative solid-paper min-h-[220px]">
                <div className="pushpin pin-blue" />
                <div className="paper-holes" />
                <h4 className="text-xl font-bold text-[#1e3a8a] mb-3 uppercase tracking-wide mt-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>About Me</h4>
                <p className="text-xl text-neutral-800 leading-tight" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                  {profile.bio}
                </p>
              </div>
            )}
            {/* Resume & Portfolio */}
            {(data.resume_url || data.website) && (
              <div className="flex flex-wrap gap-3 mt-2 mb-6 z-20 justify-center">
                {data.resume_url && (
                  <a href={data.resume_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#B91C1C] text-white px-6 py-3 rounded shadow-md hover:bg-red-800 transition-colors font-bold text-[15px]">
                    <FileText size={20} /> Resume
                  </a>
                )}
                {data.website && (
                  <a href={ensureAbsoluteUrl(data.website)} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-neutral-800 text-white px-6 py-3 rounded shadow-md hover:bg-black transition-colors font-bold text-[15px]">
                    <Globe size={20} /> Portfolio
                  </a>
                )}
              </div>
            )}

            {/* Row 2: Clubs, Hobbies, Skills */}
            {((data.clubs && data.clubs.length > 0) || (data.hobbies && data.hobbies.length > 0)) && (
              <div className="flex flex-row flex-wrap sm:flex-nowrap justify-center gap-8 w-full max-w-4xl">
                {data.clubs && data.clubs.length > 0 && (
                  <div className="w-full flex-1 min-w-[280px] max-w-[400px] bg-[#FCEB9C] p-6 pb-8 cork-shadow rotate-1 relative min-h-[220px]">
                    <div className="pushpin pin-green" />
                    <h4 className="text-xl font-bold text-[#B91C1C] mb-3 uppercase tracking-wide text-center mt-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Clubs & Orgs</h4>
                    <ul className="text-xl text-neutral-800 space-y-1 ml-4" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                      {data.clubs.map((c: string, i: number) => <li key={i}>- {c}</li>)}
                    </ul>
                  </div>
                )}

                {data.hobbies && data.hobbies.length > 0 && (
                  <div className="w-full flex-1 min-w-[280px] max-w-[400px] bg-[#F6C1D6] p-6 pb-8 cork-shadow -rotate-2 relative min-h-[220px]">
                    <div className="pushpin pin-white" />
                    <h4 className="text-xl font-bold text-[#1e3a8a] mb-3 uppercase tracking-wide text-center mt-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Hobbies</h4>
                    <ul className="text-xl text-neutral-800 space-y-1 ml-4" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                      {data.hobbies.map((h: string, i: number) => <li key={i}>- {h}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {data.core_skills && data.core_skills.length > 0 && (
              <div className="w-full flex-1 min-w-[280px] max-w-[400px] bg-[#FDF9F1] p-6 pb-8 pl-10 cork-shadow -rotate-2 relative solid-paper min-h-[220px]">
                <div className="pushpin pin-white" />
                <div className="paper-holes" />
                <h4 className="text-xl font-bold text-[#1e3a8a] mb-3 uppercase tracking-wide mt-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Skills</h4>
                <ul className="text-xl text-neutral-800 space-y-1 ml-4" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                  {data.core_skills.slice(0,5).map((s, i) => <li key={i}>• {s}</li>)}
                </ul>
                <div className="absolute bottom-4 right-4 text-[#1e3a8a] opacity-50"><span className="text-3xl" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>&lt;/&gt;</span></div>
              </div>
            )}

            {/* Row 4: Achievements, Focus */}
            {data.hackathons && data.hackathons.length > 0 && (
              <div className="w-full md:w-[46%] bg-[#FDF9F1] p-6 pb-8 pl-14 cork-shadow rotate-[1deg] relative lined-paper min-h-[180px]">
                <div className="pushpin pin-red absolute top-3 left-[50%]" />
                <div className="paper-holes" />
                <div className="margin-line" />
                <h4 className="text-xl font-bold text-[#1e3a8a] mb-2 uppercase tracking-wide mt-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Recent Achievements</h4>
                <ul className="text-xl text-neutral-800 space-y-1 ml-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                  {data.hackathons.map((h, i) => (
                    <li key={i} className="leading-[32px]">• {h.achievement ? `${h.achievement} - ` : ''}{h.name} {h.year}</li>
                  ))}
                </ul>
                <Trophy size={32} className="absolute bottom-6 right-6 text-[#1e3a8a] opacity-60" strokeWidth={1.5} />
              </div>
            )}

            {data.projects && data.projects.length > 0 && (
              <div className="w-full md:w-[46%] bg-[#FDF9F1] p-6 pb-8 pl-14 cork-shadow -rotate-[1deg] relative lined-paper min-h-[180px]">
                <div className="pushpin pin-blue absolute top-3 left-[50%]" />
                <div className="paper-holes" />
                <div className="margin-line" />
                <h4 className="text-xl font-bold text-[#1e3a8a] mb-2 uppercase tracking-wide mt-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Projects</h4>
                <ul className="text-xl text-neutral-800 space-y-1 ml-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                  {data.projects.map((p: any, i: number) => (
                    <li key={i} className="leading-[32px]">• {p.emoji} {p.name}</li>
                  ))}
                </ul>
                <Rocket size={32} className="absolute bottom-6 right-6 text-[#1e3a8a] opacity-60" strokeWidth={1.5} />
              </div>
            )}

            {data.favorite_subject && (
              <div className="w-full md:w-[46%] bg-[#FDF9F1] p-6 pb-8 pl-14 cork-shadow -rotate-[1deg] relative lined-paper min-h-[180px]">
                <div className="pushpin pin-blue absolute top-3 left-[50%]" />
                <div className="paper-holes" />
                <div className="margin-line" />
                <h4 className="text-xl font-bold text-[#1e3a8a] mb-2 uppercase tracking-wide mt-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Current Focus</h4>
                <ul className="text-xl text-neutral-800 space-y-1 ml-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                  <li className="leading-[32px]">• {data.favorite_subject}</li>
                  {data.core_skills && data.core_skills.length > 1 && <li className="leading-[32px]">• {data.core_skills[1]}</li>}
                  <li className="leading-[32px]">• Web Development</li>
                </ul>
                <Target size={40} className="absolute bottom-6 right-6 text-[#1e3a8a] opacity-60" strokeWidth={1.5} />
              </div>
            )}

            {/* Row 5: Snapshot, Events */}
            
            {(data.upcoming_events && data.upcoming_events.length > 0) && (
<div className="w-full md:w-[46%] bg-[#BCE2EE] p-6 pb-8 cork-shadow -rotate-2 relative">
              <div className="pushpin pin-green" />
              <h4 className="text-xl font-bold text-[#1e3a8a] mb-4 uppercase tracking-wide mt-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Upcoming Events</h4>

              <div className="space-y-4">
                 {data.upcoming_events.map((ev: any, i: number) => (
                   <div key={i} className="flex gap-3">
                     <Calendar size={18} className="text-[#1e3a8a] shrink-0 mt-1" strokeWidth={1.5} />
                     <div>
                       <div className="text-xl text-neutral-800 leading-tight" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>{ev.title}</div>
                       <div className="text-sm text-neutral-600 font-sans">{ev.date}</div>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
            )}

            {/* Row 6: Projects, Connect, Advice */}
            {data.projects && data.projects.length > 0 && (
              <div className="w-full flex-1 min-w-[280px] max-w-[420px] bg-[#FDF9F1] p-6 pb-8 pl-10 cork-shadow rotate-[1deg] relative solid-paper min-h-[220px]">
                <div className="pushpin pin-blue" />
                <div className="paper-holes" />
                <h4 className="text-xl font-bold text-[#1e3a8a] mb-3 uppercase tracking-wide mt-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Projects</h4>
                <ul className="text-xl text-neutral-800 space-y-1 ml-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                  {data.projects.slice(0,3).map((p, i) => (
                    <li key={i}>• {p.name}</li>
                  ))}
                </ul>
                <div className="mt-4 text-[#1e3a8a] font-bold text-lg cursor-pointer hover:underline" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>View all projects →</div>
              </div>
            )}

            {data?.platforms && data?.platforms?.length > 0 && (
              <div className="w-full flex-1 min-w-[280px] max-w-[440px] bg-[#FCEB9C] p-6 pb-8 cork-shadow -rotate-1 relative min-h-[220px]">
                <div className="pushpin pin-yellow" />
                <h4 className="text-xl font-bold text-neutral-800 mb-4 uppercase tracking-wide text-center mt-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Let's Connect</h4>
                <div className="flex flex-wrap gap-3 justify-center">
                  {data.platforms.map((p: any, i: number) => {
                    const pData = getPlatformData(p.platform)
                    return (
                      <a key={i} href={ensureAbsoluteUrl(p.url)} target="_blank" rel="noopener noreferrer" onClick={(e) => { handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url)); if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank'); }} className="w-10 h-10 bg-white/50 rounded flex items-center justify-center hover:bg-white hover:scale-110 transition-all cork-shadow">
                        {pData.icon}
                      </a>
                    )
                  })}
                </div>
                <div className="mt-4 text-center text-lg text-neutral-800 leading-tight" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                  Open to collaborate and build amazing things together!
                </div>
              </div>
            )}

            {data.thought_bubble && (
              <div className="w-full md:max-w-xl mx-auto bg-[#FDF9F1] p-6 pb-8 pl-10 cork-shadow rotate-1 relative solid-paper min-h-[220px] flex flex-col justify-center text-center mt-4">
                <div className="pushpin pin-white" />
                <div className="paper-holes" />
                <h4 className="text-xl font-bold text-[#1e3a8a] mb-2 uppercase tracking-wide mt-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Advice I Live By</h4>
                <div className="text-2xl text-neutral-800 leading-tight italic" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                  "{data.thought_bubble}"
                </div>
                <Heart size={24} className="mx-auto mt-4 text-[#1e3a8a]" strokeWidth={1.5} />
              </div>
            )}

          </div>

          {/* Bottom Banner */}
          {data.contact_email && (
             <div className="w-full max-w-2xl bg-[#FDF9F1] p-4 sm:p-6 mt-8 cork-shadow-lg relative flex flex-col sm:flex-row items-center justify-center gap-6 solid-paper">
                <div className="pushpin pin-green" />
                <div className="w-14 h-14 bg-[#d1bfae] rounded-full flex items-center justify-center shrink-0">
                   <Mail size={28} className="text-neutral-800" />
                </div>
                <div className="text-center sm:text-left">
                   <h4 className="text-2xl font-bold text-neutral-800 mb-1" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Get in Touch</h4>
                   <p className="text-lg text-neutral-700" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>I'm always open to new opportunities, ideas and collaborations.</p>
                   <a href={`mailto:${data.contact_email}`} className="font-sans font-bold text-sm text-[#1e3a8a] hover:underline mt-2 inline-block">{data.contact_email}</a>
                </div>
             </div>
          )}

          <div className="w-full max-w-sm mt-8 z-20 flex flex-col items-center gap-4">
            <div className="w-full bg-white/80 p-2 rounded backdrop-blur-sm cork-shadow">
              <ProfileCTAs profile={profile} accentColor="#B91C1C" />
            </div>
          </div>

        </main>

        {showFomoModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-[#FDF9F1] p-8 max-w-sm w-full cork-shadow-lg relative text-center rotate-1">
              <button onClick={() => setShowFomoModal(false)} className="absolute top-2 right-2 p-2 text-neutral-400 hover:text-red-500">
                <X size={24} />
              </button>
              <div className="pushpin pin-red" />
              <Activity size={48} className="text-[#1e3a8a] mx-auto mb-4 mt-4" />
              <h3 className="text-3xl font-bold text-[#1e3a8a] mb-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Unlock Premium</h3>
              <p className="text-xl text-neutral-600 mb-6" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>See your exact campus standing & scans!</p>
              <button onClick={() => window.location.href = '/#pricing'} className="w-full py-3 bg-[#B91C1C] text-white font-bold text-xl rounded shadow-md hover:bg-red-700 transition-colors" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {showSpotifyQR && data.playlist_url && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm" onClick={() => setShowSpotifyQR(false)}>
            <div className="bg-white p-8 max-w-sm w-full shadow-2xl relative text-center rounded-2xl flex flex-col items-center" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowSpotifyQR(false)} className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-800 transition-colors">
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
                <Music className="text-[#1DB954]" />
                {data.playlist_name || ''}
              </h3>
              
              <div className="bg-white p-4 rounded-xl shadow-inner mb-6 border border-neutral-100 w-full flex justify-center">
                <QRCodeSVG value={ensureAbsoluteUrl(data.playlist_url)} size={220} fgColor="#1DB954" bgColor="transparent" />
              </div>
              
              <a 
                href={ensureAbsoluteUrl(data.playlist_url)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full py-3 bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold text-lg rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Open in Spotify <ExternalLink size={18} />
              </a>
            </div>
          </div>
        )}

        <GateModal />
      </div>
    )
  }

  // ----------------------------------------------------
  // LAYOUT 2: COZY LATE-NIGHT STUDY DESK (Night Owl Theme)
  // ----------------------------------------------------
  if (activeTheme === 'night owl') {
    return (
      <div className="w-full min-h-screen relative overflow-x-hidden text-[#E0E7FF] pb-12 selection:bg-cyan-500/30 selection:text-cyan-100 font-sans theme-night-owl bg-animation">
        
        <style dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
            
            .theme-night-owl {
              font-family: 'Space Grotesk', sans-serif;
            }
            
            /* Animated Background Gradient */
            .bg-animation {
              background: linear-gradient(-45deg, #050b14, #081229, #05192d, #031525);
              background-size: 400% 400%;
              animation: gradientBG 15s ease infinite;
            }
            @keyframes gradientBG {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }

            /* Glassmorphism */
            .no-lift { transform: none !important; }
            .glass-card {
              background: rgba(10, 20, 40, 0.45);
              backdrop-filter: blur(14px);
              -webkit-backdrop-filter: blur(14px);
              border: 1px solid rgba(6, 182, 212, 0.12);
              border-radius: 16px;
              transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
            }
            .glass-card:hover {
              background: rgba(10, 20, 40, 0.6);
              border-color: rgba(6, 182, 212, 0.35);
              box-shadow: 0 4px 24px rgba(6, 182, 212, 0.12);
            }
            .glass-panel {
              background: rgba(10, 20, 40, 0.45);
              backdrop-filter: blur(14px);
              -webkit-backdrop-filter: blur(14px);
              border: 1px solid rgba(6, 182, 212, 0.12);
              border-radius: 16px;
              transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
            }
            .glass-panel:hover {
              background: rgba(10, 20, 40, 0.6);
              border-color: rgba(6, 182, 212, 0.35);
              box-shadow: 0 4px 24px rgba(6, 182, 212, 0.12);
            }

            /* Typography & Glows */
            .text-glow {
              text-shadow: 0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.15);
            }
            
            /* Tags */
            .neo-tag {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 5px 14px;
              background: rgba(6, 182, 212, 0.08);
              border: 1px solid rgba(6, 182, 212, 0.18);
              border-radius: 9999px;
              color: #a5f3fc;
              font-size: 0.8rem;
              font-weight: 500;
              transition: all 0.2s ease;
              white-space: nowrap;
            }
            .neo-tag:hover {
              background: rgba(6, 182, 212, 0.18);
              border-color: rgba(6, 182, 212, 0.45);
              box-shadow: 0 0 12px rgba(6, 182, 212, 0.15);
            }

            /* Avatar Pulsing Aura */
            .avatar-aura {
              position: relative;
            }
            .avatar-aura::before, .avatar-aura::after {
              content: '';
              position: absolute;
              inset: -6px;
              border-radius: 50%;
              border: 2px solid rgba(6, 182, 212, 0.6);
              opacity: 0;
              animation: pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            .avatar-aura::after {
              animation-delay: 1.5s;
            }
            @keyframes pulse-ring {
              0% { transform: scale(1); opacity: 0.7; }
              100% { transform: scale(1.35); opacity: 0; }
            }

            /* Section Headers */
            .section-header {
              display: flex;
              align-items: center;
              gap: 10px;
              font-size: 0.7rem;
              font-weight: 600;
              letter-spacing: 0.2em;
              color: #22d3ee;
              text-transform: uppercase;
              margin-bottom: 0.875rem;
              padding-bottom: 0;
            }
            .section-header::after {
              content: '';
              flex-grow: 1;
              height: 1px;
              background: linear-gradient(90deg, rgba(6, 182, 212, 0.25), transparent);
            }

            /* Animated Entrance */
            .animate-in { animation: fadeUp 0.5s ease-out forwards; opacity: 0; transform: translateY(16px); }
            @keyframes fadeUp {
              to { opacity: 1; transform: translateY(0); }
            }

            /* Stat cards */
            .stat-card {
              background: rgba(10, 20, 40, 0.45);
              backdrop-filter: blur(14px);
              -webkit-backdrop-filter: blur(14px);
              border: 1px solid rgba(6, 182, 212, 0.12);
              border-radius: 14px;
              padding: 1.25rem 1rem;
              text-align: center;
              transition: border-color 0.3s ease, box-shadow 0.3s ease;
            }
            .stat-card:hover {
              border-color: rgba(6, 182, 212, 0.35);
              box-shadow: 0 4px 20px rgba(6, 182, 212, 0.1);
            }

            /* Floating Owls */
            .floating-owls-container {
              position: fixed;
              top: 0;
              left: 50%;
              transform: translateX(-50%);
              width: 100%;
              max-width: 48rem; /* Matches max-w-3xl container */
              height: 100%;
              pointer-events: none;
              z-index: 1;
              overflow: hidden;
            }
            .floating-owl {
              position: absolute;
              font-size: 1.5rem;
              opacity: 0;
              animation: floatOwl linear infinite;
              filter: drop-shadow(0 0 10px rgba(6, 182, 212, 0.4)) hue-rotate(180deg);
            }
            @keyframes floatOwl {
              0% { transform: translate(0, 100vh) scale(0.5) rotate(-10deg); opacity: 0; }
              15% { opacity: 0.15; }
              85% { opacity: 0.15; }
              100% { transform: translate(var(--end-x, 100px), -10vh) scale(1.2) rotate(10deg); opacity: 0; }
            }
          `
        }} />

        {/* ═══ FLOATING OWLS BACKGROUND ═══ */}
        <div className="floating-owls-container">
          <div className="floating-owl" style={{ left: '10%', animationDuration: '25s', animationDelay: '0s', '--end-x': '50px' } as any}>🦉</div>
          <div className="floating-owl" style={{ left: '35%', animationDuration: '35s', animationDelay: '5s', '--end-x': '-80px' } as any}>🦉</div>
          <div className="floating-owl" style={{ left: '60%', animationDuration: '28s', animationDelay: '12s', '--end-x': '120px', fontSize: '2.5rem' } as any}>🦉</div>
          <div className="floating-owl" style={{ left: '85%', animationDuration: '40s', animationDelay: '2s', '--end-x': '-60px' } as any}>🦉</div>
          <div className="floating-owl" style={{ left: '20%', animationDuration: '32s', animationDelay: '18s', '--end-x': '90px', fontSize: '1.2rem' } as any}>🦉</div>
          <div className="floating-owl" style={{ left: '75%', animationDuration: '29s', animationDelay: '8s', '--end-x': '-40px' } as any}>🦉</div>
        </div>

        {/* ⭐ COVER BANNER ⭐ */}
        {data.featured_work_url && (
          <div className="relative w-full h-44 sm:h-60 overflow-hidden z-0">
            <img 
              src={getAssetUrl(data.featured_work_url)} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-50"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050b14]" />
          </div>
        )}

        <main className={`relative z-10 w-full max-w-3xl mx-auto px-5 sm:px-8 ${data.featured_work_url ? '-mt-20' : 'pt-10'}`}>
          
          {/* ═══ HEADER: Avatar + Name + Bio ═══ */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6 animate-in" style={{ animationDelay: '0.1s' }}>
            {/* Avatar with glowing aura */}
            <div className="shrink-0 avatar-aura">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-cyan-400/80 p-[3px] bg-[#050b14] relative z-10 shadow-[0_0_24px_rgba(6,182,212,0.25)]">
                {!avatarError && profile.avatar_url ? (
                  <img src={getAssetUrl(profile.avatar_url)} alt={profile.display_name} className="w-full h-full object-cover rounded-full" onError={() => setAvatarError(true)} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-cyan-900/30 text-cyan-300 font-bold text-3xl rounded-full">
                    {profile.display_name?.charAt(0).toUpperCase() || ''}
                  </div>
                )}
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-grow text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-1.5 text-glow" style={{ lineHeight: 1.2 }}>
                {profile.display_name} {data.mood && <span className="text-xl ml-1">{data.mood}</span>}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 bg-cyan-900/25 px-3 py-1 rounded-full border border-cyan-500/15 text-[13px] text-cyan-300 font-medium">
                  <GraduationCap size={14} /> {data.course } {data.university ? `@ ${data.university}` : ''}
                </span>
                {(data.year || data.batch_year) && (
                  <span className="inline-flex items-center gap-1.5 bg-cyan-900/25 px-3 py-1 rounded-full border border-cyan-500/15 text-[13px] text-cyan-300/80">
                    {data.year ? `Year ${data.year}` : ''}{data.year && data.batch_year ? ' · ' : ''}{data.batch_year ? `Batch of ${data.batch_year}` : ''}
                  </span>
                )}
              </div>
              {profile.bio && (
                <p className="text-indigo-100/70 text-[15px] leading-relaxed mt-3 max-w-xl font-light">
                  {profile.bio}
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row flex-wrap items-start justify-center sm:justify-start gap-4 mt-6 z-20">
                {(data.resume_url || data.website) && (
                  <div className="w-full sm:w-auto p-4 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 shadow-[0_0_15px_rgba(6,182,212,0.15)] flex flex-col gap-3">
                    <p className="text-cyan-300 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(6,182,212,1)]" /> Explore My Work
                    </p>
                    <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                      {data.resume_url && (
                        <a href={data.resume_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#050b14] border border-cyan-500/50 text-cyan-200 px-5 py-2.5 rounded-lg font-bold text-[13px] hover:bg-cyan-900/60 hover:border-cyan-400 hover:text-white transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                          <FileText size={16} /> Access CV
                        </a>
                      )}
                      {data.website && (
                        <a href={ensureAbsoluteUrl(data.website)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#050b14] border border-fuchsia-500/50 text-fuchsia-200 px-5 py-2.5 rounded-lg font-bold text-[13px] hover:bg-fuchsia-900/60 hover:border-fuchsia-400 hover:text-white transition-all shadow-[0_0_10px_rgba(217,70,239,0.2)]">
                          <Globe size={16} /> System Link
                        </a>
                      )}
                    </div>
                  </div>
                )}
                {data.availability && (
                  <div className="glass-card px-3.5 py-1.5 inline-flex items-center gap-2 no-lift">
                    <Briefcase size={14} className="text-cyan-400" />
                    <span className="text-[13px] font-medium text-cyan-100">
                      Open to: <span className="text-cyan-300">{data.availability}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ═══ STATS ROW ═══ */}
          {(data.campus_rank_pct || data.study_buddies || data.courses_completed || stats) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 animate-in" style={{ animationDelay: '0.15s' }}>
              <div className={`stat-card ${isFreeProfile ? 'cursor-pointer' : ''}`} onClick={() => isFreeProfile && setShowFomoModal(true)}>
                <Activity size={18} className="text-cyan-400 mx-auto mb-1.5" />
                <div className={`text-xl font-bold text-white ${isFreeProfile ? 'blur-[4px]' : ''}`}>{liveViews}</div>
                <div className="text-[9px] uppercase tracking-[0.15em] text-cyan-200/50 mt-1">Live Views</div>
              </div>
              
              {data.campus_rank_pct && (
                <div className="stat-card">
                  <Trophy size={18} className="text-amber-400 mx-auto mb-1.5" />
                  <div className="text-xl font-bold text-white">Top {data.campus_rank_pct}%</div>
                  <div className="text-[9px] uppercase tracking-[0.15em] text-cyan-200/50 mt-1">Honor Rank</div>
                </div>
              )}
              
              {data.courses_completed && (
                <div className="stat-card">
                  <BookOpen size={18} className="text-blue-400 mx-auto mb-1.5" />
                  <div className="text-xl font-bold text-white">{data.courses_completed}</div>
                  <div className="text-[9px] uppercase tracking-[0.15em] text-cyan-200/50 mt-1">Courses</div>
                </div>
              )}
              
              {data.study_buddies && (
                <div className="stat-card">
                  <Users size={18} className="text-purple-400 mx-auto mb-1.5" />
                  <div className="text-xl font-bold text-white">{data.study_buddies}</div>
                  <div className="text-[9px] uppercase tracking-[0.15em] text-cyan-200/50 mt-1">Buddies</div>
                </div>
              )}
            </div>
          )}

          {/* ═══ ABOUT ME & SKILLS ═══ */}
          {(profile.bio || (data.core_skills && data.core_skills.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-in" style={{ animationDelay: '0.25s' }}>
              {profile.bio && (
                <div className="glass-card p-6">
                  <div className="section-header"><BookOpen size={14} /> Bio Summary</div>
                  <p className="text-indigo-100/80 text-[14px] leading-relaxed font-light">{profile.bio}</p>
                  {data.favorite_subject && (
                    <div className="mt-4 flex items-center gap-2 text-[13px] border-t border-cyan-500/10 pt-3">
                      <Star size={14} className="text-amber-400 shrink-0" />
                      <span className="text-cyan-100/50">Favorite Subject:</span>
                      <span className="text-white font-medium">{data.favorite_subject}</span>
                    </div>
                  )}
                </div>
              )}
              
              {data.core_skills && data.core_skills.length > 0 && (
                <div className="glass-card p-6">
                  <div className="section-header"><Zap size={14} /> Core Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {data.core_skills.map((skill, i) => (
                      <span key={i} className="neo-tag">
                        <span className="text-cyan-500/40">#</span> {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ PROJECTS & HACKATHONS ═══ */}
          {(data.projects?.length > 0 || data.hackathons?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-in" style={{ animationDelay: '0.35s' }}>
              {data.projects && data.projects.length > 0 && (
                <div>
                  <div className="section-header"><Rocket size={14} /> Projects</div>
                  <div className="space-y-3">
                    {data.projects.map((proj, i) => (
                      <div key={i} className="glass-card p-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity"><Rocket size={50} /></div>
                        <div className="flex items-start gap-3 relative z-10">
                          <span className="text-xl shrink-0">{proj.emoji || ''}</span>
                          <div className="min-w-0">
                            <h4 className="text-[15px] font-semibold text-white mb-0.5 leading-snug">{proj.name}</h4>
                            {proj.description && <p className="text-[13px] text-indigo-200/60 font-light mb-2 leading-relaxed">{proj.description}</p>}
                            {proj.tech && proj.tech.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {proj.tech.map((t, j) => (
                                  <span key={j} className="px-2 py-0.5 bg-blue-900/25 border border-blue-500/15 rounded text-[9px] text-blue-300/90 font-medium tracking-wider uppercase">{t}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.hackathons && data.hackathons.length > 0 && (
                <div>
                  <div className="section-header"><Trophy size={14} /> Hackathons</div>
                  <div className="space-y-3">
                    {data.hackathons.map((h, i) => (
                      <div key={i} className="glass-card p-5 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h5 className="font-semibold text-white text-[14px] flex items-center gap-2">
                            🏆 {h.name}
                          </h5>
                          {h.achievement && <p className="text-cyan-400 text-[13px] font-medium mt-0.5">↳ {h.achievement}</p>}
                        </div>
                        {h.year && <span className="text-cyan-200/35 font-mono text-[11px] px-2 py-0.5 bg-black/15 rounded border border-white/5 shrink-0">{h.year}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ CLUBS & HOBBIES ═══ */}
          {(data.clubs?.length > 0 || data.hobbies?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-in" style={{ animationDelay: '0.45s' }}>
              {data.clubs?.length > 0 && (
                <div className="glass-card p-6">
                  <div className="section-header"><Users size={14} /> Organizations</div>
                  <div className="flex flex-wrap gap-2">
                    {data.clubs.map((club, i) => (
                      <span key={i} className="neo-tag" style={{ background: 'rgba(96,165,250,0.08)', borderColor: 'rgba(96,165,250,0.18)', color: '#bfdbfe' }}>
                        <Users size={11} className="text-blue-400/50" /> {club}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {data.hobbies?.length > 0 && (
                <div className="glass-card p-6">
                  <div className="section-header"><Heart size={14} /> Interests</div>
                  <div className="flex flex-wrap gap-2">
                    {data.hobbies.map((hobby, i) => (
                      <span key={i} className="neo-tag" style={{ background: 'rgba(168,85,247,0.08)', borderColor: 'rgba(168,85,247,0.18)', color: '#e9d5ff' }}>
                        <Sparkles size={11} className="text-purple-400/50" /> {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ SOCIALS & EVENTS ═══ */}
          {((data?.platforms && data?.platforms?.length > 0) || (data.upcoming_events && data.upcoming_events.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-in" style={{ animationDelay: '0.55s' }}>
              {data?.platforms && data?.platforms?.length > 0 && (
                <div className="glass-card p-6">
                  <div className="section-header"><Globe size={14} /> Network</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {data.platforms.map((p, i) => {
                      const pData = getPlatformData(p.platform?.toLowerCase())
                      return (
                        <a key={i} href={ensureAbsoluteUrl(p.url)} target="_blank" rel="noopener noreferrer"
                          onClick={(e) => { handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url)); if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank'); }}
                          className="flex flex-col items-center justify-center p-3 bg-[#050b14]/40 border border-cyan-500/10 rounded-xl hover:bg-cyan-900/15 hover:border-cyan-500/25 transition-all group relative">
                          <div className="text-cyan-500/60 group-hover:text-cyan-300 transition-colors mb-1.5">
                            {pData.icon}
                          </div>
                          <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-cyan-200/45 group-hover:text-cyan-100">{p.platform}</span>
                          {isGated && (<div className="absolute inset-0 bg-[#050b14]/80 flex items-center justify-center rounded-xl backdrop-blur-[2px]"><Lock size={12} className="text-cyan-500" /></div>)}
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
              
              {data.upcoming_events && data.upcoming_events.length > 0 && (
                <div className="glass-card p-6">
                  <div className="section-header"><Calendar size={14} /> Upcoming</div>
                  <div className="space-y-2.5">
                    {data.upcoming_events.map((ev, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#050b14] border border-cyan-500/20 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.08)]">
                          <Calendar size={12} className="text-cyan-400" />
                        </div>
                        <div className="flex-grow bg-[#050b14]/25 border border-cyan-500/8 rounded-lg px-3 py-2.5">
                          <div className="text-[13px] font-semibold text-white leading-snug">{ev.title}</div>
                          <div className="text-[9px] uppercase tracking-[0.12em] text-cyan-400/50 mt-0.5">{ev.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ THOUGHT BUBBLE & CONTACT ═══ */}
          {(data.thought_bubble || data.contact_email) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-in" style={{ animationDelay: '0.65s' }}>
              {data.thought_bubble && (
                <div className="glass-card p-6 flex flex-col justify-center text-center relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 opacity-[0.03]"><Sparkles size={80} /></div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.25em] text-cyan-400/80 mb-3">Philosophy</div>
                  <p className="text-lg font-light text-white italic leading-relaxed">"{data.thought_bubble}"</p>
                </div>
              )}
              {data.contact_email && (
                <div className="glass-card p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-500/15 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-cyan-300" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold text-white mb-0.5">Let's Connect</h4>
                    <a href={`mailto:${data.contact_email}`} className="text-[13px] text-cyan-400 hover:text-cyan-300 transition-colors">{data.contact_email}</a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CTAs at the bottom */}
          <div className="w-full mt-12 mb-8 flex flex-col items-center justify-center z-20">
            <div className="w-full max-w-sm glass-card p-3 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)]">
              <ProfileCTAs profile={profile} accentColor="#06b6d4" />
            </div>
          </div>

        </main>

        {/* FOMO Modal */}
        {showFomoModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#030914]/90 backdrop-blur-md">
            <div className="glass-panel p-8 max-w-sm w-full relative text-center border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
              <button onClick={() => setShowFomoModal(false)} className="absolute top-4 right-4 p-2 text-cyan-400/50 hover:text-white transition-colors">
                <X size={20} />
              </button>
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <Lock size={24} className="text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-widest uppercase mb-2 text-glow">Locked Stats</h3>
              <p className="text-sm font-light text-cyan-100/60 mb-8 leading-relaxed">Upgrade to view live scanning metrics and academic performance indicators.</p>
              <button onClick={() => window.location.href = '/#pricing'} className="w-full py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                Unlock Access
              </button>
            </div>
          </div>
        )}

        {/* Spotify Modal */}
        {showSpotifyQR && data.playlist_url && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#030914]/90 backdrop-blur-md" onClick={() => setShowSpotifyQR(false)}>
            <div className="glass-panel p-8 max-w-sm w-full relative text-center flex flex-col items-center border-[#1DB954]/30 shadow-[0_0_50px_rgba(29,185,84,0.15)]" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowSpotifyQR(false)} className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Music className="text-[#1DB954]" />
                {data.playlist_name || ''}
              </h3>
              
              <div className="bg-white p-4 rounded-xl shadow-inner mb-6 w-full flex justify-center">
                <QRCodeSVG value={ensureAbsoluteUrl(data.playlist_url)} size={220} fgColor="#1DB954" bgColor="transparent" />
              </div>
              
              <a 
                href={ensureAbsoluteUrl(data.playlist_url)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full py-3 bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all hover:shadow-[0_0_20px_rgba(29,185,84,0.4)] flex items-center justify-center gap-2"
              >
                Open in Spotify <ExternalLink size={16} />
              </a>
            </div>
          </div>
        )}

        <GateModal />
      </div>
    )
  }
  // ----------------------------------------------------
  // LAYOUT 3: PREMIUM JOURNAL NOTEBOOK (Default / Notebook Theme)
  // ----------------------------------------------------
  return (
    <div className="w-full min-h-screen relative overflow-x-hidden text-[#333333] pb-8 selection:bg-amber-200/60 font-sans nb-page">
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Permanent+Marker&display=swap');
          .nb-page {
            background: linear-gradient(135deg, #FFFDF7 0%, #FDF8EE 40%, #FAF4E4 100%);
          }
          .nb-lines {
            background-image: linear-gradient(transparent 27px, #c8dce8 27px, #c8dce8 28px, transparent 28px);
            background-size: 100% 28px;
          }
          .nb-section-title {
            font-family: 'Permanent Marker', cursive, sans-serif;
            color: #1a365d;
            font-size: 1.15rem;
            line-height: 28px;
          }
          .nb-handwriting { font-family: 'Caveat', cursive, sans-serif; }
          .nb-ink { color: #1e3a5f; }
          .nb-red-ink { color: #c53030; }
          .nb-pencil { color: #6B7280; }
          .washi-tape {
            background: repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px);
          }
          .nb-card {
            background: rgba(255,253,247,0.6);
            border: 1.5px solid rgba(30,58,95,0.1);
            border-radius: 3px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .nb-card:hover {
            transform: translateY(-1px);
            box-shadow: 0 3px 8px rgba(0,0,0,0.06);
          }
          .nb-divider {
            border: none; height: 1px;
            background: linear-gradient(90deg, transparent 0%, #B8D4E3 15%, #B8D4E3 85%, transparent 100%);
            margin: 0.75rem 0;
          }
          .nb-highlight {
            background: linear-gradient(180deg, transparent 60%, #FEF08A 60%);
            padding: 0 3px;
          }
          .nb-doodle-box {
            border: 2px solid #1e3a5f;
            border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
            padding: 0.4rem 0.8rem;
            background: rgba(255,253,247,0.5);
          }
          .nb-tag {
            display: inline-flex; align-items: center; gap: 4px;
            padding: 2px 10px;
            border: 1.5px solid #1e3a5f;
            border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
            font-family: 'Caveat', cursive; font-size: 1.05rem; font-weight: 600;
            color: #1e3a5f; background: rgba(255,253,247,0.4);
            transition: all 0.2s ease;
          }
          .nb-tag:hover { background: #EBF5FF; transform: rotate(-1deg) scale(1.04); }
          .nb-tag-pink { border-color: #9B2C2C; color: #9B2C2C; }
          .nb-tag-pink:hover { background: #FFF5F5; }
          .nb-stat {
            width: 68px; height: 68px; border-radius: 50%;
            border: 2.5px solid #1e3a5f;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            background: rgba(255,253,247,0.4);
            font-family: 'Permanent Marker', cursive;
            transition: transform 0.2s ease;
          }
          .nb-stat:hover { transform: scale(1.06) rotate(2deg); }
          .nb-animate { animation: notebook-entry 0.4s ease forwards; }
          @keyframes notebook-entry {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `
      }} />
      
      {/* Full-width ruled paper with red margin */}
      <div className="relative w-full max-w-3xl mx-auto nb-lines min-h-screen">
        {/* ⭐ COVER BANNER (BACKGROUND) ⭐ */}
        {data.featured_work_url && (
          <div className="absolute top-0 left-0 right-0 h-48 sm:h-64 z-0 pointer-events-none" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}>
            <img src={getAssetUrl(data.featured_work_url)} className="w-full h-full object-cover opacity-100" alt="Cover Banner" />
          </div>
        )}

        {/* Red margin line */}
        <div className="absolute top-0 bottom-0 left-[2.5rem] sm:left-[3.5rem] w-[2px] bg-[#c53030]/40 pointer-events-none z-0" />
        <div className="absolute top-0 bottom-0 left-[2.7rem] sm:left-[3.7rem] w-[1px] bg-[#c53030]/25 pointer-events-none z-0" />

        <main className={`relative z-10 w-full pl-[3.2rem] sm:pl-[4.5rem] pr-4 sm:pr-8 pb-12 flex flex-col gap-0 nb-animate ${data.featured_work_url ? 'pt-32 sm:pt-48' : 'pt-6'}`}>
          


          {/* ═══ HEADER: Avatar + Name + Bio + Stats — Centered ═══ */}
          <div className="flex flex-col items-center text-center gap-5 mb-2 z-10 relative">
            {/* Taped polaroid */}
            <div className={`relative shrink-0 rotate-[-2deg] group ${data.featured_work_url ? 'mt-[-80px] sm:mt-[-120px]' : ''}`}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#FEF08A]/60 washi-tape border border-yellow-300/20 shadow-sm rotate-[3deg] z-20 rounded-sm" />
              <div className="w-28 h-36 sm:w-32 sm:h-44 bg-white p-2 pb-8 shadow-[1px_2px_8px_rgba(0,0,0,0.12)] transition-transform duration-300 group-hover:rotate-0 group-hover:scale-105">
                {!avatarError && profile.avatar_url ? (
                  <img src={getAssetUrl(profile.avatar_url)} alt={profile.display_name} className="w-full h-full object-cover" onError={() => setAvatarError(true)} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-900 font-bold text-3xl" style={{ fontFamily: "'Permanent Marker', cursive" }}>
                    {profile.display_name?.charAt(0).toUpperCase() || ''}
                  </div>
                )}
                <div className="absolute bottom-1.5 left-0 right-0 text-center nb-pencil text-[13px] nb-handwriting font-medium">📸 me!</div>
              </div>
            </div>
            {/* Name + Title + Year + Mood */}
            <div className={`flex flex-col items-center min-w-0 ${data.featured_work_url ? 'mt-1' : 'pt-1 sm:pt-3'}`}>
              <h1 className="text-4xl sm:text-5xl font-black nb-ink tracking-tight leading-tight nb-section-title" style={{ fontSize: 'clamp(2.2rem, 6vw, 3.2rem)' }}>
                {profile.display_name}
              </h1>
              {data.mood && (
                <div className="text-2xl font-bold nb-ink mt-1 mb-1" style={{ fontFamily: "'Permanent Marker', cursive" }}>{data.mood}</div>
              )}
              <p className="text-[#b91c1c] font-bold text-xl nb-handwriting flex items-center justify-center gap-1.5 mt-1 leading-[30px]">
                <GraduationCap size={20} /> {data.course } {data.university ? `@ ${data.university}` : ''}
              </p>
              {(data.year || data.batch_year) && (
                <p className="text-gray-700 text-xl nb-handwriting font-semibold leading-[30px] flex items-center justify-center">
                  {data.year ? `Year ${data.year}` : ''}{data.year && data.batch_year ? ' · ' : ''}{data.batch_year ? `Batch of ${data.batch_year}` : ''}
                </p>
              )}
              {profile.bio && (
                <p className="nb-ink text-2xl leading-[34px] nb-handwriting font-medium mt-2 max-w-2xl">"{profile.bio}"</p>
              )}
            </div>
          </div>

          {/* CTA + Availability — centered */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-4 w-full mt-2">
            {(data.resume_url || data.website) && (
              <div className="flex flex-wrap gap-4 items-center">
                {data.resume_url && (
                  <a href={data.resume_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 nb-handwriting text-[#991b1b] hover:text-[#7f1d1d] transition-colors text-xl font-black rotate-[-2deg]">
                    <FileText size={20} /> My Resume <ExternalLink size={16} className="ml-0.5" />
                  </a>
                )}
                {data.website && (
                  <a href={ensureAbsoluteUrl(data.website)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 nb-handwriting text-[#1e3a8a] hover:text-[#172554] transition-colors text-xl font-black rotate-[1deg]">
                    <Globe size={20} /> Personal Site <ExternalLink size={16} className="ml-0.5" />
                  </a>
                )}
              </div>
            )}
            {data.availability && (
              <div className="nb-doodle-box inline-flex items-center gap-2 rotate-[-1deg]" style={{ borderColor: '#2B6CB0' }}>
                <Briefcase size={14} className="nb-ink" />
                <span className="nb-handwriting text-base font-bold nb-ink">
                  Open to: <span className="nb-highlight">{data.availability}</span>
                </span>
              </div>
            )}
          </div>

          <hr className="nb-divider" />

          {/* ═══ STATS ROW — compact circles ═══ */}
          {(data.campus_rank_pct || data.study_buddies || data.courses_completed || stats) && (
            <>
              <div className="flex flex-wrap gap-3 items-center mb-1">
                <div className={`nb-stat ${isFreeProfile ? 'cursor-pointer' : ''}`} onClick={() => isFreeProfile && setShowFomoModal(true)}>
                  <span className={`text-lg nb-ink ${isFreeProfile ? 'blur-[3px]' : ''}`}>{liveViews}</span>
                  <span className="text-[8px] nb-pencil font-sans uppercase tracking-wider">views</span>
                </div>
                {data.campus_rank_pct && (
                  <div className="nb-stat" style={{ borderColor: '#c53030' }}>
                    <span className="text-base font-black nb-red-ink">Top {data.campus_rank_pct}%</span>
                    <span className="text-[9px] text-gray-600 font-sans uppercase tracking-wider font-bold">rank</span>
                  </div>
                )}
                {data.courses_completed && (
                  <div className="nb-stat">
                    <span className="text-xl font-black nb-ink">{data.courses_completed}</span>
                    <span className="text-[9px] text-gray-600 font-sans uppercase tracking-wider font-bold">courses</span>
                  </div>
                )}
                {data.study_buddies && (
                  <div className="nb-stat" style={{ borderColor: '#2B6CB0' }}>
                    <span className="text-xl font-black nb-ink">{data.study_buddies}</span>
                    <span className="text-[9px] text-gray-600 font-sans uppercase tracking-wider font-bold">buddies</span>
                  </div>
                )}
                {data.favorite_subject && (
                  <div className="nb-doodle-box inline-flex items-center gap-2" style={{ borderColor: '#c53030' }}>
                    <Star size={16} className="nb-red-ink" />
                    <span className="nb-handwriting text-lg font-black nb-red-ink">Fav: <span className="nb-highlight">{data.favorite_subject}</span></span>
                  </div>
                )}
              </div>
              <hr className="nb-divider" />
            </>
          )}

          {/* ═══ ABOUT ME ═══ */}
          {profile.bio && (
            <>
              <div className="w-full mb-1">
                <h3 className="nb-section-title mb-1 flex items-center gap-1.5 text-xl font-black">
                  <BookOpen size={20} className="nb-ink opacity-70" /> About Me
                </h3>
                <p className="nb-ink text-2xl font-medium leading-[34px] nb-handwriting">{profile.bio}</p>
              </div>
              <hr className="nb-divider" />
            </>
          )}

          {/* ═══ SKILLS ═══ */}
          {data.core_skills && data.core_skills.length > 0 && (
            <>
              <div className="w-full mb-1">
                <h3 className="nb-section-title mb-2 flex items-center gap-1.5">
                  <Zap size={16} className="nb-ink opacity-50" /> Skills & Powers
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.core_skills.map((skill: string, i: number) => (
                    <span key={i} className="nb-tag">⚡ {skill}</span>
                  ))}
                </div>
              </div>
              <hr className="nb-divider" />
            </>
          )}

          {/* ═══ PROJECTS + HACKATHONS — 2 col grid ═══ */}
          {(data.projects?.length > 0 || data.hackathons?.length > 0) && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-1">
                {/* Projects */}
                {data.projects && data.projects.length > 0 && (
                  <div>
                    <h3 className="nb-section-title mb-2 flex items-center gap-1.5">
                      <Rocket size={16} className="nb-ink opacity-50" /> Projects
                    </h3>
                    <div className="space-y-2">
                      {data.projects.map((proj: any, i: number) => (
                        <div key={i} className="nb-card p-3 relative">
                          <div className="flex items-start gap-2">
                            <span className="text-lg">{proj.emoji || ''}</span>
                            <div className="flex-grow min-w-0">
                              <h4 className="text-lg font-bold nb-ink nb-handwriting leading-[28px]">{proj.name}</h4>
                              {proj.description && <p className="nb-pencil text-base nb-handwriting leading-[28px]">{proj.description}</p>}
                              {proj.tech && proj.tech.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {proj.tech.map((t: string, j: number) => (
                                    <span key={j} className="px-2 py-0.5 bg-blue-50/50 border border-blue-200 rounded-sm text-[10px] font-bold nb-ink uppercase tracking-wider font-sans">{t}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Hackathons */}
                {data.hackathons && data.hackathons.length > 0 && (
                  <div>
                    <h3 className="nb-section-title mb-2 flex items-center gap-1.5">
                      <Trophy size={16} className="nb-ink opacity-50" /> Hackathons
                    </h3>
                    <div className="space-y-1">
                      {data.hackathons.map((h: any, i: number) => (
                        <div key={i} className="flex items-start gap-2 py-1">
                          <span className="text-base mt-0.5">🏆</span>
                          <div className="flex-grow min-w-0">
                            <span className="nb-handwriting text-lg font-bold nb-ink leading-[28px]">{h.name}</span>
                            {h.year && <span className="nb-pencil text-xs font-sans ml-1">({h.year})</span>}
                            {h.achievement && <p className="nb-handwriting text-base nb-red-ink font-semibold leading-[28px]">↳ {h.achievement}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <hr className="nb-divider" />
            </>
          )}

          {/* ═══ CLUBS + HOBBIES — side by side ═══ */}
          {(data.clubs?.length > 0 || data.hobbies?.length > 0) && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-1">
                {data.clubs?.length > 0 && (
                  <div>
                    <h3 className="nb-section-title mb-2 flex items-center gap-1.5">
                      <Users size={16} className="nb-ink opacity-50" /> Clubs & Orgs
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {data.clubs.map((club: string, i: number) => (
                        <span key={i} className="nb-tag">🎓 {club}</span>
                      ))}
                    </div>
                  </div>
                )}
                {data.hobbies?.length > 0 && (
                  <div>
                    <h3 className="nb-section-title mb-2 flex items-center gap-1.5">
                      <Heart size={16} className="nb-ink opacity-50" /> Hobbies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {data.hobbies.map((hobby: string, i: number) => (
                        <span key={i} className="nb-tag nb-tag-pink">💛 {hobby}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <hr className="nb-divider" />
            </>
          )}

          {/* ═══ SOCIALS + EVENTS — side by side ═══ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-1">
            {/* Social Links */}
            {data?.platforms && data?.platforms?.length > 0 && (
              <div>
                <h3 className="nb-section-title mb-2 flex items-center gap-1.5">
                  <Globe size={16} className="nb-ink opacity-50" /> Find Me Here
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.platforms.map((p: any, i: number) => {
                    const pData = getPlatformData(p.platform?.toLowerCase())
                    return (
                      <a key={i} href={ensureAbsoluteUrl(p.url)} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => { handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url)); if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank'); }}
                        className="nb-tag group relative">
                        <div className="opacity-80 group-hover:opacity-100 transition-opacity">{pData.icon}</div>
                        {p.platform}
                        {isGated && (<div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg"><Lock size={12} className="nb-pencil" /></div>)}
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
            {/* Events */}
            {data.upcoming_events && data.upcoming_events.length > 0 && (
              <div>
                <h3 className="nb-section-title mb-2 flex items-center gap-1.5">
                  <Calendar size={16} className="nb-ink opacity-50" /> Coming Up
                </h3>
                <div className="space-y-1">
                  {data.upcoming_events.map((ev: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 py-0.5">
                      <Calendar size={13} className="nb-ink shrink-0 opacity-50" />
                      <span className="nb-handwriting text-base font-bold nb-ink leading-[28px]">{ev.title}</span>
                      <span className="nb-pencil text-xs font-sans ml-auto whitespace-nowrap">{ev.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {(data?.platforms?.length > 0 || data.upcoming_events?.length > 0) && <hr className="nb-divider" />}

          {/* ═══ THOUGHT BUBBLE + CONTACT — side by side ═══ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-1">
            {data.thought_bubble && (
              <div className="nb-card p-4 text-center relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#B8D4E3]/40 washi-tape rounded-sm z-20" />
                <h3 className="nb-section-title mb-1 text-center">✨ Advice I Live By</h3>
                <p className="nb-handwriting text-xl nb-ink italic leading-[28px]">"{data.thought_bubble}"</p>
                <Heart size={14} className="mx-auto mt-2 nb-red-ink opacity-50" />
              </div>
            )}
            {data.contact_email && (
              <div className="nb-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#1e3a5f] flex items-center justify-center shrink-0 bg-blue-50/30">
                  <Mail size={18} className="nb-ink" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-lg font-bold nb-ink nb-handwriting leading-[28px]">Let's Talk!</h4>
                  <a href={`mailto:${data.contact_email}`} className="text-xs font-bold nb-ink hover:underline font-sans">{data.contact_email}</a>
                </div>
              </div>
            )}
          </div>

          {/* Save Contact / Share CTAs */}
          <div className="w-full mt-12 mb-2 flex flex-col items-center justify-center z-20">
            <div className="max-w-[280px] w-full p-2 bg-[#FDF9F1] nb-card rotate-[1deg]">
              <ProfileCTAs profile={profile} accentColor="#1e3a5f" />
            </div>
          </div>

          {/* Page number */}
          <div className="w-full text-center mt-6 nb-pencil opacity-30">
            <span className="nb-handwriting text-sm">— page 1 of 1 —</span>
          </div>
          
        </main>
      </div>

      {showFomoModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
          <div className="bg-[#FFFDF7] p-8 max-w-sm w-full shadow-2xl relative text-center nb-card border-[3px] border-[#1e3a5f]" style={{ borderRadius: '4px' }}>
            <button onClick={() => setShowFomoModal(false)} className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-800 transition-colors">
              <X size={24} />
            </button>
            <h3 className="text-3xl font-bold nb-ink mb-2 nb-section-title">📓 Secret Stats</h3>
            <p className="nb-pencil mb-6 font-medium text-xl leading-snug nb-handwriting">These notes are premium. Upgrade to unlock all the stats!</p>
            <button onClick={() => window.location.href = '/#pricing'} className="w-full py-3 bg-[#1e3a5f] hover:bg-[#2d4a7c] text-white font-bold text-xl transition-colors rounded-sm shadow-md nb-handwriting">
              Unlock Now ✨
            </button>
          </div>
        </div>
      )}

      {showSpotifyQR && data.playlist_url && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm" onClick={() => setShowSpotifyQR(false)}>
          <div className="bg-white p-8 max-w-sm w-full shadow-2xl relative text-center rounded-2xl flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowSpotifyQR(false)} className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-800 transition-colors">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center gap-2">
              <Music className="text-[#1DB954]" />
              {data.playlist_name || ''}
            </h3>
            
            <div className="bg-white p-4 rounded-xl shadow-inner mb-6 border border-neutral-100 w-full flex justify-center">
              <QRCodeSVG value={ensureAbsoluteUrl(data.playlist_url)} size={220} fgColor="#1DB954" bgColor="transparent" />
            </div>
            
            <a 
              href={ensureAbsoluteUrl(data.playlist_url)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full py-3 bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold text-lg rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Open in Spotify <ExternalLink size={18} />
            </a>
          </div>
        </div>
      )}

      <GateModal />
    </div>
  )
}

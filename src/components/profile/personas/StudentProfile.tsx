import React from 'react'
import { ProfileData, StudentData } from '../../../types/profile'
import { 
  GraduationCap, BookOpen, Rocket, FileText, 
  Globe, Music, Sparkles, Heart, Star, Users,
  Share2, UserPlus, QrCode, ExternalLink, Github, Linkedin, Twitter, Instagram,
  MessageCircle, Link as LinkIcon, Trophy, Target, Briefcase, Zap, Mail, Calendar, Ghost, Activity, X, Lock
} from 'lucide-react'
import { getAssetUrl } from '../../../lib/supabase'
import { ProfileCTAs } from '../shared/ProfileCTAs'
import { trackLinkClick } from '../../../lib/analytics/track'
import { useGatedLink } from '../../../hooks/useGatedLink'

export function StudentProfile({ profile, stats }: { profile: ProfileData, stats?: any }) {
  const data = (profile.persona_data || {}) as StudentData;
  const activeTheme = (profile.profile_theme || 'default').toLowerCase();
  const { isGated, handleGatedClick, GateModal } = useGatedLink();
  const liveViews = stats?.totalViews || 0;
  const isFreeProfile = profile.tier === 'Starter' || profile.tier === 'Free' || profile.status === 'free' || (!profile.status && (!profile.tier || profile.tier === 'Starter'));
  const [showFomoModal, setShowFomoModal] = React.useState(false);
  
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
                  <img src={getAssetUrl(profile.avatar_url)} alt={profile.display_name} className="w-full h-full object-cover rounded-full" />
                </div>
              </div>

              <div 
                className={`absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 z-40 ${isFreeProfile ? 'cursor-pointer hover:opacity-85 transition-opacity' : ''}`}
                onClick={() => isFreeProfile && setShowFomoModal(true)}
              >
                <div className="bg-neutral-900 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-lg shadow-emerald-900/10 border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
                  <Activity size={14} className="text-emerald-400 sm:w-4 sm:h-4 animate-pulse" />
                  <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] ${isFreeProfile ? 'blur-[3px] select-none opacity-60 inline-block px-1' : ''}`}>{isFreeProfile ? '8,204' : liveViews} Pulse</span>
                </div>
              </div>
            </div>

            <div className="text-center w-full">
              <h1 className="text-2xl sm:text-4xl leading-tight font-black text-neutral-900 tracking-tight mb-1.5">
                {profile.display_name}
              </h1>
              <p className="text-emerald-500 font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-1.5">
                <GraduationCap size={18} /> {data.university ? `Student @ ${data.university}` : 'Student'}
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

          <div className="w-full max-w-sm mb-8 z-20">
            <ProfileCTAs profile={profile} accentColor="#10B981" />
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

          {data.about_me && (
            <div className="w-full mb-10">
              <div className="bg-white p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border border-neutral-100 shadow-sm relative overflow-hidden text-left">
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

          {data?.platforms && data?.platforms?.length > 0 && (
            <div className="w-full mb-10 text-left">
              <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-4 sm:mb-6 px-2 text-center">Digital Footprint</h4>
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
                        {pData.logo ? (
                          <img 
                            src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${pData.logo}.svg`}
                            className="w-5 h-5 filter invert object-contain"
                            style={{ filter: 'brightness(0)' }}
                            alt={p.platform}
                          />
                        ) : (
                          pData.icon
                        )}
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
      <div className="w-full min-h-screen bg-[#FDFBF7] text-[#1E3A8A] pb-24 p-4 sm:p-8 relative selection:bg-amber-200">
        <style dangerouslySetInnerHTML={{
          __html: `
            .varsity-bg {
              background-image: radial-gradient(#1E3A8A 1px, transparent 1px);
              background-size: 20px 20px;
              opacity: 0.03;
            }
            .varsity-shadow {
              box-shadow: 8px 8px 0px 0px #1E3A8A;
            }
            .varsity-shadow-sm {
              box-shadow: 4px 4px 0px 0px #1E3A8A;
            }
            .hover-varsity-shadow:hover {
              box-shadow: 12px 12px 0px 0px #1E3A8A;
              transform: translate(-4px, -4px);
            }
          `
        }} />

        <div className="absolute inset-0 varsity-bg pointer-events-none z-0" />
        
        {/* Varsity Header Band */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-[#1E3A8A] border-b-8 border-amber-400 z-0" />

        <main className="relative z-10 max-w-2xl mx-auto px-4 flex flex-col items-center pt-12">
          
          <div className="w-full bg-white border-4 border-[#1E3A8A] p-8 text-center varsity-shadow hover-varsity-shadow transition-all duration-300 mb-12 relative mt-12">
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-amber-400 border-4 border-[#1E3A8A] rounded-full flex items-center justify-center font-black text-[#1E3A8A] text-xl transform -rotate-12 z-20">
              A+
            </div>
            
            <div className="relative -mt-20 mb-6 flex justify-center z-10">
              <div className="w-40 h-40 rounded-full border-8 border-white bg-white overflow-hidden shadow-2xl relative">
                <div className="w-full h-full rounded-full border-4 border-[#1E3A8A] overflow-hidden">
                  <img 
                    src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=1e3a8a&color=ffffff`} 
                    alt={profile.display_name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#1E3A8A] uppercase mb-3">
              {profile.display_name}
            </h1>
            
            <div className="inline-block bg-amber-400 text-[#1E3A8A] px-6 py-2 border-2 border-[#1E3A8A] font-black text-sm uppercase tracking-widest mb-6 shadow-[4px_4px_0px_0px_rgba(30,58,138,0.2)] transform rotate-1">
              <GraduationCap size={18} className="inline mr-2 -mt-1" />
              {data.university ? data.university : 'VARSITY LEAGUE'}
            </div>

            {profile.bio && (
              <p className="text-sm font-bold text-neutral-600 leading-relaxed italic max-w-md mx-auto bg-neutral-50 p-4 border-l-4 border-amber-400">
                "{profile.bio}"
              </p>
            )}
          </div>

          {(data.campus_rank_pct || data.study_buddies || stats) && (
            <div className="w-full mb-12">
              <h3 className="text-xs font-black uppercase text-[#1E3A8A] tracking-[0.2em] mb-4 flex items-center gap-4">
                <span className="flex-grow h-1 bg-[#1E3A8A]"></span>
                ACADEMIC STANDING
                <span className="flex-grow h-1 bg-[#1E3A8A]"></span>
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div 
                  className={`bg-white border-4 border-[#1E3A8A] p-6 text-center varsity-shadow-sm transition-all ${isFreeProfile ? 'cursor-pointer hover:bg-neutral-50' : ''}`}
                  onClick={() => isFreeProfile && setShowFomoModal(true)}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Campus Scans</span>
                  <span className={`text-3xl font-black text-[#1E3A8A] flex justify-center items-center gap-2 ${isFreeProfile ? 'blur-[6px]' : ''}`}>
                    {isFreeProfile ? '8,204' : liveViews} <Activity size={24} className="text-amber-500" />
                  </span>
                </div>
                
                {data.campus_rank_pct && (
                  <div className="bg-[#1E3A8A] text-white border-4 border-[#1E3A8A] p-6 text-center varsity-shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mb-2">Honor Roll</span>
                    <span className="text-3xl font-black flex justify-center items-center gap-2">
                      Top {data.campus_rank_pct}% <Trophy size={24} className="text-amber-400" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {data.about_me && (
            <div className="w-full bg-white p-8 border-4 border-[#1E3A8A] varsity-shadow hover-varsity-shadow transition-all duration-300 mb-12 relative group">
              <div className="absolute top-4 right-4 text-amber-400 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                <BookOpen size={64} />
              </div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#1E3A8A] mb-4 flex items-center gap-3">
                <div className="w-8 h-1 bg-amber-400" /> STUDENT BIO
              </h4>
              <p className="text-sm text-neutral-700 leading-loose font-medium text-left relative z-10">
                {data.about_me}
              </p>
            </div>
          )}

          {data?.platforms && data?.platforms?.length > 0 && (
            <div className="w-full mb-12">
              <h3 className="text-xs font-black uppercase text-[#1E3A8A] tracking-[0.2em] mb-6 flex items-center gap-4">
                <span className="flex-grow h-1 bg-[#1E3A8A]"></span>
                STUDENT DIRECTORY
                <span className="flex-grow h-1 bg-[#1E3A8A]"></span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {data.platforms.map((p: any, i: number) => {
                  const pData = getPlatformData(p.platform)
                  return (
                    <a 
                      key={i}
                      href={ensureAbsoluteUrl(p.url)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url));
                        if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank');
                      }}
                      className="bg-white border-4 border-[#1E3A8A] p-6 flex flex-col items-center justify-center gap-3 hover:-translate-y-2 hover:varsity-shadow transition-all cursor-pointer social-link-item group"
                    >
                      <div className="w-12 h-12 bg-neutral-100 group-hover:bg-amber-400 transition-colors border-2 border-[#1E3A8A] flex items-center justify-center relative">
                        {pData.logo ? (
                          <img 
                            src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${pData.logo}.svg`}
                            className="w-6 h-6 filter invert object-contain transition-transform group-hover:scale-110"
                            style={{ filter: 'brightness(0)' }}
                            alt={p.platform}
                          />
                        ) : (
                          pData.icon
                        )}
                        {isGated && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Lock size={14} className="text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-black uppercase text-[#1E3A8A]">{p.platform}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {data.availability && (
            <div className="w-full bg-amber-400 border-4 border-[#1E3A8A] p-6 text-[#1E3A8A] flex items-center gap-6 varsity-shadow hover-varsity-shadow transition-all duration-300 mb-12">
              <Briefcase size={32} className="animate-bounce" />
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#1E3A8A]/60 mb-1">CURRENTLY SEEKING</p>
                <p className="text-sm font-black tracking-wide">{data.availability}</p>
              </div>
            </div>
          )}

          <div className="w-full max-w-sm mb-12 z-20">
            <ProfileCTAs profile={profile} accentColor="#1E3A8A" />
          </div>

        </main>

        {showFomoModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#1E3A8A]/80 backdrop-blur-sm">
            <div className="bg-white border-4 border-[#1E3A8A] p-8 max-w-sm w-full varsity-shadow relative text-center">
              <button onClick={() => setShowFomoModal(false)} className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-[#1E3A8A] transition-colors">
                <X size={24} />
              </button>
              <Activity size={48} className="text-amber-400 mx-auto mb-6 animate-pulse" />
              <h3 className="text-2xl font-black text-[#1E3A8A] uppercase mb-3">Unlock Premium</h3>
              <p className="text-sm font-medium text-neutral-600 mb-8">Access advanced academic metrics and live campus scans.</p>
              <button onClick={() => window.location.href = '/#pricing'} className="w-full py-4 bg-amber-400 hover:bg-amber-300 border-4 border-[#1E3A8A] text-[#1E3A8A] font-black text-xs uppercase tracking-widest transition-all varsity-shadow-sm hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1E3A8A]">
                CLAIM STATUS
              </button>
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
      <div className="w-full min-h-screen bg-[#0A0514] text-[#E0E7FF] pb-24 p-4 sm:p-8 relative selection:bg-indigo-500/30 selection:text-white">
        <style dangerouslySetInnerHTML={{
          __html: `
            .glass-panel {
              background: rgba(17, 24, 39, 0.6);
              backdrop-filter: blur(16px);
              -webkit-backdrop-filter: blur(16px);
              border: 1px solid rgba(99, 102, 241, 0.1);
              box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
            }
            .glass-panel:hover {
              border: 1px solid rgba(99, 102, 241, 0.3);
              box-shadow: 0 8px 32px 0 rgba(99, 102, 241, 0.1);
            }
            .text-glow {
              text-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
            }
          `
        }} />

        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

        <main className="relative z-10 max-w-2xl mx-auto px-4 flex flex-col items-center pt-12">
          
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="w-48 h-48 rounded-full border border-indigo-500/30 bg-[#0A0514] p-2 relative z-10">
              <img 
                src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=0A0514&color=6366f1`} 
                alt={profile.display_name} 
                className="w-full h-full object-cover rounded-full filter contrast-125 brightness-90" 
              />
            </div>
          </div>

          <div className="glass-panel w-full p-8 rounded-3xl text-center mb-12 relative overflow-hidden transition-all duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-400">
              <Rocket size={120} />
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-light tracking-widest text-white uppercase mb-4 text-glow">
              {profile.display_name}
            </h1>
            
            <p className="text-indigo-400 font-medium text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-3">
              <BookOpen size={18} /> {data.university || 'NIGHT ACADEMICS'}
            </p>
            
            {profile.bio && (
              <p className="text-sm text-indigo-200/60 leading-loose mt-8 font-light max-w-lg mx-auto">
                {profile.bio}
              </p>
            )}
          </div>

          {(data.campus_rank_pct || data.study_buddies || stats) && (
            <div className="grid grid-cols-2 gap-6 w-full mb-12">
              <div 
                className={`glass-panel p-6 rounded-3xl text-center transition-all duration-300 ${isFreeProfile ? 'cursor-pointer hover:bg-white/5' : ''}`}
                onClick={() => isFreeProfile && setShowFomoModal(true)}
              >
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-indigo-400/50 block mb-3">Live Scans</span>
                <span className={`text-3xl font-light text-white flex justify-center items-center gap-3 ${isFreeProfile ? 'blur-[8px]' : ''}`}>
                  {isFreeProfile ? '8,204' : liveViews} <Activity size={20} className="text-indigo-400" />
                </span>
              </div>
              
              {data.campus_rank_pct && (
                <div className="glass-panel p-6 rounded-3xl text-center">
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-indigo-400/50 block mb-3">Honor Rank</span>
                  <span className="text-3xl font-light text-white flex justify-center items-center gap-3">
                    Top {data.campus_rank_pct}% <Trophy size={20} className="text-amber-400" />
                  </span>
                </div>
              )}
            </div>
          )}

          {data.about_me && (
            <div className="w-full mb-12 glass-panel p-8 rounded-3xl text-left">
              <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-indigo-400 mb-6 flex items-center gap-4">
                <div className="h-px bg-indigo-500/30 flex-grow" />
                BIO SUMMARY
                <div className="h-px bg-indigo-500/30 flex-grow" />
              </h4>
              <p className="text-sm text-indigo-100/80 leading-loose font-light">
                {data.about_me}
              </p>
            </div>
          )}

          {data?.platforms && data?.platforms?.length > 0 && (
            <div className="w-full mb-12 text-left">
              <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-indigo-400 mb-6 text-center">CONNECTIONS</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {data.platforms.map((p: any, i: number) => {
                  const pData = getPlatformData(p.platform)
                  return (
                    <a 
                      key={i}
                      href={ensureAbsoluteUrl(p.url)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url));
                        if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank');
                      }}
                      className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:scale-[1.02] social-link-item group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-indigo-500/20 text-indigo-300 flex items-center justify-center relative transition-colors">
                        {pData.logo ? (
                          <img 
                            src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${pData.logo}.svg`}
                            className="w-5 h-5 filter invert object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                            style={{ filter: 'brightness(0) invert(1)' }}
                            alt={p.platform}
                          />
                        ) : (
                          pData.icon
                        )}
                        {isGated && (
                          <div className="absolute inset-0 bg-[#0A0514]/80 flex items-center justify-center rounded-xl border border-indigo-500/30">
                            <Lock size={14} className="text-indigo-400" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-medium uppercase tracking-widest text-indigo-300/70 group-hover:text-indigo-300 transition-colors">{p.platform}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {data.availability && (
            <div className="w-full glass-panel p-6 rounded-3xl flex items-center gap-6 mb-12">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/30">
                <Zap size={20} className="text-indigo-400" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-indigo-400/50 mb-1">LOOKING FOR</p>
                <p className="text-sm font-light tracking-wider text-indigo-100">{data.availability}</p>
              </div>
            </div>
          )}

          <div className="w-full max-w-sm mb-12 z-20">
            <ProfileCTAs profile={profile} accentColor="#6366f1" />
          </div>

        </main>

        {showFomoModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0A0514]/90 backdrop-blur-md">
            <div className="glass-panel p-8 max-w-sm w-full rounded-3xl relative text-center">
              <button onClick={() => setShowFomoModal(false)} className="absolute top-4 right-4 p-2 text-indigo-400/50 hover:text-white transition-colors">
                <X size={24} />
              </button>
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-6">
                <Lock size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-2xl font-light text-white tracking-widest uppercase mb-3">Locked Stats</h3>
              <p className="text-sm font-light text-indigo-200/60 mb-8 leading-relaxed">Upgrade to view live scanning metrics and academic performance indicators.</p>
              <button onClick={() => window.location.href = '/#pricing'} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[10px] uppercase tracking-[0.2em] rounded-xl transition-colors">
                UNLOCK ACCESS
              </button>
            </div>
          </div>
        )}
        <GateModal />
      </div>
    )
  }

  // ----------------------------------------------------
  // LAYOUT 3: SKETCHED RULED NOTEBOOK (Default / Notebook Theme)
  // ----------------------------------------------------
  return (
    <div className="w-full min-h-screen relative overflow-x-hidden bg-[#Fdfbf7] text-[#333333] transition-colors duration-300 pb-24 p-4 sm:p-8 selection:bg-blue-100 font-sans">
      
      {/* Notebook Paper Lines */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{
          backgroundImage: 'linear-gradient(#E5E7EB 1px, transparent 1px)',
          backgroundSize: '100% 32px',
          backgroundPosition: 'top left'
        }}
      />
      {/* Red Margin Line */}
      <div className="absolute top-0 bottom-0 left-[15%] w-[1px] bg-red-400/60 pointer-events-none z-0" />
      <div className="absolute top-0 bottom-0 left-[15.5%] w-[1px] bg-red-400/60 pointer-events-none z-0" />

      <main className="relative z-10 max-w-2xl mx-auto px-4 flex flex-col items-center pt-8">
        
        {/* Tape/Polaroid Avatar */}
        <div className="relative mb-12 mt-6 group">
          <div className="w-48 h-56 bg-white p-3 pb-12 shadow-[0_10px_30px_rgba(0,0,0,0.1)] rotate-[-2deg] transition-transform duration-500 hover:rotate-0 hover:scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/50 backdrop-blur-sm border border-neutral-200 shadow-sm rotate-[4deg] opacity-80" />
            <img 
              src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=f3f4f6&color=374151`} 
              alt={profile.display_name} 
              className="w-full h-full object-cover filter contrast-110 sepia-[0.2]"
              onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=f3f4f6&color=374151`; }} 
            />
            <div className="absolute bottom-4 left-0 right-0 text-center text-neutral-500 font-medium text-sm" style={{ fontFamily: "'Indie Flower', cursive, sans-serif" }}>
              {profile.display_name}
            </div>
          </div>
        </div>

        {/* Title / Name */}
        <div className="w-full mb-12 text-center pl-[5%]">
          <h1 className="text-4xl sm:text-6xl font-black text-neutral-800 tracking-tight mb-2" style={{ fontFamily: "'Permanent Marker', cursive, sans-serif" }}>
            {profile.display_name}
          </h1>
          <p className="text-blue-600 font-bold text-lg" style={{ fontFamily: "'Indie Flower', cursive, sans-serif" }}>
            {data.university ? `@ ${data.university}` : 'Student'}
          </p>
        </div>

        {/* Bio (Sticky Note) */}
        {profile.bio && (
          <div className="w-full max-w-sm ml-auto mr-4 mb-12 relative rotate-[3deg]">
            <div className="bg-[#FEF08A] p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#FDE047] opacity-60" />
              <p className="text-neutral-800 text-lg leading-relaxed" style={{ fontFamily: "'Indie Flower', cursive, sans-serif" }}>
                "{profile.bio}"
              </p>
            </div>
          </div>
        )}

        {/* Metrics */}
        {(data.campus_rank_pct || data.study_buddies || stats) && (
          <div className="grid grid-cols-2 gap-8 w-full mb-12 pl-[5%]">
            <div 
              className={`border-2 border-neutral-300 border-dashed rounded-2xl p-6 text-center bg-white/50 backdrop-blur-sm ${isFreeProfile ? 'cursor-pointer hover:bg-white' : ''}`}
              onClick={() => isFreeProfile && setShowFomoModal(true)}
            >
              <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest mb-2">Visits</p>
              <div className={`text-4xl font-black text-neutral-800 ${isFreeProfile ? 'blur-[5px]' : ''}`} style={{ fontFamily: "'Indie Flower', cursive, sans-serif" }}>
                {isFreeProfile ? '8k+' : liveViews}
              </div>
            </div>
            
            {data.campus_rank_pct && (
              <div className="border-2 border-neutral-300 border-dashed rounded-2xl p-6 text-center bg-white/50 backdrop-blur-sm">
                <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest mb-2">Rank</p>
                <div className="text-4xl font-black text-blue-600" style={{ fontFamily: "'Indie Flower', cursive, sans-serif" }}>
                  Top {data.campus_rank_pct}%
                </div>
              </div>
            )}
          </div>
        )}

        {/* About Me */}
        {data.about_me && (
          <div className="w-full mb-12 pl-[5%]">
            <div className="relative">
              <h3 className="text-xl font-bold text-neutral-800 mb-4" style={{ fontFamily: "'Permanent Marker', cursive, sans-serif" }}>
                About Me...
              </h3>
              <p className="text-lg text-neutral-700 leading-[32px] font-medium" style={{ fontFamily: "'Indie Flower', cursive, sans-serif" }}>
                {data.about_me}
              </p>
            </div>
          </div>
        )}

        {/* Links */}
        {data?.platforms && data?.platforms?.length > 0 && (
          <div className="w-full mb-12 pl-[5%]">
            <h3 className="text-xl font-bold text-neutral-800 mb-6 text-center" style={{ fontFamily: "'Permanent Marker', cursive, sans-serif" }}>
              Find me here ↓
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {data.platforms.map((p: any, i: number) => {
                const platform = p.platform?.toLowerCase()
                const Icon = PLATFORM_ICONS[platform] || Share2
                return (
                  <a 
                    key={i}
                    href={ensureAbsoluteUrl(p.url)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url));
                      if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank');
                    }}
                    className="w-16 h-16 bg-white border-2 border-neutral-300 rounded-full flex items-center justify-center hover:scale-110 hover:border-blue-500 transition-all shadow-sm relative group"
                  >
                    <Icon className="w-6 h-6 opacity-60 group-hover:opacity-100 text-neutral-800 transition-opacity" />
                    {isGated && (
                      <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
                        <Lock size={16} className="text-neutral-500" />
                      </div>
                    )}
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {data.availability && (
          <div className="w-full mb-12 pl-[5%]">
            <div className="inline-block border-4 border-blue-500 rounded-full px-6 py-3 text-blue-600 font-bold text-lg rotate-[-2deg]" style={{ fontFamily: "'Indie Flower', cursive, sans-serif" }}>
              Looking for: {data.availability}
            </div>
          </div>
        )}

        <div className="w-full max-w-sm mb-12 pl-[5%] z-20">
          <ProfileCTAs profile={profile} accentColor="#2563EB" />
        </div>

      </main>

      {showFomoModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
          <div className="bg-white p-8 max-w-sm w-full rounded-2xl shadow-xl relative text-center border-2 border-neutral-200">
            <button onClick={() => setShowFomoModal(false)} className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-neutral-800 mb-2" style={{ fontFamily: "'Permanent Marker', cursive, sans-serif" }}>Secret Stats</h3>
            <p className="text-neutral-600 mb-6 font-medium" style={{ fontFamily: "'Indie Flower', cursive, sans-serif" }}>Looks like you need the premium tee to unlock these numbers.</p>
            <button onClick={() => window.location.href = '/#pricing'} className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors shadow-md">
              Unlock Now
            </button>
          </div>
        </div>
      )}

      <GateModal />
    </div>
  )
}

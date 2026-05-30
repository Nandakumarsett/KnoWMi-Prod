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
  // LAYOUT 1: CAMPUS VARSITY STYLE (Campus Theme)
  // ----------------------------------------------------
  if (activeTheme === 'campus') {
    return (
      <div className="w-full min-h-screen bg-[#F1F5F9] text-blue-950 transition-colors duration-300 pb-24 p-4 sm:p-8 relative">
        
        {/* Cork Bulletin notice board overlay */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 opacity-[0.03] pointer-events-none z-0">
          <GraduationCap size={450} />
        </div>

        <main className="relative z-10 max-w-2xl mx-auto px-4 flex flex-col items-center">
          
          {/* Varsity Letter block Frame Avatar */}
          <div className="relative mb-8">
            <div className="w-40 h-40 rounded-[2.5rem] border-4 border-blue-900 bg-white overflow-hidden shadow-2xl p-2 flex items-center justify-center relative">
              <img 
                src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=1e3a8a&color=ffffff`} 
                alt={profile.display_name} 
                className="w-full h-full object-cover rounded-[2rem]" 
              />
              <div className="absolute -top-1 -right-1 bg-amber-500 text-blue-950 w-8 h-8 rounded-full border-2 border-blue-900 flex items-center justify-center font-black text-xs">A+</div>
            </div>
          </div>

          {/* Academic Banner Title Block */}
          <div className="w-full bg-white border-4 border-blue-900 p-8 rounded-[2.5rem] text-center shadow-xl mb-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-900 text-amber-400 px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-white shadow-md">
              CAMPUS ROSTER // ACTIVE
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-blue-950 uppercase mb-2 mt-2 leading-none">
              {profile.display_name}
            </h1>
            
            <p className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 border-t border-neutral-100 pt-4 mt-4">
              <GraduationCap size={16} /> {data.university ? `VARSITY CLASS @ ${data.university}` : 'UNIVERSITY LEAGUE'}
            </p>
            {profile.bio && (
              <p className="text-xs font-semibold text-neutral-600 leading-relaxed mt-4 italic max-w-lg mx-auto">
                "{profile.bio}"
              </p>
            )}
          </div>

          {/* Core Analytics parameters */}
          {(data.campus_rank_pct || data.study_buddies || stats) && (
            <div className="grid grid-cols-2 gap-4 w-full mb-8">
              <div 
                className={`bg-white p-5 rounded-3xl border-2 border-blue-900/10 text-center shadow-md relative hover:border-blue-900/30 transition-all ${isFreeProfile ? 'cursor-pointer hover:opacity-85' : ''}`}
                onClick={() => isFreeProfile && setShowFomoModal(true)}
              >
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block mb-1">Varsity Scans</span>
                <span className={`text-2xl font-black text-blue-950 flex justify-center items-center gap-1 ${isFreeProfile ? 'blur-[6px]' : ''}`}>
                  {isFreeProfile ? '8,204' : liveViews} <Activity size={16} className="text-blue-500" />
                </span>
              </div>
              
              {data.campus_rank_pct && (
                <div className="bg-white p-5 rounded-3xl border-2 border-blue-900/10 text-center shadow-md hover:border-blue-900/30 transition-all">
                  <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block mb-1">Academic Rank</span>
                  <span className="text-2xl font-black text-blue-950 flex justify-center items-center gap-1">
                    Top {data.campus_rank_pct}% <Trophy size={16} className="text-amber-500" />
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Ruled Bulletin noticeboard Bio */}
          {data.about_me && (
            <div className="w-full mb-8">
              <div className="bg-white p-6 rounded-[2rem] border-2 border-blue-900/10 text-left shadow-md">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-800 mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-900" /> ACADEMIC SUMMARY & VIBE
                </h4>
                <p className="text-sm text-neutral-700 leading-relaxed font-semibold">
                  {data.about_me}
                </p>
              </div>
            </div>
          )}

          {/* Social connections */}
          {data?.platforms && data?.platforms?.length > 0 && (
            <div className="w-full mb-8 text-left">
              <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400 mb-4 text-center">// CAMPUS SHUNTS //</h4>
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
                      className="bg-white border-2 border-blue-900/15 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:shadow-md hover:border-blue-900 transition-all cursor-pointer social-link-item"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center relative">
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
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                            <Lock size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] font-black uppercase text-neutral-700">{p.platform}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Availability badge */}
          {data.availability && (
            <div className="w-full max-w-md mb-8">
              <div className="bg-blue-900 text-white rounded-[2rem] p-6 flex items-center gap-4 shadow-xl border-2 border-white">
                <Briefcase size={22} className="text-amber-400 animate-pulse shrink-0" />
                <div className="text-left">
                  <p className="text-[9px] font-black uppercase tracking-widest text-blue-200">// ACTIVE ENGAGEMENTS //</p>
                  <p className="text-xs font-black tracking-wide leading-relaxed mt-1">{data.availability}</p>
                </div>
              </div>
            </div>
          )}

          {/* Connection Actions */}
          <div className="w-full max-w-sm mb-6 z-20">
            <ProfileCTAs profile={profile} accentColor="#1e3a8a" />
          </div>

        </main>
        <GateModal />
      </div>
    )
  }

  // ----------------------------------------------------
  // LAYOUT 2: COZY LATE-NIGHT STUDY DESK (Night Owl Theme)
  // ----------------------------------------------------
  if (activeTheme === 'night owl') {
    return (
      <div className="w-full min-h-screen bg-[#060412] text-indigo-100 transition-colors duration-300 pb-24 p-4 sm:p-8 relative">
        
        {/* Soft Cozy Glowing Study Desk Lamps */}
        <div className="absolute top-[60px] right-[-100px] w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[100px] left-[-100px] w-[350px] h-[350px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none animate-pulse" />

        <main className="relative z-10 max-w-2xl mx-auto px-4 flex flex-col items-center">
          
          {/* Glowing Starry Avatar frame */}
          <div className="relative mb-8">
            <div className="w-40 h-40 rounded-full border-4 border-indigo-500 bg-slate-950 overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.4)] p-1.5 flex items-center justify-center">
              <img 
                src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=020617&color=6366f1`} 
                alt={profile.display_name} 
                className="w-full h-full object-cover rounded-full" 
              />
            </div>
          </div>

          {/* Cozy Workspace Panel */}
          <div className="w-full bg-slate-950/80 border border-indigo-950 p-8 rounded-[2.5rem] text-center shadow-2xl mb-8 backdrop-blur-md relative">
            <div className="absolute top-3 right-6 text-[8px] font-black tracking-widest text-indigo-400/50 uppercase">// NIGHT STUDY DECK</div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase mb-2">
              {profile.display_name}
            </h1>
            
            <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 mt-3 pt-3 border-t border-indigo-950/80">
              <BookOpen size={16} className="text-indigo-500" /> {data.university ? `CAMPUS DEP // ${data.university}` : 'NIGHT OWL ACADEMICS'}
            </p>
            {profile.bio && (
              <p className="text-xs text-indigo-200/70 leading-relaxed mt-4 italic max-w-md mx-auto">
                "{profile.bio}"
              </p>
            )}
          </div>

          {/* Metrics Screen cards */}
          {(data.campus_rank_pct || data.study_buddies || stats) && (
            <div className="grid grid-cols-2 gap-4 w-full mb-8">
              <div 
                className={`bg-slate-950/60 border border-indigo-950/60 p-5 rounded-3xl text-center shadow-lg transition-all hover:border-indigo-500/50 ${isFreeProfile ? 'cursor-pointer hover:opacity-85' : ''}`}
                onClick={() => isFreeProfile && setShowFomoModal(true)}
              >
                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400/50 block mb-1">Session Scans</span>
                <span className={`text-2xl font-black text-indigo-200 ${isFreeProfile ? 'blur-[6px]' : ''}`}>{isFreeProfile ? '8,204' : liveViews}</span>
              </div>
              
              {data.campus_rank_pct && (
                <div className="bg-slate-950/60 border border-indigo-950/60 p-5 rounded-3xl text-center shadow-lg transition-all hover:border-indigo-500/50">
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400/50 block mb-1">Academic Rank</span>
                  <span className="text-2xl font-black text-indigo-200">Top {data.campus_rank_pct}%</span>
                </div>
              )}
            </div>
          )}

          {/* Story Narrative */}
          {data.about_me && (
            <div className="w-full mb-8">
              <div className="bg-slate-950/50 border border-indigo-950 p-6 rounded-3xl text-left shadow-lg">
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> BIO PROFILE SUMMARY
                </h4>
                <p className="text-sm text-indigo-100/90 leading-relaxed font-semibold">
                  {data.about_me}
                </p>
              </div>
            </div>
          )}

          {/* Social links */}
          {data?.platforms && data?.platforms?.length > 0 && (
            <div className="w-full mb-8 text-left">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-4 text-center">// DESK STATIONS //</h4>
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
                      className="bg-slate-950 border border-indigo-950 hover:border-indigo-500 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer social-link-item"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-indigo-400 flex items-center justify-center relative">
                        {pData.logo ? (
                          <img 
                            src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${pData.logo}.svg`}
                            className="w-4 h-4 filter invert object-contain"
                            style={{ filter: 'brightness(0) invert(1)' }}
                            alt={p.platform}
                          />
                        ) : (
                          pData.icon
                        )}
                        {isGated && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                            <Lock size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] font-black uppercase text-indigo-300">{p.platform}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Availability openings */}
          {data.availability && (
            <div className="w-full max-w-md mb-8">
              <div className="bg-gradient-to-tr from-indigo-950 to-slate-950 border border-indigo-500/30 text-white rounded-3xl p-6 flex items-center gap-4 shadow-xl">
                <Zap size={22} className="text-amber-400 animate-pulse shrink-0" />
                <div className="text-left">
                  <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400">// WORKSPACE STATUS //</p>
                  <p className="text-xs font-black tracking-wide leading-relaxed mt-1">{data.availability}</p>
                </div>
              </div>
            </div>
          )}

          {/* Connection Actions */}
          <div className="w-full max-w-sm mb-6 z-20">
            <ProfileCTAs profile={profile} accentColor="#4f46e5" />
          </div>

        </main>
        <GateModal />
      </div>
    )
  }

  // ----------------------------------------------------
  // LAYOUT 3: SKETCHED RULED NOTEBOOK (Default / Notebook Theme)
  // ----------------------------------------------------
  return (
    <div className="w-full min-h-screen relative overflow-x-hidden bg-[#FCFAF5] text-neutral-800 transition-colors duration-300 pb-24 p-4 sm:p-8 selection:bg-emerald-100">
      
      {/* Hand drawn horizontal lined paper rules */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 z-0" 
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 128, 255, 0.15) 1.5px, transparent 1.5px)',
          backgroundSize: '100% 28px',
          backgroundPosition: 'top left'
        }}
      />
      {/* Ruled notebook vertical margin line */}
      <div className="absolute top-0 bottom-0 left-[12%] sm:left-[15%] w-[2px] bg-red-400/40 pointer-events-none z-0" />

      <main className="relative z-10 max-w-2xl mx-auto px-4 flex flex-col items-center">
        
        {/* Notebook Polaroid Avatar Frame with organically taped edges */}
        <div className="relative mb-8 mt-6">
          <div className="w-40 h-44 rounded-none border-2 border-emerald-950 bg-white p-2.5 pb-8 flex flex-col items-center justify-center shadow-md rotate-[-3deg] relative">
            {/* Matte transparent scotch tapes on physical corners */}
            <div className="absolute -top-3 left-6 w-10 h-4 bg-white/40 border border-neutral-300/20 backdrop-blur-[1px] rotate-[-5deg] pointer-events-none" />
            <div className="absolute -top-2 right-6 w-10 h-4 bg-white/40 border border-neutral-300/20 backdrop-blur-[1px] rotate-[10deg] pointer-events-none" />
            
            <div className="w-full h-full bg-[#EAE8E2] border border-neutral-300 overflow-hidden flex items-center justify-center">
              <img 
                src={getAssetUrl(profile.avatar_url) || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name)}&background=e2f1e8&color=065f46`} 
                alt={profile.display_name} 
                className="w-full h-full object-cover grayscale brightness-95" 
              />
            </div>
            <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider mt-2.5 font-serif">polaroid_snapshot</span>
          </div>
        </div>

        {/* Post-It Yellow Sticky Note Card block */}
        <div className="w-full bg-[#FCF6BD] border-2 border-emerald-950 p-8 rounded-none text-center shadow-xl mb-8 relative rotate-[1.5deg]">
          {/* Glossy transparent sticky tape on top margin */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 border border-neutral-300/25 backdrop-blur-[1.5px] pointer-events-none" />
          <div className="absolute top-2 right-4 text-emerald-800 font-sans text-xs select-none">No. 1 // LOG</div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-950 mb-3 font-serif leading-none">
            {profile.display_name}
          </h1>
          
          <p className="text-emerald-800 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 border-t border-emerald-950/20 pt-4 mt-4">
            <BookOpen size={16} /> {data.university ? `STUDENT DECK // ${data.university}` : 'CLASS ROSTER REGISTER'}
          </p>
          {profile.bio && (
            <p className="text-xs text-neutral-700 leading-relaxed mt-4 italic font-serif max-w-lg mx-auto">
              "{profile.bio}"
            </p>
          )}
        </div>

        {/* Handcrafted story bio notes */}
        {data.about_me && (
          <div className="w-full mb-8 rotate-[-1deg]">
            <div className="bg-[#FAF6EE] p-6 border-2 border-emerald-950 text-left shadow-md relative">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800 mb-3 font-serif flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-800" /> // MY NARRATIVE JOURNAL //
              </h4>
              <p className="text-sm text-neutral-700 leading-relaxed font-serif italic text-left">
                {data.about_me}
              </p>
            </div>
          </div>
        )}

        {/* Digital Contacts platforms */}
        {data?.platforms && data?.platforms?.length > 0 && (
          <div className="w-full mb-8 text-left">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4 text-center font-mono">// CORE SHUNT DIRECTORY //</h4>
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
                    className="bg-[#FAF6EE] border-2 border-emerald-950 p-4 flex flex-col items-center justify-center gap-2 shadow-sm social-link-item hover:scale-105 transition-transform duration-250 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-none bg-white text-emerald-800 flex items-center justify-center relative border border-emerald-950">
                      {pData.logo ? (
                        <img 
                          src={`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${pData.logo}.svg`}
                          className="w-4.5 h-4.5 filter invert object-contain"
                          style={{ filter: 'brightness(0)' }}
                          alt={p.platform}
                        />
                      ) : (
                        pData.icon
                      )}
                      {isGated && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Lock size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-950 font-mono">{p.platform}</span>
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {/* Lined Notebook metrics */}
        {(data.campus_rank_pct || data.study_buddies || stats) && (
          <div className="grid grid-cols-2 gap-4 w-full mb-8">
            <div 
              className={`bg-[#FAF6EE] p-5 border-2 border-emerald-950 shadow-sm text-center relative ${isFreeProfile ? 'cursor-pointer hover:opacity-85' : ''}`}
              onClick={() => isFreeProfile && setShowFomoModal(true)}
            >
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-800/60 block mb-1">Log Scans</span>
              <span className={`text-lg font-extrabold text-neutral-800 font-serif ${isFreeProfile ? 'blur-[6px]' : ''}`}>{isFreeProfile ? '8,204' : liveViews}</span>
            </div>
            {data.campus_rank_pct && (
              <div className="bg-[#FAF6EE] p-5 border-2 border-emerald-950 shadow-sm text-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-800/60 block mb-1">Academic Rank</span>
                <span className="text-lg font-extrabold text-neutral-800 font-serif">Top {data.campus_rank_pct}%</span>
              </div>
            )}
          </div>
        )}

        {/* Engagements Sticky note */}
        {data.availability && (
          <div className="w-full max-w-md mb-8 rotate-[1deg]">
            <div className="bg-[#EAE2B7] border-2 border-emerald-950 text-emerald-950 rounded-none p-5 flex items-center gap-4 shadow-md font-serif">
              <Zap size={22} className="text-emerald-700 shrink-0" />
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-850/60 mb-0.5">AVAILABILITY PROTOCOLS</p>
                <p className="text-xs font-bold leading-relaxed">{data.availability}</p>
              </div>
            </div>
          </div>
        )}

        {/* Connection Actions */}
        <div className="w-full max-w-sm mb-6 z-20">
          <ProfileCTAs profile={profile} accentColor="#047857" />
        </div>

      </main>

      {/* FOMO Modal */}
      {showFomoModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white border-2 border-emerald-950 rounded-none p-8 max-w-sm w-full shadow-2xl relative animate-zoomIn text-center">
            <button onClick={() => setShowFomoModal(false)} className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-50 transition-all">
              <X size={20} />
            </button>
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Activity size={32} className="animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-black text-neutral-900 tracking-tight mb-2 font-serif uppercase">Unlock Stats</h3>
            <p className="text-xs font-bold text-neutral-500 mb-6 leading-relaxed font-serif">Upgrading reveals live telemetry and metrics details.</p>
            <div className="space-y-3">
              <button onClick={() => window.location.href = '/#pricing'} className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs uppercase tracking-widest rounded-none transition-all shadow-md font-mono">
                🔒 CLAIM TEE TO UNLOCK
              </button>
            </div>
          </div>
        </div>
      )}

      <GateModal />
    </div>
  )
}

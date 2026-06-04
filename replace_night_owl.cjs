const fs = require('fs');
const lines = fs.readFileSync('src/components/profile/personas/StudentProfile.tsx', 'utf8').split('\n');

const newContent = `  if (activeTheme === 'night owl') {
    return (
      <div className="w-full min-h-screen relative overflow-x-hidden text-[#E0E7FF] pb-8 selection:bg-cyan-500/30 selection:text-cyan-100 font-sans theme-night-owl bg-animation">
        
        <style dangerouslySetInnerHTML={{
          __html: \\\`
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
            .glass-panel {
              background: rgba(10, 20, 40, 0.4);
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
              border: 1px solid rgba(6, 182, 212, 0.15); /* Cyan border */
              border-radius: 16px;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .glass-panel:hover {
              background: rgba(10, 20, 40, 0.6);
              border: 1px solid rgba(6, 182, 212, 0.4);
              transform: translateY(-2px);
              box-shadow: 0 8px 30px rgba(6, 182, 212, 0.15);
            }

            /* Typography & Glows */
            .text-glow {
              text-shadow: 0 0 15px rgba(6, 182, 212, 0.6);
            }
            .text-cyan-accent { color: #22d3ee; } /* Cyan 400 */
            .text-blue-accent { color: #60a5fa; } /* Blue 400 */
            
            /* Tags */
            .neo-tag {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 4px 12px;
              background: rgba(6, 182, 212, 0.1);
              border: 1px solid rgba(6, 182, 212, 0.2);
              border-radius: 9999px;
              color: #a5f3fc; /* Cyan 200 */
              font-size: 0.85rem;
              font-weight: 500;
              transition: all 0.2s ease;
            }
            .neo-tag:hover {
              background: rgba(6, 182, 212, 0.2);
              border-color: rgba(6, 182, 212, 0.5);
              transform: scale(1.05);
              box-shadow: 0 0 10px rgba(6, 182, 212, 0.2);
            }

            /* Avatar Pulsing Aura */
            .avatar-aura {
              position: relative;
            }
            .avatar-aura::before, .avatar-aura::after {
              content: '';
              position: absolute;
              inset: -4px;
              border-radius: 50%;
              border: 2px solid #06b6d4;
              opacity: 0;
              animation: pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            .avatar-aura::after {
              animation-delay: 1.5s;
            }
            @keyframes pulse-ring {
              0% { transform: scale(1); opacity: 0.8; }
              100% { transform: scale(1.3); opacity: 0; }
            }

            /* Section Headers */
            .section-header {
              display: flex;
              align-items: center;
              gap: 12px;
              font-size: 0.75rem;
              font-weight: 600;
              letter-spacing: 0.2em;
              color: #22d3ee;
              text-transform: uppercase;
              margin-bottom: 1rem;
            }
            .section-header::after {
              content: '';
              flex-grow: 1;
              height: 1px;
              background: linear-gradient(90deg, rgba(6, 182, 212, 0.3), transparent);
            }

            /* Animated Entrance */
            .animate-in { animation: fadeUp 0.6s ease-out forwards; opacity: 0; transform: translateY(20px); }
            @keyframes fadeUp {
              to { opacity: 1; transform: translateY(0); }
            }
          \\\`
        }} />

        {/* ═══ COVER BANNER ═══ */}
        {profile.cover_url && (
          <div className="relative w-full h-40 sm:h-56 mb-8 overflow-hidden z-0">
            <img 
              src={getAssetUrl(profile.cover_url)} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-60"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            {/* Gradient mask to blend banner into background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#040e1c]" />
          </div>
        )}

        <main className={\`relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-8 \${profile.cover_url ? '-mt-24' : 'pt-12'}\`}>
          
          {/* ═══ HEADER: Avatar + Name + Bio ═══ */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-8 animate-in" style={{ animationDelay: '0.1s' }}>
            {/* Avatar with glowing aura */}
            <div className="shrink-0 avatar-aura mt-2">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-cyan-400 p-1 bg-[#050b14] relative z-10 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                {!avatarError && profile.avatar_url ? (
                  <img src={getAssetUrl(profile.avatar_url)} alt={profile.display_name} className="w-full h-full object-cover rounded-full" onError={() => setAvatarError(true)} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-cyan-900/30 text-cyan-300 font-bold text-4xl rounded-full">
                    {profile.display_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-grow text-center sm:text-left pt-2">
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-2 text-glow">
                {profile.display_name} {data.mood && <span className="text-2xl">{data.mood}</span>}
              </h1>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-cyan-300 font-medium">
                <span className="flex items-center gap-1.5 bg-cyan-900/30 px-3 py-1 rounded-full border border-cyan-500/20 text-sm">
                  <GraduationCap size={16} /> {data.course || 'Student'} {data.university ? \`@ \${data.university}\` : ''}
                </span>
                {(data.year || data.batch_year) && (
                  <span className="flex items-center gap-1.5 bg-cyan-900/30 px-3 py-1 rounded-full border border-cyan-500/20 text-sm">
                    {data.year ? \`Year \${data.year}\` : ''}{data.year && data.batch_year ? ' · ' : ''}{data.batch_year ? \`Batch of \${data.batch_year}\` : ''}
                  </span>
                )}
              </div>
              {profile.bio && (
                <p className="text-indigo-100/80 text-lg leading-relaxed mt-4 max-w-2xl font-light">
                  {profile.bio}
                </p>
              )}
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-6">
                <div className="w-full sm:w-auto max-w-xs z-20">
                  <ProfileCTAs profile={profile} accentColor="#06b6d4" />
                </div>
                {data.availability && (
                  <div className="glass-panel px-4 py-2 flex items-center gap-2">
                    <Briefcase size={16} className="text-cyan-400" />
                    <span className="text-sm font-medium text-cyan-50">
                      Open to: <span className="text-cyan-300">{data.availability}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ═══ STATS ROW ═══ */}
          {(data.campus_rank_pct || data.study_buddies || data.courses_completed || stats) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-in" style={{ animationDelay: '0.2s' }}>
              <div className={\`glass-panel p-5 text-center \${isFreeProfile ? 'cursor-pointer hover:bg-white/5' : ''}\`} onClick={() => isFreeProfile && setShowFomoModal(true)}>
                <Activity size={20} className="text-cyan-400 mx-auto mb-2 opacity-70" />
                <div className={\`text-2xl font-bold text-white mb-1 \${isFreeProfile ? 'blur-[4px]' : ''}\`}>{isFreeProfile ? '9.2k' : liveViews}</div>
                <div className="text-[10px] uppercase tracking-widest text-cyan-200/60">Live Views</div>
              </div>
              
              {data.campus_rank_pct && (
                <div className="glass-panel p-5 text-center">
                  <Trophy size={20} className="text-amber-400 mx-auto mb-2 opacity-70" />
                  <div className="text-2xl font-bold text-white mb-1">Top {data.campus_rank_pct}%</div>
                  <div className="text-[10px] uppercase tracking-widest text-cyan-200/60">Honor Rank</div>
                </div>
              )}
              
              {data.courses_completed && (
                <div className="glass-panel p-5 text-center">
                  <BookOpen size={20} className="text-blue-400 mx-auto mb-2 opacity-70" />
                  <div className="text-2xl font-bold text-white mb-1">{data.courses_completed}</div>
                  <div className="text-[10px] uppercase tracking-widest text-cyan-200/60">Courses</div>
                </div>
              )}
              
              {data.study_buddies && (
                <div className="glass-panel p-5 text-center">
                  <Users size={20} className="text-purple-400 mx-auto mb-2 opacity-70" />
                  <div className="text-2xl font-bold text-white mb-1">{data.study_buddies}</div>
                  <div className="text-[10px] uppercase tracking-widest text-cyan-200/60">Buddies</div>
                </div>
              )}
            </div>
          )}

          {/* ═══ ABOUT ME & SKILLS ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-in" style={{ animationDelay: '0.3s' }}>
            {data.about_me && (
              <div className="glass-panel p-6 sm:p-8">
                <div className="section-header"><BookOpen size={16} /> Bio Summary</div>
                <p className="text-indigo-100/90 leading-relaxed font-light">{data.about_me}</p>
                {data.favorite_subject && (
                  <div className="mt-6 flex items-center gap-2 text-sm border-t border-cyan-500/10 pt-4">
                    <Star size={16} className="text-amber-400" />
                    <span className="text-cyan-100/60">Favorite Subject:</span>
                    <span className="text-white font-medium">{data.favorite_subject}</span>
                  </div>
                )}
              </div>
            )}
            
            {data.core_skills && data.core_skills.length > 0 && (
              <div className="glass-panel p-6 sm:p-8">
                <div className="section-header"><Zap size={16} /> Core Skills</div>
                <div className="flex flex-wrap gap-3">
                  {data.core_skills.map((skill, i) => (
                    <span key={i} className="neo-tag">
                      <span className="text-cyan-500/50">#</span> {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ═══ PROJECTS & HACKATHONS (2 Col Grid) ═══ */}
          {(data.projects?.length > 0 || data.hackathons?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-in" style={{ animationDelay: '0.4s' }}>
              {data.projects && data.projects.length > 0 && (
                <div>
                  <div className="section-header"><Rocket size={16} /> Deployed Projects</div>
                  <div className="space-y-4">
                    {data.projects.map((proj, i) => (
                      <div key={i} className="glass-panel p-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Rocket size={60} /></div>
                        <div className="flex items-start gap-3 relative z-10">
                          <span className="text-2xl mt-1">{proj.emoji || '🚀'}</span>
                          <div>
                            <h4 className="text-lg font-bold text-white mb-1">{proj.name}</h4>
                            {proj.description && <p className="text-sm text-indigo-200/70 font-light mb-3">{proj.description}</p>}
                            {proj.tech && proj.tech.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {proj.tech.map((t, j) => (
                                  <span key={j} className="px-2 py-0.5 bg-blue-900/30 border border-blue-500/20 rounded text-[10px] text-blue-300 font-medium tracking-wide uppercase">{t}</span>
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
                  <div className="section-header"><Trophy size={16} /> Hackathons</div>
                  <div className="space-y-4">
                    {data.hackathons.map((h, i) => (
                      <div key={i} className="glass-panel p-5 flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-white text-base flex items-center gap-2">
                            🏆 {h.name}
                          </h5>
                          {h.achievement && <p className="text-cyan-400 text-sm font-medium mt-1">↳ {h.achievement}</p>}
                        </div>
                        {h.year && <span className="text-cyan-200/40 font-mono text-xs px-2 py-1 bg-black/20 rounded border border-white/5">{h.year}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ CLUBS & HOBBIES (2 Col Grid) ═══ */}
          {(data.clubs?.length > 0 || data.hobbies?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-in" style={{ animationDelay: '0.5s' }}>
              {data.clubs?.length > 0 && (
                <div className="glass-panel p-6">
                  <div className="section-header"><Users size={16} /> Organizations</div>
                  <div className="flex flex-wrap gap-2">
                    {data.clubs.map((club, i) => (
                      <span key={i} className="neo-tag bg-blue-900/10 border-blue-500/20 text-blue-200 hover:border-blue-400/50 hover:bg-blue-900/30 hover:shadow-[0_0_10px_rgba(96,165,250,0.2)]">
                        <Users size={12} className="text-blue-500/50" /> {club}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {data.hobbies?.length > 0 && (
                <div className="glass-panel p-6">
                  <div className="section-header"><Heart size={16} /> Interests</div>
                  <div className="flex flex-wrap gap-2">
                    {data.hobbies.map((hobby, i) => (
                      <span key={i} className="neo-tag bg-purple-900/10 border-purple-500/20 text-purple-200 hover:border-purple-400/50 hover:bg-purple-900/30 hover:shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                        <Sparkles size={12} className="text-purple-500/50" /> {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ SOCIALS & EVENTS ═══ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-in" style={{ animationDelay: '0.6s' }}>
            {data?.platforms && data?.platforms?.length > 0 && (
              <div className="glass-panel p-6">
                <div className="section-header"><Globe size={16} /> Network</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {data.platforms.map((p, i) => {
                    const pData = getPlatformData(p.platform?.toLowerCase())
                    return (
                      <a key={i} href={ensureAbsoluteUrl(p.url)} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => { handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url)); if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank'); }}
                        className="flex flex-col items-center justify-center p-4 bg-[#050b14]/50 border border-cyan-500/10 rounded-xl hover:bg-cyan-900/20 hover:border-cyan-500/30 transition-all group relative">
                        <div className="text-cyan-500/70 group-hover:text-cyan-300 transition-colors mb-2">
                          {pData.icon}
                        </div>
                        <span className="text-[10px] font-medium uppercase tracking-widest text-cyan-200/50 group-hover:text-cyan-100">{p.platform}</span>
                        {isGated && (<div className="absolute inset-0 bg-[#050b14]/80 flex items-center justify-center rounded-xl backdrop-blur-[2px]"><Lock size={14} className="text-cyan-500" /></div>)}
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
            
            {data.upcoming_events && data.upcoming_events.length > 0 && (
              <div className="glass-panel p-6">
                <div className="section-header"><Calendar size={16} /> Upcoming Timeline</div>
                <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[1.125rem] before:w-px before:bg-gradient-to-b before:from-transparent before:via-cyan-500/30 before:to-transparent">
                  {data.upcoming_events.map((ev, i) => (
                    <div key={i} className="relative flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full bg-[#050b14] border border-cyan-500/30 flex items-center justify-center shrink-0 z-10 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                        <Calendar size={14} className="text-cyan-400" />
                      </div>
                      <div className="flex-grow bg-[#050b14]/30 border border-cyan-500/10 rounded-lg p-3">
                        <div className="text-sm font-bold text-white mb-0.5">{ev.title}</div>
                        <div className="text-[10px] uppercase tracking-widest text-cyan-400/60">{ev.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ═══ THOUGHT BUBBLE & CONTACT ═══ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-in" style={{ animationDelay: '0.7s' }}>
            {data.thought_bubble && (
              <div className="glass-panel p-6 sm:p-8 flex flex-col justify-center text-center relative overflow-hidden">
                <div className="absolute -top-6 -right-6 opacity-5"><Sparkles size={100} /></div>
                <div className="text-[10px] font-medium uppercase tracking-[0.3em] text-cyan-400 mb-4">Philosophy</div>
                <p className="text-xl font-light text-white italic leading-relaxed">"{data.thought_bubble}"</p>
              </div>
            )}
            {data.contact_email && (
              <div className="glass-panel p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <Mail size={24} className="text-cyan-300" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Let's Connect</h4>
                  <a href={\`mailto:\${data.contact_email}\`} className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">{data.contact_email}</a>
                </div>
              </div>
            )}
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
                {data.playlist_name || 'My Playlist'}
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
  }`;

let start = -1;
let end = -1;
for(let i=0; i<lines.length; i++) {
  if (lines[i].includes("if (activeTheme === 'night owl') {")) {
    start = i;
  }
  if (start !== -1 && i > start && lines[i].includes("// LAYOUT 3: PREMIUM JOURNAL NOTEBOOK")) {
    end = i - 2;
    break;
  }
}

if (start !== -1 && end !== -1) {
  const before = lines.slice(0, start);
  const after = lines.slice(end + 1);
  const updated = before.join('\n') + '\n' + newContent + '\n' + after.join('\n');
  fs.writeFileSync('src/components/profile/personas/StudentProfile.tsx', updated);
  console.log('Update complete.');
} else {
  console.log('Could not find boundaries.');
}

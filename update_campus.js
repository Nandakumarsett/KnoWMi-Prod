const fs = require('fs');

const content = fs.readFileSync('src/components/profile/personas/StudentProfile.tsx', 'utf8');
const lines = content.split('\n');

let start = -1;
let end = -1;
for(let i=0; i<lines.length; i++) {
  if (lines[i].includes("if (activeTheme === 'campus') {")) {
    start = i;
  }
  if (lines[i].includes("LAYOUT 2: COZY LATE-NIGHT STUDY DESK")) {
    end = i - 2; 
    break;
  }
}

const newCampusLayout = `  if (activeTheme === 'campus') {
    return (
      <div className="w-full relative text-black min-h-screen cork-bg overflow-hidden font-sans pb-24">
        <style dangerouslySetInnerHTML={{
          __html: \`
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
          .pin-red { background: radial-gradient(circle at 30% 30%, #ff4d4d, #cc0000); }
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
            background-color: #fdfbf7;
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
            background-color: #fdfbf7;
          }
        \`}} />

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
                    <div className="w-full h-full flex items-center justify-center bg-neutral-300 text-neutral-600 font-bold text-4xl font-sans">{profile.display_name?.charAt(0).toUpperCase() || 'U'}</div>
                  )}
                </div>
             </div>
             
             {/* Main Lined Paper */}
             <div className="w-full max-w-2xl bg-[#fdfbf7] lined-paper pt-8 pb-10 pr-6 pl-12 sm:pl-16 cork-shadow-lg relative rotate-1 z-10 min-h-[220px]">
                <div className="pushpin pin-red absolute top-3 left-[50%]" />
                <div className="paper-holes" />
                <div className="margin-line" />
                
                {/* QR Code */}
                <div className="absolute top-6 right-6 text-center hidden sm:block">
                  <span className="text-sm text-neutral-600 block mb-1" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Scan to Connect</span>
                  <div className="w-20 h-20 bg-white border-2 border-neutral-800 flex items-center justify-center p-1 relative">
                     <QrCode size={48} className="text-neutral-800" />
                     <div className="absolute -bottom-5 w-full text-center text-[9px] text-neutral-800 font-sans font-bold">
                       KNOWMI-{profile.id?.substring(0,5).toUpperCase() || '00721'}
                     </div>
                  </div>
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold text-[#1e3a8a] mb-2 mt-2 leading-[32px]" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                  {profile.display_name}
                </h1>
                
                <div className="text-2xl font-bold text-[#cc0000] mt-4 leading-[32px]" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                  {data.university ? data.university : 'Stanford University'}
                </div>
                <div className="text-xl text-[#4a5568] leading-[32px]" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                  {data.course ? data.course : 'Computer Science'}
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
             {/* CGPA */}
             <div className="w-32 sm:w-40 aspect-square bg-[#FDE68A] p-4 text-center cork-shadow -rotate-2 relative flex flex-col items-center justify-center">
                <div className="pushpin pin-blue" />
                <span className="text-lg font-medium block mt-2 text-neutral-800" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>CGPA</span>
                <span className="text-3xl font-bold text-[#1e3a8a] mt-1 block" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>{data.campus_rank_pct ? data.campus_rank_pct : '3.9/4.0'}</span>
                <Star size={16} className="absolute bottom-3 left-3 text-[#1e3a8a]" strokeWidth={1.5} />
             </div>
             
             {/* Courses */}
             <div className="w-32 sm:w-40 aspect-square bg-[#d4e0b5] p-4 text-center cork-shadow rotate-1 relative flex flex-col items-center justify-center">
                <div className="pushpin pin-green" />
                <span className="text-lg font-medium block mt-2 text-neutral-800" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Courses</span>
                <span className="text-3xl font-bold text-[#1e3a8a] mt-1 block" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>8</span>
                <span className="text-sm text-neutral-600 block mt-1" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Completed</span>
             </div>
             
             {/* Study Streak */}
             <div className="w-32 sm:w-40 aspect-square bg-[#c0d6e4] p-4 text-center cork-shadow -rotate-1 relative flex flex-col items-center justify-center">
                <div className="pushpin pin-blue" />
                <span className="text-lg font-medium block mt-2 text-neutral-800" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Study Streak</span>
                <span className="text-3xl font-bold text-[#1e3a8a] mt-1 block" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>{data.study_buddies ? data.study_buddies : '21'}</span>
                <span className="text-sm text-neutral-600 block mt-1" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Days</span>
             </div>
             
             {/* Scan Count */}
             <div className="w-32 sm:w-40 aspect-square bg-[#f2c7ce] p-4 text-center cork-shadow rotate-2 relative flex flex-col items-center justify-center cursor-pointer" onClick={() => isFreeProfile && setShowFomoModal(true)}>
                <div className="pushpin pin-white" />
                <span className="text-lg font-medium block mt-2 text-neutral-800" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Scan Count</span>
                <span className={\`text-3xl font-bold text-[#1e3a8a] mt-1 block \${isFreeProfile ? 'blur-[4px]' : ''}\`} style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                  {isFreeProfile ? '146' : liveViews}
                </span>
                <Activity size={16} className="absolute bottom-3 right-3 text-[#1e3a8a]" strokeWidth={1.5} />
             </div>
          </div>

          {/* Grid Layout Rows */}
          <div className="w-full max-w-5xl flex flex-wrap justify-center items-stretch gap-6 mt-4">
            
            {/* Row 3: About Me, Clubs, Skills */}
            {data.about_me && (
              <div className="w-full md:w-[28%] bg-[#fdfbf7] p-6 pb-8 pl-10 cork-shadow -rotate-1 relative solid-paper min-h-[220px]">
                <div className="pushpin pin-blue" />
                <div className="paper-holes" />
                <h4 className="text-xl font-bold text-[#1e3a8a] mb-3 uppercase tracking-wide mt-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>About Me</h4>
                <p className="text-xl text-neutral-800 leading-tight" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                  {data.about_me}
                </p>
              </div>
            )}
            
            {data.clubs && data.clubs.length > 0 && (
              <div className="w-full md:w-[28%] bg-[#FDE68A] p-6 pb-8 cork-shadow rotate-1 relative min-h-[220px]">
                <div className="pushpin pin-green" />
                <h4 className="text-xl font-bold text-[#cc0000] mb-3 uppercase tracking-wide text-center mt-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Clubs & Orgs</h4>
                <ul className="text-xl text-neutral-800 space-y-1 ml-4" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                  {data.clubs.map((c, i) => <li key={i}>• {c}</li>)}
                </ul>
              </div>
            )}

            {data.core_skills && data.core_skills.length > 0 && (
              <div className="w-full md:w-[28%] bg-[#fdfbf7] p-6 pb-8 pl-10 cork-shadow -rotate-2 relative solid-paper min-h-[220px]">
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
              <div className="w-full md:w-[46%] bg-[#fdfbf7] p-6 pb-8 pl-14 cork-shadow rotate-[1deg] relative lined-paper min-h-[180px]">
                <div className="pushpin pin-red absolute top-3 left-[50%]" />
                <div className="paper-holes" />
                <div className="margin-line" />
                <h4 className="text-xl font-bold text-[#1e3a8a] mb-2 uppercase tracking-wide mt-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Recent Achievements</h4>
                <ul className="text-xl text-neutral-800 space-y-1 ml-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                  {data.hackathons.map((h, i) => (
                    <li key={i} className="leading-[32px]">• {h.achievement || '1st Prize'} - {h.name} {h.year}</li>
                  ))}
                </ul>
                <Trophy size={32} className="absolute bottom-6 right-6 text-[#1e3a8a] opacity-60" strokeWidth={1.5} />
              </div>
            )}

            {data.favorite_subject && (
              <div className="w-full md:w-[46%] bg-[#fdfbf7] p-6 pb-8 pl-14 cork-shadow -rotate-[1deg] relative lined-paper min-h-[180px]">
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
            <div className="w-full md:w-[62%] bg-[#fdfbf7] p-6 pt-10 pb-10 pl-14 cork-shadow rotate-1 relative lined-paper">
              <div className="pushpin pin-red absolute top-3 left-[50%]" />
              <div className="paper-holes" />
              <div className="margin-line" />
              <h4 className="text-xl font-bold text-[#1e3a8a] mb-6 uppercase tracking-wide text-center mt-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Academic Snapshot</h4>
              <div className="flex flex-row justify-around items-center text-center">
                 <div>
                   <BookOpen size={24} className="mx-auto text-[#1e3a8a] mb-2" strokeWidth={1.5} />
                   <div className="text-sm font-sans font-bold text-neutral-600 uppercase">Courses Completed</div>
                   <div className="text-3xl font-bold text-[#1e3a8a] mt-1" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>8 / 12</div>
                   <div className="w-full h-1 bg-[#1e3a8a] mt-2 rounded"></div>
                 </div>
                 <div>
                   <FileText size={24} className="mx-auto text-[#1e3a8a] mb-2" strokeWidth={1.5} />
                   <div className="text-sm font-sans font-bold text-neutral-600 uppercase">Assignments Done</div>
                   <div className="text-3xl font-bold text-[#1e3a8a] mt-1" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>24 / 30</div>
                   <div className="w-full h-1 bg-[#1e3a8a] mt-2 rounded"></div>
                 </div>
                 <div>
                   <GraduationCap size={24} className="mx-auto text-[#1e3a8a] mb-2" strokeWidth={1.5} />
                   <div className="text-sm font-sans font-bold text-neutral-600 uppercase">Next Goal</div>
                   <div className="text-3xl font-bold text-[#1e3a8a] mt-1" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>4.0 CGPA</div>
                   <div className="w-full h-1 bg-[#1e3a8a] mt-2 rounded"></div>
                 </div>
              </div>
            </div>

            <div className="w-full md:w-[32%] bg-[#c0d6e4] p-6 pb-8 cork-shadow -rotate-2 relative">
              <div className="pushpin pin-green" />
              <h4 className="text-xl font-bold text-[#1e3a8a] mb-4 uppercase tracking-wide mt-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Upcoming Events</h4>
              <div className="space-y-4">
                 <div className="flex gap-3">
                   <Calendar size={18} className="text-[#1e3a8a] shrink-0 mt-1" strokeWidth={1.5} />
                   <div>
                     <div className="text-xl text-neutral-800 leading-tight" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Midterm Exams</div>
                     <div className="text-sm text-neutral-600 font-sans">May 15 - May 20</div>
                   </div>
                 </div>
                 <div className="flex gap-3">
                   <Calendar size={18} className="text-[#1e3a8a] shrink-0 mt-1" strokeWidth={1.5} />
                   <div>
                     <div className="text-xl text-neutral-800 leading-tight" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Hackathon</div>
                     <div className="text-sm text-neutral-600 font-sans">May 25 - May 27</div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Row 6: Projects, Connect, Advice */}
            {data.projects && data.projects.length > 0 && (
              <div className="w-full md:w-[28%] bg-[#fdfbf7] p-6 pb-8 pl-10 cork-shadow rotate-[1deg] relative solid-paper min-h-[220px]">
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
              <div className="w-full md:w-[32%] bg-[#FDE68A] p-6 pb-8 cork-shadow -rotate-1 relative min-h-[220px]">
                <div className="pushpin pin-yellow" />
                <h4 className="text-xl font-bold text-neutral-800 mb-4 uppercase tracking-wide text-center mt-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Let's Connect</h4>
                <div className="flex flex-wrap gap-3 justify-center">
                  {data.platforms.map((p: any, i: number) => {
                    const pData = getPlatformData(p.platform)
                    return (
                      <a key={i} href={ensureAbsoluteUrl(p.url)} target="_blank" rel="noopener noreferrer" onClick={(e) => { handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url)); if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank'); }} className="w-10 h-10 bg-white/50 rounded flex items-center justify-center hover:bg-white hover:scale-110 transition-all cork-shadow">
                        {pData.logo ? (
                          <div className="relative w-5 h-5 flex items-center justify-center"><span className="absolute inset-0 flex items-center justify-center opacity-60"><LinkIcon size={16} className="text-neutral-800" /></span><img src={\`https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/\${pData.logo}.svg\`} className="w-5 h-5 relative z-10 bg-white" alt={p.platform} onError={(e) => { e.currentTarget.style.display = 'none'; }} /></div>
                        ) : pData.icon}
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
              <div className="w-full md:w-[28%] bg-[#fdfbf7] p-6 pb-8 pl-10 cork-shadow rotate-2 relative solid-paper min-h-[220px] flex flex-col justify-center text-center">
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
             <div className="w-full max-w-2xl bg-[#fdfbf7] p-4 sm:p-6 mt-8 cork-shadow-lg relative flex flex-col sm:flex-row items-center justify-center gap-6 solid-paper">
                <div className="pushpin pin-green" />
                <div className="w-14 h-14 bg-[#d1bfae] rounded-full flex items-center justify-center shrink-0">
                   <Mail size={28} className="text-neutral-800" />
                </div>
                <div className="text-center sm:text-left">
                   <h4 className="text-2xl font-bold text-neutral-800 mb-1" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Let's Connect</h4>
                   <p className="text-lg text-neutral-700" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>I'm always open to new opportunities, ideas and collaborations.</p>
                   <a href={\`mailto:\${data.contact_email}\`} className="font-sans font-bold text-sm text-[#1e3a8a] hover:underline mt-2 inline-block">{data.contact_email}</a>
                </div>
             </div>
          )}

          <div className="w-full max-w-sm mt-8 z-20 bg-white/80 p-2 rounded backdrop-blur-sm cork-shadow">
            <ProfileCTAs profile={profile} accentColor="#cc0000" />
          </div>

        </main>

        {showFomoModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-[#fdfbf7] p-8 max-w-sm w-full cork-shadow-lg relative text-center rotate-1">
              <button onClick={() => setShowFomoModal(false)} className="absolute top-2 right-2 p-2 text-neutral-400 hover:text-red-500">
                <X size={24} />
              </button>
              <div className="pushpin pin-red" />
              <Activity size={48} className="text-[#1e3a8a] mx-auto mb-4 mt-4" />
              <h3 className="text-3xl font-bold text-[#1e3a8a] mb-2" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>Unlock Premium</h3>
              <p className="text-xl text-neutral-600 mb-6" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>See your exact campus standing & scans!</p>
              <button onClick={() => window.location.href = '/#pricing'} className="w-full py-3 bg-[#cc0000] text-white font-bold text-xl rounded shadow-md hover:bg-red-700 transition-colors" style={{ fontFamily: "'Caveat', cursive, sans-serif" }}>
                Upgrade Now
              </button>
            </div>
          </div>
        )}
        <GateModal />
      </div>
    )
  }
\`.split('\\n');

if (start !== -1 && end !== -1) {
  const newLines = [...lines.slice(0, start), ...newCampusLayout, ...lines.slice(end + 1)];
  fs.writeFileSync('src/components/profile/personas/StudentProfile.tsx', newLines.join('\\n'));
  console.log('Successfully updated Campus Theme layout!');
} else {
  console.error('Could not find boundaries!', {start, end});
}

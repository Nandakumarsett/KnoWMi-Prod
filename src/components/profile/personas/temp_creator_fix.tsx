  // ----------------------------------------------------
  // LAYOUT 2: SYNTHWAVE / CYBERPUNK CONSOLE (Neon Theme)
  // ----------------------------------------------------
  if (activeTheme === 'neon') {
    return (
      <div className="w-full pb-24 relative bg-[#0D0B1A] text-white font-sans overflow-x-hidden min-h-screen">
        
        {/* Neon Background Accents */}
        <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#FF2D78]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Right Actions */}
        <div className="absolute top-6 right-6 z-40 flex flex-col items-end gap-2">
           <div className="flex items-center gap-3 bg-black/40 border border-[#FF2D78]/50 px-3 py-1.5 rounded-md backdrop-blur-md shadow-[0_0_10px_rgba(255,45,120,0.3)]">
             <span className="text-[9px] font-bold uppercase tracking-widest text-[#FF2D78]">Scan to Connect</span>
             <QrCode size={16} className="text-[#FF2D78]" />
           </div>
           <div className="w-8 h-8 flex flex-col justify-center gap-1.5 items-end cursor-pointer group mt-2">
             <div className="w-6 h-0.5 bg-[#FF2D78] shadow-[0_0_5px_rgba(255,45,120,0.8)] group-hover:w-8 transition-all"></div>
             <div className="w-8 h-0.5 bg-[#FF2D78] shadow-[0_0_5px_rgba(255,45,120,0.8)]"></div>
             <div className="w-4 h-0.5 bg-[#FF2D78] shadow-[0_0_5px_rgba(255,45,120,0.8)] group-hover:w-8 transition-all"></div>
           </div>
        </div>

        <div className="px-6 sm:px-12 pt-24 max-w-4xl mx-auto flex flex-col items-center relative z-20">
          
          {/* Avatar with Neon Ring */}
          <div className="relative mb-8">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 bg-gradient-to-br from-[#FF2D78] to-purple-600 shadow-[0_0_30px_rgba(255,45,120,0.6)] animate-pulse" style={{ animationDuration: '3s' }}>
              <div className="w-full h-full rounded-full bg-[#0D0B1A] overflow-hidden p-1">
                <img src={getAssetUrl(profile.avatar_url)} alt={profile.display_name} className="w-full h-full object-cover rounded-full filter contrast-125 saturate-50" />
              </div>
            </div>
          </div>

          {/* Headers */}
          <div className="text-center w-full mb-6">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] mb-2">
              {profile.display_name}
            </h1>
            <h2 className="text-sm sm:text-base font-black tracking-[0.3em] uppercase text-[#FF2D78] drop-shadow-[0_0_8px_rgba(255,45,120,0.8)]">
              {data.type || 'DIGITAL CREATOR'}
            </h2>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="w-full max-w-lg mx-auto text-center mb-10">
              <p className="text-sm text-gray-300 leading-relaxed font-light">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Stats Bar */}
          <div className="w-full max-w-3xl border border-white/10 bg-black/40 backdrop-blur-md rounded-2xl p-6 mb-10 flex flex-wrap justify-between items-center gap-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className={`text-center flex-1 min-w-[80px] ${isFreeProfile ? 'cursor-pointer hover:opacity-80' : ''}`} onClick={() => isFreeProfile && setShowFomoModal(true)}>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">VIEWS</span>
              <span className={`text-2xl font-black text-white border-b-2 border-[#FF2D78] pb-1 inline-block ${isFreeProfile ? 'blur-[4px]' : ''}`}>{isFreeProfile ? '4.2K' : liveViews}</span>
            </div>
            <div className="text-center flex-1 min-w-[80px]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">LOCATION</span>
              <span className="text-xl font-black text-white border-b-2 border-[#FF2D78] pb-1 inline-block truncate max-w-full uppercase">{topCity}</span>
            </div>
            <div className="text-center flex-1 min-w-[120px]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF2D78] block mb-2 drop-shadow-[0_0_5px_rgba(255,45,120,0.8)]">VIBE SCORE</span>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black text-[#FF2D78] drop-shadow-[0_0_8px_rgba(255,45,120,0.8)] flex items-baseline gap-1">92<span className="text-sm text-gray-400">/100</span></span>
                <div className="w-full h-1 bg-white/10 mt-2 rounded-full overflow-hidden">
                  <div className="w-[92%] h-full bg-[#FF2D78] shadow-[0_0_10px_rgba(255,45,120,1)]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-3xl mb-12">
            {/* What I Do */}
            {data.content_formats && data.content_formats.length > 0 && (
              <div className="bg-black/30 border border-[#FF2D78]/30 rounded-2xl p-6 shadow-[inset_0_0_20px_rgba(255,45,120,0.05)]">
                <h3 className="font-bold text-sm uppercase tracking-[0.2em] text-[#FF2D78] mb-5">WHAT I DO</h3>
                <ul className="space-y-4">
                  {data.content_formats.map(format => (
                    <li key={format} className="text-sm text-gray-200 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D78] shadow-[0_0_8px_rgba(255,45,120,1)]"></div>
                      <span className="font-medium tracking-wide">{format}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Narrative */}
            {data.about && (
              <div className="bg-black/30 border border-cyan-500/30 rounded-2xl p-6 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]">
                <h3 className="font-bold text-sm uppercase tracking-[0.2em] text-cyan-400 mb-5">NARRATIVE</h3>
                <p className="text-xs text-gray-300 leading-relaxed font-light">
                  {data.about}
                </p>
              </div>
            )}
          </div>

          {/* Social Links */}
          {data.platforms && data.platforms.length > 0 && (
            <div className="w-full text-center mb-10">
              <div className="flex flex-wrap gap-5 justify-center">
                {data.platforms.map(p => {
                  const platform = p.platform?.toLowerCase()
                  const Icon = PLATFORM_ICONS[platform] || Share2
                  return (
                    <a
                      key={p.platform}
                      href={ensureAbsoluteUrl(p.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url));
                        if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank');
                      }}
                      className="w-12 h-12 rounded-full border border-[#FF2D78]/50 flex items-center justify-center bg-black/50 text-[#FF2D78] hover:bg-[#FF2D78] hover:text-white hover:shadow-[0_0_20px_rgba(255,45,120,0.8)] transition-all cursor-pointer relative"
                    >
                      <Icon size={20} />
                      {isGated && (
                        <div className="absolute inset-0 bg-black/80 rounded-full flex items-center justify-center">
                          <Lock size={12} className="text-white" />
                        </div>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {data.contact_email && (
            <div className="w-full flex justify-center pb-8">
              <a href={`mailto:${data.contact_email}`} className="px-10 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all">
                INITIATE CONTACT
              </a>
            </div>
          )}

          {/* FOMO Modal */}
          {showFomoModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
              <div className="bg-[#0D0B1A] border-2 border-[#FF2D78] rounded-[24px] p-8 max-w-sm w-full shadow-[0_0_40px_rgba(255,45,120,0.3)] relative animate-zoomIn text-center">
                <button onClick={() => setShowFomoModal(false)} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-[#FF2D78] transition-colors">
                  <X size={20} />
                </button>
                <Activity size={48} className="text-[#FF2D78] mx-auto mb-6 animate-pulse" />
                <h3 className="text-xl font-black text-white tracking-tight mb-2 uppercase">Unlock Telemetry</h3>
                <p className="text-xs font-light text-gray-400 mb-8 leading-relaxed">Upgrade to full tier to view real-time profile scans and audience telemetry.</p>
                <button onClick={() => window.location.href = '/#pricing'} className="w-full py-4 bg-[#FF2D78] hover:bg-[#D41C5C] text-white font-black text-[10px] uppercase tracking-widest rounded-full transition-all shadow-[0_0_15px_rgba(255,45,120,0.5)]">
                  🔒 CLAIM TEE
                </button>
              </div>
            </div>
          )}

        </div>
        <GateModal />
      </div>
    )
  }

  // ----------------------------------------------------
  // LAYOUT 3: GLOW EDITORIAL MAGAZINE (Default / Glow Theme)
  // ----------------------------------------------------
  return (
    <div className="w-full pb-24 relative bg-[#FDFBF7] text-neutral-900 font-sans min-h-screen overflow-x-hidden selection:bg-purple-200">
      
      {/* Soft Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-400/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-400/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-white to-transparent z-0" />

      <main className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 pt-20 flex flex-col items-center">
        
        {/* Floating Glass Profile Card */}
        <div className="w-full bg-white/40 backdrop-blur-3xl border border-white/60 p-8 sm:p-12 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] mb-16 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-10">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-48 h-48 rounded-[32px] overflow-hidden bg-white/80 p-2 shadow-xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                <img src={getAssetUrl(profile.avatar_url)} alt={profile.display_name} className="w-full h-full object-cover rounded-[24px]" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-200 rounded-full blur-2xl -z-10" />
            </div>

            <div className="text-center sm:text-left flex-grow">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600 mb-3">{data.type || 'CREATIVE DIRECTOR'}</p>
              <h1 className="text-5xl sm:text-7xl font-light tracking-tighter text-neutral-900 mb-4 font-serif">
                {profile.display_name}
              </h1>
              {profile.bio && (
                <p className="text-lg text-neutral-600 font-medium leading-relaxed max-w-xl">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats & Info Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div 
            className={`bg-white/50 backdrop-blur-xl border border-white rounded-[32px] p-8 text-center hover:shadow-xl transition-all duration-300 ${isFreeProfile ? 'cursor-pointer hover:bg-white/80' : ''}`}
            onClick={() => isFreeProfile && setShowFomoModal(true)}
          >
            <Activity className="mx-auto mb-4 text-purple-500" size={28} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">Total Impressions</span>
            <span className={`text-4xl font-light font-serif text-neutral-800 ${isFreeProfile ? 'blur-[6px]' : ''}`}>{isFreeProfile ? '4.2K' : liveViews}</span>
          </div>
          
          <div className="bg-white/50 backdrop-blur-xl border border-white rounded-[32px] p-8 text-center hover:shadow-xl transition-all duration-300">
            <MapPin className="mx-auto mb-4 text-amber-500" size={28} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">Base</span>
            <span className="text-3xl font-light font-serif text-neutral-800 truncate block">{topCity}</span>
          </div>

          <div className="bg-white/50 backdrop-blur-xl border border-white rounded-[32px] p-8 text-center hover:shadow-xl transition-all duration-300 flex flex-col justify-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-4">Focus Areas</span>
            <div className="flex flex-wrap justify-center gap-2">
              {data.content_formats?.slice(0,3).map(f => (
                <span key={f} className="px-3 py-1.5 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">{f}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Story Section */}
        {data.about && (
          <div className="w-full max-w-4xl mx-auto mb-16 px-4">
            <div className="text-center mb-10">
               <span className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">THE NARRATIVE</span>
            </div>
            <p className="text-xl sm:text-3xl font-serif text-neutral-800 leading-relaxed text-center italic font-light">
              "{data.about}"
            </p>
          </div>
        )}

        {/* Selected Work Portfolio (If any, placeholder styled) */}
        {(data.portfolio || data.featured_video) && (
          <div className="w-full mb-16">
             <div className="flex items-center justify-between mb-8 px-4">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">SELECTED WORKS</span>
             </div>
             {/* Note: Minimalist implementation. Real portfolio would map array here. */}
             <div className="bg-neutral-900 rounded-[40px] p-8 text-center text-white/50 italic text-sm border border-neutral-800 shadow-2xl overflow-hidden relative">
               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
               <Sparkles className="mx-auto mb-4 text-white/20" size={32} />
               Portfolio showcase integrated via persona data payload...
             </div>
          </div>
        )}

        {/* Digital Footprint */}
        {data.platforms && data.platforms.length > 0 && (
          <div className="w-full bg-white/60 backdrop-blur-2xl border border-white rounded-[40px] p-10 sm:p-16 mb-16 shadow-[0_20px_40px_rgba(0,0,0,0.03)] text-center">
             <span className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-400 block mb-10">DIGITAL PRESENCE</span>
             <div className="flex flex-wrap justify-center gap-6">
                {data.platforms.map(p => {
                  const platform = p.platform?.toLowerCase()
                  const Icon = PLATFORM_ICONS[platform] || Share2
                  return (
                    <a
                      key={p.platform}
                      href={ensureAbsoluteUrl(p.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        handleGatedClick(e, p.url, () => trackLinkClick(profile.id, p.platform || 'unknown', p.url));
                        if (!isGated) window.open(ensureAbsoluteUrl(p.url), '_blank');
                      }}
                      className="w-16 h-16 rounded-[20px] bg-white border border-neutral-100 shadow-[0_10px_20px_rgba(0,0,0,0.05)] flex items-center justify-center text-neutral-600 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:text-purple-600 transition-all cursor-pointer relative group"
                    >
                      <Icon size={24} className="transition-transform group-hover:scale-110" />
                      {isGated && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-[20px] flex items-center justify-center">
                          <Lock size={16} className="text-neutral-400" />
                        </div>
                      )}
                    </a>
                  )
                })}
             </div>
          </div>
        )}

        {/* Contact CTA */}
        {data.contact_email && (
          <div className="w-full flex justify-center pb-16">
            <a href={`mailto:${data.contact_email}`} className="px-12 py-5 bg-neutral-900 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-purple-600 hover:shadow-[0_10px_30px_rgba(147,51,234,0.3)] transition-all">
              INITIATE COLLABORATION
            </a>
          </div>
        )}

      </main>

      {/* FOMO Modal */}
      {showFomoModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-white/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white border border-neutral-200 rounded-[40px] p-10 max-w-sm w-full shadow-2xl relative animate-zoomIn text-center">
            <button onClick={() => setShowFomoModal(false)} className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-neutral-600 transition-colors">
              <X size={24} />
            </button>
            <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-[24px] flex items-center justify-center shadow-inner mx-auto mb-8">
              <Activity size={36} className="animate-pulse" />
            </div>
            <h3 className="text-2xl font-serif text-neutral-900 mb-3">Unlock Insights</h3>
            <p className="text-sm text-neutral-500 mb-10 leading-relaxed font-light">Claim your premium tee to unlock deep analytics, live impression telemetry, and audience demographics.</p>
            <button onClick={() => window.location.href = '/#pricing'} className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[11px] uppercase tracking-widest rounded-[20px] transition-all shadow-xl">
              🔒 Claim Tee to Unlock
            </button>
          </div>
        </div>
      )}

      <GateModal />
    </div>
  )
}

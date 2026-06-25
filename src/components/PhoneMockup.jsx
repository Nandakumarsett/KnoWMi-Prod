import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Trophy, UserPlus, Share2, Instagram, Twitter, Linkedin, Film, Github, Music, ChevronLeft, ChevronRight, GraduationCap, Code, Activity, Users } from 'lucide-react';

const CITIES = [
  { name: 'Bengaluru', color: '#D71920' },
  { name: 'Mumbai', color: '#004BA0' },
  { name: 'Delhi', color: '#17479E' },
  { name: 'Hyderabad', color: '#F26522' },
  { name: 'Chennai', color: '#F9CD05' },
  { name: 'Kolkata', color: '#3A225D' }
];

const PhoneMockup = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stats, setStats] = useState({
    creativeViews: 2471,
    creativeCity: CITIES[0],
    studentViews: 820,
    techViews: 4912
  });

  const creativeScrollRef = useRef(null);
  const studentScrollRef = useRef(null);
  const techScrollRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Live Data Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        creativeViews: prev.creativeViews + Math.floor(Math.random() * 3) + 1,
        creativeCity: CITIES[Math.floor(Math.random() * CITIES.length)],
        studentViews: prev.studentViews + Math.floor(Math.random() * 2) + 1,
        techViews: prev.techViews + Math.floor(Math.random() * 4) + 1
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getActiveScrollEl = () => {
    if (activeIndex === 0) return creativeScrollRef.current;
    if (activeIndex === 1) return studentScrollRef.current;
    return techScrollRef.current;
  };

  // Auto-scroll Logic targeting active element
  useEffect(() => {
    if (!isAutoScrolling) return;
    
    const interval = setInterval(() => {
      const el = getActiveScrollEl();
      if (el) {
        if (el.scrollTop < 240) {
          el.scrollTop += 0.5;
        } else {
          setIsAutoScrolling(false);
        }
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [isAutoScrolling, activeIndex]);

  const nextPersona = () => {
    setActiveIndex(prev => (prev === 2 ? 0 : prev + 1));
    setIsAutoScrolling(true);
    if (creativeScrollRef.current) creativeScrollRef.current.scrollTop = 0;
    if (studentScrollRef.current) studentScrollRef.current.scrollTop = 0;
    if (techScrollRef.current) techScrollRef.current.scrollTop = 0;
  };

  const prevPersona = () => {
    setActiveIndex(prev => (prev === 0 ? 2 : prev - 1));
    setIsAutoScrolling(true);
    if (creativeScrollRef.current) creativeScrollRef.current.scrollTop = 0;
    if (studentScrollRef.current) studentScrollRef.current.scrollTop = 0;
    if (techScrollRef.current) techScrollRef.current.scrollTop = 0;
  };

  // Touch Swipe Gesture Tracking
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    
    // Swipe left -> Show next profile
    if (diff > 50) {
      nextPersona();
    }
    // Swipe right -> Show previous profile
    else if (diff < -50) {
      prevPersona();
    }
    
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div className="relative group">
      {/* Premium Outer Glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/10 via-transparent to-orange-500/5 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      {/* Hardware Frame */}
      <div className="relative w-[300px] h-[620px] bg-[#0F172A] rounded-[3.5rem] p-2.5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border-[8px] border-[#1E293B]">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1E293B] rounded-b-2xl z-50 flex items-center justify-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-black/40" />
          <div className="w-6 h-1 rounded-full bg-black/40" />
        </div>

        {/* Screen Content */}
        <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden font-sans">
          
          {/* Floating Pagination Dots Pill */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-1.5 z-[60] shadow-md border border-white/5 select-none">
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeIndex === 0 ? 'bg-orange-500 w-3.5' : 'bg-white/40'}`} />
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeIndex === 1 ? 'bg-pink-500 w-3.5' : 'bg-white/40'}`} />
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeIndex === 2 ? 'bg-teal-400 w-3.5' : 'bg-white/40'}`} />
          </div>

          {/* Sliding Content Container */}
          <div 
            className="w-full h-full flex transition-transform duration-500 ease-out" 
            style={{ transform: `translateX(-${activeIndex * 100}%)`, width: '100%' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            
            {/* Persona 1: Creative Professional (Arjun Rao) */}
            <div 
              ref={creativeScrollRef}
              className="w-full h-full overflow-y-auto no-scrollbar scroll-smooth relative flex-shrink-0 bg-white"
              onWheel={() => setIsAutoScrolling(false)}
              onPointerDown={() => setIsAutoScrolling(false)}
            >
              {/* Floating Sparkles Layer */}
              <div className="absolute inset-0 pointer-events-none opacity-40">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="absolute animate-pulse text-[10px]" style={{ top: `${i * 15}%`, left: `${(i % 3) * 30}%` }}>✨</div>
                ))}
              </div>

              {/* Banner Section */}
              <div className="w-full h-32 relative bg-[#1A1A1A] shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop" 
                  className="absolute inset-0 w-full h-full object-cover opacity-90" 
                  alt="Creative Banner"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>

              {/* Identity Content Stack */}
              <div className="px-5 pb-32">
                {/* Avatar Stack */}
                <div className="relative h-4 mb-12">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                    <div className="w-24 h-24 p-1 rounded-full bg-gradient-to-tr from-[#FF9933] to-[#138808]">
                      <div className="w-full h-full bg-white p-0.5 rounded-full overflow-hidden shadow-inner">
                        <img 
                          src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200" 
                          alt="Arjun Rao Avatar" 
                          className="w-full h-full object-cover rounded-full" 
                        />
                      </div>
                    </div>
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center border border-neutral-100">
                      <div className="text-orange-600 text-[8px]">✦</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-black tracking-tight text-neutral-900 mb-0.5 uppercase italic">Arjun Rao</h3>
                  <p className="text-[7px] font-black text-orange-600 uppercase tracking-[0.4em] mb-3">CREATIVE PROFESSIONAL</p>
                  
                  <p className="text-center text-[9px] font-bold text-neutral-800 leading-tight italic mb-6 px-4">
                    "Building the phygital future of identity in India. Founder at Studio Vibe."
                  </p>

                  {/* Pulse Section (Live Randomization) */}
                  <div className="flex justify-evenly items-start w-full mb-6 border-y border-neutral-100 py-4 transition-all duration-500">
                    <div className="flex flex-col items-center text-center">
                      <span className="text-2xl font-black text-neutral-900 leading-none mb-1.5 tabular-nums">
                        {(stats.creativeViews/1000).toFixed(1)}K
                      </span>
                      <p className="text-[7px] font-black uppercase text-neutral-400 tracking-widest">Profile Views</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <span 
                        className="text-2xl font-black leading-none mb-1.5 transition-colors duration-1000"
                        style={{ color: stats.creativeCity.color }}
                      >
                        {stats.creativeCity.name}
                      </span>
                      <p className="text-[7px] font-black uppercase text-neutral-400 tracking-widest">Most Scanned Place</p>
                    </div>
                  </div>

                  {/* Network Presence */}
                  <div className="w-full mb-6">
                     <p className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-900 mb-3">Network Presence</p>
                     <div className="flex gap-3">
                        <a href="#" onClick={e => e.preventDefault()} aria-label="Instagram" className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white hover:scale-105 transition-transform"><Instagram size={14} /></a>
                        <a href="#" onClick={e => e.preventDefault()} aria-label="Twitter" className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white hover:scale-105 transition-transform"><Twitter size={14} /></a>
                        <a href="#" onClick={e => e.preventDefault()} aria-label="LinkedIn" className="w-8 h-8 rounded-lg bg-[#0077B5] flex items-center justify-center text-white hover:scale-105 transition-transform"><Linkedin size={14} /></a>
                     </div>
                  </div>

                  {/* Curated Showcase */}
                  <div className="w-full">
                    <div className="flex justify-between items-end mb-3">
                       <div>
                         <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-900 leading-none">Curated Showcase</h4>
                         <p className="text-[7px] font-bold text-neutral-400 uppercase mt-0.5">Portfolio</p>
                       </div>
                       <Trophy size={10} className="text-amber-500" />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="aspect-video rounded-2xl overflow-hidden bg-neutral-100 relative group/item">
                        <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=400&auto=format" className="w-full h-full object-cover" alt="Creative Portfolio" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                           <Film size={16} className="text-white opacity-40" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Persona 2: Student Club Lead (Riya Sharma) */}
            <div 
              ref={studentScrollRef}
              className="w-full h-full overflow-y-auto no-scrollbar scroll-smooth relative flex-shrink-0 bg-[#FAFAFA]"
              onWheel={() => setIsAutoScrolling(false)}
              onPointerDown={() => setIsAutoScrolling(false)}
            >
              {/* Floating Sparkles Layer */}
              <div className="absolute inset-0 pointer-events-none opacity-40">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="absolute animate-pulse text-[10px] text-pink-500" style={{ top: `${i * 15}%`, left: `${(i % 3) * 30}%` }}>✨</div>
                ))}
              </div>

              {/* Banner Section */}
              <div className="w-full h-32 relative bg-[#1A1A1A] shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop" 
                  className="absolute inset-0 w-full h-full object-cover opacity-90" 
                  alt="Student Banner"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-transparent to-transparent" />
              </div>

              {/* Identity Content Stack */}
              <div className="px-5 pb-32">
                {/* Avatar Stack */}
                <div className="relative h-4 mb-12">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                    {/* Mood Bubble */}
                    <div className="absolute -right-6 -top-2 z-30 animate-bounce" style={{ animationDuration: '3s' }}>
                      <div className="relative bg-white border border-emerald-100 rounded-xl px-2 py-1 shadow-md flex items-center gap-1">
                        <span className="text-[7px] font-black text-emerald-600 uppercase tracking-widest whitespace-nowrap">📚 Study Mode</span>
                        <div className="absolute -left-1 bottom-1.5 w-1.5 h-1.5 bg-white border-l border-b border-emerald-100 rotate-45 rounded-sm" />
                      </div>
                    </div>

                    <div className="w-24 h-24 p-1 rounded-full bg-gradient-to-tr from-[#059669] to-[#34D399]">
                      <div className="w-full h-full bg-white p-0.5 rounded-full overflow-hidden shadow-inner">
                        <img 
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" 
                          alt="Riya Sharma Avatar" 
                          className="w-full h-full object-cover rounded-full" 
                        />
                      </div>
                    </div>
                    
                    {/* Pulse Badge */}
                    <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 z-40">
                      <div className="bg-neutral-900 text-white px-3 py-1 rounded-full shadow-md border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
                        <Activity size={8} className="text-emerald-400 animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-[0.1em]">{stats.studentViews} Pulse</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-black tracking-tight text-neutral-900 mb-0.5 uppercase italic">Riya Sharma</h3>
                  <p className="text-[7px] font-black text-purple-600 uppercase tracking-[0.4em] mb-1">CS STUDENT & TEDx LEAD</p>
                  <p className="text-[#059669] font-bold text-[9px] tracking-wide flex items-center justify-center gap-1 mb-4">
                    <GraduationCap size={12} /> Student @ BITS Pilani
                  </p>
                  
                  <p className="text-center text-[9px] font-bold text-neutral-500 leading-tight italic mb-6 px-4">
                    "CS @ BITS Pilani. Hackathon enthusiast, UI designer, and lead organizer. Coffee lover!"
                  </p>

                  {/* Student Stats Row */}
                  <div className="grid grid-cols-2 gap-3 w-full mb-6">
                    <div className="bg-white p-3 rounded-2xl border border-neutral-100 shadow-sm text-center">
                      <p className="text-[7px] font-black uppercase tracking-widest text-neutral-400 mb-1">Campus Rank</p>
                      <div className="text-base font-black text-neutral-900 flex items-center justify-center gap-1.5">
                        Top 2% <Trophy size={12} className="text-amber-500" />
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-neutral-100 shadow-sm text-center">
                      <p className="text-[7px] font-black uppercase tracking-widest text-neutral-400 mb-1">Study Buddies</p>
                      <div className="text-base font-black text-neutral-900 flex items-center justify-center gap-1.5">
                        28 <Users size={12} className="text-emerald-500" />
                      </div>
                    </div>
                  </div>

                  {/* Network Presence */}
                  <div className="w-full mb-6">
                     <p className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-900 mb-3">Find Me On</p>
                     <div className="flex gap-3">
                        <a href="#" onClick={e => e.preventDefault()} aria-label="GitHub" className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white hover:scale-105 transition-transform"><Github size={14} /></a>
                        <a href="#" onClick={e => e.preventDefault()} aria-label="Instagram" className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white hover:scale-105 transition-transform"><Instagram size={14} /></a>
                        <a href="#" onClick={e => e.preventDefault()} aria-label="Music Profile" className="w-8 h-8 rounded-lg bg-[#1DB954] flex items-center justify-center text-white hover:scale-105 transition-transform"><Music size={14} /></a>
                     </div>
                  </div>

                  {/* Curated Showcase */}
                  <div className="w-full">
                    <div className="flex justify-between items-end mb-3">
                       <div>
                         <h4 className="text-[8px] font-black uppercase tracking-[0.15em] text-neutral-900 leading-none">Latest Projects</h4>
                         <p className="text-[7px] font-bold text-neutral-400 uppercase mt-0.5">Design & Code</p>
                       </div>
                       <Sparkles size={10} className="text-purple-500" />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="aspect-video rounded-2xl overflow-hidden bg-neutral-100 relative group/item">
                        <img src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=400&auto=format" className="w-full h-full object-cover" alt="Student Event" />
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                           <span className="text-[8px] font-black uppercase tracking-wider text-white bg-black/40 px-2 py-1 rounded">TEDx Organizer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Persona 3: Software Engineer (Vikram Aditya) */}
            <div 
              ref={techScrollRef}
              className="w-full h-full overflow-y-auto no-scrollbar scroll-smooth relative flex-shrink-0 bg-[#0B0F19]"
              onWheel={() => setIsAutoScrolling(false)}
              onPointerDown={() => setIsAutoScrolling(false)}
            >
              {/* Cyberpunk Grid Background */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.05]"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(13,148,136,0.3) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(13,148,136,0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Floating Sparkles Layer */}
              <div className="absolute inset-0 pointer-events-none opacity-35">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="absolute animate-pulse text-[10px] text-teal-400" style={{ top: `${i * 15}%`, left: `${(i % 3) * 30}%` }}>⚡</div>
                ))}
              </div>

              {/* Banner Section */}
              <div className="w-full h-32 relative bg-[#070A13] shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80" 
                  alt="Tech Banner"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />
              </div>

              {/* Identity Content Stack */}
              <div className="px-5 pb-32">
                {/* Avatar Stack */}
                <div className="relative h-4 mb-12">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                    <div className="w-24 h-24 p-1 rounded-full bg-gradient-to-tr from-teal-500 via-emerald-400 to-cyan-500">
                      <div className="w-full h-full bg-[#0F172A] p-0.5 rounded-full overflow-hidden shadow-inner">
                        <img 
                          src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200" 
                          alt="Vikram Aditya Avatar" 
                          className="w-full h-full object-cover rounded-full" 
                        />
                      </div>
                    </div>
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#0B0F19] rounded-full shadow-lg flex items-center justify-center border border-teal-500/20">
                      <div className="text-teal-400 text-[10px]"><Code size={11} /></div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-black tracking-tight text-white mb-0.5 uppercase italic">Vikram Aditya</h3>
                  <p className="text-[7px] font-black text-teal-400 uppercase tracking-[0.4em] mb-1">SOFTWARE ENGINEER</p>
                  
                  {/* Status Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-[8px] font-black uppercase tracking-widest mt-1 mb-4 select-none">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    Open for Work
                  </div>
                  
                  <p className="text-center text-[9px] font-bold text-neutral-300 leading-tight italic mb-6 px-4">
                    "Architecting highly scalable backends. Open-source contributor. Ex-Google, building web3 tools."
                  </p>

                  {/* About Me IDE Card */}
                  <div className="w-full text-left bg-[#0B0F19] border border-neutral-800 border-l-[3px] border-l-teal-500 rounded-2xl p-4 shadow-md relative mb-5">
                    {/* Decorative IDE buttons */}
                    <div className="absolute top-3 right-3 flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    </div>
                    <span className="block text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-3">About Me</span>
                    <div className="space-y-2 font-mono text-[9px] text-neutral-300">
                      <div className="flex items-center justify-between border-b border-neutral-800/60 pb-1">
                        <span className="text-neutral-500 font-bold uppercase tracking-wider">ROLE</span>
                        <span className="text-white font-black">Software Architect</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-neutral-800/60 pb-1">
                        <span className="text-neutral-500 font-bold uppercase tracking-wider">STATUS</span>
                        <span className="text-teal-400 font-black">Building Web3</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-neutral-800/60 pb-1">
                        <span className="text-neutral-500 font-bold uppercase tracking-wider">ORG</span>
                        <span className="text-white font-black">ex-Google</span>
                      </div>
                    </div>
                  </div>

                  {/* Core Languages */}
                  <div className="w-full text-left mb-6">
                    <span className="block text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2.5">Core Languages</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['TypeScript', 'Go', 'Rust', 'Python'].map(lang => (
                        <span key={lang} className="text-[8px] bg-[#111827] text-neutral-300 px-2.5 py-1 rounded-lg border border-neutral-800 font-mono font-black uppercase tracking-wider">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Curated Showcase */}
                  <div className="w-full">
                    <div className="flex justify-between items-end mb-3">
                       <div>
                         <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-white/90 leading-none">Code Repository</h4>
                         <p className="text-[7px] font-bold text-teal-600/80 uppercase mt-0.5">Open Source</p>
                       </div>
                       <Trophy size={10} className="text-teal-400" />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-teal-500/10 relative group/item">
                        <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=400&auto=format" className="w-full h-full object-cover opacity-60" alt="Code Repository" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                           <span className="text-[8px] font-mono text-teal-400 bg-neutral-950/80 px-2.5 py-1.5 rounded-lg border border-teal-500/20 shadow-lg">npm run prod</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Fixed Footer CTAs */}
          {activeIndex === 0 && (
            <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-white via-white to-transparent pt-8 z-50">
               <div className="grid grid-cols-2 gap-2">
                  <button className="py-2.5 bg-[#C1440E] text-white rounded-xl font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                     <UserPlus size={10} /> Connect
                  </button>
                  <button className="py-2.5 bg-white border border-neutral-200 text-[#1A1A1A] rounded-xl font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-1.5 active:scale-95 transition-all">
                     <Share2 size={10} /> Share
                  </button>
               </div>
            </div>
          )}

          {activeIndex === 1 && (
            <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA] to-transparent pt-8 z-50">
               <div className="grid grid-cols-2 gap-2">
                  <button className="py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20 active:scale-95 transition-all">
                     <UserPlus size={10} /> Connect
                  </button>
                  <button className="py-2.5 bg-white border border-neutral-200 text-[#1A1A1A] rounded-xl font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-1.5 active:scale-95 transition-all">
                     <Share2 size={10} /> Share
                  </button>
               </div>
            </div>
          )}

          {activeIndex === 2 && (
            <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19] to-transparent pt-8 z-50">
               <div className="grid grid-cols-2 gap-2">
                  <button className="py-2.5 bg-gradient-to-r from-teal-600 to-cyan-500 text-white rounded-xl font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/20 active:scale-95 transition-all">
                     <UserPlus size={10} /> Connect
                  </button>
                  <button className="py-2.5 bg-[#1E293B] border border-neutral-800 text-teal-400 rounded-xl font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-1.5 active:scale-95 transition-all">
                     <Share2 size={10} /> Share
                  </button>
               </div>
            </div>
          )}

        </div>

        {/* Dynamic Shadow */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[70%] h-8 bg-black/15 blur-2xl rounded-full" />
      </div>

      {/* Navigation Arrows & Swipe Hints (Outside Hardware Frame) */}
      {/* Left Swipe Button */}
      <div className="absolute -left-16 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-1.5 z-40 select-none">
        <button 
          onClick={prevPersona}
          className="w-12 h-12 rounded-full bg-slate-900/90 border border-slate-800/80 text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 hover:border-slate-700 hover:bg-slate-800 group/btn"
          aria-label="Previous profile"
        >
          <ChevronLeft className="w-6 h-6 text-neutral-400 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
        </button>
      </div>

      {/* Right Swipe Button (Pulsating Swipe Left Indicator) */}
      <div className="absolute -right-16 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-1.5 z-40 select-none">
        <button 
          onClick={nextPersona}
          className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 group/btn"
          style={{ boxShadow: '0 0 15px rgba(234, 88, 12, 0.4)' }}
          aria-label="Next profile"
        >
          <ChevronRight className="w-6 h-6 animate-pulse group-hover:translate-x-0.5 transition-all" />
        </button>
        <span className="text-[8px] font-black tracking-widest uppercase text-orange-500 bg-orange-950/60 border border-orange-500/20 px-2.5 py-1 rounded-full animate-pulse whitespace-nowrap">
          Swipe Left
        </span>
      </div>
    </div>
  );
};

export default PhoneMockup;

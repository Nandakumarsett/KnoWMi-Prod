import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Trophy, UserPlus, Share2, Instagram, Twitter, Linkedin, Film } from 'lucide-react';

const CITIES = [
  { name: 'Bengaluru', color: '#D71920' },
  { name: 'Mumbai', color: '#004BA0' },
  { name: 'Delhi', color: '#17479E' },
  { name: 'Hyderabad', color: '#F26522' },
  { name: 'Chennai', color: '#F9CD05' },
  { name: 'Kolkata', color: '#3A225D' }
];

const PhoneMockup = () => {
  const [stats, setStats] = useState({ views: 2471, city: CITIES[0] });
  const scrollRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Live Data Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        views: prev.views + Math.floor(Math.random() * 5) + 1,
        city: CITIES[Math.floor(Math.random() * CITIES.length)]
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll Logic
  useEffect(() => {
    if (!isAutoScrolling || !scrollRef.current) return;
    
    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (el) {
        // Stop scrolling when showcase is reached (approx 400px down)
        if (el.scrollTop < 320) {
          el.scrollTop += 0.5;
        } else {
          setIsAutoScrolling(false);
        }
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [isAutoScrolling]);

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
          
          {/* Scrollable Profile Content */}
          <div 
            ref={scrollRef}
            className="w-full h-full overflow-y-auto no-scrollbar scroll-smooth relative"
            onWheel={() => setIsAutoScrolling(false)}
            onPointerDown={() => setIsAutoScrolling(false)}
          >
            {/* 🦋 Floating Sparkles Layer */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="absolute animate-pulse" style={{ top: `${i * 15}%`, left: `${(i % 3) * 30}%` }}>✨</div>
              ))}
            </div>

            {/* Banner Section */}
            <div className="w-full h-32 relative bg-[#1A1A1A] shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=2070&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover" 
                alt="Banner"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>

            {/* Identity Content Stack */}
            <div className="px-5 pb-32">
                {/* Avatar Stack */}
                <div className="relative h-4 mb-12">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                    <div className="w-24 h-24 p-1 rounded-full bg-gradient-to-tr from-[#C1440E] to-[#F97316]">
                      <div className="w-full h-full bg-white p-0.5 rounded-full overflow-hidden shadow-inner">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" alt="Avatar" className="w-full h-full object-cover rounded-full" />
                      </div>
                    </div>
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center border border-neutral-100">
                      <div className="text-orange-600 text-[8px]">✦</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <h1 className="text-lg font-black tracking-tight text-neutral-900 mb-0.5 uppercase italic">Arjun Rao</h1>
                  <p className="text-[7px] font-black text-orange-600 uppercase tracking-[0.4em] mb-3">CREATIVE PROFESSIONAL</p>
                  
                  <p className="text-center text-[9px] font-black text-neutral-800 leading-tight italic mb-6 px-4">
                    "Building the phygital future of identity in India. Founder at Studio Vibe."
                  </p>

                  {/* Pulse Section (Live Randomization) */}
                  <div className="flex justify-evenly items-start w-full mb-8 border-y border-neutral-50 py-4 transition-all duration-500">
                    <div className="flex flex-col items-center text-center">
                      <span className="text-2xl font-black text-neutral-900 leading-none mb-1.5 tabular-nums">
                        {(stats.views/1000).toFixed(1)}K
                      </span>
                      <p className="text-[7px] font-black uppercase text-neutral-400 tracking-widest">Profile Views</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <span 
                        className="text-2xl font-black leading-none mb-1.5 transition-colors duration-1000"
                        style={{ color: stats.city.color }}
                      >
                        {stats.city.name}
                      </span>
                      <p className="text-[7px] font-black uppercase text-neutral-400 tracking-widest">Most Scanned Place</p>
                    </div>
                  </div>

                  {/* Network Presence */}
                  <div className="w-full mb-8">
                     <p className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-900 mb-3">Network Presence</p>
                     <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white"><Instagram size={14} /></div>
                        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white"><Twitter size={14} /></div>
                        <div className="w-8 h-8 rounded-lg bg-[#0077B5] flex items-center justify-center text-white"><Linkedin size={14} /></div>
                     </div>
                  </div>

                  {/* Curated Showcase */}
                  <div className="w-full mb-6">
                    <div className="flex justify-between items-end mb-3">
                       <div>
                         <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-900 leading-none">Curated Showcase</h4>
                         <p className="text-[7px] font-bold text-neutral-400 uppercase mt-0.5">Portfolio</p>
                       </div>
                       <Trophy size={10} className="text-amber-500" />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="aspect-video rounded-2xl overflow-hidden bg-neutral-100 relative group/item">
                        <img src="https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=400&auto=format" className="w-full h-full object-cover" alt="Work" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                           <Film size={16} className="text-white opacity-40" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          {/* Fixed Footer CTAs */}
          <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-white via-white to-transparent pt-8 z-50">
             <div className="grid grid-cols-2 gap-2">
                <button className="py-2.5 bg-[#C1440E] text-white rounded-xl font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20">
                   <UserPlus size={10} /> Connect
                </button>
                <button className="py-2.5 bg-white border border-neutral-200 text-[#1A1A1A] rounded-xl font-black uppercase tracking-widest text-[8px] flex items-center justify-center gap-1.5">
                   <Share2 size={10} /> Share
                </button>
             </div>
          </div>

        </div>

        {/* Dynamic Shadow */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[70%] h-8 bg-black/15 blur-2xl rounded-full" />
      </div>
    </div>
  );
};

export default PhoneMockup;

import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, MapPin, Globe, Zap, 
  Users, Activity, Sparkles, ChevronRight,
  ArrowUpRight, Target, Share2, Eye
} from 'lucide-react';

const PhoneMockup = () => {
  const [activeTab, setActiveTab] = useState('insights');
  const [scrollPos, setScrollPos] = useState(0);
  const containerRef = useRef(null);

  // Auto-scrolling simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPos(prev => (prev + 1) % 300);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative group">
      {/* Premium Outer Glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/20 via-transparent to-emerald-500/10 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      {/* Hardware Frame */}
      <div className="relative w-[320px] h-[650px] bg-[#0F172A] rounded-[3.5rem] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-[8px] border-[#1E293B]">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1E293B] rounded-b-3xl z-50 flex items-center justify-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-black/40" />
          <div className="w-8 h-1.5 rounded-full bg-black/40" />
        </div>

        {/* Screen Content */}
        <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden flex flex-col font-sans">
          
          {/* Mockup Header */}
          <div className="pt-10 pb-4 px-6 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-neutral-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
                  <Zap size={16} fill="white" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-neutral-900 leading-none">Vibe Pulse</h4>
                  <p className="text-[9px] font-bold text-neutral-400 mt-1">Live Analytics</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Live Now</span>
              </div>
            </div>
          </div>

          {/* Scrollable Area */}
          <div className="flex-1 overflow-hidden relative">
            <div 
              className="absolute inset-0 transition-transform duration-1000 ease-out"
              style={{ transform: `translateY(-${Math.min(scrollPos * 0.5, 120)}px)` }}
            >
              {/* Stat Hero */}
              <div className="px-6 py-8 bg-gradient-to-b from-white to-neutral-50">
                <div className="mb-6">
                  <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2 block">Total Engagement</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-neutral-900 tracking-tighter">2,847</span>
                    <span className="text-xs font-black text-emerald-500 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded-lg">+14%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-4 rounded-3xl border border-neutral-100 shadow-sm">
                    <Eye size={16} className="text-orange-500 mb-2" />
                    <div className="text-lg font-black text-neutral-900">842</div>
                    <div className="text-[9px] font-bold text-neutral-400 uppercase">Profile Views</div>
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-neutral-100 shadow-sm">
                    <Share2 size={16} className="text-blue-500 mb-2" />
                    <div className="text-lg font-black text-neutral-900">128</div>
                    <div className="text-[9px] font-bold text-neutral-400 uppercase">Direct Shares</div>
                  </div>
                </div>
              </div>

              {/* Heatmap Section */}
              <div className="mx-4 p-6 bg-neutral-900 rounded-[2.5rem] shadow-2xl relative overflow-hidden group/card">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-transparent to-transparent opacity-50" />
                
                <div className="relative z-10 flex items-center justify-between mb-8">
                  <div>
                    <h5 className="text-white text-sm font-black tracking-tight">Identity Reach</h5>
                    <p className="text-neutral-500 text-[10px] font-bold">Top regions this week</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
                    <MapPin size={14} />
                  </div>
                </div>

                {/* Animated Bars */}
                <div className="space-y-4 relative z-10">
                  {[
                    { city: 'Mumbai', value: 85, color: '#F97316' },
                    { city: 'Bangalore', value: 65, color: '#3B82F6' },
                    { city: 'Delhi', value: 45, color: '#10B981' }
                  ].map((loc, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-neutral-400">
                        <span>{loc.city}</span>
                        <span className="text-white">{loc.value}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 delay-300"
                          style={{ 
                            width: `${loc.value}%`, 
                            backgroundColor: loc.color,
                            boxShadow: `0 0 10px ${loc.color}40`
                          }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pulsing Dot Simulation */}
                <div className="absolute right-6 top-20 opacity-20 pointer-events-none">
                  <div className="w-32 h-32 rounded-full border border-orange-500/30 animate-ping" />
                </div>
              </div>

              {/* Engagement Feed */}
              <div className="px-6 py-10">
                <h5 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-6">Recent Activity</h5>
                <div className="space-y-6">
                  {[
                    { type: 'Scan', time: 'Just now', loc: 'Bandra, MH', color: 'bg-orange-500' },
                    { type: 'Save', time: '12m ago', loc: 'Indiranagar, KA', color: 'bg-blue-500' },
                    { type: 'View', time: '1h ago', loc: 'Cyber City, HR', color: 'bg-emerald-500' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className={`w-1.5 h-10 rounded-full ${item.color} opacity-20`} />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-black text-neutral-900">{item.type} Detected</span>
                          <span className="text-[9px] font-bold text-neutral-300">{item.time}</span>
                        </div>
                        <p className="text-[10px] font-medium text-neutral-500 flex items-center gap-1">
                          <MapPin size={8} /> {item.loc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="h-20 bg-white border-t border-neutral-50 flex items-center justify-around px-4 sticky bottom-0 z-40">
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-100">
                <Activity size={20} />
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-300">
              <Globe size={20} />
            </div>
            <div className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-300">
              <Users size={20} />
            </div>
          </div>

        </div>

        {/* Dynamic Shadow */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-10 bg-black/20 blur-2xl rounded-full" />
      </div>
    </div>
  );
};

export default PhoneMockup;

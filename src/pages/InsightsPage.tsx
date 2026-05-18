import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { buildInsightContext } from '../lib/insights/build-context';
import { computeAllInsights, InsightCard, Nudge, BestTimeResult } from '../lib/insights/insight-engine';
import { ArrowLeft, Sparkles, ChevronRight, CheckCircle2, Clock, Trophy, Calendar, User, Zap, TrendingUp, HelpCircle, Info } from 'lucide-react';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, Tooltip as RechartsTooltip } from 'recharts';
import Avatar from '../components/Avatar';

// Mock data for the bar chart if needed
const SCAN_ACTIVITY = [
  { day: 'M', value: 30 },
  { day: 'T', value: 45 },
  { day: 'W', value: 60 },
  { day: 'T', value: 55 },
  { day: 'F', value: 90, active: true },
  { day: 'S', value: 40 },
  { day: 'S', value: 35 },
  { day: 'S', value: 30 },
];

export default function InsightsPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [cards, setCards] = useState<InsightCard[]>([]);
  const [nudge, setNudge] = useState<Nudge | null>(null);
  const [bestTime, setBestTime] = useState<BestTimeResult | null>(null);
  const [ctx, setCtx] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        let profId = '';
        if (user) {
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (prof) {
            const identities = prof.persona_data?.identities || [];
            const activeIden = identities.find((i: any) => i.active);
            
            if (activeIden) {
              setProfile({
                ...prof,
                first_name: activeIden.first_name || prof.first_name,
                avatar_url: activeIden.avatar_url || prof.avatar_url
              });
            } else {
              setProfile(prof);
            }
            profId = prof.id;
          }
        }

        if (!profId) {
          const { data: allProfs } = await supabase
            .from('profiles')
            .select('*')
            .limit(1);

          if (allProfs && allProfs.length > 0) {
            setProfile(allProfs[0]);
            profId = allProfs[0].id;
          }
        }

        if (profId) {
          const context = await buildInsightContext(profId, supabase);
          const dismissed = JSON.parse(localStorage.getItem('dismissed_nudges') ?? '[]');
          const results = computeAllInsights(context, dismissed);
          
          if (active) {
            setCtx(context);
            setCards(results.weeklyCards);
            setNudge(results.nudge);
            setBestTime(results.bestTime);
          }
        }
      } catch (err) {
        console.error('Error loading insights page:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [navigate]);

  const handleDismissNudge = () => {
    if (!nudge) return;
    const dismissed: string[] = JSON.parse(localStorage.getItem('dismissed_nudges') ?? '[]');
    dismissed.push(nudge.id);
    localStorage.setItem('dismissed_nudges', JSON.stringify(dismissed));
    setNudge(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-[10px] font-black tracking-[0.2em] text-neutral-400 uppercase animate-pulse">Deep Analyzing context...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-32 font-sans text-neutral-900 selection:bg-orange-100">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        .font-display { font-family: 'Montserrat', sans-serif; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.4); }
        .insight-row:hover { transform: translateX(8px); background: #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.04); }
      `}} />

      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-neutral-100/50 z-50">
        <div className="max-w-[800px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button 
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-12 h-12 rounded-2xl border border-neutral-100 bg-white hover:border-orange-200 flex items-center justify-center transition-all duration-300 shadow-sm active:scale-90 group"
            >
              <ArrowLeft size={20} className="text-neutral-500 group-hover:text-orange-500 transition-colors" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black font-display tracking-tight text-neutral-900">AI Insights</h1>
                <span className="text-[10px] bg-violet-100 text-violet-600 font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">BETA</span>
              </div>
              <p className="text-xs text-neutral-400 font-medium">Smart insights to grow your visibility</p>
            </div>
          </div>
          <div className="flex items-center gap-3 pr-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black leading-none text-neutral-900">{profile?.first_name || 'User'}</p>
              <p className="text-[9px] font-black text-orange-500 uppercase tracking-luxury mt-1.5">Premium Member</p>
            </div>
            <Avatar 
              src={profile?.avatar_url} 
              name={profile?.first_name} 
              size="w-10 h-10 rounded-2xl" 
            />
          </div>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto px-6 pt-10">
        
        {/* Top Hero Insight Card */}
        <div className="bg-white rounded-[40px] p-10 mb-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-neutral-100 relative overflow-hidden group animate-slideUp">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
          
          <div className="flex flex-col lg:flex-row gap-12 relative z-10">
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-8">
                <span className="text-[10px] bg-orange-50 text-orange-600 font-black px-3 py-1.5 rounded-xl uppercase tracking-[0.2em] flex items-center gap-2 border border-orange-100">
                  <Sparkles size={12} className="fill-orange-600/10" /> Top Insight
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 font-black px-3 py-1.5 rounded-xl uppercase tracking-[0.2em] flex items-center gap-2 border border-emerald-100 ml-auto lg:ml-0">
                  <CheckCircle2 size={12} /> High Confidence
                </span>
              </div>

              <div className="mb-10">
                <div className="flex items-center gap-6 mb-4">
                  <div className="w-24 h-24 rounded-[32px] bg-violet-50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Sparkles size={40} className="text-violet-500 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-400 mb-1">Your peak time is</p>
                    <h2 className="text-6xl font-display font-black text-neutral-900 tracking-tighter">
                      {bestTime?.optimalWindow || '6:42 PM'}
                    </h2>
                  </div>
                </div>
                <p className="text-lg font-medium text-neutral-600 max-w-sm leading-relaxed">
                  People are <span className="text-violet-600 font-black">3.2x</span> more likely to scan you at this time.
                </p>
              </div>

              <button className="w-fit bg-white border-2 border-violet-100 text-violet-600 font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all duration-300 shadow-sm active:scale-95 flex items-center gap-3">
                Take Action <ArrowLeft size={16} className="rotate-180" />
              </button>
            </div>

            <div className="flex-1 bg-neutral-50/50 rounded-[32px] p-8 border border-neutral-100">
               <div className="flex justify-between items-center mb-6">
                 <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Scan activity (last 7 days)</p>
               </div>
               
               <div className="h-48 w-full mb-6">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={ctx?.analytics?.weekSparkline?.map((v: number, i: number) => ({
                     day: ['S','M','T','W','T','F','S'][(new Date(Date.now() - (6-i)*86400000)).getDay()],
                     value: v || 0,
                     active: i === 6
                   })) || SCAN_ACTIVITY}>
                     <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#A3A3A3'}} dy={10} />
                     <RechartsTooltip cursor={{fill: 'transparent'}} content={() => null} />
                     <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={12}>
                       {(ctx?.analytics?.weekSparkline || SCAN_ACTIVITY).map((entry: any, index: number) => (
                         <Cell key={`cell-${index}`} fill={index === 6 ? '#8B5CF6' : '#E5E5E5'} />
                       ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>

               <div className="bg-violet-100/50 rounded-2xl py-3 px-6 text-center border border-violet-200/50">
                 <p className="text-[11px] font-black text-violet-700 uppercase tracking-widest">
                   Peak window: {bestTime?.optimalWindow || 'Calculating...'}
                 </p>
               </div>
            </div>
          </div>
        </div>


        {/* Insight Details Section */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
             <h3 className="text-lg font-display font-black text-neutral-900">AI Insight Details</h3>
          </div>
          <button className="flex items-center gap-2 text-[10px] font-black text-neutral-400 uppercase tracking-widest hover:text-orange-500 transition-colors group">
            <HelpCircle size={14} /> How it works?
          </button>
        </div>

        <div className="space-y-4 mb-16">
          {cards.filter(c => c.type !== 'best_time').length === 0 ? (
            <div className="p-20 text-center bg-white rounded-[40px] border border-dashed border-neutral-200">
               <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-neutral-300">
                 <Info size={32} />
               </div>
               <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">No active insights. Wear your Tee to generate data.</p>
            </div>
          ) : cards.filter(c => c.type !== 'best_time').map((item, idx) => (
            <div key={item.id} className="insight-row bg-white border border-neutral-100 rounded-[32px] p-6 flex items-center gap-8 transition-all duration-300 animate-slideUp cursor-pointer group" style={{ animationDelay: `${idx * 100}ms` }}>
               <div className={`w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 shadow-sm group-hover:rotate-12 transition-transform`}>
                 <span className="text-2xl">{item.emoji || '✦'}</span>
               </div>
               <div className="flex-1">
                 <span className="text-[9px] font-black tracking-widest text-neutral-400 uppercase mb-1 block">{item.type.replace('_', ' ')}</span>
                 <h4 className="text-base font-black font-display text-neutral-900 mb-1">{item.headline}</h4>
                 <p className="text-xs text-neutral-500 font-medium leading-relaxed">{item.body}</p>
               </div>
               
               <div className="text-right hidden md:block px-6 border-x border-neutral-50 h-10 flex flex-col justify-center min-w-[140px]">
                  <p className="text-sm font-black text-neutral-900">{item.data_point || 'Real-time'}</p>
                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-tight">Verified Data</p>
               </div>

               {item.cta ? (
                 <a 
                   href={item.cta_url || '#'}
                   onClick={(e) => { if (!item.cta_url) e.preventDefault(); }}
                   className="h-12 px-6 rounded-2xl border border-neutral-100 text-[10px] font-black uppercase tracking-widest hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all flex items-center gap-2 group/btn"
                 >
                   {item.cta} <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                 </a>
               ) : (
                 <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-300">
                   <ChevronRight size={18} />
                 </div>
               )}
            </div>
          ))}
        </div>

        {/* Growth Score Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 mb-12 animate-slideUp" style={{ animationDelay: '600ms' }}>
          <div className="bg-white border border-neutral-100 rounded-[40px] p-10 flex items-center gap-10 shadow-sm">
            <div className="relative w-36 h-36 shrink-0">
               <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                 <circle cx="50" cy="50" r="45" fill="none" stroke="#F5F3FF" strokeWidth="8" />
                 <circle cx="50" cy="50" r="45" fill="none" stroke="#8B5CF6" strokeWidth="8" strokeDasharray="283" strokeDashoffset={283 * (1 - (ctx?.profile?.completionScore || 0) / 100)} strokeLinecap="round" />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                 <span className="text-3xl font-display font-black text-neutral-900">{ctx?.profile?.completionScore || 0}%</span>
                 <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest leading-tight">Growth Score</p>
               </div>
            </div>
            <div>
              <h4 className="text-lg font-display font-black text-neutral-900 mb-2">Insight Summary</h4>
              <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                {ctx?.profile?.completionScore < 70 
                  ? `Your profile is ${ctx.profile.completionScore}% optimized. Complete your identity sections to unlock professional credibility and advanced analytics.`
                  : "Excellent optimization! Your identity is sharp and ready for professional discovery."}
              </p>
            </div>
          </div>

          <div className="bg-[#13131a] rounded-[40px] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/40"><Info size={20}/></div>
                 <p className="text-[10px] font-black uppercase tracking-widest">Next Milestone</p>
              </div>
              <p className="text-sm font-medium leading-relaxed mb-8 text-neutral-400">
                Reach <span className="text-white font-black">70%</span> to unlock advanced audience insights.
              </p>
              <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95">
                Show Me How <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-neutral-100/50 rounded-[32px] p-8 flex items-center justify-between border border-neutral-200/50 mb-20">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">🎁</div>
              <div>
                <p className="text-sm font-black text-neutral-900">Keep growing!</p>
                <p className="text-xs text-neutral-500 font-medium">Check back daily for new AI insights tailored for you.</p>
              </div>
           </div>
           <button className="px-8 py-3 rounded-xl border border-neutral-200 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
             Remind Me Tomorrow
           </button>
        </div>

      </main>
    </div>
  );
}

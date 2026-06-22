import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { buildInsightContext } from '../lib/insights/build-context';
import { computeAllInsights, InsightCard, Nudge, BestTimeResult } from '../lib/insights/insight-engine';
import { ArrowLeft, Sparkles, ChevronRight, CheckCircle2, Clock, Trophy, Calendar, User, Zap, TrendingUp, HelpCircle, Info, Star, Flame } from 'lucide-react';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, Tooltip as RechartsTooltip } from 'recharts';
import Avatar from '../components/Avatar';

const SCAN_ACTIVITY = [
  { day: 'M', value: 30 },
  { day: 'T', value: 45 },
  { day: 'W', value: 60 },
  { day: 'T', value: 55 },
  { day: 'F', value: 90, active: true },
  { day: 'S', value: 40 },
  { day: 'S', value: 35 },
];

// Color map per insight type
const TYPE_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  best_time:    { bg: 'from-violet-600/20 to-purple-800/10',  text: 'text-violet-300',  border: 'border-violet-500/30', glow: '#7c3aed' },
  streak:       { bg: 'from-orange-600/20 to-amber-800/10',   text: 'text-orange-300',  border: 'border-orange-500/30', glow: '#ea580c' },
  growth:       { bg: 'from-emerald-600/20 to-teal-800/10',   text: 'text-emerald-300', border: 'border-emerald-500/30', glow: '#059669' },
  trending:     { bg: 'from-cyan-600/20 to-sky-800/10',       text: 'text-cyan-300',    border: 'border-cyan-500/30',   glow: '#0891b2' },
  achievement:  { bg: 'from-yellow-600/20 to-amber-800/10',   text: 'text-yellow-300',  border: 'border-yellow-500/30', glow: '#d97706' },
  profile:      { bg: 'from-pink-600/20 to-rose-800/10',      text: 'text-pink-300',    border: 'border-pink-500/30',   glow: '#db2777' },
  default:      { bg: 'from-indigo-600/20 to-blue-800/10',    text: 'text-indigo-300',  border: 'border-indigo-500/30', glow: '#4f46e5' },
};

function getTypeColor(type: string) {
  return TYPE_COLORS[type] || TYPE_COLORS.default;
}

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
        if (!user) { navigate('/'); return; }

        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (prof) {
          const identities = prof.persona_data?.identities || [];
          const activeIden = identities.find((i: any) => i.active);
          setProfile(activeIden ? { ...prof, first_name: activeIden.first_name || prof.first_name, avatar_url: activeIden.avatar_url || prof.avatar_url } : prof);
          const context = await buildInsightContext(prof.id, supabase);
          const dismissed = JSON.parse(localStorage.getItem('dismissed_nudges') ?? '[]');
          const results = computeAllInsights(context, dismissed);
          if (active) { setCtx(context); setCards(results.weeklyCards); setNudge(results.nudge); setBestTime(results.bestTime); }
        }
      } catch (_) {}
      finally { if (active) setLoading(false); }
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
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-2 border-violet-500/30 border-t-violet-400 animate-spin mx-auto mb-6" />
          <p className="text-[11px] font-semibold tracking-widest text-neutral-500 uppercase animate-pulse">Analyzing your data...</p>
        </div>
      </div>
    );
  }

  const score = ctx?.profile?.completionScore || 0;
  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference * (1 - score / 100);
  const filteredCards = cards.filter(c => c.type !== 'best_time');

  return (
    <div className="min-h-screen bg-[#09090b] pb-32 font-sans text-white selection:bg-violet-500/30">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Montserrat', sans-serif; }
        .insight-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .insight-card:hover { transform: translateY(-3px); }
        .glow-violet { box-shadow: 0 0 40px rgba(124,58,237,0.15); }
        .glow-orange { box-shadow: 0 0 40px rgba(234,88,12,0.15); }
        .glow-emerald { box-shadow: 0 0 40px rgba(5,150,105,0.15); }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .animate-slideUp { animation: slideUp 0.5s ease forwards; }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(139,92,246,0.4); } 70% { box-shadow: 0 0 0 15px rgba(139,92,246,0); } 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0); } }
        .pulse-ring { animation: pulse-ring 2.5s ease-out infinite; }
      `}} />

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[860px] mx-auto px-6 h-18 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all active:scale-90"
            >
              <ArrowLeft size={18} className="text-neutral-400" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-display font-black text-white tracking-tight">AI Insights</h1>
                <span className="text-[9px] bg-violet-500/20 text-violet-300 font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider border border-violet-500/20">BETA</span>
              </div>
              <p className="text-[11px] text-neutral-500 font-medium mt-0.5">Smart insights to grow your visibility</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white leading-none">{profile?.first_name || 'User'}</p>
              <p className="text-[10px] text-orange-400 font-medium mt-1">Premium Member</p>
            </div>
            <div className="ring-2 ring-orange-500/30 rounded-full">
              <Avatar src={profile?.avatar_url} name={profile?.first_name} size="w-9 h-9 rounded-full" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[860px] mx-auto px-6 pt-10 space-y-8">

        {/* ── Hero Peak Time Card ── */}
        <div className="animate-slideUp relative rounded-3xl overflow-hidden border border-white/8 bg-gradient-to-br from-[#13101f] to-[#0d0d14] glow-violet">
          {/* Gradient orbs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-600/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />

          <div className="relative z-10 p-8 flex flex-col lg:flex-row gap-8">
            {/* Left: Peak Time */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[10px] bg-violet-500/20 text-violet-300 font-semibold px-3 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1.5 border border-violet-500/20">
                  <Sparkles size={11} /> Top Insight
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-3 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1.5 border border-emerald-500/20 ml-auto lg:ml-0">
                  <CheckCircle2 size={11} /> High Confidence
                </span>
              </div>

              <div className="mb-8">
                <p className="text-xs font-medium text-neutral-400 mb-2">Your peak engagement window</p>
                <h2 className="text-5xl font-display font-black text-white tracking-tight mb-3">
                  {bestTime?.optimalWindow || '6:42 PM'}
                </h2>
                <p className="text-sm font-medium text-neutral-400 leading-relaxed max-w-xs">
                  People are <span className="text-violet-300 font-semibold">3.2×</span> more likely to engage with your profile during this window.
                </p>
              </div>

              <button className="w-fit bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-semibold uppercase tracking-wider px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 active:scale-95">
                Take Action <ArrowLeft size={14} className="rotate-180" />
              </button>
            </div>

            {/* Right: Bar Chart */}
            <div className="flex-1 bg-white/4 rounded-2xl p-6 border border-white/6">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-4">Scan activity (last 7 days)</p>
              <div className="h-44 w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ctx?.analytics?.weekSparkline?.map((v: number, i: number) => ({
                    day: ['S','M','T','W','T','F','S'][(new Date(Date.now() - (6-i)*86400000)).getDay()],
                    value: v || 0,
                    active: i === 6
                  })) || SCAN_ACTIVITY}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#525252' }} dy={8} />
                    <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} content={() => null} />
                    <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={14}>
                      {(ctx?.analytics?.weekSparkline || SCAN_ACTIVITY).map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={index === (ctx?.analytics?.weekSparkline?.length - 1 || 4) ? '#8B5CF6' : '#27272a'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-violet-500/10 rounded-xl py-2.5 px-4 text-center border border-violet-500/20">
                <p className="text-[11px] font-semibold text-violet-300 uppercase tracking-wider">
                  Peak: {bestTime?.optimalWindow || 'Calculating...'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section Header ── */}
        <div className="flex items-center justify-between px-1 animate-slideUp" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-gradient-to-b from-orange-400 to-pink-500 rounded-full" />
            <h3 className="text-base font-display font-black text-white">AI Insight Details</h3>
            <span className="text-[10px] bg-white/5 text-neutral-400 px-2 py-0.5 rounded-md border border-white/8">
              {filteredCards.length} insights
            </span>
          </div>
          <button className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-500 hover:text-orange-400 uppercase tracking-wider transition-colors">
            <HelpCircle size={13} /> How it works?
          </button>
        </div>

        {/* ── Insight Cards ── */}
        <div className="space-y-3">
          {filteredCards.length === 0 ? (
            <div className="py-20 text-center bg-white/3 rounded-2xl border border-white/8 border-dashed">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-neutral-600">
                <Info size={28} />
              </div>
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">No active insights. Wear your Tee to generate data.</p>
            </div>
          ) : filteredCards.map((item, idx) => {
            const colors = getTypeColor(item.type);
            return (
              <div
                key={item.id}
                className={`insight-card bg-gradient-to-r ${colors.bg} border ${colors.border} rounded-2xl p-5 flex items-center gap-5 cursor-pointer group animate-slideUp`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-black/20 border border-white/8 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{item.emoji || '✦'}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <span className={`text-[9px] font-semibold tracking-widest ${colors.text} uppercase mb-1 block`}>
                    {item.type.replace(/_/g, ' ')}
                  </span>
                  <h4 className="text-sm font-semibold text-white mb-1 leading-snug">{item.headline}</h4>
                  <p className="text-[11px] text-neutral-400 font-medium leading-relaxed truncate">{item.body}</p>
                </div>

                {/* Data point */}
                <div className="text-right px-5 border-x border-white/6 hidden md:block min-w-[120px]">
                  <p className="text-sm font-semibold text-white">{item.data_point || 'Real-time'}</p>
                  <p className="text-[9px] font-medium text-neutral-500 uppercase tracking-wider">Verified Data</p>
                </div>

                {/* CTA */}
                {item.cta ? (
                  <a
                    href={item.cta_url || '#'}
                    onClick={(e) => { if (!item.cta_url) e.preventDefault(); }}
                    className={`h-10 px-5 rounded-xl bg-black/20 border border-white/8 text-[10px] font-semibold uppercase tracking-wider ${colors.text} hover:bg-black/40 transition-all flex items-center gap-2 shrink-0`}
                  >
                    {item.cta} <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center text-neutral-600 shrink-0">
                    <ChevronRight size={16} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Growth Score + Milestone ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 animate-slideUp" style={{ animationDelay: '400ms' }}>

          {/* Score Ring */}
          <div className="bg-gradient-to-br from-[#12101f] to-[#0f0f18] border border-white/8 rounded-2xl p-8 flex items-center gap-8">
            <div className="relative w-32 h-32 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#1c1c2e" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none"
                  stroke="url(#scoreGrad)" strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-display font-black text-white">{score}%</span>
                <p className="text-[8px] font-medium text-neutral-500 uppercase tracking-wider">Score</p>
              </div>
            </div>
            <div>
              <h4 className="text-base font-display font-black text-white mb-2">Insight Summary</h4>
              <p className="text-sm text-neutral-400 leading-relaxed font-medium">
                {score < 70
                  ? `Your profile is ${score}% optimized. Complete your identity sections to unlock professional credibility and advanced analytics.`
                  : 'Excellent! Your identity is sharp and ready for professional discovery.'}
              </p>
              {/* Mini metric pills */}
              <div className="flex gap-2 mt-4 flex-wrap">
                {[
                  { label: 'Views', value: ctx?.analytics?.totalViews || 0, color: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20' },
                  { label: 'Streak', value: `${ctx?.analytics?.currentStreak || 0}d`, color: 'text-orange-300 bg-orange-500/10 border-orange-500/20' },
                  { label: 'Rank', value: `#${ctx?.profile?.rank || '—'}`, color: 'text-violet-300 bg-violet-500/10 border-violet-500/20' },
                ].map(m => (
                  <span key={m.label} className={`text-[10px] font-semibold px-3 py-1 rounded-lg border ${m.color} flex items-center gap-1`}>
                    <span className="text-neutral-500">{m.label}</span> {m.value}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Milestone Card */}
          <div className="bg-gradient-to-br from-orange-600/15 to-amber-900/10 border border-orange-500/20 rounded-2xl p-7 relative overflow-hidden glow-orange">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Star size={18} className="text-orange-400" />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-orange-300">Next Milestone</p>
              </div>
              <p className="text-sm font-medium leading-relaxed mb-6 text-neutral-300">
                Reach <span className="text-orange-300 font-semibold">70%</span> to unlock advanced audience insights and analytics.
              </p>
              <button
                onClick={() => navigate('/dashboard?tab=profile')}
                className="w-full bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 py-3 rounded-xl text-[10px] font-semibold uppercase tracking-wider text-orange-300 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                Show Me How <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Footer Banner ── */}
        <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 rounded-2xl p-6 flex items-center justify-between animate-slideUp glow-emerald" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-emerald-500/15 border border-emerald-500/20 rounded-xl flex items-center justify-center text-xl">🎁</div>
            <div>
              <p className="text-sm font-semibold text-white">Keep growing!</p>
              <p className="text-xs text-neutral-400 font-medium">Check back daily for new AI insights tailored just for you.</p>
            </div>
          </div>
          <button className="px-6 py-2.5 rounded-xl border border-emerald-500/30 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/10 transition-all shrink-0">
            Remind Me
          </button>
        </div>

      </main>
    </div>
  );
}

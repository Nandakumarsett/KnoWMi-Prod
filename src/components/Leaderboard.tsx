import React, { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import {
  Search, Trophy, Users, Activity, Clock,
  TrendingUp, TrendingDown, Share2,
  X, Copy, Eye, Sparkles, Star, Download, Medal, Crown, Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Trie } from '../lib/leaderboard/trie';

interface Profile {
  id: string;
  rank: number;
  knowmi_score: number;
  percentile: number;
  badge: string | null;
  rank_delta: number;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  wm_code: string;
  secure_slug: string;
  profile_category: string;
  updated_at?: string;
}

interface Stats {
  totalProfiles: number;
  avgScore: number;
  lastUpdated: string;
}

const CATEGORIES = ['All', 'Professional', 'Creator', 'Business'];

const RANK_MEDALS = [
  { rank: 1, icon: Crown, color: '#FFD700', glow: 'shadow-[0_0_40px_#FFD70066]', bg: 'from-amber-400 to-yellow-600', label: 'Champion' },
  { rank: 2, icon: Medal, color: '#C0C0C0', glow: 'shadow-[0_0_30px_#C0C0C044]', bg: 'from-slate-300 to-slate-500', label: 'Runner Up' },
  { rank: 3, icon: Medal, color: '#CD7F32', glow: 'shadow-[0_0_30px_#CD7F3244]', bg: 'from-orange-400 to-orange-700', label: '3rd Place' },
];

const BadgePill = ({ badge }: { badge: string | null }) => {
  if (!badge) return null;
  const styles: Record<string, string> = {
    top1:    'bg-amber-500/20 text-amber-300 border-amber-500/30',
    top1pct: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    top10pct:'bg-teal-500/20 text-teal-300 border-teal-500/30',
    top100:  'bg-white/10 text-white/70 border-white/20',
  };
  const labels: Record<string, string> = {
    top1: '👑 Global #1',
    top1pct: '⚡ Top 1%',
    top10pct: '🔥 Top 10%',
    top100: '⭐ Top 100',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${styles[badge] || styles.top100}`}>
      {labels[badge] || '⭐ Top Member'}
    </span>
  );
};

const BadgePillLight = ({ badge }: { badge: string | null }) => {
  if (!badge) return null;
  const styles: Record<string, string> = {
    top1:    'bg-amber-100 text-amber-700 border-amber-300',
    top1pct: 'bg-purple-100 text-purple-700 border-purple-300',
    top10pct:'bg-teal-100 text-teal-700 border-teal-300',
    top100:  'bg-neutral-100 text-neutral-600 border-neutral-200',
  };
  const labels: Record<string, string> = {
    top1: '👑 Global #1',
    top1pct: '⚡ Top 1%',
    top10pct: '🔥 Top 10%',
    top100: '⭐ Top 100',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${styles[badge] || styles.top100}`}>
      {labels[badge] || '⭐ Top Member'}
    </span>
  );
};

export default function Leaderboard() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [stats, setStats] = useState<Stats>({ totalProfiles: 0, avgScore: 0, lastUpdated: new Date().toISOString() });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [shareProfile, setShareProfile] = useState<Profile | null>(null);

  useEffect(() => {
    document.title = 'KnoWMi Elite | Global Rankings';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'See where you stand in the KnoWMi global rankings. Scan more, connect better, and climb the Elite leaderboard.');
    document.body.classList.add('page-loaded');
    return () => document.body.classList.remove('page-loaded');
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: profilesData } = await supabase.from('public_leaderboard').select('*').limit(100);
        const { count } = await supabase.from('profile_scores').select('*', { count: 'exact', head: true });
        const { data: scoreData } = await supabase.from('profile_scores').select('knowmi_score');
        const avg = scoreData?.length ? scoreData.reduce((acc, curr) => acc + Number(curr.knowmi_score), 0) / scoreData.length : 0;
        if (profilesData) setProfiles(profilesData);
        setStats({
          totalProfiles: count || 0,
          avgScore: Math.round(avg * 10) / 10,
          lastUpdated: profilesData?.[0]?.updated_at || new Date().toISOString()
        });
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
        toast.error('Failed to load leaderboard data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const trie = useMemo(() => {
    const t = new Trie();
    profiles.forEach(p => {
      t.insert(p.display_name, p.username);
      t.insert(p.username, p.username);
    });
    return t;
  }, [profiles]);

  const filteredProfiles = useMemo(() => {
    let result = profiles;
    if (category !== 'All') result = result.filter(p => p.profile_category?.toLowerCase() === category.toLowerCase());
    if (search) {
      const searchResults = trie.search(search);
      const matchUsernames = searchResults.map(res => res.id);
      result = result.filter(p => matchUsernames.includes(p.username));
    }
    return result;
  }, [search, category, profiles, trie]);

  // Sort podium: show rank 2, 1, 3 (visual podium order)
  const podiumData = filteredProfiles.filter(p => p.rank <= 3);
  const podiumOrder = [
    podiumData.find(p => p.rank === 2),
    podiumData.find(p => p.rank === 1),
    podiumData.find(p => p.rank === 3),
  ].filter(Boolean) as Profile[];

  const tableRows = filteredProfiles.filter(p => p.rank > 3);

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const [shareStats, setShareStats] = useState<{ scans: number; views: number; connections: number } | null>(null);

  useEffect(() => {
    if (!shareProfile) { setShareStats(null); return; }
    async function fetchDetailedStats() {
      try {
        const { count: scanCount } = await supabase.from('qr_scan_events').select('*', { count: 'exact', head: true }).eq('profile_id', shareProfile!.id);
        const { data: viewData } = await supabase.from('profile_view_daily').select('total_views').eq('profile_id', shareProfile!.id);
        const totalViews = viewData?.reduce((sum, day) => sum + (day.total_views || 0), 0) || 0;
        setShareStats({ scans: scanCount || 0, views: totalViews || 0, connections: Math.max(Math.ceil((scanCount || 0) * 1.5), 1) });
      } catch (err) {
        console.error('Share stats fetch error:', err);
      }
    }
    fetchDetailedStats();
  }, [shareProfile]);

  if (loading) return (
    <div className="min-h-screen bg-[#080B14] flex flex-col items-center justify-center p-10">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-orange-500/30 border-t-orange-500 animate-spin" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-b-teal-400 animate-spin animation-delay-300" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
      <p className="text-sm font-black text-orange-400 uppercase tracking-widest animate-pulse">Calculating Global Ranks...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080B14] pb-32 font-sans" style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}>
      {/* Header */}
      <header className="h-20 bg-[#0D1117]/80 backdrop-blur-xl border-b border-white/5 flex items-center px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex flex-col">
            <a href="/" className="font-black text-2xl tracking-tight text-white hover:text-orange-400 transition-colors">
              Kno<span className="text-orange-500">WM</span>i <span className="text-white/30 font-light text-xl">| Leaderboard</span>
            </a>
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] leading-none mt-1">Scan Me. Know Me.</p>
          </div>
          <a href="/dashboard" className="text-xs font-bold text-white/40 hover:text-white transition-colors flex items-center gap-2">
            ← Back to Dashboard
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Users, label: 'Global Profiles', value: stats.totalProfiles.toLocaleString(), color: 'text-orange-400', bg: 'from-orange-500/20 to-orange-600/5', border: 'border-orange-500/20' },
            { icon: Activity, label: 'Avg KnoWMi Score', value: stats.avgScore.toString(), color: 'text-teal-400', bg: 'from-teal-500/20 to-teal-600/5', border: 'border-teal-500/20' },
            { icon: Clock, label: 'Last Updated', value: formatTime(stats.lastUpdated), color: 'text-violet-400', bg: 'from-violet-500/20 to-violet-600/5', border: 'border-violet-500/20' },
          ].map(({ icon: Icon, label, value, color, bg, border }) => (
            <div key={label} className={`bg-gradient-to-br ${bg} border ${border} rounded-2xl p-5 flex items-center gap-4 backdrop-blur-sm`}>
              <div className={`w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center ${color}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-0.5">{label}</p>
                <p className={`text-2xl font-black ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Title + Search/Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                <Trophy size={16} className="text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Kno<span className="text-orange-400">WM</span>i <span className="text-orange-400">Elite</span>
              </h1>
            </div>
            <p className="text-white/40 text-sm font-medium ml-11">Top profiles ranked by KnoWMi score</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group flex-1 sm:w-60">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-orange-400 transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search profiles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl py-2.5 pl-11 pr-4 outline-none text-white placeholder-white/30 text-sm transition-all"
              />
            </div>
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 gap-0.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                    category === cat
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Podium */}
        {podiumOrder.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <Zap size={16} className="text-amber-400" />
              <span className="text-xs font-black text-white/40 uppercase tracking-widest">Top 3 Champions</span>
            </div>
            <div className="flex flex-col md:flex-row items-end justify-center gap-4">
              {podiumOrder.map((p) => {
                const medalData = RANK_MEDALS.find(m => m.rank === p.rank);
                const isFirst = p.rank === 1;
                const MedalIcon = medalData?.icon || Medal;

                const podiumHeight = p.rank === 1 ? 'md:h-[480px]' : p.rank === 2 ? 'md:h-[400px]' : 'md:h-[360px]';
                const cardBg = p.rank === 1
                  ? 'bg-gradient-to-b from-amber-950/60 to-[#0D1117] border-amber-500/40'
                  : p.rank === 2
                  ? 'bg-gradient-to-b from-slate-800/60 to-[#0D1117] border-slate-500/30'
                  : 'bg-gradient-to-b from-orange-950/60 to-[#0D1117] border-orange-700/30';

                const rankColor = p.rank === 1 ? '#FFD700' : p.rank === 2 ? '#C0C0C0' : '#CD7F32';
                const rankLabel = p.rank === 1 ? 'Champion' : p.rank === 2 ? 'Runner Up' : '3rd Place';

                return (
                  <div
                    key={p.username}
                    onClick={() => navigate(`/p/${p.secure_slug || p.id}?src=leaderboard`)}
                    className={`relative group flex flex-col items-center rounded-3xl border ${cardBg} ${podiumHeight} w-full md:w-64 p-8 pt-14 cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl backdrop-blur-sm overflow-hidden`}
                    style={isFirst ? { boxShadow: '0 0 60px rgba(255,215,0,0.15)' } : {}}
                  >
                    {/* Background glow */}
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none"
                      style={{ backgroundColor: rankColor }}
                    />

                    {/* Rank label top */}
                    <div
                      className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                      style={{ backgroundColor: rankColor + '22', color: rankColor, border: `1px solid ${rankColor}44` }}
                    >
                      <span className="flex items-center gap-1.5">
                        <MedalIcon size={10} />
                        {rankLabel}
                      </span>
                    </div>

                    {/* Avatar */}
                    <div className="relative mb-5">
                      <div
                        className="w-20 h-20 rounded-full p-0.5"
                        style={{ background: `linear-gradient(135deg, ${rankColor}, transparent)` }}
                      >
                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#0D1117]">
                          <Avatar src={p.avatar_url} name={p.display_name} username={p.username} size={isFirst ? 'xl' : 'lg'} />
                        </div>
                      </div>
                      {/* Rank badge */}
                      <div
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs border-2 border-[#0D1117]"
                        style={{ backgroundColor: rankColor, color: '#000' }}
                      >
                        #{p.rank}
                      </div>
                    </div>

                    {/* Identity */}
                    <div className="text-center mb-4 flex-1 flex flex-col items-center">
                      <h3 className="text-lg font-black text-white line-clamp-1 tracking-tight mb-0.5">{p.display_name}</h3>
                      <p className="text-xs font-bold text-white/40">@{p.username}</p>
                      <div className="mt-2">
                        <BadgePill badge={p.badge} />
                      </div>
                    </div>

                    {/* Score */}
                    <div className="w-full rounded-2xl p-4 border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-between mt-auto">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Score</p>
                        <p className="text-2xl font-black" style={{ color: rankColor }}>{p.knowmi_score}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Percentile</p>
                        <p className="text-sm font-black text-white">{p.percentile ? `${p.percentile}%` : '—'}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredProfiles.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-white/20 font-black text-xl">No profiles found</p>
            <p className="text-white/10 text-sm mt-2">Try a different search or category</p>
          </div>
        )}

        {/* Ranks 4+ List */}
        {tableRows.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Star size={14} className="text-white/30" />
              <span className="text-xs font-black text-white/30 uppercase tracking-widest">Rising Stars — Rank #4 and beyond</span>
            </div>
            <div className="space-y-3">
              {tableRows.map((p) => (
                <div
                  key={p.username}
                  onClick={() => navigate(`/p/${p.secure_slug || p.id}?src=leaderboard`)}
                  className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-orange-500/30 p-4 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/5"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    {/* Rank Badge */}
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-white/5 border border-white/10 text-white font-black text-sm flex items-center justify-center group-hover:border-orange-500/40 group-hover:text-orange-400 transition-colors">
                      #{p.rank}
                    </div>
                    {/* Identity */}
                    <div className="flex items-center gap-3">
                      <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-orange-500/20 to-teal-500/20 border border-white/10 group-hover:border-orange-500/30 transition-colors">
                        <Avatar src={p.avatar_url} name={p.display_name} username={p.username} size="md" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white leading-tight">{p.display_name}</h4>
                        <div className="flex items-center gap-2 flex-wrap mt-0.5">
                          <span className="text-xs font-bold text-white/40">@{p.username}</span>
                          <BadgePill badge={p.badge} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                    <div className="flex items-center gap-6 sm:gap-10">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Elite Score</p>
                        <div className="flex items-end gap-2">
                          <span className="text-xl font-black text-teal-400">{p.knowmi_score}</span>
                          <div className="h-1 w-16 bg-white/5 rounded-full overflow-hidden mb-1.5 hidden sm:block">
                            <div
                              className="h-full bg-gradient-to-r from-teal-500 to-teal-300 rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min((p.knowmi_score / 500) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">Trend</p>
                        <div className={`flex items-center gap-1 font-black text-sm ${p.rank_delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {p.rank_delta >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          <span>{p.rank_delta === 0 ? 'Steady' : (p.rank_delta > 0 ? '+' : '') + Math.abs(p.rank_delta)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShareProfile(p); }}
                        className="p-2.5 text-white/30 hover:text-orange-400 hover:bg-orange-500/10 rounded-xl transition-all"
                        title="Share profile"
                      >
                        <Share2 size={16} />
                      </button>
                      <a
                        href={`/p/${p.secure_slug || p.id}?src=leaderboard`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2.5 text-white/30 hover:text-teal-400 hover:bg-teal-500/10 rounded-xl transition-all"
                        title="View profile"
                      >
                        <Eye size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Share Modal */}
      {shareProfile && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setShareProfile(null)}
        >
          <div
            className="bg-[#0D1117] rounded-3xl w-full max-w-md overflow-hidden border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-white">Elite Achievement Card</h2>
                <p className="text-xs text-white/40 font-medium mt-0.5">Share this profile's global ranking</p>
              </div>
              <button
                onClick={() => setShareProfile(null)}
                className="p-2 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Achievement Card Preview */}
            <div className="p-6 bg-[#080B14]">
              <div className="rounded-2xl overflow-hidden border border-white/10" style={{ background: 'linear-gradient(135deg, #0F1729 0%, #080B14 50%, #1A0A1F 100%)' }}>
                {/* Card top */}
                <div className="p-6 pb-4 relative overflow-hidden">
                  {/* Background orbs */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-600/20 rounded-full blur-3xl -ml-10 pointer-events-none" />

                  {/* Brand + badge */}
                  <div className="relative z-10 flex justify-between items-start mb-6">
                    <div>
                      <h1 className="font-black text-2xl tracking-tighter text-white">
                        Kno<span className="text-orange-500">WM</span>i
                      </h1>
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mt-0.5">Verified Identity</p>
                    </div>
                    <div className="bg-orange-500/20 border border-orange-500/30 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Sparkles size={12} className="text-orange-400" />
                      <span className="text-[10px] font-black text-orange-300 uppercase">Elite</span>
                    </div>
                  </div>

                  {/* Rank Display */}
                  <div className="relative z-10 mb-5">
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Global Rank</p>
                    <p className="text-5xl font-black text-white leading-none">#{shareProfile.rank}</p>
                  </div>

                  {/* Identity */}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500/30 shrink-0">
                      <Avatar src={shareProfile.avatar_url} name={shareProfile.display_name} username={shareProfile.username} size="md" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white leading-tight">{shareProfile.display_name}</h3>
                      <p className="text-xs font-bold text-white/50">@{shareProfile.username}</p>
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 border-t border-white/5">
                  {[
                    { label: 'Score', value: shareProfile.knowmi_score.toString(), color: 'text-orange-400' },
                    { label: 'Views', value: shareStats?.views.toLocaleString() || '...', color: 'text-teal-400' },
                    { label: 'Scans', value: shareStats?.scans.toLocaleString() || '...', color: 'text-violet-400' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="p-4 text-center border-r border-white/5 last:border-r-0">
                      <p className={`text-xl font-black ${color}`}>{value}</p>
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-wider mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 pt-0 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  const slug = shareProfile.secure_slug || shareProfile.id;
                  const link = `${window.location.origin}/p/${slug}?src=leaderboard_share`;
                  navigator.clipboard.writeText(link);
                  toast.success('Share link copied!');
                }}
                className="flex items-center justify-center gap-2 py-3.5 bg-white/10 hover:bg-white/15 text-white rounded-2xl font-black text-sm transition-all border border-white/10 hover:border-white/20 active:scale-95"
              >
                <Copy size={16} /> Copy Link
              </button>
              <button
                onClick={() => toast('Download coming soon!', { icon: '⏳' })}
                className="flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-400 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-orange-500/30 active:scale-95"
              >
                <Download size={16} /> Save Poster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

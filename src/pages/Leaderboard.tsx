import React, { useState, useMemo, useEffect } from 'react';
import Avatar from '../components/Avatar';
import {
  Search, Trophy, Users, Activity, Clock,
  TrendingUp, TrendingDown, Minus, Share2,
  X, Copy, Linkedin, Eye, Sparkles, QrCode, Star, Download, Flame, MapPin, Medal, Globe
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Trie } from '../lib/leaderboard/trie';
import { getAnalyticsData } from '../lib/analytics/data-source';

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

const BadgePill = ({ badge }: { badge: string | null }) => {
  if (!badge) return null;
  const styles: Record<string, string> = {
    top1: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    top1pct: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    top10pct: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    top100: 'bg-white/10 text-white border-white/20',
  };
  const labels: Record<string, string> = {
    top1: 'Global #1',
    top1pct: 'Top 1%',
    top10pct: 'Top 10%',
    top100: 'Top 100',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[badge] || styles.top100}`}>
      {labels[badge] || 'Top Member'}
    </span>
  );
};

export default function Leaderboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [stats, setStats] = useState<Stats>({ totalProfiles: 0, avgScore: 0, lastUpdated: new Date().toISOString() });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [shareProfile, setShareProfile] = useState<Profile | null>(null);

  useEffect(() => {
    document.title = 'KnoWMi Elite | Global Rankings';
    const timer = setTimeout(() => {
      document.body.classList.add('page-loaded');
    }, 100);
    return () => document.body.classList.remove('page-loaded');
  }, []);

  useEffect(() => {
    async function fetchData() {
      // Fetch up to 1000 profiles so that Search and Category filters can find users outside the top 10
      const { data: profilesData } = await supabase.from('public_leaderboard').select('*').limit(1000);
      const { count } = await supabase.from('profile_scores').select('*', { count: 'exact', head: true });
      const { data: scoreData } = await supabase.from('profile_scores').select('knowmi_score');

      const avg = scoreData?.length ? scoreData.reduce((acc, curr) => acc + Number(curr.knowmi_score), 0) / scoreData.length : 0;

      if (profilesData) {
        const usernames = profilesData.map(p => p.username).filter(Boolean);
        const { data: slugData } = await supabase
          .from('public_profiles')
          .select('id, first_name, secure_slug')
          .in('first_name', usernames);

        const mapped = profilesData.map(p => {
          const extra = slugData?.find(s => s.first_name === p.username);
          return {
            ...p,
            id: extra?.id || p.id,
            secure_slug: extra?.secure_slug || p.secure_slug
          };
        });

        setProfiles(mapped);
      }

      setStats({
        totalProfiles: count || 0,
        avgScore: Math.round(avg * 10) / 10,
        lastUpdated: 'Live' // Since the view counts from raw events, it is real-time
      });
      setLoading(false);
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
    // Filter out legacy dummy profiles (like gamer, fitness, developer, student, etc.)
    const legacyCategories = ['dev', 'developer', 'student', 'gamer', 'gaming', 'fitness', 'gym', 'chef', 'musician', 'athlete', 'sports', 'education', 'coder', 'tech'];
    let result = profiles.filter(p => !legacyCategories.includes(p.profile_category?.toLowerCase() || ''));

    if (category !== 'All') result = result.filter(p => p.profile_category?.toLowerCase() === category.toLowerCase());
    if (search) {
      const searchResults = trie.search(search);
      const matchUsernames = searchResults.map(res => res.id);
      result = result.filter(p => matchUsernames.includes(p.username));
    }
    return result;
  }, [search, category, profiles, trie]);

  // If searching or filtering, show all matches. Otherwise, strictly limit to Top 10 as requested.
  const displayLimit = (search || category !== 'All') ? filteredProfiles.length : 10;
  const top10Profiles = filteredProfiles.slice(0, displayLimit);

  const podium = top10Profiles.filter(p => p.rank <= 3).sort((a, b) => {
    if (a.rank === 1) return 0;
    if (b.rank === 1) return 1;
    return a.rank === 2 ? -1 : 1;
  });

  const tableRows = top10Profiles.filter(p => p.rank > 3);

  const formatTime = (iso) => {
    if (iso === 'Live') return 'Real-time';
    if (!iso) return '---';
    const date = new Date(iso);
    if (isNaN(date.getTime())) return '---';
    
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    
    if (mins < 1) return 'Just Now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const [shareStats, setShareStats] = useState<any>(null);

  useEffect(() => {
    if (!shareProfile) {
      setShareStats(null);
      return;
    }
    async function fetchDetailedStats() {
      try {
        const data = await getAnalyticsData(shareProfile.id, 'all');
        setShareStats(data);
      } catch (err) {
        console.error('Share stats fetch error:', err);
      }
    }
    fetchDetailedStats();
  }, [shareProfile]);

  if (loading) return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-10 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mb-4 relative z-10" />
      <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest animate-pulse relative z-10">Calculating Global Ranks...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pb-32 font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />
      
      <header className="h-20 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5 flex items-center px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex flex-col">
            <a href="/" className="font-display text-2xl tracking-tight text-white hover:text-orange-500 transition-colors">KnoWMi <span className="text-neutral-500 font-light text-xl">| Leaderboard</span></a>
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] leading-none mt-1">Scan Me. Know Me.</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/dashboard" className="text-xs font-bold text-neutral-400 hover:text-white transition-colors">← Back to Dashboard</a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl flex items-center gap-4 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400"><Users size={24} /></div>
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Global Profiles</p>
              <p className="text-2xl font-black text-white">{stats.totalProfiles.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl flex items-center gap-4 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center text-teal-400"><Activity size={24} /></div>
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Avg Total Views</p>
              <p className="text-2xl font-black text-white">{stats.avgScore}</p>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl flex items-center gap-4 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400"><Clock size={24} /></div>
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Last Updated</p>
              <p className="text-2xl font-black text-blue-400">{formatTime(stats.lastUpdated)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
             <span>Kno<span className="text-orange-500">WM</span>i</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Elite</span>
             <Sparkles className="text-orange-500" size={28} />
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group flex-1 sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-orange-500 focus:bg-white/10 text-white shadow-sm transition-all placeholder:text-neutral-600"
              />
            </div>
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 shadow-sm backdrop-blur-md">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${category === cat ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {podium.length > 0 && (
          <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-24 px-4">
            {podium.map((p) => {
              const isFirst = p.rank === 1;
              const isSecond = p.rank === 2;
              return (
                <div
                  key={p.username}
                  onClick={() => {
                    const slug = p.secure_slug || p.id;
                    window.location.href = `/p/${slug}?src=leaderboard`;
                  }}
                  className={`relative group flex flex-col items-center pt-16 pb-10 px-8 rounded-[3rem] border transition-all duration-500 cursor-pointer shadow-2xl hover:-translate-y-2 w-full md:w-72 backdrop-blur-xl ${isFirst ? 'bg-white/10 border-orange-500/50 shadow-orange-500/20 md:h-[520px] z-20' : 'bg-white/5 border-white/10 md:h-[440px] z-10'}`}
                >
                  {isFirst && <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent rounded-[3rem] pointer-events-none" />}
                  <div className={`relative p-1.5 rounded-full mb-8 transition-transform duration-500 group-hover:scale-110 shadow-lg ${isFirst ? 'bg-gradient-to-tr from-orange-400 via-amber-300 to-orange-500 shadow-orange-500/50' : isSecond ? 'bg-gradient-to-tr from-slate-300 to-slate-500' : 'bg-gradient-to-tr from-orange-800 to-orange-900'}`}>
                    <div className="rounded-full border-4 border-[#0A0A0B] overflow-hidden bg-[#0A0A0B]">
                      <Avatar src={p.avatar_url} name={p.display_name} username={p.username} size={isFirst ? "xl" : "lg"} />
                    </div>
                    {isFirst && (
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white border-4 border-[#0A0A0B] shadow-lg">
                        <Trophy size={18} />
                      </div>
                    )}
                  </div>
                  <div className="text-center mb-8 flex-1 relative z-10">
                    <h3 className="text-2xl font-black text-white line-clamp-1 mb-1 tracking-tight">{p.display_name}</h3>
                    <p className="text-sm font-bold text-neutral-400 mb-3">@{p.username}</p>
                    <div className={`inline-block px-4 py-1.5 rounded-full shadow-md font-black text-[10px] uppercase tracking-widest text-white mb-3 ${isFirst ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-orange-500/20' : isSecond ? 'bg-white/20' : 'bg-white/10'}`}>
                      Global Rank #{p.rank}
                    </div>
                    <div className="flex justify-center">
                      <BadgePill badge={p.badge} />
                    </div>
                  </div>
                  <div className={`w-full rounded-[2rem] p-5 flex items-center justify-between border relative z-10 ${isFirst ? 'border-orange-500/30 bg-orange-500/10' : 'border-white/5 bg-black/20'}`}>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Total Views</span>
                      <span className={`text-3xl font-black ${isFirst ? 'text-orange-400' : 'text-white'}`}>{p.knowmi_score}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Trend</span>
                      <div className={`flex items-center gap-1 font-bold text-sm ${p.rank_delta >= 0 ? (isFirst ? 'text-orange-400' : 'text-teal-400') : 'text-rose-400'}`}>
                        {p.rank_delta >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span>{p.rank_delta === 0 ? 'Steady' : `${p.rank_delta > 0 ? '+' : ''}${p.rank_delta}%`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Ranks 4+ List (Horizontal Scrolling) */}
        <div className="flex overflow-x-auto gap-6 pb-8 mb-24 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {tableRows.map((p) => (
            <div
              key={p.username}
              onClick={() => {
                const slug = p.secure_slug || p.id;
                window.location.href = `/p/${slug}?src=leaderboard`;
              }}
              className="group min-w-[280px] w-[280px] flex-shrink-0 snap-start bg-white/5 backdrop-blur-sm hover:bg-white/10 p-6 rounded-[2.5rem] border border-white/5 shadow-sm transition-all duration-300 cursor-pointer flex flex-col items-center gap-6 hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-500/30 hover:-translate-y-1"
            >
              <div className="w-full flex justify-between items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-black text-sm shadow-lg group-hover:bg-orange-500 transition-colors">
                  #{p.rank}
                </div>
                <BadgePill badge={p.badge} />
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative p-1 rounded-full bg-black/50 border border-white/10 group-hover:border-orange-400 transition-colors mb-4">
                  <Avatar src={p.avatar_url} name={p.display_name} username={p.username} size="md" />
                </div>
                <h4 className="text-xl font-black text-white leading-tight mb-1">{p.display_name}</h4>
                <span className="text-xs font-bold text-neutral-400">@{p.username}</span>
              </div>

              <div className="w-full border-t border-white/5 pt-5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Total Views</span>
                  <span className="text-2xl font-black text-orange-400">{p.knowmi_score}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareProfile(p);
                    }}
                    className="p-2.5 text-neutral-400 hover:text-orange-400 hover:bg-orange-500/20 rounded-2xl transition-all"
                  >
                    <Share2 size={16} />
                  </button>
                  <a 
                    href={`/p/${p.secure_slug || p.id}?src=leaderboard`} 
                    className="p-2.5 text-neutral-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-2xl transition-all"
                  >
                    <Eye size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {shareProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md transition-all duration-300">
            <div className="bg-[#0A0A0B] rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl shadow-orange-500/20 animate-in zoom-in-95 duration-300 border border-white/10">
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-2xl font-black text-white">Elite Achievement</h2>
                <button onClick={() => setShareProfile(null)} className="p-2 hover:bg-white/10 rounded-full text-neutral-400 transition-colors"><X size={24} /></button>
              </div>
              <div className="p-8">
                <div className="aspect-[4/5] bg-black rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-inner group border border-white/10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/30 rounded-full blur-[100px] -mr-32 -mt-32" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/30 rounded-full blur-[100px] -ml-32 -mb-32" />
                  <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none" />
                  <div className="relative z-10 flex justify-between items-start">
                    <div>
                      <h1 className="font-display text-3xl tracking-tighter font-black">Kno<span className="text-orange-500">WM</span>i</h1>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em]">Verified Identity</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2">
                      <Sparkles size={14} className="text-orange-400" />
                      <span className="text-xs font-black uppercase">Elite Status</span>
                    </div>
                  </div>
                  <div className="relative z-10 mt-12">
                    <p className="text-orange-500 font-black text-sm uppercase tracking-widest mb-1">Global Milestone</p>
                    <h2 className="text-6xl font-black tracking-tight leading-[0.9]">Ranked #{shareProfile.rank}</h2>
                  </div>
                  <div className="relative z-10 mt-12 flex items-center gap-5">
                    <Avatar src={shareProfile.avatar_url} name={shareProfile.display_name} username={shareProfile.username} size="lg" className="border-4 border-orange-500/30" />
                    <div>
                      <h3 className="text-3xl font-black tracking-tight">{shareProfile.display_name}</h3>
                      <p className="text-neutral-400 font-bold">@{shareProfile.username}</p>
                    </div>
                  </div>
                  <div className="relative z-10 mt-12 grid grid-cols-2 gap-4">
                    {/* Total Views */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-5 border border-white/10 flex flex-col justify-between h-32 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-center">
                        <Activity size={20} className="text-teal-400" />
                      </div>
                      <div>
                        <p className="text-3xl font-black">{shareStats?.totalViews?.toLocaleString() || '0'}</p>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Views</p>
                      </div>
                    </div>
                    
                    {/* Unique Visitors */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-5 border border-white/10 flex flex-col justify-between h-32 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-center">
                        <Users size={20} className="text-violet-400" />
                      </div>
                      <div>
                        <p className="text-3xl font-black">{shareStats?.uniqueViews?.toLocaleString() || '0'}</p>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Unique Visitors</p>
                      </div>
                    </div>

                    {/* Streak Record */}
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-5 flex flex-col justify-between h-32 shadow-lg shadow-orange-500/20">
                      <div className="flex justify-between items-center">
                        <Flame size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-3xl font-black">{shareStats?.streak?.best || '0'}</p>
                        <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Best Streak Days</p>
                      </div>
                    </div>

                    {/* Top City */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-5 border border-white/10 flex flex-col justify-between h-32 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-center">
                        <MapPin size={20} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xl font-black truncate">{shareStats?.topCities?.[0]?.city || 'Global'}</p>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-1">{shareStats?.topCities?.[0]?.flag || '🌍'} Top Location</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-10 grid grid-cols-2 gap-5">
                  <button onClick={() => {
                    const slug = shareProfile.secure_slug || shareProfile.id;
                    const fresh = `${window.location.origin}/p/${slug}?src=leaderboard_share`;
                    navigator.clipboard.writeText(fresh);
                    alert('Share link copied!');
                  }} className="flex items-center justify-center gap-3 py-5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-[2rem] font-black text-lg transition-all shadow-xl active:scale-95">
                    <Copy size={20} /> Copy Link
                  </button>
                  <button onClick={() => alert('Download coming soon!')} className="flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-[2rem] font-black text-lg transition-all shadow-xl active:scale-95">
                    <Download size={20} /> Save Poster
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

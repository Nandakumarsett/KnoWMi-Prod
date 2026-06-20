import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
  const navigate = useNavigate();
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
        // Fix: query by secure_slug not first_name
        const { data: slugData } = await supabase
          .from('public_profiles')
          .select('id, secure_slug')
          .in('secure_slug', usernames);

        const mapped = profilesData.map(p => {
          const extra = slugData?.find(s => s.secure_slug === p.username);
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
    let result = profiles;

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
  
  // Ensure profiles have ranks by sorting by score if rank is missing
  const sortedProfiles = [...filteredProfiles].sort((a, b) => (b.knowmi_score || 0) - (a.knowmi_score || 0)).map((p, i) => ({
    ...p,
    rank: p.rank || (i + 1)
  }));
  
  const top10Profiles = sortedProfiles.slice(0, displayLimit);

  const podium = top10Profiles.filter(p => p.rank <= 3).sort((a, b) => {
    if (a.rank === 1) return -1;
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
        // silently fail
      }
    }
    fetchDetailedStats();
  }, [shareProfile]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-10 relative overflow-hidden text-white">
      <div className="w-24 h-24 rounded-xl border-[4px] border-orange-500 bg-[#1a1a1a] shadow-[6px_6px_0px_#F97316] flex items-center justify-center animate-pulse mb-6">
        <Sparkles size={32} className="text-orange-500" />
      </div>
      <p className="text-sm font-black text-white uppercase tracking-widest relative z-10 border-[3px] border-white px-4 py-2 bg-[#1a1a1a] shadow-[4px_4px_0px_#fff]">Calculating Global Ranks...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-32 font-sans relative overflow-hidden">
      <header className="h-20 bg-[#0a0a0a] border-b-[4px] border-white flex items-center px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex flex-col">
            <a href="/" className="font-black text-2xl tracking-tighter text-white uppercase transition-colors flex items-center gap-2">
              KnoWMi <span className="text-orange-500 text-lg">| Leaderboard</span>
            </a>
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] leading-none mt-1">Scan Me. Know Me.</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/dashboard" className="px-4 py-2 bg-white text-black border-[3px] border-black rounded-lg text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2">
              <ArrowLeft size={14} /> Back
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#1a1a1a] p-6 rounded-xl border-[4px] border-orange-500 shadow-[8px_8px_0px_#F97316] flex items-center gap-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            <div className="w-16 h-16 rounded-xl bg-orange-500 border-[3px] border-black flex items-center justify-center text-black shadow-[3px_3px_0px_#000]"><Users size={32} /></div>
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest border-b-[2px] border-white/20 pb-1 mb-1">Global Profiles</p>
              <p className="text-4xl font-black text-orange-500 tracking-tighter">{stats.totalProfiles.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-[#1a1a1a] p-6 rounded-xl border-[4px] border-teal-400 shadow-[8px_8px_0px_#2dd4bf] flex items-center gap-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            <div className="w-16 h-16 rounded-xl bg-teal-400 border-[3px] border-black flex items-center justify-center text-black shadow-[3px_3px_0px_#000]"><Activity size={32} /></div>
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest border-b-[2px] border-white/20 pb-1 mb-1">Avg Total Views</p>
              <p className="text-4xl font-black text-teal-400 tracking-tighter">{stats.avgScore}</p>
            </div>
          </div>
          <div className="bg-[#1a1a1a] p-6 rounded-xl border-[4px] border-white shadow-[8px_8px_0px_#fff] flex items-center gap-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            <div className="w-16 h-16 rounded-xl bg-white border-[3px] border-black flex items-center justify-center text-black shadow-[3px_3px_0px_#000]"><Clock size={32} /></div>
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest border-b-[2px] border-white/20 pb-1 mb-1">Last Updated</p>
              <p className="text-2xl font-black text-white uppercase tracking-wider mt-2">{formatTime(stats.lastUpdated)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
             <span className="bg-white text-black px-4 py-1 border-[4px] border-orange-500 shadow-[4px_4px_0px_#F97316]">KnoWMi Elite</span>
             <Sparkles className="text-orange-500" size={32} />
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group flex-1 sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white" size={18} />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#1a1a1a] border-[3px] border-white rounded-xl py-3 pl-12 pr-4 outline-none focus:border-orange-500 text-white shadow-[4px_4px_0px_#fff] transition-all font-bold placeholder:text-neutral-500"
              />
            </div>
            <div className="flex bg-[#1a1a1a] p-1.5 rounded-xl border-[3px] border-white shadow-[4px_4px_0px_#fff]">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-orange-500 text-black border-[2px] border-black shadow-[2px_2px_0px_#000]' : 'text-neutral-400 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {podium.length > 0 && (
          <div className="max-w-5xl mx-auto w-full">
            <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-24 px-4 md:px-0">
              {podium.map((p) => {
                const isFirst = p.rank === 1;
                const isSecond = p.rank === 2;
                return (
                  <div
                    key={p.username}
                          onClick={() => {
                      const slug = p.secure_slug || p.id;
                      navigate(`/p/${slug}?src=leaderboard`);
                    }}
                    className={`relative group flex flex-col items-center pt-16 pb-10 px-8 rounded-xl border-[4px] border-black transition-all duration-300 cursor-pointer shadow-[8px_8px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none w-full md:w-72 bg-[#1a1a1a] z-10 ${isFirst ? 'border-orange-500 shadow-[8px_8px_0px_#F97316] h-auto md:min-h-[540px]' : 'h-auto md:min-h-[460px]'}`}
                  >
                  <div className={`relative p-2 rounded-xl mb-8 shadow-[4px_4px_0px_#000] border-[3px] border-black ${isFirst ? 'bg-orange-500' : isSecond ? 'bg-teal-400' : 'bg-white'}`}>
                    <div className="rounded-lg border-[3px] border-[#0a0a0a] overflow-hidden bg-[#0a0a0a]">
                      <Avatar src={p.avatar_url} name={p.display_name} username={p.username} size={isFirst ? "xl" : "lg"} />
                    </div>
                    {isFirst && (
                      <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-black border-[3px] border-black shadow-[3px_3px_0px_#000]">
                        <Trophy size={20} />
                      </div>
                    )}
                  </div>
                  <div className="text-center mb-8 flex-1 relative z-10">
                    <h3 className="text-2xl font-black text-white line-clamp-1 mb-1 tracking-tight uppercase">{p.display_name}</h3>
                    <p className="text-sm font-bold text-neutral-400 mb-3">@{p.username}</p>
                    <div className={`inline-block px-4 py-1.5 rounded-md font-black text-[10px] uppercase tracking-widest text-black border-[2px] border-black shadow-[2px_2px_0px_#000] mb-3 ${isFirst ? 'bg-orange-500' : isSecond ? 'bg-teal-400' : 'bg-white'}`}>
                      Global Rank #{p.rank}
                    </div>
                    <div className="flex justify-center mt-2">
                      <BadgePill badge={p.badge} />
                    </div>
                  </div>
                  <div className={`w-full rounded-xl p-5 flex items-center justify-between border-[3px] border-black relative z-10 ${isFirst ? 'bg-orange-500 text-black shadow-[4px_4px_0px_#000]' : 'bg-[#0a0a0a] border-white shadow-[4px_4px_0px_#fff]'}`}>
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isFirst ? 'text-black/70' : 'text-neutral-400'}`}>Total Views</span>
                      <span className={`text-3xl font-black ${isFirst ? 'text-black' : 'text-white'}`}>{p.knowmi_score}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-[10px] font-black uppercase tracking-wider mb-1 ${isFirst ? 'text-black/70' : 'text-neutral-400'}`}>Trend</span>
                      <div className={`flex items-center gap-1 font-bold text-sm ${p.rank_delta >= 0 ? (isFirst ? 'text-black' : 'text-teal-400') : 'text-rose-400'}`}>
                        {p.rank_delta >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        <span>{p.rank_delta === 0 ? 'Steady' : `${p.rank_delta > 0 ? '+' : ''}${p.rank_delta}%`}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between w-full mt-6 relative z-10 gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShareProfile(p); }} 
                      className="flex-1 py-3 bg-white text-black border-[3px] border-black rounded-lg font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                    >
                      <Share2 size={16} /> Share
                    </button>
                    <a 
                      href={`/p/${p.secure_slug || p.id}?src=leaderboard`} 
                      className="flex-1 py-3 bg-white text-black border-[3px] border-black rounded-lg font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                    >
                      <Eye size={16} /> View
                    </a>
                  </div>
                </div>
              )
              })}
            </div>
          </div>
        )}

        {/* Ranks 4+ List (Horizontal Scrolling) */}
        <div className="flex overflow-x-auto gap-6 pb-8 mb-24 snap-x snap-mandatory px-4 md:px-0 max-w-5xl mx-auto w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {tableRows.map((p) => (
            <div
              key={p.username}
              onClick={() => {
                const slug = p.secure_slug || p.id;
                window.location.href = `/p/${slug}?src=leaderboard`;
              }}
              className="group min-w-[280px] w-[280px] flex-shrink-0 snap-start bg-[#1a1a1a] p-6 rounded-xl border-[4px] border-white shadow-[6px_6px_0px_#fff] transition-all duration-300 cursor-pointer flex flex-col items-center gap-6 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              <div className="w-full flex justify-between items-center mb-2">
                <div className="px-3 py-1 rounded-sm bg-white text-black border-[2px] border-black flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#000] group-hover:bg-orange-500 transition-colors">
                  #{p.rank}
                </div>
                <BadgePill badge={p.badge} />
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative p-1.5 rounded-lg bg-white border-[3px] border-black shadow-[3px_3px_0px_#000] mb-4 group-hover:bg-orange-500 transition-colors">
                  <Avatar src={p.avatar_url} name={p.display_name} username={p.username} size="md" />
                </div>
                <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">{p.display_name}</h4>
                <span className="text-xs font-bold text-neutral-400">@{p.username}</span>
              </div>

              <div className="w-full border-t-[3px] border-white/20 pt-5 flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Total Views</span>
                  <span className="text-2xl font-black text-orange-500">{p.knowmi_score}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareProfile(p);
                    }}
                    className="p-2.5 bg-white text-black border-[2px] border-black shadow-[2px_2px_0px_#000] hover:bg-orange-500 rounded-md transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  >
                    <Share2 size={16} />
                  </button>
                  <a 
                    href={`/p/${p.secure_slug || p.id}?src=leaderboard`} 
                    className="p-2.5 bg-white text-black border-[2px] border-black shadow-[2px_2px_0px_#000] hover:bg-teal-400 rounded-md transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  >
                    <Eye size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {shareProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 transition-all duration-300">
            <div className="bg-[#0a0a0a] rounded-xl w-full max-w-xl max-h-[95vh] overflow-y-auto shadow-[8px_8px_0px_#F97316] border-[4px] border-white animate-in zoom-in-95 duration-300" style={{ scrollbarWidth: 'none' }}>
              <div className="p-8 border-b-[4px] border-white flex justify-between items-center bg-[#1a1a1a]">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Elite Achievement</h2>
                <button onClick={() => setShareProfile(null)} className="p-2 bg-white text-black border-[3px] border-black rounded-lg shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"><X size={24} /></button>
              </div>
              <div className="p-8 bg-[#0a0a0a]">
                <div className="aspect-[4/5] bg-black rounded-xl p-10 text-white relative overflow-hidden group border-[4px] border-orange-500 shadow-[8px_8px_0px_#fff]">
                  <div className="absolute inset-0 border-[4px] border-white rounded-xl pointer-events-none" />
                  <div className="relative z-10 flex justify-between items-start">
                    <div>
                      <h1 className="font-black text-3xl tracking-tighter uppercase">Kno<span className="text-orange-500">WM</span>i</h1>
                      <p className="text-[10px] font-black text-white bg-orange-500 px-2 py-0.5 border-[2px] border-black shadow-[2px_2px_0px_#000] uppercase tracking-[0.3em] inline-block mt-1">Verified Identity</p>
                    </div>
                    <div className="bg-white text-black px-4 py-2 rounded-lg border-[3px] border-black flex items-center gap-2 shadow-[3px_3px_0px_#000]">
                      <Sparkles size={14} className="text-orange-500" />
                      <span className="text-xs font-black uppercase tracking-widest">Elite Status</span>
                    </div>
                  </div>
                  <div className="relative z-10 mt-12">
                    <p className="text-orange-500 font-black text-sm uppercase tracking-widest mb-1">Global Milestone</p>
                    <h2 className="text-6xl font-black tracking-tight leading-[0.9]">Ranked #{shareProfile.rank}</h2>
                  </div>
                  <div className="relative z-10 mt-12 flex items-center gap-5">
                    <div className="p-1.5 bg-orange-500 rounded-xl border-[4px] border-white shadow-[4px_4px_0px_#fff]">
                      <Avatar src={shareProfile.avatar_url} name={shareProfile.display_name} username={shareProfile.username} size="lg" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black tracking-tight uppercase">{shareProfile.display_name}</h3>
                      <p className="text-neutral-400 font-bold bg-[#1a1a1a] px-3 py-1 rounded-md border-[2px] border-white inline-block mt-1">@{shareProfile.username}</p>
                    </div>
                  </div>
                  <div className="relative z-10 mt-12 grid grid-cols-2 gap-4">
                    {/* Total Views */}
                    <div className="bg-[#1a1a1a] rounded-xl p-5 border-[3px] border-white flex flex-col justify-between h-32 shadow-[4px_4px_0px_#fff]">
                      <div className="flex justify-between items-center">
                        <Activity size={20} className="text-teal-400" />
                      </div>
                      <div>
                        <p className="text-3xl font-black text-white">{shareStats?.totalViews?.toLocaleString() || '0'}</p>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Total Views</p>
                      </div>
                    </div>
                    
                    {/* Unique Visitors */}
                    <div className="bg-[#1a1a1a] rounded-xl p-5 border-[3px] border-white flex flex-col justify-between h-32 shadow-[4px_4px_0px_#fff]">
                      <div className="flex justify-between items-center">
                        <Users size={20} className="text-violet-400" />
                      </div>
                      <div>
                        <p className="text-3xl font-black text-white">{shareStats?.uniqueViews?.toLocaleString() || '0'}</p>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Unique Visitors</p>
                      </div>
                    </div>

                    {/* Streak Record */}
                    <div className="bg-orange-500 rounded-xl p-5 border-[3px] border-black flex flex-col justify-between h-32 shadow-[4px_4px_0px_#000]">
                      <div className="flex justify-between items-center">
                        <Flame size={20} className="text-black" />
                      </div>
                      <div>
                        <p className="text-3xl font-black text-black">{shareStats?.streak?.best || '0'}</p>
                        <p className="text-[10px] font-black text-black uppercase tracking-wider border-b-[2px] border-black/20 pb-1">Best Streak Days</p>
                      </div>
                    </div>

                    {/* Top City */}
                    <div className="bg-[#1a1a1a] rounded-xl p-5 border-[3px] border-white flex flex-col justify-between h-32 shadow-[4px_4px_0px_#fff]">
                      <div className="flex justify-between items-center">
                        <MapPin size={20} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xl font-black truncate text-white uppercase">{shareStats?.topCities?.[0]?.city || 'Global'}</p>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider mt-1">{shareStats?.topCities?.[0]?.flag || '🌍'} Top Location</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-10 grid grid-cols-2 gap-5">
                  <button onClick={() => {
                    const slug = shareProfile.secure_slug || shareProfile.id;
                    const fresh = `${window.location.origin}/p/${slug}?src=leaderboard_share`;
                    navigator.clipboard.writeText(fresh);
                    toast.success('Link copied to clipboard!');
                  }} className="flex items-center justify-center gap-3 py-5 bg-[#1a1a1a] text-white border-[4px] border-white rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-[6px_6px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
                    <Copy size={20} /> Copy Link
                  </button>
                  <button onClick={() => toast('Download feature coming soon! 🎨', { icon: '🚀' })} className="flex items-center justify-center gap-3 py-5 bg-orange-500 text-black border-[4px] border-black rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-[6px_6px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
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

'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Info, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ScoreBreakdownBars from './ScoreBreakdownBars';
import ScoreTrendChart from './ScoreTrendChart';

interface ProfileScore {
  knowmi_score: number;
  rank: number;
  percentile: number;
  badge: string | null;
  score_views: number;
  score_clicks: number;
  score_qr: number;
  score_completeness: number;
  score_repeat: number;
}

export default function MyScoreCard({ profileId }: { profileId: string }) {
  const [score, setScore] = useState<ProfileScore | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [scoreRes, historyRes] = await Promise.all([
        supabase.from('profile_scores').select('*').eq('profile_id', profileId).single(),
        supabase.from('profile_score_history').select('*').eq('profile_id', profileId).order('day', { ascending: true }).limit(30)
      ]);

      if (scoreRes.data) setScore(scoreRes.data);
      if (historyRes.data) setHistory(historyRes.data);
      setLoading(false);
    }
    if (profileId) fetchData();
  }, [profileId]);

  if (loading) return <div className="h-96 bg-white animate-pulse rounded-[2.5rem]" />;
  if (!score) return null;

  const potentialGain = Math.round((1 - score.score_completeness / 120) * 120);

  return (
    <div className="bg-white rounded-[2.5rem] border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
      {/* Top Section: Hero Score */}
      <div className="p-8 bg-gradient-to-br from-neutral-50 to-white border-b border-neutral-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-sm font-display text-neutral-400 uppercase tracking-widest mb-1">Your KnoWMi Score</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-teal-500 tracking-tighter">{score.knowmi_score}</span>
              <span className="text-lg font-bold text-neutral-300">/ 1000</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-2xl shadow-lg">
              <Trophy size={18} className="text-amber-400" />
              <span className="font-black">Rank #{score.rank}</span>
            </div>
            <p className="text-xs font-bold text-neutral-400 mt-2 uppercase tracking-widest">Top {100 - score.percentile}% Globally</p>
          </div>
        </div>

        {score.badge && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-teal-100">
            {score.badge} Badge Earned
          </div>
        )}
      </div>

      {/* Middle Section: Breakdown */}
      <div className="p-8 border-b border-neutral-100">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-sm font-display text-neutral-900 uppercase tracking-widest">Score Breakdown</h4>
          <Info size={16} className="text-neutral-300" />
        </div>
        <ScoreBreakdownBars score={score} />
      </div>

      {/* Bottom Section: Trend */}
      <div className="p-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-sm font-display text-neutral-900 uppercase tracking-widest">30-Day Trend</h4>
          <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
            <TrendingUp size={14} />
            Stable Growth
          </div>
        </div>
        <div className="h-48 w-full">
          <ScoreTrendChart history={history} />
        </div>
      </div>

      {/* Contextual Tip */}
      {score.knowmi_score < 500 && potentialGain > 0 && (
        <div className="m-8 mt-0 p-6 bg-orange-50 rounded-3xl border border-orange-100 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900 mb-1">Boost Your Score</p>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Your score could improve by <span className="font-bold text-orange-600">~{potentialGain} points</span> if you complete your profile bio and social links.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

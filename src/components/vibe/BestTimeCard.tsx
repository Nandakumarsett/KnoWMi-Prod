import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { buildInsightContext } from '../../lib/insights/build-context';
import { computeBestTime, BestTimeResult } from '../../lib/insights/insight-engine';

interface Props {
  profileId: string;
}

export function BestTimeCard({ profileId }: Props) {
  const [bestTime, setBestTime] = useState<BestTimeResult | null>(null);

  useEffect(() => {
    let active = true;
    async function loadBestTime() {
      if (!profileId) return;
      try {
        const ctx = await buildInsightContext(profileId, supabase);
        const result = computeBestTime(ctx);
        if (active) {
          setBestTime(result);
        }
      } catch (err) {
        console.error('Error in computeBestTime:', err);
      }
    }
    loadBestTime();
    return () => { active = false; };
  }, [profileId]);

  if (!bestTime) return null;

  return (
    <div className="bg-[#13131a] border border-neutral-800 rounded-3xl p-5 mb-6 animate-slideUp">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{bestTime.emoji}</span>
          <h4 className="font-display font-black text-xs uppercase tracking-widest text-neutral-400">
            Smart Timing
          </h4>
        </div>
        <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full ${
          bestTime.confidence === 'high' ? 'bg-green-500/10 text-green-500' :
          bestTime.confidence === 'medium' ? 'bg-orange-500/10 text-orange-500' :
          'bg-neutral-500/10 text-neutral-400 font-bold'
        }`}>
          {bestTime.confidence} confidence
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-xs text-neutral-400 font-bold font-bold uppercase tracking-wider">
            Optimal Window:
          </span>
          <span className="text-xl font-display font-black text-white">
            {bestTime.optimalWindow}
          </span>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed font-medium">
          {bestTime.message}
        </p>
      </div>
    </div>
  );
}

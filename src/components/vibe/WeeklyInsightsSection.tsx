import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { buildInsightContext } from '../../lib/insights/build-context';
import { computeAllInsights, InsightCard } from '../../lib/insights/insight-engine';
import { AIInsightCard } from './AIInsightCard';

interface Props {
  profileId: string;
}

export function WeeklyInsightsSection({ profileId }: Props) {
  const [cards, setCards] = useState<InsightCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadInsights() {
      if (!profileId) return;
      try {
        setLoading(true);
        const ctx = await buildInsightContext(profileId, supabase);
        const dismissed = JSON.parse(localStorage.getItem('dismissed_nudges') ?? '[]');
        const d = computeAllInsights(ctx, dismissed);
        if (active) {
          setCards(d.weeklyCards);
        }
      } catch (err) {
        console.error('Error loading insights:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadInsights();
    return () => { active = false; };
  }, [profileId]);

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="font-display text-xs font-black tracking-widest text-neutral-400 uppercase">
          ✦ This week's insights
        </div>
        <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider font-bold">
          Based on your data
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-[#13131a] rounded-2xl h-28 border border-neutral-800" />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div className="p-8 text-center bg-[#13131a] rounded-3xl border border-dashed border-neutral-800 text-neutral-400 font-bold text-xs font-black uppercase tracking-widest select-none">
          No insights available yet. Get more views!
        </div>
      ) : (
        <div className="space-y-3">
          {cards.map((card, i) => (
            <AIInsightCard key={card.id} card={card} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}

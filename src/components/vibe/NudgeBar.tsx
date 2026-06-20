import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { buildInsightContext } from '../../lib/insights/build-context';
import { computeTopNudge, Nudge } from '../../lib/insights/insight-engine';
import { X } from 'lucide-react';

interface Props {
  profileId: string;
}

export function NudgeBar({ profileId }: Props) {
  const [nudge, setNudge] = useState<Nudge | null>(null);

  useEffect(() => {
    let active = true;
    async function loadNudge() {
      if (!profileId) return;
      try {
        const ctx = await buildInsightContext(profileId, supabase);
        const dismissed: string[] = JSON.parse(localStorage.getItem('dismissed_nudges') ?? '[]');
        const n = computeTopNudge(ctx, dismissed);
        if (active) {
          setNudge(n);
        }
      } catch (err) {
        console.error('Error in computeTopNudge:', err);
      }
    }
    loadNudge();
    return () => { active = false; };
  }, [profileId]);

  const handleDismiss = () => {
    if (!nudge) return;
    const dismissed: string[] = JSON.parse(localStorage.getItem('dismissed_nudges') ?? '[]');
    dismissed.push(nudge.id);
    localStorage.setItem('dismissed_nudges', JSON.stringify(dismissed));
    setNudge(null);
  };

  if (!nudge) return null;

  return (
    <div 
      className="bg-[#13131a] border-l-4 border-orange-500 rounded-2xl p-4 mb-6 shadow-[8px_8px_0px_#fff] flex items-center justify-between gap-4 animate-slideUp"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl select-none leading-none">{nudge.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black font-display text-white leading-tight mb-0.5">
            {nudge.message}
          </p>
          {nudge.cta && (
            <a 
              href={nudge.cta_url ?? '#'} 
              className="text-[11px] text-orange-500 font-bold uppercase tracking-wider underline hover:text-orange-400 transition-colors"
            >
              {nudge.cta}
            </a>
          )}
        </div>
      </div>

      {nudge.dismissible && (
        <button 
          onClick={handleDismiss} 
          className="p-1 rounded-full text-neutral-400 hover:text-neutral-400 hover:bg-[#1a1a1a]/5 transition-colors duration-150"
          aria-label="Dismiss nudge"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

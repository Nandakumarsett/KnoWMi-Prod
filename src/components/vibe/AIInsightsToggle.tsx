import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { NudgeBar } from './NudgeBar';
import { BestTimeCard } from './BestTimeCard';
import { WeeklyInsightsSection } from './WeeklyInsightsSection';

interface Props {
  profileId: string;
}

export function AIInsightsToggle({ profileId }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-[800px] mx-auto mt-6 bg-[#13131a] border border-neutral-800 rounded-3xl p-4 md:p-6 shadow-[8px_8px_0px_#fff] transition-all duration-300">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center shadow-inner">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-black font-display text-white tracking-tight leading-tight flex items-center gap-2">
              AI Insights <span className="text-[10px] bg-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Beta</span>
            </h3>
            <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider leading-relaxed">
              Personalized, data-driven identity analytics
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-orange-500 text-white font-black text-xs uppercase tracking-wider px-4 py-3 rounded-2xl hover:bg-orange-600 transition-all duration-300 shadow-[6px_6px_0px_#fff] shadow-orange-500/20 active:scale-95 select-none"
        >
          {isOpen ? (
            <>
              Hide Insights <ChevronUp size={16} />
            </>
          ) : (
            <>
              Show Insights <ChevronDown size={16} />
            </>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="mt-6 border-t border-neutral-800 pt-6 animate-slideUp">
          <NudgeBar profileId={profileId} />
          <BestTimeCard profileId={profileId} />
          <WeeklyInsightsSection profileId={profileId} />
        </div>
      )}
    </div>
  );
}

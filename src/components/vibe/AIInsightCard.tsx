import React from 'react';
import { InsightCard } from '../../lib/insights/insight-engine';

interface Props {
  card: InsightCard;
  index: number;
}

export function AIInsightCard({ card, index }: Props) {
  const typeLabels: Record<string, string> = {
    top_moment:  'Today',
    pattern:     'Pattern',
    best_time:   'Timing',
    growth_tip:  'Tip',
    comparison:  'Your Rank',
  };

  return (
    <div 
      className="border-l-4 border-orange-500 bg-[#13131a] rounded-2xl p-5 mb-3 transition-all animate-slideUp duration-300 relative shadow-md"
      style={{
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Type pill — top right */}
      <div className="absolute top-3 right-4 bg-orange-500/10 text-orange-500 text-[10px] px-2.5 py-1 rounded-full font-black tracking-widest uppercase">
        {typeLabels[card.type] ?? card.type}
      </div>

      {/* Headline row */}
      <div className="flex items-start gap-3 mb-2 pr-16">
        <span className="text-xl flex-shrink-0 leading-none">{card.emoji}</span>
        <div className="font-display font-black text-sm text-white leading-tight">
          {card.headline}
        </div>
      </div>

      {/* Body */}
      <div className="text-xs text-neutral-400 leading-relaxed ml-8 mb-3">
        {card.body}
      </div>

      {/* Footer row: data point + CTA */}
      {(card.data_point || card.cta) && (
        <div className="flex items-center justify-between ml-8">
          {card.data_point && (
            <span className="text-[10px] font-mono font-bold bg-orange-500/10 text-orange-500 px-2.5 py-1 rounded-full">
              {card.data_point}
            </span>
          )}
          {card.cta && (
            <a 
              href={card.cta_url ?? '#'} 
              className="text-[11px] font-black uppercase tracking-wider text-orange-500 border border-orange-500/30 rounded-full px-3 py-1 hover:bg-orange-500/10 transition-all duration-150"
            >
              {card.cta} →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';

export default function ScoreBreakdownBars({ score }: { score: any }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const breakdown = [
    { label: 'Views Signal', value: score.score_views, max: 350 },
    { label: 'Click Rate', value: score.score_clicks, max: 250 },
    { label: 'QR Scans', value: score.score_qr, max: 200 },
    { label: 'Completeness', value: score.score_completeness, max: 120 },
    { label: 'Repeat Fans', value: score.score_repeat, max: 80 },
  ];

  return (
    <div className="space-y-6">
      {breakdown.map((item, i) => (
        <div key={item.label}>
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{item.label}</span>
            <span className="text-xs font-bold text-neutral-900">{item.value} <span className="text-neutral-300">/ {item.max}</span></span>
          </div>
          <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div 
              style={{ 
                width: mounted ? `${(item.value / item.max) * 100}%` : '0%',
                transition: `width 1s ease-out ${i * 0.1}s`
              }}
              className="h-full bg-teal-500 rounded-full"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { buildInsightContext } from '../lib/insights/build-context';
import { computeAllInsights, InsightCard, Nudge, BestTimeResult } from '../lib/insights/insight-engine';
import { ArrowLeft, Sparkles, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

export default function InsightsPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [cards, setCards] = useState<InsightCard[]>([]);
  const [nudge, setNudge] = useState<Nudge | null>(null);
  const [bestTime, setBestTime] = useState<BestTimeResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        let profId = '';
        if (user) {
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (prof) {
            setProfile(prof);
            profId = prof.id;
          }
        }

        if (!profId) {
          const { data: allProfs } = await supabase
            .from('profiles')
            .select('*')
            .limit(1);

          if (allProfs && allProfs.length > 0) {
            setProfile(allProfs[0]);
            profId = allProfs[0].id;
          }
        }

        if (profId) {
          const ctx = await buildInsightContext(profId, supabase);
          const dismissed = JSON.parse(localStorage.getItem('dismissed_nudges') ?? '[]');
          const results = computeAllInsights(ctx, dismissed);

          if (active) {
            setCards(results.weeklyCards);
            setNudge(results.nudge);
            setBestTime(results.bestTime);
          }
        }
      } catch (err) {
        console.error('Error loading insights page:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [navigate]);

  const handleDismissNudge = () => {
    if (!nudge) return;
    const dismissed: string[] = JSON.parse(localStorage.getItem('dismissed_nudges') ?? '[]');
    dismissed.push(nudge.id);
    localStorage.setItem('dismissed_nudges', JSON.stringify(dismissed));
    setNudge(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-black tracking-widest text-neutral-500 uppercase">Analyzing context...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-16 font-sans text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-neutral-100 z-50">
        <div className="max-w-[600px] mx-auto px-5 h-16 flex items-center gap-4">
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
            className="w-10 h-10 rounded-2xl border border-neutral-100 bg-white hover:bg-neutral-50 flex items-center justify-center transition-all duration-200 select-none shadow-sm active:scale-95"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={18} className="text-neutral-700" />
          </button>
          <div>
            <h1 className="text-sm font-black font-display text-neutral-900 tracking-tight flex items-center gap-2">
              AI Insights <span className="text-[10px] bg-orange-500/10 text-orange-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Beta</span>
            </h1>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              Data-driven Identity Analytics
            </p>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <main className="max-w-[600px] mx-auto px-5 pt-8">
        {/* Nudge Alert */}
        {nudge && (
          <div className="bg-white border border-neutral-100 border-l-4 border-l-orange-500 rounded-2xl p-4 mb-6 shadow-sm flex items-center justify-between gap-4 animate-slideUp">
            <div className="flex items-center gap-3">
              <span className="text-xl select-none leading-none">{nudge.emoji}</span>
              <div>
                <p className="text-xs font-bold font-display text-neutral-800 leading-snug">
                  {nudge.message}
                </p>
                {nudge.cta && (
                  <a 
                    href={nudge.cta_url ?? '#'} 
                    className="text-[10px] text-orange-600 font-black uppercase tracking-wider underline hover:text-orange-500 mt-1 inline-block"
                  >
                    {nudge.cta}
                  </a>
                )}
              </div>
            </div>
            {nudge.dismissible && (
              <button 
                onClick={handleDismissNudge} 
                className="text-[11px] font-black tracking-wider uppercase bg-neutral-100 hover:bg-neutral-200 text-neutral-600 px-3 py-1.5 rounded-xl transition-all"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Optimal Timing Card */}
        {bestTime && (
          <div className="bg-white border border-neutral-100 rounded-3xl p-5 mb-8 shadow-sm flex flex-col gap-4 animate-slideUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg leading-none">{bestTime.emoji}</span>
                <h4 className="font-display font-black text-xs uppercase tracking-widest text-neutral-400">
                  Optimal Window
                </h4>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                bestTime.confidence === 'high' ? 'bg-green-50 text-green-700 border border-green-100' :
                bestTime.confidence === 'medium' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                'bg-neutral-50 text-neutral-600 border border-neutral-100'
              }`}>
                {bestTime.confidence} confidence
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Sweet Spot</span>
              <span className="text-xl font-display font-black text-neutral-800">{bestTime.optimalWindow}</span>
            </div>
            <p className="text-xs text-neutral-500 font-medium leading-relaxed mt-1">
              {bestTime.message}
            </p>
          </div>
        )}

        {/* Weekly Insights */}
        <div className="flex items-center justify-between mb-4">
          <div className="font-display text-xs font-black tracking-widest text-neutral-400 uppercase">
            ✦ Weekly Breakdowns
          </div>
          <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
            Derived from KnoWMi logs
          </div>
        </div>

        {cards.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-neutral-200 text-neutral-400 text-xs font-black uppercase tracking-widest select-none">
            No active metrics to analyze yet.
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map((card, i) => (
              <div 
                key={card.id} 
                className="bg-white border border-neutral-100 border-l-4 border-l-orange-500 rounded-3xl p-5 shadow-sm transition-all animate-slideUp duration-300 relative"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="absolute top-4 right-4 bg-orange-500/10 text-orange-600 text-[10px] px-2.5 py-1 rounded-full font-black tracking-widest uppercase border border-orange-200/20">
                  {card.type.replace('_', ' ')}
                </div>

                <div className="flex items-start gap-3 mb-2 pr-16">
                  <span className="text-xl flex-shrink-0 leading-none">{card.emoji}</span>
                  <div className="font-display font-black text-sm text-neutral-800 leading-tight">
                    {card.headline}
                  </div>
                </div>

                <div className="text-xs text-neutral-500 font-medium leading-relaxed ml-8 mb-4">
                  {card.body}
                </div>

                {(card.data_point || card.cta) && (
                  <div className="flex items-center justify-between ml-8 pt-3 border-t border-neutral-50">
                    {card.data_point && (
                      <span className="text-[10px] font-mono font-bold bg-neutral-50 text-neutral-600 border border-neutral-100 px-2.5 py-1 rounded-xl">
                        {card.data_point}
                      </span>
                    )}
                    {card.cta && (
                      <a 
                        href={card.cta_url ?? '#'} 
                        className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-100/50 rounded-xl px-4 py-2 transition-all duration-200"
                      >
                        {card.cta} →
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

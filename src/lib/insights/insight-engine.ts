import { InsightContext } from './build-context';
import {
  TOP_MOMENT_TEMPLATES, PATTERN_TEMPLATES,
  BEST_TIME_TEMPLATES, GROWTH_TIP_TEMPLATES, COMPARISON_TEMPLATES,
  InsightTemplate,
} from './templates';

export interface InsightCard {
  id: string;
  type: string;
  emoji: string;
  headline: string;
  body: string;
  cta?: string;
  cta_url?: string;
  data_point?: string;
}

export interface Nudge {
  id: string;
  emoji: string;
  message: string;
  cta?: string;
  cta_url?: string;
  priority: 1 | 2 | 3;
  dismissible: boolean;
}

export interface BestTimeResult {
  shouldWearNow: boolean;
  message: string;
  emoji: string;
  optimalWindow: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface InsightResult {
  weeklyCards: InsightCard[];
  nudge: Nudge | null;
  bestTime: BestTimeResult;
}

// ── Main engine entry point ──────────────────────────────────────────────

export function computeAllInsights(ctx: InsightContext, dismissed: string[] = []): InsightResult {
  return {
    weeklyCards: computeWeeklyCards(ctx),
    nudge: computeTopNudge(ctx, dismissed),
    bestTime: computeBestTime(ctx),
  };
}

// ── Weekly cards: one per type, best match wins ──────────────────────────

export function computeWeeklyCards(ctx: InsightContext): InsightCard[] {
  const allGroups = [
    TOP_MOMENT_TEMPLATES,
    PATTERN_TEMPLATES,
    BEST_TIME_TEMPLATES,
    GROWTH_TIP_TEMPLATES,
    COMPARISON_TEMPLATES,
  ];

  return allGroups.map(group => selectBestTemplate(group, ctx)).filter(Boolean) as InsightCard[];
}

function selectBestTemplate(
  templates: InsightTemplate[],
  ctx: InsightContext
): InsightCard | null {
  // Filter by condition and persona, sort by priority (ascending = more important)
  const eligible = templates
    .filter(t => {
      if (t.personas && !t.personas.includes(ctx.profile.persona)) return false;
      try { return t.condition(ctx); } catch { return false; }
    })
    .sort((a, b) => a.priority - b.priority);

  if (eligible.length === 0) return null;

  // Add weekly variety: rotate based on week number
  const topN = eligible.slice(0, 3);
  const chosen = topN[ctx.time.weekNumber % topN.length];

  return renderTemplate(chosen, ctx);
}

function renderTemplate(template: InsightTemplate, ctx: InsightContext): InsightCard {
  const tokens = template.tokens(ctx);

  const interpolate = (str: string): string =>
    str.replace(/\{(\w+)\}/g, (_, key) => tokens[key] ?? '');

  return {
    id: template.id,
    type: template.type,
    emoji: template.emoji,
    headline: interpolate(template.headline),
    body: interpolate(template.body),
    cta: template.cta ? interpolate(template.cta) : undefined,
    cta_url: template.cta_url ? interpolate(template.cta_url) : undefined,
    data_point: template.data_point ? interpolate(template.data_point) : undefined,
  };
}

// ── Nudge engine ─────────────────────────────────────────────────────────

export function computeTopNudge(ctx: InsightContext, dismissed: string[] = []): Nudge | null {
  const nudges: Nudge[] = [];
  const { analytics, profile, time } = ctx;

  // P1: In peak window right now
  if (analytics.peakHour !== null &&
      time.hour >= analytics.peakHour &&
      time.hour < analytics.peakHour + 2 &&
      analytics.totalQRScans >= 15) {
    nudges.push({
      id: 'wear_now_peak',
      emoji: '👕',
      message: `This is your peak scan hour. The tee should be on right now.`,
      priority: 1, dismissible: true,
    });
  }

  // P1: Streak about to break
  if (analytics.streak >= 3 && analytics.todayScans === 0 && time.hour >= 18) {
    nudges.push({
      id: 'streak_danger',
      emoji: '🔥',
      message: `Your ${analytics.streak}-day streak ends at midnight. Go get a scan.`,
      priority: 1, dismissible: false,
    });
  }

  // P1: Milestone within reach
  for (const m of [50, 100, 250, 500, 1000]) {
    if (analytics.totalViews >= m - 8 && analytics.totalViews < m) {
      nudges.push({
        id: `milestone_near_${m}`,
        emoji: '🎯',
        message: `${m - analytics.totalViews} views away from ${m.toLocaleString('en-IN')}. Wear it today.`,
        priority: 1, dismissible: true,
      });
      break;
    }
  }

  // P2: Today is historically best day
  if (analytics.peakDay === time.dayOfWeek && analytics.totalQRScans >= 20) {
    nudges.push({
      id: 'best_day_today',
      emoji: '⚡',
      message: `${time.dayOfWeek}s are your strongest scan day. Don't waste it.`,
      priority: 2, dismissible: true,
    });
  }

  // P2: Low link taps — profile friction
  if (analytics.totalViews >= 25 && analytics.linkTapRate < 10) {
    nudges.push({
      id: 'low_link_taps',
      emoji: '🔗',
      message: `Only ${analytics.linkTapRate}% of visitors click your links. Your bio might need work.`,
      cta: 'Fix it',
      cta_url: `/dashboard/identity?persona=${profile.persona}#bio`,
      priority: 2, dismissible: true,
    });
  }

  // P2: Profile gap — most impactful missing section
  if (profile.completionScore < 60 && profile.incompleteSections.length > 0) {
    const sectionMessages: Record<string, string> = {
      projects:      'Your projects section is empty. That is the first thing people look for.',
      tech_stack:    'No tech stack listed. Add yours — it takes 30 seconds.',
      platforms:     'Platform stats missing. That is 30% of your profile score.',
      playlist:      'No playlist linked. It is the fastest way to connect.',
      goals:         'No goals set. Progress bars make profiles 3× more engaging.',
      main_games:    'Your gamer profile has no games. Add at least two.',
      featured_work: 'No featured work. It is the first thing a stranger sees.',
    };
    const topMissing = profile.incompleteSections[0];
    const msg = sectionMessages[topMissing];
    if (msg) {
      nudges.push({
        id: `profile_gap_${topMissing}`,
        emoji: '⚠️',
        message: msg,
        cta: 'Fix now',
        cta_url: `/dashboard/identity?persona=${profile.persona}#${topMissing}`,
        priority: 2, dismissible: true,
      });
    }
  }

  // P3: First scan of the day
  if (analytics.todayScans === 1) {
    nudges.push({
      id: 'first_scan_today',
      emoji: '🌅',
      message: 'First scan of the day. Someone is already curious about you.',
      priority: 3, dismissible: true,
    });
  }

  // P3: New city discovered today
  if (analytics.newCityToday) {
    nudges.push({
      id: `new_city_${analytics.newCityToday}`,
      emoji: '📍',
      message: `Someone in ${analytics.newCityToday} just discovered you for the first time.`,
      priority: 3, dismissible: true,
    });
  }

  if (nudges.length === 0) {
    nudges.push({
      id: 'welcome_starter',
      emoji: '✦',
      message: 'Welcome to your smart dashboard. Wear your tee to generate deeper insights.',
      priority: 3,
      dismissible: true,
    });
  }

  return nudges
    .filter(n => !dismissed.includes(n.id))
    .sort((a, b) => a.priority - b.priority)[0] ?? null;
}

// ── Best time ────────────────────────────────────────────────────────────

export function computeBestTime(ctx: InsightContext): BestTimeResult {
  const { analytics, time } = ctx;

  if (analytics.totalQRScans < 15 || analytics.peakHour === null) {
    return {
      shouldWearNow: false,
      message: `Wear it as much as possible. We'll learn your peak window after ${Math.max(0, 15 - analytics.totalQRScans)} more scans.`,
      emoji: '📡',
      optimalWindow: 'Learning...',
      confidence: 'low',
    };
  }

  const inPeak = time.hour >= analytics.peakHour && time.hour < analytics.peakHour + 2;
  const isBestDay = analytics.peakDay === time.dayOfWeek;
  const window = formatHour(analytics.peakHour);
  const confidence: BestTimeResult['confidence'] =
    analytics.totalQRScans >= 100 ? 'high' :
    analytics.totalQRScans >= 40  ? 'medium' : 'low';

  if (inPeak && isBestDay) {
    return { shouldWearNow: true, message: `Perfect moment. ${time.dayOfWeek} + ${window} is your exact sweet spot.`, emoji: '🔥', optimalWindow: window, confidence };
  }
  if (inPeak) {
    return { shouldWearNow: true, message: `You are inside your peak scan window (${window}). Get out.`, emoji: '⚡', optimalWindow: window, confidence };
  }
  if (isBestDay) {
    return { shouldWearNow: false, message: `Today is your best scan day. Peak window starts at ${window}.`, emoji: '📅', optimalWindow: window, confidence };
  }
  return {
    shouldWearNow: false,
    message: `Best: ${analytics.peakDay ?? 'any day'} between ${window}.`,
    emoji: '🕐',
    optimalWindow: window,
    confidence,
  };
}

function formatHour(h: number): string {
  const start = h % 12 || 12;
  const end = (h + 1) % 12 || 12;
  return `${start}–${end} ${h < 12 ? 'AM' : 'PM'}`;
}

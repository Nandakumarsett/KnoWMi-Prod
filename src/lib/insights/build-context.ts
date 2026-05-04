import { SupabaseClient } from '@supabase/supabase-js';
import { computeCompletionScore } from '../identity/completion-score';

export interface InsightContext {
  profile: {
    displayName: string;
    firstName: string;              // extracted from displayName.split(' ')[0]
    persona: PersonaType;
    tier: string;
    completionScore: number;        // 0–100
    incompleteSections: string[];   // sorted by impact points desc
    streakDays: number;
  };

  analytics: {
    totalViews: number;
    uniqueVisitors: number;
    totalQRScans: number;
    qrScanRate: number;             // 0–100
    repeatScore: number;            // 0–100
    todayScans: number;
    yesterdayScans: number;
    thisWeekScans: number;          // Mon–today
    lastWeekScans: number;          // previous full Mon–Sun
    weekSparkline: number[];        // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
    peakHour: number | null;        // 0–23
    peakDay: string | null;         // "Thursday"
    topCities: Array<{ city: string; count: number; countryCode: string }>;
    totalCities: number;
    newCityToday: string | null;    // city that appeared for first time today
    totalLinkTaps: number;
    topLink: { label: string; clicks: number } | null;
    linkTapRate: number;            // link taps / total views * 100
    bestDay: { date: string; count: number } | null;
    streak: number;
    liveNow: number;                // scans in last 5 minutes
    scansThisHour: number;
  };

  benchmarks: {
    platformAvgViews: number;
    userPercentile: number;         // 0–100, higher = better
    leaderboardRank: number | null;
    aboveAverage: boolean;
  };

  time: {
    dayOfWeek: string;              // "Tuesday"
    hour: number;                   // 0–23 current IST hour
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    isWeekend: boolean;
    weekNumber: number;             // 1–52
  };
}

export type PersonaType = 'developer' | 'student' | 'creator' | 'gamer' | 'fitness' | 'influencer';

export async function buildInsightContext(
  profileId: string,
  supabase: SupabaseClient
): Promise<InsightContext> {

  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const today = now.toISOString().slice(0, 10);
  const yesterday = new Date(now.getTime() - 86400000).toISOString().slice(0, 10);

  // Week boundaries (Mon = start)
  const dayOfWeekNum = (now.getDay() + 6) % 7; // Mon=0, Sun=6
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() - dayOfWeekNum);
  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(thisMonday.getDate() - 7);
  const lastSunday = new Date(thisMonday);
  lastSunday.setDate(thisMonday.getDate() - 1);

  // Run all queries in parallel
  const [
    profileResult,
    totalViewsResult,
    uniqueVisitorsResult,
    totalQRResult,
    todayViewsResult,
    yesterdayViewsResult,
    thisWeekResult,
    lastWeekResult,
    weekDailyResult,
    peakHourResult,
    peakDayResult,
    topCitiesResult,
    newCityResult,
    linkTapsResult,
    topLinkResult,
    bestDayResult,
    streakResult,
    liveNowResult,
    scansThisHourResult,
    leaderboardResult,
  ] = await Promise.allSettled([

    // Profile & persona data (all in one)
    supabase.from('profiles')
      .select('*')
      .eq('id', profileId).single(),

    // Total views all time
    supabase.from('profile_view_events')
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', profileId),

    // Unique visitors (distinct fingerprints)
    supabase.rpc('count_distinct_visitors', { p_profile_id: profileId }),

    // Total QR scans
    supabase.from('qr_scan_events')
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', profileId),

    // Today's views
    supabase.from('profile_view_events')
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .gte('viewed_at', `${today}T00:00:00+05:30`),

    // Yesterday's views
    supabase.from('profile_view_events')
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .gte('viewed_at', `${yesterday}T00:00:00+05:30`)
      .lt('viewed_at', `${today}T00:00:00+05:30`),

    // This week's views
    supabase.from('profile_view_events')
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .gte('viewed_at', thisMonday.toISOString()),

    // Last week's views
    supabase.from('profile_view_events')
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .gte('viewed_at', lastMonday.toISOString())
      .lte('viewed_at', lastSunday.toISOString()),

    // Daily breakdown for sparkline (last 7 days)
    supabase.from('profile_view_events')
      .select('viewed_at')
      .eq('profile_id', profileId)
      .gte('viewed_at', new Date(now.getTime() - 6 * 86400000).toISOString()),

    // Peak hour
    supabase.rpc('get_peak_scan_hour', { p_profile_id: profileId }),

    // Peak day of week
    supabase.rpc('get_peak_scan_day', { p_profile_id: profileId }),

    // Top cities
    supabase.from('qr_scan_events')
      .select('city, country_code')
      .eq('profile_id', profileId)
      .not('city', 'is', null),

    // New city today (city that never appeared before today)
    supabase.rpc('get_new_city_today', { p_profile_id: profileId }),

    // Total link taps
    supabase.from('link_click_events')
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', profileId),

    // Top link
    supabase.from('link_click_events')
      .select('link_label')
      .eq('profile_id', profileId)
      .order('clicked_at', { ascending: false })
      .limit(100),

    // Best single day
    supabase.rpc('get_best_scan_day', { p_profile_id: profileId }),

    // Streak
    supabase.rpc('get_current_streak', { p_profile_id: profileId }),

    // Live now (last 5 min)
    supabase.from('profile_view_events')
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .gte('viewed_at', new Date(now.getTime() - 5 * 60 * 1000).toISOString()),

    // Scans this hour
    supabase.from('profile_view_events')
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .gte('viewed_at', new Date(now.getTime() - 60 * 60 * 1000).toISOString()),

    // Leaderboard rank & score
    supabase.from('profile_scores')
      .select('rank, percentile')
      .eq('profile_id', profileId)
      .single(),
  ]);

  // Safe extractors
  const safe = <T>(result: PromiseSettledResult<any>, extract: (v: any) => T, fallback: T): T => {
    if (result.status === 'fulfilled' && result.value && !result.value.error) {
      try { return extract(result.value); } catch { return fallback; }
    }
    return fallback;
  };

  const profileDataObj = safe(profileResult, v => v.data, { display_name: 'Friend', persona: 'creator', tier: 'Starter', persona_data: {} });
  const displayName = profileDataObj.display_name || 'Friend';
  const firstName = (displayName.split(' ')[0]) || 'Friend';
  const persona: PersonaType = (profileDataObj.persona || 'creator').toLowerCase() as PersonaType;
  const tier = profileDataObj.tier || 'Starter';
  const personaData = profileDataObj.persona_data || {};

  const totalViews      = safe(totalViewsResult, v => v.count ?? 0, 0);
  const uniqueVisitors  = safe(uniqueVisitorsResult, v => v.data ?? 0, 0);
  const totalQRScans    = safe(totalQRResult, v => v.count ?? 0, 0);
  const todayScans      = safe(todayViewsResult, v => v.count ?? 0, 0);
  const yesterdayScans  = safe(yesterdayViewsResult, v => v.count ?? 0, 0);
  const thisWeekScans   = safe(thisWeekResult, v => v.count ?? 0, 0);
  const lastWeekScans   = safe(lastWeekResult, v => v.count ?? 0, 0);
  const peakHour        = safe(peakHourResult, v => v.data, null);
  const peakDay         = safe(peakDayResult, v => v.data, null);
  const bestDay         = safe(bestDayResult, v => v.data, null);
  const streak          = safe(streakResult, v => v.data ?? 0, 0);
  const liveNow         = safe(liveNowResult, v => v.count ?? 0, 0);
  const scansThisHour   = safe(scansThisHourResult, v => v.count ?? 0, 0);
  const totalLinkTaps   = safe(linkTapsResult, v => v.count ?? 0, 0);
  const newCityToday    = safe(newCityResult, v => v.data, null);
  const rank            = safe(leaderboardResult, v => v.data?.rank ?? null, null);
  const percentile      = safe(leaderboardResult, v => v.data?.percentile ?? 50, 50);

  // Week sparkline
  const weekRows = safe(weekDailyResult, v => v.data ?? [], []);
  const weekSparkline = Array(7).fill(0);
  for (const row of weekRows) {
    if (!row.viewed_at) continue;
    const d = new Date(row.viewed_at);
    const daysAgo = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (daysAgo >= 0 && daysAgo <= 6) weekSparkline[6 - daysAgo]++;
  }

  // City aggregation
  const cityRows = safe(topCitiesResult, v => v.data ?? [], []);
  const cityMap: Record<string, { count: number; countryCode: string }> = {};
  for (const r of cityRows) {
    if (!r.city) continue;
    cityMap[r.city] = cityMap[r.city] ?? { count: 0, countryCode: r.country_code ?? 'IN' };
    cityMap[r.city].count++;
  }
  const topCities = Object.entries(cityMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([city, v]) => ({ city, count: v.count, countryCode: v.countryCode }));

  // Top link
  const linkRows = safe(topLinkResult, v => v.data ?? [], []);
  const linkCounts: Record<string, number> = {};
  for (const r of linkRows) {
    if (r.link_label) {
      linkCounts[r.link_label] = (linkCounts[r.link_label] ?? 0) + 1;
    }
  }
  const topLinkEntry = Object.entries(linkCounts).sort((a, b) => b[1] - a[1])[0];
  const topLink = topLinkEntry ? { label: topLinkEntry[0], clicks: topLinkEntry[1] } : null;

  // Completion score (takes persona and data)
  const { score: completionScore, incomplete: incompleteSections } =
    computeCompletionScore(persona, personaData);

  // Platform benchmarks
  const PERSONA_BENCHMARKS: Record<string, number> = {
    developer: 45, student: 38, creator: 62, gamer: 41, fitness: 35, influencer: 88
  };
  const platformAvgViews = PERSONA_BENCHMARKS[persona] ?? 50;
  const aboveAverage = totalViews >= platformAvgViews;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeOfDay =
    now.getHours() < 12 ? 'morning' :
    now.getHours() < 17 ? 'afternoon' :
    now.getHours() < 21 ? 'evening' : 'night';

  return {
    profile: {
      displayName,
      firstName,
      persona,
      tier,
      completionScore,
      incompleteSections: incompleteSections.map(s => s.id),
      streakDays: streak,
    },
    analytics: {
      totalViews, uniqueVisitors, totalQRScans,
      qrScanRate: totalViews > 0 ? Math.round((totalQRScans / totalViews) * 100) : 0,
      repeatScore: uniqueVisitors > 0 ? Math.round(((uniqueVisitors - (totalViews - uniqueVisitors)) / uniqueVisitors) * 100) : 0,
      todayScans, yesterdayScans, thisWeekScans, lastWeekScans,
      weekSparkline, peakHour, peakDay, topCities,
      totalCities: Object.keys(cityMap).length,
      newCityToday, totalLinkTaps, topLink,
      linkTapRate: totalViews > 0 ? Math.round((totalLinkTaps / totalViews) * 100) : 0,
      bestDay, streak, liveNow, scansThisHour,
    },
    benchmarks: {
      platformAvgViews, userPercentile: percentile,
      leaderboardRank: rank, aboveAverage,
    },
    time: {
      dayOfWeek: days[now.getDay()],
      hour: now.getHours(),
      timeOfDay,
      isWeekend: now.getDay() === 0 || now.getDay() === 6,
      weekNumber: Math.ceil((now.getDate() + new Date(now.getFullYear(), now.getMonth(), 1).getDay()) / 7),
    },
  };
}

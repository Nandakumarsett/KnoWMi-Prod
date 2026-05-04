import { SupabaseClient } from '@supabase/supabase-js';
import { computeCompletionScore } from '../identity/completion-score';

export interface InsightContext {
  profile: {
    displayName: string;
    firstName: string;
    persona: PersonaType;
    tier: string;
    completionScore: number;
    incompleteSections: string[];
    streakDays: number;
  };

  analytics: {
    totalViews: number;
    uniqueVisitors: number;
    totalQRScans: number;
    qrScanRate: number;
    repeatScore: number;
    todayScans: number;
    yesterdayScans: number;
    thisWeekScans: number;
    lastWeekScans: number;
    weekSparkline: number[];
    peakHour: number | null;
    peakDay: string | null;
    topCities: Array<{ city: string; count: number; countryCode: string }>;
    totalCities: number;
    newCityToday: string | null;
    totalLinkTaps: number;
    topLink: { label: string; clicks: number } | null;
    linkTapRate: number;
    bestDay: { date: string; count: number } | null;
    streak: number;
    liveNow: number;
    scansThisHour: number;
  };

  benchmarks: {
    platformAvgViews: number;
    userPercentile: number;
    leaderboardRank: number | null;
    aboveAverage: boolean;
  };

  time: {
    dayOfWeek: string;
    hour: number;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    isWeekend: boolean;
    weekNumber: number;
  };
}

export type PersonaType = 'developer' | 'student' | 'creator' | 'gamer' | 'fitness' | 'influencer';

export async function buildInsightContext(
  profileId: string,
  supabase: SupabaseClient
): Promise<InsightContext> {

  const nowLocal = new Date();
  const todayLocalStr = nowLocal.toISOString().slice(0, 10);

  const yesterdayDate = new Date(nowLocal.getTime() - 86400000);
  const yesterdayLocalStr = yesterdayDate.toISOString().slice(0, 10);

  // Fetch all events for this specific profile
  const [profileResult, viewsResult, scansResult, linksResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', profileId).single(),
    supabase.from('profile_view_events').select('*').eq('profile_id', profileId),
    supabase.from('qr_scan_events').select('*').eq('profile_id', profileId),
    supabase.from('link_click_events').select('*').eq('profile_id', profileId)
  ]);

  const profileDataObj = profileResult.data || { display_name: 'Friend', persona: 'creator', tier: 'Starter', persona_data: {} };
  const views = viewsResult.data || [];
  const scans = scansResult.data || [];
  const links = linksResult.data || [];

  const displayName = profileDataObj.display_name || 'Friend';
  const firstName = (displayName.split(' ')[0]) || 'Friend';
  const persona: PersonaType = (profileDataObj.persona || 'creator').toLowerCase() as PersonaType;
  const tier = profileDataObj.tier || 'Starter';
  const personaData = profileDataObj.persona_data || {};

  // Analytics computation
  const totalViews = views.length;

  // Calculate unique visitors using visitor_fp or id fallback exactly like vibe stats
  const uniqueFps = new Set();
  views.forEach((v: any) => uniqueFps.add(v.visitor_fp || v.id));
  scans.forEach((s: any) => uniqueFps.add(s.scanner_fp || s.id));
  const uniqueVisitors = uniqueFps.size;

  const totalQRScans = scans.length;

  // Today scans
  const todayScans = views.filter((v: any) => {
    if (!v.viewed_at) return false;
    return new Date(v.viewed_at).toISOString().slice(0, 10) === todayLocalStr;
  }).length;

  // Yesterday scans
  const yesterdayScans = views.filter((v: any) => {
    if (!v.viewed_at) return false;
    return new Date(v.viewed_at).toISOString().slice(0, 10) === yesterdayLocalStr;
  }).length;

  // Week boundaries (Monday start)
  const dayOfWeekNum = (nowLocal.getDay() + 6) % 7; // Mon=0, Sun=6
  const thisMonday = new Date(nowLocal);
  thisMonday.setDate(nowLocal.getDate() - dayOfWeekNum);
  thisMonday.setHours(0, 0, 0, 0);

  const thisWeekScans = views.filter((v: any) => {
    if (!v.viewed_at) return false;
    return new Date(v.viewed_at) >= thisMonday;
  }).length;

  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(thisMonday.getDate() - 7);
  const lastSunday = new Date(thisMonday);
  lastSunday.setMilliseconds(-1);

  const lastWeekScans = views.filter((v: any) => {
    if (!v.viewed_at) return false;
    const d = new Date(v.viewed_at);
    return d >= lastMonday && d <= lastSunday;
  }).length;

  const liveNow = views.filter((v: any) => {
    if (!v.viewed_at) return false;
    return nowLocal.getTime() - new Date(v.viewed_at).getTime() < 5 * 60 * 1000;
  }).length;

  const scansThisHour = views.filter((v: any) => {
    if (!v.viewed_at) return false;
    return nowLocal.getTime() - new Date(v.viewed_at).getTime() < 60 * 60 * 1000;
  }).length;

  // Week sparkline
  const weekSparkline = Array(7).fill(0);
  for (let i = 0; i < 7; i++) {
    const d = new Date(nowLocal);
    d.setDate(nowLocal.getDate() - (6 - i));
    const ds = d.toISOString().slice(0, 10);
    weekSparkline[i] = views.filter((v: any) => v.viewed_at && new Date(v.viewed_at).toISOString().slice(0, 10) === ds).length;
  }

  // Peak hour
  const hourMap: Record<number, number> = {};
  views.forEach((v: any) => {
    if (!v.viewed_at) return;
    const h = new Date(v.viewed_at).getHours();
    hourMap[h] = (hourMap[h] || 0) + 1;
  });
  const topHourEntry = Object.entries(hourMap).sort((a, b) => b[1] - a[1])[0];
  const peakHour = topHourEntry ? Number(topHourEntry[0]) : null;

  // Peak day
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayMap: Record<string, number> = {};
  views.forEach((v: any) => {
    if (!v.viewed_at) return;
    const dStr = days[new Date(v.viewed_at).getDay()];
    dayMap[dStr] = (dayMap[dStr] || 0) + 1;
  });
  const topDayEntry = Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0];
  const peakDay = topDayEntry ? topDayEntry[0] : null;

  // City Aggregation
  const cityMap: Record<string, { count: number; countryCode: string }> = {};
  scans.forEach((s: any) => {
    if (!s.city || s.city === 'Unknown') return;
    cityMap[s.city] = cityMap[s.city] ?? { count: 0, countryCode: s.country_code || s.country || 'IN' };
    cityMap[s.city].count++;
  });
  const topCities = Object.entries(cityMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([city, v]) => ({ city, count: v.count, countryCode: v.countryCode }));

  // New city today
  const pastCities = new Set();
  scans.forEach((s: any) => {
    if (!s.city || s.city === 'Unknown') return;
    const ds = s.scanned_at || s.created_at || s.viewed_at;
    if (ds && new Date(ds).toISOString().slice(0, 10) < todayLocalStr) {
      pastCities.add(s.city);
    }
  });
  let newCityToday: string | null = null;
  scans.forEach((s: any) => {
    if (!s.city || s.city === 'Unknown') return;
    const ds = s.scanned_at || s.created_at || s.viewed_at;
    if (ds && new Date(ds).toISOString().slice(0, 10) === todayLocalStr && !pastCities.has(s.city)) {
      newCityToday = s.city;
    }
  });

  // Best day
  const dailyViews: Record<string, number> = {};
  views.forEach((v: any) => {
    if (!v.viewed_at) return;
    const d = new Date(v.viewed_at).toISOString().slice(0, 10);
    dailyViews[d] = (dailyViews[d] || 0) + 1;
  });
  const bestDayEntry = Object.entries(dailyViews).sort((a, b) => b[1] - a[1])[0];
  const bestDay = bestDayEntry ? { date: bestDayEntry[0], count: bestDayEntry[1] } : null;

  // Streak
  let streak = 0;
  const daysSet = new Set(Object.keys(dailyViews));
  let checkDate = new Date(nowLocal);
  while (true) {
    const checkStr = checkDate.toISOString().slice(0, 10);
    if (daysSet.has(checkStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Links
  const totalLinkTaps = links.length;
  const linkCounts: Record<string, number> = {};
  links.forEach((l: any) => {
    if (l.link_label || l.label) {
      const label = l.link_label || l.label;
      linkCounts[label] = (linkCounts[label] || 0) + 1;
    }
  });
  const topLinkEntry = Object.entries(linkCounts).sort((a, b) => b[1] - a[1])[0];
  const topLink = topLinkEntry ? { label: topLinkEntry[0], clicks: topLinkEntry[1] } : null;

  // Completion Score
  const { score: completionScore, incomplete: incompleteSections } =
    computeCompletionScore(persona, personaData);

  // Benchmarks
  const PERSONA_BENCHMARKS: Record<string, number> = {
    developer: 45, student: 38, creator: 62, gamer: 41, fitness: 35, influencer: 88
  };
  const platformAvgViews = PERSONA_BENCHMARKS[persona] ?? 50;
  const aboveAverage = totalViews >= platformAvgViews;

  const timeOfDay =
    nowLocal.getHours() < 12 ? 'morning' :
    nowLocal.getHours() < 17 ? 'afternoon' :
    nowLocal.getHours() < 21 ? 'evening' : 'night';

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
      totalViews,
      uniqueVisitors,
      totalQRScans,
      qrScanRate: totalViews > 0 ? Math.round((totalQRScans / totalViews) * 100) : 0,
      repeatScore: uniqueVisitors > 0 ? Math.round(((uniqueVisitors - (totalViews - uniqueVisitors)) / uniqueVisitors) * 100) : 0,
      todayScans,
      yesterdayScans,
      thisWeekScans,
      lastWeekScans,
      weekSparkline,
      peakHour,
      peakDay,
      topCities,
      totalCities: Object.keys(cityMap).length,
      newCityToday,
      totalLinkTaps,
      topLink,
      linkTapRate: totalViews > 0 ? Math.round((totalLinkTaps / totalViews) * 100) : 0,
      bestDay,
      streak,
      liveNow,
      scansThisHour,
    },
    benchmarks: {
      platformAvgViews,
      userPercentile: 50,
      leaderboardRank: null,
      aboveAverage,
    },
    time: {
      dayOfWeek: days[nowLocal.getDay()],
      hour: nowLocal.getHours(),
      timeOfDay,
      isWeekend: nowLocal.getDay() === 0 || nowLocal.getDay() === 6,
      weekNumber: Math.ceil((nowLocal.getDate() + new Date(nowLocal.getFullYear(), nowLocal.getMonth(), 1).getDay()) / 7),
    },
  };
}

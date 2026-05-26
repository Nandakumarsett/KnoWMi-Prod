import { supabase } from '../supabase';

// --- Helpers ---

export function flagEmoji(code) {
  if (!code || code.length !== 2) return '🌍';
  return code.toUpperCase().split('')
    .map(c => String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0)))
    .join('');
}

function fillWeekSparkline(rows) {
  const map = {};
  rows.forEach(r => { map[r.day] = Number(r.count); });
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    result.push(map[key] || 0);
  }
  return result;
}

function computePeakHour(hour) {
  if (hour === null || hour === undefined) return 'afternoon';
  const h = Number(hour);
  const start = h % 12 || 12;
  const end = (h + 3) % 12 || 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  const ampm2 = (h + 3) < 12 ? 'AM' : 'PM';
  return `${start}–${end} ${ampm === ampm2 ? ampm : ampm + '/' + ampm2}`;
}

function computeStreak(scanDays) {
  // scanDays: array of 'YYYY-MM-DD' strings (distinct days with scans), desc order
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  let check = new Date(today);

  const daySet = new Set(scanDays);

  while (true) {
    const key = check.toISOString().split('T')[0];
    if (daySet.has(key)) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function computeWeekDots(weekScanDays) {
  // Mon = 0, Sun = 6 (index in the week)
  const monday = new Date();
  const day = monday.getDay(); // 0=Sun
  const diff = (day === 0 ? -6 : 1 - day);
  monday.setDate(monday.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  const daySet = new Set(weekScanDays);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return daySet.has(d.toISOString().split('T')[0]);
  });
}

function streakMessage(streak) {
  if (streak >= 7) return "Someone has scanned your QR every single day this week. Keep wearing it.";
  if (streak >= 3) return `You're on a ${streak}-day streak. Don't break it now.`;
  if (streak === 1) return "Streak started today. Wear it tomorrow to keep it going.";
  return "No scans yesterday. Your streak broke. Start fresh today 👊";
}

function computeMoments(data) {
  const {
    todayScans, todayCityRows, topLinkToday,
    busiestHourToday, todayRepeats, yesterdayRepeats,
  } = data;

  const moments = [];

  // 1. BUSIEST HOUR
  if (busiestHourToday && busiestHourToday.count > 0) {
    const h = Number(busiestHourToday.hour);
    const label = computePeakHour(h);
    moments.push({
      emoji: '🚀', title: 'Your busiest hour today',
      subtitle: `${busiestHourToday.count} people in 1 hour — ${label}`,
      value: String(busiestHourToday.count), glowColor: 'teal',
    });
  }

  // 2. HOT LINK
  if (topLinkToday && topLinkToday.count > 0) {
    moments.push({
      emoji: '💥', title: `Your ${topLinkToday.link_type || 'profile'} link popped off`,
      subtitle: `Tapped ${topLinkToday.count} times today`,
      value: String(topLinkToday.count), glowColor: 'coral',
    });
  }

  // 3. NEW CITY
  if (todayCityRows && todayCityRows.length > 0) {
    const newest = todayCityRows[0];
    moments.push({
      emoji: '📍', title: `Someone from ${newest.city || 'a new city'} found you`,
      subtitle: `New reach unlocked — ${newest.country_code || ''}`,
      value: '+1', glowColor: 'amber',
    });
  }

  // 4. COMEBACK
  if (todayRepeats > yesterdayRepeats && todayRepeats > 0) {
    moments.push({
      emoji: '🔄', title: `${todayRepeats} people came back today`,
      subtitle: 'They remembered you',
      value: String(todayRepeats), glowColor: 'purple',
    });
  }

  // 5. MILESTONE
  const milestones = [50, 100, 250, 500, 1000, 2500, 5000];
  for (const m of milestones) {
    if (todayScans >= m && todayScans < m * 2) {
      moments.push({
        emoji: '🎯', title: `You just hit ${m} scans!`,
        subtitle: "That's a new milestone",
        value: String(m), glowColor: 'teal',
      });
      break;
    }
  }

  // 6. FIRST SCAN
  if (todayScans === 1) {
    moments.push({
      emoji: '🌅', title: 'First scan of the day!',
      subtitle: "Someone's already looking",
      value: '1', glowColor: 'amber',
    });
  }

  // Max 4, or show waiting state
  if (moments.length === 0) {
    return [{
      emoji: '⏳', title: 'Waiting for your first scan today',
      subtitle: 'Check back soon',
      value: '—', glowColor: 'amber',
      waiting: true,
    }];
  }
  return moments.slice(0, 4);
}

// --- Main fetch function ---

export async function fetchVibeStats(profileId) {
  const fallback = {
    todayScans: 0, liveNow: 0, weekSparkline: [0,0,0,0,0,0,0],
    totalViews: 0, qrViews: 0, uniquePeople: 0, linkTaps: 0, cameBackPct: 0,
    moments: [{ emoji: '⏳', title: 'Waiting for your first scan today', subtitle: 'Check back soon', value: '—', glowColor: 'amber', waiting: true }],
    deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0, topOS: 'Unknown', peakHour: 'afternoon' },
    streak: { currentStreak: 0, weekDots: [false,false,false,false,false,false,false], message: "Start your streak today — wear your KnoWMi tee!" },
    topCities: [], totalCities: 0,
    bestMoment: null,
    deltas: { views: '—', unique: '—', links: '—', repeat: '—' },
  };

  try {
    const [viewRes, scanRes, linkRes] = await Promise.all([
      supabase.from('profile_view_events').select('*').eq('profile_id', profileId),
      supabase.from('qr_scan_events').select('*').eq('profile_id', profileId),
      supabase.from('link_click_events').select('*').eq('profile_id', profileId)
    ]);

    const views = viewRes.data || [];
    const scans = scanRes.data || [];
    const links = linkRes.data || [];

    const totalViews = views.length;
    
    // Calculate unique visitors using visitor_fp or row ID fallback
    const uniqueFps = new Set();
    views.forEach(v => uniqueFps.add(v.visitor_fp || v.id));
    scans.forEach(s => uniqueFps.add(s.scanner_fp || s.id));
    const uniquePeople = uniqueFps.size;

    // QR Scans
    const qrViews = scans.length;

    // Link taps
    const linkTaps = links.length;

    // Repeat count
    const repeatCount = views.filter(v => v.is_repeat === true).length;
    const cameBackPct = totalViews > 0 ? Math.round((repeatCount / totalViews) * 100) : 0;

    // Device breakdown
    const devCounts = { mobile: 0, desktop: 0, tablet: 0 };
    [...views, ...scans].forEach(row => {
      const t = (row.device_type || '').toLowerCase();
      if (['mobile', 'phone', 'iphone', 'android'].includes(t)) {
        devCounts.mobile++;
      } else if (t === 'desktop') {
        devCounts.desktop++;
      } else if (['tablet', 'ipad'].includes(t)) {
        devCounts.tablet++;
      } else if (t !== '') {
        devCounts.desktop++;
      }
    });

    const devTotal = Math.max(devCounts.mobile + devCounts.desktop + devCounts.tablet, 1);
    const mobile = Math.round((devCounts.mobile / devTotal) * 100);
    const desktop = Math.round((devCounts.desktop / devTotal) * 100);
    const tablet = Math.round((devCounts.tablet / devTotal) * 100);

    // Calculate daily stats in the last 30 days
    const dailyMap = {};
    views.forEach(v => {
      const d = new Date(v.viewed_at);
      // Use LOCAL date to avoid IST midnight UTC offset
      const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!dailyMap[day]) dailyMap[day] = { day, total_views: 0, unique_views: new Set() };
      dailyMap[day].total_views++;
      dailyMap[day].unique_views.add(v.visitor_fp || v.id);
    });

    const dailyStats = Object.values(dailyMap)
      .map(d => ({
        day: d.day,
        total_views: d.total_views,
        unique_views: d.unique_views.size
      }))
      .sort((a, b) => a.day.localeCompare(b.day));

    // Calculate Week Sparkline
    const weekSparkline = Array(7).fill(0);
    const weekUniqueSparkline = Array(7).fill(0);
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      // Use local date parts for bucket key
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const match = dailyStats.find(row => row.day === ds);
      weekSparkline[i] = match ? match.total_views : 0;
      weekUniqueSparkline[i] = match ? match.unique_views : 0;
    }

    // Filter events from today — use LOCAL date to avoid IST timezone mismatch
    const nowLocal = new Date();
    const todayLocalStr = `${nowLocal.getFullYear()}-${String(nowLocal.getMonth() + 1).padStart(2, '0')}-${String(nowLocal.getDate()).padStart(2, '0')}`;
    const todayViews = views.filter(v => {
      const d = new Date(v.viewed_at);
      const localStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return localStr === todayLocalStr;
    });
    const todayScans = todayViews.length;


    // Live counter
    const liveNow = views.filter(v => new Date().getTime() - new Date(v.viewed_at).getTime() < 5*60*1000).length;

    // Top Cities
    const cityMap = {};
    [...views, ...scans].forEach(row => {
      if (!row.city || row.city === 'Unknown') return;
      cityMap[row.city] = cityMap[row.city] || { city: row.city, country_code: row.country || 'Unknown', count: 0 };
      cityMap[row.city].count++;
    });

    const sortedCities = Object.values(cityMap).sort((a, b) => b.count - a.count).slice(0, 5);
    const maxCity = sortedCities[0]?.count || 1;
    const topCities = sortedCities.map(c => ({
      ...c,
      flag: flagEmoji(c.country_code || ''),
      barPct: Math.round((c.count / maxCity) * 100),
    }));
    const totalCities = Object.keys(cityMap).length;

    // Streak
    let currentStreak = 0;
    const sortedDaily = [...dailyStats].sort((a, b) => b.day.localeCompare(a.day));
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (sortedDaily.length > 0 && (sortedDaily[0].day === todayStr || sortedDaily[0].day === yesterdayStr)) {
      currentStreak = 1;
      for (let i = 1; i < sortedDaily.length; i++) {
        const d1 = new Date(typeof sortedDaily[i - 1].day === 'string' ? sortedDaily[i - 1].day.replace(' ', 'T') : sortedDaily[i - 1].day);
        const d2 = new Date(typeof sortedDaily[i].day === 'string' ? sortedDaily[i].day.replace(' ', 'T') : sortedDaily[i].day);
        if (Math.round((d1 - d2) / (1000 * 3600 * 24)) === 1) currentStreak++;
        else break;
      }
    }

    // Week dots
    const weekDotDaySet = [...new Set(views.map(v => new Date(v.viewed_at).toISOString().split('T')[0]))];
    const weekDots = computeWeekDots(weekDotDaySet);
    const message = streakMessage(currentStreak);

    // Peak scan hour
    const hourMap = {};
    views.forEach(v => {
      const h = new Date(v.viewed_at).getHours();
      hourMap[h] = (hourMap[h] || 0) + 1;
    });
    const topHourEntry = Object.entries(hourMap).sort((a, b) => b[1] - a[1])[0];
    const peakHour = topHourEntry ? computePeakHour(topHourEntry[0]) : 'afternoon';

    // Best moment
    let bestMoment = null;
    if (sortedDaily.length > 0) {
      const sortedByViews = [...sortedDaily].sort((a, b) => b.total_views - a.total_views);
      bestMoment = {
        maxScansInDay: sortedByViews[0].total_views,
        bestDate: new Date(typeof sortedByViews[0].day === 'string' ? sortedByViews[0].day.replace(' ', 'T') : sortedByViews[0].day).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
      };
    }

    // Moments parameters
    const hourCountsToday = {};
    todayViews.forEach(v => {
      const h = new Date(v.viewed_at).getHours();
      hourCountsToday[h] = (hourCountsToday[h] || 0) + 1;
    });
    const topHourToday = Object.entries(hourCountsToday).sort((a, b) => b[1] - a[1])[0];
    const busiestHourToday = topHourToday ? { hour: topHourToday[0], count: topHourToday[1] } : null;

    const linkCountsToday = {};
    links.filter(l => new Date(l.clicked_at).toISOString().split('T')[0] === today).forEach(l => {
      const t = l.link_type || 'link';
      linkCountsToday[t] = (linkCountsToday[t] || 0) + 1;
    });
    const topLinkEntry = Object.entries(linkCountsToday).sort((a, b) => b[1] - a[1])[0];
    const topLinkToday = topLinkEntry ? { link_type: topLinkEntry[0], count: topLinkEntry[1] } : null;

    const todayRepeats = views.filter(v => v.is_repeat === true && new Date(v.viewed_at).toISOString().split('T')[0] === today).length;
    const yesterdayRepeats = views.filter(v => v.is_repeat === true && new Date(v.viewed_at).toISOString().split('T')[0] === yesterdayStr).length;

    const todayCityRows = [...new Set(todayViews.map(v => v.city).filter(Boolean))].map(city => ({
      city, country_code: 'Unknown'
    }));

    const moments = computeMoments({ todayScans, todayCityRows, topLinkToday, busiestHourToday, todayRepeats, yesterdayRepeats });

    // Deltas
    const viewsLast7 = views.filter(v => new Date().getTime() - new Date(v.viewed_at).getTime() < 7*24*60*60*1000).length;
    const viewsPrev7 = views.filter(v => {
      const age = new Date().getTime() - new Date(v.viewed_at).getTime();
      return age >= 7*24*60*60*1000 && age < 14*24*60*60*1000;
    }).length;
    const viewsDelta = viewsPrev7 > 0 ? Math.round(((viewsLast7 - viewsPrev7) / viewsPrev7) * 100) : null;

    const uniqueToday = new Set(todayViews.map(v => v.visitor_fp || v.id).filter(Boolean)).size;

    return {
      todayScans, liveNow, weekSparkline,
      totalViews, qrViews, uniquePeople, linkTaps, cameBackPct,
      moments,
      deviceBreakdown: { mobile, desktop, tablet, topOS: 'Android', peakHour },
      streak: { currentStreak, weekDots, message },
      topCities, totalCities,
      bestMoment,
      deltas: {
        views: viewsDelta !== null ? `${viewsDelta >= 0 ? '↑' : '↓'} ${Math.abs(viewsDelta)}% this week` : '—',
        unique: uniqueToday > 0 ? `↑ ${uniqueToday} new today` : 'All-time unique visitors',
        links: '—',
        repeat: '—'
      }
    };
  } catch (err) {
    console.error('fetchVibeStats error:', err);
    return fallback;
  }
}


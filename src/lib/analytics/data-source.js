import { supabase } from '../supabase';

// This is the ONLY place that queries analytics data.
// Both VibeStats tab and Reports tab import from here.

export async function getAnalyticsData(profileId, dateRange = 'all') {
  try {
    // Fetch all analytics data in parallel for speed
    const [viewRes, scanRes, { data: linksData, error: linksError }] = await Promise.all([
      supabase.from('profile_view_events').select('*, viewer:profiles(id, first_name, last_name, avatar_url)').eq('profile_id', profileId).then(res => {
        if (res.error) {
          console.warn("Analytics: Falling back to simple view fetch", res.error.message);
          return supabase.from('profile_view_events').select('*').eq('profile_id', profileId);
        }
        return res;
      }),
      supabase.from('qr_scan_events').select('*, scanner:profiles(id, first_name, last_name, avatar_url)').eq('profile_id', profileId).then(res => {
        if (res.error) {
          console.warn("Analytics: Falling back to simple scan fetch", res.error.message);
          return supabase.from('qr_scan_events').select('*').eq('profile_id', profileId);
        }
        return res;
      }),
      supabase.from('link_click_events').select('*').eq('profile_id', profileId)
    ]);

    let views = viewRes.data || [];
    let scans = scanRes.data || [];
    let links = linksData || [];

    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      const todayStr = now.toLocaleDateString();

      const filterFn = (ev) => {
        const d = new Date(ev.viewed_at || ev.scanned_at || ev.clicked_at || ev.created_at);
        if (isNaN(d.getTime())) return false;
        const localDayStr = d.toLocaleDateString();

        if (dateRange === 'today') {
          return localDayStr === todayStr;
        } else if (dateRange === 'yesterday') {
          const yes = new Date(); yes.setDate(yes.getDate() - 1);
          return localDayStr === yes.toLocaleDateString();
        } else if (dateRange === 'last_7') {
          const limit = new Date(); limit.setDate(limit.getDate() - 7);
          return d >= limit;
        } else if (dateRange === 'last_week') {
          const limit = new Date(); limit.setDate(limit.getDate() - 7);
          return d >= limit;
        } else if (dateRange === 'last_month') {
          const limit = new Date(); limit.setDate(limit.getDate() - 30);
          return d >= limit;
        } else if (dateRange === 'ytd') {
          const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
          return d >= firstDayOfYear;
        }
        return true;
      };

      views = views.filter(filterFn);
      scans = scans.filter(filterFn);
      links = links.filter(filterFn);
    }

    const totalViews = views.length;
    
    // Calculate unique visitors using visitor_fp or row ID fallback
    const uniqueFps = new Set();
    views.forEach(v => uniqueFps.add(v.visitor_fp || v.id));
    scans.forEach(s => uniqueFps.add(s.scanner_fp || s.id));
    const uniqueViews = uniqueFps.size;

    // QR Scans
    const totalQRScans = scans.length;

    // Repeat count
    const repeatCount = views.filter(v => v.is_repeat === true).length;

    // Device breakdown
    const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 };
    [...views, ...scans].forEach(row => {
      const t = (row.device_type || '').toLowerCase();
      if (['mobile', 'phone', 'iphone', 'android'].includes(t)) {
        deviceCounts.mobile++;
      } else if (t === 'desktop') {
        deviceCounts.desktop++;
      } else if (['tablet', 'ipad'].includes(t)) {
        deviceCounts.tablet++;
      } else if (t !== '') {
        deviceCounts.desktop++;
      }
    });

    const deviceTotal = Math.max(deviceCounts.mobile + deviceCounts.desktop + deviceCounts.tablet, 1);
    const deviceBreakdown = {
      mobile: Math.round((deviceCounts.mobile / deviceTotal) * 100),
      desktop: Math.round((deviceCounts.desktop / deviceTotal) * 100),
      tablet: Math.round((deviceCounts.tablet / deviceTotal) * 100),
      hasData: deviceTotal > 1
    };

    // Calculate daily stats in the last 30 days
    const dailyMap = {};
    views.forEach(v => {
      const day = new Date(v.viewed_at).toISOString().split('T')[0];
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

    // Calculate Week Sparklines
    const weekSparkline = Array(7).fill(0);
    const weekUniqueSparkline = Array(7).fill(0);
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      const ds = d.toISOString().split('T')[0];
      const match = dailyStats.find(row => row.day === ds);
      weekSparkline[i] = match ? match.total_views : 0;
      weekUniqueSparkline[i] = match ? match.unique_views : 0;
    }

    // Filter events from today
    const nowLocal = new Date();
    const todayStart = new Date(nowLocal.getFullYear(), nowLocal.getMonth(), nowLocal.getDate()).toISOString().split('T')[0];
    const todayViews = views.filter(v => new Date(v.viewed_at).toISOString().split('T')[0] === todayStart);
    const realTimeToday = todayViews.length;

    // Top Cities
    const cityCounts = {};
    [...views, ...scans].forEach(row => {
      if (!row.city || row.city === 'Unknown') return;
      cityCounts[row.city] = cityCounts[row.city] || { count: 0, country: row.country || 'Unknown' };
      cityCounts[row.city].count++;
    });

    const topCities = Object.entries(cityCounts)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([city, data]) => ({
        city,
        ...data,
        barPct: Math.round((data.count / Math.max(...Object.values(cityCounts).map(c => c.count), 1)) * 100)
      }));

    // Explicit views with qr source or referrer
    const qrViewsCount = views.filter(v => {
      const ref = (v.referrer || '').toLowerCase();
      return ref.includes('qr') || ref.includes('utm_source');
    }).length;

    const effectiveQRScans = Math.max(totalQRScans, qrViewsCount);
    const tshirtScans = scans.length + views.filter(v => {
      const ref = (v.referrer || '').toLowerCase();
      return ref.includes('tshirt') || ref.includes('tee');
    }).length;

    const profileQRScans = views.filter(v => {
      const ref = (v.referrer || '').toLowerCase();
      return (ref.includes('qr') || ref.includes('utm_source')) && !(ref.includes('tshirt') || ref.includes('tee'));
    }).length;

    const qrScanRate = totalViews > 0 ? Math.round((effectiveQRScans / totalViews) * 100) : 0;

    // Calculate Real Streak
    let currentStreak = 0;
    const sortedDaily = [...dailyStats].sort((a, b) => b.day.localeCompare(a.day));
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (sortedDaily.length > 0 && (sortedDaily[0].day === todayStr || sortedDaily[0].day === yesterdayStr)) {
      currentStreak = 1;
      for (let i = 1; i < sortedDaily.length; i++) {
        const d1 = new Date(sortedDaily[i - 1].day);
        const d2 = new Date(sortedDaily[i].day);
        if (Math.round((d1 - d2) / (1000 * 3600 * 24)) === 1) currentStreak++;
        else break;
      }
    }

    // Best scan day
    let bestDay = null;
    if (sortedDaily.length > 0) {
      const sortedByViews = [...sortedDaily].sort((a, b) => b.total_views - a.total_views);
      bestDay = {
        day: sortedByViews[0].day,
        total_views: sortedByViews[0].total_views
      };
    }

    // Peak scan hour
    const hourCounts = {};
    views.forEach(v => {
      const h = new Date(v.viewed_at).getHours();
      hourCounts[h] = (hourCounts[h] || 0) + 1;
    });
    let peakHour = null;
    const sortedHours = Object.entries(hourCounts).sort((a, b) => b[1] - a[1]);
    if (sortedHours.length > 0) {
      peakHour = `${sortedHours[0][0]}:00`;
    }

    // Latest activity
    const latestActivity = views
      .map(v => ({
        viewed_at: v.viewed_at,
        referrer: v.referrer,
        device_type: v.device_type,
        city: v.city,
        country: v.country,
        is_repeat: v.is_repeat,
        visitor: v.viewer || null // Include visitor profile if available
      }))
      .sort((a, b) => new Date(b.viewed_at).getTime() - new Date(a.viewed_at).getTime())
      .slice(0, 20);

    // Referral Sources
    const referrerCounts = {};
    [...views, ...scans].forEach(row => {
      const ref = (row.referrer || 'direct').toLowerCase();
      referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
    });
    const topReferrers = Object.entries(referrerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .reduce((acc, [ref, count]) => ({ ...acc, [ref]: count }), {});

    return {
      totalViews,
      uniqueViews,
      totalQRScans: effectiveQRScans,
      tshirtScans,
      profileQRScans,
      qrScanRate,
      repeatScore: totalViews > 0 ? Math.round((repeatCount / totalViews) * 100) : 0,
      todayTotal: realTimeToday,
      todayUnique: weekUniqueSparkline[6] || (todayViews.length > 0 ? 1 : 0),
      deviceBreakdown,
      topCities,
      totalCities: Object.keys(cityCounts).length,
      latestActivity,
      topReferrers,
      dailyStats,
      weekSparkline,
      streak: { current: currentStreak, best: currentStreak, status: currentStreak > 0 ? 'Active' : 'Building' },
      bestDay,
      peakHour,
      totalLinkTaps: links.length
    };
  } catch (err) {
    console.error('getAnalyticsData error:', err);
    return {
      totalViews: 0,
      uniqueViews: 0,
      totalQRScans: 0,
      qrScanRate: 0,
      repeatScore: 0,
      todayTotal: 0,
      todayUnique: 0,
      deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0, hasData: false },
      topCities: [],
      latestActivity: [],
      topReferrers: {},
      dailyStats: [],
      weekSparkline: [0,0,0,0,0,0,0],
      streak: { current: 0, best: 0, status: 'Building' },
      bestDay: null,
      peakHour: null,
      totalLinkTaps: 0
    };
  }
}

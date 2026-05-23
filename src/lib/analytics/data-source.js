import { supabase } from '../supabase';

// This is the ONLY place that queries analytics data.
// Both VibeStats tab and Reports tab import from here.

export async function getAnalyticsData(profileId, dateRange = 'all') {
  try {
    // Fetch analytics data via edge function (uses SERVICE ROLE, bypasses RLS)
    // This is critical: without this, Kishore's dashboard cannot see scans
    // by OTHER users (Rashmika, Owner, etc.) due to SELECT RLS policies.
    let views = [], scans = [], links = [];

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (token) {
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-profile-analytics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ profileId }),
        });

        if (res.ok) {
          const payload = await res.json();
          views = payload.views || [];
          scans = payload.scans || [];
          links = payload.links || [];
          console.log(`Analytics loaded via edge function: ${views.length} views, ${scans.length} scans`);
        } else {
          console.warn('get-profile-analytics edge function returned error, falling back to direct queries');
          throw new Error('Edge function failed');
        }
      } else {
        throw new Error('No session');
      }
    } catch (edgeFnErr) {
      // Fallback: direct queries (may be limited by RLS but better than nothing)
      console.warn('Using direct Supabase queries for analytics (RLS may limit results):', edgeFnErr.message);
      const viewRes = await supabase.from('profile_view_events').select('*').eq('profile_id', profileId);
      if (viewRes.error) console.error("Analytics: Error fetching views:", viewRes.error.message);

      const scanRes = await supabase.from('qr_scan_events').select('*').eq('profile_id', profileId);
      if (scanRes.error) console.error("Analytics: Error fetching scans:", scanRes.error.message);

      const { data: linksData } = await supabase.from('link_click_events').select('*').eq('profile_id', profileId);

      views = viewRes.data || [];
      scans = scanRes.data || [];
      links = linksData || [];
    }


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
    views.forEach(v => uniqueFps.add(v.viewer_id || v.visitor_fp || v.id));
    scans.forEach(s => uniqueFps.add(s.scanner_id || s.scanner_fp || s.id));
    const uniqueViews = uniqueFps.size;

    // QR Scans
    const totalQRScans = scans.length;

    // Repeat count (calculate dynamically using fingerprints)
    const fpCounts = {};
    views.forEach(v => {
      const fp = v.viewer_id || v.visitor_fp || v.id;
      fpCounts[fp] = (fpCounts[fp] || 0) + 1;
    });
    let repeatCount = 0;
    Object.values(fpCounts).forEach(count => {
      if (count > 1) {
        repeatCount += (count - 1);
      }
    });

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
      const d = new Date(v.viewed_at);
      // Use LOCAL date to avoid IST midnight UTC offset
      const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!dailyMap[day]) dailyMap[day] = { day, total_views: 0, unique_views: new Set() };
      dailyMap[day].total_views++;
      dailyMap[day].unique_views.add(v.viewer_id || v.visitor_fp || v.id);
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
      // Use local date parts for bucket key
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const match = dailyStats.find(row => row.day === ds);
      weekSparkline[i] = match ? match.total_views : 0;
      weekUniqueSparkline[i] = match ? match.unique_views : 0;
    }

    // "People who discovered you today" = unique people who visited via ?src=tshirt today
    // Source: profile_view_events with referrer='tshirt' (this table always works, no RLS issues)
    // Rules:
    //   - Only today's events (using local IST date)
    //   - Same person visiting multiple times today = counts as 1
    //   - Identity: viewer_id (account ID, stable) → visitor_fp (fingerprint) → row id
    const nowLocal = new Date();
    const todayLocalStr = `${nowLocal.getFullYear()}-${String(nowLocal.getMonth() + 1).padStart(2, '0')}-${String(nowLocal.getDate()).padStart(2, '0')}`;
    
    const uniqueScannersToday = new Set();
    views.forEach(v => {
      const d = new Date(v.viewed_at);
      const localStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const ref = (v.referrer || '').toLowerCase();
      const isTshirt = ref === 'tshirt' || ref.includes('tshirt') || ref.includes('tee');
      if (localStr === todayLocalStr && isTshirt) {
        // Prefer stable account ID over rotating fingerprint
        const identity = v.viewer_id || v.visitor_fp || v.id;
        uniqueScannersToday.add(identity);
      }
    });
    const realTimeToday = uniqueScannersToday.size;

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
    // tshirtScans = unique people who arrived via QR T-shirt (from profile_view_events, referrer=tshirt)
    const tshirtScanViews = views.filter(v => {
      const ref = (v.referrer || '').toLowerCase();
      return ref === 'tshirt' || ref.includes('tshirt') || ref.includes('tee');
    });
    const uniqueTshirtScanners = new Set(tshirtScanViews.map(v => v.viewer_id || v.visitor_fp || v.id));
    const tshirtScans = uniqueTshirtScanners.size;

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

    let bestMoment = null;
    if (bestDay) {
      // Sort ALL views chronologically descending by viewed_at to get the most recent overall
      const sortedAllViews = [...views].sort((a, b) => new Date(b.viewed_at).getTime() - new Date(a.viewed_at).getTime());

      // Take top 5 most recent views
      const top5Views = sortedAllViews.slice(0, 5);

      // Build a map of visitor_fp -> viewer_id from all views in the fetched dataset
      const fpToViewerMap = {};
      views.forEach(v => {
        const vId = v.viewer_id || v.user_id;
        if (v.visitor_fp && vId) {
          fpToViewerMap[v.visitor_fp] = vId;
        }
      });

      const guestFps = top5Views
        .filter(v => !(v.viewer_id || v.user_id || fpToViewerMap[v.visitor_fp]))
        .map(v => v.visitor_fp)
        .filter(Boolean);

      if (guestFps.length > 0) {
        try {
          // Query profile_view_events globally
          const { data: viewFpMappings } = await supabase
            .from('profile_view_events')
            .select('visitor_fp, viewer_id')
            .in('visitor_fp', guestFps)
            .not('viewer_id', 'is', null);
            
          if (viewFpMappings) {
            viewFpMappings.forEach(m => {
              if (m.viewer_id) {
                fpToViewerMap[m.visitor_fp] = m.viewer_id;
              }
            });
          }

          // Query qr_scan_events for scanner_fp mappings
          const missingFps = guestFps.filter(fp => !fpToViewerMap[fp]);
          if (missingFps.length > 0) {
            const { data: scanFpMappings } = await supabase
              .from('qr_scan_events')
              .select('scanner_fp, scanner_id')
              .in('scanner_fp', missingFps)
              .not('scanner_id', 'is', null);
              
            if (scanFpMappings) {
              scanFpMappings.forEach(m => {
                if (m.scanner_id) {
                  fpToViewerMap[m.scanner_fp] = m.scanner_id;
                }
              });
            }
          }
        } catch (e) {
          console.warn("Analytics: Error fetching global fp mappings:", e);
        }
      }

      // Collect all resolved viewer IDs to fetch profiles in a single query
      const targetViewerIds = [...new Set(top5Views.map(v => v.viewer_id || v.user_id || fpToViewerMap[v.visitor_fp]).filter(Boolean))];
      let viewerProfilesMap = {};
      
      if (targetViewerIds.length > 0) {
        try {
          const { data: profilesList } = await supabase
            .from('profiles')
            .select('id, user_id, first_name, last_name, display_name, username, avatar_url, secure_slug')
            .or(`id.in.(${targetViewerIds.map(id => `"${id}"`).join(',')}),user_id.in.(${targetViewerIds.map(id => `"${id}"`).join(',')})`);
          
          if (profilesList) {
            profilesList.forEach(p => {
              if (p.id) viewerProfilesMap[p.id] = p;
              if (p.user_id) viewerProfilesMap[p.user_id] = p;
            });
          }
        } catch (e) {
          console.warn("Analytics: Error fetching viewer profiles for bestMoment top 5:", e);
        }
      }

      // Build the viewers list
      const viewers = top5Views.map(v => {
        const vId = v.viewer_id || v.user_id || fpToViewerMap[v.visitor_fp];
        const profile = vId ? viewerProfilesMap[vId] : null;

        let name = 'Anonymous Guest';
        let avatar = null;

        if (profile) {
          const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim();
          name = fullName || profile.display_name || profile.username || 'KnoWMi Member';
          avatar = profile.avatar_url;
        } else {
          // If guest, enhance with location if available
          const locationParts = [v.city, v.country].filter(Boolean);
          if (locationParts.length > 0) {
            name = `Guest from ${locationParts.join(', ')}`;
          }
        }

        return {
          name,
          avatar,
          viewedAt: v.viewed_at,
          secureSlug: profile ? (profile.secure_slug || profile.id) : null
        };
      });

      bestMoment = {
        maxScansInDay: bestDay.total_views,
        bestDate: new Date(bestDay.day).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
        viewers
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

    // Sort and slice top 20 latest views
    const topViews = [...views]
      .sort((a, b) => new Date(b.viewed_at).getTime() - new Date(a.viewed_at).getTime())
      .slice(0, 20);

    // Fetch visitor profiles for these top views to display on the dashboard privately
    const viewerIds = [...new Set(topViews.map(v => v.viewer_id || v.user_id).filter(Boolean))];
    let visitorProfiles = [];
    if (viewerIds.length > 0) {
      try {
        const { data: profs } = await supabase
          .from('profiles')
          .select('id, user_id, first_name, last_name, avatar_url')
          .or(`id.in.(${viewerIds.map(id => `"${id}"`).join(',')}),user_id.in.(${viewerIds.map(id => `"${id}"`).join(',')})`);
        if (profs) {
          visitorProfiles = profs;
        }
      } catch (e) {
        console.warn("Analytics: Error fetching visitor profiles for activity log:", e);
      }
    }

    // Latest activity
    const latestActivity = topViews
      .map(v => {
        const vId = v.viewer_id || v.user_id;
        const prof = visitorProfiles.find(p => p.id === vId || p.user_id === vId) || null;
        return {
          viewed_at: v.viewed_at,
          referrer: v.referrer,
          device_type: v.device_type,
          city: v.city,
          country: v.country,
          is_repeat: v.is_repeat,
          visitor: prof
        };
      });

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
      bestMoment,
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

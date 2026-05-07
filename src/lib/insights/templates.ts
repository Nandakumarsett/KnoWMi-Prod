import { InsightContext, PersonaType } from './build-context';

export interface InsightTemplate {
  id: string;
  type: 'top_moment' | 'pattern' | 'best_time' | 'growth_tip' | 'comparison';
  emoji: string;
  headline: string;           // max 12 words, use {tokens}
  body: string;               // max 2 sentences, use {tokens}
  cta?: string;
  cta_url?: string;
  data_point?: string;        // key number shown as pill, use {tokens}
  condition: (ctx: InsightContext) => boolean;   // when to use this template
  personas?: PersonaType[];   // undefined = all personas
  priority: number;           // lower = higher priority within type
  tokens: (ctx: InsightContext) => Record<string, string>;
}

// ── TOP MOMENT TEMPLATES ─────────────────────────────────────────────────

export const TOP_MOMENT_TEMPLATES: InsightTemplate[] = [

  // New personal best today
  {
    id: 'tm_new_daily_record',
    type: 'top_moment',
    emoji: '🏆',
    headline: 'New all-time daily record. {todayScans} scans.',
    body: "That's your best single day ever, {firstName}. Whatever you did today — do it again tomorrow.",
    data_point: '{todayScans} scans today',
    condition: ctx =>
      ctx.analytics.todayScans > 0 &&
      ctx.analytics.bestDay !== null &&
      ctx.analytics.todayScans > ctx.analytics.bestDay.count,
    priority: 1,
    tokens: ctx => ({
      todayScans: String(ctx.analytics.todayScans),
      firstName: ctx.profile.firstName,
    }),
  },

  // Best week ever
  {
    id: 'tm_best_week',
    type: 'top_moment',
    emoji: '🔥',
    headline: 'Your biggest week yet.',
    body: '{thisWeek} scans this week — {delta}% more than last week. The tee is doing its job.',
    data_point: '{thisWeek} scans this week',
    condition: ctx =>
      ctx.analytics.thisWeekScans > ctx.analytics.lastWeekScans &&
      ctx.analytics.lastWeekScans > 0 &&
      ctx.analytics.thisWeekScans >= 10,
    priority: 2,
    tokens: ctx => ({
      thisWeek: String(ctx.analytics.thisWeekScans),
      delta: String(Math.round(((ctx.analytics.thisWeekScans - ctx.analytics.lastWeekScans) / ctx.analytics.lastWeekScans) * 100)),
    }),
  },

  // New city unlocked today
  {
    id: 'tm_new_city',
    type: 'top_moment',
    emoji: '📍',
    headline: '{city} just discovered you.',
    body: "Someone {distance} scanned your tee for the first time. You're spreading, {firstName}.",
    data_point: 'New city unlocked',
    condition: ctx => ctx.analytics.newCityToday !== null,
    priority: 1,
    tokens: ctx => ({
      city: ctx.analytics.newCityToday ?? 'A new city',
      firstName: ctx.profile.firstName,
      distance: ctx.analytics.topCities[0]?.city
        ? `from ${ctx.analytics.newCityToday}`
        : 'far away',
    }),
  },

  // Solid scan day (not a record, but good)
  {
    id: 'tm_solid_day',
    type: 'top_moment',
    emoji: '⚡',
    headline: '{todayScans} people checked you out today.',
    body: "That's {comparison} your daily average. Solid. Keep the tee on.",
    data_point: '{todayScans} scans',
    condition: ctx => ctx.analytics.todayScans >= 5,
    priority: 3,
    tokens: ctx => {
      const avg = ctx.analytics.thisWeekScans / 7;
      return {
        todayScans: String(ctx.analytics.todayScans),
        comparison: ctx.analytics.todayScans > avg * 1.5 ? 'way above' : 'above',
      };
    },
  },

  // First scan ever
  {
    id: 'tm_first_scan_ever',
    type: 'top_moment',
    emoji: '🌱',
    headline: "Your first scan. It's real now.",
    body: "Someone just discovered you. This is day one. Everything starts here.",
    data_point: '1st scan',
    condition: ctx => ctx.analytics.totalQRScans === 1,
    priority: 1,
    tokens: () => ({}),
  },

  // First scan today (daily opener)
  {
    id: 'tm_first_scan_today',
    type: 'top_moment',
    emoji: '☀️',
    headline: 'First scan of the day.',
    body: "Someone's already looking, {firstName}. {timeGreeting}.",
    data_point: 'Today started',
    condition: ctx => ctx.analytics.todayScans === 1,
    priority: 2,
    tokens: ctx => ({
      firstName: ctx.profile.firstName,
      timeGreeting: ctx.time.timeOfDay === 'morning' ? 'Good start to the morning'
        : ctx.time.timeOfDay === 'afternoon' ? 'Afternoon energy is real'
        : 'Evening crowd is noticing you',
    }),
  },

  // Zero scans today but streak ongoing
  {
    id: 'tm_zero_but_streak',
    type: 'top_moment',
    emoji: '🎯',
    headline: "No scans yet today. {streak}-day streak is waiting.",
    body: "You've been scanned every day for {streak} days. Today's the day to keep it going.",
    data_point: '{streak}-day streak',
    condition: ctx => ctx.analytics.todayScans === 0 && ctx.analytics.streak >= 3,
    priority: 2,
    tokens: ctx => ({ streak: String(ctx.analytics.streak) }),
  },

  // Zero scans, morning
  {
    id: 'tm_zero_morning',
    type: 'top_moment',
    emoji: '👕',
    headline: 'Wear your tee. Go out and chill.',
    body: 'The best scan is the one that happens when you stop thinking about it.',
    data_point: '0 scans today',
    condition: ctx => ctx.analytics.todayScans === 0 && ctx.time.timeOfDay === 'morning',
    priority: 5,
    tokens: () => ({}),
  },

  // Zero scans, evening
  {
    id: 'tm_zero_evening',
    type: 'top_moment',
    emoji: '🌆',
    headline: "Evening still counts. Get out.",
    body: "The day isn't over. One scan is better than zero.",
    data_point: '0 scans today',
    condition: ctx => ctx.analytics.todayScans === 0 && ctx.time.timeOfDay === 'evening',
    priority: 5,
    tokens: () => ({}),
  },

  // Zero scans, night
  {
    id: 'tm_zero_night',
    type: 'top_moment',
    emoji: '🌙',
    headline: "Zero today. Tomorrow's a clean slate.",
    body: "Sleep well. Tomorrow, wear it early.",
    data_point: '0 scans today',
    condition: ctx => ctx.analytics.todayScans === 0 && ctx.time.timeOfDay === 'night',
    priority: 5,
    tokens: () => ({}),
  },

  // High repeat visitors
  {
    id: 'tm_high_repeat',
    type: 'top_moment',
    emoji: '🔄',
    headline: "People keep coming back to your profile.",
    body: "{repeatPct}% of your visitors have returned more than once. That's not curiosity. That's interest.",
    data_point: '{repeatPct}% return rate',
    condition: ctx => ctx.analytics.repeatScore >= 30 && ctx.analytics.uniqueVisitors >= 10,
    priority: 3,
    tokens: ctx => ({ repeatPct: String(ctx.analytics.repeatScore) }),
  },

  // Persona-specific: Developer - commits milestone feel
  {
    id: 'tm_dev_milestone',
    type: 'top_moment',
    emoji: '🚀',
    headline: '{totalViews} profile views. Like stars on a repo.',
    body: "Real people have loaded your profile {totalViews} times. That's not vanity — that's reach.",
    data_point: '{totalViews} total views',
    condition: ctx => ctx.profile.persona === 'developer' && ctx.analytics.totalViews >= 50,
    personas: ['developer'],
    priority: 4,
    tokens: ctx => ({ totalViews: String(ctx.analytics.totalViews) }),
  },

  // Persona-specific: Gamer - hyped
  {
    id: 'tm_gamer_hype',
    type: 'top_moment',
    emoji: '🎮',
    headline: "{todayScans} new players entered your world today.",
    body: "No cap. {todayScans} people scanned your tee. That's a lobby.",
    data_point: '{todayScans} scans',
    condition: ctx => ctx.profile.persona === 'gamer' && ctx.analytics.todayScans >= 3,
    personas: ['gamer'],
    priority: 3,
    tokens: ctx => ({ todayScans: String(ctx.analytics.todayScans) }),
  },

  // Persona-specific: Fitness - streak energy
  {
    id: 'tm_fitness_streak',
    type: 'top_moment',
    emoji: '💪',
    headline: "{streak} days straight. Consistency shows.",
    body: "You've been scanned {streak} consecutive days. The dedication is visible — literally.",
    data_point: '{streak}-day scan streak',
    condition: ctx => ctx.profile.persona === 'fitness' && ctx.analytics.streak >= 5,
    personas: ['fitness'],
    priority: 2,
    tokens: ctx => ({ streak: String(ctx.analytics.streak) }),
  },

  // Persona-specific: Creator - the algorithm
  {
    id: 'tm_creator_spread',
    type: 'top_moment',
    emoji: '✨',
    headline: "{cities} cities discovered your identity this week.",
    body: "Real people in real places found you. The tee is your distribution channel.",
    data_point: '{cities} cities',
    condition: ctx => ctx.profile.persona === 'creator' && ctx.analytics.totalCities >= 3,
    personas: ['creator'],
    priority: 3,
    tokens: ctx => ({ cities: String(ctx.analytics.totalCities) }),
  },

  // Persona-specific: Student - campus energy
  {
    id: 'tm_student_social',
    type: 'top_moment',
    emoji: '🎓',
    headline: "{todayScans} people got curious about you today.",
    body: "That's more than most people get at orientation. Your tee is working, lowkey.",
    data_point: '{todayScans} new views',
    condition: ctx => ctx.profile.persona === 'student' && ctx.analytics.todayScans >= 2,
    personas: ['student'],
    priority: 3,
    tokens: ctx => ({ todayScans: String(ctx.analytics.todayScans) }),
  },

  // Persona-specific: Influencer - metrics
  {
    id: 'tm_influencer_reach',
    type: 'top_moment',
    emoji: '📱',
    headline: "Physical reach: {totalViews} impressions. Zero algorithm.",
    body: "No feed. No boost. Just you wearing the tee. {totalViews} people still showed up.",
    data_point: '{totalViews} impressions',
    condition: ctx => ctx.profile.persona === 'influencer' && ctx.analytics.totalViews >= 20,
    personas: ['influencer'],
    priority: 3,
    tokens: ctx => ({ totalViews: String(ctx.analytics.totalViews) }),
  },
  {
    id: 'tm_starter',
    type: 'top_moment',
    emoji: '✦',
    headline: 'Welcome to your AI Insights.',
    body: "Keep wearing your KnoWMi tee to capture more scans and unlock premium breakdowns.",
    data_point: 'Ready',
    condition: () => true,
    priority: 10,
    tokens: () => ({}),
  },
];

// ── PATTERN TEMPLATES ────────────────────────────────────────────────────

export const PATTERN_TEMPLATES: InsightTemplate[] = [

  {
    id: 'pt_peak_hour_confirmed',
    type: 'pattern',
    emoji: '🕐',
    headline: 'You peak at {peakHour}. Every time.',
    body: 'Your historical data is clear — {peakHour} is your golden window. That is when people scan.',
    data_point: 'Peak: {peakHour}',
    condition: ctx => ctx.analytics.peakHour !== null && ctx.analytics.totalViews >= 5,
    priority: 1,
    tokens: ctx => ({ peakHour: formatHour(ctx.analytics.peakHour!) }),
  },

  {
    id: 'pt_peak_day',
    type: 'pattern',
    emoji: '📅',
    headline: '{peakDay}s belong to you.',
    body: 'More people discover you on {peakDay}s than any other day. Wear your best outfit on {peakDay}.',
    data_point: 'Best: {peakDay}',
    condition: ctx => ctx.analytics.peakDay !== null && ctx.analytics.totalViews >= 5,
    priority: 2,
    tokens: ctx => ({ peakDay: ctx.analytics.peakDay! }),
  },

  {
    id: 'pt_qr_dominant',
    type: 'pattern',
    emoji: '📲',
    headline: '{qrRate}% of your views come from the physical tee.',
    body: "The tee is your main channel. Not Instagram. Not LinkedIn. The tee. Wear it more.",
    data_point: '{qrRate}% QR-driven',
    condition: ctx => ctx.analytics.qrScanRate >= 60 && ctx.analytics.totalViews >= 10,
    priority: 2,
    tokens: ctx => ({ qrRate: String(ctx.analytics.qrScanRate) }),
  },

  {
    id: 'pt_link_clicks_strong',
    type: 'pattern',
    emoji: '🔗',
    headline: 'Strangers are actually clicking your links.',
    body: '{linkTapRate}% of visitors tap at least one link. That means they want more of you.',
    data_point: '{linkTapRate}% click-through',
    condition: ctx => ctx.analytics.linkTapRate >= 20 && ctx.analytics.totalViews >= 15,
    priority: 3,
    tokens: ctx => ({ linkTapRate: String(ctx.analytics.linkTapRate) }),
  },

  {
    id: 'pt_top_link',
    type: 'pattern',
    emoji: '💥',
    headline: 'Your {linkLabel} is the one they click.',
    body: "Out of everything on your profile, {linkLabel} gets the most taps. It's clearly what people want.",
    data_point: '{clicks} taps',
    condition: ctx => ctx.analytics.topLink !== null && ctx.analytics.topLink.clicks >= 3,
    priority: 3,
    tokens: ctx => ({
      linkLabel: ctx.analytics.topLink!.label,
      clicks: String(ctx.analytics.topLink!.clicks),
    }),
  },

  {
    id: 'pt_growing_week',
    type: 'pattern',
    emoji: '📈',
    headline: 'Week-over-week growth: +{delta}%.',
    body: "This week is {delta}% bigger than last week. The momentum is real.",
    data_point: '+{delta}% this week',
    condition: ctx =>
      ctx.analytics.lastWeekScans > 0 &&
      ctx.analytics.thisWeekScans > ctx.analytics.lastWeekScans,
    priority: 2,
    tokens: ctx => ({
      delta: String(Math.round(((ctx.analytics.thisWeekScans - ctx.analytics.lastWeekScans) / ctx.analytics.lastWeekScans) * 100)),
    }),
  },

  {
    id: 'pt_multi_city',
    type: 'pattern',
    emoji: '🗺️',
    headline: 'You exist in {cities} cities simultaneously.',
    body: 'People in {city1}{separator}{city2} have all seen your profile. One tee. {cities} cities.',
    data_point: '{cities} cities reached',
    condition: ctx => ctx.analytics.totalCities >= 3,
    priority: 3,
    tokens: ctx => ({
      cities: String(ctx.analytics.totalCities),
      city1: ctx.analytics.topCities[0]?.city ?? 'multiple cities',
      city2: ctx.analytics.topCities[1]?.city ?? '',
      separator: ctx.analytics.topCities[1] ? ', ' : '',
    }),
  },

  {
    id: 'pt_new_user_building',
    type: 'pattern',
    emoji: '📊',
    headline: 'Building your data picture.',
    body: "You need {remaining} more scans before we see clear patterns. Every scan teaches us something.",
    data_point: '{total} scans so far',
    condition: ctx => ctx.analytics.totalViews < 5 && ctx.analytics.totalViews > 0,
    priority: 5,
    tokens: ctx => ({
      remaining: String(5 - ctx.analytics.totalViews),
      total: String(ctx.analytics.totalViews),
    }),
  },
  {
    id: 'pt_starter',
    type: 'pattern',
    emoji: '📈',
    headline: 'Discover your top scans pattern.',
    body: "Our system aggregates scan locations and timings to reveal when you get the most reach.",
    data_point: 'Processing',
    condition: () => true,
    priority: 10,
    tokens: () => ({}),
  },
];

// ── BEST TIME TEMPLATES ──────────────────────────────────────────────────

export const BEST_TIME_TEMPLATES: InsightTemplate[] = [

  // Currently in peak window
  {
    id: 'bt_in_peak_now',
    type: 'best_time',
    emoji: '🔥',
    headline: 'RIGHT NOW is your peak window.',
    body: 'Historically, {peakHour} gets you the most scans. You are inside that window. Put the tee on.',
    data_point: 'Peak: {peakHour}',
    condition: ctx =>
      ctx.analytics.peakHour !== null &&
      ctx.time.hour >= ctx.analytics.peakHour &&
      ctx.time.hour < ctx.analytics.peakHour + 2 &&
      ctx.analytics.totalViews >= 5,
    priority: 1,
    tokens: ctx => ({ peakHour: formatHour(ctx.analytics.peakHour!) }),
  },

  // Today is the best day
  {
    id: 'bt_best_day_today',
    type: 'best_time',
    emoji: '⚡',
    headline: "{dayOfWeek}s are your best scan day. That's today.",
    body: 'Peak window: {peakHour}. Plan your day around it.',
    data_point: 'Best Day Today',
    condition: ctx =>
      ctx.analytics.peakDay === ctx.time.dayOfWeek &&
      ctx.analytics.peakHour !== null &&
      ctx.analytics.totalViews >= 5,
    priority: 1,
    tokens: ctx => ({
      dayOfWeek: ctx.time.dayOfWeek,
      peakHour: formatHour(ctx.analytics.peakHour!),
    }),
  },

  // Tomorrow is best day
  {
    id: 'bt_best_day_tomorrow',
    type: 'best_time',
    emoji: '📅',
    headline: '{peakDay} is your strongest day.',
    body: "That's tomorrow. Set a reminder: wear the tee at {peakHour}.",
    cta: 'Got it',
    data_point: 'Best: {peakDay}',
    condition: ctx => {
      if (!ctx.analytics.peakDay || !ctx.analytics.peakHour) return false;
      const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const todayIdx = days.indexOf(ctx.time.dayOfWeek);
      const peakIdx = days.indexOf(ctx.analytics.peakDay);
      return (peakIdx - todayIdx + 7) % 7 === 1;
    },
    priority: 2,
    tokens: ctx => ({
      peakDay: ctx.analytics.peakDay!,
      peakHour: ctx.analytics.peakHour !== null ? formatHour(ctx.analytics.peakHour) : 'your peak time',
    }),
  },

  // Weekend boost
  {
    id: 'bt_weekend',
    type: 'best_time',
    emoji: '🌟',
    headline: 'Weekend = more people out = more scans.',
    body: "Saturdays and Sundays historically bring more QR scans. Wear the tee when you go out.",
    data_point: 'Weekend boost',
    condition: ctx => ctx.time.isWeekend && ctx.analytics.totalViews < 10,
    priority: 3,
    tokens: () => ({}),
  },

  // No data yet — encouraging
  {
    id: 'bt_no_data',
    type: 'best_time',
    emoji: '📡',
    headline: 'Still learning your pattern.',
    body: "Get {remaining} more QR scans and we'll tell you exactly when your golden hour is.",
    data_point: 'Need {remaining} more scans',
    condition: ctx => ctx.analytics.totalViews < 5,
    priority: 5,
    tokens: ctx => ({ remaining: String(Math.max(0, 5 - ctx.analytics.totalViews)) }),
  },

  // Morning motivator
  {
    id: 'bt_morning_general',
    type: 'best_time',
    emoji: '☀️',
    headline: 'Morning energy hits different. Wear it today.',
    body: "College campuses and commutes peak between 9–11 AM. That is your window.",
    data_point: 'Best: 9–11 AM',
    condition: ctx =>
      ctx.time.timeOfDay === 'morning' &&
      ctx.analytics.peakHour === null,
    priority: 4,
    tokens: () => ({}),
  },
  {
    id: 'bt_starter',
    type: 'best_time',
    emoji: '🕐',
    headline: 'Optimize your scanning window.',
    body: "Wear your tee around campus or during events to find out your sweet spot.",
    data_point: 'Anytime',
    condition: () => true,
    priority: 10,
    tokens: () => ({}),
  },
];

// ── GROWTH TIP TEMPLATES ─────────────────────────────────────────────────

export const GROWTH_TIP_TEMPLATES: InsightTemplate[] = [

  {
    id: 'gt_complete_profile',
    type: 'growth_tip',
    emoji: '⚡',
    headline: 'Your profile is {score}% complete. Fix that.',
    body: "Add your {topMissing} section. Visitors who land on complete profiles click 2× more links.",
    cta: 'Fill it in',
    cta_url: '/dashboard/identity#{topMissingAnchor}',
    data_point: '{score}% complete',
    condition: ctx => ctx.profile.completionScore < 70 && ctx.profile.incompleteSections.length > 0,
    priority: 1,
    tokens: ctx => ({
      score: String(ctx.profile.completionScore),
      topMissing: ctx.profile.incompleteSections[0]?.replace('_', ' ') ?? 'missing',
      topMissingAnchor: ctx.profile.incompleteSections[0] ?? 'bio',
    }),
  },

  {
    id: 'gt_low_link_taps',
    type: 'growth_tip',
    emoji: '🔗',
    headline: 'Views are good. Link taps are next.',
    body: "Only {linkTapRate}% of visitors tap your links. Add a short bio — it makes people stay longer.",
    cta: 'Improve bio',
    cta_url: '/dashboard/identity',
    data_point: '{linkTapRate}% click-through',
    condition: ctx =>
      ctx.analytics.totalViews >= 20 &&
      ctx.analytics.linkTapRate < 15,
    priority: 2,
    tokens: ctx => ({ linkTapRate: String(ctx.analytics.linkTapRate) }),
  },

  {
    id: 'gt_share_profile',
    type: 'growth_tip',
    emoji: '🚀',
    headline: 'Share your profile link. Amplify the tee.',
    body: 'Your KnoWMi link works everywhere — Instagram bio, LinkedIn, WhatsApp status. Put it there.',
    cta: 'Copy link',
    data_point: 'Zero-cost growth',
    condition: ctx => ctx.analytics.totalViews >= 10 && ctx.analytics.totalViews < 100,
    priority: 3,
    tokens: () => ({}),
  },

  {
    id: 'gt_leaderboard_close',
    type: 'growth_tip',
    emoji: '🏆',
    headline: "You're {rank} on the leaderboard. Push.",
    body: 'Top 10 gets a featured badge on your profile. You are {gapToTop10} places away.',
    cta: 'See leaderboard',
    cta_url: '/leaderboard',
    data_point: 'Rank #{rank}',
    condition: ctx =>
      ctx.benchmarks.leaderboardRank !== null &&
      ctx.benchmarks.leaderboardRank > 10 &&
      ctx.benchmarks.leaderboardRank <= 20,
    priority: 2,
    tokens: ctx => ({
      rank: String(ctx.benchmarks.leaderboardRank!),
      gapToTop10: String(ctx.benchmarks.leaderboardRank! - 10),
    }),
  },

  // Persona-specific tips
  {
    id: 'gt_dev_add_projects',
    type: 'growth_tip',
    emoji: '💻',
    headline: 'No projects on your profile. Add at least one.',
    body: "Developers without projects look like they have nothing to show. Ship something — then list it.",
    cta: 'Add projects',
    cta_url: '/dashboard/identity?persona=developer#projects',
    data_point: '0 projects',
    condition: ctx =>
      ctx.profile.persona === 'developer' &&
      ctx.profile.incompleteSections.includes('projects'),
    personas: ['developer'],
    priority: 1,
    tokens: () => ({}),
  },

  {
    id: 'gt_creator_add_work',
    type: 'growth_tip',
    emoji: '🎨',
    headline: "Your portfolio is empty. That's the first thing they look for.",
    body: "Add your 3 best pieces. Visitors to creator profiles decide in 4 seconds. Make it count.",
    cta: 'Add your work',
    cta_url: '/dashboard/identity?persona=creator#works',
    data_point: '0 works',
    condition: ctx =>
      ctx.profile.persona === 'creator' &&
      ctx.profile.incompleteSections.includes('works'),
    personas: ['creator'],
    priority: 1,
    tokens: () => ({}),
  },

  {
    id: 'gt_fitness_add_goals',
    type: 'growth_tip',
    emoji: '🎯',
    headline: 'Add your goals. Progress bars make profiles alive.',
    body: "Strangers love watching someone work toward something real. Set 2–3 goals and show your progress.",
    cta: 'Set goals',
    cta_url: '/dashboard/identity?persona=fitness#goals',
    data_point: 'No goals set',
    condition: ctx =>
      ctx.profile.persona === 'fitness' &&
      ctx.profile.incompleteSections.includes('goals'),
    personas: ['fitness'],
    priority: 1,
    tokens: () => ({}),
  },

  {
    id: 'gt_influencer_add_platforms',
    type: 'growth_tip',
    emoji: '📱',
    headline: 'Follower counts missing. That is your credibility.',
    body: "Influencer profiles without platform stats feel incomplete. Add your numbers — even if they are small.",
    cta: 'Add platforms',
    cta_url: '/dashboard/identity?persona=influencer#platforms',
    data_point: 'No platforms',
    condition: ctx =>
      ctx.profile.persona === 'influencer' &&
      ctx.profile.incompleteSections.includes('platforms'),
    personas: ['influencer'],
    priority: 1,
    tokens: () => ({}),
  },

  {
    id: 'gt_student_add_playlist',
    type: 'growth_tip',
    emoji: '🎵',
    headline: 'Share your playlist. Music is the fastest connect.',
    body: "Students who add a playlist get 40% more profile shares. It is the most personal thing you can add.",
    cta: 'Add playlist',
    cta_url: '/dashboard/identity?persona=student#playlist',
    data_point: 'No playlist',
    condition: ctx =>
      ctx.profile.persona === 'student' &&
      ctx.profile.incompleteSections.includes('playlist'),
    personas: ['student'],
    priority: 1,
    tokens: () => ({}),
  },

  {
    id: 'gt_gamer_add_games',
    type: 'growth_tip',
    emoji: '🎮',
    headline: 'No games listed. What are you even playing?',
    body: "Add your main games and ranks. Other gamers decide in 2 seconds if you are worth connecting with.",
    cta: 'Add games',
    cta_url: '/dashboard/identity?persona=gamer#main_games',
    data_point: 'No games listed',
    condition: ctx =>
      ctx.profile.persona === 'gamer' &&
      ctx.profile.incompleteSections.includes('main_games'),
    personas: ['gamer'],
    priority: 1,
    tokens: () => ({}),
  },
  {
    id: 'gt_starter',
    type: 'growth_tip',
    emoji: '🚀',
    headline: 'Share your profile link.',
    body: "Add your KnoWMi link to your Instagram or LinkedIn bio to instantly double your traffic.",
    cta: 'Go to dashboard',
    cta_url: '/dashboard',
    data_point: '+2× views',
    condition: () => true,
    priority: 10,
    tokens: () => ({}),
  },
];

// ── COMPARISON TEMPLATES ─────────────────────────────────────────────────

export const COMPARISON_TEMPLATES: InsightTemplate[] = [

  {
    id: 'cp_above_average',
    type: 'comparison',
    emoji: '🌟',
    headline: 'Above the platform average. Keep that energy.',
    body: "The average {persona} on KnoWMi gets {avg} views. You have {userViews}. You are in the top {percentile}% of your tier.",
    data_point: 'Top {percentile}%',
    condition: ctx => ctx.benchmarks.aboveAverage && ctx.analytics.totalViews >= 10,
    priority: 1,
    tokens: ctx => ({
      persona: ctx.profile.persona,
      avg: String(ctx.benchmarks.platformAvgViews),
      userViews: String(ctx.analytics.totalViews),
      percentile: String(Math.round(100 - ctx.benchmarks.userPercentile)),
    }),
  },

  {
    id: 'cp_leaderboard_rank',
    type: 'comparison',
    emoji: '🏅',
    headline: 'Ranked #{rank} on KnoWMi globally.',
    body: "Out of {totalProfiles} profiles on the platform, you sit at #{rank}. That is not nothing.",
    cta: 'See leaderboard',
    cta_url: '/leaderboard',
    data_point: 'Rank #{rank}',
    condition: ctx =>
      ctx.benchmarks.leaderboardRank !== null &&
      ctx.benchmarks.leaderboardRank <= 50,
    priority: 1,
    tokens: ctx => ({
      rank: String(ctx.benchmarks.leaderboardRank!),
      totalProfiles: '100+',
    }),
  },

  {
    id: 'cp_below_average_encourage',
    type: 'comparison',
    emoji: '📈',
    headline: 'Room to grow. That is actually a good sign.',
    body: "Platform average for {persona}s is {avg} views. You are at {userViews}. Most profiles that reach {avg} started exactly where you are.",
    data_point: 'Avg: {avg}',
    condition: ctx =>
      !ctx.benchmarks.aboveAverage &&
      ctx.analytics.totalViews > 0 &&
      ctx.analytics.totalViews < ctx.benchmarks.platformAvgViews,
    priority: 2,
    tokens: ctx => ({
      persona: ctx.profile.persona,
      avg: String(ctx.benchmarks.platformAvgViews),
      userViews: String(ctx.analytics.totalViews),
    }),
  },

  {
    id: 'cp_new_user',
    type: 'comparison',
    emoji: '🌱',
    headline: 'Early days. The stats will come.',
    body: "Every top profile on KnoWMi started with zero scans. You have already started. That is the hardest part.",
    data_point: 'Just getting started',
    condition: ctx => ctx.analytics.totalViews < 10,
    priority: 3,
    tokens: () => ({}),
  },
  {
    id: 'cp_starter',
    type: 'comparison',
    emoji: '🌟',
    headline: 'Compare your growth against others.',
    body: "Once your profile receives views, you'll see where you stand in KnoWMi globally.",
    data_point: 'Identity real',
    condition: () => true,
    priority: 10,
    tokens: () => ({}),
  },
];

// ── HELPER ───────────────────────────────────────────────────────────────

function formatHour(hour: number): string {
  const h = hour % 12 || 12;
  const next = (hour + 1) % 12 || 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h}–${next} ${ampm}`;
}

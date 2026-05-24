import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getAnalyticsData } from '../lib/analytics/data-source';
import { useRealtimeAnalytics } from '../hooks/useRealtimeAnalytics';

import VibeHeader from '../components/vibe/VibeHeader';
import HeroCard from '../components/vibe/HeroCard';
import StatGrid from '../components/vibe/StatGrid';
import MomentsCard from '../components/vibe/MomentsCard';
import DeviceDonut from '../components/vibe/DeviceDonut';
import StreakCard from '../components/vibe/StreakCard';
import CityCard from '../components/vibe/CityCard';
import ViralCard from '../components/vibe/ViralCard';
import { AIInsightsToggle } from '../components/vibe/AIInsightsToggle';
import BottomNav from '../components/vibe/BottomNav';

function SectionLabel({ children }) {
    return (
        <p style={{
            fontFamily: 'Syne, sans-serif', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase',
            margin: '28px 20px 12px',
        }}>
            {children}
        </p>
    );
}

function SkeletonCard() {
    return (
        <div style={{
            background: 'var(--surface)', borderRadius: 'var(--r)',
            margin: '0 16px', height: 120,
            animation: 'vibeSkeleton 1.5s ease-in-out infinite',
        }} />
    );
}

export default function VibePage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        async function load() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { navigate('/'); return; }

            const { data: prof } = await supabase
                .from('profiles')
                .select('id, first_name, avatar_url, wm_code, secure_slug')
                .eq('user_id', session.user.id)
                .single();

            if (!prof) { navigate('/'); return; }
            setProfile(prof);

            const s = await getAnalyticsData(prof.id);
            setStats(s);
            setLoading(false);
        }
        load();
    }, [navigate]);

    useRealtimeAnalytics(profile?.id, async () => {
        setIsLive(true);
        setTimeout(() => setIsLive(false), 30000);
        const s = await getAnalyticsData(profile.id);
        setStats(s);
    });

    if (loading || !profile) {
        return (
            <div style={{ background: 'var(--bg)', minHeight: '100vh', maxWidth: 420, margin: '0 auto' }}>
                <div style={{ padding: '28px 20px 0', height: 66 }} />
                {[1, 2, 3, 4].map(i => (
                    <React.Fragment key={i}>
                        <div style={{ height: 40 }} />
                        <SkeletonCard />
                    </React.Fragment>
                ))}
            </div>
        );
    }

    const displayName = profile.first_name || 'You';

    return (
        <div className="vibe-page" style={{ minHeight: '100vh', maxWidth: 600, margin: '0 auto', paddingBottom: 80, position: 'relative' }}>
            {/* Grain texture */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
                opacity: 0.6,
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div className="vibe-fade-in vibe-d1">
                    <VibeHeader
                        displayName={displayName}
                        avatarUrl={profile.avatar_url}
                        profileSlug={profile.secure_slug || profile.first_name || profile.id}
                    />
                </div>

                <div className="vibe-fade-in vibe-d2" style={{ padding: '0 20px' }}>
                    <HeroCard
                        todayScans={stats.todayTotal || 0}
                        isLive={isLive}
                        weekSparkline={stats.weekSparkline}
                    />
                    <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
                        <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); navigate('/insights'); }}
                            className="w-full bg-white border border-neutral-200 text-neutral-800 font-black text-xs uppercase tracking-wider px-5 py-4 rounded-2xl hover:border-orange-500/50 hover:bg-orange-50/20 transition-all duration-300 shadow-sm flex items-center justify-between gap-3 active:scale-95 select-none"
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 bg-orange-500/10 text-orange-600 rounded-xl flex items-center justify-center animate-pulse">✦</span>
                                <span className="text-sm font-bold font-display text-neutral-900">AI Insights (Beta)</span>
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1.5 rounded-xl">View Details →</span>
                        </button>
                    </div>
                </div>

                {/* Your numbers */}
                <div className="vibe-fade-in vibe-d3" style={{ padding: '0 20px' }}>
                    <SectionLabel>Your numbers</SectionLabel>
                    <StatGrid
                        totalViews={stats.totalViews}
                        totalCities={stats.totalCities}
                        profileQRScans={stats.profileQRScans}
                        uniqueViews={stats.uniqueViews}
                    />
                </div>

                {/* Moments */}
                <div className="vibe-fade-in vibe-d4" style={{ padding: '0 20px' }}>
                    <SectionLabel>Moments that matter</SectionLabel>
                    <MomentsCard moments={stats.moments} />
                </div>

                {/* Device */}
                <div className="vibe-fade-in vibe-d5" style={{ padding: '0 20px' }}>
                    <SectionLabel>Who's viewing</SectionLabel>
                    <DeviceDonut {...stats.deviceBreakdown} />
                </div>

                {/* Streak */}
                <div className="vibe-fade-in vibe-d6" style={{ padding: '0 20px' }}>
                    <SectionLabel>Your streak</SectionLabel>
                    <StreakCard {...stats.streak} />
                </div>

                {/* Cities */}
                <div className="vibe-fade-in vibe-d7" style={{ padding: '0 20px' }}>
                    <SectionLabel>Where in the world</SectionLabel>
                    <CityCard topCities={stats.topCities} totalCities={stats.totalCities} />
                </div>

                {/* Best moment */}
                <div className="vibe-fade-in vibe-d8" style={{ padding: '0 20px' }}>
                    <SectionLabel>Your best moment</SectionLabel>
                    <ViralCard bestMoment={stats.bestMoment} />
                </div>

                <BottomNav active="stats" username={profile.secure_slug || profile.first_name || profile.id} />
            </div>
        </div>
    );
}

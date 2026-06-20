'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function LiveCounter({ profileId }: { profileId: string }) {
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    // Initial count fetch for the last 60 minutes
    const fetchInitialLiveCount = async () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count } = await supabase
        .from('profile_view_events')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profileId)
        .gte('viewed_at', oneHourAgo);
      
      setLiveCount(count || 0);
    };

    fetchInitialLiveCount();

    const channel = supabase
      .channel('live-views')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'profile_view_events',
        filter: `profile_id=eq.${profileId}`,
      }, () => {
        setLiveCount(c => c + 1);
      });
      try { 
        channel.subscribe();
      } catch (err) {
        console.warn('LiveCounter WebSocket blocked by browser security (likely Private Tab):', err);
      }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId]);

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-[#1a1a1a] border border-white/20 rounded-full shadow-[2px_2px_0px_#fff] hover:shadow-[4px_4px_0px_#fff] transition-shadow">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
        <span className="text-orange-500 font-bold">{liveCount}</span> views in last hour
      </span>
    </div>
  );
}


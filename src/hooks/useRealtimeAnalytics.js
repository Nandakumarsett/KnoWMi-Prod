import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeAnalytics(profileId, onNewScan) {
  useEffect(() => {
    if (!profileId) return;

    // Listen for any new events that affect analytics
    const channel = supabase
      .channel(`vibe-pulse-${profileId}`)
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public',
          table: 'profile_view_events',
        },
        (payload) => {
          // Listen for matches on ANY possible ID associated with this user
          const incomingProfileId = payload.new?.profile_id;
          const incomingUserId = payload.new?.user_id;
          
          const isMatch = (incomingProfileId && String(incomingProfileId).toLowerCase() === String(profileId).toLowerCase()) ||
                          (incomingUserId && String(incomingUserId).toLowerCase() === String(profileId).toLowerCase());

          if (isMatch) {
            console.log('💓 Heartbeat: Multi-ID Pulse Detected!', payload.new);
            onNewScan();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'qr_scan_events',
        },
        (payload) => {
          if (payload.new && String(payload.new.profile_id).toLowerCase() === String(profileId).toLowerCase()) {
            console.log('💓 Heartbeat: QR Pulse Detected!', payload.new);
            onNewScan();
          }
        }
      );
      
    try {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Heartbeat: Live Engine Connected for ${profileId}`);
        } else {
          console.warn(`⚠️ Heartbeat Status: ${status}`);
        }
      });
    } catch (err) {
      console.warn('Realtime WebSocket blocked (likely Private Tab):', err);
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId, onNewScan]);
}

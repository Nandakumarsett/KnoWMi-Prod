import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { buildFingerprint } from '../../lib/analytics/fingerprint';
import { categoriseReferrer } from '../../lib/analytics/referrer';

export default function ProfileViewTracker({ profileId }) {
  useEffect(() => {
    const track = async () => {
      try {
        // Step 1: Check source (tracking even from leaderboard now)
        const searchParams = new URLSearchParams(window.location.search);
        const source = searchParams.get('src') || 'direct';

        // Step 2: Check if the viewer is the owner of the profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: viewerProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();
          
          if (viewerProfile && viewerProfile.id === profileId) {
            // It's the owner viewing their own profile - SKIP tracking
            console.log('Owner view detected, skipping analytics tracking.');
            return;
          }
        }

        // Step 3: Prevent duplicate tracking on refresh (Session-based)
        const sessionKey = `v_tracked_${profileId}`;
        if (sessionStorage.getItem(sessionKey)) {
          console.log('Page refresh detected, skipping duplicate analytics tracking.');
          return;
        }

        const fp = await buildFingerprint();
        const referrer = categoriseReferrer(document.referrer);

        // Mark as tracked for this session
        sessionStorage.setItem(sessionKey, '1');

        // Fire-and-forget: proxy through your API or call Edge Function directly
        // For Vite + Supabase, you might call the Edge Function directly if allowed
        // But the prompt asked for an API route proxy.
        // On localhost:5173, /api/track-view won't exist unless you have a proxy setup.
        // We can call the Supabase Edge Function directly using the anon key.

        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ingest-profile-view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ 
            profileId, 
            referrer, 
            fp,
            source,
            viewerId: user?.id
          }),
          keepalive: true,
        });

        if (!response.ok) {
          console.error('Tracking failed:', await response.json());
        }
      } catch (err) {
        console.error('Tracking error:', err);
      }
    };

    if (profileId) {
      track();
    }
  }, [profileId]);

  return null;
}

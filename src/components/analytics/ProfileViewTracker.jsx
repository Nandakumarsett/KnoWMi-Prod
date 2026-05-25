import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { buildFingerprint } from '../../lib/analytics/fingerprint';
import { categoriseReferrer } from '../../lib/analytics/referrer';
import { getAccurateLocation } from '../../lib/analytics/geolocation';
import { MapPin, ShieldCheck, X } from 'lucide-react';

export default function ProfileViewTracker({ profileId }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    const initTracking = async () => {
      if (!profileId || tracked) return;

      const searchParams = new URLSearchParams(window.location.search);
      const pathParts = window.location.pathname.split('/');
      const urlUsername = pathParts[pathParts.length - 1] || '';
      const isUUIDSlug = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(urlUsername);
      const isTshirtScan = searchParams.get('src') === 'tshirt' || searchParams.get('src') === 'qr' || isUUIDSlug;
      
      const { data: { user } } = await supabase.auth.getUser();
      let viewerProfile = null;
      if (user) {
        const { data: profileData } = await supabase.from('profiles').select('id').eq('user_id', user.id).single();
        viewerProfile = profileData;
      }

      if (viewerProfile && viewerProfile.id === profileId) {
        console.log('Owner view detected, skipping analytics tracking.');
        setTracked(true);
        return;
      }

      const sessionKey = user ? `v_tracked_user_${profileId}` : `v_tracked_anon_${profileId}`;
      const isRepeatVisit = !!localStorage.getItem(sessionKey);

      // If they came from a QR scan, they already saw the prompt in ScanHandler.
      if (isTshirtScan) {
        handleLocation(false, viewerProfile, true, true, isRepeatVisit); // silent = true, skipGeo = true
      } else {
        // Normal web visit, show prompt
        setShowPrompt(true);
        // We will need to store isRepeatVisit somewhere or pass it. 
        // For now, let's just use it in the component state or attach it to the window.
        window.__knowmi_is_repeat = isRepeatVisit;
      }
    };

    initTracking();
  }, [profileId, tracked]);

  const handleLocation = async (allow, viewerProfile, silent = false, skipGeo = false, isRepeatParam = null) => {
    const isRepeat = isRepeatParam !== null ? isRepeatParam : !!window.__knowmi_is_repeat;
    setShowPrompt(false);
    
    let resolvedCity = 'Unknown';
    let resolvedCountry = 'Unknown';

    if ((allow || silent) && !skipGeo) {
      if (navigator.geolocation) {
        try {
        try {
          const position = await getAccurateLocation({ timeout: silent ? 4000 : 10000, maximumAge: 0, enableHighAccuracy: true });
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          if (res.ok) {
            const data = await res.json();
            const city = data.city || data.locality || 'Unknown';
            const country = data.countryName || 'Unknown';
            resolvedCity = city !== 'Unknown' ? city : 'Unknown';
            resolvedCountry = country;
          }
        } catch (e) { }
        } catch (e) { }
      }
    }

    // Now log the view
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const utmSource = searchParams.get('utm_source');
      const utmMedium = searchParams.get('utm_medium');
      const utmCampaign = searchParams.get('utm_campaign');
      const customSrc = searchParams.get('src');
      const source = utmSource || customSrc || 'direct';
      const isTshirtScan = source === 'tshirt';
      const sessionKey = viewerProfile ? `v_tracked_user_${profileId}` : `v_tracked_anon_${profileId}`;

      const fp = await buildFingerprint();
      const referrer = categoriseReferrer(document.referrer);

      localStorage.setItem(sessionKey, '1');

      let edgeSuccess = false;
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ingest-profile-view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
          body: JSON.stringify({ 
            profileId, referrer, fp, source, utm_medium: utmMedium, utm_campaign: utmCampaign,
            viewerId: viewerProfile?.id, city: resolvedCity, country: resolvedCountry, isRepeat
          }),
          keepalive: true,
        });
        if (response.ok) edgeSuccess = true;
      } catch (e) { }

      if (!edgeSuccess) {
        await supabase.from('profile_view_events').insert({
          profile_id: profileId, visitor_fp: fp,
          referrer: isTshirtScan ? 'tshirt' : (source !== 'direct' ? source : referrer),
          device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
          browser: navigator.userAgent, is_repeat: isRepeat, viewer_id: viewerProfile?.id,
          city: resolvedCity, country: resolvedCountry
        });
      }
    } catch (e) { }
    
    setTracked(true);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:right-4 md:w-96 animate-slideUp">
      <div className="bg-white/95 backdrop-blur-xl border border-neutral-200 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-neutral-900">Accurate Analytics</h3>
              <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">KnoWMi Protocol</p>
            </div>
          </div>
          <button onClick={() => handleLocation(false, null)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
            <X size={16} />
          </button>
        </div>
        <p className="text-xs text-neutral-600 mb-5 leading-relaxed font-medium">
          To provide 100% accurate scan analytics to the creator as outlined in our Privacy Policy, we request your location.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => handleLocation(true, null)}
            className="flex-1 py-2.5 bg-orange-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-1.5 shadow-md"
          >
            <ShieldCheck size={14} /> Allow
          </button>
          <button
            onClick={() => handleLocation(false, null)}
            className="flex-1 py-2.5 bg-neutral-100 text-neutral-600 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

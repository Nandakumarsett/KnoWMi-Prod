import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getAccurateLocation } from '../lib/analytics/geolocation';
import { Loader2, QrCode, Sparkles, ArrowRight, ShieldCheck, Heart, MapPin, X } from 'lucide-react';
import AuthModal from '../components/AuthModal';

export default function QRIntercept() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isUnclaimed, setIsUnclaimed] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  
  const [qrData, setQrData] = useState(null);
  const [status, setStatus] = useState('fetching_qr');

  useEffect(() => {
    const fetchQR = async () => {
      if (!token) return;
      try {
        const { data: qData, error: qrError } = await supabase
          .from('qr_tokens')
          .select('id, profile_id, profile_slug, is_active')
          .eq('scan_token', token)
          .single();

        if (qrError || !qData) {
          setIsUnclaimed(true);
          return;
        }

        if (!qData.is_active) {
          setIsDeactivated(true);
          return;
        }
        
        setQrData(qData);
        setStatus('requesting_location');
      } catch (err) {
        setIsUnclaimed(true);
      }
    };
    
    fetchQR();
  }, [token]);

  const finishScan = async (resolvedCity, resolvedCountry) => {
    setStatus('redirecting');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let isOwner = false;
      let viewerProfile = null;
      
      if (user) {
        const { data: userProfile } = await supabase.from('profiles').select('id').eq('user_id', user.id).single();
        viewerProfile = userProfile;
        if (userProfile && userProfile.id === qrData.profile_id) isOwner = true;
      }

      if (viewerProfile) {
        try {
          const { buildFingerprint } = await import('../lib/analytics/fingerprint');
          const fp = await buildFingerprint();
          const mapKey = `fp_mapped_${viewerProfile.id}`;
          if (!localStorage.getItem(mapKey)) {
            await supabase.from('profile_view_events').insert({
              profile_id: viewerProfile.id, visitor_fp: fp, viewer_id: viewerProfile.id, referrer: 'direct',
              device_type: window.innerWidth < 768 ? 'mobile' : 'desktop', browser: navigator.userAgent, is_repeat: true
            });
            localStorage.setItem(mapKey, 'true');
          }
        } catch (e) {}
      }

      const userAgent = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = /Android/.test(userAgent);
      let device = 'Desktop';
      if (isIOS) device = 'iPhone';
      else if (isAndroid) device = 'Android';
      else if (window.innerWidth < 768) device = 'Mobile';

      let currentFp = 'anonymous';
      try {
        const { buildFingerprint } = await import('../lib/analytics/fingerprint');
        currentFp = await buildFingerprint();
      } catch (e) {}
      
      await supabase.from('qr_scan_events').insert({
        profile_id: qrData.profile_id, token_id: qrData.id, device_type: device.toLowerCase(),
        browser: navigator.userAgent.slice(0, 200), os: navigator.platform, scanner_fp: currentFp,
        scanned_at: new Date().toISOString(), scanner_id: user?.id || null, city: resolvedCity, country: resolvedCountry
      });
      
      let ownerProfile = null;
      try {
        const { data: pubProfile } = await supabase.from('public_profiles').select('user_id, secure_slug').eq('id', qrData.profile_id).single();
        if (pubProfile?.user_id) ownerProfile = pubProfile;
      } catch (e) {}

      if (!ownerProfile) {
        try {
          const { data: privProfile } = await supabase.from('profiles').select('user_id, secure_slug').eq('id', qrData.profile_id).single();
          if (privProfile?.user_id) ownerProfile = privProfile;
        } catch (e) {}
      }

      if (ownerProfile?.user_id) {
        supabase.functions.invoke('send-push-notification', {
          body: {
            userId: ownerProfile.user_id, title: 'T-Shirt Scan Alert! 👕',
            body: `Someone just scanned your physical KnoWMi item using a ${device} in ${resolvedCity}!`,
            url: '/dashboard', metadata: { device, city: resolvedCity }
          }
        }).catch(() => {});
      }

      const finalSlug = ownerProfile?.secure_slug || qrData.profile_slug || qrData.profile_id;
      window.location.href = `/p/${finalSlug}?src=tshirt`;
    } catch (err) {
      setIsUnclaimed(true);
    }
  };

  const handleAllowLocation = async () => {
    setStatus('redirecting');
    if (!navigator.geolocation) {
      finishScan('Unknown', 'India');
      return;
    }
    try {
      const position = await getAccurateLocation({ timeout: 10000, maximumAge: 0, enableHighAccuracy: true });
      const { latitude, longitude } = position.coords;
      const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
      if (res.ok) {
        const data = await res.json();
        const city = data.city || data.locality || 'Unknown';
        const country = data.countryName || 'India';
        finishScan(city !== 'Unknown' ? city : 'Unknown', country);
        return;
      }
      finishScan('Unknown', 'India');
    } catch (e) {
      finishScan('Unknown', 'India');
    }
  };

  const handleSkipLocation = () => finishScan('Unknown', 'India');

  const handleClaim = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setClaimLoading(true);
    try {
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, secure_slug')
        .eq('user_id', user.id)
        .single();

      if (profileError || !userProfile) {
        alert('Could not find an active KnoWMi profile. Redirecting to Identity Studio to create one.');
        navigate('/studio');
        return;
      }

      const { error: claimError } = await supabase
        .from('qr_tokens')
        .update({
          profile_id: userProfile.id,
          profile_slug: userProfile.secure_slug || userProfile.id,
          is_active: true,
          label: 'My New Claimed Card'
        })
        .eq('scan_token', token);

      if (claimError) {
        const { error: insertError } = await supabase
          .from('qr_tokens')
          .insert({
            scan_token: token,
            profile_id: userProfile.id,
            profile_slug: userProfile.secure_slug || userProfile.id,
            is_active: true,
            label: 'My New Claimed Card'
          });
        
        if (insertError) throw insertError;
      }

      alert('🎉 Congratulations! Your physical KnoWMi is now bound and activated.');
      navigate('/studio');

    } catch (err) {
      console.error('Claiming failed:', err);
      alert('Activation failed. Please make sure you have a profile in the Identity Studio.');
    } finally {
      setClaimLoading(false);
    }
  };

  if (isUnclaimed) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-gold/5 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-md w-full bg-neutral-900/40 backdrop-blur-2xl border border-neutral-800 rounded-[32px] p-8 sm:p-10 shadow-2xl">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-orange-500/20 rounded-3xl blur-xl animate-pulse" />
            <div className="relative w-20 h-20 bg-neutral-800 border-2 border-neutral-700 rounded-3xl flex items-center justify-center shadow-lg">
              <QrCode size={36} className="text-orange-500" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-md">
              <Sparkles size={12} className="text-white" />
            </div>
          </div>

          <h2 style={{ fontFamily: 'Fraunces, serif' }} className="text-3xl font-black mb-3">
            Unclaimed Identity
          </h2>
          <p className="text-sm text-neutral-400 font-medium mb-8 leading-relaxed">
            This physical KnoWMi card or T-shirt has not been activated yet. Activate it in 30 seconds to start sharing your digital persona!
          </p>

          <button
            onClick={handleClaim}
            disabled={claimLoading}
            className="w-full py-4 bg-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-orange-600 active:scale-95 transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 mb-4 disabled:opacity-50"
          >
            {claimLoading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                Activate & Link Identity
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-4 text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-6">
            <span className="flex items-center gap-1"><ShieldCheck size={12} /> SECURE CRYPTO BIND</span>
            <span className="w-1.5 h-1.5 bg-neutral-800 rounded-full" />
            <span className="flex items-center gap-1"><Heart size={12} /> 100% PERSONAL</span>
          </div>
        </div>

        <AuthModal
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleClaim}
          redirectAfter="/studio"
          defaultTab="signup"
        />
      </div>
    );
  }

  if (status === 'requesting_location') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808] text-white p-6 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-md w-full bg-neutral-900/60 backdrop-blur-2xl border border-neutral-800 rounded-[32px] p-8 shadow-2xl text-center">
          <div className="w-20 h-20 bg-neutral-800 border border-neutral-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <MapPin size={32} className="text-orange-500" />
          </div>
          <h2 className="text-2xl font-black mb-3">Accurate Analytics</h2>
          <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
            To provide 100% accurate scan analytics to the creator as outlined in our Privacy Policy, we request your location.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleAllowLocation}
              className="w-full py-4 bg-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} /> Allow Location
            </button>
            <button
              onClick={handleSkipLocation}
              className="w-full py-4 bg-transparent border border-neutral-700 text-neutral-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-neutral-800 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <X size={16} /> Skip (Use Unknown)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="animate-pulse space-y-6">
        <div className="w-16 h-16 bg-neutral-900 border-2 border-neutral-800 rounded-full flex items-center justify-center mx-auto">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
        <div>
          <h2 className="text-xl font-display font-black mb-2">Authenticating Identity</h2>
          <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">
            {status === 'redirecting' ? 'Finalizing...' : 'KnoWMi Secure Link Processing...'}
          </p>
        </div>
      </div>
    </div>
  );
}

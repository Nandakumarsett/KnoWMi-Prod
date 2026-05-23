import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, QrCode, Sparkles, ArrowRight, ShieldCheck, Heart, Power } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import { buildFingerprint } from '../lib/analytics/fingerprint';

export default function QRIntercept() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isUnclaimed, setIsUnclaimed] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);

  useEffect(() => {
    const handleScan = async () => {
      try {
        const { data: qrData, error: qrError } = await supabase
          .from('qr_tokens')
          .select('id, profile_id, profile_slug, is_active')
          .eq('scan_token', token)
          .single();

        if (qrError || !qrData) {
          // Token is unclaimed or not generated in DB yet
          setIsUnclaimed(true);
          return;
        }

        if (!qrData.is_active) {
          // Token is deactivated
          setIsDeactivated(true);
          return;
        }

        // Check if the current user is the owner of this QR token
        const { data: { user } } = await supabase.auth.getUser();
        let isOwner = false;
        let viewerProfile = null;
        
        if (user) {
          // Get the profile for this user to check profile_id
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();
          
          viewerProfile = userProfile;
          if (userProfile && userProfile.id === qrData.profile_id) {
            isOwner = true;
          }
        }

        // Proactively establish browser fingerprint mapping if the scanner is logged in
        if (viewerProfile) {
          try {
            const fp = await buildFingerprint();
            const mapKey = `fp_mapped_${viewerProfile.id}`;
            if (!localStorage.getItem(mapKey)) {
              supabase
                .from('profile_view_events')
                .insert({
                  profile_id: viewerProfile.id,
                  visitor_fp: fp,
                  viewer_id: viewerProfile.id,
                  referrer: 'direct',
                  device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
                  browser: navigator.userAgent,
                  is_repeat: true
                })
                .then(() => {
                  localStorage.setItem(mapKey, 'true');
                  console.log('Fingerprint mapping recorded successfully via QR Intercept.');
                })
                .catch(err => console.error('Failed to record fingerprint mapping via QR Intercept:', err));
            }
          } catch (fpErr) {
            console.error('Failed to establish fingerprint mapping in QR Intercept:', fpErr);
          }
        }

        // Determine device type
        const userAgent = navigator.userAgent;
        const isIOS = /iPad|iPhone|iPod/.test(userAgent);
        const isAndroid = /Android/.test(userAgent);
        let device = 'Desktop';
        if (isIOS) device = 'iPhone';
        else if (isAndroid) device = 'Android';
        else if (window.innerWidth < 768) device = 'Mobile';

        // Log the scan to qr_scan_events
        let currentFp = 'anonymous';
        try {
          currentFp = await buildFingerprint();
        } catch (e) {}
        
        if (!isOwner) {
          const { error: scanInsertError } = await supabase.from('qr_scan_events').insert({
            profile_id: qrData.profile_id,
            device_type: device.toLowerCase(),
            browser: 'Webview/Browser',
            os: navigator.platform,
            scanner_fp: currentFp,
            scanned_at: new Date().toISOString(),
            scanner_id: user?.id
          });
          
          if (scanInsertError) {
            console.error('Failed to insert qr_scan_events. You may need to add an RLS policy for anonymous inserts on qr_scan_events:', scanInsertError);
          }
        }

        // Fetch owner's user_id to send push notification
        const { data: ownerProfile } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('id', qrData.profile_id)
          .single();

        if (ownerProfile?.user_id && !isOwner) {
          supabase.functions.invoke('send-push-notification', {
            body: {
              userId: ownerProfile.user_id,
              title: 'T-Shirt Scan Alert! 👕',
              body: `Someone just scanned your physical KnoWMi item using a ${device}!`,
              url: '/dashboard'
            }
          }).catch(err => console.error('Failed to trigger push notification:', err));
        }

        // 6. Redirect to the actual profile, appending ?src=tshirt to ensure analytics picks it up
        window.location.href = `/p/${qrData.profile_slug || qrData.profile_id}?src=tshirt`;

      } catch (err) {
        console.error('QR Intercept failed:', err);
        setIsUnclaimed(true);
      }
    };

    if (token) {
      handleScan();
    }
  }, [token]);

  const handleClaim = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setClaimLoading(true);
    try {
      // 1. Get profile of current logged-in user
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

      // 2. Claim the token
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
        // Fallback: If update failed due to token not existing in db, create it
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
        {/* Background glow elements */}
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

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="animate-pulse space-y-6">
        <div className="w-16 h-16 bg-neutral-900 border-2 border-neutral-800 rounded-full flex items-center justify-center mx-auto">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
        <div>
          <h2 className="text-xl font-display font-black mb-2">Authenticating Identity</h2>
          <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">KnoWMi Secure Link Processing...</p>
        </div>
      </div>
    </div>
  );
}

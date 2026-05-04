import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function QRIntercept() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleScan = async () => {
      try {
        const { data: qrData, error: qrError } = await supabase
          .from('qr_tokens')
          .select('id, profile_id, profile_slug, is_active')
          .eq('scan_token', token)
          .single();

        if (qrError || !qrData || !qrData.is_active) {
          window.location.href = '/';
          return;
        }

        // Check if the current user is the owner of this QR token
        const { data: { user } } = await supabase.auth.getUser();
        let isOwner = false;
        
        if (user) {
          // Get the profile for this user to check profile_id
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();
          
          if (userProfile && userProfile.id === qrData.profile_id) {
            isOwner = true;
          }
        }

        const edgeFnUrl = `https://mifosfmxjqyhgzshfofj.supabase.co/functions/v1/handle-qr-scan?token=${token}${isOwner ? '&skip_log=true' : ''}`;
        
        // Redirect immediately to the profile
        navigate(`/p/${qrData.profile_slug}`);

        // Fire-and-forget the edge function call for background analytics
        // We only call it if we want to log OR we want to let the edge function handle the isOwner flag
        fetch(edgeFnUrl).catch(console.error);

      } catch (err) {
        console.error('QR Intercept failed:', err);
        navigate('/');
      }
    };

    if (token) {
      handleScan();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="animate-pulse space-y-6">
        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto">
          <Loader2 className="animate-spin text-orange-500" size={32} />
        </div>
        <div>
          <h2 className="text-xl font-display font-black text-neutral-900 mb-2">Authenticating Identity</h2>
          <p className="text-sm text-neutral-400 font-bold uppercase tracking-widest">KnoWMi Secure Link Processing...</p>
        </div>
      </div>
    </div>
  );
}

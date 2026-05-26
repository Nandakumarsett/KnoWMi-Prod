import { supabase } from '../supabase';

export const trackLinkClick = async (profileId, platform, url) => {
  if (!profileId || !platform) return;
  try {
    const fp = localStorage.getItem('knowmi_fp') || 'unknown';
    const { error } = await supabase.from('link_click_events').insert({
      profile_id: profileId,
      platform: platform.toLowerCase(),
      url: url || '',
      visitor_fp: fp
    });
    if (error) {
      console.error('Supabase Error tracking link:', error);
      alert('Tracking Error: ' + error.message);
    }
  } catch (err) {
    console.error('Failed to track link click:', err);
    alert('Network/JS Error: ' + err.message);
  }
};

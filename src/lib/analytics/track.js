import { supabase } from '../supabase';

export const trackLinkClick = async (profileId, platform, url) => {
  if (!profileId || !platform) return;
  try {
    const fp = localStorage.getItem('knowmi_fp') || 'unknown';
    await supabase.from('link_click_events').insert({
      profile_id: profileId,
      platform: platform.toLowerCase(),
      url: url || '',
      visitor_fp: fp
    });
  } catch (err) {
    console.error('Failed to track link click:', err);
  }
};

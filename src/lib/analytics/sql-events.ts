import { supabase } from '../supabase';

/**
 * Logs a user action or lifecycle event directly into Supabase SQL (user_analytics_events table)
 */
export async function logSqlEvent(eventName: string, eventData: Record<string, any> = {}) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    const fp = typeof localStorage !== 'undefined' ? (localStorage.getItem('knowmi_fp') || '') : '';

    let profileId: string | null = null;
    if (user?.id) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      if (prof) profileId = prof.id;
    }

    // 1. Insert into central SQL event stream
    await supabase.from('user_analytics_events').insert({
      user_id: user?.id || null,
      profile_id: profileId,
      event_name: eventName,
      event_data: eventData,
      page_url: typeof window !== 'undefined' ? window.location.href : '',
      visitor_fp: fp
    });

    // 2. Update specific timestamps on profiles table
    if (profileId) {
      const nowIso = new Date().toISOString();
      if (eventName === 'checkout_initiated') {
        await supabase.from('profiles').update({
          last_checkout_at: nowIso
        }).eq('id', profileId);
      } else if (eventName === 'user_login' || eventName === 'user_signup') {
        await supabase.from('profiles').update({
          last_login_at: nowIso
        }).eq('id', profileId);
      } else if (eventName === 'purchase_completed') {
        await supabase.from('profiles').update({
          status: 'paid',
          is_purchased: true,
          purchased_at: nowIso
        }).eq('id', profileId);
      }
    }
  } catch (err) {
    console.warn('SQL Event Logging failed silently:', err);
  }
}

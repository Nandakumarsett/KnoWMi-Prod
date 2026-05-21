import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'npm:web-push'

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Need admin privileges to read subscriptions
    )

    const payload = await req.json()
    const { userId, title, body, url } = payload

    if (!userId) {
      throw new Error('Missing userId in payload')
    }

    // 1. Fetch user's push subscriptions
    const { data: subscriptions, error } = await supabaseClient
      .from('user_push_subscriptions')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: 'No active push subscriptions for this user.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // 2. Setup web-push
    webpush.setVapidDetails(
      'mailto:hello@knowmi.me',
      Deno.env.get('VAPID_PUBLIC_KEY') ?? '',
      Deno.env.get('VAPID_PRIVATE_KEY') ?? ''
    )

    // 3. Send notifications to all user devices
    const notificationPayload = JSON.stringify({
      title: title || 'KnoWMi Notification',
      body: body || '',
      url: url || '/'
    })

    const sendPromises = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth_key
        }
      }

      try {
        await webpush.sendNotification(pushSubscription, notificationPayload)
        return { success: true, id: sub.id }
      } catch (err) {
        console.error(`Error sending to subscription ${sub.id}:`, err)
        // If subscription is invalid/expired (status 410 or 404), delete it
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabaseClient.from('user_push_subscriptions').delete().eq('id', sub.id)
        }
        return { success: false, id: sub.id, error: err.message }
      }
    })

    const results = await Promise.all(sendPromises)

    return new Response(JSON.stringify({ message: 'Push notifications processed', results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (err) {
    console.error('Edge Function Error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

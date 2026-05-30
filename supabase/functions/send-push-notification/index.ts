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

    // ─── Validate payload to prevent malicious notification spamming ───
    const isScanAlert = 
      (title && (title.includes('Scan Alert') || title.includes('scan alert'))) &&
      (body && (body.includes('scanned') && (body.includes('KnoWMi') || body.includes('profile')))) &&
      url === '/dashboard';

    // If it's not a standard scan alert, check if the caller is an authenticated owner/staff
    if (!isScanAlert) {
      const authHeader = req.headers.get('Authorization')
      if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Unauthorized: Custom notification text requires admin authorization' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const client = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: authHeader } } }
      )
      
      const { data: { user }, error: userErr } = await client.auth.getUser()
      if (userErr || !user) {
        return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
          status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Check if the user is a staff/owner
      const { data: profile } = await client
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()
      
      const isStaff = profile && ['owner', 'ambassador', 'collaborator'].includes(profile.role)
      if (!isStaff) {
        return new Response(JSON.stringify({ error: 'Unauthorized: Only staff/owners can send arbitrary push notifications' }), {
          status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }


    // 1. Fetch user's push subscriptions
    const { data: subscriptions, error } = await supabaseClient
      .from('user_push_subscriptions')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    if (!subscriptions || subscriptions.length === 0) {
      console.log('No active push subscriptions. Invoking Email Scan Alert Fallback...')
      try {
        const metadata = payload.metadata || {}
        const device = metadata.device || 'Unknown Device'
        const city = metadata.city || 'Unknown Location'

        // 1. Fetch user's first_name
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('first_name')
          .eq('user_id', userId)
          .single()

        // 2. Fetch user's email address
        const { data: authUser } = await supabaseClient.auth.admin.getUserById(userId)
        const email = authUser?.user?.email

        if (email) {
          await supabaseClient.functions.invoke('send-email', {
            body: {
              type: 'scan_alert',
              to: email,
              toName: profile?.first_name || 'KnoWMi User',
              data: {
                firstName: profile?.first_name || 'KnoWMi User',
                device: device,
                city: city
              }
            }
          })
          console.log(`Scan alert email dispatched to ${email}`)
        }
      } catch (err) {
        console.error('Failed to trigger scan alert email fallback:', err)
      }

      return new Response(JSON.stringify({ message: 'No active push subscriptions. Fallback alert email sent.' }), {
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

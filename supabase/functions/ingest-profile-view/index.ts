import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { profileId, referrer, fp, source, utm_medium, utm_campaign, viewerId, city, country, isRepeat } = await req.json()

    if (!profileId) {
      return new Response(JSON.stringify({ error: 'profileId required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Use SERVICE ROLE so this insert bypasses RLS entirely.
    // Any user scanning a T-shirt QR can record a view on any profile.
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Determine device type from user-agent header
    const userAgent = req.headers.get('user-agent') || ''
    const isMobile = /mobile|android|iphone|ipad/i.test(userAgent)
    const deviceType = isMobile ? 'mobile' : 'desktop'

    // Determine final referrer to store
    // If source is 'tshirt', always store 'tshirt' so analytics can find it
    const storedReferrer = (source === 'tshirt') ? 'tshirt' : (source && source !== 'direct' ? source : referrer || 'direct')

    const { error: insertError } = await adminClient
      .from('profile_view_events')
      .insert({
        profile_id: profileId,
        visitor_fp: fp || 'unknown',
        referrer: storedReferrer,
        device_type: deviceType,
        browser: userAgent.slice(0, 200),
        is_repeat: isRepeat || false,
        viewer_id: viewerId || null,
        city: city || 'Unknown',
        country: country || 'Unknown',
      })

    if (insertError) {
      console.error('Failed to insert profile_view_events:', insertError.message)
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`View recorded: profile=${profileId}, source=${source}, referrer=${storedReferrer}, viewer=${viewerId}`)

    return new Response(JSON.stringify({ success: true, referrer: storedReferrer }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error('ingest-profile-view error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

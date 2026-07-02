import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { handleRateLimit } from '../shared/rateLimiter.ts'
import { getCorsHeaders } from '../shared/cors.ts'
import { sanitizeString, sanitizeUuid } from '../shared/sanitize.ts'

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  // Apply rate limiter — restrict views ingestion per client IP / fingerprint
  const rateLimitResponse = await handleRateLimit(req, { limit: 15, endpoint: 'ingest-profile-view' })
  if (rateLimitResponse) return rateLimitResponse

  try {
    const { profileId, referrer, fp, source, viewerId, city, country, isRepeat } = await req.json()

    // Validate UUID format of profileId
    const cleanProfileId = sanitizeUuid(profileId);
    if (!cleanProfileId) {
      return new Response(JSON.stringify({ error: 'Invalid profileId format' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Sanitize other string inputs
    const cleanReferrer = sanitizeString(referrer, 200);
    const cleanFp = sanitizeString(fp, 100);
    const cleanSource = sanitizeString(source, 50);
    const cleanViewerId = sanitizeUuid(viewerId);
    const cleanCity = sanitizeString(city, 100) || 'Unknown';
    const cleanCountry = sanitizeString(country, 100) || 'Unknown';

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
    const storedReferrer = (cleanSource === 'tshirt') ? 'tshirt' : (cleanSource && cleanSource !== 'direct' ? cleanSource : cleanReferrer || 'direct')

    const { error: insertError } = await adminClient
      .from('profile_view_events')
      .insert({
        profile_id: cleanProfileId,
        visitor_fp: cleanFp || 'unknown',
        referrer: storedReferrer,
        device_type: deviceType,
        browser: sanitizeString(userAgent, 200),
        is_repeat: isRepeat || false,
        viewer_id: cleanViewerId || null,
        city: cleanCity,
        country: cleanCountry,
      })

    if (insertError) {
      console.error('Failed to insert profile_view_events:', insertError.message)
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`View recorded: profile=${cleanProfileId}, source=${cleanSource}, referrer=${storedReferrer}, viewer=${cleanViewerId}`)

    return new Response(JSON.stringify({ success: true, referrer: storedReferrer }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err: any) {
    console.error('ingest-profile-view error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

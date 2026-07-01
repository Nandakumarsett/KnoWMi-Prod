import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { handleRateLimit } from '../shared/rateLimiter.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Rate limit analytics queries to 30 per minute
  const rateLimitResponse = await handleRateLimit(req, { limit: 30, endpoint: 'get-profile-analytics' })
  if (rateLimitResponse) return rateLimitResponse

  try {
    const { profileId } = await req.json()

    if (!profileId) {
      return new Response(JSON.stringify({ error: "Unauthorized access. Please don't try again." }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 1. Verify the requester owns this profile using their JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized access. Please don't try again." }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Use anon client to verify the JWT and get user identity
    const anonClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user }, error: authError } = await anonClient.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized access. Please don't try again." }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 2. Use SERVICE ROLE client to bypass RLS and read all data
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify this user actually owns the requested profileId
    const { data: ownerCheck } = await adminClient
      .from('profiles')
      .select('id')
      .eq('id', profileId)
      .eq('user_id', user.id)
      .single()

    if (!ownerCheck) {
      return new Response(JSON.stringify({ error: "Unauthorized access. Please don't try again." }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 3. Fetch ALL analytics data with service role (no RLS restrictions)
    const [viewsRes, scansRes, linksRes] = await Promise.all([
      adminClient.from('profile_view_events').select('*').eq('profile_id', profileId),
      adminClient.from('qr_scan_events').select('*').eq('profile_id', profileId),
      adminClient.from('link_click_events').select('*').eq('profile_id', profileId),
    ])

    return new Response(JSON.stringify({
      views: viewsRes.data || [],
      scans: scansRes.data || [],
      links: linksRes.data || [],
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error('get-profile-analytics error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

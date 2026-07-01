import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.44.0"
import { handleRateLimit } from '../shared/rateLimiter.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Rate limit broadcast dispatches to 5 per minute per IP / fingerprint
  const rateLimitResponse = await handleRateLimit(req, { limit: 5, endpoint: 'broadcast-email' })
  if (rateLimitResponse) return rateLimitResponse

  try {
    const body = await req.json()
    const { policy_name, summary, effective_date, policy_url, caller_user_id } = body

    if (!policy_name || !summary || !effective_date) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // ─── Cryptographic JWT and Owner Authorization ───
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized access. Please don't try again." }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const client = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user }, error: userError } = await client.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized access. Please don't try again." }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: callerProfile } = await client
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!callerProfile || callerProfile.role !== 'owner') {
      return new Response(JSON.stringify({ error: "Unauthorized access. Please don't try again." }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch all users with emails from auth
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    const users = authUsers?.users || []

    if (users.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: 'No users found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    let sent = 0
    let failed = 0

    // Send in batches of 10 to avoid rate limits
    for (let i = 0; i < users.length; i += 10) {
      const batch = users.slice(i, i + 10)
      
      await Promise.allSettled(batch.map(async (user) => {
        if (!user.email) return

        try {
          const { data: emailRes, error: emailErr } = await supabase.functions.invoke('send-email', {
            body: {
              type: 'policy_change',
              to: user.email,
              toName: user.user_metadata?.first_name || '',
              data: {
                policyName: policy_name,
                effectiveDate: effective_date,
                summary,
                policyUrl: policy_url || `https://knowmi.in/legal`,
              }
            }
          })
          
          if (!emailErr) sent++
          else failed++
        } catch {
          failed++
        }
      }))

      // Small delay between batches
      if (i + 10 < users.length) {
        await new Promise(r => setTimeout(r, 500))
      }
    }

    // Log broadcast in DB
    await supabase.from('email_broadcasts').insert({
      type: 'policy_change',
      subject: `${policy_name} Updated`,
      sent_count: sent,
      failed_count: failed,
      sent_by: user.id,
      metadata: { policy_name, effective_date, summary },
    }).select()

    return new Response(
      JSON.stringify({ success: true, sent, failed, total: users.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('broadcast-email error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

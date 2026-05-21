import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.44.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { policy_name, summary, effective_date, policy_url, caller_user_id } = body

    if (!policy_name || !summary || !effective_date) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify caller is owner
    if (caller_user_id) {
      const { data: callerProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', caller_user_id)
        .single()
      
      if (!callerProfile || callerProfile.role !== 'owner') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    // Fetch all users with emails from auth
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    const users = authUsers?.users || []

    if (users.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: 'No users found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    let sent = 0
    let failed = 0

    // Send in batches of 10 to avoid rate limits
    for (let i = 0; i < users.length; i += 10) {
      const batch = users.slice(i, i + 10)
      
      await Promise.allSettled(batch.map(async (user) => {
        if (!user.email) return

        try {
          const res = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'policy_change',
              to: user.email,
              toName: user.user_metadata?.first_name || '',
              data: {
                policyName: policy_name,
                effectiveDate: effective_date,
                summary,
                policyUrl: policy_url || `https://knowmi.in/legal`,
              }
            }),
          })
          
          if (res.ok) sent++
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
      sent_by: caller_user_id || null,
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

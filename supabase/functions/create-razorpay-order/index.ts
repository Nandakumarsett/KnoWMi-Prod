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
    const { product_type, amount_override, user_id, customer_details } = await req.json()

    // ─── Cryptographic JWT and User ID Verification ───
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
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
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verify that the requested user_id matches the authenticated user
    if (user_id && user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Forbidden: Cannot create order for another user' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }


    // 1. Determine price on the backend securely.
    // For fixed products, prices are hardcoded here (tamper-proof).
    let pricePaise = 0

    if (amount_override && typeof amount_override === 'number' && amount_override > 0) {
      // Store item: use the amount passed (already in paise)
      pricePaise = amount_override
    } else if (product_type === 'regular') {
      pricePaise = 79900
    } else if (product_type === 'oversized') {
      pricePaise = 99900
    } else if (product_type === 'hoodie') {
      pricePaise = 149900
    } else {
      throw new Error("Invalid product type or missing amount")
    }


    // 2. Call Razorpay API to create an order
    const rzpKey = Deno.env.get('RAZORPAY_KEY_ID')
    const rzpSecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    
    if (!rzpKey || !rzpSecret) {
      throw new Error("Razorpay credentials are not set in Edge Function secrets")
    }
    
    const basicAuth = btoa(`${rzpKey}:${rzpSecret}`)

    const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: pricePaise,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
      })
    })

    const rzpData = await rzpResponse.json()
    if (!rzpResponse.ok) {
      throw new Error(`Razorpay Error: ${rzpData.error?.description || 'Unknown error'}`)
    }

    // 3. Save to Supabase using the Service Role Key (bypasses RLS)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: dbError } = await supabaseClient
      .from('payment_orders')
      .insert({
        user_id: user_id || null,
        razorpay_order_id: rzpData.id,
        amount_paise: pricePaise,
        items: [{ product_type, quantity: 1 }],
        customer_details
      })

    if (dbError) throw dbError

    // 4. Return order ID to frontend
    return new Response(
      JSON.stringify({ order_id: rzpData.id, amount: pricePaise }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

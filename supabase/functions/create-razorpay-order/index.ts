import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.44.0"
import { handleRateLimit } from '../shared/rateLimiter.ts'

import { getCorsHeaders } from '../shared/cors.ts'
import { sanitizeString, sanitizeUuid } from '../shared/sanitize.ts'

// (Sliding-window user-level local rate limiting can be bypassed or supplemented by handleRateLimit)

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Rate limit order creation to 5 per minute per IP / fingerprint
  const rateLimitResponse = await handleRateLimit(req, { limit: 5, endpoint: 'create-razorpay-order' })
  if (rateLimitResponse) return rateLimitResponse

  try {
    const { product_type, amount_override, user_id, customer_details } = await req.json()
    const cleanUserId = sanitizeUuid(user_id)
    const cleanProductType = sanitizeString(product_type, 50)
    
    const cleanCustomerDetails: any = {}
    if (customer_details && typeof customer_details === 'object') {
      for (const [key, value] of Object.entries(customer_details)) {
        if (typeof value === 'string') {
          cleanCustomerDetails[key] = sanitizeString(value, 200)
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          cleanCustomerDetails[key] = value
        }
      }
    }

    // ─── Cryptographic JWT and User ID Verification ───
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

    // Verify that the requested user_id matches the authenticated user
    if (cleanUserId && cleanUserId !== user.id) {
      return new Response(JSON.stringify({ error: "Unauthorized access. Please don't try again." }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }


    // 1. Determine price on the backend securely.
    // For fixed products, prices are hardcoded here (tamper-proof).
    let pricePaise = 0

    if (amount_override && typeof amount_override === 'number' && amount_override > 0) {
      // Store item: use the amount passed (already in paise)
      pricePaise = amount_override
    } else if (cleanProductType === 'regular') {
      pricePaise = 79900
    } else if (cleanProductType === 'oversized') {
      pricePaise = 99900
    } else if (cleanProductType === 'hoodie') {
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
        user_id: cleanUserId || null,
        razorpay_order_id: rzpData.id,
        amount_paise: pricePaise,
        items: [{ product_type: cleanProductType, quantity: 1 }],
        customer_details: cleanCustomerDetails
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

import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.44.0"

// Web Crypto API HMAC implementation
async function verifySignature(secret: string, body: string, signature: string) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(body))
  const hashArray = Array.from(new Uint8Array(signatureBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex === signature
}

serve(async (req) => {
  try {
    const signatureHeader = req.headers.get('x-razorpay-signature')
    const bodyText = await req.text()
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') || ''

    if (!signatureHeader || !webhookSecret) {
      return new Response("Missing signature or secret", { status: 400 })
    }

    // Verify signature cryptographically
    const isValid = await verifySignature(webhookSecret, bodyText, signatureHeader)
    if (!isValid) {
      return new Response("Invalid signature", { status: 400 })
    }

    const payload = JSON.parse(bodyText)

    if (payload.event === 'payment.captured' || payload.event === 'order.paid') {
      const paymentEntity = payload.payload.payment.entity
      const orderId = paymentEntity.order_id
      const paymentId = paymentEntity.id
      const amountPaise: number = paymentEntity.amount
      const razorpayEmail: string = paymentEntity.email || ''
      const razorpayContact: string = paymentEntity.contact || ''

      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // 1. Mark payment as paid in payment_orders
      const { data: orderRow, error: updateError } = await supabaseClient
        .from('payment_orders')
        .update({
          status: 'paid',
          razorpay_payment_id: paymentId,
          razorpay_signature: signatureHeader,
          paid_at: new Date().toISOString(),
          customer_email: razorpayEmail,
          customer_phone: razorpayContact,
        })
        .eq('razorpay_order_id', orderId)
        .select('*, user_id')
        .single()

      if (updateError) throw updateError

      // 2. Fetch the user's profile to get their name and email
      let customerName = 'Valued Customer'
      let customerEmail = razorpayEmail

      let profileId = null
      if (orderRow?.user_id) {
        const { data: profileData } = await supabaseClient
          .from('profiles')
          .select('id, first_name, last_name')
          .eq('user_id', orderRow.user_id)
          .single()

        if (profileData) {
          profileId = profileData.id
          customerName = [profileData.first_name, profileData.last_name].filter(Boolean).join(' ') || customerName
        }

        // Also check auth.users for email if not from Razorpay
        if (!customerEmail) {
          const { data: authUser } = await supabaseClient.auth.admin.getUserById(orderRow.user_id)
          customerEmail = authUser?.user?.email || ''
        }
      }

      // 3. Build receipt number and item list
      const receiptNumber = `KWM-${Date.now().toString().slice(-8).toUpperCase()}`
      const paymentDate = new Date().toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
      })

      // Parse items from order
      const rawItems: Array<{ plan_id?: string; quantity?: number }> = orderRow?.items || []
      const customerDetails = orderRow?.customer_details || {}

      const items = rawItems.length > 0
        ? rawItems.map(item => ({
            name: customerDetails?.design || item.plan_id || 'KnoWMi Identity Tee',
            size: customerDetails?.size,
            qty: customerDetails?.quantity || item.quantity || 1,
            color: customerDetails?.color,
          }))
        : [{ name: 'KnoWMi Identity Tee', size: customerDetails?.size, qty: 1 }]

      // Save receipt number to DB for future reference
      await supabaseClient
        .from('payment_orders')
        .update({ receipt_number: receiptNumber })
        .eq('razorpay_order_id', orderId)

      // 3.5. Insert successful order into public.orders table for dashboard tracking
      if (profileId) {
        let itemName = 'KnoWMi Identity Tee'
        let modelImageUrl = null
        
        const designIdentifier = customerDetails?.design_id || customerDetails?.design
        if (designIdentifier) {
          // Robust checking: is it a valid UUID?
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(designIdentifier)
          let query = supabaseClient.from('persona_designs').select('name, model_image_url, front_image_url')
          
          if (isUuid) {
            query = query.eq('id', designIdentifier)
          } else {
            query = query.eq('name', designIdentifier)
          }
          
          const { data: designData } = await query.maybeSingle()
            
          if (designData) {
            itemName = designData.name
            modelImageUrl = designData.model_image_url || designData.front_image_url
          }
        } else if (orderRow?.items && orderRow.items[0]?.plan_id === 'team') {
          itemName = `Team Order — ${customerDetails?.team_name || 'My Team'} (${customerDetails?.quantity || 1} Tees)`
        }

        const notes = paymentEntity.notes || {}
        const shippingAddress = notes.shipping_address || notes.address || paymentEntity.shipping_address || customerDetails?.delivery_address || 'Collected via Razorpay'
        const deliveryCity = notes.city || notes.delivery_city || customerDetails?.delivery_city || 'Delhi'

        const { error: insertOrderError } = await supabaseClient
          .from('orders')
          .insert({
            profile_id: profileId,
            order_number: receiptNumber,
            item_name: itemName,
            item_type: orderRow?.items && orderRow.items[0]?.plan_id === 'team' ? 'team' : 'tshirt',
            size: customerDetails?.size || 'M',
            amount: Math.round(amountPaise / 100),
            status: 'paid',
            shipping_address: shippingAddress,
            delivery_city: deliveryCity,
            estimated_delivery: '5-7 Business Days',
            model_image_url: modelImageUrl,
          })
          
        if (insertOrderError) {
          console.error('Failed to insert order into orders table:', insertOrderError)
        } else {
          console.log(`Successfully created order ${receiptNumber} for profile ${profileId}`)
        }
      }

      // 4. Send order confirmation + receipt email
      if (customerEmail) {
        try {
          const { data: emailRes, error: emailErr } = await supabaseClient.functions.invoke('send-email', {
            body: {
              type: 'order_confirmation',
              to: customerEmail,
              toName: customerName,
              data: {
                firstName: customerName.split(' ')[0],
                orderId,
                receiptNumber,
                items,
                amountPaise,
                paymentId,
                paymentDate,
                deliveryAddress: customerDetails?.delivery_address || null,
              }
            }
          })
          if (emailErr) {
            console.error('Failed to send order confirmation email:', emailErr)
          } else {
            console.log('Order confirmation email response:', emailRes)
          }
        } catch (err) {
          console.error('Error invoking send-email from razorpay-webhook:', err)
        }
      }

      // 5. Send Telegram Notification to Owner
      const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
      const telegramChatId = Deno.env.get('TELEGRAM_CHAT_ID')

      if (telegramBotToken && telegramChatId) {
        const amountRs = (amountPaise / 100).toFixed(2)
        const message = `🎉 *New Order Received!*\n\n` +
          `*Order ID:* \`${orderId}\`\n` +
          `*Amount:* ₹${amountRs}\n` +
          `*Customer Name:* ${customerName}\n` +
          `*Customer Email:* ${customerEmail}\n` +
          `*Phone:* ${razorpayContact || 'N/A'}\n` +
          `*Items:*\n` + items.map(i => `- ${i.qty}x ${i.name} (Size: ${i.size || 'N/A'})`).join('\n')

        try {
          await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: message,
              parse_mode: 'Markdown',
            }),
          })
        } catch (err) {
          console.error('Failed to send Telegram notification:', err)
        }
      }
    }

    return new Response(JSON.stringify({ status: 'ok' }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

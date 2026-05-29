import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ─── Email Templates ──────────────────────────────────────

function baseLayout(content: string, previewText = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>KnoWMi</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    body { margin: 0; padding: 0; background: #F8F5F0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 16px; }
    .card { background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
    .header { background: #0F172A; padding: 32px 40px; text-align: center; }
    .header-brand { font-size: 28px; font-weight: 900; color: #ffffff; letter-spacing: -0.05em; }
    .header-brand span { color: #FF9933; }
    .header-sub { font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 0.15em; text-transform: uppercase; margin-top: 4px; }
    .body { padding: 40px; }
    .greeting { font-size: 22px; font-weight: 800; color: #0F172A; margin: 0 0 8px; }
    .subtext { font-size: 14px; color: #64748B; line-height: 1.6; margin: 0 0 32px; }
    .divider { height: 1px; background: #F1F5F9; margin: 28px 0; }
    .label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #94A3B8; margin-bottom: 4px; }
    .value { font-size: 15px; font-weight: 700; color: #0F172A; }
    .value-mono { font-family: 'Courier New', monospace; font-size: 14px; font-weight: 700; color: #0F172A; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .cta-btn { display: inline-block; background: linear-gradient(135deg, #F97316, #EA580C); color: #ffffff; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 32px; border-radius: 12px; text-align: center; letter-spacing: 0.02em; }
    .cta-center { text-align: center; margin: 32px 0; }
    .total-box { background: #0F172A; border-radius: 14px; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; margin: 24px 0; }
    .total-label { font-size: 12px; color: rgba(255,255,255,0.5); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
    .total-amount { font-size: 26px; font-weight: 900; color: #FF9933; }
    .badge { display: inline-block; background: #DCFCE7; color: #16A34A; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.08em; }
    .tip-box { background: #FFF7ED; border-left: 3px solid #FF9933; padding: 14px 18px; border-radius: 0 10px 10px 0; font-size: 13px; color: #7C2D12; line-height: 1.5; margin: 20px 0; }
    .footer { background: #F8F5F0; padding: 24px 40px; text-align: center; }
    .footer p { font-size: 11px; color: #94A3B8; line-height: 1.7; margin: 0; }
    .footer a { color: #FF9933; text-decoration: none; }
    @media (max-width: 480px) {
      .body { padding: 28px 24px; }
      .grid-2 { grid-template-columns: 1fr; gap: 14px; }
    }
  </style>
</head>
<body>
  <div style="display:none;max-height:0;overflow:hidden;">${previewText}&nbsp;‌&nbsp;‌&nbsp;‌</div>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="header-brand">Kno<span>WM</span>i</div>
        <div class="header-sub">Scan Me. Know Me.</div>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <p>
          KnoWMi — India's first QR-enabled identity t-shirt<br/>
          Questions? <a href="mailto:bussiness@knowmi.in">bussiness@knowmi.in</a> ·
          <a href="https://wa.me/917981325397">WhatsApp</a><br/>
          <a href="https://knowmi.in/legal#privacy">Privacy Policy</a> ·
          <a href="https://knowmi.in/legal#terms">Terms of Service</a><br/>
          <span style="color:#CBD5E1;">© 2025 KnoWMi. Made with ❤️ in India.</span>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`
}

// Template 1: Order Confirmation / Payment Receipt
function orderConfirmationTemplate(data: {
  firstName: string
  orderId: string
  receiptNumber: string
  items: Array<{ name: string; size?: string; qty?: number; color?: string }>
  amountPaise: number
  paymentId: string
  paymentDate: string
  deliveryAddress?: string
}) {
  const amount = (data.amountPaise / 100).toLocaleString('en-IN')
  const itemRows = data.items.map(item => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #F1F5F9;">
      <div>
        <div class="value">${item.name}</div>
        <div style="font-size:12px;color:#94A3B8;margin-top:2px;">
          ${[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`, item.qty && item.qty > 1 && `Qty: ${item.qty}`].filter(Boolean).join(' · ')}
        </div>
      </div>
    </div>
  `).join('')

  const content = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
      <span class="badge">✓ Payment Confirmed</span>
    </div>
    <p class="greeting">Your order is confirmed, ${data.firstName}! 🎉</p>
    <p class="subtext">We've received your payment and your KnoWMi tee is now in production. We'll send you another update when it ships.</p>

    <div class="divider"></div>

    <div class="grid-2">
      <div>
        <div class="label">Receipt No.</div>
        <div class="value-mono">${data.receiptNumber}</div>
      </div>
      <div>
        <div class="label">Payment ID</div>
        <div class="value-mono" style="font-size:11px;">${data.paymentId}</div>
      </div>
      <div>
        <div class="label">Date</div>
        <div class="value">${data.paymentDate}</div>
      </div>
      <div>
        <div class="label">Order Status</div>
        <div class="value" style="color:#16A34A;">In Production</div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="label" style="margin-bottom:12px;">Order Items</div>
    ${itemRows}

    <div class="total-box">
      <div>
        <div class="total-label">Total Paid</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.3);margin-top:2px;">All taxes included</div>
      </div>
      <div class="total-amount">₹${amount}</div>
    </div>

    ${data.deliveryAddress ? `
    <div style="margin-bottom:20px;">
      <div class="label">Delivery Address</div>
      <div class="value" style="font-size:13px;line-height:1.6;">${data.deliveryAddress}</div>
    </div>
    ` : ''}

    <div class="tip-box">
      <strong>📦 What's next?</strong> Production takes 3–5 business days. Once your tee is dispatched, you'll receive a shipping notification with a tracking number. You can also track your order at <a href="https://knowmi.in/track" style="color:#EA580C;font-weight:700;">knowmi.in/track</a>.
    </div>

    <div class="divider"></div>

    <p style="font-size:13px;color:#64748B;line-height:1.7;">Need help? Reply to this email or message us on <a href="https://wa.me/917981325397" style="color:#FF9933;font-weight:700;">WhatsApp</a>. Please quote your Receipt No. <strong>${data.receiptNumber}</strong> for faster support.</p>

    <div class="cta-center">
      <a href="https://knowmi.in/dashboard" class="cta-btn">Go to My Dashboard →</a>
    </div>
  `
  return baseLayout(content, `Order confirmed ✓ Receipt ${data.receiptNumber} · ₹${amount} paid`)
}

// Template 2: Welcome Email (first signup)
function welcomeEmailTemplate(data: { firstName: string; email: string }) {
  const content = `
    <p class="greeting">Welcome to KnoWMi, ${data.firstName}! 👋</p>
    <p class="subtext">You've just joined something new. KnoWMi is India's first QR-enabled identity t-shirt — one scan, and the world knows who you are.</p>

    <div class="divider"></div>

    <div style="margin-bottom:24px;">
      <div class="label" style="margin-bottom:12px;">Here's how to get started</div>
      ${[
        ['1', 'Set up your profile', 'Add your name, bio, social links, and photo. This is what people see when they scan your QR.', 'https://knowmi.in/studio'],
        ['2', 'Pick your identity tee', 'Browse designs made for Tech folks, Content Creators, and Students.', 'https://knowmi.in/shop'],
        ['3', 'Share your world', 'Once your tee arrives, wear it — and let your QR do the talking.', null],
      ].map(([num, title, desc, link]) => `
        <div style="display:flex;gap:16px;margin-bottom:20px;align-items:flex-start;">
          <div style="min-width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#F97316,#EA580C);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:900;color:#fff;">${num}</div>
          <div>
            <div style="font-size:14px;font-weight:700;color:#0F172A;">${title}</div>
            <div style="font-size:13px;color:#64748B;margin-top:2px;">${desc}</div>
            ${link ? `<a href="${link}" style="font-size:12px;color:#FF9933;font-weight:700;text-decoration:none;">Get started →</a>` : ''}
          </div>
        </div>
      `).join('')}
    </div>

    <div class="divider"></div>

    <div class="cta-center">
      <a href="https://knowmi.in/shop" class="cta-btn">Browse Tee Designs →</a>
    </div>

    <p style="font-size:12px;color:#94A3B8;text-align:center;margin-top:20px;">Your account: ${data.email}</p>
  `
  return baseLayout(content, 'Welcome to KnoWMi — your digital identity starts here')
}

// Template 3: Dispatch / Shipping Notification
function dispatchEmailTemplate(data: {
  firstName: string
  orderNumber: string
  courierName: string
  trackingNumber: string
  estimatedDelivery?: string
}) {
  const content = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
      <span class="badge" style="background:#DBEAFE;color:#1D4ED8;">🚚 Shipped!</span>
    </div>
    <p class="greeting">Your tee is on its way, ${data.firstName}!</p>
    <p class="subtext">Your KnoWMi has been handed over to our courier partner and is heading to you.</p>

    <div class="divider"></div>

    <div class="grid-2">
      <div>
        <div class="label">Order Number</div>
        <div class="value-mono">${data.orderNumber}</div>
      </div>
      <div>
        <div class="label">Courier</div>
        <div class="value">${data.courierName}</div>
      </div>
      <div>
        <div class="label">Tracking Number</div>
        <div class="value-mono" style="color:#FF9933;">${data.trackingNumber}</div>
      </div>
      ${data.estimatedDelivery ? `
      <div>
        <div class="label">Est. Delivery</div>
        <div class="value">${data.estimatedDelivery}</div>
      </div>
      ` : ''}
    </div>

    <div class="tip-box">
      <strong>📦 Tracking tip:</strong> It may take 4–6 hours for the tracking number to show live status on the courier's website. If you face any issues after 24 hours, reach out to us on WhatsApp.
    </div>

    <div class="divider"></div>

    <div class="cta-center">
      <a href="https://knowmi.in/track" class="cta-btn">Track My Order →</a>
    </div>

    <p style="font-size:13px;color:#64748B;text-align:center;margin-top:12px;">
      Need help? <a href="https://wa.me/917981325397" style="color:#FF9933;font-weight:700;">WhatsApp us</a> with your order number.
    </p>
  `
  return baseLayout(content, `Your KnoWMi is shipped! Tracking: ${data.trackingNumber}`)
}

// Template 4: Policy Change Notification
function policyChangeTemplate(data: {
  policyName: string
  effectiveDate: string
  summary: string
  policyUrl: string
}) {
  const content = `
    <p class="greeting">We've updated our ${data.policyName}</p>
    <p class="subtext">At KnoWMi, we committed to notifying you in advance of any policy changes. Here's a summary of what's changing and when.</p>

    <div class="divider"></div>

    <div class="grid-2">
      <div>
        <div class="label">Policy</div>
        <div class="value">${data.policyName}</div>
      </div>
      <div>
        <div class="label">Effective From</div>
        <div class="value">${data.effectiveDate}</div>
      </div>
    </div>

    <div style="background:#F8FAFC;border-radius:12px;padding:20px;margin:20px 0;">
      <div class="label" style="margin-bottom:10px;">Summary of Changes</div>
      <div style="font-size:14px;color:#334155;line-height:1.7;">${data.summary.replace(/\n/g, '<br/>')}</div>
    </div>

    <div class="tip-box">
      Your continued use of KnoWMi after <strong>${data.effectiveDate}</strong> constitutes acceptance of the updated policy. If you have questions or concerns, please email us before that date.
    </div>

    <div class="cta-center">
      <a href="${data.policyUrl}" class="cta-btn">Read Full Policy →</a>
    </div>

    <p style="font-size:13px;color:#64748B;text-align:center;margin-top:12px;">
      Questions? <a href="mailto:support.knowmi@gmail.com" style="color:#FF9933;font-weight:700;">support.knowmi@gmail.com</a>
    </p>
  `
  return baseLayout(content, `Important: KnoWMi ${data.policyName} updated — effective ${data.effectiveDate}`)
}

// Template 5: Return Request Confirmation
function returnRequestTemplate(data: {
  firstName: string
  requestId: string
  orderNumber: string
  issueDescription: string
}) {
  const content = `
    <p class="greeting">We've received your return request, ${data.firstName}.</p>
    <p class="subtext">Our team will review your request and get back to you within 2 business days. Please keep your unboxing video ready — we may ask you to share it during review.</p>

    <div class="divider"></div>

    <div class="grid-2">
      <div>
        <div class="label">Request ID</div>
        <div class="value-mono">${data.requestId}</div>
      </div>
      <div>
        <div class="label">Order</div>
        <div class="value-mono">${data.orderNumber}</div>
      </div>
    </div>

    <div style="background:#F8FAFC;border-radius:12px;padding:16px;margin:16px 0;">
      <div class="label" style="margin-bottom:6px;">Your Issue</div>
      <div style="font-size:14px;color:#334155;">${data.issueDescription}</div>
    </div>

    <div class="tip-box">
      <strong>Reminder:</strong> A valid, continuous, uncut unboxing video is required for all return or exchange requests. No video = No return/exchange.
    </div>

    <div class="cta-center">
      <a href="https://wa.me/917981325397" class="cta-btn">Share Video on WhatsApp →</a>
    </div>
  `
  return baseLayout(content, `Return request received — we'll get back within 2 business days`)
}

// Template 6: Account Deletion Request Acknowledgement
function deletionRequestTemplate(data: { firstName: string; email: string; requestId: string }) {
  const content = `
    <p class="greeting">Account deletion request received</p>
    <p class="subtext">We've received your request to delete your KnoWMi account and personal data. We're sorry to see you go.</p>

    <div class="divider"></div>

    <div class="grid-2">
      <div>
        <div class="label">Request ID</div>
        <div class="value-mono">${data.requestId}</div>
      </div>
      <div>
        <div class="label">Account Email</div>
        <div class="value" style="font-size:13px;">${data.email}</div>
      </div>
    </div>

    <div style="background:#FEF2F2;border-left:3px solid #EF4444;padding:14px 18px;border-radius:0 10px 10px 0;font-size:13px;color:#7F1D1D;line-height:1.5;margin:20px 0;">
      <strong>What happens next:</strong> Our team will process your deletion request within <strong>7 working days</strong>. We'll permanently remove your profile, analytics data, and personal information. Any QR links associated with your Tee will automatically redirect visitors to KnoWMi's "Claim Your Tee" page. Order records will be retained for 7 years for tax compliance as required by Indian law.
    </div>

    <p style="font-size:13px;color:#64748B;line-height:1.7;">Changed your mind? Reply to this email or contact us at <a href="mailto:support.knowmi@gmail.com" style="color:#FF9933;font-weight:700;">support.knowmi@gmail.com</a> before we process the deletion and we'll cancel the request.</p>
  `
  return baseLayout(content, `Account deletion request ${data.requestId} — KnoWMi`)
}

// Template 6b: Admin Alert — Account Deletion Request
function adminDeletionAlertTemplate(data: { email: string; requestId: string; reason?: string; submittedAt: string }) {
  const content = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
      <span class="badge" style="background:#FEE2E2;color:#991B1B;">🚨 Action Required</span>
    </div>
    <p class="greeting">A user has requested account deletion</p>
    <p class="subtext">You have 7 working days to process this request. Once done, delete the user from Supabase Auth Dashboard to complete the deletion.</p>

    <div class="divider"></div>

    <div class="grid-2">
      <div>
        <div class="label">Request ID</div>
        <div class="value-mono">${data.requestId}</div>
      </div>
      <div>
        <div class="label">Submitted At</div>
        <div class="value">${data.submittedAt}</div>
      </div>
      <div>
        <div class="label">User Email</div>
        <div class="value" style="font-size:13px;color:#EF4444;font-weight:800;">${data.email}</div>
      </div>
      <div>
        <div class="label">Deadline</div>
        <div class="value" style="color:#EF4444;">Within 7 working days</div>
      </div>
    </div>

    ${data.reason ? `
    <div style="background:#F8FAFC;border-radius:12px;padding:16px;margin:16px 0;">
      <div class="label" style="margin-bottom:6px;">Reason Given by User</div>
      <div style="font-size:14px;color:#334155;">${data.reason}</div>
    </div>
    ` : '<p style="font-size:13px;color:#94A3B8;">No reason provided by user.</p>'}

    <div class="tip-box">
      <strong>Steps to process:</strong>
      <ol style="margin:8px 0 0;padding-left:20px;font-size:13px;line-height:2;">
        <li>Go to <a href="https://supabase.com/dashboard" style="color:#EA580C;font-weight:700;">Supabase Dashboard → Authentication → Users</a></li>
        <li>Search for <strong>${data.email}</strong> and delete the user</li>
        <li>Update the deletion_requests table status to <strong>completed</strong></li>
      </ol>
    </div>

    <div class="cta-center">
      <a href="https://supabase.com/dashboard" class="cta-btn" style="background:linear-gradient(135deg,#EF4444,#DC2626);">Go to Supabase Dashboard →</a>
    </div>
  `
  return baseLayout(content, `🚨 Deletion request ${data.requestId} — Action required within 7 days`)
}

// Template 6c: Account Deletion Completed
function deletionCompletedTemplate(data: { email: string }) {
  const content = `
    <p class="greeting">Your account has been deleted</p>
    <p class="subtext">This is to confirm that your KnoWMi account associated with <strong>${data.email}</strong> and all of your personal data have been permanently removed from our systems.</p>

    <div class="divider"></div>

    <div style="background:#F8FAFC;border-left:3px solid #64748B;padding:14px 18px;border-radius:0 10px 10px 0;font-size:13px;color:#334155;line-height:1.5;margin:20px 0;">
      <strong>What was removed:</strong>
      <ul style="margin:6px 0 0;padding-left:20px;">
        <li>Your digital profile, bio, and social links.</li>
        <li>Your historical scan analytics and geolocations.</li>
        <li>All active QR token associations linked to your physical items.</li>
      </ul>
    </div>

    <p style="font-size:13px;color:#64748B;line-height:1.7;">If you ever decide to return, you can create a new account at any time. Any printed QR codes on your KnoWMi products are now free and can be claimed by a new account.</p>
    
    <p style="font-size:13px;color:#64748B;line-height:1.7;">Thank you for being a part of KnoWMi.</p>
  `
  return baseLayout(content, `Account permanently deleted — KnoWMi`)
}

// Template 7: Profile Scan Alert (omnichannel fallback)
function scanAlertTemplate(data: { firstName: string; device: string; city: string }) {
  const content = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
      <span class="badge" style="background:#FFEFD5;color:#D97706;">🔥 Scan Alert</span>
    </div>
    <p class="greeting">New Scan Detected, ${data.firstName}! 🚀</p>
    <p class="subtext">Someone just scanned your physical KnoWMi profile using a <strong>${data.device}</strong> browser.</p>

    <div class="divider"></div>

    <div class="grid-2">
      <div>
        <div class="label">Device Info</div>
        <div class="value">${data.device}</div>
      </div>
      <div>
        <div class="label">Approx. Location</div>
        <div class="value" style="color:#FF9933;">${data.city || 'Unknown'}</div>
      </div>
    </div>

    <div class="tip-box">
      ⚡ Your live identity dashboard has logged this event! Open your dashboard to view your profile velocity, streak progress, and detailed geolocation history.
    </div>

    <div class="divider"></div>

    <div class="cta-center">
      <a href="https://knowmi.in/dashboard" class="cta-btn">Open My Dashboard →</a>
    </div>

    <p style="font-size:12px;color:#94A3B8;text-align:center;margin-top:20px;">To manage notification alerts, visit your KnoWMi profile settings page.</p>
  `
  return baseLayout(content, `🔥 New KnoWMi Scan Alert from ${data.city || 'someone'}!`)
}

// ─── Main Handler ─────────────────────────────────────────

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { type, to, toName, data } = body

    if (!type || !to) {
      return new Response(JSON.stringify({ error: 'Missing type or to' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable not set')
    }

    let subject = ''
    let html = ''

    switch (type) {
      case 'order_confirmation':
        subject = `✓ Order Confirmed — Receipt ${data.receiptNumber} | KnoWMi`
        html = orderConfirmationTemplate(data)
        break
      case 'welcome':
        subject = `Welcome to KnoWMi, ${toName || 'there'}! 👋`
        html = welcomeEmailTemplate(data)
        break
      case 'dispatch':
        subject = `🚚 Your KnoWMi is shipped! Tracking: ${data.trackingNumber}`
        html = dispatchEmailTemplate(data)
        break
      case 'policy_change':
        subject = `KnoWMi ${data.policyName} — Updated`
        html = policyChangeTemplate(data)
        break
      case 'return_request':
        subject = `Return request received — ${data.requestId} | KnoWMi`
        html = returnRequestTemplate(data)
        break
      case 'deletion_request': {
        subject = `Account deletion request received — KnoWMi`
        html = deletionRequestTemplate(data)
        // Also fire an admin alert email immediately
        const adminHtml = adminDeletionAlertTemplate({
          email: data.email,
          requestId: data.requestId,
          reason: data.reason || null,
          submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })
        })
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'KnoWMi Alerts <alerts@knowmi.in>',
            reply_to: data.email,
            to: ['bussiness@knowmi.in'],
            subject: `🚨 [ACTION REQUIRED] Account deletion request ${data.requestId} — ${data.email}`,
            html: adminHtml,
          }),
        })
        break
      }
      case 'scan_alert':
        subject = `🔥 New KnoWMi Scan Alert from ${data.city || 'someone'}!`
        html = scanAlertTemplate(data)
        break
      case 'deletion_completed':
        subject = `Account permanently deleted — KnoWMi`
        html = deletionCompletedTemplate(data)
        break
      default:
        return new Response(JSON.stringify({ error: `Unknown email type: ${type}` }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }

    // Send via Resend — using verified knowmi.in domain
    // FROM addresses are virtual (no inbox needed), replies route to bussiness@knowmi.in
    const fromAddress = (() => {
      switch (type) {
        case 'order_confirmation': return 'KnoWMi Orders <orders@knowmi.in>'
        case 'dispatch':           return 'KnoWMi Orders <orders@knowmi.in>'
        case 'welcome':            return 'KnoWMi <hello@knowmi.in>'
        case 'return_request':     return 'KnoWMi Support <support@knowmi.in>'
        case 'deletion_request':   return 'KnoWMi Support <support@knowmi.in>'
        case 'policy_change':      return 'KnoWMi Legal <legal@knowmi.in>'
        case 'scan_alert':         return 'KnoWMi Alerts <alerts@knowmi.in>'
        case 'deletion_completed': return 'KnoWMi Support <support@knowmi.in>'
        default:                   return 'KnoWMi <hello@knowmi.in>'
      }
    })()

    const resendPayload = {
      from: fromAddress,
      reply_to: 'bussiness@knowmi.in',
      to: [to],
      subject,
      html,
    }

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resendPayload),
    })

    const resendData = await resendRes.json()

    if (!resendRes.ok) {
      throw new Error(`Resend error: ${JSON.stringify(resendData)}`)
    }

    return new Response(
      JSON.stringify({ success: true, messageId: resendData.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('send-email error:', error)
    // Return 200 so the frontend gets the JSON body instead of a generic non-2xx error
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import {
  CheckCircle, XCircle, Loader2, Mail, Webhook,
  ShoppingCart, UserPlus, Truck, Shield, RotateCcw, Trash2,
  AlertTriangle, ExternalLink, Copy, Check
} from 'lucide-react'

// ── Status badge ─────────────────────────────────────────
function StatusBadge({ status }) {
  if (status === 'idle')    return <span className="text-[11px] font-bold text-neutral-400">⬤ Idle</span>
  if (status === 'loading') return <Loader2 size={14} className="animate-spin text-orange-400" />
  if (status === 'ok')      return <span className="text-[11px] font-bold text-green-600 flex items-center gap-1"><CheckCircle size={13} /> Sent ✓</span>
  if (status === 'error')   return <span className="text-[11px] font-bold text-red-500 flex items-center gap-1"><XCircle size={13} /> Failed</span>
  return null
}

// ── One test card ─────────────────────────────────────────
function TestCard({ icon: Icon, title, desc, btnLabel, onRun, status, detail, color = '#F97316' }) {
  return (
    <div className="rounded-xl p-5" style={{ background: 'white', border: '1px solid var(--border2)' }}>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: color + '18' }}>
          <Icon size={17} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{title}</p>
          <p className="text-[11px] text-neutral-400 mt-0.5">{desc}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      {detail && (
        <div className={`text-[11px] px-3 py-2 rounded-lg mb-3 font-medium leading-relaxed
          ${status === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {detail}
        </div>
      )}
      <button
        onClick={onRun}
        disabled={status === 'loading'}
        className="w-full py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
        style={{ background: status === 'loading' ? 'var(--off)' : color + '15', color: status === 'loading' ? 'var(--muted)' : color, border: `1px solid ${color}30` }}
      >
        {status === 'loading' ? 'Sending…' : btnLabel}
      </button>
    </div>
  )
}

// ── Copy box ─────────────────────────────────────────────
function CopyBox({ label, value }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border2)' }}>
      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide"
        style={{ background: 'var(--off)', color: 'var(--muted)', borderBottom: '1px solid var(--border2)' }}>
        {label}
      </div>
      <div className="flex items-center gap-2 px-3 py-2">
        <code className="text-xs flex-1 text-neutral-700 break-all font-mono">{value}</code>
        <button onClick={copy} className="flex-shrink-0 p-1 rounded hover:bg-neutral-100 transition-all">
          {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} className="text-neutral-400" />}
        </button>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────
export default function TestCenterAdmin() {
  const { user, profile } = useAuth()
  const [statuses, setStatuses] = useState({})
  const [details, setDetails] = useState({})

  const setStatus = (key, status, detail = '') => {
    setStatuses(s => ({ ...s, [key]: status }))
    setDetails(d => ({ ...d, [key]: detail }))
  }

  // Helper: invoke send-email and handle result
  const sendTestEmail = async (key, payload) => {
    setStatus(key, 'loading')
    try {
      const { data, error } = await supabase.functions.invoke('send-email', { body: payload })
      if (error || data?.error) throw new Error(error?.message || data?.error)
      setStatus(key, 'ok', `Email sent to ${payload.to} — check your inbox!`)
    } catch (err) {
      setStatus(key, 'error', err.message)
    }
  }

  const myEmail = user?.email || 'noemail@test.com'
  const myName = profile?.first_name || 'Admin'
  const [testEmail, setTestEmail] = useState(myEmail)

  // ─── Test triggers ────────────────────────────────────

  const testWelcome = () => sendTestEmail('welcome', {
    type: 'welcome',
    to: testEmail,
    toName: myName,
    data: { firstName: myName, email: testEmail }
  })

  const testOrderConfirm = () => sendTestEmail('order_confirm', {
    type: 'order_confirmation',
    to: testEmail,
    toName: myName,
    data: {
      firstName: myName,
      orderId: 'order_test_123',
      receiptNumber: 'KWM-TEST001',
      items: [
        { name: 'The Signature Tee', size: 'L', qty: 1, color: 'Midnight Black' }
      ],
      amountPaise: 99900,
      paymentId: 'pay_TEST123456',
      paymentDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      deliveryAddress: '42, Anna Salai, Chennai, Tamil Nadu - 600002'
    }
  })

  const testDispatch = () => sendTestEmail('dispatch', {
    type: 'dispatch',
    to: testEmail,
    toName: myName,
    data: {
      firstName: myName,
      orderNumber: 'ORD-TEST001',
      courierName: 'Bluedart',
      trackingNumber: 'BDT123456789IN',
      estimatedDelivery: '24 May 2025'
    }
  })

  const testReturn = () => sendTestEmail('return_req', {
    type: 'return_request',
    to: testEmail,
    toName: myName,
    data: {
      firstName: myName,
      requestId: 'REQ-TEST001',
      orderNumber: 'ORD-TEST001',
      issueDescription: 'The print has a smudge on the left sleeve near the QR area.'
    }
  })

  const testDeletion = () => sendTestEmail('deletion', {
    type: 'deletion_request',
    to: testEmail,
    toName: myName,
    data: {
      firstName: myName,
      email: testEmail,
      requestId: 'DEL-TEST001'
    }
  })

  // Check DB tables exist
  const testDbTables = async () => {
    setStatus('db', 'loading')
    const results = []
    const tables = ['payment_orders', 'orders', 'return_requests', 'deletion_requests', 'email_broadcasts']
    for (const t of tables) {
      const { error } = await supabase.from(t).select('id').limit(1)
      results.push({ table: t, ok: !error, err: error?.message })
    }
    const failed = results.filter(r => !r.ok)
    if (failed.length === 0) {
      setStatus('db', 'ok', `All ${tables.length} tables verified ✓`)
    } else {
      setStatus('db', 'error', `Missing tables: ${failed.map(f => f.table).join(', ')} — run the SQL migration.`)
    }
  }

  // Check webhook recent activity
  const checkWebhook = async () => {
    setStatus('webhook', 'loading')
    const { data, error } = await supabase
      .from('payment_orders')
      .select('id, status, paid_at, receipt_number, customer_email')
      .eq('status', 'paid')
      .order('paid_at', { ascending: false })
      .limit(3)
    if (error) {
      setStatus('webhook', 'error', error.message)
    } else if (!data || data.length === 0) {
      setStatus('webhook', 'idle', 'No paid orders yet. Make a test payment to verify webhook flow.')
    } else {
      const latest = data[0]
      setStatus('webhook', 'ok',
        `Last payment: ${latest.customer_email || 'unknown'} | Receipt: ${latest.receipt_number || 'no receipt yet'} | Paid at: ${latest.paid_at ? new Date(latest.paid_at).toLocaleString('en-IN') : 'unknown'}`
      )
    }
  }

  const razorpayWebhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/razorpay-webhook`

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="rounded-xl p-5 flex items-start gap-3"
        style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
        <AlertTriangle size={18} className="text-indigo-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-bold text-indigo-800">Test Center — Owner Only</p>
          <p className="text-xs text-indigo-500 mt-0.5 mb-2">
            Since your custom domain isn't verified in Resend yet, enter the exact email you registered Resend with below.
            No real orders or data are created.
          </p>
          <div className="flex items-center gap-2 max-w-sm">
            <input 
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Your Resend registered email"
              className="w-full px-3 py-1.5 text-xs rounded border border-indigo-200 focus:outline-none focus:border-indigo-400 bg-white"
            />
          </div>
        </div>
      </div>

      {/* ── Email Tests ───────────────────────────── */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>
          📧 Email Templates — Send to {testEmail || '...'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <TestCard
            icon={UserPlus} color="#6366F1"
            title="Welcome Email"
            desc="Sent when a new user signs up for the first time."
            btnLabel="Send Test Welcome Email"
            onRun={testWelcome}
            status={statuses.welcome || 'idle'}
            detail={details.welcome}
          />
          <TestCard
            icon={ShoppingCart} color="#059669"
            title="Order Confirmation / Receipt"
            desc="Sent immediately after a payment is captured."
            btnLabel="Send Test Receipt Email"
            onRun={testOrderConfirm}
            status={statuses.order_confirm || 'idle'}
            detail={details.order_confirm}
          />
          <TestCard
            icon={Truck} color="#2563EB"
            title="Dispatch / Shipping Email"
            desc="Sent when you mark an order as Shipped with tracking."
            btnLabel="Send Test Dispatch Email"
            onRun={testDispatch}
            status={statuses.dispatch || 'idle'}
            detail={details.dispatch}
          />
          <TestCard
            icon={RotateCcw} color="#D97706"
            title="Return Request Confirmation"
            desc="Sent to customer after they submit a return request."
            btnLabel="Send Test Return Email"
            onRun={testReturn}
            status={statuses.return_req || 'idle'}
            detail={details.return_req}
          />
          <TestCard
            icon={Trash2} color="#DC2626"
            title="Account Deletion Confirmation"
            desc="Sent when a customer requests account deletion."
            btnLabel="Send Test Deletion Email"
            onRun={testDeletion}
            status={statuses.deletion || 'idle'}
            detail={details.deletion}
          />
        </div>
      </div>

      {/* ── System Health Checks ──────────────────── */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>
          🔧 System Health Checks
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TestCard
            icon={Shield} color="#6366F1"
            title="Database Tables"
            desc="Checks that all 5 tables (payment_orders, orders, return_requests, deletion_requests, email_broadcasts) exist."
            btnLabel="Verify DB Tables"
            onRun={testDbTables}
            status={statuses.db || 'idle'}
            detail={details.db}
          />
          <TestCard
            icon={Webhook} color="#059669"
            title="Razorpay Webhook Activity"
            desc="Shows the last paid order received via webhook. Make a real/test payment to verify end-to-end."
            btnLabel="Check Last Webhook Payment"
            onRun={checkWebhook}
            status={statuses.webhook || 'idle'}
            detail={details.webhook}
          />
        </div>
      </div>

      {/* ── Razorpay ₹1 Test Guide ────────────────── */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'white', border: '1px solid var(--border2)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border2)', background: 'var(--off)' }}>
          <p className="text-sm font-black" style={{ color: 'var(--ink)' }}>₹1 Live Payment Test — Step by Step</p>
          <p className="text-xs text-neutral-400 mt-0.5">Test the full payment + webhook + email flow safely</p>
        </div>
        <div className="p-5 space-y-4">

          {[
            {
              step: '1',
              title: 'Use Razorpay Test Mode First (Free, No Real Money)',
              color: '#6366F1',
              content: (
                <div className="space-y-2 text-xs text-neutral-600 leading-relaxed">
                  <p>Go to <strong>Razorpay Dashboard → Settings → Test Mode</strong> (toggle ON)</p>
                  <p>Use this test card to simulate a payment:</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <CopyBox label="Card Number" value="4111 1111 1111 1111" />
                    <CopyBox label="Expiry" value="12/25" />
                    <CopyBox label="CVV" value="123" />
                    <CopyBox label="OTP" value="1234" />
                  </div>
                  <p className="text-neutral-400 mt-1">This triggers a real webhook to your Supabase function without charging anyone.</p>
                </div>
              )
            },
            {
              step: '2',
              title: 'Verify Webhook URL is Registered in Razorpay',
              color: '#059669',
              content: (
                <div className="space-y-2 text-xs text-neutral-600">
                  <p>Go to <strong>Razorpay Dashboard → Account &amp; Settings → Webhooks</strong></p>
                  <p>Your webhook URL should be:</p>
                  <CopyBox label="Webhook URL" value={razorpayWebhookUrl} />
                  <p>Events to enable: <strong>payment.captured</strong> and <strong>order.paid</strong></p>
                  <p>The webhook secret must match your Supabase secret <code className="bg-neutral-100 px-1 rounded">RAZORPAY_WEBHOOK_SECRET</code></p>
                </div>
              )
            },
            {
              step: '3',
              title: 'Make a ₹1 Real Payment (Optional — confirm webhook is live)',
              color: '#D97706',
              content: (
                <div className="space-y-2 text-xs text-neutral-600 leading-relaxed">
                  <p>Switch Razorpay to <strong>Live Mode</strong>. In your website, initiate a purchase.</p>
                  <p>Set the plan/item price to <strong>₹1</strong> temporarily by editing it in the Catalog Admin → price field.</p>
                  <p>Complete payment with your own UPI / card. After success:</p>
                  <ul className="space-y-1 ml-3 list-disc text-neutral-500">
                    <li>Check your inbox for the <strong>order confirmation email</strong></li>
                    <li>Go to Admin → Orders tab — the order should show as <strong>paid</strong></li>
                    <li>Click <em>"Check Last Webhook Payment"</em> above — it should show your email + receipt</li>
                    <li>Restore the price after testing</li>
                  </ul>
                  <div className="p-3 rounded-lg mt-2" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <p className="font-bold text-amber-700">Note:</p>
                    <p className="text-amber-600">Razorpay charges a 2% fee on live transactions. ₹1 will cost you ~₹0.02. You'll receive ₹0.98 net (or nothing, since minimum payout is ₹100). This is the cheapest possible confirmation that your live webhook works.</p>
                  </div>
                </div>
              )
            },
            {
              step: '4',
              title: 'After a Successful Test Payment — What to Check',
              color: '#6366F1',
              content: (
                <div className="space-y-1.5 text-xs text-neutral-600">
                  {[
                    ['📧', 'Inbox', 'You receive a KnoWMi order confirmation email with receipt number'],
                    ['📦', 'Orders Tab', 'A new order appears with status "paid"'],
                    ['🔗', 'Webhook Check', '"Check Last Webhook Payment" above shows your email + receipt number'],
                    ['🗄️', 'Supabase', 'payment_orders table has a row with paid_at, customer_email, receipt_number filled'],
                    ['📋', 'Edge Function Logs', 'Supabase → Edge Functions → razorpay-webhook → Logs shows no errors'],
                  ].map(([icon, label, desc]) => (
                    <div key={label} className="flex items-start gap-2">
                      <span>{icon}</span>
                      <div>
                        <span className="font-bold text-neutral-700">{label}:</span>{' '}
                        <span className="text-neutral-500">{desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          ].map(({ step, title, color, content }) => (
            <div key={step} className="flex gap-4">
              <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black"
                style={{ background: color }}>
                {step}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold mb-2" style={{ color: 'var(--ink)' }}>{title}</p>
                {content}
              </div>
            </div>
          ))}

          <div className="pt-2 border-t flex flex-wrap gap-3" style={{ borderColor: 'var(--border2)' }}>
            <a href="https://dashboard.razorpay.com/app/webhooks" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
              style={{ background: '#528FF0' }}>
              <ExternalLink size={12} /> Razorpay Webhooks
            </a>
            <a href={`${import.meta.env.VITE_SUPABASE_URL?.replace('.supabase.co', '.supabase.co')}/project/default/functions`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
              style={{ background: 'var(--off)', border: '1px solid var(--border)', color: 'var(--ink)' }}>
              <ExternalLink size={12} /> Supabase Edge Fn Logs
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'

const STATUS_CONFIG = {
  pending:   { step: 1, label: 'Order Received',  color: '#F97316', bg: '#FFF7ED' },
  paid:      { step: 2, label: 'In Production',   color: '#F97316', bg: '#FFF7ED' },
  shipped:   { step: 3, label: 'In Transit',      color: '#2563EB', bg: '#EFF6FF' },
  delivered: { step: 4, label: 'Delivered',       color: '#059669', bg: '#ECFDF5' },
  cancelled: { step: 0, label: 'Cancelled',       color: '#DC2626', bg: '#FEF2F2' },
}

export default function TrackOrder() {
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    // Pre-fill from URL param e.g. /track?order=ORD-1001
    const params = new URLSearchParams(window.location.search)
    const q = params.get('order') || params.get('id') || ''
    if (q) { setQuery(q); handleTrack(null, q) }
  }, [])

  const handleTrack = async (e, prefill) => {
    if (e) e.preventDefault()
    const q = (prefill || query).trim()
    if (!q) return

    setLoading(true)
    setError('')
    setOrder(null)

    // Search by order_number in the 'orders' table (used by OrdersAdmin)
    const { data, error: dbError } = await supabase
      .from('orders')
      .select('id, order_number, status, item_name, size, tracking_info, estimated_delivery, order_date, created_at, delivery_city')
      .or(`order_number.ilike.%${q}%,id.eq.${q.length > 10 ? q : '00000000-0000-0000-0000-000000000000'}`)
      .limit(1)
      .maybeSingle()

    if (dbError || !data) {
      setError("We couldn't find an order matching that number. Please check and try again, or contact us on WhatsApp.")
    } else {
      setOrder(data)
    }
    setLoading(false)
  }

  const cfg = order ? (STATUS_CONFIG[order.status] || STATUS_CONFIG.pending) : null
  const trackingParts = order?.tracking_info ? order.tracking_info.split(':') : []
  const courierName = trackingParts.length > 1 ? trackingParts[0].trim() : null
  const trackingNum = trackingParts.length > 1 ? trackingParts.slice(1).join(':').trim() : order?.tracking_info

  const STEPS = [
    { label: 'Order Placed', sub: 'Payment confirmed', icon: CheckCircle2, activeFrom: 1 },
    { label: 'In Production', sub: 'Being printed & packed', icon: Clock, activeFrom: 2 },
    { label: 'Shipped', sub: 'With courier partner', icon: Truck, activeFrom: 3 },
    { label: 'Delivered', sub: 'Arrived at your doorstep', icon: Package, activeFrom: 4 },
  ]

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />

      <main className="pt-36 pb-24 px-5 sm:px-6">
        <div className="max-w-[740px] mx-auto">

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-50 mb-5">
              <Package className="w-7 h-7 text-orange-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black mb-3 tracking-tight">Track Your Order</h1>
            <p className="text-neutral-400 text-base max-w-[420px] mx-auto leading-relaxed">
              Enter your order number (from your confirmation email) to see real-time status.
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleTrack} className="max-w-md mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="e.g. ORD-1001"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-4 pl-12 pr-32 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button type="submit" disabled={loading}
                className="absolute right-2 top-2 bottom-2 px-5 bg-black text-white rounded-xl font-bold text-sm hover:bg-neutral-800 transition-all disabled:opacity-60">
                {loading ? '...' : 'Track'}
              </button>
            </div>
          </form>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl mb-8 text-sm text-red-700">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">Order not found</p>
                <p>{error}</p>
                <a href="https://wa.me/917981325397" target="_blank" rel="noopener noreferrer"
                  className="font-bold text-orange-500 hover:underline mt-1 inline-block">
                  Contact us on WhatsApp →
                </a>
              </div>
            </div>
          )}

          {/* Order Card */}
          {order && cfg && (
            <div className="animate-reveal space-y-6">
              {/* Status header */}
              <div className="rounded-3xl p-6 border" style={{ background: cfg.bg, borderColor: cfg.color + '30' }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Current Status</p>
                    <h2 className="text-2xl font-display font-black" style={{ color: cfg.color }}>
                      {cfg.label}
                    </h2>
                    {order.item_name && (
                      <p className="text-sm text-neutral-500 mt-1">{order.item_name} {order.size ? `· Size ${order.size}` : ''}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Order No.</p>
                    <p className="font-black text-lg font-mono">{order.order_number || order.id.slice(0,8).toUpperCase()}</p>
                    {order.estimated_delivery && (
                      <p className="text-xs text-neutral-400 mt-1">Est. {order.estimated_delivery}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tracking number */}
              {order.tracking_info && order.status === 'shipped' && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Courier Tracking</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    {courierName && <span className="font-bold text-blue-700">{courierName}</span>}
                    <span className="font-black font-mono text-blue-900 text-lg">{trackingNum}</span>
                  </div>
                  <p className="text-xs text-blue-400 mt-2">Use this number on the courier's website to get live location updates.</p>
                </div>
              )}

              {/* Progress timeline */}
              <div className="rounded-3xl border border-neutral-100 bg-neutral-50 p-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-6">Order Progress</p>
                <div className="relative space-y-8">
                  <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-neutral-200" />
                  {STEPS.map((step, i) => {
                    const active = cfg.step >= step.activeFrom
                    const current = cfg.step === step.activeFrom
                    const Icon = step.icon
                    return (
                      <div key={i} className="flex items-start gap-5 relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${active ? 'shadow-lg' : ''}`}
                          style={{
                            background: active ? cfg.color : '#F1F5F9',
                            color: active ? '#fff' : '#CBD5E1',
                            boxShadow: current ? `0 4px 14px ${cfg.color}40` : undefined,
                          }}>
                          <Icon size={18} />
                        </div>
                        <div className="pt-1.5">
                          <p className={`font-bold text-sm ${active ? 'text-neutral-900' : 'text-neutral-300'}`}>{step.label}</p>
                          <p className={`text-xs mt-0.5 ${current ? 'font-bold' : ''}`}
                            style={{ color: current ? cfg.color : '#CBD5E1' }}>
                            {current ? '● ' : ''}{step.sub}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Help */}
              <div className="text-center pt-2">
                <p className="text-sm text-neutral-400">
                  Need help with this order?{' '}
                  <a href="https://wa.me/917981325397" target="_blank" rel="noopener noreferrer"
                    className="text-orange-500 font-bold hover:underline">WhatsApp us</a>
                  {' '}or{' '}
                  <a href="mailto:support.knowmi@gmail.com" className="text-orange-500 font-bold hover:underline">email us</a>
                </p>
              </div>
            </div>
          )}

          {/* Empty state features */}
          {!order && !error && !loading && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-12">
              {[
                { icon: Package, title: 'Live Status', desc: 'From printing to delivery — every step tracked.' },
                { icon: Truck, title: 'Courier Info', desc: 'See your tracking number and courier name.' },
                { icon: CheckCircle2, title: 'Delivery Estimate', desc: 'Know when to expect your KnoWMi.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100 hover:border-orange-200 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-3 shadow-sm">
                    <Icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <h4 className="font-bold mb-1 text-sm">{title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-neutral-100 text-center">
            <p className="text-sm text-neutral-400">
              Order number is in your confirmation email.
              Can't find it? <a href="mailto:support.knowmi@gmail.com" className="text-black font-bold hover:text-orange-500 transition-colors">Email us</a> with your registered email address.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

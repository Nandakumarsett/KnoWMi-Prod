import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Footer } from '../components/Footer'
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowLeft, 
  MessageSquare, 
  User, 
  ChevronDown, 
  ShieldCheck, 
  HelpCircle,
  X
} from 'lucide-react'
import { supabase, getAssetUrl } from '../lib/supabase'

const STATUS_CONFIG = {
  pending:   { step: 1, label: 'Order Received',  color: '#F97316', bg: '#FFF7ED', border: '#FDBA74' },
  paid:      { step: 2, label: 'In Production',   color: '#F97316', bg: '#FFF7ED', border: '#FDBA74' },
  shipped:   { step: 3, label: 'In Transit',      color: '#2563EB', bg: '#EFF6FF', border: '#93C5FD' },
  delivered: { step: 4, label: 'Delivered',       color: '#059669', bg: '#ECFDF5', border: '#6EE7B7' },
  cancelled: { step: 0, label: 'Cancelled',       color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5' },
}

const STEPS = [
  { label: 'Order Confirmed', sub: 'Your payment is verified and receipt issued', icon: CheckCircle2, activeFrom: 1 },
  { label: 'In Production', sub: 'Tee is being custom printed and packed', icon: Clock, activeFrom: 2 },
  { label: 'Shipped', sub: 'In transit with our shipping partner', icon: Truck, activeFrom: 3 },
  { label: 'Delivered', sub: 'Arrived and signed at your address', icon: Package, activeFrom: 4 },
]

export default function TrackOrder() {
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isUpdateExpanded, setIsUpdateExpanded] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    const params = new URLSearchParams(window.location.search)
    const q = params.get('order') || params.get('id') || ''
    if (q) { 
      setQuery(q)
      fetchOrderDetails(q)
    }
  }, [])

  const fetchOrderDetails = async (orderNum) => {
    const q = orderNum.trim()
    if (!q) return

    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const { data, error: dbError } = await supabase
        .from('orders')
        .select('*')
        .or(`order_number.eq.${q},id.eq.${q.length > 10 ? q : '00000000-0000-0000-0000-000000000000'}`)
        .limit(1)
        .maybeSingle()

      if (dbError || !data) {
        setError("We couldn't find an order matching that number. Please verify and try again.")
      } else {
        setOrder(data)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleTrack = (e) => {
    if (e) e.preventDefault()
    fetchOrderDetails(query)
  }

  const cfg = order ? (STATUS_CONFIG[order.status] || STATUS_CONFIG.pending) : null
  const trackingParts = order?.tracking_info ? order.tracking_info.split(':') : []
  const courierName = trackingParts.length > 1 ? trackingParts[0].trim() : null
  const trackingNum = trackingParts.length > 1 ? trackingParts.slice(1).join(':').trim() : order?.tracking_info

  const formattedDate = order?.order_date 
    ? new Date(order.order_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : order?.created_at
    ? new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recently'

  const formattedUpdateDate = order?.updated_at
    ? new Date(order.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : formattedDate

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans antialiased selection:bg-orange-500/20">
      <Navbar />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Back Button */}
          {order && (
            <button 
              onClick={() => {
                setOrder(null)
                setQuery('')
                const url = new URL(window.location.href);
                url.searchParams.delete('order');
                url.searchParams.delete('id');
                window.history.pushState({}, '', url);
              }}
              className="mb-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors select-none"
            >
              <ArrowLeft size={16} /> Track Another Order
            </button>
          )}

          {/* Search Form (Hero State) */}
          {!order && (
            <div className="max-w-[640px] mx-auto py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-orange-500 border-[3px] border-black text-black mb-6 shadow-[4px_4px_0px_#000]">
                <Package className="w-8 h-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-black mb-3 tracking-tighter text-white uppercase">
                Track your <span className="text-orange-500">order</span>
              </h1>
              <p className="text-neutral-400 text-sm max-w-[420px] mx-auto leading-relaxed mb-10 font-bold">
                Enter the receipt number from your confirmation email to check progress.
              </p>

              <form onSubmit={handleTrack} className="max-w-md mx-auto mb-10">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="e.g. KWM-XXXXXXXX"
                    className="w-full bg-[#1a1a1a] border-[3px] border-white rounded-xl py-4.5 pl-12 pr-32 font-bold focus:outline-none focus:border-orange-500 transition-all text-sm outline-none text-white shadow-[4px_4px_0px_#fff] focus:shadow-[4px_4px_0px_#f97316]"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="absolute right-2.5 top-2.5 bottom-2.5 px-6 bg-orange-500 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none shadow-[2px_2px_0px_#000] border-[2px] border-black text-black rounded-lg font-black text-xs uppercase tracking-widest transition-all disabled:opacity-60"
                  >
                    {loading ? '...' : 'Track'}
                  </button>
                </div>
              </form>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-500 text-black border-[3px] border-black shadow-[4px_4px_0px_#000] rounded-xl text-left text-xs max-w-md mx-auto">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black mb-1">Order not found</p>
                    <p className="mb-2 leading-relaxed font-bold">{error}</p>
                    <a 
                      href="https://wa.me/917981325397" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-black hover:underline inline-flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-lg border-[2px] border-black shadow-[2px_2px_0px_#fff]"
                    >
                      WhatsApp Help →
                    </a>
                  </div>
                </div>
              )}

              {/* Decorative Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-16 text-left">
                {[
                  { icon: CheckCircle2, title: 'Confirmed Receipt', desc: 'Secure order placement and instant payment confirmation.' },
                  { icon: Clock, title: 'In Production', desc: 'Watch your custom smart tee get printed and programmed.' },
                  { icon: Truck, title: 'Live Transit Tracking', desc: 'Courier partnership updates directly on your timeline.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="p-6 bg-[#1a1a1a] rounded-xl border-[3px] border-white shadow-[4px_4px_0px_#fff]">
                    <div className="w-10 h-10 rounded-lg bg-orange-500 border-[2px] border-black flex items-center justify-center mb-4 shadow-[2px_2px_0px_#000]">
                      <Icon className="w-5 h-5 text-black" />
                    </div>
                    <h4 className="font-black mb-1 text-sm text-white">{title}</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-bold">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Double-Column Shopify-Style Tracking Layout */}
          {order && cfg && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start animate-fade-in select-none">
              
              {/* Left Column: Timeline, Stepper, & Actions (60%) */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Header Card */}
                <div>
                  <h1 className="text-3xl font-display font-black tracking-tighter text-white uppercase mb-1.5">
                    Order {order.order_number || order.id.slice(0, 8).toUpperCase()}
                  </h1>
                  <p className="text-xs text-orange-500 font-black uppercase tracking-widest">
                    Confirmed {formattedDate}
                  </p>
                </div>

                {/* Link/Help Alert Box */}
                <div className="bg-[#1a1a1a] border-[3px] border-white rounded-xl p-6 shadow-[4px_4px_0px_#fff] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-black shrink-0 border-[2px] border-black shadow-[2px_2px_0px_#000]">
                      <HelpCircle size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-white mb-1">Need help or changes?</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed font-bold">
                        If you need to edit your delivery address, size preference, or contact details, ping our WhatsApp desk.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a 
                      href="https://wa.me/917981325397" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 sm:flex-initial px-4 py-2.5 bg-white border-[2px] border-black hover:bg-neutral-200 text-black rounded-lg font-black text-[10px] uppercase tracking-widest text-center transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                    >
                      <MessageSquare size={12} /> Contact Us
                    </a>
                    <a 
                      href="/dashboard"
                      className="flex-1 sm:flex-initial px-4 py-2.5 bg-orange-500 border-[2px] border-black hover:bg-orange-600 text-black rounded-lg font-black text-[10px] uppercase tracking-widest text-center transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                    >
                      <User size={12} /> Dashboard
                    </a>
                  </div>
                </div>

                {/* Order Update Box */}
                <div className="bg-[#1a1a1a] border-[3px] border-white rounded-xl overflow-hidden shadow-[4px_4px_0px_#fff]">
                  <button 
                    onClick={() => setIsUpdateExpanded(!isUpdateExpanded)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-black text-xs uppercase tracking-widest text-white hover:text-orange-500 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 border border-black animate-pulse shadow-[1px_1px_0px_#000]" />
                      Order status updated on {formattedUpdateDate}
                    </span>
                    <ChevronDown size={16} className={`text-white transition-transform ${isUpdateExpanded ? 'rotate-180 text-orange-500' : ''}`} />
                  </button>
                  
                  {isUpdateExpanded && (
                    <div className="px-6 pb-6 border-t-[3px] border-white/20 pt-5 text-neutral-400 text-xs leading-relaxed space-y-2.5 font-bold">
                      {order.status === 'pending' && (
                        <p>We have successfully initiated your order. Our finance gateway has validated your receipt, and your tee is scheduled to move to printing.</p>
                      )}
                      {order.status === 'paid' && (
                        <p>Your phygital KnoWMi tee is currently in custom printing. We are programming your secure smart chip and linking it to your digital identity profile.</p>
                      )}
                      {order.status === 'shipped' && (
                        <p>Your KnoWMi order has been packed and handed over to our premier shipping partner. Check the transit number below for live dispatch tracking.</p>
                      )}
                      {order.status === 'delivered' && (
                        <p>Congratulations! Your KnoWMi physical item has been signed and delivered. Scan your T-shirt QR to fully unlock your phygital experience.</p>
                      )}
                      {order.status === 'cancelled' && (
                        <p className="text-[#f87171] font-black">This order has been cancelled. If you believe this is in error, contact support immediately.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Progress Stepper Timeline */}
                <div className="bg-[#1a1a1a] border-[3px] border-white rounded-xl p-6 shadow-[4px_4px_0px_#fff]">
                  <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-6">Delivery Progress</h3>
                  
                  {order.status === 'cancelled' ? (
                    <div className="flex items-start gap-4 p-4 bg-[#f87171] border-[2px] border-black shadow-[2px_2px_0px_#000] rounded-lg text-xs text-black">
                      <X size={18} className="shrink-0" />
                      <div>
                        <p className="font-black mb-0.5">Order Cancelled</p>
                        <p className="font-bold text-neutral-900">This order has been cancelled and is no longer active.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative space-y-8 pl-1">
                      {/* Vertical line connector */}
                      <div className="absolute left-[19px] top-3 bottom-3 w-1 bg-white/20" />
                      
                      {STEPS.map((step, i) => {
                        const isActive = cfg.step >= step.activeFrom
                        const isCurrent = cfg.step === step.activeFrom
                        const Icon = step.icon
                        
                        return (
                          <div key={i} className="flex items-start gap-5 relative">
                            {/* Circle badge */}
                            <div 
                              className={`w-10 h-10 rounded-lg flex items-center justify-center z-10 border-[2px] transition-all duration-300 ${
                                isActive 
                                  ? 'bg-white border-black text-black shadow-[2px_2px_0px_#000]' 
                                  : 'bg-neutral-800 border-neutral-700 text-neutral-500'
                              }`}
                              style={{
                                borderColor: isCurrent ? '#000' : undefined,
                                backgroundColor: isCurrent ? cfg.color : undefined
                              }}
                            >
                              <Icon size={16} />
                            </div>
                            
                            {/* Step labels */}
                            <div className="pt-1 select-text">
                              <h4 className={`text-sm font-black tracking-tight ${isActive ? 'text-white' : 'text-neutral-500'}`}>
                                {step.label}
                              </h4>
                              <p className={`text-xs mt-0.5 font-bold leading-relaxed ${isCurrent ? 'text-white' : 'text-neutral-500'}`}>
                                {step.sub}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Transit Details */}
                {order.tracking_info && order.status === 'shipped' && (
                  <div className="bg-[#1a1a1a] border-[3px] border-white rounded-xl p-6 shadow-[4px_4px_0px_#fff]">
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-4">Courier Information</h3>
                    <div className="p-4 bg-black rounded-lg border-[2px] border-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Partner Courier</p>
                        <p className="font-black text-sm text-white">{courierName || 'Delhivery'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Tracking Number</p>
                        <p className="font-black text-md font-mono text-white select-text">{trackingNum}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest mt-4">
                      Copy the tracking number above to check real-time courier updates.
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Checkout Receipt & Order Summary (40%) */}
              <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-28">
                
                {/* Order Summary Card */}
                <div className="bg-[#1a1a1a] border-[3px] border-white rounded-xl p-6 lg:p-8 shadow-[4px_4px_0px_#fff]">
                  <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-6">Order Summary</h3>
                  
                  {/* Item Details */}
                  <div className="flex items-center gap-4 py-4 border-b-[3px] border-white/20">
                    <div className="relative w-20 h-25 bg-[#2a2a2a] rounded-lg border-[2px] border-black overflow-hidden shrink-0 flex items-center justify-center shadow-[2px_2px_0px_#000]">
                      <img 
                        src={getAssetUrl(order.model_image_url) || '/assets/tees/front.png'} 
                        className="w-full h-full object-cover grayscale brightness-90" 
                        alt="Tee preview" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/tees/front.png';
                        }}
                      />
                      <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-orange-500 text-black rounded-full flex items-center justify-center text-[10px] font-black border-[2px] border-black select-none">
                        1
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-sm text-white leading-snug truncate">
                        {order.item_name || 'KnoWMi Identity Tee'}
                      </h4>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
                        Size {order.size || 'M'} • Phygital Core
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-sm text-white">₹{order.amount || '999'}</span>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="py-6 border-b-[3px] border-white/20 space-y-3.5 text-xs font-bold text-neutral-400">
                    <div className="flex justify-between items-center">
                      <span>Subtotal</span>
                      <span className="font-black text-white">₹{order.amount || '999'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Taxes & Shipping</span>
                      <span className="font-black text-[#34d399]">₹0 (All Inclusive)</span>
                    </div>
                  </div>

                  {/* Total Row */}
                  <div className="pt-6 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-neutral-400">Total Paid</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-2xl text-orange-500">₹{order.amount || '999'}</span>
                      <span className="block text-[8px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">INR (Indian Rupee)</span>
                    </div>
                  </div>
                </div>

                {/* Secure Trust Badges */}
                <div className="p-6 bg-black rounded-xl border-[2px] border-white shadow-[4px_4px_0px_#fff] flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-[#34d399] shrink-0" />
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-white">QR Secure Protocol</h4>
                      <p className="text-[10px] text-neutral-400 font-bold leading-relaxed">
                        Every KnoWMi physical item is custom printed with a secure cryptographic web3 identity QR code.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}

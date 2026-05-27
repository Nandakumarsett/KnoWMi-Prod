import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { supabase, getAssetUrl } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ShoppingBag, ChevronRight, Check, X, Ruler, Lock, Shield, Truck, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import TeamCheckout from '../components/TeamCheckout'
import LiveSalesPopup from '../components/LiveSalesPopup'

const PLANS = [
  { id: 'starter', name: 'Starter', price: 799, gsm: '200 GSM' },
  { id: 'creator', name: 'Creator', price: 999, gsm: '220 GSM' },
  { id: 'team', name: 'Team', price: 699, gsm: '240 GSM' }
]

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

export default function Shop() {
  const { user } = useAuth()
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedPlan, setSelectedPlan] = useState('creator')
  const [modalOpen, setModalOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [teamCheckoutOpen, setTeamCheckoutOpen] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(null)
  const [remainingSpots, setRemainingSpots] = useState(100)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchDesigns()
    fetchRemainingSpots()
  }, [])

  const fetchRemainingSpots = async () => {
    try {
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'shipped')
      if (!error) setRemainingSpots(Math.max(0, 100 - (count || 0)))
    } catch (err) { console.error(err) }
  }

  const fetchDesigns = async () => {
    const { data } = await supabase.from('persona_designs').select('*').order('created_at', { ascending: false })
    setDesigns(data || [])
    
    // Check for deep-linked design
    const params = new URLSearchParams(window.location.search)
    const designId = params.get('design')
    if (designId && data) {
      const design = data.find(d => d.id === designId)
      if (design) setSelectedDesign(design)
    }
    
    setLoading(false)
  }

  const handleSelect = (d) => {
    setSelectedDesign(d)
    setModalOpen(true)
    const url = new URL(window.location.href);
    url.searchParams.set('design', d.id);
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const triggerCheckout = async () => {
    if (!user) {
      setAuthOpen(true)
      return
    }

    // Team plan gets a dedicated configurator modal
    if (selectedPlan === 'team') {
      setTeamCheckoutOpen(true)
      return
    }

    setCheckoutLoading(true)
    const plan = PLANS.find(p => p.id === selectedPlan)
    
    // Load Razorpay SDK
    const res = await new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

    if (!res) {
      toast.error('Razorpay SDK failed to load. Are you connected to the internet?')
      setCheckoutLoading(false)
      return
    }

    try {
      // 1. Create secure order on our backend
      const { data: orderData, error: apiError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { 
          plan_id: selectedPlan,
          user_id: user.id,
          customer_details: { design: selectedDesign.id, size: selectedSize }
        }
      })

      if (apiError || !orderData) throw new Error(apiError?.message || 'Failed to create order')

      // 2. Open Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "KnoWMi",
        description: `Purchase ${plan.name} Plan`,
        image: "https://knowmi.co/favicon.ico", // This will show the KnoWMi logo in the checkout modal
        order_id: orderData.order_id,
        handler: async function (response) {
          setOrderSuccess({ paymentId: response.razorpay_payment_id, orderId: orderData.order_id })
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: "#f97316"
        }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.on('payment.failed', function (response) {
        toast.error("Payment Failed. Reason: " + response.error.description)
      })
      paymentObject.open()
      
    } catch (error) {
      console.error(error)
      toast.error("Error initiating checkout: " + error.message)
    } finally {
      setCheckoutLoading(false)
    }
  }

  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  const SizeGuideModal = () => (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSizeGuideOpen(false)} />
      <div className="relative bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-fade-in">
        <button onClick={() => setSizeGuideOpen(false)} className="absolute top-8 right-8 text-neutral-400 hover:text-black">
          <X size={24} />
        </button>
        <h2 className="text-3xl font-display font-black text-black mb-2">Size <span className="text-orange-500 italic">Guide</span></h2>
        <p className="text-sm text-neutral-500 mb-8">Measurements in inches (standard fit).</p>
        
        <div className="overflow-hidden rounded-3xl border border-neutral-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Size</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Chest</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {[
                { s: 'S', c: '38"', l: '27"' },
                { s: 'M', c: '40"', l: '28"' },
                { s: 'L', c: '42"', l: '29"' },
                { s: 'XL', c: '44"', l: '30"' },
                { s: 'XXL', c: '46"', l: '31"' },
              ].map(row => (
                <tr key={row.s} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4 font-black text-black">{row.s}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{row.c}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{row.l}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-8 text-[10px] text-center font-bold text-neutral-400 uppercase tracking-widest">
          Tip: Measure your best-fitting tee for comparison.
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {sizeGuideOpen && <SizeGuideModal />}
      
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Header - Only show if no design selected */}
          {!selectedDesign && (
            <header className="mb-16">
              <h1 className="text-6xl font-display font-black text-black mb-4">
                Explore <span className="text-orange-500 italic">Designs</span>
              </h1>
              <p className="text-xl text-neutral-500 max-w-xl">
                Choose your digital soul. Every design is crafted to pulse with your identity.
              </p>
            </header>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !selectedDesign ? (
            /* Design Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-in">
              {designs.map((d) => (
                <div key={d.id} className="group cursor-pointer" onClick={() => handleSelect(d)}>
                  <div className="aspect-square bg-neutral-100 rounded-[40px] overflow-hidden relative mb-6 border border-neutral-100 group-hover:border-orange-500/20 transition-all premium-shimmer shadow-sm group-hover:shadow-2xl group-hover:shadow-orange-500/10">
                    <img 
                      src={getAssetUrl(d.model_image_url || d.front_image_url) || '/assets/tees/front.png'} 
                      alt={d.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-white text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-luxury flex items-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-all shadow-2xl">
                        <ShoppingBag size={14} /> Configure
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-start px-6">
                    <div>
                      <h3 className="text-xl font-display font-black text-black mb-1">{d.name}</h3>
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-luxury">Phygital Edition</p>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-black text-orange-500">₹{d.price || '999'}</p>
                       <p className="text-[8px] font-bold text-neutral-300 uppercase tracking-widest mt-1">Free Global Shipping</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : orderSuccess ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <Check size={48} />
              </div>
              <h2 className="text-4xl font-display font-black text-black mb-4">
                Hurray! Your order is placed.
              </h2>
              <p className="text-lg text-neutral-500 max-w-md mx-auto mb-8">
                We've received your payment and are preparing your KnoWMi gear. An invoice and order confirmation has been sent to your email.
              </p>
              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 mb-8 inline-block text-left min-w-[300px]">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Order Details</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold">Payment ID</span>
                  <span className="text-sm font-mono text-neutral-600">{orderSuccess.paymentId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold">Design</span>
                  <span className="text-sm text-neutral-600">{selectedDesign.name} (Size {selectedSize})</span>
                </div>
              </div>
              <div>
                <button 
                  onClick={() => {
                    setOrderSuccess(null)
                    setSelectedDesign(null)
                    const url = new URL(window.location.href);
                    url.searchParams.delete('design');
                    window.history.pushState({}, '', url);
                    window.scrollTo(0, 0)
                  }}
                  className="px-8 py-4 bg-black text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-neutral-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Single Design Customization View */
            <div className="animate-fade-in max-w-6xl mx-auto">
              <button 
                onClick={() => {
                  setSelectedDesign(null)
                  const url = new URL(window.location.href);
                  url.searchParams.delete('design');
                  window.history.pushState({}, '', url);
                  window.scrollTo(0, 0)
                }}
                className="mb-8 flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-black transition-colors"
              >
                <ChevronRight size={16} className="rotate-180" /> Back to Collection
              </button>

              <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
                {/* Left: Preview - Larger and Sleeker */}
                <div className="w-full lg:w-1/2">
                  <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-gradient-to-b from-neutral-50 to-neutral-100/50 shadow-2xl shadow-neutral-200/50">
                    {/* Add a subtle highlight border */}
                    <div className="absolute inset-0 border border-white/50 rounded-[32px] pointer-events-none z-10" />
                    <img 
                      src={getAssetUrl(selectedDesign.model_image_url || selectedDesign.front_image_url)} 
                      className="w-full h-full object-cover mix-blend-multiply"
                      alt={selectedDesign.name}
                    />
                  </div>
                </div>

                {/* Right: Customization - Luxurious Typography & Controls */}
                <div className="w-full lg:w-1/2 py-4 lg:py-10">
                  <div className="mb-10">
                    <div className="inline-block px-3 py-1 bg-orange-100 text-orange-600 font-bold text-[10px] uppercase tracking-widest rounded-full mb-4">
                      Premium Phygital Core
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-display font-black text-black mb-2 tracking-tight">{selectedDesign.name}</h2>
                    <p className="text-sm text-neutral-500 leading-relaxed max-w-md">
                      A next-generation digital smart tee. This physical garment serves as a secure gateway to your dynamic digital identity.
                    </p>
                  </div>

                  {/* Size Selection */}
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold text-black uppercase tracking-wider">Select Size</p>
                      <button 
                        onClick={() => setSizeGuideOpen(true)}
                        className="text-xs font-bold text-neutral-400 flex items-center gap-1.5 hover:text-orange-500 transition-colors"
                      >
                        <Ruler size={14} /> Size Guide
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {SIZES.map(s => (
                        <button 
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`w-14 h-14 rounded-2xl font-black transition-all text-sm border-2 ${
                            selectedSize === s 
                              ? 'border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                              : 'border-neutral-100 bg-white text-neutral-500 hover:border-neutral-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Plan Selection */}
                  <div className="mb-10">
                    <p className="text-xs font-bold text-black uppercase tracking-wider mb-4">Identity Protocol</p>
                    <div className="grid grid-cols-1 gap-4">
                      {PLANS.map(p => (
                        <button 
                          key={p.id}
                          onClick={() => setSelectedPlan(p.id)}
                          className={`w-full p-5 rounded-2xl border-2 transition-all text-left flex items-center justify-between group ${
                            selectedPlan === p.id 
                              ? 'border-black bg-[#111111] text-white shadow-2xl shadow-black/10' 
                              : 'border-neutral-200 bg-white hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              selectedPlan === p.id 
                                ? 'border-orange-500 bg-orange-500' 
                                : 'border-neutral-300 group-hover:border-neutral-400'
                            }`}>
                              {selectedPlan === p.id && <Check size={12} className="text-white" />}
                            </div>
                            <div>
                              <p className={`font-black text-lg leading-tight ${selectedPlan === p.id ? 'text-white' : 'text-black'}`}>{p.name}</p>
                              <p className={`text-[10px] uppercase tracking-widest font-bold mt-1 ${selectedPlan === p.id ? 'text-neutral-400' : 'text-neutral-500'}`}>{p.gsm}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-black ${selectedPlan === p.id ? 'text-white' : 'text-black'}`}>₹{p.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Checkout */}
                  <div className="pt-2">
                    <div className="mb-6 bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200 rounded-2xl p-4 flex flex-col items-center justify-center">
                      <span className="text-orange-600 font-black text-sm flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                        </span>
                        Only {remainingSpots} Founding Spots Left!
                      </span>
                    </div>
                    <button 
                      onClick={triggerCheckout}
                      disabled={checkoutLoading}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {checkoutLoading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Lock size={20} />
                      )}
                      {checkoutLoading
                        ? 'Initiating Secure Checkout...'
                        : selectedPlan === 'team'
                        ? 'Configure Team Order →'
                        : 'Secure Checkout'
                      }
                    </button>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
                      <div className="flex items-center gap-2">
                        <Shield size={18} className="text-green-600" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-600">100% Secure via Razorpay</span>
                      </div>
                      <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-neutral-200" />
                      <div className="flex items-center gap-2">
                        <Truck size={18} className="text-blue-600" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-600">Free Priority Shipping</span>
                      </div>
                    </div>
                    <div className="mt-6 text-center border-t border-neutral-100 pt-6">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">7-Day Free Replacement Policy • 256-bit SSL Encrypted</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <AuthModal 
        open={authOpen} 
        onClose={() => setAuthOpen(false)} 
        onSuccess={() => {
          setAuthOpen(false);
          triggerCheckout();
        }}
      />
      {teamCheckoutOpen && (
        <TeamCheckout
          onClose={() => setTeamCheckoutOpen(false)}
          user={user}
          onAuth={() => { setTeamCheckoutOpen(false); setAuthOpen(true) }}
          selectedDesign={selectedDesign}
        />
      )}
      <LiveSalesPopup />
    </div>
  )
}

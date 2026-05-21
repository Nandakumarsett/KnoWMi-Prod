import React, { useState, useEffect } from 'react'
import { supabase, getAssetUrl } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ShoppingBag, ChevronRight, Check, X, Ruler } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import TeamCheckout from '../components/TeamCheckout'

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

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchDesigns()
  }, [])

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
      alert('Razorpay SDK failed to load. Are you connected to the internet?')
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
        alert("Payment Failed. Reason: " + response.error.description)
      })
      paymentObject.open()
      
    } catch (error) {
      console.error(error)
      alert("Error initiating checkout: " + error.message)
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
            <div className="animate-fade-in">
              <button 
                onClick={() => {
                  setSelectedDesign(null)
                  window.scrollTo(0, 0)
                }}
                className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors"
              >
                <ChevronRight size={14} className="rotate-180" /> Back to all designs
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-[450px_450px] gap-16 items-start justify-center">
                {/* Left: Preview - Smaller & Fixed-ish */}
                <div className="bg-neutral-50 rounded-[40px] overflow-hidden border border-neutral-100 shadow-xl max-h-[500px]">
                  <img 
                    src={getAssetUrl(selectedDesign.model_image_url || selectedDesign.front_image_url)} 
                    className="w-full h-full object-cover"
                    alt="Selected Design"
                  />
                </div>

                {/* Right: Customization - More Compact & Constrained */}
                <div className="py-0 max-w-[450px]">
                  <div className="mb-4">
                    <h2 className="text-3xl font-display font-black text-black mb-1 leading-tight tracking-tight-premium">{selectedDesign.name}</h2>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Premium Phygital Core</p>
                  </div>

                  {/* Size Selection */}
                  <div className="mb-12">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-black uppercase tracking-luxury text-neutral-400">1. Choose Architecture</p>
                      <button 
                        onClick={() => setSizeGuideOpen(true)}
                        className="text-[9px] font-bold text-orange-500 flex items-center gap-1 uppercase tracking-widest hover:underline"
                      >
                        <Ruler size={10} /> Size Guide
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map(s => (
                        <button 
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`w-11 h-11 rounded-xl font-black transition-all text-xs ${selectedSize === s ? 'bg-black text-white shadow-xl shadow-black/20' : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Plan Selection */}
                  <div className="mb-6">
                    <p className="text-[10px] font-black uppercase tracking-luxury text-neutral-400 mb-4">2. Identity Protocol Layer</p>
                    <div className="grid grid-cols-1 gap-3">
                      {PLANS.map(p => (
                        <button 
                          key={p.id}
                          onClick={() => setSelectedPlan(p.id)}
                          className={`w-full p-3 rounded-xl border-2 transition-all text-left flex items-center justify-between group ${selectedPlan === p.id ? 'border-orange-500 bg-orange-500/[0.03]' : 'border-neutral-100 hover:border-neutral-200 bg-white'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${selectedPlan === p.id ? 'border-orange-500 bg-orange-500' : 'border-neutral-200'}`}>
                              {selectedPlan === p.id && <Check size={10} className="text-white" />}
                            </div>
                            <div>
                              <p className="font-black text-black text-sm leading-tight">{p.name}</p>
                              <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-black mt-0.5">{p.gsm}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-xl font-black transition-colors ${selectedPlan === p.id ? 'text-orange-500' : 'text-black'}`}>₹{p.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Checkout */}
                  <div className="pt-0">
                    <button 
                      onClick={triggerCheckout}
                      disabled={checkoutLoading}
                      className="w-full bg-black text-white py-4 rounded-xl font-black text-base hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {checkoutLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ShoppingBag size={18} />
                      )}
                      {checkoutLoading
                        ? 'Initiating Secure Checkout...'
                        : selectedPlan === 'team'
                        ? 'Configure Team Order →'
                        : 'Secure Checkout'
                      }
                    </button>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-10">
                      <div className="flex items-center gap-3">
                        <Check size={20} className="text-emerald-500" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-neutral-600">Instant Activation</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Check size={20} className="text-emerald-500" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-neutral-600">Free Shipping</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Check size={20} className="text-emerald-500" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-neutral-600">Secure Process</span>
                      </div>
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
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import LazyImage from './ui/LazyImage'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

function ProductCard({ design, onClick }) {
  const imageUrl = design.model_image_url || design.front_image_url || design.back_image_url || '/assets/tees/front.png'
  
  return (
    <button onClick={onClick}
      className="group relative rounded-2xl overflow-hidden transition-all duration-300 ring-1 ring-white/10 hover:ring-[#FF9933]/50 hover:scale-[1.02] flex flex-col bg-[#1a1a1a]"
      style={{ aspectRatio: '4/5' }}>
      
      <div className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-110">
        <LazyImage src={imageUrl} alt={design.name} className="w-full h-full object-cover" skeletonClassName="absolute inset-0" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-[#0f0f11]/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
      <div className="absolute bottom-6 left-0 right-0 text-center z-10 px-4">
        <h3 className="text-2xl font-display font-bold tracking-wider uppercase text-white mb-2">{design.name}</h3>
        <span className="text-sm text-[#FF9933] font-bold">₹{design.price} →</span>
      </div>
    </button>
  )
}

export default function PersonaStore({ onClose, onAuth, user }) {
  const [designs, setDesigns] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [loading, setLoading] = useState(true)

  // Order State
  const [size, setSize] = useState('M')
  const [qrPlacement, setQrPlacement] = useState('back')
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState('model') // model, front, back
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    fetchData()
    return () => { document.body.style.overflow = '' }
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('persona_designs').select('*').order('created_at', { ascending: false })
    if (data) {
      setDesigns(data)
      // Extract unique categories
      const cats = [...new Set(data.map(d => d.category))]
      setCategories(cats)
    }
    setLoading(false)
  }

  const handleOrder = async () => {
    if (!user) {
      onAuth()
      return
    }

    setCheckoutLoading(true)

    // Dynamically load Razorpay SDK
    const sdkLoaded = await new Promise((resolve) => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

    if (!sdkLoaded) {
      alert('Razorpay SDK failed to load. Please check your connection.')
      setCheckoutLoading(false)
      return
    }

    try {
      // Map design price to paise (multiply by qty)
      const amountPaise = selectedDesign.price * qty * 100

      // Create secure order via backend Edge Function
      const { data: orderData, error: apiError } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          plan_id: selectedDesign.id, // Edge function will need to handle dynamic product IDs
          amount_override: amountPaise, // Pass actual amount for store items
          user_id: user.id,
          customer_details: {
            design: selectedDesign.id,
            design_name: selectedDesign.name,
            category: selectedDesign.category,
            size,
            qr_placement: qrPlacement,
            quantity: qty
          }
        }
      })

      if (apiError || !orderData) throw new Error(apiError?.message || 'Failed to create order')

      // Open Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: 'KnoWMi',
        description: `${selectedDesign.name} — ${selectedDesign.category} Collection`,
        image: 'https://knowmi.co/favicon.ico',
        order_id: orderData.order_id,
        handler: function (response) {
          alert(`Payment successful! Your ${selectedDesign.name} tee is on its way. 🎉 (ID: ${response.razorpay_payment_id})`)
          onClose()
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: '#f97316'
        }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.on('payment.failed', function (response) {
        alert('Payment Failed. Reason: ' + response.error.description)
      })
      paymentObject.open()

    } catch (error) {
      alert('Error initiating checkout: ' + error.message)
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f0f11] text-white">
        <div className="text-xl font-display animate-pulse text-[#FF9933]">Loading Store...</div>
      </div>
    )
  }

  // If no designs exist yet
  if (designs.length === 0) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0f0f11] text-white p-6">
        <h2 className="text-3xl font-display font-bold mb-4">Coming Soon</h2>
        <p className="text-gray-400 mb-8 max-w-md text-center">We are currently updating our hyper-realistic persona collections. Please check back later!</p>
        <button onClick={onClose} className="px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">Return to Home</button>
      </div>
    )
  }

  const filteredDesigns = selectedCategory ? designs.filter(d => d.category === selectedCategory) : []

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0f0f11] text-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0f0f11]/90 backdrop-blur-md border-b border-white/10">
        <div>
          <h2 className="font-display text-xl font-bold text-white">Persona Store</h2>
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            {selectedCategory ? `${selectedCategory} Collection` : 'Select a Category'}
          </p>
        </div>
        <div className="flex gap-4">
          {selectedCategory && (
            <button onClick={() => { setSelectedCategory(null); setSelectedDesign(null) }} className="px-4 py-2 text-sm font-bold bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
              ← Back
            </button>
          )}
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            ✕
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 w-full">
        
        {/* VIEW 1: Categories */}
        {!selectedCategory && (
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-center mb-12">Choose Your Persona</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {categories.map(c => {
                const catDesigns = designs.filter(d => d.category === c)
                const featured = catDesigns[0]
                const bgImg = featured?.model_image_url || featured?.front_image_url || '/assets/tees/front.png'
                
                return (
                  <button key={c} onClick={() => setSelectedCategory(c)}
                    className="group relative rounded-3xl overflow-hidden transition-all duration-300 ring-1 ring-white/10 hover:ring-[#FF9933]/50 hover:scale-[1.02] bg-[#1a1a1a]"
                    style={{ aspectRatio: '1/1' }}>
                    
                    <div className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2">
                      <LazyImage src={bgImg} alt={c} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" skeletonClassName="absolute inset-0" />
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-[#0f0f11]/60 to-transparent" />
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <h3 className="text-3xl md:text-4xl font-display font-bold tracking-widest uppercase text-white mb-2 shadow-black drop-shadow-lg">{c}</h3>
                      <span className="text-sm text-[#FF9933] font-bold tracking-widest uppercase bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                        {catDesigns.length} Designs
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: Designs for selected category */}
        {selectedCategory && !selectedDesign && (
          <div className="animate-fade-in">
            <h3 className="text-3xl md:text-5xl font-display font-bold text-center mb-8 text-white uppercase tracking-wider">{selectedCategory}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredDesigns.map(d => (
                <ProductCard key={d.id} design={d} onClick={() => { setSelectedDesign(d); setActiveImage(d.model_image_url ? 'model' : 'front') }} />
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: Order Console */}
        {selectedCategory && selectedDesign && (
          <div className="max-w-5xl mx-auto animate-fade-in mt-4">
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-10 backdrop-blur-md">
              
              <div className="flex flex-col lg:flex-row gap-10 mb-10">
                
                {/* Product Images Gallery */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                  {/* Main Display */}
                  <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0f0f11] flex items-center justify-center relative" style={{ aspectRatio: '4/5', position: 'relative' }}>
                    {activeImage === 'model' && selectedDesign.model_image_url && (
                      <LazyImage key={`model-${selectedDesign.id}`} src={selectedDesign.model_image_url} alt={selectedDesign.name} className="w-full h-full object-cover" eager skeletonClassName="absolute inset-0" />
                    )}
                    {activeImage === 'front' && selectedDesign.front_image_url && (
                      <LazyImage key={`front-${selectedDesign.id}`} src={selectedDesign.front_image_url} alt={selectedDesign.name} className="w-full h-full object-cover" eager skeletonClassName="absolute inset-0" />
                    )}
                    {activeImage === 'back' && selectedDesign.back_image_url && (
                      <LazyImage key={`back-${selectedDesign.id}`} src={selectedDesign.back_image_url} alt={selectedDesign.name} className="w-full h-full object-cover" eager skeletonClassName="absolute inset-0" />
                    )}
                    {(!selectedDesign[`${activeImage}_image_url`]) && (
                      <div className="text-[var(--muted)] text-sm">Image not available</div>
                    )}
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-4">
                    {selectedDesign.model_image_url && (
                      <button onClick={() => setActiveImage('model')} className={`flex-1 rounded-xl overflow-hidden border-2 transition-all ${activeImage === 'model' ? 'border-[#FF9933]' : 'border-white/10 opacity-50 hover:opacity-100'}`} style={{ aspectRatio: '1/1', position: 'relative' }}>
                        <LazyImage src={selectedDesign.model_image_url} alt="Model" className="w-full h-full object-cover" skeletonClassName="absolute inset-0" />
                      </button>
                    )}
                    {selectedDesign.front_image_url && (
                      <button onClick={() => setActiveImage('front')} className={`flex-1 rounded-xl overflow-hidden border-2 transition-all ${activeImage === 'front' ? 'border-[#FF9933]' : 'border-white/10 opacity-50 hover:opacity-100'}`} style={{ aspectRatio: '1/1', position: 'relative' }}>
                        <LazyImage src={selectedDesign.front_image_url} alt="Front" className="w-full h-full object-cover" skeletonClassName="absolute inset-0" />
                      </button>
                    )}
                    {selectedDesign.back_image_url && (
                      <button onClick={() => setActiveImage('back')} className={`flex-1 rounded-xl overflow-hidden border-2 transition-all ${activeImage === 'back' ? 'border-[#FF9933]' : 'border-white/10 opacity-50 hover:opacity-100'}`} style={{ aspectRatio: '1/1', position: 'relative' }}>
                        <LazyImage src={selectedDesign.back_image_url} alt="Back" className="w-full h-full object-cover" skeletonClassName="absolute inset-0" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Product Details & Selection */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#FF9933]/10 text-[#FF9933] border border-[#FF9933]/20 text-xs font-bold tracking-widest uppercase mb-4 w-fit">
                    {selectedDesign.category} Collection
                  </span>
                  
                  <h3 className="text-4xl md:text-5xl font-display font-bold mb-4 leading-tight">{selectedDesign.name}</h3>
                  <div className="text-3xl text-white font-mono font-bold mb-8">₹{selectedDesign.price}</div>
                  
                  <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                    Premium heavy-weight bio-washed cotton. High-definition vibrant print. Features interactive QR integration.
                  </p>
                  
                  <div className="space-y-8">
                    {/* Size */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Select Size</p>
                        <button className="text-xs text-[#38bdf8] hover:underline">Size Guide</button>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {SIZES.map(s => (
                          <button key={s} onClick={() => setSize(s)}
                            className={`w-12 h-12 rounded-xl font-bold text-sm transition-all ${size === s ? 'bg-[#FF9933] text-white shadow-[0_0_20px_rgba(255,153,51,0.3)] scale-110' : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* QR Placement */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">QR Code Placement</p>
                      <div className="flex gap-4">
                        <button onClick={() => setQrPlacement('front')}
                          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border ${qrPlacement === 'front' ? 'bg-white/10 border-white/30 text-white' : 'bg-transparent border-white/10 text-gray-400 hover:bg-white/5'}`}>
                          Front Print
                        </button>
                        <button onClick={() => setQrPlacement('back')}
                          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border ${qrPlacement === 'back' ? 'bg-white/10 border-white/30 text-white' : 'bg-transparent border-white/10 text-gray-400 hover:bg-white/5'}`}>
                          Back Print
                        </button>
                      </div>
                    </div>

                    {/* Pricing Breakdown Card */}
                    <div className="mt-6 bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3.5 text-xs text-gray-300 font-medium">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Pricing Breakdown</p>
                      <div className="flex justify-between items-center">
                        <span>Base T-Shirt Price ({qty}x)</span>
                        <span className="line-through text-gray-400 font-bold">₹{((selectedDesign.price + 500) * qty).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center text-[#FF9933] font-bold">
                        <span>Limited Edition Launch Discount</span>
                        <span>-₹{(500 * qty).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Priority Shipping & Smart Setup</span>
                        <span className="text-[#1dce96] font-bold">₹0 (FREE)</span>
                      </div>
                      <div className="border-t border-white/10 pt-3.5 flex justify-between items-center text-sm">
                        <span className="font-bold text-white">Total Amount</span>
                        <span className="font-black text-xl text-white">₹{(selectedDesign.price * qty).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Qty & Add to Cart */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 pt-6 mt-6 border-t border-white/10">
                      <div className="flex items-center rounded-xl bg-white/5 border border-white/10 h-14 w-full sm:w-auto">
                        <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-14 h-full text-xl hover:bg-white/10 rounded-l-xl transition-colors">−</button>
                        <span className="w-12 text-center font-bold font-mono text-lg">{qty}</span>
                        <button onClick={() => setQty(q => Math.min(50, q + 1))} className="w-14 h-full text-xl hover:bg-white/10 rounded-r-xl transition-colors">+</button>
                      </div>
                      
                      <button
                        onClick={handleOrder}
                        disabled={checkoutLoading}
                        className="flex-1 w-full h-14 rounded-xl font-bold text-white text-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 8px 24px rgba(249,115,22,0.3)' }}
                      >
                        {checkoutLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        )}
                        {checkoutLoading ? 'Securing Checkout...' : `Pay ₹${(selectedDesign.price * qty).toLocaleString('en-IN')} Securely`}
                      </button>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
        
      </div>
    </div>
  )
}

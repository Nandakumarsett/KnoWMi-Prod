import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { supabase, getAssetUrl } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ShoppingBag, ChevronRight, Check, X, Ruler, Lock, Shield, Truck, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import LiveSalesPopup from '../components/LiveSalesPopup'

const PRODUCTS = [
  { id: 'regular', name: 'Regular Tee', price: 799, gsm: '200 GSM', disabled: false },
  { id: 'oversized', name: 'Oversized Tee', price: 999, gsm: '220 GSM', disabled: false },
  { id: 'hoodie', name: 'Hoodie (Soon)', price: 1499, gsm: '300 GSM', disabled: true }
]

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

export default function Shop() {
  const { user } = useAuth()
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedProductType, setSelectedProductType] = useState('oversized')
  const [modalOpen, setModalOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
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

    setCheckoutLoading(true)
    const product = PRODUCTS.find(p => p.id === selectedProductType)
    
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
          product_type: selectedProductType,
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
        description: `Purchase ${product.name}`,
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
  const [activeAccordion, setActiveAccordion] = useState(null)
  const toggleAccordion = (name) => {
    setActiveAccordion(activeAccordion === name ? null : name)
  }

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
            <header className="mb-12 border-b border-neutral-100 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-black text-black uppercase tracking-wide">
                  Explore <span className="text-orange-500 italic">Designs</span>
                </h1>
                <p className="text-sm text-neutral-400 mt-2 tracking-wider uppercase font-bold text-[10px]">
                  Premium Heavyweight Phygital Streetwear Series
                </p>
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] bg-black text-white px-4 py-2">
                {designs.length} Limited Editions
              </div>
            </header>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !selectedDesign ? (
            /* Design Grid - Restyled to match Offcult look */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 animate-fade-in">
              {designs.map((d) => (
                <div 
                  key={d.id} 
                  className="group cursor-pointer flex flex-col"
                  onClick={() => handleSelect(d)}
                >
                  <div className="aspect-[3/4] w-full bg-neutral-50 overflow-hidden relative mb-4 border border-neutral-100/50 group-hover:border-neutral-300 transition-colors">
                    <img 
                      src={getAssetUrl(d.model_image_url || d.front_image_url) || '/assets/tees/front.png'} 
                      alt={d.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    
                    {/* Wishlist Button Overlay */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success(`Saved to wishlist: ${d.name}`);
                      }}
                      className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black text-white flex items-center justify-center transition-colors shadow-sm"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={2.5} 
                        stroke="currentColor" 
                        className="w-4 h-4"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
                        />
                      </svg>
                    </button>

                    {/* Oversized absolute bottom-center tag */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] select-none">
                      Oversized
                    </div>
                  </div>
                  
                  <div className="px-1">
                    <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wider truncate mb-1">
                      {d.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-neutral-900">₹599</span>
                      <span className="text-[10px] text-neutral-400 line-through">
                        {d.price ? `₹${d.price}` : '₹1999'}
                      </span>
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
            /* Single Design Customization View - Revamped to Offcult checkout style */
            <div className="animate-fade-in max-w-6xl mx-auto">
              <button 
                onClick={() => {
                  setSelectedDesign(null)
                  const url = new URL(window.location.href);
                  url.searchParams.delete('design');
                  window.history.pushState({}, '', url);
                  window.scrollTo(0, 0)
                }}
                className="mb-10 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors"
              >
                <ChevronRight size={14} className="rotate-180 text-black" /> Back to Designs
              </button>

              <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
                {/* Left Column: Stack of high-quality product images */}
                <div className="w-full lg:w-3/5 flex flex-col gap-6">
                  {[
                    selectedDesign.model_image_url,
                    selectedDesign.front_image_url,
                    selectedDesign.back_image_url
                  ]
                    .filter(Boolean)
                    .map((imgUrl, index) => (
                      <div 
                        key={index} 
                        className="w-full aspect-[3/4] bg-neutral-50 overflow-hidden relative border border-neutral-100"
                      >
                        <img 
                          src={getAssetUrl(imgUrl)} 
                          className="w-full h-full object-cover" 
                          alt={`${selectedDesign.name} view ${index + 1}`}
                        />
                        {index === 0 && selectedDesign.model_image_url && (
                          <span className="absolute bottom-4 left-4 bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1">
                            Model Look
                          </span>
                        )}
                        {((index === 1 && selectedDesign.model_image_url) || (index === 0 && !selectedDesign.model_image_url)) && (
                          <span className="absolute bottom-4 left-4 bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1">
                            Front View
                          </span>
                        )}
                        {((index === 2 && selectedDesign.model_image_url) || (index === 1 && !selectedDesign.model_image_url)) && (
                          <span className="absolute bottom-4 left-4 bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1">
                            Back View
                          </span>
                        )}
                      </div>
                    ))
                  }
                </div>

                {/* Right Column: Sticky checkout and configuration specs */}
                <div className="w-full lg:w-2/5 lg:sticky lg:top-28 py-2">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-sm">
                        Oversized Fit
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-orange-50 text-orange-600 px-2.5 py-1 rounded-sm">
                        Phygital Edition
                      </span>
                    </div>
                    <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-wide mb-3 leading-tight font-display">
                      {selectedDesign.name}
                    </h1>
                    <p className="text-xs text-neutral-400 tracking-widest font-bold uppercase text-[9px] mb-4">
                      STREETWEAR SERIES CO-CREATION
                    </p>
                    
                    {/* Price display based on Selected Product */}
                    <div className="flex items-baseline gap-3 mb-6 border-b border-neutral-100 pb-5">
                      <span className="text-3xl font-black text-neutral-900">
                        ₹{PRODUCTS.find(p => p.id === selectedProductType)?.price || 999}
                      </span>
                      <span className="text-base text-neutral-400 line-through">
                        {selectedProductType === 'regular' ? '₹1499' : selectedProductType === 'oversized' ? '₹1999' : '₹2999'}
                      </span>
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2.5 py-1">
                        Save {selectedProductType === 'regular' ? '47%' : selectedProductType === 'oversized' ? '50%' : '50%'}
                      </span>
                    </div>
                  </div>

                  {/* Product/Fabric Selector (Horizontal minimalistic pills) */}
                  <div className="mb-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 block mb-3">
                      Select Product Type
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {PRODUCTS.map(p => (
                        <button 
                          key={p.id}
                          onClick={() => {
                            if (!p.disabled) setSelectedProductType(p.id)
                          }}
                          disabled={p.disabled}
                          className={`flex flex-col items-center justify-center p-3.5 border transition-all text-center ${
                            p.disabled ? 'opacity-50 cursor-not-allowed bg-neutral-50 border-neutral-100' :
                            selectedProductType === p.id 
                              ? 'border-black bg-black text-white' 
                              : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
                          }`}
                        >
                          <span className="text-[11px] font-black uppercase tracking-wider">{p.name}</span>
                          <span className="text-[8px] uppercase font-bold tracking-widest mt-1 opacity-70">{p.gsm}</span>
                          <span className="text-xs font-black mt-2">₹{p.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                        Select Size: <span className="text-black font-black">{selectedSize}</span>
                      </label>
                      <button 
                        onClick={() => setSizeGuideOpen(!sizeGuideOpen)}
                        className="text-[9px] font-black text-neutral-800 uppercase tracking-widest flex items-center gap-1 hover:text-black border-b border-black"
                      >
                        Size Chart
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {SIZES.map(s => (
                        <button 
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`w-11 h-11 text-xs font-black uppercase transition-all border ${
                            selectedSize === s 
                              ? 'border-black bg-black text-white' 
                              : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    {/* Inline Size measurements expandable table */}
                    {sizeGuideOpen && (
                      <div className="mt-4 overflow-hidden border border-neutral-200 bg-white animate-fade-in">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-neutral-50 border-b border-neutral-200 font-bold uppercase tracking-wider text-neutral-500">
                              <th className="px-4 py-2 text-[9px]">Size</th>
                              <th className="px-4 py-2 text-[9px]">Chest (in)</th>
                              <th className="px-4 py-2 text-[9px]">Length (in)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100 text-neutral-700">
                            {[
                              { s: 'S', c: '38"', l: '27"' },
                              { s: 'M', c: '40"', l: '28"' },
                              { s: 'L', c: '42"', l: '29"' },
                              { s: 'XL', c: '44"', l: '30"' },
                              { s: 'XXL', c: '46"', l: '31"' },
                            ].map(row => (
                              <tr key={row.s} className="hover:bg-neutral-50/30">
                                <td className="px-4 py-2 font-black text-black">{row.s}</td>
                                <td className="px-4 py-2">{row.c}</td>
                                <td className="px-4 py-2">{row.l}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Specifications Summary */}
                  <div className="border-t border-b border-neutral-100 py-4 mb-6 grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                    <div>
                      <span className="text-neutral-400 font-bold uppercase tracking-wider block text-[8px]">Fabric grade</span>
                      <span className="text-neutral-800 font-black uppercase text-[10px]">100% Premium Cotton</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 font-bold uppercase tracking-wider block text-[8px]">Weight/thickness</span>
                      <span className="text-neutral-800 font-black uppercase text-[10px]">{PRODUCTS.find(p => p.id === selectedProductType)?.gsm || '220 GSM'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 font-bold uppercase tracking-wider block text-[8px]">Garment fit</span>
                      <span className="text-neutral-800 font-black uppercase text-[10px]">{selectedProductType === 'regular' ? 'Regular Fit' : selectedProductType === 'hoodie' ? 'Relaxed Fit' : 'Oversized / Boxy Fit'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 font-bold uppercase tracking-wider block text-[8px]">Print style</span>
                      <span className="text-neutral-800 font-black uppercase text-[10px]">Premium HD PUFF PRINT</span>
                    </div>
                  </div>

                  {/* E-Commerce Receipt & Finance details */}
                  <div className="mb-6 bg-neutral-50 p-4 border border-neutral-100 space-y-2.5 text-xs text-neutral-600 font-medium">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Receipt Details</p>
                    <div className="flex justify-between items-center">
                      <span>{PRODUCTS.find(p => p.id === selectedProductType)?.name}</span>
                      <span className="line-through text-neutral-400 font-bold">₹{selectedProductType === 'regular' ? '1499' : selectedProductType === 'oversized' ? '1999' : '2999'}</span>
                    </div>
                    <div className="flex justify-between items-center text-red-600 font-bold">
                      <span>Founding Member Special Promo</span>
                      <span>-₹{selectedProductType === 'regular' ? '700' : selectedProductType === 'oversized' ? '1000' : '1500'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Priority Shipping & Customization</span>
                      <span className="text-green-600 font-bold">FREE (₹0)</span>
                    </div>
                    <div className="border-t border-neutral-200 pt-2.5 flex justify-between items-center text-sm font-black text-black">
                      <span>Total Amount (all inclusive)</span>
                      <span className="text-lg">₹{PRODUCTS.find(p => p.id === selectedProductType)?.price || 999}</span>
                    </div>
                  </div>

                  {/* Sticky Checkout Action button */}
                  <div className="pt-2">
                    <div className="mb-4 bg-black text-white p-3.5 text-center flex flex-col items-center justify-center relative overflow-hidden">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        Strictly Limited Founding Spots
                      </span>
                      <span className="text-[9px] uppercase tracking-widest mt-1 text-neutral-400 font-bold">
                        Only {remainingSpots} remaining spots active
                      </span>
                    </div>

                    <button 
                      onClick={triggerCheckout}
                      disabled={checkoutLoading}
                      className="w-full bg-black text-white py-4.5 font-black uppercase tracking-[0.2em] text-sm hover:bg-neutral-900 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {checkoutLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Lock size={15} />
                      )}
                      {checkoutLoading
                        ? 'Initiating secure transaction...'
                        : 'Secure Checkout via Razorpay'
                      }
                    </button>
                    
                    <div className="flex flex-col gap-2 mt-4 text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Truck size={14} className="text-black" />
                        <span>Dispatched in 24-48 Hours • Free Delivery Across India</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield size={14} className="text-black" />
                        <span>256-Bit SSL Encrypted secure transactions</span>
                      </div>
                    </div>
                  </div>

                  {/* Modern Streetwear Collapsible Accordions */}
                  <div className="mt-8 border-t border-neutral-100 divide-y divide-neutral-100">
                    {[
                      {
                        id: 'fabric',
                        title: 'Fabric Premium Details',
                        content: 'Crafted with 100% long-staple premium combed cotton. Featuring a boxy oversized drape, 200-240 GSM ultra-heavyweight knit, double-needle stitched neckband, and pre-shrunk construction for perfect longevity. Screened with high-definition puff and premium reactive inks.'
                      },
                      {
                        id: 'shipping',
                        title: 'Delivery Timelines',
                        content: 'Standard shipping is completely free for all prepaid orders. Shipments are dispatched from our warehouse within 24-48 hours. Transit time ranges from 3-5 business days depending on your pin code.'
                      },
                      {
                        id: 'returns',
                        title: 'Return & Exchange Policy',
                        content: 'We offer a 7-Day Free Replacement Policy specifically for products received with manufacturing defects, printing issues (e.g. design fade), or transit damages. Since each product is linked to a secure digital identity, standard size exchanges or change-of-mind replacements are subject to a minor shipping fee. Please check our size chart before ordering.'
                      },
                      {
                        id: 'payments',
                        title: 'Secure Payment Options',
                        content: 'Securely pay with any UPI application (Google Pay, PhonePe, Paytm), Credit or Debit Cards (Visa, Mastercard, RuPay), Net Banking across major banks, or secure Wallets via our trusted partner Razorpay.'
                      }
                    ].map(item => (
                      <div key={item.id} className="py-4">
                        <button 
                          onClick={() => toggleAccordion(item.id)}
                          className="w-full flex items-center justify-between text-left text-xs font-black uppercase tracking-wider text-black py-1"
                        >
                          <span>{item.title}</span>
                          <ChevronRight 
                            size={14} 
                            className={`text-black transition-transform duration-300 ${activeAccordion === item.id ? 'rotate-90' : ''}`} 
                          />
                        </button>
                        <div className={`transition-all duration-300 overflow-hidden ${
                          activeAccordion === item.id ? 'max-h-40 mt-3' : 'max-h-0'
                        }`}>
                          <p className="text-xs text-neutral-500 leading-relaxed font-normal normal-case">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    ))}
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
      {/* Team Checkout removed */}
      <LiveSalesPopup />
    </div>
  )
}

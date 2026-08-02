import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase, getAssetUrl } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ShoppingBag, ChevronRight, Check, X, Ruler, Lock, Shield, Truck, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthModal from '../components/AuthModal'
import LiveSalesPopup from '../components/LiveSalesPopup'
import { posthog } from '../lib/posthog'
import { useDocumentMetadata } from '../hooks/useDocumentMetadata'
import { logSqlEvent } from '../lib/analytics/sql-events'

const PRODUCTS = [
  { id: 'regular', name: 'Regular Tee', price: 799, gsm: '200 GSM', disabled: false },
  { id: 'oversized', name: 'Oversized Tee', price: 999, gsm: '220 GSM', disabled: false },
  { id: 'hoodie', name: 'Hoodie (Soon)', price: 1499, gsm: '300 GSM', disabled: true }
]

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

export default function Shop() {
  const { user } = useAuth()
  
  useDocumentMetadata({
    title: 'Shop QR T-Shirts | Custom Identities Collection',
    description: 'Browse our collection of premium 220 GSM heavyweight combed cotton identity Tees. Choose your style, size, and lock in your Founding 100 lifetime perks.'
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedProductType, setSelectedProductType] = useState('oversized')
  const [modalOpen, setModalOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [addressModalOpen, setAddressModalOpen] = useState(false)
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
    posthog.capture('design_selected', { design_id: d.id, design_name: d.name })
    setSelectedDesign(d)
    setModalOpen(true)
    searchParams.set('design', d.id)
    setSearchParams(searchParams, { replace: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const triggerCheckout = () => {
    if (!user) {
      setAuthOpen(true)
      return
    }
    setAddressModalOpen(true)
  }

  const executeRazorpayCheckout = async (addressData) => {
    setAddressModalOpen(false)
    setCheckoutLoading(true)

    posthog.capture('checkout_started', {
      product_type: selectedProductType,
      design_id: selectedDesign?.id,
      design_name: selectedDesign?.name,
      size: selectedSize,
      price: PRODUCTS.find(p => p.id === selectedProductType)?.price,
    })

    const product = PRODUCTS.find(p => p.id === selectedProductType)
    const actualPrice = product?.price || 799

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

      if (apiError) {
        let errorMessage = apiError.message;
        if (apiError.context && typeof apiError.context.json === 'function') {
          try {
            const errBody = await apiError.context.json();
            if (errBody.error) errorMessage = errBody.error;
          } catch (e) {
            // ignore
          }
        }
        throw new Error(errorMessage || 'Failed to create order');
      }
      if (!orderData) throw new Error('Failed to create order')

      const fullShippingAddress = `${addressData.streetAddress}, ${addressData.city}, ${addressData.state} - ${addressData.pincode}`.trim();

      // 2. Open Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "KnoWMi",
        description: `Purchase ${product.name}`,
        image: "https://knowmi.co/favicon.ico",
        order_id: orderData.order_id,
        handler: async function (response) {
          sessionStorage.setItem('knowmi_payment_success', 'true')
          let generatedOrderNum = null;

          const designImageUrl = selectedDesign?.front_image_url || selectedDesign?.model_image_url || selectedDesign?.image_url || selectedDesign?.mockup_url || '/assets/tees/front.webp';

          // 1. Try atomic PostgreSQL RPC for sequential order number and complete order record
          try {
            const { data: rpcRes, error: rpcErr } = await supabase.rpc('record_customer_order', {
              p_user_id: user.id,
              p_customer_name: addressData.fullName || user?.user_metadata?.full_name || '',
              p_customer_email: user.email || '',
              p_customer_phone: addressData.phone || '',
              p_item_name: `${selectedDesign?.name || 'Phygital Signature Tee'} (${selectedProductType?.toUpperCase() || 'REGULAR'})`,
              p_size: selectedSize || 'L',
              p_amount: actualPrice,
              p_shipping_address: fullShippingAddress,
              p_city: addressData.city || 'Bengaluru',
              p_state: addressData.state || 'Karnataka',
              p_pincode: addressData.pincode || '',
              p_payment_id: response.razorpay_payment_id,
              p_razorpay_order_id: orderData.order_id,
              p_model_image_url: designImageUrl
            });

            if (!rpcErr && rpcRes && rpcRes.order_number) {
              generatedOrderNum = rpcRes.order_number;
            }
          } catch (e) {
            console.warn('RPC record_customer_order failed, executing direct insert fallback:', e);
          }

          // Fallback if RPC migration hasn't been run yet
          if (!generatedOrderNum) {
            const { data: seqNum } = await supabase.rpc('generate_next_order_number').catch(() => ({ data: null }));
            generatedOrderNum = seqNum || `KWM-${Math.floor(1000 + Math.random() * 8999)}`;

            const { data: prof } = await supabase.from('profiles').select('id, amount_paid, phone').eq('user_id', user.id).maybeSingle();
            if (prof) {
              await supabase.from('orders').insert([{
                profile_id: prof.id,
                order_number: generatedOrderNum,
                item_name: `${selectedDesign?.name || 'Phygital Signature Tee'} (${selectedProductType?.toUpperCase() || 'REGULAR'})`,
                item_type: 'tshirt',
                size: selectedSize || 'L',
                amount: actualPrice,
                status: 'paid',
                customer_name: addressData.fullName,
                customer_email: user.email,
                customer_phone: addressData.phone,
                shipping_address: fullShippingAddress,
                delivery_city: addressData.city || 'Bengaluru',
                delivery_state: addressData.state || 'Karnataka',
                delivery_pincode: addressData.pincode || '',
                payment_id: response.razorpay_payment_id,
                razorpay_order_id: orderData.order_id,
                model_image_url: designImageUrl,
                estimated_delivery: '3 - 5 Business Days',
                created_at: new Date().toISOString()
              }]);

              await supabase.from('profiles').update({
                status: 'paid',
                is_purchased: true,
                purchased_at: new Date().toISOString(),
                phone: addressData.phone || prof.phone,
                amount_paid: (prof.amount_paid || 0) + actualPrice
              }).eq('id', prof.id);

              await supabase.from('public_profiles').update({
                status: 'paid'
              }).eq('id', prof.id);
            }
          }

          posthog.capture('order_placed', {
            product_type: selectedProductType,
            design_id: selectedDesign?.id,
            design_name: selectedDesign?.name,
            size: selectedSize,
            price: actualPrice,
            order_id: generatedOrderNum,
            payment_id: response.razorpay_payment_id,
          })

          logSqlEvent('purchase_completed', {
            product_type: selectedProductType,
            order_id: generatedOrderNum,
            payment_id: response.razorpay_payment_id,
            price: actualPrice,
            shipping_address: fullShippingAddress,
            city: addressData.city
          });

          setOrderSuccess({ 
            paymentId: response.razorpay_payment_id, 
            orderId: generatedOrderNum,
            razorpayOrderId: orderData?.order_id || ''
          })
        },
        prefill: {
          email: user.email,
          contact: addressData.phone || '',
          name: addressData.fullName || ''
        },
        theme: {
          color: "#f97316"
        }
      }

      logSqlEvent('checkout_initiated', {
        product_type: selectedProductType,
        size: selectedSize,
        price: actualPrice,
        design_id: selectedDesign?.id,
        order_id: orderData.order_id
      });

      const paymentObject = new window.Razorpay(options)
      paymentObject.on('payment.failed', function (response) {
        posthog.capture('payment_failed', {
          product_type: selectedProductType,
          design_id: selectedDesign?.id,
          reason: response.error.description,
          error_code: response.error.code,
        })
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
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      {sizeGuideOpen && <SizeGuideModal />}
      
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Header - Only show if no design selected */}
          {!selectedDesign && (
            <header className="mb-12 border-b-[4px] border-white pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tighter">
                  Explore <span className="text-orange-500">Designs</span>
                </h1>
                <p className="text-sm text-neutral-400 mt-2 tracking-wider uppercase font-bold text-[10px]">
                  Premium Heavyweight Phygital Streetwear Series
                </p>
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] bg-orange-500 text-black border-[3px] border-black shadow-[4px_4px_0px_#000] px-4 py-2">
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
                  <div className="aspect-[3/4] w-full bg-[#1a1a1a] overflow-hidden relative mb-4 border-[3px] border-white shadow-[6px_6px_0px_#fff] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
                    <img 
                      src={getAssetUrl(d.front_image_url || d.model_image_url) || '/assets/tees/front.webp'} 
                      alt={d.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    
                    {/* Wishlist Button Overlay */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success(`Saved to wishlist: ${d.name}`);
                      }}
                      className="absolute top-4 left-4 w-9 h-9 rounded-lg bg-white border-[2px] border-black text-black flex items-center justify-center transition-all shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
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
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black border-[2px] border-black shadow-[2px_2px_0px_#000] px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] select-none whitespace-nowrap">
                      Oversized
                    </div>
                  </div>
                  
                  <div className="px-1 mt-2">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider truncate mb-1">
                      {d.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-orange-500">₹599</span>
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
              <div className="w-24 h-24 bg-[#34d399] text-black border-[4px] border-white shadow-[6px_6px_0px_#fff] rounded-xl flex items-center justify-center mb-6">
                <Check size={48} />
              </div>
              <h2 className="text-4xl font-display font-black text-white mb-4 uppercase tracking-tighter">
                Hurray! Your order is placed.
              </h2>
              <p className="text-lg text-neutral-400 max-w-md mx-auto mb-8 font-bold">
                We've received your payment and are preparing your KnoWMi gear. An invoice and order confirmation has been sent to your email.
              </p>
              <div className="bg-[#1a1a1a] p-6 rounded-xl border-[4px] border-white mb-8 inline-block text-left min-w-[300px] shadow-[8px_8px_0px_#fff]">
                <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-4">Order Details</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-black text-white">Payment ID</span>
                  <span className="text-sm font-mono text-neutral-400 font-bold">{orderSuccess.paymentId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-white">Design</span>
                  <span className="text-sm text-neutral-400 font-bold">{selectedDesign.name} (Size {selectedSize})</span>
                </div>
              </div>
              <div>
                <button 
                  onClick={() => {
                    setOrderSuccess(null)
                    setSelectedDesign(null)
                    searchParams.delete('design')
                    setSearchParams(searchParams, { replace: true })
                    window.scrollTo(0, 0)
                  }}
                  className="px-8 py-4 bg-orange-500 text-black border-[3px] border-black rounded-xl font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
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
                  searchParams.delete('design')
                  setSearchParams(searchParams, { replace: true })
                  window.scrollTo(0, 0)
                }}
                className="mb-10 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
              >
                <ChevronRight size={14} className="rotate-180 text-white" /> Back to Designs
              </button>

              <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
                {/* Left Column: Grid of high-quality product images */}
                <div className="w-full lg:w-[40%] grid grid-cols-2 gap-2 lg:gap-3">
                  {[
                    selectedDesign.front_image_url,
                    selectedDesign.model_image_url,
                    selectedDesign.back_image_url,
                    selectedDesign.image4_url,
                    selectedDesign.image5_url,
                    selectedDesign.image6_url
                  ]
                    .filter(Boolean)
                    .map((imgUrl, index) => (
                      <div 
                        key={index} 
                        className="w-full aspect-[4/5] bg-[#1a1a1a] overflow-hidden relative border-[3px] border-white rounded-xl shadow-[4px_4px_0px_#fff]"
                      >
                        <img 
                          src={getAssetUrl(imgUrl)} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                          alt={`${selectedDesign.name} view ${index + 1}`}
                        />
                        {imgUrl === selectedDesign.front_image_url && (
                          <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                            Front
                          </span>
                        )}
                        {imgUrl === selectedDesign.model_image_url && imgUrl !== selectedDesign.front_image_url && (
                          <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                            Model
                          </span>
                        )}
                        {imgUrl === selectedDesign.back_image_url && (
                          <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                            Back
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
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-white text-black border-[2px] border-black shadow-[2px_2px_0px_#000] px-2.5 py-1 rounded-lg">
                        Oversized Fit
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-orange-500 text-black border-[2px] border-black shadow-[2px_2px_0px_#000] px-2.5 py-1 rounded-lg">
                        Phygital Edition
                      </span>
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-3 leading-tight font-display">
                      {selectedDesign.name}
                    </h1>
                    <p className="text-xs text-neutral-400 tracking-widest font-bold uppercase text-[9px] mb-4">
                      STREETWEAR SERIES CO-CREATION
                    </p>
                    
                    {/* Price display based on Selected Product */}
                    <div className="flex items-baseline gap-3 mb-6 border-b-[4px] border-white pb-5">
                      <span className="text-3xl font-black text-orange-500">
                        ₹{PRODUCTS.find(p => p.id === selectedProductType)?.price || 999}
                      </span>
                      <span className="text-base text-neutral-400 line-through font-bold">
                        {selectedProductType === 'regular' ? '₹1499' : selectedProductType === 'oversized' ? '₹1999' : '₹2999'}
                      </span>
                      <span className="text-[10px] font-black text-black uppercase tracking-widest bg-[#34d399] border-[2px] border-black shadow-[2px_2px_0px_#000] px-2.5 py-1 rounded-lg">
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
                          className={`flex flex-col items-center justify-center p-3.5 border-[3px] transition-all text-center rounded-xl ${
                            p.disabled ? 'opacity-50 cursor-not-allowed bg-[#1a1a1a] border-neutral-800 text-neutral-600' :
                            selectedProductType === p.id 
                              ? 'border-orange-500 bg-orange-500 text-black shadow-[4px_4px_0px_#000] translate-y-[2px] translate-x-[2px]' 
                              : 'border-white bg-[#1a1a1a] text-white hover:border-orange-500 shadow-[4px_4px_0px_#fff]'
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
                        className="text-[9px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-1 hover:text-white border-b-2 border-orange-500 hover:border-white"
                      >
                        Size Chart
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {SIZES.map(s => (
                        <button 
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`w-11 h-11 text-xs font-black uppercase transition-all border-[3px] rounded-lg ${
                            selectedSize === s 
                              ? 'border-orange-500 bg-orange-500 text-black shadow-[4px_4px_0px_#000] translate-y-[2px] translate-x-[2px]' 
                              : 'border-white bg-[#1a1a1a] text-white hover:border-orange-500 shadow-[4px_4px_0px_#fff]'
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
                  <div className="border-t-[4px] border-b-[4px] border-white py-4 mb-6 grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                    <div>
                      <span className="text-neutral-400 font-bold uppercase tracking-wider block text-[8px]">Fabric grade</span>
                      <span className="text-white font-black uppercase text-[10px]">100% Premium Cotton</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 font-bold uppercase tracking-wider block text-[8px]">Weight/thickness</span>
                      <span className="text-white font-black uppercase text-[10px]">{PRODUCTS.find(p => p.id === selectedProductType)?.gsm || '220 GSM'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 font-bold uppercase tracking-wider block text-[8px]">Garment fit</span>
                      <span className="text-white font-black uppercase text-[10px]">{selectedProductType === 'regular' ? 'Regular Fit' : selectedProductType === 'hoodie' ? 'Relaxed Fit' : 'Oversized / Boxy Fit'}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 font-bold uppercase tracking-wider block text-[8px]">Print style</span>
                      <span className="text-white font-black uppercase text-[10px]">Premium HD PUFF PRINT</span>
                    </div>
                  </div>

                  {/* E-Commerce Receipt & Finance details */}
                  <div className="mb-6 bg-[#1a1a1a] p-4 border-[3px] border-white shadow-[4px_4px_0px_#fff] space-y-2.5 text-xs text-neutral-300 font-medium rounded-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Receipt Details</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{PRODUCTS.find(p => p.id === selectedProductType)?.name}</span>
                      <span className="line-through text-neutral-500 font-bold">₹{selectedProductType === 'regular' ? '1499' : selectedProductType === 'oversized' ? '1999' : '2999'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#f87171] font-bold">
                      <span>Founding Member Special Promo</span>
                      <span>-₹{selectedProductType === 'regular' ? '700' : selectedProductType === 'oversized' ? '1000' : '1500'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Priority Shipping & Customization</span>
                      <span className="text-[#34d399] font-black">FREE (₹0)</span>
                    </div>
                    <div className="border-t-[3px] border-white/20 pt-2.5 flex justify-between items-center text-sm font-black text-white">
                      <span>Total Amount (all inclusive)</span>
                      <span className="text-lg text-orange-500">₹{PRODUCTS.find(p => p.id === selectedProductType)?.price || 999}</span>
                    </div>
                  </div>

                  {/* Sticky Checkout Action button */}
                  <div className="pt-2">
                    <div className="mb-4 bg-[#1a1a1a] border-[3px] border-orange-500 text-white p-3.5 text-center flex flex-col items-center justify-center relative overflow-hidden rounded-xl shadow-[4px_4px_0px_#f97316]">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        Strictly Limited Founding Spots
                      </span>
                      <span className="text-[9px] uppercase tracking-widest mt-1 text-orange-500 font-bold">
                        Only {remainingSpots} remaining spots active
                      </span>
                    </div>

                    <button 
                      onClick={triggerCheckout}
                      disabled={checkoutLoading}
                      className="w-full bg-white text-black border-[4px] border-black py-4.5 rounded-xl font-black uppercase tracking-[0.2em] text-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[6px_6px_0px_#000] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {checkoutLoading ? (
                        <div className="w-5 h-5 border-[3px] border-black border-t-transparent rounded-full animate-spin" />
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
                        <Truck size={14} className="text-white" />
                        <span>Dispatched in 24-48 Hours • Free Delivery Across India</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield size={14} className="text-white" />
                        <span>256-Bit SSL Encrypted secure transactions</span>
                      </div>
                    </div>
                  </div>

                  {/* Modern Streetwear Collapsible Accordions */}
                  <div className="mt-8 border-t-[4px] border-white divide-y-[4px] divide-white">
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
                          className="w-full flex items-center justify-between text-left text-xs font-black uppercase tracking-wider text-white hover:text-orange-500 transition-colors py-1"
                        >
                          <span>{item.title}</span>
                          <ChevronRight 
                            size={14} 
                            className={`transition-transform duration-300 ${activeAccordion === item.id ? 'rotate-90 text-orange-500' : 'text-white'}`} 
                          />
                        </button>
                        <div className={`transition-all duration-300 overflow-hidden ${
                          activeAccordion === item.id ? 'max-h-40 mt-3' : 'max-h-0'
                        }`}>
                          <p className="text-xs text-neutral-400 font-bold leading-relaxed normal-case">
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
      {/* 🚚 Standard E-Commerce Shipping Address Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative bg-[#121212] border-[3px] border-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_#fff]">
            <button 
              onClick={() => setAddressModalOpen(false)} 
              className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-black font-black flex items-center justify-center border-[2px] border-black shadow-[2px_2px_0px_#000]">
                <Truck size={20} />
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">Delivery Address</h3>
                <p className="text-xs text-neutral-400 font-bold">Step 1 of 2: Shipping details for your Phygital Tee</p>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const addressObj = {
                fullName: formData.get('fullName'),
                phone: formData.get('phone'),
                streetAddress: formData.get('streetAddress'),
                city: formData.get('city'),
                state: formData.get('state'),
                pincode: formData.get('pincode'),
              };
              if (!addressObj.fullName || !addressObj.phone || !addressObj.streetAddress || !addressObj.city || !addressObj.pincode) {
                toast.error('Please complete all required shipping fields');
                return;
              }
              executeRazorpayCheckout(addressObj);
            }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-1.5">Full Name *</label>
                  <input 
                    type="text" 
                    name="fullName"
                    required 
                    defaultValue={user?.user_metadata?.full_name || user?.user_metadata?.name || ''} 
                    placeholder="e.g. Nanda Kumar"
                    className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-orange-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-1.5">Mobile Phone (Delivery Updates) *</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required 
                    placeholder="10-digit mobile number"
                    className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-orange-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-1.5">Flat / House No / Building / Street *</label>
                <input 
                  type="text" 
                  name="streetAddress"
                  required 
                  placeholder="House No, Apartment / Street name, Area"
                  className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-orange-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-1.5">City *</label>
                  <input 
                    type="text" 
                    name="city"
                    required 
                    defaultValue="Bengaluru" 
                    placeholder="City"
                    className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-orange-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-1.5">State *</label>
                  <input 
                    type="text" 
                    name="state"
                    required 
                    defaultValue="Karnataka" 
                    placeholder="State"
                    className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-orange-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider mb-1.5">PIN Code *</label>
                  <input 
                    type="text" 
                    name="pincode"
                    required 
                    placeholder="6 digits"
                    className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-orange-500 font-semibold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Total Payable</p>
                  <p className="text-xl font-black text-orange-500">₹{PRODUCTS.find(p => p.id === selectedProductType)?.price || 799}</p>
                </div>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-white hover:bg-neutral-200 text-black border-[3px] border-black font-black uppercase tracking-wider text-xs rounded-xl transition-all shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px]"
                >
                  Proceed to Payment →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Success & Activation Instructions Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border-[3px] border-white text-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[8px_8px_0px_#fff] relative space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-2 text-2xl font-black">
                🎉
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-500 font-mono bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                Order #{orderSuccess.orderId} Confirmed
              </span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white mt-1">What Happens Next?</h2>
              <p className="text-xs text-neutral-400 font-medium">Please review these 2 simple steps to activate your phygital tee.</p>
            </div>

            <div className="space-y-4 bg-neutral-900/60 p-5 rounded-2xl border border-white/10 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 font-black flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-0.5">📦 Delivery (3 - 5 Business Days)</h4>
                  <p className="text-neutral-400 leading-relaxed">
                    Your custom KnoWMi Phygital T-shirt with your printed QR code will arrive directly at your shipping address.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-neutral-800">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-black flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-0.5">📱 Scan & Activate (Within 7 Days)</h4>
                  <p className="text-neutral-400 leading-relaxed">
                    Once your T-shirt arrives, scan the QR code on the tee using your phone camera to <strong className="text-white">activate and bind your profile within 7 days of arrival</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment & Razorpay Order ID Verification Box */}
            <div className="bg-black/60 border border-neutral-800 rounded-2xl p-4 space-y-2 text-xs font-mono">
              <p className="text-[10px] font-black uppercase text-orange-500 tracking-[0.2em] font-sans">Payment Verification Receipt</p>
              {orderSuccess.paymentId && (
                <div className="flex justify-between items-center bg-[#111] p-2 rounded-xl border border-neutral-800">
                  <span className="text-neutral-400 font-sans text-[11px]">Payment ID</span>
                  <span className="text-white text-[11px] font-bold select-all">{orderSuccess.paymentId}</span>
                </div>
              )}
              {orderSuccess.razorpayOrderId && (
                <div className="flex justify-between items-center bg-[#111] p-2 rounded-xl border border-neutral-800">
                  <span className="text-neutral-400 font-sans text-[11px]">Razorpay Order ID</span>
                  <span className="text-white text-[11px] font-bold select-all">{orderSuccess.razorpayOrderId}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-wider text-xs rounded-xl transition-all border-[2px] border-black shadow-[3px_3px_0px_#000]"
              >
                Track Order Status →
              </button>
              <button 
                onClick={() => navigate('/studio')}
                className="py-3.5 px-5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl transition-all border border-white/20"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Checkout removed */}
      <LiveSalesPopup />
    </div>
  )
}

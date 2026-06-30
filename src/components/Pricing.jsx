import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Check, Shield, Truck, Lock, Star, ArrowRight, MessageSquare, Zap, BarChart2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const products = [
  {
    id: 'regular',
    name: 'Regular Tee',
    price: 799,
    tagline: '200 GSM Premium Cotton',
    desc: 'The essential classic fit tee that carries your digital world.',
    image: '/assets/scrolly/tshirt_front_v3.png',
    productFeatures: [
      'Full Digital Profile',
      'QR-Enabled Identity',
      'Unlimited Link Updates',
      'Network Connect',
      'Free Shipping',
    ],
    cta: 'Select Regular',
    disabled: false,
  },
  {
    id: 'oversized',
    name: 'Oversized Tee',
    price: 999,
    tagline: '220 GSM Heavyweight',
    desc: 'Our signature drop-shoulder fit. Premium streetwear look.',
    image: '/assets/scrolly/tshirt_front.png',
    featured: true,
    productFeatures: [
      'Full Digital Profile',
      'QR-Enabled Identity',
      'Unlimited Link Updates',
      'Network Connect',
      'Free Shipping',
    ],
    cta: 'Select Oversized',
    disabled: false,
  },
  {
    id: 'hoodie',
    name: 'Hoodie',
    price: 1499,
    tagline: '300 GSM Premium Fleece',
    desc: 'Heavyweight winter essential with integrated identity.',
    image: null, // hoodie placeholder
    productFeatures: [
      'Full Digital Profile',
      'QR-Enabled Identity',
      'Unlimited Link Updates',
      'Network Connect',
      'Free Shipping',
    ],
    cta: 'Coming Soon',
    disabled: true,
  },
]

/** Hoodie placeholder SVG */
function HoodiePlaceholder() {
  return (
    <div className="w-36 h-36 mx-auto flex items-center justify-center rounded-xl bg-[#1a1a1a] border-[3px] border-white">
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 opacity-40">
        <path d="M20 15 L10 30 L20 35 L20 65 L60 65 L60 35 L70 30 L60 15 C60 15 52 22 40 22 C28 22 20 15 20 15Z" stroke="#fff" strokeWidth="2" strokeLinejoin="round" fill="none"/>
        <path d="M20 15 C20 15 22 10 40 10 C58 10 60 15 60 15" stroke="#fff" strokeWidth="2" fill="none"/>
        <path d="M35 10 C35 10 37 18 40 20 C43 18 45 10 45 10" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

export default function Pricing({ onPlanSelect, selectedDesign }) {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const cardsRef = useRef([])
  const { user, profile } = useAuth()
  const [remainingSpots, setRemainingSpots] = useState(100)

  const handleProductClick = (productId, disabled) => {
    if (disabled) return
    onPlanSelect?.(productId)
  }

  useEffect(() => {
    fetchRemainingSpots()
  }, [])

  const fetchRemainingSpots = async () => {
    try {
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'shipped')
      if (!error) setRemainingSpots(Math.max(0, 100 - (count || 0)))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )

      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: '.pricing-grid',
            start: 'top 85%',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <style>{`
        @keyframes floatTee {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-10px) rotate(-2deg); }
        }
        .pricing-tee {
          animation: floatTee 3.5s ease-in-out infinite;
        }
        .pricing-tee-neutral {
          animation: floatTee 4s ease-in-out infinite;
        }
      `}</style>

      <section
        id="pricing"
        className="py-32 bg-[#0a0a0a] relative overflow-hidden min-h-screen flex flex-col justify-center"
        ref={sectionRef}
      >
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          {/* Header */}
          <div className="mb-20 text-center" ref={headerRef}>
            <div className="inline-flex flex-col md:flex-row items-center gap-4 p-1 pr-6 bg-[#1a1a1a] border-[3px] border-white rounded-xl shadow-[4px_4px_0px_#fff] mx-auto mb-12">
              <div className="px-4 py-2 bg-lime-400 text-black rounded-lg border-[3px] border-black text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_#000] flex items-center gap-2">
                <Zap size={12} className="fill-black" /> Only {remainingSpots} Spots Left
              </div>
              <p className="text-sm font-black text-neutral-400">
                Claim yours to get{' '}
                <span className="font-black text-white">Analytics Pro Free for Life.</span>
              </p>
            </div>

            <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight leading-[1.05]">
              Invest in your <br />
              <span className="text-orange-500 italic">Physical Presence.</span>
            </h2>
            <p className="text-lg text-neutral-400 font-black max-w-xl mx-auto">
              A premium physical garment with a lifetime digital soul. <br />
              <span className="text-white">Every purchase unlocks your full digital profile.</span>
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-[1200px] mx-auto pricing-grid items-end">
            {products.map((product, i) => {
              const cardInner = (
                <div
                  className={`group relative rounded-xl flex flex-col p-8 transition-all duration-300 h-full bg-[#1a1a1a] ${
                    product.featured
                      ? 'border-[3px] border-orange-500 shadow-[8px_8px_0px_#F97316]'
                      : 'border-[3px] border-white shadow-[5px_5px_0px_#fff]'
                  } ${product.disabled ? 'opacity-80 grayscale-[20%]' : 'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'}`}
                >
                  {product.featured && (
                    <div className="absolute -top-4 right-8">
                      <span className="bg-lime-400 text-black border-[3px] border-black rounded-lg px-4 py-1 font-black text-[10px] uppercase tracking-widest shadow-[3px_3px_0px_#000]">
                        ★ Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-8">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">
                      {product.tagline}
                    </div>
                    <h3 className="text-2xl font-display font-black mb-4 text-white">{product.name}</h3>

                    {product.id !== 'hoodie' ? (
                      <div className="flex items-baseline gap-1.5 mb-4">
                        <span className="text-6xl font-display font-black text-white">₹{product.price}</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1.5 mb-4">
                        <span className="text-3xl font-display font-black text-neutral-400 italic">Coming Soon</span>
                      </div>
                    )}
                    <p className="text-[13px] text-neutral-400 font-black leading-relaxed">{product.desc}</p>
                  </div>

                  <div className="flex-1 mb-10">
                    <div className="h-[3px] w-10 bg-orange-500 mb-6" />
                    <ul className="space-y-4">
                      {product.productFeatures.map((feat, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span className="mt-0.5 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                            <Check size={12} className="text-black" strokeWidth={4} />
                          </span>
                          <span className="text-[13px] font-black text-neutral-300 leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4 mt-auto">
                    <button
                      onClick={() => handleProductClick(product.id, product.disabled)}
                      disabled={product.disabled}
                      className={`w-full py-4 rounded-lg font-black text-[11px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                        product.disabled
                          ? 'bg-[#2a2a2a] text-neutral-500 cursor-not-allowed border-[3px] border-neutral-700'
                          : 'bg-orange-500 text-black border-[3px] border-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'
                      }`}
                    >
                      {product.cta}
                      {!product.disabled && <ArrowRight size={14} strokeWidth={3} />}
                    </button>
                    <div className="text-center">
                      <span className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">
                        One-time investment
                      </span>
                    </div>
                  </div>
                </div>
              )

              return (
                <div
                  key={product.id}
                  ref={el => (cardsRef.current[i] = el)}
                  className={product.featured ? '-translate-y-4 z-20' : ''}
                >
                  {cardInner}
                </div>
              )
            })}
          </div>

          {/* Analytics Pro Upsell */}
          <div className="max-w-3xl mx-auto mb-24 mt-16 reveal reveal-delay-4">
            <div className="bg-[#1a1a1a] rounded-xl border-[3px] border-orange-500 shadow-[6px_6px_0px_#F97316] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center border-[3px] border-black flex-shrink-0">
                  <BarChart2 size={24} className="text-black" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white flex items-center gap-2 mb-1">
                    Analytics Pro
                    <span className="px-3 py-0.5 bg-lime-400 text-black text-[9px] uppercase tracking-widest rounded-lg font-black border-[3px] border-black">Optional</span>
                  </h4>
                  <p className="text-sm text-neutral-400 font-black">Get deep insights on who scans you, from where, and on what device.</p>
                </div>
              </div>
              <div className="text-center md:text-right flex-shrink-0">
                <div className="text-3xl font-black text-white mb-1">₹29<span className="text-sm text-neutral-400 font-black">/mo</span></div>
                <div className="text-xs font-black text-orange-500 uppercase tracking-widest">1st Month Free</div>
              </div>
            </div>
          </div>

          {/* Trust Footer */}
          <div className="max-w-4xl mx-auto border-t-[3px] border-white pt-12">
            <div className="grid grid-cols-1 gap-12 items-center reveal">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6 text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Truck size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Secure Checkout</span>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] border-2 sm:border-[3px] border-white rounded-xl p-4 sm:p-5 md:p-6 flex items-center gap-4 sm:gap-5 shadow-[3px_3px_0px_#fff] sm:shadow-[5px_5px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-300 group">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-lg border-[3px] border-black bg-[#2a2a2a] flex items-center justify-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=knowmi${i}`} alt="User" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-black text-white leading-tight mb-0.5">Loved by early adopters.</p>
                    <p className="text-[11px] text-neutral-400 font-black">Join our first 100 founding members today.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

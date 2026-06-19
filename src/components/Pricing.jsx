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
    <div className="w-36 h-36 mx-auto flex items-center justify-center rounded-2xl bg-white/5 border border-white/10">
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
        @keyframes gradientBorder {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .featured-border-wrap {
          background: linear-gradient(135deg, #f97316, #fbbf24, #f97316, #ea580c);
          background-size: 300% 300%;
          animation: gradientBorder 3s ease infinite;
          padding: 2px;
          border-radius: 2.5rem;
        }
        @keyframes floatTee {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-10px) rotate(-2deg); }
        }
        .pricing-tee {
          animation: floatTee 3.5s ease-in-out infinite;
          filter: drop-shadow(0 16px 32px rgba(249,115,22,0.2));
        }
        .pricing-tee-neutral {
          animation: floatTee 4s ease-in-out infinite;
          filter: drop-shadow(0 12px 24px rgba(0,0,0,0.4));
        }
      `}</style>

      <section
        id="pricing"
        className="py-32 bg-black relative overflow-hidden min-h-screen flex flex-col justify-center"
        ref={sectionRef}
      >
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/4 w-1/2 h-[600px] bg-orange-500/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
          {/* Header */}
          <div className="mb-20 text-center" ref={headerRef}>
            <div className="inline-flex flex-col md:flex-row items-center gap-4 p-1 pr-6 bg-[#111] border border-orange-500/20 rounded-2xl md:rounded-full shadow-sm mx-auto mb-12 group hover:border-orange-500/50 transition-colors animate-pulse">
              <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl md:rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/30 flex items-center gap-2">
                <Zap size={12} className="fill-white" /> Only {remainingSpots} Spots Left
              </div>
              <p className="text-sm font-medium text-neutral-600">
                Claim yours to get{' '}
                <span className="font-bold text-white">Analytics Pro Free for Life.</span>
              </p>
            </div>

            <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight leading-[1.05]">
              Invest in your <br />
              <span className="text-orange-500 italic">Physical Presence.</span>
            </h2>
            <p className="text-lg text-neutral-400 font-medium max-w-xl mx-auto">
              A premium physical garment with a lifetime digital soul. <br />
              <span className="text-white/80">Every purchase unlocks your full digital profile.</span>
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-[1200px] mx-auto pricing-grid items-end">
            {products.map((product, i) => {
              const cardInner = (
                <div
                  className={`group relative rounded-[2.5rem] flex flex-col p-8 transition-all duration-500 h-full ${
                    product.featured
                      ? 'bg-[#1a110a] shadow-[0_40px_80px_-15px_rgba(255,153,51,0.15)]'
                      : 'bg-[#111] border border-white/10 shadow-sm hover:border-white/20 hover:-translate-y-1'
                  } ${product.disabled ? 'opacity-80 grayscale-[20%]' : ''}`}
                >
                  {product.featured && (
                    <div className="absolute top-6 right-8">
                      <Star className="text-orange-500 fill-orange-500" size={16} />
                    </div>
                  )}

                  {/* Product image floating above card content */}
                  <div className="flex justify-center mb-4 -mt-2">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`h-36 w-auto object-contain ${product.featured ? 'pricing-tee' : 'pricing-tee-neutral'}`}
                        loading="lazy"
                      />
                    ) : (
                      <div className="pricing-tee-neutral">
                        <HoodiePlaceholder />
                      </div>
                    )}
                  </div>

                  <div className="mb-8">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">
                      {product.tagline}
                    </div>
                    <h3 className="text-2xl font-display font-black mb-4 text-white">{product.name}</h3>

                    {product.id !== 'hoodie' ? (
                      <div className="flex items-baseline gap-1.5 mb-4">
                        <span className="text-4xl font-display font-black text-white">₹{product.price}</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1.5 mb-4">
                        <span className="text-2xl font-display font-black text-neutral-400 italic">Coming Soon</span>
                      </div>
                    )}
                    <p className="text-[13px] text-neutral-400 font-medium leading-relaxed">{product.desc}</p>
                  </div>

                  <div className="flex-1 mb-10">
                    <div className="h-px w-8 bg-white/10 mb-6 group-hover:w-12 transition-all" />
                    <ul className="space-y-4">
                      {product.productFeatures.map((feat, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <Check size={14} className="mt-0.5 text-neutral-300 group-hover:text-orange-500 transition-colors" strokeWidth={3} />
                          <span className="text-[13px] font-medium text-neutral-400 leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4 mt-auto">
                    <button
                      onClick={() => handleProductClick(product.id, product.disabled)}
                      disabled={product.disabled}
                      className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-2 ${
                        product.disabled
                          ? 'bg-white/5 text-neutral-500 cursor-not-allowed border border-white/10'
                          : product.featured
                          ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600'
                          : 'bg-[#111111] text-white hover:bg-orange-500 shadow-sm'
                      }`}
                    >
                      {product.cta}
                      {!product.disabled && <ArrowRight size={14} />}
                    </button>
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">
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
                  {product.featured ? (
                    <div className="featured-border-wrap h-full">
                      {cardInner}
                    </div>
                  ) : (
                    cardInner
                  )}
                </div>
              )
            })}
          </div>

          {/* Analytics Pro Upsell */}
          <div className="max-w-3xl mx-auto mb-24 mt-16 reveal reveal-delay-4">
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-3xl p-[2px] shadow-2xl shadow-orange-500/20 relative overflow-hidden group">
              <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-orange-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="bg-[#111] rounded-[22px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 flex-shrink-0">
                    <BarChart2 size={24} className="text-orange-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white flex items-center gap-2 mb-1">
                      Analytics Pro
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[9px] uppercase tracking-widest rounded-full font-bold">Optional</span>
                    </h4>
                    <p className="text-sm text-neutral-500 font-medium">Get deep insights on who scans you, from where, and on what device.</p>
                  </div>
                </div>
                <div className="text-center md:text-right flex-shrink-0">
                  <div className="text-2xl font-black text-white mb-1">₹29<span className="text-sm text-neutral-400 font-medium">/mo</span></div>
                  <div className="text-xs font-bold text-orange-500 uppercase tracking-widest">1st Month Free</div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Footer */}
          <div className="max-w-4xl mx-auto border-t border-white/10 pt-12">
            <div className="grid grid-cols-1 gap-12 items-center reveal">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6 text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Truck size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Secure Checkout</span>
                  </div>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-3xl p-5 md:p-6 flex items-center gap-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-transform duration-500 group">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[#111] bg-white/10 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                        <img src={`https://i.pravatar.cc/100?u=knowmi${i}`} alt="User" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-black text-white leading-tight mb-0.5">Loved by early adopters.</p>
                    <p className="text-[11px] text-neutral-500 font-medium">Join our first 100 founding members today.</p>
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

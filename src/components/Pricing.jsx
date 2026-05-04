import React, { useState, useEffect } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Check, Shield, Truck, Lock, Star, ArrowRight, MessageSquare, Zap } from 'lucide-react'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 699,
    tagline: 'The Essential Tee',
    desc: 'Everything you need to launch your phygital identity.',
    productFeatures: [
      '200 GSM Premium Cotton',
      '1 Persona Profile',
      'QR-Enabled Digital Identity',
      'Core Scan Analytics included',
    ],
    cta: 'Become a Founding Member',
  },
  {
    id: 'creator',
    name: 'Creator',
    price: 999,
    tagline: 'The Signature Choice',
    desc: 'Enhanced flexibility for those building a serious personal brand.',
    featured: true,
    productFeatures: [
      '220 GSM Heavyweight Cotton',
      'Upto 4 Persona Profiles',
      'Advanced Identity Tools',
      'Enhanced Profile Flexibility',
    ],
    cta: 'Become a Founding Member',
  },
  {
    id: 'team',
    name: 'Team',
    price: 899,
    tagline: 'For Elite Squads',
    desc: 'Unified branding for teams of four or more.',
    productFeatures: [
      '220 GSM Heavyweight Cotton',
      'Individual QR for Members',
      'Team Management Panel',
      'Unified Brand Control',
    ],
    cta: 'Talk to Us',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    price: 599,
    tagline: 'Enterprise Solutions',
    desc: 'High-volume identity solutions for large organizations.',
    productFeatures: [
      'Custom GSM Fabric Choice',
      'Corporate Logo Integration',
      'Centralized Admin Access',
      'Employee Directory Sync',
    ],
    cta: 'Request Quote',
  },
]

export default function Pricing({ onPlanSelect, selectedDesign }) {
  const ref = useReveal()
  const { profile } = useAuth()
  const isPaid = profile?.status === 'paid'
  const [remainingSpots, setRemainingSpots] = useState(100)

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
    } catch (err) { console.error(err) }
  }

  return (
    <section id="pricing" className="py-32 bg-[#FDFDFB] relative overflow-hidden snap-section min-h-screen flex items-center" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 relative z-10 w-full">
        
        {/* Global Founding Banner */}
        <div className="mb-20 text-center reveal">
          <div className="inline-flex flex-col md:flex-row items-center gap-4 p-1 pr-6 bg-white border border-orange-100 rounded-2xl md:rounded-full shadow-sm mx-auto mb-12 group hover:border-orange-200 transition-colors">
             <div className="px-4 py-2 bg-orange-500 text-white rounded-xl md:rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-200">
               Founding 100 Perk
             </div>
             <p className="text-sm font-medium text-neutral-600">
               First 100 users get <span className="font-bold text-black">KnoWMi Pro Free for Life.</span>
               <span className="hidden md:inline ml-2 text-neutral-400">Includes advanced analytics & future upgrades.</span>
             </p>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-display font-black text-[#111111] mb-6 tracking-tight leading-[1.05]">
            Invest in your <br />
            <span className="text-orange-500 italic">Physical Presence.</span>
          </h2>
          <p className="text-lg text-neutral-400 font-medium max-w-xl mx-auto">
            A premium heavyweight tee with a lifetime digital soul. <br />
            <span className="text-black/80">Limited Founding Access Available.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan, i) => {
            const isUpgradeOffer = isPaid && plan.id === 'creator'
            const displayPrice = isUpgradeOffer ? 99 : plan.price

            return (
              <div key={plan.id} 
                className={`reveal reveal-delay-${i + 1} relative flex flex-col rounded-[2.5rem] p-8 transition-all duration-500 border group ${
                  plan.featured 
                    ? 'bg-white border-orange-500 shadow-[0_40px_80px_-15px_rgba(255,153,51,0.15)] -translate-y-4 z-20' 
                    : 'bg-white border-neutral-100 shadow-sm hover:border-neutral-200 hover:-translate-y-1'
                }`}
              >
                {plan.featured && (
                  <div className="absolute top-6 right-8">
                    <Star className="text-orange-500 fill-orange-500" size={16} />
                  </div>
                )}

                <div className="mb-8">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">
                    {plan.tagline}
                  </div>
                  <h3 className="text-2xl font-display font-black mb-4 text-black">{plan.name}</h3>
                  
                  <div className="flex items-baseline gap-1.5 mb-2">
                    {plan.id === 'corporate' && <span className="text-xs font-bold text-neutral-400 uppercase">Starts from</span>}
                    <span className="text-4xl font-display font-black text-black">₹{displayPrice}</span>
                    {plan.id === 'team' && <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">/ per tee</span>}
                  </div>
                  {plan.id === 'team' && (
                    <div className="text-[10px] font-black text-orange-600 uppercase tracking-wider mb-4">
                      Min. Quantity: 4
                    </div>
                  )}
                  <p className="text-[13px] text-neutral-500 font-medium leading-relaxed">
                    {plan.desc}
                  </p>
                </div>

                <div className="flex-1 mb-10">
                  <div className="h-px w-8 bg-neutral-200 mb-6 group-hover:w-12 transition-all" />
                  <ul className="space-y-4">
                    {plan.productFeatures.map((feat, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <Check size={14} className="mt-0.5 text-neutral-300 group-hover:text-orange-500 transition-colors" strokeWidth={3} />
                        <span className="text-[13px] font-medium text-neutral-600 leading-tight">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => onPlanSelect?.(plan.id)}
                    className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-2 ${
                      plan.featured
                        ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600'
                        : 'bg-[#111111] text-white hover:bg-orange-500 shadow-sm'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight size={14} />
                  </button>
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">
                      One-time investment
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer: Trust & Upgrades */}
        <div className="max-w-4xl mx-auto border-t border-neutral-100 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center reveal">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                  <Zap size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black">Optional Pro Membership</h4>
                  <p className="text-xs text-neutral-500 font-medium">Upgrade later for advanced analytics at ₹49/mo.</p>
                </div>
              </div>
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
            </div>
            
            <div className="bg-[#111111] rounded-3xl p-6 text-white flex items-center gap-6 shadow-2xl shadow-neutral-200">
               <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-neutral-800 flex items-center justify-center overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?u=knowmi${i}`} alt="User" />
                    </div>
                  ))}
               </div>
               <div>
                 <p className="text-sm font-bold leading-tight">Loved by early adopters.</p>
                 <p className="text-[11px] text-white/50 font-medium">Join our first 100 founding members today.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

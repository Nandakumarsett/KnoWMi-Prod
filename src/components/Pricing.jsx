import React, { useState, useEffect } from 'react'
import { useReveal } from '../hooks/useReveal'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Check, Shield, Truck, Lock, Star, ArrowRight, MessageSquare, Zap } from 'lucide-react'
import TeamCheckout from './TeamCheckout'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 1,
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
    price: 1,
    tagline: 'The Signature Choice',
    desc: 'Enhanced flexibility for those building a serious personal brand.',
    featured: true,
    productFeatures: [
      '220 GSM Heavyweight Cotton',
      'Upto 3 Persona Profiles',
      'Advanced Identity Tools',
      'Enhanced Profile Flexibility',
    ],
    cta: 'Become a Founding Member',
  },
  {
    id: 'team',
    name: 'Team',
    price: 1,
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
    price: 1,
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
  const { user, profile } = useAuth()
  const isPaid = profile?.status === 'paid'
  const [remainingSpots, setRemainingSpots] = useState(100)
  const [simulatorTab, setSimulatorTab] = useState('trial')
  const [teamCheckoutOpen, setTeamCheckoutOpen] = useState(false)

  const handlePlanClick = (planId) => {
    if (planId === 'team') {
      setTeamCheckoutOpen(true)
    } else {
      onPlanSelect?.(planId)
    }
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
    } catch (err) { console.error(err) }
  }

  return (
    <>
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
            const displayPrice = plan.price

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
                    onClick={() => handlePlanClick(plan.id)}
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

        {/* Interactive Feature Simulator */}
        <div className="mb-24 mt-16 bg-neutral-50/50 border border-neutral-100 rounded-[32px] p-8 max-w-4xl mx-auto reveal">
          <div className="text-center mb-8">
            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest">Interactive Simulator</span>
            <h3 className="text-2xl font-display font-black text-black mt-3 mb-2">Compare Digital vs Phygital</h3>
            <p className="text-xs text-neutral-400 font-medium max-w-md mx-auto">Toggle between the basic digital trial profile and a fully unlocked physical smart tee profile.</p>
          </div>
          
          <div className="flex justify-center gap-2 mb-8 p-1 bg-neutral-100/80 rounded-2xl max-w-[280px] mx-auto">
            <button
              onClick={() => setSimulatorTab('trial')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                simulatorTab === 'trial' ? 'bg-[#111111] text-white shadow-md' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              Digital Trial
            </button>
            <button
              onClick={() => setSimulatorTab('unlocked')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                simulatorTab === 'unlocked' ? 'bg-orange-500 text-white shadow-md' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              Tee Unlocked
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm">
            {/* Left side: Simulated Profile Preview */}
            <div className="border border-neutral-100 rounded-2xl p-6 relative overflow-hidden bg-[#FDF6EC]">
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-neutral-900/5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-neutral-600">
                <span className={`w-1.5 h-1.5 rounded-full ${simulatorTab === 'unlocked' ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-300'}`} />
                {simulatorTab === 'unlocked' ? 'Live Profile' : 'Trial Mode'}
              </div>
              
              <div className="flex flex-col items-center text-center mt-4">
                <div className="w-16 h-16 rounded-2xl bg-neutral-200 border-2 border-white shadow-sm mb-3 overflow-hidden relative mx-auto">
                  <img src="https://i.pravatar.cc/100?u=mockowner" alt="Owner" className="w-full h-full object-cover" />
                </div>
                <h4 className="text-sm font-black text-neutral-900">Alex Carter</h4>
                <p className="text-[10px] text-neutral-400 font-bold mb-6">@alexcarter</p>
                
                {/* QR Preview Gating */}
                <div className="relative w-36 h-36 bg-white border border-neutral-100 rounded-2xl flex items-center justify-center p-3 shadow-inner mx-auto">
                  {simulatorTab === 'trial' ? (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-[6px] rounded-2xl flex flex-col items-center justify-center p-4 z-10">
                      <Lock size={20} className="text-orange-500 mb-1" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-orange-500">Buy a Tee to Unlock</span>
                    </div>
                  ) : null}
                  <div className={`w-full h-full relative flex items-center justify-center transition-all duration-500 ${simulatorTab === 'trial' ? 'blur-[4px] opacity-25' : 'opacity-100 scale-105'}`}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent('https://knowmi.co/p/alexcarter')}`}
                      className="w-[100px] h-[100px] object-contain pointer-events-none" 
                      alt="HD QR Code" 
                    />
                    {simulatorTab === 'unlocked' && (
                      <div className="absolute inset-0 m-auto w-6 h-6 bg-neutral-950 rounded-md flex items-center justify-center shadow-lg border border-neutral-800 z-20 select-none">
                        <span className="text-[8px] font-black text-orange-500 tracking-wider font-sans leading-none">WM</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side: Analytics Simulator */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 text-center">
                  <p className="text-[9px] font-black uppercase text-neutral-400 tracking-wider mb-1">Simulated Views</p>
                  <span className={`text-2xl font-black transition-all duration-500 ${simulatorTab === 'trial' ? 'blur-[5px] select-none opacity-50 inline-block' : 'text-orange-500'}`}>
                    {simulatorTab === 'trial' ? '8,204' : '12,450'}
                  </span>
                </div>
                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 text-center">
                  <p className="text-[9px] font-black uppercase text-neutral-400 tracking-wider mb-1">Top Location</p>
                  <span className={`text-sm font-black transition-all duration-500 ${simulatorTab === 'trial' ? 'blur-[5px] select-none opacity-50 inline-block' : 'text-neutral-900'}`}>
                    {simulatorTab === 'trial' ? 'Bengaluru' : 'Mumbai, MH'}
                  </span>
                </div>
              </div>
              
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 relative overflow-hidden min-h-[140px] flex flex-col justify-between">
                <p className="text-[9px] font-black uppercase text-neutral-400 tracking-wider mb-3">Live Traffic Velocity</p>
                {simulatorTab === 'trial' ? (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-[6px] flex flex-col items-center justify-center p-4 z-10">
                    <Lock size={16} className="text-orange-500 mb-1" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-orange-500">Tee Activation Required</span>
                  </div>
                ) : null}
                <div className={`h-24 flex items-end gap-1.5 px-2 transition-all duration-500 ${simulatorTab === 'trial' ? 'blur-[4px] opacity-20' : ''}`}>
                  {[40, 20, 60, 80, 50, 90, 70, 45, 85, 100, 65].map((h, idx) => (
                    <div key={idx} className="flex-1 bg-orange-500/25 rounded-t-sm group-hover:bg-orange-500/35 transition-colors" style={{ height: `${h}%` }}>
                      <div className="h-full w-full bg-orange-500 rounded-t-sm transition-all duration-1000" style={{ height: simulatorTab === 'unlocked' ? '100%' : '0%' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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

    {teamCheckoutOpen && (
      <TeamCheckout
        onClose={() => setTeamCheckoutOpen(false)}
        user={user}
        onAuth={() => setTeamCheckoutOpen(false)}
        selectedDesign={selectedDesign}
      />
    )}
  </>
  )
}

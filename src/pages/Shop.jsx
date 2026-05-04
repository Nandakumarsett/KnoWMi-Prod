import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ShoppingBag, ChevronRight, Check, X, Ruler } from 'lucide-react'

const PLANS = [
  { id: 'starter', name: 'Starter', price: 699, gsm: '200 GSM' },
  { id: 'creator', name: 'Creator', price: 999, gsm: '220 GSM' },
  { id: 'team', name: 'Team', price: 1199, gsm: '240 GSM' }
]

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

export default function Shop() {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedPlan, setSelectedPlan] = useState('creator')
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchDesigns()
  }, [])

  const fetchDesigns = async () => {
    const { data } = await supabase.from('persona_designs').select('*').order('created_at', { ascending: false })
    setDesigns(data || [])
    setLoading(false)
  }

  const handleSelect = (d) => {
    setSelectedDesign(d)
    setModalOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const triggerCheckout = () => {
    const plan = PLANS.find(p => p.id === selectedPlan)
    const msg = `Hi KnoWMi! I want to order the "${selectedDesign.name}" design.

Order Details:
- Design: ${selectedDesign.name}
- Size: ${selectedSize}
- Plan: ${plan.name} (₹${plan.price})
- Quality: ${plan.gsm}

Please share the payment link and next steps!`
    
    window.open(`https://wa.me/917981325397?text=${encodeURIComponent(msg)}`, '_blank')
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
              {designs.map((d) => (
                <div key={d.id} className="group cursor-pointer" onClick={() => handleSelect(d)}>
                  <div className="aspect-square bg-neutral-100 rounded-[32px] overflow-hidden relative mb-4 border border-neutral-100 group-hover:border-orange-500/20 transition-all">
                    <img 
                      src={d.model_image_url || d.front_image_url || '/assets/tees/front.png'} 
                      alt={d.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white text-black px-6 py-3 rounded-xl font-black text-[10px] flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform shadow-xl">
                        <ShoppingBag size={14} /> Select Design
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center px-4">
                    <div>
                      <h3 className="text-2xl font-display font-black text-black">{d.name}</h3>
                      <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">{d.category}</p>
                    </div>
                    <ChevronRight size={24} className="text-neutral-300 group-hover:text-orange-500 transition-colors" />
                  </div>
                </div>
              ))}
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
                    src={selectedDesign.model_image_url || selectedDesign.front_image_url} 
                    className="w-full h-full object-cover"
                    alt="Selected Design"
                  />
                </div>

                {/* Right: Customization - More Compact & Constrained */}
                <div className="py-0 max-w-[450px]">
                  <div className="mb-4">
                    <h2 className="text-3xl font-display font-black text-black mb-0.5 leading-tight">{selectedDesign.name}</h2>
                    <p className="text-xs text-neutral-500 font-medium">Customize your premium Phygital identity.</p>
                  </div>

                  {/* Size Selection */}
                  <div className="mb-12">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">1. Select Your Size</p>
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
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">2. Select Your Quality Plan</p>
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
                      className="w-full bg-black text-white py-4 rounded-xl font-black text-base hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3"
                    >
                      <ShoppingBag size={18} />
                      Safe Checkout via WhatsApp
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
    </div>
  )
}

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

function ProductCard({ design, onClick }) {
  const imageUrl = design.model_image_url || design.front_image_url || design.back_image_url || '/assets/tees/front.png'
  
  return (
    <button onClick={onClick}
      className="group relative rounded-2xl overflow-hidden transition-all duration-300 ring-1 ring-white/10 hover:ring-[#FF9933]/50 hover:scale-[1.02] flex flex-col bg-[#1a1a1a]"
      style={{ aspectRatio: '4/5' }}>
      
      <div className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-110">
        <img src={imageUrl} alt={design.name} className="w-full h-full object-cover" />
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

  const handleOrder = () => {
    if (!user) {
      onAuth()
      return
    }

    const totalPrice = selectedDesign.price * qty
    const msg = `Hi KnoWMi! I want to order a Persona Tee.
    
📦 *Order Details:*
• Category: ${selectedDesign.category}
• Design: ${selectedDesign.name}
• Size: ${size}
• QR Placement: ${qrPlacement}
• Quantity: ${qty}
💰 *Total:* ₹${totalPrice.toLocaleString('en-IN')}

Please share payment details!`
    window.open(`https://wa.me/917981325397?text=${encodeURIComponent(msg)}`, '_blank')
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
                      <img src={bgImg} alt={c} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
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
                  <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0f0f11] flex items-center justify-center relative" style={{ aspectRatio: '4/5' }}>
                    {activeImage === 'model' && selectedDesign.model_image_url && <img src={selectedDesign.model_image_url} className="w-full h-full object-cover animate-fade-in" />}
                    {activeImage === 'front' && selectedDesign.front_image_url && <img src={selectedDesign.front_image_url} className="w-full h-full object-cover animate-fade-in" />}
                    {activeImage === 'back' && selectedDesign.back_image_url && <img src={selectedDesign.back_image_url} className="w-full h-full object-cover animate-fade-in" />}
                    
                    {/* Fallback */}
                    {(!selectedDesign[`${activeImage}_image_url`]) && (
                      <div className="text-[var(--muted)] text-sm">Image not available</div>
                    )}
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-4">
                    {selectedDesign.model_image_url && (
                      <button onClick={() => setActiveImage('model')} className={`flex-1 rounded-xl overflow-hidden border-2 transition-all ${activeImage === 'model' ? 'border-[#FF9933]' : 'border-white/10 opacity-50 hover:opacity-100'}`} style={{ aspectRatio: '1/1' }}>
                        <img src={selectedDesign.model_image_url} className="w-full h-full object-cover" />
                      </button>
                    )}
                    {selectedDesign.front_image_url && (
                      <button onClick={() => setActiveImage('front')} className={`flex-1 rounded-xl overflow-hidden border-2 transition-all ${activeImage === 'front' ? 'border-[#FF9933]' : 'border-white/10 opacity-50 hover:opacity-100'}`} style={{ aspectRatio: '1/1' }}>
                        <img src={selectedDesign.front_image_url} className="w-full h-full object-cover" />
                      </button>
                    )}
                    {selectedDesign.back_image_url && (
                      <button onClick={() => setActiveImage('back')} className={`flex-1 rounded-xl overflow-hidden border-2 transition-all ${activeImage === 'back' ? 'border-[#FF9933]' : 'border-white/10 opacity-50 hover:opacity-100'}`} style={{ aspectRatio: '1/1' }}>
                        <img src={selectedDesign.back_image_url} className="w-full h-full object-cover" />
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

                    {/* Qty & Add to Cart */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 pt-6 mt-6 border-t border-white/10">
                      <div className="flex items-center rounded-xl bg-white/5 border border-white/10 h-14 w-full sm:w-auto">
                        <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-14 h-full text-xl hover:bg-white/10 rounded-l-xl transition-colors">−</button>
                        <span className="w-12 text-center font-bold font-mono text-lg">{qty}</span>
                        <button onClick={() => setQty(q => Math.min(50, q + 1))} className="w-14 h-full text-xl hover:bg-white/10 rounded-r-xl transition-colors">+</button>
                      </div>
                      
                      <button onClick={handleOrder}
                        className="flex-1 w-full h-14 rounded-xl font-bold text-white text-lg transition-transform hover:-translate-y-1 flex items-center justify-center gap-3"
                        style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', boxShadow: '0 8px 24px rgba(37,211,102,0.2)' }}>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.711.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.937 0 3.825-3.113 6.938-6.938 6.938z"/></svg>
                        Order via WhatsApp
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

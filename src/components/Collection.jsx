import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { ShoppingBag, ArrowRight, Star } from 'lucide-react'

export default function Collection({ onSelectDesign }) {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDesigns()
  }, [])

  const fetchDesigns = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('persona_designs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6)
    
    if (error) console.error('Error fetching designs:', error)
    else setDesigns(data || [])
    setLoading(false)
  }

  if (loading) return null

  return (
    <section id="collection" className="py-24 bg-white snap-section min-h-screen flex items-center">
      <div className="max-w-[1200px] mx-auto px-6 w-full">
        <div className="max-w-[850px] mx-auto w-full">
          <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-8">
            <div>
              <div className="inline-block px-3 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[9px] font-black uppercase tracking-widest mb-3">Explore Designs</div>
              <h2 className="text-3xl md:text-4xl font-display font-black text-black leading-tight">
                The Official <br/>
                <span className="text-orange-500 italic">Founding Series</span>
              </h2>
            </div>
            <p className="text-sm text-neutral-500 max-w-[280px] leading-relaxed font-medium">
              Pick a design that fits your persona. After selecting, you'll choose your plan.
            </p>
          </div>

        {designs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {designs.map((d) => (
              <div key={d.id} className="group relative bg-neutral-50 rounded-[2rem] overflow-hidden border border-neutral-100 transition-all duration-500 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1.5">
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img 
                    src={d.model_image_url || d.front_image_url || '/assets/tees/front.png'} 
                    alt={d.name} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-0.5 bg-black text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm">
                      Batch 01
                    </span>
                    <span className="px-2 py-0.5 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-black shadow-sm">
                      {d.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                    <button 
                      onClick={() => onSelectDesign(d)}
                      className="w-full bg-white text-black py-2.5 rounded-lg font-black text-[11px] flex items-center justify-center gap-2 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500"
                    >
                      <ShoppingBag size={12} /> Select Design
                    </button>
                  </div>
                </div>
                <div className="p-5 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-display font-black text-black mb-0">{d.name}</h3>
                    <div className="flex items-center gap-0.5 text-orange-500">
                      <Star size={9} className="fill-orange-500" />
                      <Star size={9} className="fill-orange-500" />
                      <Star size={9} className="fill-orange-500" />
                      <Star size={9} className="fill-orange-500" />
                      <Star size={9} className="fill-orange-500" />
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-black/20 group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { id: 'f1', name: 'Original Black', category: 'Classic', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800' },
              { id: 'f2', name: 'Arctic White', category: 'Minimal', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800' },
              { id: 'f3', name: 'Street Saffron', category: 'Elite', img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800' }
            ].map((d) => (
              <div key={d.id} className="group relative bg-neutral-50 rounded-[2rem] overflow-hidden border border-neutral-100 transition-all duration-500 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1.5">
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img src={d.img} alt={d.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute top-3 left-3"><span className="px-2 py-0.5 bg-white/90 rounded-full text-[8px] font-black uppercase tracking-widest text-black">{d.category}</span></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onSelectDesign(d)} className="w-full bg-white text-black py-2.5 rounded-lg font-black text-[11px]">Select Design</button>
                  </div>
                </div>
                <div className="p-5 flex justify-between items-center">
                  <h3 className="text-lg font-display font-black text-black">{d.name}</h3>
                  <ArrowRight size={14} className="text-neutral-300" />
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-20 text-center">
          <a href="https://wa.me/917981325397" className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-widest text-neutral-400 hover:text-orange-500 transition-colors">
            Custom Group Orders <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  </section>
  )
}

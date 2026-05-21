import React, { useState, useEffect } from 'react'
import { supabase, getAssetUrl } from '../lib/supabase'
import { ShoppingBag, ArrowRight, Star } from 'lucide-react'
import LazyImage from './ui/LazyImage'

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

  const SeeMoreCard = () => (
    <a href="/shop" className="min-w-[280px] md:min-w-0 snap-center group relative bg-neutral-50 rounded-[2rem] overflow-hidden border border-dashed border-neutral-200 transition-all duration-500 hover:border-orange-500/50 hover:bg-orange-50/30 flex flex-col items-center justify-center p-8 text-center min-h-[350px]">
      <div className="w-16 h-16 rounded-full bg-white border border-neutral-100 flex items-center justify-center text-neutral-400 group-hover:text-orange-500 group-hover:border-orange-500/20 group-hover:scale-110 transition-all duration-500 mb-6 shadow-sm group-hover:shadow-xl group-hover:shadow-orange-500/10">
        <ArrowRight size={28} />
      </div>
      <h3 className="text-xl font-display font-black text-black mb-2">Explore Full <br/> Collection</h3>
      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Find your perfect match</p>
      <div className="mt-8 px-6 py-2.5 rounded-xl bg-black text-white font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
        View All Designs
      </div>
    </a>
  )

  if (loading) return null

  return (
    <>
    <section id="collection" className="py-24 bg-white snap-section min-h-screen flex items-center">
      <div className="max-w-[1200px] mx-auto px-6 w-full">
        <div className="max-w-[1000px] mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 gap-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-block px-3 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[9px] font-black uppercase tracking-widest">Live Designs</div>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-black text-black leading-tight">
                These tees are live. <br className="hidden md:block"/>
                <span className="text-orange-500 italic">Yours might be next.</span>
              </h2>
            </div>
            <p className="text-sm text-neutral-500 max-w-[320px] leading-relaxed font-medium mx-auto md:mx-0">
              Pick your canvas. Every design is a portal to your digital world.
            </p>
          </div>

        {designs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {designs.map((d) => (
              <div key={d.id} className="group relative bg-neutral-50 rounded-[2.5rem] overflow-hidden border border-neutral-100 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1.5">
                <div className="aspect-[4/5] overflow-hidden relative bg-neutral-100">
                  <LazyImage 
                    src={getAssetUrl(d.model_image_url || d.front_image_url) || '/assets/tees/front.png'} 
                    alt={d.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    skeletonClassName="absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <button 
                      onClick={() => onSelectDesign(d)}
                      className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-2xl"
                    >
                      <ShoppingBag size={14} /> Select Design
                    </button>
                  </div>
                </div>
                <div className="p-6 flex justify-between items-center bg-white">
                  <div>
                    <h3 className="text-lg font-display font-black text-black mb-1">{d.name}</h3>
                    <div className="flex items-center gap-0.5 text-orange-500">
                      {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-orange-500" />)}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            ))}
            <SeeMoreCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 'f1', name: 'Original Black', category: 'Classic', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800' },
              { id: 'f2', name: 'Arctic White', category: 'Minimal', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800' },
              { id: 'f3', name: 'Street Saffron', category: 'Elite', img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800' }
            ].map((d) => (
              <div key={d.id} className="group relative bg-neutral-50 rounded-[2.5rem] overflow-hidden border border-neutral-100 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1.5">
                <div className="aspect-[4/5] overflow-hidden relative bg-neutral-100">
                  <LazyImage src={d.img} alt={d.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" skeletonClassName="absolute inset-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <button onClick={() => onSelectDesign(d)} className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Select Design</button>
                  </div>
                </div>
                <div className="p-6 flex justify-between items-center bg-white">
                  <h3 className="text-lg font-display font-black text-black">{d.name}</h3>
                  <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            ))}
            <SeeMoreCard />
          </div>
        )}
        <div className="mt-16 text-center">
          <a href="https://wa.me/917981325397" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-orange-500 transition-colors">
            Custom Group Orders <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  </section>
  <style dangerouslySetInnerHTML={{ __html: `
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}} />
    </>
  )
}

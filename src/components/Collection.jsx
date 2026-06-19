import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { supabase, getAssetUrl } from '../lib/supabase'

gsap.registerPlugin(ScrollTrigger)
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

  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      )

      // Grid Items Stagger Animation
      if (gridRef.current) {
        const cards = gridRef.current.children
        gsap.fromTo(cards,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            stagger: 0.1,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
            }
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [loading, designs])

  const SeeMoreCard = () => (
    <a href="/shop" className="min-w-[280px] md:min-w-0 group relative bg-[#1a1a1a] rounded-xl overflow-hidden border-[3px] border-dashed border-white transition-all duration-300 hover:border-orange-500 hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_#F97316] flex flex-col items-center justify-center p-8 text-center min-h-[350px] shadow-[4px_4px_0px_#fff]">
      <div className="w-16 h-16 rounded-xl bg-orange-500 border-[3px] border-black flex items-center justify-center text-black shadow-[3px_3px_0px_#000] mb-6 group-hover:rotate-12 transition-transform duration-300">
        <ArrowRight size={28} strokeWidth={3} />
      </div>
      <h3 className="text-xl font-black text-white mb-2 uppercase">Explore Full <br/> Collection</h3>
      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Find your perfect match</p>
      <div className="mt-8 px-6 py-2.5 rounded-lg bg-orange-500 text-black border-[3px] border-black font-black text-[9px] uppercase tracking-widest shadow-[3px_3px_0px_#000] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
        View All Designs
      </div>
    </a>
  )

  if (loading) return null

  return (
    <>
    <section id="collection" className="py-24 bg-[#0a0a0a] min-h-screen flex items-center relative overflow-hidden" ref={sectionRef}>
      
      <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10">
        <div className="w-full">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 gap-8 text-center md:text-left" ref={headerRef}>
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-block px-4 py-1.5 rounded-lg bg-lime-400 border-[3px] border-black text-black text-[9px] font-black uppercase tracking-widest shadow-[3px_3px_0px_#000]">Live Designs</div>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase">
                These tees are live. <br className="hidden md:block"/>
                <span className="bg-orange-500 text-black px-3 py-1 rounded-lg inline-block mt-1">Yours might be next.</span>
              </h2>
            </div>
            <p className="text-sm text-neutral-500 max-w-[320px] leading-relaxed font-medium mx-auto md:mx-0">
              Pick your canvas. Every design is a portal to your digital world.
            </p>
          </div>

        {designs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" ref={gridRef}>
            {designs.map((d) => (
              <div key={d.id} className="group relative bg-[#1a1a1a] rounded-xl overflow-hidden border-[3px] border-white transition-all duration-300 shadow-[5px_5px_0px_#F97316] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[8px_8px_0px_#F97316]">
                <div className="aspect-[4/5] overflow-hidden relative bg-black">
                  <LazyImage 
                    src={getAssetUrl(d.front_image_url || d.model_image_url) || '/assets/tees/front.png'} 
                    alt={d.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    skeletonClassName="absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <button 
                      onClick={() => onSelectDesign(d)}
                      className="w-full bg-orange-500 text-black py-4 rounded-lg border-[3px] border-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                    >
                      <ShoppingBag size={14} strokeWidth={3} /> Select Design
                    </button>
                  </div>
                </div>
                <div className="p-6 flex justify-between items-center bg-[#111]">
                  <div>
                    <h3 className="text-lg font-display font-black text-white mb-1">{d.name}</h3>
                    <div className="flex items-center gap-0.5 text-orange-500">
                      {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-orange-500" />)}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-orange-500 border-[2px] border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
                    <ArrowRight size={18} strokeWidth={3} />
                  </div>
                </div>
              </div>
            ))}
            <SeeMoreCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" ref={gridRef}>
            {[
              { id: 'f1', name: 'Original Black', category: 'Classic', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800' },
              { id: 'f2', name: 'Arctic White', category: 'Minimal', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800' },
              { id: 'f3', name: 'Street Saffron', category: 'Elite', img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800' }
            ].map((d) => (
              <div key={d.id} className="group relative bg-[#1a1a1a] rounded-xl overflow-hidden border-[3px] border-white transition-all duration-300 shadow-[5px_5px_0px_#F97316] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[8px_8px_0px_#F97316]">
                <div className="aspect-[4/5] overflow-hidden relative bg-black">
                  <LazyImage src={d.img} alt={d.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" skeletonClassName="absolute inset-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <button onClick={() => onSelectDesign(d)} className="w-full bg-orange-500 text-black py-4 rounded-lg border-[3px] border-black font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">Select Design</button>
                  </div>
                </div>
                <div className="p-6 flex justify-between items-center bg-[#111]">
                  <h3 className="text-lg font-display font-black text-white">{d.name}</h3>
                  <div className="w-10 h-10 rounded-lg bg-orange-500 border-[2px] border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
                    <ArrowRight size={18} strokeWidth={3} />
                  </div>
                </div>
              </div>
            ))}
            <SeeMoreCard />
          </div>
        )}
        <div className="mt-16 text-center">
          <a href="https://wa.me/917981325397" target="_blank" rel="noopener noreferrer" title="Opens in a new tab" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-orange-500 transition-colors">
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

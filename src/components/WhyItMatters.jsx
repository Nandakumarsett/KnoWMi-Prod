import { useReveal } from '../hooks/useReveal'
import { Sparkles, Globe, Zap, Heart } from 'lucide-react'

const points = [
  {
    icon: <Globe className="text-orange-500" />,
    title: "Eco-System Independent",
    desc: "No apps. No accounts required for scanners. Works with every modern smartphone instantly."
  },
  {
    icon: <Zap className="text-orange-500" />,
    title: "Real-Time Updates",
    desc: "Update your links, portfolio, or socials any time. Your tee always points to your current self."
  },
  {
    icon: <Heart className="text-orange-500" />,
    title: "Identity First",
    desc: "More than fashion. It's a conversation starter that turns brief encounters into lasting connections."
  }
]

export default function WhyItMatters() {
  const ref = useReveal()

  return (
    <section id="why-it-matters" className="py-32 bg-white snap-section min-h-screen flex items-center" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-6 text-orange-600 text-[10px] font-black uppercase tracking-widest">
              The KnoWMi Philosophy
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-black text-black mb-8 leading-tight">
              Why a Tee? <br />
              <span className="text-orange-500 italic">Why Now?</span>
            </h2>
            <p className="text-lg text-neutral-500 font-medium mb-12 leading-relaxed">
              In a world of digital noise, real-world connections are becoming rare. We believe your physical presence should be a bridge to your digital world, not a barrier.
            </p>
            
            <div className="space-y-10">
              {points.map((p, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                    {p.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">{p.title}</h3>
                    <p className="text-sm text-neutral-500 font-medium leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative reveal reveal-delay-2">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-neutral-100 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1556740734-7f9a2b7a0f42?q=80&w=1000&auto=format&fit=crop" 
                alt="Human connection" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-[#111111] text-white p-10 rounded-[2.5rem] shadow-2xl hidden md:block max-w-[300px]">
               <Sparkles className="text-orange-500 mb-4" />
               <p className="text-xl font-display font-black leading-tight italic">
                 "Turn every introduction into a lasting digital legacy."
               </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

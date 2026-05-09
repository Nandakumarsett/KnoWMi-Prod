import Navbar from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Newspaper, Rocket, Zap, MessageCircle } from 'lucide-react'

export default function Blog() {
  const categories = [
    { name: 'Phygital Tech', icon: <Zap size={18}/>, count: 0 },
    { name: 'Identity Design', icon: <Rocket size={18}/>, count: 0 },
    { name: 'Founder Stories', icon: <MessageCircle size={18}/>, count: 0 }
  ]

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Hero Modeling */}
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8 animate-reveal">
            <div>
              <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-6">Coming Soon</div>
              <h1 className="text-6xl md:text-8xl font-display font-black leading-tight text-black">KnoWMi<span className="text-orange-500">Pulse</span></h1>
              <p className="text-xl text-neutral-600 max-w-xl mt-4">Exploring the intersection of physical style and digital identity.</p>
            </div>
            
            <div className="flex gap-4">
              {categories.map(c => (
                <div key={c.name} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-50 border border-neutral-100 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  {c.icon} {c.name}
                </div>
              ))}
            </div>
          </div>

          {/* Placeholder Grid Modeling */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32 opacity-20 grayscale pointer-events-none select-none">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white border border-neutral-100 rounded-[32px] overflow-hidden group shadow-lg shadow-neutral-100/50">
                <div className="aspect-[16/10] bg-neutral-50" />
                <div className="p-8 space-y-4">
                  <div className="h-4 w-24 bg-neutral-100 rounded" />
                  <div className="h-8 w-full bg-neutral-100 rounded" />
                  <div className="h-12 w-full bg-neutral-100 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter Model */}
          <div className="p-12 md:p-20 bg-neutral-50 border border-neutral-100 rounded-[48px] text-center relative overflow-hidden shadow-xl shadow-neutral-100/30">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-black">
              <Newspaper size={200} className="rotate-12" />
            </div>
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-display font-black text-black">Be the first to <br/> <span className="text-orange-500 italic">Catch the Pulse</span></h2>
              <p className="text-neutral-600 max-w-md mx-auto leading-relaxed text-lg font-medium">
                We're modeling the future of identity. Subscribe to get our weekly insights on Phygital tech and design.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 h-14 bg-white border border-neutral-200 rounded-2xl px-6 outline-none focus:border-orange-500 transition-all font-bold text-black"
                />
                <button className="bg-black text-white h-14 px-10 rounded-2xl font-black shadow-xl shadow-black/10 hover:bg-neutral-800 transition-all">Notify Me</button>
              </div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">No spam. Only high-fidelity identity tech.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

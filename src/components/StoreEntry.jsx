import { useEffect } from 'react'

export default function StoreEntry({ onClose, onSelectMode }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0f0f11] text-white overflow-hidden p-6">
      
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#FF9933] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#38bdf8] rounded-full mix-blend-screen filter blur-[150px] opacity-20"></div>

      {/* Header */}
      <div className="absolute top-0 w-full flex justify-between p-6 z-10">
        <h2 className="font-display font-bold text-2xl tracking-widest text-white">Kno<span className="text-[#FF9933]">WM</span>i</h2>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/20">
          ✕
        </button>
      </div>

      <div className="text-center mb-12 z-10">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Choose Your Journey</h1>
        <p className="text-gray-400 max-w-lg mx-auto">Select a pre-designed Persona collection, or step into the studio to create your own custom masterpiece from scratch.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl z-10">
        
        {/* Card 1: Persona Store */}
        <div onClick={() => onSelectMode('persona')}
          className="group relative rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#FF9933]/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,153,51,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f11] z-0"></div>
          
          <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-end min-h-[400px]">
            <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
              <span className="text-xl">👕</span>
            </div>
            
            <h3 className="text-3xl font-display font-bold mb-3 text-white group-hover:text-[#FF9933] transition-colors">
              Persona Store
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Browse our exclusive, hyper-realistic pre-created designs. Perfect for Gamers, Influencers, Developers, and Creators.
            </p>
            
            <div className="flex items-center gap-2 text-sm font-bold tracking-wider text-[#FF9933] uppercase">
              Explore Collections <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </div>
        </div>

        {/* Card 2: Create Your Own */}
        <div onClick={() => onSelectMode('customizer')}
          className="group relative rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#38bdf8]/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(56,189,248,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f11] z-0"></div>
          
          <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-end min-h-[400px]">
            <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
              <span className="text-xl">🎨</span>
            </div>

            <h3 className="text-3xl font-display font-bold mb-3 text-white group-hover:text-[#38bdf8] transition-colors">
              Create Your Own
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              A free hand to design. Customize the color, sleeves, QR placement, add your own persona text, and upload custom artwork.
            </p>
            
            <div className="flex items-center gap-2 text-sm font-bold tracking-wider text-[#38bdf8] uppercase">
              Enter Studio <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

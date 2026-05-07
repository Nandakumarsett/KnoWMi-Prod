import { useReveal } from '../hooks/useReveal'

export default function FounderStory() {
  const ref = useReveal()

  return (
    <section id="founder-story" className="py-32 bg-[#111111] text-white snap-section min-h-screen flex items-center" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-[800px] mx-auto text-center reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 text-orange-400 text-[10px] font-black uppercase tracking-widest">
            A Personal Mission
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-black mb-10 leading-tight">
            Why I Built <br />
            <span className="text-orange-500 italic">KnoWMi.</span>
          </h2>
          <div className="space-y-8 text-xl text-white/60 font-medium leading-relaxed">
            <p>
              The idea for KnoWMi didn’t come from a boardroom—it came from a frustration we’ve all felt: the friction of a first meeting. 
            </p>
            <p>
              I realized that while we all carry powerful digital identities, we struggle to share them effectively in the physical world. Business cards get lost, and "find me on Instagram" is a clumsy dance.
            </p>
            <p>
              I wanted to build something that felt human. A bridge between who you are standing in front of me and who you are online. By putting your identity on the most basic piece of human apparel—the T-shirt—we’ve made connection as natural as a handshake.
            </p>
            <p className="text-white text-2xl italic font-display mt-12">
              "KnoWMi is about removing the friction from human connection, one scan at a time."
            </p>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center gap-2">
             <div className="text-sm font-black uppercase tracking-widest text-white">Nanda Kumar</div>
             <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Creator of KnoWMi</div>
          </div>
        </div>
      </div>
    </section>
  )
}

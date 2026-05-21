import { useReveal } from '../hooks/useReveal'
import { ArrowRight, GraduationCap, Code, Camera } from 'lucide-react'

const useCases = [
  {
    id: 'students',
    icon: <GraduationCap size={24} />,
    title: 'For Students',
    benefit: 'Stop handing out paper. Start standing out.',
    desc: 'At hackathons, fests, and networking events — your tee speaks before you do. One scan: your LinkedIn, resume, and projects, live.',
    image: 'https://images.unsplash.com/photo-1523240715630-36d93339008f?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'creators',
    icon: <Camera size={24} />,
    title: 'For Creators',
    benefit: 'Your content is everywhere. Now so are you.',
    desc: 'Turn every "where do I follow you?" into an instant connection. No more fumbling. Your audience finds you — by scanning your tee.',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'developers',
    icon: <Code size={24} />,
    title: 'For Developers',
    benefit: 'Your GitHub speaks. Make them listen.',
    desc: 'At meetups, conferences, and hackathons — skip the small talk. Let your profile do it. GitHub, portfolio, socials. One scan away.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop'
  }
]

export default function PersonaUseCases() {
  const ref = useReveal()

  return (
    <section id="use-cases" className="py-32 bg-neutral-50 snap-section min-h-screen flex items-center" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-24 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-6 text-orange-600 text-[10px] font-black uppercase tracking-widest">
            Built For You
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-black text-black mb-6 tracking-tight leading-[1.05]">
            Who wears <br />
            <span className="text-orange-500 italic">KnoWMi?</span>
          </h2>
          <p className="text-lg text-neutral-400 font-medium max-w-xl mx-auto">
            Anyone who's tired of being forgotten. Creators, students, founders, techies — your tee tells your story.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {useCases.map((uc, i) => (
            <div key={uc.id} className={`reveal reveal-delay-${i + 1} group relative bg-white rounded-[3rem] p-10 border border-neutral-100 hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col items-center text-center lg:items-start lg:text-left`}>
              <div className="relative z-10 w-full flex flex-col items-center lg:items-start">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 mb-8">
                  {uc.icon}
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">{uc.title}</h3>
                <h4 className="text-2xl font-display font-black text-black mb-4 leading-tight">{uc.benefit}</h4>
                <p className="text-sm text-neutral-500 font-medium leading-relaxed mb-8 mx-auto lg:mx-0">
                  {uc.desc}
                </p>
                <a href="#pricing" className="flex items-center justify-center lg:justify-start gap-2 text-orange-500 font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all w-full lg:w-auto">
                   Get Yours <ArrowRight size={14} />
                </a>
              </div>
              
              <div className="absolute bottom-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
                 {uc.icon}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 reveal text-center">
          <p className="text-sm text-neutral-400 font-medium mb-6">Also perfect for:</p>
           <div className="flex flex-wrap justify-center gap-4">
              {['Entrepreneurs', 'Artists', 'Founders', 'Freelancers', 'Athletes'].map(p => (
                <span key={p} className="px-6 py-3 rounded-2xl bg-white border border-neutral-100 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-orange-500 hover:border-orange-200 transition-colors cursor-pointer">
                  {p}
                </span>
              ))}
           </div>
        </div>
      </div>
    </section>
  )
}

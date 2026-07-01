import { useReveal } from '../hooks/useReveal'
import { CheckCircle } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'UX Designer · Bangalore',
    color: '#FF9933',
    rating: 5,
    text: "Wore this to a startup meetup and got 14 LinkedIn connections in one evening. People literally came up to scan my tee. It's the most effective networking tool I've ever owned.",
    scans: '312 scans',
    featured: true,
  },
  {
    name: 'Rahul Verma',
    role: 'CS Student · IIT Delhi',
    color: '#3B82F6',
    rating: 5,
    text: 'Got the Creator plan for my college hackathon. My team lead scanned it and offered me an internship right there. Seriously no joke. KnoWMi is built different.',
    scans: '189 scans',
  },
  {
    name: 'Ananya Iyer',
    role: 'Freelance Photographer · Mumbai',
    color: '#10B981',
    rating: 5,
    text: "Updated my portfolio link three times since I got the tee — each time I just update the profile, not the tee. That's the whole magic. My QR is always current.",
    scans: '427 scans',
  },
  {
    name: 'Karan Mehta',
    role: 'Founder · Delhi',
    color: '#9B59B6',
    rating: 5,
    text: "Ordered 25 tees for our company offsite. Every team member now has their own QR profile tee. The team dashboard makes it so easy to manage. Worth every rupee.",
    scans: '98 scans/member',
  },
  {
    name: 'Sneha Reddy',
    role: 'Content Creator · Hyderabad',
    color: '#F59E0B',
    rating: 5,
    text: "The quality of the tee itself is amazing — I've washed it 30+ times and the QR still scans perfectly. And my scan analytics show people even click my YouTube link from it!",
    scans: '891 scans',
  },
  {
    name: 'Arjun Nair',
    role: 'Product Manager · Pune',
    color: '#1DA1F2',
    rating: 5,
    text: "At first I thought it was a gimmick. Then I wore it to a product conference and had 40+ people ask about it. My LinkedIn grew by 200 followers that week. Converted now.",
    scans: '563 scans',
  },
]

function Stars({ count, size = 20 }) {
  return (
    <div className="flex gap-1" aria-label={`${count} out of 5 stars`} role="img">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < count ? '#F97316' : '#333'} stroke={i < count ? '#000' : 'none'} strokeWidth="1.5" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const ref = useReveal()

  return (
    <section id="reviews" className="py-12 md:py-16 bg-[#0a0a0a] relative overflow-hidden" ref={ref}>
      <style>{`
        @keyframes viralBadgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .viral-badge {
          animation: viralBadgePulse 2s ease-in-out infinite;
        }
        .testi-card-brutal {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .testi-card-brutal:hover {
          transform: translate(-3px, -3px);
          box-shadow: 8px 8px 0px #F97316 !important;
        }
        @keyframes marqueeLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marqueeRight {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .marquee-left-track {
          display: flex;
          width: max-content;
          animation: marqueeLeft 35s linear infinite;
        }
        .marquee-right-track {
          display: flex;
          width: max-content;
          animation: marqueeRight 35s linear infinite;
        }
        .marquee-left-track:hover,
        .marquee-right-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full overflow-hidden">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="inline-block mb-4 px-5 py-2 bg-orange-500 text-black text-xs font-black uppercase tracking-widest border-[3px] border-black rounded-lg shadow-[3px_3px_0px_#000]">
            ★ REVIEWS ★
          </span>

          {/* Huge rating display */}
          <div className="mb-6">
            <div className="text-7xl md:text-8xl font-black text-white leading-none mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              4.9
            </div>
            <div className="flex justify-center mb-3">
              <Stars count={5} size={28} />
            </div>
            <p className="text-sm text-neutral-400 font-black uppercase tracking-wider">FROM 2,100+ VERIFIED REVIEWS</p>
          </div>

          <h2 className="font-black mb-4 text-white uppercase tracking-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontFamily: "'Montserrat', sans-serif" }}>
            PEOPLE ARE{' '}
            <span className="text-orange-500">TALKING ABOUT IT</span>
          </h2>
        </div>

        {/* Dual Marquees */}
        <div className="space-y-8 overflow-hidden">
          {/* Row 1: Left to Right */}
          <div className="flex overflow-hidden w-full relative">
            <div className="marquee-left-track">
              {[...testimonials.slice(0, 3), ...testimonials.slice(0, 3), ...testimonials.slice(0, 3), ...testimonials.slice(0, 3)].map((t, idx) => (
                <div
                  key={idx}
                  className="testi-card-brutal flex-shrink-0 w-[290px] sm:w-[380px] bg-[#1a1a1a] border-2 sm:border-[3px] border-white rounded-xl overflow-hidden relative mx-3"
                  style={{
                    boxShadow: '4px 4px 0px #F97316',
                  }}
                >
                  {/* Top accent bar */}
                  <div
                    className="h-2 w-full"
                    style={{ backgroundColor: t.color }}
                  />

                  {/* Viral badge on featured */}
                  {t.featured && (
                    <div className="viral-badge absolute top-5 right-4 z-20">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-black text-[10px] font-black uppercase tracking-widest border-[3px] border-black rounded-lg shadow-[3px_3px_0px_#000]">
                        🔥 GOING VIRAL
                      </span>
                    </div>
                  )}

                  <div className="p-5 sm:p-6 md:p-7 relative z-10 flex flex-col h-full">
                    <Stars count={t.rating} />

                    <blockquote className="mt-4 mb-5 text-sm leading-relaxed text-neutral-200 font-bold flex-1">
                      &ldquo;{t.text}&rdquo;
                    </blockquote>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mt-auto pt-4 border-t-[3px] border-white/20">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={`https://i.pravatar.cc/100?u=knowmi_${t.name.toLowerCase().replace(' ', '_')}`}
                          alt={t.name}
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg object-cover border-2 sm:border-[3px] border-orange-500 flex-shrink-0"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <div className="text-sm font-black text-white">{t.name}</div>
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500 text-black border-[2px] border-black rounded-md">
                              <CheckCircle size={10} className="text-black" strokeWidth={3} />
                              <span className="text-[8px] font-black uppercase tracking-widest">Verified</span>
                            </div>
                          </div>
                          <div className="text-xs text-neutral-400 font-bold truncate">{t.role}</div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 self-end sm:self-auto">
                        <div className="text-xs font-black text-orange-500 bg-orange-500/10 border-[2px] border-orange-500 rounded-md px-2 py-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {t.scans}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Right to Left */}
          <div className="flex overflow-hidden w-full relative">
            <div className="marquee-right-track">
              {[...testimonials.slice(3, 6), ...testimonials.slice(3, 6), ...testimonials.slice(3, 6), ...testimonials.slice(3, 6)].map((t, idx) => (
                <div
                  key={idx}
                  className="testi-card-brutal flex-shrink-0 w-[290px] sm:w-[380px] bg-[#1a1a1a] border-2 sm:border-[3px] border-white rounded-xl overflow-hidden relative mx-3"
                  style={{
                    boxShadow: '4px 4px 0px #F97316',
                  }}
                >
                  {/* Top accent bar */}
                  <div
                    className="h-2 w-full"
                    style={{ backgroundColor: t.color }}
                  />

                  {/* Viral badge on featured */}
                  {t.featured && (
                    <div className="viral-badge absolute top-5 right-4 z-20">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-black text-[10px] font-black uppercase tracking-widest border-[3px] border-black rounded-lg shadow-[3px_3px_0px_#000]">
                        🔥 GOING VIRAL
                      </span>
                    </div>
                  )}

                  <div className="p-5 sm:p-6 md:p-7 relative z-10 flex flex-col h-full">
                    <Stars count={t.rating} />

                    <blockquote className="mt-4 mb-5 text-sm leading-relaxed text-neutral-200 font-bold flex-1">
                      &ldquo;{t.text}&rdquo;
                    </blockquote>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mt-auto pt-4 border-t-[3px] border-white/20">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={`https://i.pravatar.cc/100?u=knowmi_${t.name.toLowerCase().replace(' ', '_')}`}
                          alt={t.name}
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg object-cover border-2 sm:border-[3px] border-orange-500 flex-shrink-0"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <div className="text-sm font-black text-white">{t.name}</div>
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500 text-black border-[2px] border-black rounded-md">
                              <CheckCircle size={10} className="text-black" strokeWidth={3} />
                              <span className="text-[8px] font-black uppercase tracking-widest">Verified</span>
                            </div>
                          </div>
                          <div className="text-xs text-neutral-400 font-bold truncate">{t.role}</div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 self-end sm:self-auto">
                        <div className="text-xs font-black text-orange-500 bg-orange-500/10 border-[2px] border-orange-500 rounded-md px-2 py-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {t.scans}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Worn at */}
        <div className="mt-16 reveal text-center">
          <p className="text-xs font-black uppercase tracking-widest mb-6 text-neutral-500" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            WORN AT
          </p>
          <div className="flex flex-wrap justify-center gap-4 items-center">
            {['IIT Delhi Techfest', 'Nasscom Startup Summit', 'Bangalore Design Week', 'Product Hunt India', 'IIM Ahmedabad'].map((v, i) => (
              <span key={i} className="px-4 py-2 rounded-lg text-sm font-black bg-[#1a1a1a] text-neutral-300 border-[2px] border-white/30 shadow-[3px_3px_0px_#333]">
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

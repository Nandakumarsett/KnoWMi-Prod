import { useReveal } from '../hooks/useReveal'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'UX Designer · Bangalore',
    initial: 'P',
    color: '#FF9933',
    rating: 5,
    text: "Wore this to a startup meetup and got 14 LinkedIn connections in one evening. People literally came up to scan my tee. It's the most effective networking tool I've ever owned.",
    scans: '312 scans',
  },
  {
    name: 'Rahul Verma',
    role: 'CS Student · IIT Delhi',
    initial: 'R',
    color: '#000080',
    rating: 5,
    text: 'Got the Creator plan for my college hackathon. My team lead scanned it and offered me a internship right there. Seriously no joke. KnoWMi is built different.',
    scans: '189 scans',
  },
  {
    name: 'Ananya Iyer',
    role: 'Freelance Photographer · Mumbai',
    initial: 'A',
    color: '#138808',
    rating: 5,
    text: "Updated my portfolio link three times since I got the tee — each time I just update the profile, not the tee. That's the whole magic. My QR is always current.",
    scans: '427 scans',
  },
  {
    name: 'Karan Mehta',
    role: 'Founder · Delhi',
    initial: 'K',
    color: '#9B59B6',
    rating: 5,
    text: "Ordered 25 tees for our company offsite. Every team member now has their own QR profile tee. The team dashboard makes it so easy to manage. Worth every rupee.",
    scans: '98 scans/member',
  },
  {
    name: 'Sneha Reddy',
    role: 'Content Creator · Hyderabad',
    initial: 'S',
    color: '#E07A00',
    rating: 5,
    text: "The quality of the tee itself is amazing — I've washed it 30+ times and the QR still scans perfectly. And my scan analytics show people even click my YouTube link from it!",
    scans: '891 scans',
  },
  {
    name: 'Arjun Nair',
    role: 'Product Manager · Pune',
    initial: 'A',
    color: '#1DA1F2',
    rating: 5,
    text: "At first I thought it was a gimmick. Then I wore it to a product conference and had 40+ people ask about it. My LinkedIn grew by 200 followers that week. Converted now.",
    scans: '563 scans',
  },
]

function Stars({ count }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`} role="img">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < count ? '#FF9933' : '#E8E8EE'} aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const ref = useReveal()

  return (
    <section id="reviews" className="section-pad snap-section min-h-screen flex items-center" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="tag mb-4 inline-block" style={{ background: 'var(--saffron-light)', color: 'var(--saffron)' }}>
            Reviews
          </span>
          <h2 className="font-display font-bold mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--ink)' }}>
            People Are{' '}
            <span className="italic gradient-text">Talking About It</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mb-3">
            <Stars count={5} />
            <span className="font-display font-bold text-xl" style={{ color: 'var(--ink)' }}>4.9/5</span>
            <span className="text-sm" style={{ color: 'var(--ink3)' }}>from 2,100+ reviews</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" role="list">
          {testimonials.map((t, i) => (
            <div
              key={i}
              role="listitem"
              className={`reveal reveal-delay-${(i % 3) + 1} testi-card card-lift rounded-3xl p-5 sm:p-7 relative overflow-hidden`}
              style={{ background: '#fff', border: '1px solid var(--border)' }}
            >
              {/* Quote mark */}
              <div className="absolute top-6 right-6 font-display text-6xl font-bold leading-none select-none"
                style={{ color: 'var(--border)', opacity: 0.8 }} aria-hidden="true">
                "
              </div>

              <Stars count={t.rating} />

              <blockquote className="mt-4 mb-5 text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--ink2)' }}>
                "{t.text}"
              </blockquote>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: t.color }}>
                    {t.initial}
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--ink4)' }}>{t.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold" style={{ color: 'var(--saffron)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {t.scans}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* As seen in */}
        <div className="mt-16 reveal text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--ink4)', fontFamily: 'JetBrains Mono, monospace' }}>
            Worn at
          </p>
          <div className="flex flex-wrap justify-center gap-4 items-center">
            {['IIT Delhi Techfest', 'Nasscom Startup Summit', 'Bangalore Design Week', 'Product Hunt India', 'IIM Ahmedabad'].map((v, i) => (
              <span key={i} className="px-4 py-2 rounded-full text-sm font-medium"
                style={{ background: 'var(--off)', border: '1px solid var(--border)', color: 'var(--ink3)' }}>
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

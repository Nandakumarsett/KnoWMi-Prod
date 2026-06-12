import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const faqs = [
  {
    q: 'How does the digital profile work with the T-shirt?',
    a: "Every KnoWMi tee comes with a unique QR code printed on it. When someone scans it, your digital profile opens instantly on their phone. You can update your links, bio, and socials any time from our dashboard without ever needing a new tee.",
  },
  {
    q: 'Is the T-shirt quality actually premium?',
    a: "Absolutely. We use 220 GSM heavyweight combed cotton. It’s thick, soft, and built to last. The QR code is printed using high-durability ink that stays crisp and scannable even after 50+ washes.",
  },
  {
    q: 'What is the "Founding 100" Perk?',
    a: "We are currently in our founding phase. The first 100 users who purchase a tee get 'KnoWMi Pro' free for life. This includes advanced analytics, priority support, and all future feature upgrades at no extra cost.",
  },
  {
    q: 'What if I want to upgrade to KnoWMi Pro later?',
    a: "If you aren't among the first 100, you can still upgrade your profile to 'Pro' any time for a small monthly fee (₹49/mo). However, the core identity features will always remain free with your purchase.",
  },
  {
    q: 'How long does shipping take?',
    a: "We dispatch most orders within 48 hours. Depending on your location in India, your tee should arrive within 5-7 business days. You'll receive a tracking link via WhatsApp as soon as it ships.",
  },
  {
    q: 'What is your return or replacement policy?',
    a: "We want you to love your identity. If there’s any defect in the fabric or if the QR code doesn't scan perfectly, we will send you a replacement at zero cost. No questions asked, just a photo of the issue within 7 days.",
  },
  {
    q: 'Can I order for my whole team or squad?',
    a: "Yes! Our Team plan is perfect for squads of 4 or more, priced at ₹899 per tee. Each member gets their own individual QR profile, while you get a centralized panel to manage the team brand.",
  },
]

function FAQItem({ q, a, isOpen, onClick, itemRef }) {
  return (
    <div
      ref={itemRef}
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{ border: `1px solid ${isOpen ? 'var(--saffron)' : 'rgba(255,255,255,0.05)'}`, background: isOpen ? 'rgba(249,115,22,0.1)' : '#111' }}
    >
      <button
        className="w-full flex items-start justify-between gap-4 p-6 text-left"
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <span className="font-semibold text-sm leading-snug text-white">
          {q}
        </span>
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200"
          style={{
            background: isOpen ? 'var(--saffron)' : 'rgba(255,255,255,0.1)',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
          aria-hidden="true"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={isOpen ? '#fff' : '#888'} strokeWidth="3" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </span>
      </button>

      <div
        id={`faq-answer-${index}`}
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? '300px' : '0', opacity: isOpen ? 1 : 0 }}
      >
        <p className="px-6 pb-6 text-sm leading-relaxed text-neutral-400">
          {a}
        </p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)
  const sectionRef = useRef(null)
  const leftColRef = useRef(null)
  const itemsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin/Animate left column
      gsap.fromTo(leftColRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      )

      // Stagger right column items
      gsap.fromTo(itemsRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: itemsRef.current[0],
            start: 'top 85%',
          }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="faq" className="py-32 bg-black relative overflow-hidden" ref={sectionRef}>
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-0 w-1/3 h-[600px] bg-orange-500/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column - Header (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32" ref={leftColRef}>
            <span className="tag mb-6 inline-block px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 text-[10px] font-black uppercase tracking-widest">
              FAQs
            </span>
            <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight leading-[1.05]">
              Questions? <br/>
              <span className="italic text-orange-500">We've Got Answers.</span>
            </h2>
            <p className="text-lg text-neutral-400 font-medium mb-10 max-w-md">
              Everything you need to know about the product, shipping, and the digital profile experience.
            </p>
            
            <div className="hidden lg:block">
              <p className="text-sm text-neutral-500">
                Still have questions?{' '}
                <a
                  href="https://wa.me/917981325397"
                  className="font-bold text-orange-500 hover:text-orange-400 transition-colors underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Opens in a new tab"
                >
                  Chat with us on WhatsApp →
                </a>
              </p>
            </div>
          </div>

          {/* Right Column - Accordions */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                itemRef={el => itemsRef.current[i] = el}
                q={faq.q}
                a={faq.a}
                isOpen={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
            
            <div className="lg:hidden mt-8 text-center">
              <p className="text-sm text-neutral-500">
                Still have questions?{' '}
                <a
                  href="https://wa.me/917981325397"
                  className="font-bold text-orange-500 hover:text-orange-400 transition-colors underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Opens in a new tab"
                >
                  Chat with us on WhatsApp →
                </a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

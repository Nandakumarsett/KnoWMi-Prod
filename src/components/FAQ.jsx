import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'

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

function FAQItem({ q, a, isOpen, onClick, index }) {
  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-200 reveal reveal-delay-${(index % 3) + 1}`}
      style={{ border: `1px solid ${isOpen ? 'var(--saffron)' : 'var(--border)'}`, background: isOpen ? 'var(--saffron-light)' : '#fff' }}
    >
      <button
        className="w-full flex items-start justify-between gap-4 p-6 text-left"
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <span className="font-semibold text-sm leading-snug" style={{ color: 'var(--ink)' }}>
          {q}
        </span>
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200"
          style={{
            background: isOpen ? 'var(--saffron)' : 'var(--border2)',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
          aria-hidden="true"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={isOpen ? '#fff' : 'var(--ink3)'} strokeWidth="3" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </span>
      </button>

      <div
        id={`faq-answer-${index}`}
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? '300px' : '0', opacity: isOpen ? 1 : 0 }}
      >
        <p className="px-6 pb-6 text-sm leading-relaxed" style={{ color: 'var(--ink3)' }}>
          {a}
        </p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)
  const ref = useReveal()

  return (
    <section id="faq" className="section-pad snap-section min-h-screen flex items-center" style={{ background: 'var(--off)' }} ref={ref}>
      <div className="max-w-[800px] mx-auto px-6">
        <div className="text-center mb-14 reveal">
          <span className="tag mb-4 inline-block" style={{ background: 'var(--navy-light)', color: 'var(--navy)' }}>
            FAQs
          </span>
          <h2 className="font-display font-bold mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--ink)' }}>
            Questions? <span className="italic gradient-text">We've Got Answers.</span>
          </h2>
        </div>

        <div className="flex flex-col gap-3" role="list">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              index={i}
              q={faq.q}
              a={faq.a}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>

        <div className="mt-10 text-center reveal">
          <p className="text-sm" style={{ color: 'var(--ink3)' }}>
            Still have questions?{' '}
            <a
              href="https://wa.me/917981325397"
              className="font-semibold underline underline-offset-2 transition-colors duration-200"
              style={{ color: 'var(--saffron)' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat with us on WhatsApp →
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

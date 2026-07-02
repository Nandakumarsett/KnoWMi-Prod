import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useDocumentMetadata } from '../hooks/useDocumentMetadata'
import Navbar from '../components/Navbar'
import ScrollyHome from '../components/ScrollyHome'
import { Marquee, HowItWorks, SocialProofStrip } from '../components/HowItWorks'
import Personas from '../components/Personas'
import PersonaUseCases from '../components/PersonaUseCases'
import Pricing from '../components/Pricing'
import Testimonials from '../components/Testimonials'
import SecurityPrivacy from '../components/SecurityPrivacy'
import FAQ from '../components/FAQ'
import { Footer } from '../components/Footer'
import PWABanner from '../components/PWABanner'
import AuthModal from '../components/AuthModal'
import Contact from '../components/Contact'
import Collection from '../components/Collection'
import LiveSalesPopup from '../components/LiveSalesPopup'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  
  useDocumentMetadata({
    title: 'Scan Me. Know Me. | Custom QR Identity Tees',
    description: 'India\'s first QR-enabled smart identity T-shirts. Share your social accounts, portfolio, contact card, and personal style instantly with a single scan.',
    ogImage: 'https://knowmi.in/og-image.png'
  })

  const [authOpen, setAuthOpen] = useState(false)
  const [authTab, setAuthTab] = useState('signup')
  const [showSticky, setShowSticky] = useState(false)
  const [showSalesPopup, setShowSalesPopup] = useState(false)
  const [pendingRedirect, setPendingRedirect] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentParam = urlParams.get('payment') || urlParams.get('success');
    const hasSessionSuccess = sessionStorage.getItem('knowmi_payment_success') === 'true';

    if (paymentParam === 'success' || paymentParam === 'true' || hasSessionSuccess) {
      sessionStorage.removeItem('knowmi_payment_success');
      if (urlParams.get('payment') || urlParams.get('success')) {
        urlParams.delete('payment');
        urlParams.delete('success');
        const newSearch = urlParams.toString();
        const newPath = window.location.pathname + (newSearch ? `?${newSearch}` : '');
        window.history.replaceState({}, document.title, newPath);
      }

      toast.success(
        (t) => (
          <div className="flex flex-col gap-1.5 p-1 text-left">
            <p className="font-black text-sm uppercase tracking-wide text-neutral-900">Payment Successful! 🎉</p>
            <p className="text-xs text-neutral-600 font-medium">Your phygital order is confirmed. Go to your dashboard to claim your profile.</p>
          </div>
        ),
        {
          duration: 6000,
          style: {
            border: '3px solid #000',
            padding: '16px',
            color: '#000',
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '6px 6px 0px #000',
          },
        }
      );
    }
  }, []);

  const openAuth = (tab = 'signup') => {
    setAuthTab(tab)
    setAuthOpen(true)
  }

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA if scrolled past 800px AND we haven't reached the collection section
      const collectionSection = document.getElementById('collection')
      const isPastCollection = collectionSection ? window.scrollY >= (collectionSection.offsetTop - window.innerHeight + 100) : false
      
      setShowSticky(window.scrollY > 800 && !isPastCollection)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Observe pricing section to only show sales popup there
    const pricingSection = document.getElementById('pricing')
    if (!pricingSection) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        setShowSalesPopup(entry.isIntersecting)
      })
    }, { threshold: 0.1 }) // Trigger when 10% of pricing is visible

    observer.observe(pricingSection)
    return () => observer.disconnect()
  }, [])



  // Handle post-login redirects (especially for Google Login)
  useEffect(() => {
    if (user) {
      const returnTo = localStorage.getItem('return_to')
      if (returnTo) {
        localStorage.removeItem('return_to')
        navigate(returnTo)
      }
    }
  }, [user, navigate])

  const handleAuthSuccess = () => {
    setAuthOpen(false)
    
    if (localStorage.getItem('knowmi_pending_claim')) {
      navigate('/dashboard')
      return
    }
    
    // Check for pending redirect after login (e.g. from a QR scan gate)
    const returnTo = localStorage.getItem('return_to')
    if (returnTo) {
      localStorage.removeItem('return_to')
      navigate(returnTo)
      return
    }

    if (pendingRedirect === 'store_persona') {
      setPendingRedirect(null)
    }
  }

  const handleSelectPlan = (planId) => {
    navigate('/shop')
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authType = urlParams.get('auth');
    if (authType === 'signup' || authType === 'signin') {
      openAuth(authType);
      // Clean up URL without refreshing
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Generic Cross-Page Hash Anchor Scrolling support
    if (window.location.hash) {
      const hashId = window.location.hash.substring(1);
      if (hashId === 'leaderboard') {
        navigate('/leaderboard');
      } else {
        setTimeout(() => {
          const el = document.getElementById(hashId);
          if (el) {
            if (window.lenis) {
              window.lenis.scrollTo(el, { duration: 1.2, offset: -80 });
            } else {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }, 350);
      }
    }
  }, [navigate]);

  return (
    <>
      <Navbar onOrderClick={() => handleSelectPlan('creator')} onAuthClick={openAuth} isDark={true} />

      <main id="main-content" className="w-full">
        <ScrollyHome />
        
        <HowItWorks />
        <SocialProofStrip />

        <Personas />
        <PersonaUseCases />
        <Collection onSelectDesign={(d) => navigate(`/shop?design=${d.id}`)} />
        <Pricing onPlanSelect={handleSelectPlan} />

        <Testimonials />
        <SecurityPrivacy />
        <FAQ />

        <Contact />

        <div className="snap-section-footer">
          <Footer />
        </div>
      </main>

      {/* Sticky CTA */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 transform ${showSticky ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <button
          onClick={() => handleSelectPlan('creator')}
          className="flex items-center gap-3 px-8 py-4 bg-orange-500 text-black rounded-xl font-black text-xs uppercase tracking-[0.2em] border-[3px] border-black shadow-[5px_5px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all group"
        >
          Explore Tees
          <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <PWABanner />
      <AuthModal
        open={authOpen}
        onClose={() => { setAuthOpen(false); setPendingRedirect(null) }}
        onSuccess={handleAuthSuccess}
        redirectAfter={pendingRedirect}
        defaultTab={authTab}
      />
      <LiveSalesPopup isActive={showSalesPopup} />
    </>
  )
}

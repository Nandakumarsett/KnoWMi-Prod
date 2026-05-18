import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import { Marquee, HowItWorks } from '../components/HowItWorks'
import Personas from '../components/Personas'
import PersonaUseCases from '../components/PersonaUseCases'
import Pricing from '../components/Pricing'

import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import { Footer } from '../components/Footer'
import PWABanner from '../components/PWABanner'
import AuthModal from '../components/AuthModal'
import Contact from '../components/Contact'
import Collection from '../components/Collection'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)
  const [authTab, setAuthTab] = useState('signup')
  const [showSticky, setShowSticky] = useState(false)
  const [pendingRedirect, setPendingRedirect] = useState(null)

  const navigate = useNavigate()

  const openAuth = (tab = 'signup') => {
    setAuthTab(tab)
    setAuthOpen(true)
  }

  // Task: Forced Auth on Scroll
  useEffect(() => {
    if (user) return; // Don't trigger for logged in users
    
    let timer;
    let hasTriggered = false;

    const handleScroll = () => {
      setShowSticky(window.scrollY > 800)
      
      // If user scrolls > 100px and we haven't started a timer yet
      if (window.scrollY > 100 && !timer && !hasTriggered) {
        timer = setTimeout(() => {
          if (!user && !hasTriggered) {
            openAuth('signup');
            hasTriggered = true; // Only show once per mount
          }
        }, 5000);
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timer) clearTimeout(timer)
    }
  }, [user])

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

    // New: Redirect old #leaderboard hash to the new page
    if (window.location.hash === '#leaderboard') {
      navigate('/leaderboard');
    } else if (window.location.hash === '#pricing' || window.location.href.includes('#pricing')) {
      setTimeout(() => {
        const el = document.getElementById('pricing');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 350);
    }
  }, [navigate]);

  return (
    <>
      <Navbar onOrderClick={() => handleSelectPlan('creator')} onAuthClick={openAuth} />

      <main id="main-content" className="snap-container">
        <div className="snap-section">
          <Hero onOrderClick={() => handleSelectPlan('creator')} />
          <Marquee />
        </div>

        <HowItWorks />
        <Personas />
        <PersonaUseCases />
        <Collection onSelectDesign={(d) => navigate(`/shop?design=${d.id}`)} />
        <Pricing onPlanSelect={handleSelectPlan} />

        <Testimonials />
        <FAQ />

        <Contact />

        <div className="snap-section-footer">
          <Footer />
        </div>
      </main>

      {/* Sticky CTA */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${showSticky ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <button
          onClick={() => handleSelectPlan('creator')}
          className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:bg-orange-500 transition-all group"
        >
          Explore Tees
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
    </>
  )
}

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

    // Default for any auth on home: navigate to dashboard profile tab to complete setup
    navigate('/dashboard?tab=profile')
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



      <PWABanner />
      <AuthModal
        open={authOpen}
        onClose={() => { setAuthOpen(false); setPendingRedirect(null) }}
        onSuccess={handleAuthSuccess}
        redirectAfter={pendingRedirect}
        defaultTab={authTab}
      />
      {/* Floating Identity Setup Nudge Pill for Logged-In Users without an identity */}
      {user && (!profile?.persona_data?.identities || profile.persona_data.identities.length === 0) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[140] w-full max-w-md px-4 animate-slideUp">
          <div className="bg-[#111] border-[3px] border-orange-500 p-4 rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.4)] flex items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-black font-black flex items-center justify-center text-xl shrink-0 border-2 border-black shadow-[2px_2px_0px_#000]">
                ⚡
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-wider text-white">Identity Card Inactive</p>
                <p className="text-[11px] text-neutral-400 font-medium truncate">Set up your KnoWMi profile in 60s</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard?tab=profile')}
              className="px-4 py-2.5 bg-orange-500 text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all whitespace-nowrap shrink-0"
            >
              Create Now →
            </button>
          </div>
        </div>
      )}
      <LiveSalesPopup isActive={showSalesPopup} />
    </>
  )
}

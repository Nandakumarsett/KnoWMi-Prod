import { useEffect, lazy, Suspense } from 'react'
import toast from 'react-hot-toast'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Home from './pages/Home'
import SmoothScroll from './components/SmoothScroll'
import { ErrorBoundary } from './components/ErrorBoundary'
import { posthog } from './lib/posthog'

// Lazy loaded routes for bundle size optimization
const Dashboard = lazy(() => import('./pages/Dashboard'))
const PublicProfile = lazy(() => import('./pages/PublicProfile'))
const Admin = lazy(() => import('./pages/Admin'))
const ScanHandler = lazy(() => import('./pages/ScanHandler'))
const About = lazy(() => import('./pages/About'))
const Blog = lazy(() => import('./pages/Blog'))
const PressKit = lazy(() => import('./pages/PressKit'))
const Legal = lazy(() => import('./pages/Legal'))
const TrackOrder = lazy(() => import('./pages/TrackOrder'))
const Shop = lazy(() => import('./pages/Shop'))
const Leaderboard = lazy(() => import('./pages/Leaderboard'))
const QRIntercept = lazy(() => import('./pages/QRIntercept'))
const IdentityStudio = lazy(() => import('./pages/IdentityStudio'))
const VibePage = lazy(() => import('./pages/VibePage'))
const InsightsPage = lazy(() => import('./pages/InsightsPage'))

function PageViewTracker() {
  const location = useLocation()
  useEffect(() => {
    posthog.capture('$pageview', { $current_url: window.location.href })

    // Detect acquisition source once per session (don't overwrite existing)
    if (!localStorage.getItem('knowmi_acquisition_source')) {
      const params = new URLSearchParams(window.location.search)
      const hasUtm = params.get('utm_source') || params.get('utm_medium') || params.get('utm_campaign')
      if (hasUtm) {
        localStorage.setItem('knowmi_acquisition_source', 'paid')
      } else {
        // Only set organic if not already set (scan sets it earlier)
        localStorage.setItem('knowmi_acquisition_source', 'organic')
      }
    }
  }, [location])
  return null
}

const PageLoader = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
    <div className="w-16 h-16 border-[4px] border-orange-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(249,115,22,0.4)]"></div>
    <div className="text-orange-500 font-bold uppercase tracking-widest text-xs animate-pulse">Loading KnoWMi...</div>
  </div>
)


export default function App() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        if (localStorage.getItem('knowmi_pending_claim')) {
          window.location.href = '/dashboard'
          return
        }

        const pendingAuthType = localStorage.getItem('pending_auth_type')
        localStorage.removeItem('pending_auth_type')

        // Handle explicit return_to target if set
        const returnTo = localStorage.getItem('return_to')
        if (returnTo) {
          localStorage.removeItem('return_to')
          window.location.href = returnTo
          return
        }

        // Existing user sign-in: keep them on current page / homepage
        if (pendingAuthType === 'signin') {
          if (window.location.hash.includes('access_token')) {
            window.location.hash = ''
          }
          return
        }

        // Only explicit signup intent navigates to identity creation ONCE
        if (pendingAuthType === 'signup') {
          if (window.location.hash.includes('access_token')) {
            window.location.hash = ''
          }
          window.location.href = '/dashboard?tab=profile'
          return
        }

        // OAuth redirect handling for returning users
        if (window.location.hash.includes('access_token')) {
          window.location.hash = '' // Clean the URL
          window.location.reload()
        }
      }
    })

    // Global redirect for old hash links
    // 1. Aggressive Hash Cleanup for legacy links
    const handleHash = () => {
      const hash = window.location.hash
      if (hash === '#leaderboard' || hash.includes('leaderboard')) {
        // Clear the hash and move to the clean route
        window.history.replaceState(null, '', '/leaderboard')
        window.location.reload() // Force reload to clear any cache/state
      } else if (hash && !hash.includes('access_token') && !hash.includes('pricing')) {
        // Clear any other non-auth hashes
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
      }
    }
    
    window.addEventListener('hashchange', handleHash)
    handleHash() // Initial check

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('hashchange', handleHash)
    }
  }, [])

  return (
    <ErrorBoundary>
      <SmoothScroll>
        <Router>
          <PageViewTracker />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/studio" element={<IdentityStudio />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/s/:code" element={<ScanHandler />} />
              <Route path="/p/:username" element={<PublicProfile />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/press" element={<PressKit />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/track" element={<TrackOrder />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/q/:token" element={<QRIntercept />} />
              <Route path="/dashboard/vibe" element={<VibePage />} />
              <Route path="/insights" element={<InsightsPage />} />
              {/* Catch-all route to prevent blank pages on invalid URLs */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </SmoothScroll>
    </ErrorBoundary>
  )
}

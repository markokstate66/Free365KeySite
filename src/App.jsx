import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { initAnalytics, trackPageView, initScrollTracking, resetSectionTracking } from './utils/analytics'

// Critical pages - loaded immediately
import HomePage from './pages/HomePage'

// Lazy loaded pages - loaded on demand for better performance
const AdminPage = lazy(() => import('./pages/AdminPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'))
const FAQPage = lazy(() => import('./pages/FAQPage'))
const UnsubscribePage = lazy(() => import('./pages/UnsubscribePage'))
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'))
const ComparePage = lazy(() => import('./pages/ComparePage'))

// Loading fallback component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    color: '#666'
  }}>
    Loading...
  </div>
)

function App() {
  const location = useLocation()

  // Initialize analytics on mount
  useEffect(() => {
    const cleanup = initAnalytics()
    return cleanup
  }, [])

  // Track page views on route change
  useEffect(() => {
    trackPageView(document.title, location.pathname)
    initScrollTracking()
    resetSectionTracking()
  }, [location.pathname])

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/unsubscribe" element={<UnsubscribePage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>
    </Suspense>
  )
}

export default App

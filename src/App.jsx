import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { initAnalytics, trackPageView, initScrollTracking, resetSectionTracking } from './utils/analytics'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import HowItWorksPage from './pages/HowItWorksPage'
import FAQPage from './pages/FAQPage'
import WinnersPage from './pages/WinnersPage'
import BlogPage from './pages/BlogPage'
import UnsubscribePage from './pages/UnsubscribePage'
import VerifyEmailPage from './pages/VerifyEmailPage'

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
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/winners" element={<WinnersPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/unsubscribe" element={<UnsubscribePage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
    </Routes>
  )
}

export default App

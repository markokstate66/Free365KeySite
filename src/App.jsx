import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import HowItWorksPage from './pages/HowItWorksPage'
import FAQPage from './pages/FAQPage'
import WinnersPage from './pages/WinnersPage'
import BlogPage from './pages/BlogPage'

function App() {
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
    </Routes>
  )
}

export default App

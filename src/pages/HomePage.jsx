import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import RegistrationForm from '../components/RegistrationForm'
import Newsletter from '../components/Newsletter'
import RewardedAd from '../components/RewardedAd'
import ContactForm from '../components/ContactForm'
import SEO from '../components/SEO'

function HomePage() {
  const [searchParams] = useSearchParams()
  const referredBy = searchParams.get('ref') || ''

  const [registered, setRegistered] = useState(false)
  const [registrationData, setRegistrationData] = useState(null)
  const [showRewardedAd, setShowRewardedAd] = useState(false)
  const [totalEntries, setTotalEntries] = useState(0)
  const [activeAdCount, setActiveAdCount] = useState(0)
  const [isReturningUser, setIsReturningUser] = useState(false)
  const [resendStatus, setResendStatus] = useState(null) // null, 'sending', 'sent', 'error'
  const [referralCode, setReferralCode] = useState('')
  const [referralCount, setReferralCount] = useState(0)
  const [referralEntries, setReferralEntries] = useState(0)
  const [copied, setCopied] = useState(false)

  const handleSuccess = (data) => {
    setRegistered(true)
    setRegistrationData(data)
    setTotalEntries(data.totalEntries || 0)
    setActiveAdCount(data.adCount || 0)
    setReferralCode(data.referralCode || '')
    setReferralCount(data.referralCount || 0)
    setReferralEntries(data.referralEntries || 0)
    setIsReturningUser(false)
  }

  const handleAlreadyRegistered = async (email) => {
    // Look up their existing registration
    try {
      const response = await fetch('/api/lookup-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        const data = await response.json()
        setRegistered(true)
        setRegistrationData(data)
        setTotalEntries(data.totalEntries || 0)
        setActiveAdCount(data.adCount || 0)
        setReferralCode(data.referralCode || '')
        setReferralCount(data.referralCount || 0)
        setReferralEntries(data.referralEntries || 0)
        setIsReturningUser(true)
      }
    } catch (err) {
      console.error('Lookup error:', err)
    }
  }

  const handleBonusComplete = (data) => {
    if (data.totalEntries !== undefined) {
      setTotalEntries(data.totalEntries)
    }
    if (data.adCount !== undefined) {
      setActiveAdCount(data.adCount)
    }
  }

  const handleResendVerification = async () => {
    if (!registrationData?.email) return
    setResendStatus('sending')
    try {
      const response = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registrationData.email })
      })
      const data = await response.json()
      if (response.ok) {
        setResendStatus('sent')
      } else {
        setResendStatus('error')
      }
    } catch (err) {
      setResendStatus('error')
    }
  }

  return (
    <div>
      <SEO
        path="/"
        description="Register for a chance to win a FREE Microsoft 365 license key. Enter our monthly giveaway today - no purchase necessary!"
      />
      <Header />

      <section className="hero">
        <div className="container">
          <h1>Win a FREE Microsoft 365 License!</h1>
          <p>
            Register now for your chance to win a free Microsoft 365 trial.
            <br />
            Winners drawn on the 1st of every month!
          </p>
        </div>
      </section>

      <section className="form-section">
        {!registered ? (
          <>
            <h2>Enter the Giveaway</h2>
            <RegistrationForm onSuccess={handleSuccess} onAlreadyRegistered={handleAlreadyRegistered} referredBy={referredBy} />
          </>
        ) : (
          <div className="success-message" style={{ padding: '20px' }}>
            {/* Status line */}
            <p style={{ margin: '0 0 15px 0', fontSize: '0.95rem' }}>
              {registrationData?.isVerified ? (
                <><strong>{totalEntries} entries</strong> - You're in, {registrationData?.firstName}!</>
              ) : (
                <>
                  <span style={{ color: '#fbbf24' }}>Check your email to verify</span>
                  {resendStatus !== 'sent' && (
                    <button onClick={handleResendVerification} disabled={resendStatus === 'sending'} style={{ background: 'none', border: 'none', color: '#a5b4fc', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem', marginLeft: '8px' }}>
                      {resendStatus === 'sending' ? '...' : 'resend'}
                    </button>
                  )}
                  {resendStatus === 'sent' && <span style={{ color: '#4ade80', marginLeft: '8px' }}>Sent!</span>}
                </>
              )}
            </p>

            {/* Full-width action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
              <button onClick={() => setShowRewardedAd(true)} style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', width: '100%' }}>
                Watch Ad for +2 Entries
              </button>
              {referralCode && (
                <button onClick={async () => { await navigator.clipboard.writeText(`https://www.free365key.com/?ref=${referralCode}`); setCopied(true); setTimeout(() => setCopied(false), 2000) }} style={{ background: copied ? '#10b981' : '#6366f1', color: 'white', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', width: '100%' }}>
                  {copied ? 'Link Copied!' : 'Copy Referral Link +10'}
                </button>
              )}
              {referralCode && (() => {
                const url = encodeURIComponent(`https://www.free365key.com/?ref=${referralCode}`)
                const txt = encodeURIComponent("Win a FREE Microsoft 365 license!")
                return (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a href={`https://twitter.com/intent/tweet?text=${txt}&url=${url}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#1DA1F2', color: 'white', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', textAlign: 'center' }}>Twitter</a>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#4267B2', color: 'white', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', textAlign: 'center' }}>Facebook</a>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#0077B5', color: 'white', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600', textAlign: 'center' }}>LinkedIn</a>
                  </div>
                )
              })()}
            </div>
          </div>
        )}
      </section>

      <section className="features">
        <h2>Why Microsoft 365?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📧</div>
            <h3>Professional Email</h3>
            <p>Get a custom email address with 50GB mailbox storage and advanced security features.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Office Apps</h3>
            <p>Access Word, Excel, PowerPoint, and more on all your devices with 1TB cloud storage.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Team Collaboration</h3>
            <p>Work together seamlessly with Microsoft Teams, SharePoint, and real-time co-authoring.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Enterprise Security</h3>
            <p>Protect your business with advanced threat protection and data loss prevention.</p>
          </div>
        </div>
      </section>

      <section className="features contact-section" style={{ background: '#f8f9fa' }}>
        <h2>Need More Licenses?</h2>
        <div className="container" style={{ maxWidth: '600px' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '30px', color: '#666', textAlign: 'center' }}>
            We offer competitive pricing on Microsoft 365 licenses for businesses of all sizes.
            Fill out the form below for volume discounts and enterprise packages.
          </p>
          <ContactForm />
        </div>
      </section>

      <section className="newsletter-section">
        <div className="container">
          <Newsletter />
        </div>
      </section>

      <section className="disclaimer" style={{ background: '#f8f9fa', padding: '20px 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6' }}>
            *Giveaway is limited to US residents only. Prize is a free 30-day Microsoft 365 license for 1 user.
            Winner must join our Cloud Solution Provider (CSP) reseller network to receive their license.
            No purchase necessary. Void where prohibited. <strong>Base registration never expires. Bonus entries from watching ads are valid for 3 monthly drawings. Winners are drawn on the 1st of each month.</strong> See <a href="/terms" style={{ color: '#6366f1' }}>Terms & Conditions</a> for full details.
          </p>
        </div>
      </section>

      <Footer />

      {showRewardedAd && registrationData && (
        <RewardedAd
          registrationId={registrationData.id}
          onComplete={handleBonusComplete}
          onClose={() => setShowRewardedAd(false)}
        />
      )}
    </div>
  )
}

export default HomePage

import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import RegistrationForm from '../components/RegistrationForm'
import Newsletter from '../components/Newsletter'
import RewardedAd from '../components/RewardedAd'
import ContactForm from '../components/ContactForm'
import ShareReferral from '../components/ShareReferral'
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
          <div className="success-message">
            <h3>{isReturningUser ? 'Welcome Back!' : "Almost There!"}</h3>
            <p>
              {isReturningUser ? (
                registrationData?.isVerified ? (
                  <>
                    Good to see you again, {registrationData?.firstName}!
                    <br />
                    You're in the giveaway with <strong>5 base entries</strong>. Watch an ad below for <strong>+2 bonus entries</strong>!
                  </>
                ) : (
                  <>
                    Welcome back, {registrationData?.firstName}!
                    <br />
                    <strong style={{ color: '#fbbf24' }}>Your email isn't verified yet.</strong> Check your inbox or spam folder for the confirmation link.
                    <br />
                    <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Verify to unlock 5 base entries!</span>
                  </>
                )
              ) : (
                <>
                  Thank you for registering, {registrationData?.firstName}!
                  <br />
                  <strong style={{ color: '#fbbf24' }}>Please check your email ({registrationData?.email}) to confirm your entry.</strong>
                  <br />
                  <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Verify your email to unlock 5 base entries!</span>
                </>
              )}
            </p>
            {!registrationData?.isVerified && (
              <div style={{ marginTop: '15px' }}>
                {resendStatus === 'sent' ? (
                  <p style={{ color: '#4ade80', fontSize: '0.9rem' }}>Verification email sent! Check your inbox.</p>
                ) : resendStatus === 'error' ? (
                  <p style={{ color: '#f87171', fontSize: '0.9rem' }}>Failed to send. Please try again.</p>
                ) : (
                  <button
                    onClick={handleResendVerification}
                    disabled={resendStatus === 'sending'}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.5)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: resendStatus === 'sending' ? 'wait' : 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    {resendStatus === 'sending' ? 'Sending...' : "Didn't get the email? Resend"}
                  </button>
                )}
              </div>
            )}
            <p style={{ marginTop: '10px', fontSize: '0.85rem', opacity: 0.7 }}>
              {!registrationData?.isVerified && "Tip: Check your spam folder if you don't see it."}
            </p>
            <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 10px 0' }}>
                Total Entries: {totalEntries}
              </p>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                <p style={{ margin: '4px 0' }}>
                  Base entries: {registrationData?.isVerified ? 5 : 0} {!registrationData?.isVerified && <span style={{ color: '#fbbf24' }}>(verify email to unlock)</span>}
                </p>
                <p style={{ margin: '4px 0' }}>
                  Ad bonus: {activeAdCount} ad{activeAdCount !== 1 ? 's' : ''} × 2 = {activeAdCount * 2} entries
                </p>
                {referralEntries > 0 && (
                  <p style={{ margin: '4px 0', color: '#4ade80' }}>
                    Referral bonus: {referralCount} referral{referralCount !== 1 ? 's' : ''} × 10 = {referralEntries} entries
                  </p>
                )}
                {activeAdCount > 0 && (
                  <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', opacity: 0.7 }}>
                    Each ad bonus is valid for 3 monthly drawings
                  </p>
                )}
              </div>
            </div>
            {!isReturningUser && (
              <p style={{ marginTop: '10px', opacity: 0.9, fontSize: '0.9rem' }}>
                Entry ID: {registrationData?.id}
              </p>
            )}
            <div style={{ marginTop: '25px', padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
              <p style={{ margin: '0 0 20px 0', fontWeight: 'bold', fontSize: '1.1rem' }}>
                {isReturningUser ? 'Earn more entries!' : 'Want more chances to win?'}
              </p>

              {/* Two options side by side on larger screens */}
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* Watch Ad Option */}
                <div style={{
                  flex: '1 1 200px',
                  maxWidth: '280px',
                  padding: '20px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  borderRadius: '10px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: '0 0 10px 0', fontWeight: '600', color: '#4ade80' }}>Watch Ads</p>
                  <p style={{ margin: '0 0 15px 0', fontSize: '0.85rem', opacity: 0.9 }}>
                    +2 entries per ad<br/>
                    <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Valid for 3 drawings</span>
                  </p>
                  <button
                    className="submit-btn"
                    onClick={() => setShowRewardedAd(true)}
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', width: '100%', margin: 0 }}
                  >
                    Watch Ad
                  </button>
                </div>

                {/* Share Option */}
                {referralCode && (
                  <div style={{
                    flex: '1 1 200px',
                    maxWidth: '280px',
                    padding: '20px',
                    background: 'rgba(99, 102, 241, 0.2)',
                    borderRadius: '10px',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    textAlign: 'center'
                  }}>
                    <p style={{ margin: '0 0 10px 0', fontWeight: '600', color: '#a5b4fc' }}>Share & Refer</p>
                    <p style={{ margin: '0 0 15px 0', fontSize: '0.85rem', opacity: 0.9 }}>
                      +10 entries per referral<br/>
                      <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Valid for 6 drawings</span>
                    </p>
                    <button
                      className="submit-btn"
                      onClick={() => document.getElementById('share-section').scrollIntoView({ behavior: 'smooth' })}
                      style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', width: '100%', margin: 0 }}
                    >
                      Share Link
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Full Referral Share Section */}
            {referralCode && (
              <div id="share-section">
                <ShareReferral
                  referralCode={referralCode}
                  referralCount={referralCount}
                  referralEntries={referralEntries}
                />
              </div>
            )}
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

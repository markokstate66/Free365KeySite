import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import RegistrationForm from '../components/RegistrationForm'
import Newsletter from '../components/Newsletter'
import RewardedAd from '../components/RewardedAd'
import ContactForm from '../components/ContactForm'

function HomePage() {
  const [registered, setRegistered] = useState(false)
  const [registrationData, setRegistrationData] = useState(null)
  const [showRewardedAd, setShowRewardedAd] = useState(false)
  const [totalEntries, setTotalEntries] = useState(1)
  const [isReturningUser, setIsReturningUser] = useState(false)

  const handleSuccess = (data) => {
    setRegistered(true)
    setRegistrationData(data)
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
        setTotalEntries(data.totalEntries || 1)
        setIsReturningUser(true)
      }
    } catch (err) {
      console.error('Lookup error:', err)
    }
  }

  const handleBonusComplete = (data) => {
    if (data.totalEntries) {
      setTotalEntries(data.totalEntries)
    }
  }

  return (
    <div>
      <Header />

      <section className="hero">
        <div className="container">
          <h1>Win a FREE Microsoft 365 License!*</h1>
          <p>
            Register now for your chance to win a genuine Microsoft 365 license key.
            <br />
            Winners drawn on the 1st of every month!
            <br />
            <small style={{ opacity: 0.9 }}>*Open to US residents only. Bonus entries from ads valid for 90 days.</small>
          </p>
        </div>
      </section>

      <section className="form-section">
        {!registered ? (
          <>
            <h2>Enter the Giveaway</h2>
            <RegistrationForm onSuccess={handleSuccess} onAlreadyRegistered={handleAlreadyRegistered} />
          </>
        ) : (
          <div className="success-message">
            <h3>{isReturningUser ? 'Welcome Back!' : "You're Entered!"}</h3>
            <p>
              {isReturningUser ? (
                <>
                  Good to see you again, {registrationData?.firstName}!
                  <br />
                  You're already in the giveaway. Watch an ad below to earn bonus entries!
                </>
              ) : (
                <>
                  Thank you for registering, {registrationData?.firstName}!
                  <br />
                  We'll contact you at {registrationData?.email} if you're selected as a winner.
                </>
              )}
            </p>
            <p style={{ marginTop: '10px', fontSize: '1.1rem', fontWeight: 'bold' }}>
              Total Entries: {totalEntries}
            </p>
            {!isReturningUser && (
              <p style={{ marginTop: '10px', opacity: 0.9, fontSize: '0.9rem' }}>
                Entry ID: {registrationData?.id}
              </p>
            )}
            <div style={{ marginTop: '25px', padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
              <p style={{ margin: '0 0 15px 0', fontWeight: 'bold' }}>
                {isReturningUser ? 'Earn more entries!' : 'Want more chances to win?'}
              </p>
              <button
                className="submit-btn"
                onClick={() => setShowRewardedAd(true)}
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
              >
                Watch Ad for +1 Entry
              </button>
              <p style={{ margin: '10px 0 0 0', fontSize: '0.8rem', opacity: 0.8 }}>
                Watch as many ads as you want - each one earns another entry!
              </p>
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
            No purchase necessary. Void where prohibited. <strong>Base registration never expires. Bonus entries from watching ads are valid for 90 days. Winners are drawn monthly.</strong> See <a href="/terms" style={{ color: '#6366f1' }}>Terms & Conditions</a> for full details.
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

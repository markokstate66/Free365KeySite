import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import RegistrationForm from '../components/RegistrationForm'
import Newsletter from '../components/Newsletter'
import SEO from '../components/SEO'

function HomePage() {
  const [registered, setRegistered] = useState(false)
  const [registrationData, setRegistrationData] = useState(null)
  const [resendStatus, setResendStatus] = useState(null) // null, 'sending', 'sent', 'error'

  const handleSuccess = (data) => {
    setRegistered(true)
    setRegistrationData(data)
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
      }
    } catch (err) {
      console.error('Lookup error:', err)
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
        title="Free365Key - Microsoft 365 Resources, Guides & Free License Giveaway"
        path="/"
        description="Your complete resource for Microsoft 365 licensing. Compare plans, find the right license, and enter our monthly giveaway for a free Microsoft 365 license."
      />
      <Header />

      <section className="hero">
        <div className="container">
          <h1>Your Microsoft 365 Resource Hub</h1>
          <p>
            Expert guides, plan comparisons, and tools to help you choose the right Microsoft 365 license.
            <br />
            Plus enter our monthly giveaway for a free license!
          </p>
        </div>
      </section>

      {/* Quick Links Section */}
      <section style={{ background: '#f8f9fa', padding: '30px 20px' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <a href="/licensing-guides" style={{ background: 'white', padding: '20px', borderRadius: '12px', textDecoration: 'none', color: 'inherit', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', textAlign: 'center', transition: 'transform 0.2s' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📚</div>
              <h3 style={{ margin: '0 0 5px', fontSize: '1rem' }}>Licensing Guide</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Compare all M365 plans</p>
            </a>
            <a href="/plan-finder" style={{ background: 'white', padding: '20px', borderRadius: '12px', textDecoration: 'none', color: 'inherit', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', textAlign: 'center', transition: 'transform 0.2s' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎯</div>
              <h3 style={{ margin: '0 0 5px', fontSize: '1rem' }}>Plan Finder</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Find your perfect plan</p>
            </a>
            <a href="/compare" style={{ background: 'white', padding: '20px', borderRadius: '12px', textDecoration: 'none', color: 'inherit', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', textAlign: 'center', transition: 'transform 0.2s' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚖️</div>
              <h3 style={{ margin: '0 0 5px', fontSize: '1rem' }}>Direct vs CSP</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Compare buying options</p>
            </a>
            <a href="/giveaway/faq" style={{ background: 'white', padding: '20px', borderRadius: '12px', textDecoration: 'none', color: 'inherit', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', textAlign: 'center', transition: 'transform 0.2s' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>❓</div>
              <h3 style={{ margin: '0 0 5px', fontSize: '1rem' }}>Giveaway FAQ</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Common questions</p>
            </a>
          </div>
        </div>
      </section>

      {/* Giveaway + Newsletter Side by Side */}
      <section style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '50px 20px' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            alignItems: 'start'
          }}>
            {/* Giveaway Form */}
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '30px',
              color: 'white'
            }}>
              {!registered ? (
                <>
                  <h2 style={{ margin: '0 0 10px', fontSize: '1.5rem', textAlign: 'center' }}>Free License Giveaway</h2>
                  <p style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.8)', textAlign: 'center', fontSize: '0.95rem' }}>
                    Enter to win a free Microsoft 365 Business Basic license. Winners drawn monthly!
                  </p>
                  <RegistrationForm onSuccess={handleSuccess} onAlreadyRegistered={handleAlreadyRegistered} />
                </>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ marginBottom: '10px' }}>
                    {registrationData?.isVerified ? `You're In, ${registrationData?.firstName}!` : 'Almost There!'}
                  </h3>
                  {!registrationData?.isVerified ? (
                    <p style={{ margin: '0', fontSize: '0.95rem' }}>
                      <span style={{ color: '#fbbf24' }}>Check your email</span> to verify your registration
                      {resendStatus !== 'sent' && (
                        <button onClick={() => handleResendVerification()} disabled={resendStatus === 'sending'} style={{ background: 'none', border: 'none', color: '#a5b4fc', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem', marginLeft: '8px' }}>
                          {resendStatus === 'sending' ? '...' : 'resend'}
                        </button>
                      )}
                      {resendStatus === 'sent' && <span style={{ color: '#4ade80', marginLeft: '8px' }}>Sent!</span>}
                    </p>
                  ) : (
                    <p style={{ margin: '0', fontSize: '1rem', color: 'rgba(255,255,255,0.9)' }}>
                      You're entered in all future monthly drawings. Winners are notified by email on the 1st of each month. Good luck!
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Newsletter */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              color: '#1a1a1a'
            }}>
              <Newsletter />
            </div>
          </div>
        </div>
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

      <section className="disclaimer" style={{ background: '#f8f9fa', padding: '20px 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.6' }}>
            *Giveaway is limited to US residents only. Prize is a free 30-day Microsoft 365 license for 1 user.
            Winner must join our Cloud Solution Provider (CSP) reseller network to receive their license.
            No purchase necessary. Void where prohibited. <strong>Winners are drawn on the 1st of each month.</strong> See <a href="/terms" style={{ color: '#6366f1' }}>Terms & Conditions</a> for full details.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage

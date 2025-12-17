import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import RegistrationForm from '../components/RegistrationForm'
import Newsletter from '../components/Newsletter'

function HomePage() {
  const [registered, setRegistered] = useState(false)
  const [registrationData, setRegistrationData] = useState(null)

  const handleSuccess = (data) => {
    setRegistered(true)
    setRegistrationData(data)
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
            Winners selected every month through random drawing!
            <br />
            <small style={{ opacity: 0.9 }}>*Open to US residents only</small>
          </p>
        </div>
      </section>

      <section className="form-section">
        {!registered ? (
          <>
            <h2>Enter the Giveaway</h2>
            <RegistrationForm onSuccess={handleSuccess} />
          </>
        ) : (
          <div className="success-message">
            <h3>You're Entered!</h3>
            <p>
              Thank you for registering, {registrationData?.firstName}!
              <br />
              We'll contact you at {registrationData?.email} if you're selected as a winner.
            </p>
            <p style={{ marginTop: '20px', opacity: 0.9 }}>
              Entry ID: {registrationData?.id}
            </p>
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

      <section className="features" style={{ background: '#f8f9fa' }}>
        <h2>Need More Licenses?</h2>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#666' }}>
            We offer competitive pricing on Microsoft 365 licenses for businesses of all sizes.
            Contact us for volume discounts and special enterprise packages.
          </p>
          <a
            href="mailto:sales@free365key.com"
            className="submit-btn"
            style={{ display: 'inline-block', textDecoration: 'none', maxWidth: '300px' }}
          >
            Contact Sales
          </a>
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
            *Giveaway is limited to US residents only. Prize is a free 30-day Microsoft 365 license key for 1 user.
            Cloud Solution Provider (CSP) agreement required to redeem. Winner is responsible for any applicable taxes.
            No purchase necessary. Void where prohibited. See <a href="/terms" style={{ color: '#6366f1' }}>Terms & Conditions</a> for full details.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage

import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AdBanner from '../components/AdBanner'
import RegistrationForm from '../components/RegistrationForm'

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
          <h1>Win a FREE Microsoft 365 License!</h1>
          <p>
            Register now for your chance to win a genuine Microsoft 365 license key.
            <br />
            Winners selected every month through random drawing!
          </p>
        </div>
      </section>

      <AdBanner slot="top-banner" format="horizontal" />

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

      <AdBanner slot="middle-banner" format="horizontal" />

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

      <AdBanner slot="bottom-banner" format="horizontal" />

      <Footer />
    </div>
  )
}

export default HomePage

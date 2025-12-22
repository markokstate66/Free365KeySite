import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

function HowItWorksPage() {
  return (
    <div>
      <SEO
        title="How It Works"
        path="/how-it-works"
        description="Learn how to enter our free Microsoft 365 giveaway. Simple 5-step process: register, verify email, earn bonus entries, and win!"
      />
      <Header />

      <section className="hero" style={{ padding: '60px 20px' }}>
        <div className="container">
          <h1>How It Works</h1>
          <p>Your simple guide to entering and winning a free Microsoft 365 license</p>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Register Your Entry</h3>
                <p>
                  Fill out the simple registration form on our homepage with your name and email address.
                  Make sure to use a valid email as this is how we'll contact winners.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Confirm Your Email</h3>
                <p>
                  Check your inbox for a confirmation email. Click the link to verify your entry
                  and unlock <strong>5 base entries</strong> in the drawing.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Earn Bonus Entries</h3>
                <p>
                  Watch short ads to earn <strong>+2 bonus entries</strong> each! Each bonus is valid for the next
                  <strong> 3 monthly drawings</strong>, so keep watching to maximize your chances.
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Wait for the Drawing</h3>
                <p>
                  We conduct random drawings every month. All verified entries from that month
                  are included in the pool. The more months you're registered, the more chances you have!
                </p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Claim Your Prize</h3>
                <p>
                  Winners are notified via email with instructions to claim their Microsoft 365 trial.
                  You'll have 30 days to respond and claim your prize.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>What You'll Win</h2>
          <div className="prize-details">
            <div className="prize-card">
              <h3>Microsoft 365 Business Basic</h3>
              <ul>
                <li>Web & mobile Office apps (Word, Excel, PowerPoint, Outlook)</li>
                <li>1 TB OneDrive cloud storage</li>
                <li>50 GB Exchange email mailbox</li>
                <li>SharePoint file sharing</li>
                <li>1 month subscription</li>
              </ul>
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '15px' }}>
                *Does not include desktop Office apps or Microsoft Teams
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Ready to Enter?</h2>
          <p style={{ marginBottom: '30px', color: '#666' }}>
            It only takes 30 seconds to register for your chance to win!
          </p>
          <Link to="/" className="submit-btn" style={{ display: 'inline-block', textDecoration: 'none', maxWidth: '300px' }}>
            Enter Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HowItWorksPage

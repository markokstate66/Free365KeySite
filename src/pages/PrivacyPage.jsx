import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

function PrivacyPage() {
  return (
    <div>
      <SEO
        title="Privacy Policy"
        path="/privacy"
        description="Privacy policy for Free365Key. Learn how we collect, use, and protect your personal information when you enter our Microsoft 365 giveaway."
      />
      <Header />

      <div className="container" style={{ padding: '60px 20px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '50px', maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '30px' }}>Privacy Policy</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>Last updated: {new Date().toLocaleDateString()}</p>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>1. Information We Collect</h2>
            <p style={{ marginBottom: '10px' }}>When you register for our Microsoft 365 giveaway, we collect:</p>
            <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
              <li>First and last name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Company name (optional)</li>
              <li>Job title (optional)</li>
              <li>Marketing communication preferences</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>2. How We Use Your Information</h2>
            <p style={{ marginBottom: '10px' }}>We use the information we collect to:</p>
            <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
              <li>Process your giveaway entry</li>
              <li>Contact you if you win</li>
              <li>Send promotional materials about Microsoft licensing (if you opted in)</li>
              <li>Improve our services and website</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>3. Information Sharing</h2>
            <p>
              We may share your information with trusted third-party partners for marketing purposes.
              We do not sell your personal information. We may share data with service providers who
              assist us in operating our website and conducting our business.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information.
              However, no method of transmission over the Internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>5. Your Rights</h2>
            <p style={{ marginBottom: '10px' }}>You have the right to:</p>
            <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
              <li>Access your personal data</li>
              <li>Request correction of your data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>6. Cookies and Advertising</h2>
            <p>
              Our website uses cookies and may display third-party advertisements. These advertisers
              may use cookies to track your browsing habits. You can manage cookie preferences
              through your browser settings.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>7. Contact Us</h2>
            <p>
              For privacy-related inquiries, please use our{' '}
              <a href="/#contact" style={{ color: '#00a4ef' }}>
                contact form
              </a>{' '}
              and select "Legal" as the reason for your inquiry.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PrivacyPage

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
            <h2 style={{ marginBottom: '15px' }}>6. Cookies and Tracking Technologies</h2>
            <p style={{ marginBottom: '15px' }}>
              Our website uses cookies and similar tracking technologies to enhance your experience,
              analyze site traffic, and serve personalized advertisements.
            </p>
            <h3 style={{ marginBottom: '10px', fontSize: '1.1rem' }}>Google Analytics</h3>
            <p style={{ marginBottom: '15px' }}>
              We use Google Analytics to understand how visitors interact with our website. Google Analytics
              uses cookies to collect information about your use of the site, including your IP address.
              This information is transmitted to and stored by Google. For more information, see{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#00a4ef' }}>
                Google's Privacy Policy
              </a>.
            </p>
            <h3 style={{ marginBottom: '10px', fontSize: '1.1rem' }}>Google AdSense</h3>
            <p style={{ marginBottom: '15px' }}>
              We use Google AdSense to display advertisements on our website. Google AdSense uses cookies
              to serve ads based on your prior visits to our website or other websites. Google's use of
              advertising cookies enables it and its partners to serve ads based on your visit to our
              site and/or other sites on the Internet.
            </p>
            <p style={{ marginBottom: '15px' }}>
              You may opt out of personalized advertising by visiting{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: '#00a4ef' }}>
                Google Ads Settings
              </a>. Alternatively, you can opt out of third-party vendors' use of cookies by visiting{' '}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: '#00a4ef' }}>
                www.aboutads.info
              </a>.
            </p>
            <h3 style={{ marginBottom: '10px', fontSize: '1.1rem' }}>Managing Cookies</h3>
            <p>
              You can control and manage cookies through your browser settings. Please note that
              disabling cookies may affect the functionality of this website and many other websites
              you visit.
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

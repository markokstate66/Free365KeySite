import Header from '../components/Header'
import Footer from '../components/Footer'

function TermsPage() {
  return (
    <div>
      <Header />

      <div className="container" style={{ padding: '60px 20px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '50px', maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '30px' }}>Terms of Service</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>Last updated: {new Date().toLocaleDateString()}</p>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by these Terms
              of Service. If you do not agree to these terms, please do not use our website.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>2. Giveaway Rules</h2>
            <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
              <li>One entry per person</li>
              <li>Must be 18 years or older to participate</li>
              <li>Winners are selected randomly</li>
              <li>Prizes are non-transferable and cannot be exchanged for cash</li>
              <li>We reserve the right to disqualify entries at our discretion</li>
              <li>Winners will be notified via email</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>3. Eligibility</h2>
            <p>
              The giveaway is open to legal residents where not prohibited by law. Employees of
              our company and their immediate family members are not eligible to participate.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>4. Microsoft 365 Licenses</h2>
            <p>
              Microsoft 365 licenses provided through this giveaway are genuine and obtained through
              authorized channels. The licenses are subject to Microsoft's terms of service. We are
              not affiliated with Microsoft Corporation.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>5. Limitation of Liability</h2>
            <p>
              We shall not be liable for any indirect, incidental, special, consequential, or
              punitive damages arising out of your use of this website or participation in the
              giveaway.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>6. User Conduct</h2>
            <p style={{ marginBottom: '10px' }}>You agree not to:</p>
            <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
              <li>Submit false or misleading information</li>
              <li>Create multiple accounts to increase chances of winning</li>
              <li>Use automated systems to submit entries</li>
              <li>Interfere with the proper functioning of the website</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>7. Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, and software, is our
              property or the property of our licensors and is protected by intellectual property
              laws. Microsoft and Microsoft 365 are trademarks of Microsoft Corporation.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting. Your continued use of the website constitutes acceptance
              of the modified terms.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>9. Contact</h2>
            <p>
              For questions about these terms, contact us at:{' '}
              <a href="mailto:legal@free365key.com" style={{ color: '#00a4ef' }}>
                legal@free365key.com
              </a>
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default TermsPage

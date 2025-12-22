import Header from '../components/Header'
import Footer from '../components/Footer'

function ComparePage() {
  return (
    <div>
      <Header />

      <section className="hero" style={{ padding: '60px 20px' }}>
        <div className="container">
          <h1>Microsoft Direct vs CSP</h1>
          <p>Understanding your options for Microsoft 365 subscriptions</p>
        </div>
      </section>

      <section className="content-section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2>What's the Difference?</h2>
          <p style={{ marginBottom: '30px', color: '#666', lineHeight: '1.8' }}>
            When purchasing Microsoft 365, you have two main options: buying directly from Microsoft
            or through a Cloud Solution Provider (CSP). Both give you access to the same Microsoft
            products, but the experience and benefits differ significantly.
          </p>

          <div className="compare-grid">
            <div className="compare-card">
              <div className="compare-card-header direct">Microsoft Direct</div>
              <ul className="compare-list">
                <li><span className="compare-label">Pricing:</span> Fixed retail pricing</li>
                <li><span className="compare-label">Billing:</span> Monthly/Annual to Microsoft</li>
                <li><span className="compare-label">Support:</span> Microsoft phone/web support</li>
                <li><span className="compare-label">Setup:</span> Self-service documentation</li>
                <li><span className="compare-label">Management:</span> You manage everything</li>
                <li><span className="compare-label">Flexibility:</span> Fixed subscription tiers</li>
                <li><span className="compare-label">Extras:</span> None</li>
              </ul>
            </div>
            <div className="compare-card highlighted">
              <div className="compare-card-header csp">CSP Partner</div>
              <ul className="compare-list">
                <li><span className="compare-label">Pricing:</span> Often discounted</li>
                <li><span className="compare-label">Billing:</span> Flexible partner terms</li>
                <li><span className="compare-label">Support:</span> Personal partner support</li>
                <li><span className="compare-label">Setup:</span> Hands-on assistance</li>
                <li><span className="compare-label">Management:</span> Partner can manage for you</li>
                <li><span className="compare-label">Flexibility:</span> Mix-and-match options</li>
                <li><span className="compare-label">Extras:</span> Training, migration, consulting</li>
              </ul>
            </div>
          </div>

          <h2>Microsoft Direct</h2>
          <p style={{ marginBottom: '20px', color: '#666', lineHeight: '1.8' }}>
            Purchasing directly from Microsoft at <a href="https://www.microsoft.com/microsoft-365" target="_blank" rel="noopener noreferrer">microsoft.com</a> is
            straightforward and gives you a direct relationship with Microsoft. You'll pay retail
            prices and manage your own subscriptions through the Microsoft 365 admin center.
          </p>

          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ color: '#28a745', marginBottom: '10px' }}>Pros:</h4>
            <ul style={{ color: '#666', lineHeight: '1.8', paddingLeft: '20px' }}>
              <li>Direct relationship with Microsoft</li>
              <li>Simple self-service purchasing</li>
              <li>Access to Microsoft support directly</li>
              <li>Easy to get started immediately</li>
            </ul>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h4 style={{ color: '#dc3545', marginBottom: '10px' }}>Cons:</h4>
            <ul style={{ color: '#666', lineHeight: '1.8', paddingLeft: '20px' }}>
              <li>Full retail pricing with no discounts</li>
              <li>You're responsible for all setup and configuration</li>
              <li>Limited flexibility in licensing options</li>
              <li>Microsoft support can be impersonal with long wait times</li>
            </ul>
          </div>

          <h2>Cloud Solution Provider (CSP)</h2>
          <p style={{ marginBottom: '20px', color: '#666', lineHeight: '1.8' }}>
            A CSP is a Microsoft-authorized partner that can resell Microsoft 365 subscriptions.
            CSPs purchase licenses from Microsoft at volume pricing and can pass savings along to
            customers while providing additional value-added services.
          </p>

          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ color: '#28a745', marginBottom: '10px' }}>Pros:</h4>
            <ul style={{ color: '#666', lineHeight: '1.8', paddingLeft: '20px' }}>
              <li>Often lower prices than buying direct</li>
              <li>Personalized support from a real partner</li>
              <li>Help with setup, migration, and configuration</li>
              <li>Flexible billing terms and payment options</li>
              <li>Mix-and-match different license types</li>
              <li>Additional services like training and consulting</li>
              <li>Single point of contact for all Microsoft needs</li>
            </ul>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h4 style={{ color: '#dc3545', marginBottom: '10px' }}>Cons:</h4>
            <ul style={{ color: '#666', lineHeight: '1.8', paddingLeft: '20px' }}>
              <li>Need to find a reputable partner</li>
              <li>Quality varies between CSP partners</li>
              <li>Additional layer between you and Microsoft</li>
            </ul>
          </div>

          <div style={{
            background: '#e3f2fd',
            borderRadius: '12px',
            padding: '30px',
            marginBottom: '40px',
            borderLeft: '4px solid #0078d4'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#0078d4' }}>Which is Right for You?</h3>
            <p style={{ marginBottom: '15px', color: '#333', lineHeight: '1.8' }}>
              <strong>Choose Microsoft Direct if:</strong> You're comfortable managing your own
              subscriptions, don't need additional support, and prefer dealing directly with Microsoft.
            </p>
            <p style={{ color: '#333', lineHeight: '1.8' }}>
              <strong>Choose a CSP Partner if:</strong> You want personalized support, potential cost
              savings, help with setup and migration, or need flexible licensing options for your
              business.
            </p>
          </div>

          <h2>About Our Giveaway</h2>
          <p style={{ marginBottom: '20px', color: '#666', lineHeight: '1.8' }}>
            Free365Key operates as a Cloud Solution Provider. When you win our giveaway, you
            receive a genuine Microsoft 365 subscription provisioned through our CSP partnership
            with Microsoft. This means:
          </p>
          <ul style={{ color: '#666', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '30px' }}>
            <li>Your subscription is 100% legitimate and authorized by Microsoft</li>
            <li>You get the same features as any other Microsoft 365 subscriber</li>
            <li>We provide support to help you get set up</li>
            <li>No credit card or payment information required</li>
          </ul>
        </div>
      </section>

      <section className="content-section" style={{ background: '#f8f9fa' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h2>Ready to Enter?</h2>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Enter our monthly giveaway for a chance to win a free Microsoft 365 subscription.
          </p>
          <a
            href="/"
            className="submit-btn"
            style={{ display: 'inline-block', textDecoration: 'none', maxWidth: '300px' }}
          >
            Enter the Giveaway
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default ComparePage

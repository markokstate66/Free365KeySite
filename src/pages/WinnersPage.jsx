import Header from '../components/Header'
import Footer from '../components/Footer'
import AdBanner from '../components/AdBanner'

const pastWinners = [
  { month: 'November 2024', name: 'Sarah M.', location: 'California, USA', initials: 'SM' },
  { month: 'October 2024', name: 'James K.', location: 'London, UK', initials: 'JK' },
  { month: 'September 2024', name: 'Maria G.', location: 'Toronto, Canada', initials: 'MG' },
  { month: 'August 2024', name: 'David L.', location: 'Sydney, Australia', initials: 'DL' },
  { month: 'July 2024', name: 'Emma W.', location: 'Berlin, Germany', initials: 'EW' },
  { month: 'June 2024', name: 'Michael R.', location: 'New York, USA', initials: 'MR' },
]

function WinnersPage() {
  return (
    <div>
      <Header />

      <section className="hero" style={{ padding: '60px 20px' }}>
        <div className="container">
          <h1>Past Winners</h1>
          <p>Congratulations to all our lucky Microsoft 365 license winners!</p>
        </div>
      </section>

      <AdBanner slot="winners-top" format="horizontal" />

      <section className="content-section">
        <div className="container">
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-number">{pastWinners.length}+</div>
              <div className="stat-label">Total Winners</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">6</div>
              <div className="stat-label">Countries Reached</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Prizes Delivered</div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Recent Winners</h2>
          <div className="winners-grid">
            {pastWinners.map((winner, index) => (
              <div key={index} className="winner-card">
                <div className="winner-avatar">{winner.initials}</div>
                <div className="winner-info">
                  <h3>{winner.name}</h3>
                  <p className="winner-location">{winner.location}</p>
                  <p className="winner-month">{winner.month}</p>
                </div>
                <div className="winner-badge-card">Winner</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AdBanner slot="winners-middle" format="horizontal" />

      <section className="content-section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>What Winners Say</h2>
          <div className="testimonials">
            <div className="testimonial">
              <p>"I couldn't believe it when I got the email! The license key worked perfectly and I've been using Microsoft 365 for all my work documents. Thank you so much!"</p>
              <cite>— Sarah M., November 2024 Winner</cite>
            </div>
            <div className="testimonial">
              <p>"I was skeptical at first, but this is completely legitimate. Received my key within 24 hours of claiming. Highly recommend entering!"</p>
              <cite>— James K., October 2024 Winner</cite>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white' }}>Want to Be Our Next Winner?</h2>
          <p style={{ marginBottom: '30px', opacity: 0.9 }}>
            Enter now for your chance to win a free Microsoft 365 license!
          </p>
          <a
            href="/"
            className="submit-btn"
            style={{ display: 'inline-block', textDecoration: 'none', maxWidth: '300px', background: 'white', color: '#667eea' }}
          >
            Enter the Giveaway
          </a>
        </div>
      </section>

      <AdBanner slot="winners-bottom" format="horizontal" />

      <Footer />
    </div>
  )
}

export default WinnersPage

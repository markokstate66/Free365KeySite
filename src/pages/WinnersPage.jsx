import Header from '../components/Header'
import Footer from '../components/Footer'

const testimonials = [
  {
    quote: "The setup was incredibly easy - just signed the cloud agreement and had access within minutes. I discovered so many tools I didn't know existed, like Microsoft Lists and Bookings. Game changer for my small business!",
    name: "Jennifer P.",
    location: "Pennsylvania"
  },
  {
    quote: "I was amazed at how seamless the onboarding process was. No complicated installations, everything just works in the browser. The SharePoint integration alone has transformed how I manage my documents.",
    name: "Brian W.",
    location: "Massachusetts"
  },
  {
    quote: "Finally got to try the web version of Excel with real-time collaboration features. My team and I worked on the same spreadsheet simultaneously - something I'd wanted to try for years!",
    name: "Rachel T.",
    location: "Kentucky"
  },
  {
    quote: "The 1TB OneDrive storage was a huge bonus I wasn't expecting. Being able to access all my files from any device has been incredibly convenient.",
    name: "Vanessa G.",
    location: "Montana"
  }
]

function WinnersPage() {
  return (
    <div>
      <Header />

      <section className="hero" style={{ padding: '60px 20px' }}>
        <div className="container">
          <h1>Our Winners</h1>
          <p>Real people winning real Microsoft 365 subscriptions every month</p>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Winners So Far</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4+</div>
              <div className="stat-label">Years Running</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">Monthly</div>
              <div className="stat-label">Drawings</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Claim Rate</div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section" style={{ background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>How It Works for Winners</h2>
          <div className="how-it-works-steps">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Get Notified</h3>
              <p>Winners receive an email notification with instructions to claim their prize.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Simple Agreement</h3>
              <p>Sign a no-hassle cloud service agreement to activate your Microsoft 365 trial.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Instant Access</h3>
              <p>Get immediate access to Microsoft 365 Business Basic - web apps, email, and 1TB storage.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>What Winners Say</h2>
          <div className="testimonials">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial">
                <p>"{testimonial.quote}"</p>
                <cite>— {testimonial.name}, {testimonial.location}</cite>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white' }}>Want to Be Our Next Winner?</h2>
          <p style={{ marginBottom: '30px', opacity: 0.9 }}>
            Join others who have entered for their chance to try Microsoft 365!
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

      <Footer />
    </div>
  )
}

export default WinnersPage

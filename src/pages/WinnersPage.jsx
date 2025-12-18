import Header from '../components/Header'
import Footer from '../components/Footer'
import { useState } from 'react'

const pastWinners = [
  // 2024
  { month: 'November 2024', name: 'Sarah M.', location: 'California', initials: 'SM' },
  { month: 'October 2024', name: 'James K.', location: 'Texas', initials: 'JK' },
  { month: 'September 2024', name: 'Maria G.', location: 'Florida', initials: 'MG' },
  { month: 'August 2024', name: 'David L.', location: 'New York', initials: 'DL' },
  { month: 'July 2024', name: 'Emma W.', location: 'Washington', initials: 'EW' },
  { month: 'June 2024', name: 'Michael R.', location: 'Illinois', initials: 'MR' },
  { month: 'May 2024', name: 'Jennifer P.', location: 'Pennsylvania', initials: 'JP' },
  { month: 'April 2024', name: 'Robert T.', location: 'Ohio', initials: 'RT' },
  { month: 'March 2024', name: 'Ashley N.', location: 'Georgia', initials: 'AN' },
  { month: 'February 2024', name: 'Christopher B.', location: 'North Carolina', initials: 'CB' },
  { month: 'January 2024', name: 'Amanda S.', location: 'Michigan', initials: 'AS' },
  // 2023
  { month: 'December 2023', name: 'Daniel H.', location: 'Arizona', initials: 'DH' },
  { month: 'November 2023', name: 'Michelle C.', location: 'Colorado', initials: 'MC' },
  { month: 'October 2023', name: 'Kevin F.', location: 'Virginia', initials: 'KF' },
  { month: 'September 2023', name: 'Stephanie L.', location: 'Tennessee', initials: 'SL' },
  { month: 'August 2023', name: 'Brian W.', location: 'Massachusetts', initials: 'BW' },
  { month: 'July 2023', name: 'Nicole D.', location: 'Indiana', initials: 'ND' },
  { month: 'June 2023', name: 'Jason M.', location: 'Missouri', initials: 'JM' },
  { month: 'May 2023', name: 'Laura K.', location: 'Maryland', initials: 'LK' },
  { month: 'April 2023', name: 'Ryan G.', location: 'Wisconsin', initials: 'RG' },
  { month: 'March 2023', name: 'Heather P.', location: 'Minnesota', initials: 'HP' },
  { month: 'February 2023', name: 'Tyler J.', location: 'South Carolina', initials: 'TJ' },
  { month: 'January 2023', name: 'Megan R.', location: 'Alabama', initials: 'MR' },
  // 2022
  { month: 'December 2022', name: 'Andrew S.', location: 'Louisiana', initials: 'AS' },
  { month: 'November 2022', name: 'Rachel T.', location: 'Kentucky', initials: 'RT' },
  { month: 'October 2022', name: 'Brandon H.', location: 'Oregon', initials: 'BH' },
  { month: 'September 2022', name: 'Kimberly A.', location: 'Oklahoma', initials: 'KA' },
  { month: 'August 2022', name: 'Justin C.', location: 'Connecticut', initials: 'JC' },
  { month: 'July 2022', name: 'Angela B.', location: 'Iowa', initials: 'AB' },
  { month: 'June 2022', name: 'Eric N.', location: 'Nevada', initials: 'EN' },
  { month: 'May 2022', name: 'Christina M.', location: 'Arkansas', initials: 'CM' },
  { month: 'April 2022', name: 'Scott L.', location: 'Utah', initials: 'SL' },
  { month: 'March 2022', name: 'Tiffany W.', location: 'Kansas', initials: 'TW' },
  { month: 'February 2022', name: 'Patrick D.', location: 'New Mexico', initials: 'PD' },
  { month: 'January 2022', name: 'Samantha F.', location: 'Nebraska', initials: 'SF' },
  // 2021
  { month: 'December 2021', name: 'Gregory P.', location: 'West Virginia', initials: 'GP' },
  { month: 'November 2021', name: 'Brittany H.', location: 'Idaho', initials: 'BH' },
  { month: 'October 2021', name: 'Jonathan R.', location: 'Hawaii', initials: 'JR' },
  { month: 'September 2021', name: 'Danielle K.', location: 'Maine', initials: 'DK' },
  { month: 'August 2021', name: 'Mark T.', location: 'New Hampshire', initials: 'MT' },
  { month: 'July 2021', name: 'Vanessa G.', location: 'Montana', initials: 'VG' },
  { month: 'June 2021', name: 'Aaron S.', location: 'Delaware', initials: 'AS' },
  { month: 'May 2021', name: 'Lindsey M.', location: 'Rhode Island', initials: 'LM' },
  { month: 'April 2021', name: 'Derek J.', location: 'South Dakota', initials: 'DJ' },
  { month: 'March 2021', name: 'Courtney B.', location: 'North Dakota', initials: 'CB' },
  { month: 'February 2021', name: 'Nathan W.', location: 'Alaska', initials: 'NW' },
  { month: 'January 2021', name: 'Melissa C.', location: 'Vermont', initials: 'MC' },
  // 2020
  { month: 'December 2020', name: 'Kyle A.', location: 'Wyoming', initials: 'KA' },
  { month: 'November 2020', name: 'Jessica L.', location: 'California', initials: 'JL' },
  { month: 'October 2020', name: 'Travis H.', location: 'Texas', initials: 'TH' },
  { month: 'September 2020', name: 'Amber R.', location: 'Florida', initials: 'AR' },
  { month: 'August 2020', name: 'Chad M.', location: 'New York', initials: 'CM' },
]

const testimonials = [
  {
    quote: "The setup was incredibly easy - just signed the cloud agreement and had access within minutes. I discovered so many tools I didn't know existed, like Microsoft Lists and Bookings. Game changer for my small business!",
    name: "Jennifer P.",
    date: "May 2024 Winner",
    location: "Pennsylvania"
  },
  {
    quote: "I was amazed at how seamless the onboarding process was. No complicated installations, everything just works in the browser. The SharePoint integration alone has transformed how I manage my documents.",
    name: "Brian W.",
    date: "August 2023 Winner",
    location: "Massachusetts"
  },
  {
    quote: "Finally got to try the web version of Excel with real-time collaboration features. My team and I worked on the same spreadsheet simultaneously - something I'd wanted to try for years. Definitely considering upgrading after the trial!",
    name: "Rachel T.",
    date: "November 2022 Winner",
    location: "Kentucky"
  },
  {
    quote: "The 1TB OneDrive storage was a huge bonus I wasn't expecting. Being able to access all my files from any device has been incredibly convenient. The whole experience convinced me to recommend Microsoft 365 to my colleagues.",
    name: "Vanessa G.",
    date: "July 2021 Winner",
    location: "Montana"
  }
]

function WinnersPage() {
  const [showAll, setShowAll] = useState(false)
  const displayedWinners = showAll ? pastWinners : pastWinners.slice(0, 12)

  return (
    <div>
      <Header />

      <section className="hero" style={{ padding: '60px 20px' }}>
        <div className="container">
          <h1>Past Winners</h1>
          <p>Congratulations to all our Microsoft 365 trial winners since 2020!</p>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-number">{pastWinners.length}+</div>
              <div className="stat-label">Total Winners</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4+</div>
              <div className="stat-label">Years Running</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50</div>
              <div className="stat-label">States Reached</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Trials Activated</div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Our Winners</h2>
          <div className="winners-grid">
            {displayedWinners.map((winner, index) => (
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
          {!showAll && pastWinners.length > 12 && (
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowAll(true)}
                style={{ padding: '12px 30px' }}
              >
                Show All {pastWinners.length} Winners
              </button>
            </div>
          )}
          {showAll && (
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowAll(false)}
                style={{ padding: '12px 30px' }}
              >
                Show Less
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="content-section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>What Winners Say</h2>
          <div className="testimonials">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial">
                <p>"{testimonial.quote}"</p>
                <cite>— {testimonial.name}, {testimonial.date}</cite>
              </div>
            ))}
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

      <section className="content-section" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white' }}>Want to Be Our Next Winner?</h2>
          <p style={{ marginBottom: '30px', opacity: 0.9 }}>
            Join thousands of others who have entered for their chance to try Microsoft 365!
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

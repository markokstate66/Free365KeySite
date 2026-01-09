import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const plans = [
  {
    name: 'Microsoft 365 Business Basic',
    price: '$6.00',
    monthlyPrice: '$7.20',
    description: 'Entry-level plan for businesses needing web and mobile productivity tools',
    features: [
      'Web and mobile versions of Word, Excel, PowerPoint, and Outlook',
      'Custom business email with Exchange (50 GB mailbox)',
      'Microsoft Teams for chat, calls, and meetings',
      '1 TB OneDrive cloud storage per user',
      'Microsoft Bookings, Planner, and Forms',
      'SharePoint team sites',
      'AI chat experience with web grounding and writing assistance'
    ],
    highlight: false
  },
  {
    name: 'Microsoft 365 Business Standard',
    price: '$12.50',
    monthlyPrice: '$15.00',
    description: 'Most popular plan for growing businesses requiring desktop applications',
    features: [
      'Everything in Business Basic, plus:',
      'Desktop versions of Word, Excel, PowerPoint, and Outlook',
      'Microsoft Access (PC only)',
      'Microsoft Publisher (PC only)',
      'Clipchamp video editing tool',
      'Microsoft Loop for project collaboration',
      'Webinar hosting with registration and reporting'
    ],
    highlight: true
  },
  {
    name: 'Microsoft 365 Business Premium',
    price: '$22.00',
    monthlyPrice: '$26.40',
    description: 'Comprehensive plan for security-conscious organizations needing advanced protection',
    features: [
      'Everything in Business Standard, plus:',
      'Advanced identity and access management',
      'Enhanced cyberthreat protection against viruses and phishing',
      'Discovery, classification, and protection of sensitive data',
      'Microsoft Entra ID for identity protection',
      'Windows 11 Pro upgrade rights',
      'Microsoft Intune endpoint management',
      'Microsoft Defender for Office 365'
    ],
    highlight: false
  }
]

const comparisonData = [
  { feature: 'Desktop Office Apps', basic: false, standard: true, premium: true },
  { feature: 'Web & Mobile Office Apps', basic: true, standard: true, premium: true },
  { feature: 'Business Email (Exchange)', basic: true, standard: true, premium: true },
  { feature: 'Microsoft Teams', basic: true, standard: true, premium: true },
  { feature: 'OneDrive Storage (1 TB)', basic: true, standard: true, premium: true },
  { feature: 'SharePoint', basic: true, standard: true, premium: true },
  { feature: 'Microsoft Access', basic: false, standard: true, premium: true },
  { feature: 'Webinar Hosting', basic: false, standard: true, premium: true },
  { feature: 'Advanced Security', basic: false, standard: false, premium: true },
  { feature: 'Device Management (Intune)', basic: false, standard: false, premium: true },
  { feature: 'Windows 11 Pro Upgrade', basic: false, standard: false, premium: true },
  { feature: 'Defender for Office 365', basic: false, standard: false, premium: true }
]

const licensingFaqs = [
  {
    question: 'How many users can I have on Microsoft 365 Business plans?',
    answer: 'All Microsoft 365 Business plans support up to 300 users. If your organization exceeds 300 users, you should consider Microsoft 365 Enterprise plans (E3 or E5) which have no user limits.'
  },
  {
    question: 'How many devices can I install Office apps on?',
    answer: 'Each Microsoft 365 Business license allows installation on up to 5 PCs or Macs, 5 tablets, and 5 mobile devices per user. This means a single user can have Office installed across all their devices.'
  },
  {
    question: 'Can I mix different Microsoft 365 Business plans?',
    answer: 'Yes, you can mix different Business plans within your organization. For example, some users can have Business Basic while others have Business Premium. Each plan can have up to 300 provisioned licenses.'
  },
  {
    question: 'What is the difference between annual and monthly billing?',
    answer: 'Annual commitment offers the best pricing (paid monthly or upfront for one year). Monthly commitment costs about 20% more but allows you to cancel anytime. Annual plans have a 7-day cancellation window for prorated refunds.'
  },
  {
    question: 'What is Microsoft Copilot and how does it work with licensing?',
    answer: 'Microsoft 365 Copilot is an AI-powered assistant that works within Office apps. It costs an additional $21/user/month and requires a qualifying base plan (Business Standard or Premium). It provides AI assistance in Word, Excel, PowerPoint, Outlook, and Teams.'
  },
  {
    question: 'Do I need Business Premium for security features?',
    answer: 'Business Basic and Standard include baseline security. However, Business Premium adds advanced threat protection, device management with Intune, data loss prevention, and Microsoft Defender for Office 365. Organizations with strict security or compliance requirements should choose Premium.'
  },
  {
    question: 'Can I upgrade from Business Basic to Standard or Premium?',
    answer: 'Yes, you can upgrade plans at any time. Microsoft prorates the cost based on your remaining subscription period. Upgrading is seamless and users retain all their data and settings.'
  },
  {
    question: 'What is a Cloud Solution Provider (CSP) license?',
    answer: 'CSP licenses are Microsoft 365 subscriptions sold through authorized Microsoft partners. They offer the same features as direct Microsoft purchases but often include better pricing, billing flexibility, and personalized support from your partner.'
  }
]

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <span className="faq-toggle">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="faq-answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}

function PlanCard({ plan }) {
  return (
    <div
      style={{
        background: plan.highlight ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
        color: plan.highlight ? 'white' : 'inherit',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: plan.highlight ? '0 10px 40px rgba(102, 126, 234, 0.3)' : '0 5px 20px rgba(0,0,0,0.1)',
        position: 'relative',
        transform: plan.highlight ? 'scale(1.02)' : 'none'
      }}
    >
      {plan.highlight && (
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#ffb900',
            color: '#1a1a1a',
            padding: '5px 15px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}
        >
          Most Popular
        </div>
      )}
      <h3 style={{ marginBottom: '10px', fontSize: '1.3rem' }}>{plan.name}</h3>
      <div style={{ marginBottom: '15px' }}>
        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{plan.price}</span>
        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>/user/month (annual)</span>
      </div>
      <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '5px' }}>
        or {plan.monthlyPrice}/user/month (monthly)
      </p>
      <p style={{ marginBottom: '20px', fontSize: '0.95rem', opacity: 0.9 }}>{plan.description}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {plan.features.map((feature, index) => (
          <li
            key={index}
            style={{
              padding: '8px 0',
              borderTop: index === 0 ? `1px solid ${plan.highlight ? 'rgba(255,255,255,0.2)' : '#eee'}` : 'none',
              fontSize: '0.9rem'
            }}
          >
            {feature.startsWith('Everything') ? (
              <strong>{feature}</strong>
            ) : (
              <>
                <span style={{ color: plan.highlight ? '#90EE90' : '#7fba00', marginRight: '8px' }}>✓</span>
                {feature}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function LicensingGuidesPage() {
  return (
    <div>
      <SEO
        title="Microsoft 365 Licensing Guide"
        path="/licensing-guides"
        description="Complete guide to Microsoft 365 Business licensing. Compare Business Basic, Standard, and Premium plans. Understand pricing, features, and how to choose the right plan."
      />
      <Header />

      <section className="hero" style={{ padding: '60px 20px' }}>
        <div className="container">
          <h1>Microsoft 365 Licensing Guide</h1>
          <p>Everything you need to know about Microsoft 365 Business plans and pricing</p>
        </div>
      </section>

      {/* Plan Cards */}
      <section className="content-section">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Microsoft 365 Business Plans</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px',
              alignItems: 'start'
            }}
          >
            {plans.map((plan, index) => (
              <PlanCard key={index} plan={plan} />
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '30px', color: '#666', fontSize: '0.9rem' }}>
            All plans support up to 300 users. Prices shown are for annual commitment with monthly billing.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="content-section" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Feature Comparison</h2>
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th style={{ textAlign: 'center' }}>Basic</th>
                  <th style={{ textAlign: 'center' }}>Standard</th>
                  <th style={{ textAlign: 'center' }}>Premium</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.feature}</td>
                    <td style={{ textAlign: 'center' }}>
                      {row.basic ? (
                        <span style={{ color: '#7fba00', fontSize: '1.2rem' }}>✓</span>
                      ) : (
                        <span style={{ color: '#ccc' }}>—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {row.standard ? (
                        <span style={{ color: '#7fba00', fontSize: '1.2rem' }}>✓</span>
                      ) : (
                        <span style={{ color: '#ccc' }}>—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {row.premium ? (
                        <span style={{ color: '#7fba00', fontSize: '1.2rem' }}>✓</span>
                      ) : (
                        <span style={{ color: '#ccc' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="content-section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Popular Add-Ons</h2>
          <div style={{ display: 'grid', gap: '20px' }}>
            <div
              style={{
                background: 'white',
                borderRadius: '10px',
                padding: '25px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: '2px solid #667eea'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#667eea' }}>Microsoft 365 Copilot</h3>
                  <p style={{ margin: 0, color: '#666' }}>
                    AI-powered assistant that boosts creativity and productivity in Word, Excel, PowerPoint, Outlook, and Teams.
                    Requires Business Standard or Premium.
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a' }}>$21.00</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>/user/month</div>
                </div>
              </div>
            </div>
            <div
              style={{
                background: 'white',
                borderRadius: '10px',
                padding: '25px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0' }}>Microsoft Teams Phone Standard</h3>
                  <p style={{ margin: 0, color: '#666' }}>
                    Cloud-based phone system that integrates with Microsoft Teams for calling, voicemail, and call queues.
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a' }}>$10.00</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>/user/month</div>
                </div>
              </div>
            </div>
            <div
              style={{
                background: 'white',
                borderRadius: '10px',
                padding: '25px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0' }}>Microsoft Defender for Business</h3>
                  <p style={{ margin: 0, color: '#666' }}>
                    Enterprise-grade endpoint security for small and medium businesses. Included in Business Premium.
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a' }}>$3.00</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>/user/month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Licensing FAQs */}
      <section className="content-section" style={{ background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Licensing FAQs</h2>
          <div className="faq-list">
            {licensingFaqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="content-section">
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h2>Need Help Choosing?</h2>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Not sure which Microsoft 365 plan is right for your business? Enter our giveaway for a chance to try Business Basic free,
            or contact us for personalized licensing guidance.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="/"
              className="submit-btn"
              style={{ display: 'inline-block', textDecoration: 'none', maxWidth: '200px' }}
            >
              Enter Giveaway
            </a>
            <a
              href="/#contact"
              className="submit-btn"
              style={{
                display: 'inline-block',
                textDecoration: 'none',
                maxWidth: '200px',
                background: 'transparent',
                border: '2px solid #667eea',
                color: '#667eea'
              }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LicensingGuidesPage

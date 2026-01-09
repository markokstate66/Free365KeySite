import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ContactForm from '../components/ContactForm'
import SEO from '../components/SEO'

const plans = [
  {
    name: 'Microsoft 365 Business Basic',
    price: '$6.00',
    monthlyPrice: '$7.20',
    description: 'Entry-level plan for businesses needing web and mobile productivity tools',
    bestFor: 'Small teams, remote workers, and businesses that primarily use web-based tools',
    features: [
      'Web and mobile versions of Word, Excel, PowerPoint, and Outlook',
      'Custom business email with Exchange (50 GB mailbox)',
      'Microsoft Teams for chat, calls, and meetings',
      '1 TB OneDrive cloud storage per user',
      'Microsoft Bookings, Planner, and Forms',
      'SharePoint team sites',
      'AI chat experience with web grounding and writing assistance'
    ],
    limitations: [
      'No desktop Office applications',
      'No Microsoft Access or Publisher',
      'Basic security features only'
    ],
    highlight: false
  },
  {
    name: 'Microsoft 365 Business Standard',
    price: '$12.50',
    monthlyPrice: '$15.00',
    description: 'Most popular plan for growing businesses requiring desktop applications',
    bestFor: 'Growing businesses that need full Office apps and collaboration tools',
    features: [
      'Everything in Business Basic, plus:',
      'Desktop versions of Word, Excel, PowerPoint, and Outlook',
      'Microsoft Access (PC only)',
      'Microsoft Publisher (PC only)',
      'Clipchamp video editing tool',
      'Microsoft Loop for project collaboration',
      'Webinar hosting with registration and reporting'
    ],
    limitations: [
      'Standard security (no advanced threat protection)',
      'No device management capabilities',
      'No Windows upgrade rights'
    ],
    highlight: true
  },
  {
    name: 'Microsoft 365 Business Premium',
    price: '$22.00',
    monthlyPrice: '$26.40',
    description: 'Comprehensive plan for security-conscious organizations needing advanced protection',
    bestFor: 'Businesses handling sensitive data, regulated industries, or those needing device management',
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
    limitations: [
      'Maximum 300 users (consider Enterprise for larger orgs)',
      'Higher cost per user'
    ],
    highlight: false
  }
]

const enterprisePlans = [
  {
    name: 'Microsoft 365 E3',
    price: '$36.00',
    description: 'Enterprise productivity with enhanced compliance and security',
    keyFeatures: [
      'Unlimited users',
      'eDiscovery and legal hold',
      'Data loss prevention',
      'Windows Enterprise E3',
      'Advanced compliance tools'
    ]
  },
  {
    name: 'Microsoft 365 E5',
    price: '$57.00',
    description: 'Complete enterprise solution with advanced security and analytics',
    keyFeatures: [
      'Everything in E3, plus:',
      'Microsoft Defender for Endpoint',
      'Power BI Pro included',
      'Phone System capabilities',
      'Advanced eDiscovery'
    ]
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
    answer: 'All Microsoft 365 Business plans support up to 300 users. If your organization exceeds 300 users, you should consider Microsoft 365 Enterprise plans (E3 or E5) which have no user limits. You can mix Business and Enterprise licenses, but managing two separate licensing tiers adds administrative complexity.'
  },
  {
    question: 'How many devices can I install Office apps on?',
    answer: 'Each Microsoft 365 Business license allows installation on up to 5 PCs or Macs, 5 tablets, and 5 mobile devices per user. This means a single user can have Office installed across all their devices. The license is tied to the user, not the device, so they can deactivate one device and activate another at any time through their Microsoft account.'
  },
  {
    question: 'Can I mix different Microsoft 365 Business plans?',
    answer: 'Yes, you can mix different Business plans within your organization. For example, executives might have Business Premium for advanced security, while most staff use Business Standard, and frontline workers use Business Basic. Each plan can have up to 300 provisioned licenses, and you can manage all users from a single admin center.'
  },
  {
    question: 'What is the difference between annual and monthly billing?',
    answer: 'Annual commitment offers the best pricing (about 16-20% savings), paid either monthly or upfront for one year. Monthly commitment costs more but allows you to cancel anytime with 30 days notice. Annual plans have a 7-day cancellation window after purchase for a prorated refund. For most businesses, annual commitment makes sense due to the significant savings.'
  },
  {
    question: 'What is Microsoft Copilot and how does it work with licensing?',
    answer: 'Microsoft 365 Copilot is an AI-powered assistant that works within Office apps. It costs an additional $30/user/month and requires a qualifying base plan (Business Standard, Business Premium, E3, or E5). Copilot provides AI assistance in Word (drafting, rewriting), Excel (analysis, formulas), PowerPoint (presentation creation), Outlook (email summaries, drafts), and Teams (meeting summaries, action items).'
  },
  {
    question: 'Do I need Business Premium for security features?',
    answer: 'Business Basic and Standard include baseline security like multi-factor authentication, data encryption, and spam filtering. However, Business Premium adds: Microsoft Defender for Office 365 (advanced threat protection), Microsoft Intune (device management), Azure Information Protection (data classification), and Conditional Access policies. Organizations handling sensitive data, in regulated industries (healthcare, finance, legal), or with BYOD policies should strongly consider Premium.'
  },
  {
    question: 'Can I upgrade from Business Basic to Standard or Premium?',
    answer: 'Yes, you can upgrade plans at any time through the Microsoft 365 admin center. Microsoft prorates the cost based on your remaining subscription period. Upgrading is seamless - users retain all their data, settings, and files. Downgrading is also possible, but you may lose access to features (like desktop apps) when moving from Standard to Basic.'
  },
  {
    question: 'What is a Cloud Solution Provider (CSP) license?',
    answer: 'CSP licenses are Microsoft 365 subscriptions sold through authorized Microsoft partners instead of directly from Microsoft. Benefits include: potentially better pricing (especially for volume), flexible billing terms, consolidated billing with other services, dedicated support from your partner, and assistance with deployment and migration. The features and functionality are identical to direct Microsoft purchases.'
  },
  {
    question: 'What happens to my data if I cancel my subscription?',
    answer: 'When you cancel, you enter a 90-day grace period where data is retained but access is limited. After 90 days, Microsoft begins permanently deleting your data. Before canceling, you should: export emails (PST files), download OneDrive files, export SharePoint content, and save any Teams conversations you need. Consider keeping at least one admin license active during data export.'
  },
  {
    question: 'Are there discounts for nonprofits or educational institutions?',
    answer: 'Yes, Microsoft offers significant discounts for eligible organizations. Nonprofits can get Business Basic free for up to 300 users, with 75% discounts on other plans. Educational institutions (K-12 and higher education) get Office 365 A1 free for students and faculty, with discounted A3 and A5 plans. Verification of nonprofit or educational status is required through Microsoft or a CSP partner.'
  },
  {
    question: 'How does Microsoft 365 licensing work for shared computers?',
    answer: 'Standard Microsoft 365 licenses are per-user, not per-device. For shared computer scenarios (call centers, retail, healthcare), you have options: Microsoft 365 Apps for Enterprise includes Shared Computer Activation, allowing the same license to be used on shared devices. Alternatively, consider Microsoft 365 F1/F3 (Frontline) plans designed for shift workers sharing devices, starting at $2.25/user/month.'
  },
  {
    question: 'What is the difference between Microsoft 365 and Office 2024?',
    answer: 'Microsoft 365 is a subscription service with continuous updates, cloud storage, and collaborative features. Office 2024 is a one-time purchase with no subscription required, but it lacks cloud features, Teams, and will not receive feature updates (only security patches for 5 years). For businesses, Microsoft 365 is almost always the better choice due to ongoing updates, support, and cloud collaboration tools.'
  }
]

const addOns = [
  {
    name: 'Microsoft 365 Copilot',
    price: '$30.00',
    description: 'AI-powered assistant that boosts creativity and productivity in Word, Excel, PowerPoint, Outlook, and Teams. Requires Business Standard or Premium.',
    highlight: true
  },
  {
    name: 'Microsoft Teams Phone Standard',
    price: '$10.00',
    description: 'Cloud-based phone system that integrates with Microsoft Teams for calling, voicemail, and call queues. Requires calling plan or direct routing.'
  },
  {
    name: 'Microsoft Defender for Business',
    price: '$3.00',
    description: 'Enterprise-grade endpoint security for small and medium businesses. Included in Business Premium, available as add-on for Basic/Standard.'
  },
  {
    name: 'Microsoft Teams Premium',
    price: '$10.00',
    description: 'Advanced meeting features including intelligent recap, live translations, custom branding, and enhanced webinar capabilities.'
  },
  {
    name: 'Power BI Pro',
    price: '$10.00',
    description: 'Business intelligence tool for creating interactive reports and dashboards. Share insights across your organization.'
  },
  {
    name: 'Visio Plan 2',
    price: '$15.00',
    description: 'Professional diagramming tool for flowcharts, org charts, floor plans, and engineering designs. Includes desktop and web apps.'
  },
  {
    name: 'Project Plan 3',
    price: '$30.00',
    description: 'Project management solution with scheduling, resource management, and reporting. Includes desktop and web apps.'
  },
  {
    name: 'Extra OneDrive Storage',
    price: '$10.00',
    description: 'Add an extra 1 TB of OneDrive storage per user (up to 5 TB additional). For users who exceed their 1 TB allocation.'
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
      <p style={{ marginBottom: '15px', fontSize: '0.95rem', opacity: 0.9 }}>{plan.description}</p>

      <div style={{
        background: plan.highlight ? 'rgba(255,255,255,0.15)' : '#f0f9ff',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '0.85rem'
      }}>
        <strong>Best for:</strong> {plan.bestFor}
      </div>

      <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', opacity: 0.9 }}>Includes:</h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
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

      {plan.limitations && (
        <>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', opacity: 0.7 }}>Limitations:</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {plan.limitations.map((limitation, index) => (
              <li key={index} style={{ padding: '5px 0', fontSize: '0.85rem', opacity: 0.7 }}>
                <span style={{ marginRight: '8px' }}>-</span>
                {limitation}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function LicensingGuidesPage() {
  return (
    <div>
      <SEO
        title="Microsoft 365 Licensing Guide - Plans, Pricing & How to Choose"
        path="/licensing-guides"
        description="Complete guide to Microsoft 365 Business licensing. Compare Business Basic, Standard, and Premium plans. Understand pricing, features, enterprise options, and how to choose the right plan for your organization."
      />
      <Header />

      <section className="hero" style={{ padding: '60px 20px' }}>
        <div className="container">
          <h1>Microsoft 365 Licensing Guide</h1>
          <p>Everything you need to know about Microsoft 365 Business plans, pricing, and how to choose the right option for your organization</p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="content-section" style={{ background: '#f8f9fa', padding: '30px 20px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>In This Guide</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <a href="#business-plans" style={{ color: '#667eea', textDecoration: 'none' }}>Business Plans Overview</a>
            <a href="#comparison" style={{ color: '#667eea', textDecoration: 'none' }}>Feature Comparison</a>
            <a href="#enterprise" style={{ color: '#667eea', textDecoration: 'none' }}>Enterprise Plans</a>
            <a href="#choosing" style={{ color: '#667eea', textDecoration: 'none' }}>How to Choose</a>
            <a href="#addons" style={{ color: '#667eea', textDecoration: 'none' }}>Popular Add-Ons</a>
            <a href="#cost-optimization" style={{ color: '#667eea', textDecoration: 'none' }}>Cost Optimization</a>
            <a href="#migration" style={{ color: '#667eea', textDecoration: 'none' }}>Migration Tips</a>
            <a href="#faqs" style={{ color: '#667eea', textDecoration: 'none' }}>FAQs</a>
          </div>
        </div>
      </section>

      {/* Understanding Microsoft 365 Licensing */}
      <section className="content-section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2>Understanding Microsoft 365 Licensing</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#444' }}>
            Microsoft 365 (formerly Office 365) is Microsoft's cloud-based productivity suite that combines familiar Office applications
            with powerful cloud services, device management, and advanced security. Unlike traditional one-time purchase software,
            Microsoft 365 operates on a subscription model, providing continuous updates, support, and cloud storage.
          </p>

          <div style={{ background: '#e8f4fd', padding: '25px', borderRadius: '10px', margin: '30px 0' }}>
            <h3 style={{ marginTop: 0, color: '#0078d4' }}>Key Licensing Concepts</h3>
            <ul style={{ lineHeight: '1.8', marginBottom: 0 }}>
              <li><strong>Per-User Licensing:</strong> Each license is assigned to one person, who can use it on multiple devices (up to 5 PCs/Macs, 5 tablets, and 5 phones)</li>
              <li><strong>Subscription-Based:</strong> Monthly or annual billing with continuous access to the latest features and security updates</li>
              <li><strong>Cloud-First:</strong> All plans include cloud services like Exchange Online, SharePoint, and OneDrive</li>
              <li><strong>Scalable:</strong> Add or remove licenses as your organization grows or changes</li>
            </ul>
          </div>

          <h3>Business vs. Enterprise: Which Track?</h3>
          <p style={{ lineHeight: '1.7', color: '#444' }}>
            Microsoft offers two main licensing tracks: <strong>Business plans</strong> (Basic, Standard, Premium) for organizations
            up to 300 users, and <strong>Enterprise plans</strong> (E1, E3, E5) for larger organizations with no user limits.
            Business plans are simpler and more affordable, while Enterprise plans offer advanced compliance, analytics, and
            unlimited scalability.
          </p>
        </div>
      </section>

      {/* Plan Cards */}
      <section id="business-plans" className="content-section" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Microsoft 365 Business Plans</h2>
          <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px', color: '#666' }}>
            All Business plans support up to 300 users and include core productivity features. Choose based on your need for
            desktop applications, advanced features, and security requirements.
          </p>
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
            Prices shown are for annual commitment with monthly billing. Prices may vary by region. Last updated January 2025.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparison" className="content-section">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Feature Comparison</h2>
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th style={{ textAlign: 'center' }}>Basic<br/><span style={{ fontWeight: 'normal', fontSize: '0.8rem' }}>$6/user/mo</span></th>
                  <th style={{ textAlign: 'center' }}>Standard<br/><span style={{ fontWeight: 'normal', fontSize: '0.8rem' }}>$12.50/user/mo</span></th>
                  <th style={{ textAlign: 'center' }}>Premium<br/><span style={{ fontWeight: 'normal', fontSize: '0.8rem' }}>$22/user/mo</span></th>
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

      {/* Enterprise Plans */}
      <section id="enterprise" className="content-section" style={{ background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Enterprise Plans Overview</h2>
          <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px', color: '#666' }}>
            For organizations with more than 300 users or those requiring advanced compliance, security, and analytics capabilities.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
            {enterprisePlans.map((plan, index) => (
              <div key={index} style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 3px 15px rgba(0,0,0,0.08)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '5px' }}>{plan.name}</h3>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{plan.price}</span>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>/user/month</span>
                </div>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>{plan.description}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {plan.keyFeatures.map((feature, i) => (
                    <li key={i} style={{ padding: '5px 0', fontSize: '0.9rem' }}>
                      {feature.startsWith('Everything') ? (
                        <strong>{feature}</strong>
                      ) : (
                        <>
                          <span style={{ color: '#7fba00', marginRight: '8px' }}>✓</span>
                          {feature}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '30px', padding: '20px', background: '#fff3cd', borderRadius: '10px', textAlign: 'center' }}>
            <p style={{ margin: 0, color: '#856404' }}>
              <strong>Note:</strong> Enterprise plans also include F1/F3 (Frontline Worker) options starting at $2.25/user/month
              for employees who primarily use mobile devices or shared workstations.
            </p>
          </div>
        </div>
      </section>

      {/* How to Choose */}
      <section id="choosing" className="content-section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>How to Choose the Right Plan</h2>

          <div style={{ display: 'grid', gap: '25px' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '25px' }}>
              <h3 style={{ marginTop: 0, color: '#166534' }}>Choose Business Basic if you:</h3>
              <ul style={{ marginBottom: 0, lineHeight: '1.8' }}>
                <li>Primarily work in web browsers and mobile apps</li>
                <li>Need email, Teams, and cloud storage but not desktop Office apps</li>
                <li>Have a tight budget and want essential cloud productivity</li>
                <li>Already own perpetual Office licenses (Office 2021/2024) for desktop use</li>
                <li>Have remote or frontline workers who mainly need communication tools</li>
              </ul>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: '12px', padding: '25px' }}>
              <h3 style={{ marginTop: 0, color: '#1e40af' }}>Choose Business Standard if you:</h3>
              <ul style={{ marginBottom: 0, lineHeight: '1.8' }}>
                <li>Need the full desktop versions of Word, Excel, PowerPoint, and Outlook</li>
                <li>Require offline access to documents and presentations</li>
                <li>Use advanced Excel features (macros, Power Query, complex formulas)</li>
                <li>Need Microsoft Access or Publisher for specific workflows</li>
                <li>Host webinars or online events with registration tracking</li>
                <li>Want the best balance of features and cost for most businesses</li>
              </ul>
            </div>

            <div style={{ background: '#faf5ff', border: '1px solid #d8b4fe', borderRadius: '12px', padding: '25px' }}>
              <h3 style={{ marginTop: 0, color: '#7c3aed' }}>Choose Business Premium if you:</h3>
              <ul style={{ marginBottom: 0, lineHeight: '1.8' }}>
                <li>Handle sensitive customer data (healthcare, financial, legal industries)</li>
                <li>Need to meet compliance requirements (HIPAA, GDPR, SOC 2)</li>
                <li>Want centralized device management with Microsoft Intune</li>
                <li>Need advanced threat protection against phishing and malware</li>
                <li>Have employees using personal devices (BYOD) for work</li>
                <li>Require data loss prevention and information protection policies</li>
                <li>Want Windows 11 Pro upgrade rights included</li>
              </ul>
            </div>

            <div style={{ background: '#fefce8', border: '1px solid #fde047', borderRadius: '12px', padding: '25px' }}>
              <h3 style={{ marginTop: 0, color: '#854d0e' }}>Consider Enterprise Plans if you:</h3>
              <ul style={{ marginBottom: 0, lineHeight: '1.8' }}>
                <li>Have more than 300 users (Business plans max out at 300)</li>
                <li>Need advanced eDiscovery for legal compliance</li>
                <li>Require unlimited email archiving and retention policies</li>
                <li>Want Microsoft Defender for Endpoint (advanced endpoint security)</li>
                <li>Need Power BI Pro included for all users</li>
                <li>Require phone system capabilities built into your license</li>
              </ul>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <p style={{ marginBottom: '20px', color: '#666' }}>Not sure which plan is right for you? Take our quick assessment.</p>
            <Link
              to="/plan-finder"
              className="submit-btn"
              style={{ display: 'inline-block', textDecoration: 'none', padding: '15px 40px' }}
            >
              Find Your Perfect Plan
            </Link>
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section id="addons" className="content-section" style={{ background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Popular Add-Ons</h2>
          <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px', color: '#666' }}>
            Extend your Microsoft 365 subscription with additional capabilities. All prices are per user, per month.
          </p>
          <div style={{ display: 'grid', gap: '20px' }}>
            {addOns.map((addon, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  borderRadius: '10px',
                  padding: '25px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  border: addon.highlight ? '2px solid #667eea' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0', color: addon.highlight ? '#667eea' : 'inherit' }}>{addon.name}</h3>
                    <p style={{ margin: 0, color: '#666' }}>{addon.description}</p>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '100px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a' }}>{addon.price}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>/user/month</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Optimization */}
      <section id="cost-optimization" className="content-section">
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Cost Optimization Tips</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 3px 15px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginTop: 0, color: '#059669' }}>1. Right-Size Your Licenses</h3>
              <p style={{ color: '#666', lineHeight: '1.7' }}>
                Not everyone needs the same plan. Use Business Basic for email-only users, Standard for most employees,
                and Premium only for those handling sensitive data or needing device management.
              </p>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 3px 15px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginTop: 0, color: '#059669' }}>2. Commit Annually</h3>
              <p style={{ color: '#666', lineHeight: '1.7' }}>
                Annual commitment saves 16-20% compared to monthly billing. If you're confident in your user count,
                annual commitment with monthly billing gives you savings with cash flow flexibility.
              </p>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 3px 15px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginTop: 0, color: '#059669' }}>3. Use a CSP Partner</h3>
              <p style={{ color: '#666', lineHeight: '1.7' }}>
                Cloud Solution Providers often offer better pricing than buying direct from Microsoft, especially for
                volume purchases. They can also provide consolidated billing and dedicated support.
              </p>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 3px 15px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginTop: 0, color: '#059669' }}>4. Audit Regularly</h3>
              <p style={{ color: '#666', lineHeight: '1.7' }}>
                Review your licenses quarterly. Remove unused licenses, downgrade users who don't need premium features,
                and check for duplicate licenses assigned to the same person.
              </p>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 3px 15px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginTop: 0, color: '#059669' }}>5. Check for Discounts</h3>
              <p style={{ color: '#666', lineHeight: '1.7' }}>
                Nonprofits get up to 100% off Business Basic and 75% off other plans. Educational institutions have
                separate discounted plans. Government organizations have dedicated pricing.
              </p>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 3px 15px rgba(0,0,0,0.08)' }}>
              <h3 style={{ marginTop: 0, color: '#059669' }}>6. Consider Frontline Plans</h3>
              <p style={{ color: '#666', lineHeight: '1.7' }}>
                For shift workers, retail staff, or employees without dedicated computers, Microsoft 365 F1/F3 plans
                start at just $2.25/user/month and include mobile Teams and basic apps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Migration Tips */}
      <section id="migration" className="content-section" style={{ background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Migration Considerations</h2>

          <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 3px 15px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginTop: 0 }}>Moving to Microsoft 365</h3>
            <p style={{ color: '#666', lineHeight: '1.7' }}>
              Whether you're migrating from on-premises Exchange, Google Workspace, or another email provider,
              planning your migration carefully ensures minimal disruption to your business.
            </p>

            <h4>Pre-Migration Checklist:</h4>
            <ul style={{ lineHeight: '1.8', color: '#444' }}>
              <li><strong>Inventory your data:</strong> Email, calendars, contacts, files, and shared drives</li>
              <li><strong>Clean up:</strong> Archive old emails, delete unnecessary files, remove inactive users</li>
              <li><strong>Document current setup:</strong> DNS records, email aliases, distribution groups, shared mailboxes</li>
              <li><strong>Plan your domain:</strong> Verify domain ownership in Microsoft 365 admin center</li>
              <li><strong>Choose migration method:</strong> Cutover (small orgs), staged, or hybrid migration</li>
              <li><strong>Set up pilot group:</strong> Test with a small group before full rollout</li>
            </ul>

            <h4>Common Migration Sources:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <strong>Google Workspace</strong>
                <p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: '#666' }}>Use Microsoft's migration tools or third-party solutions like BitTitan</p>
              </div>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <strong>On-Premises Exchange</strong>
                <p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: '#666' }}>Hybrid migration maintains coexistence during transition</p>
              </div>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                <strong>IMAP Email</strong>
                <p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: '#666' }}>Built-in IMAP migration for GoDaddy, Rackspace, etc.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Licensing FAQs */}
      <section id="faqs" className="content-section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Frequently Asked Questions</h2>
          <div className="faq-list">
            {licensingFaqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Need More Licenses Section */}
      <section id="contact" className="content-section" style={{ background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '15px' }}>Need More Licenses?</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '30px', color: '#666', textAlign: 'center' }}>
            We offer competitive pricing on Microsoft 365 licenses for businesses of all sizes.
            Fill out the form below for volume discounts and enterprise packages.
          </p>
          <ContactForm />
        </div>
      </section>

      {/* CTA Section */}
      <section className="content-section" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '700px' }}>
          <h2 style={{ color: 'white', marginBottom: '20px' }}>Try Microsoft 365 Free</h2>
          <p style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
            Enter our monthly giveaway for a chance to win a free Microsoft 365 Business Basic license.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/"
              className="submit-btn"
              style={{
                display: 'inline-block',
                textDecoration: 'none',
                background: 'white',
                color: '#667eea',
                padding: '15px 30px'
              }}
            >
              Enter Free Giveaway
            </Link>
            <Link
              to="/plan-finder"
              className="submit-btn"
              style={{
                display: 'inline-block',
                textDecoration: 'none',
                background: 'transparent',
                border: '2px solid white',
                color: 'white',
                padding: '15px 30px'
              }}
            >
              Find Your Plan
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LicensingGuidesPage

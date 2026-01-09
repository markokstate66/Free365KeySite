import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const faqs = [
  {
    question: 'Is this giveaway really free?',
    answer: 'Yes! There is absolutely no cost to enter. We monetize through advertisements on our website, which allows us to give away genuine Microsoft 365 subscriptions to our winners.'
  },
  {
    question: 'How do I enter?',
    answer: 'Simply register with your name, email address, and phone number, then verify your email. Once verified, you are automatically entered into all future monthly drawings.'
  },
  {
    question: 'Do I need to verify my email?',
    answer: 'Yes! Email verification is required to be eligible for the drawing. Unverified registrations are not included in the drawing. Once verified, your registration remains valid for all future drawings.'
  },
  {
    question: 'How often are winners selected?',
    answer: 'We conduct drawings on the 1st of every month. One winner is randomly selected from all verified registrations. Winners are notified directly via email.'
  },
  {
    question: 'What do winners receive?',
    answer: 'Winners receive a 1-month Microsoft 365 Business Basic subscription, which includes web and mobile versions of Word, Excel, PowerPoint, and Outlook, plus 1 TB OneDrive storage, 50 GB Exchange mailbox, and SharePoint access. Note: Does not include desktop Office apps or Microsoft Teams.'
  },
  {
    question: 'Is this legitimate?',
    answer: 'Absolutely. All subscriptions are genuine Microsoft 365 licenses provisioned through our authorized Cloud Solution Provider (CSP) partnership. They are fully legitimate and come with full Microsoft support.'
  },
  {
    question: 'Who is eligible to enter?',
    answer: 'US residents who are 18 years or older are eligible. One registration per person. Please review our Terms of Service for complete eligibility requirements.'
  },
  {
    question: 'How long do I have to claim my prize?',
    answer: 'Winners have 30 days from the notification date to respond and claim their prize. After 30 days, unclaimed prizes may be forfeited and awarded to another participant.'
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

function FAQPage() {
  return (
    <div>
      <SEO
        title="Giveaway FAQ"
        path="/giveaway/faq"
        description="Frequently asked questions about our free Microsoft 365 giveaway. Learn about eligibility, entry system, prizes, and how winners are selected."
      />
      <Header />

      <section className="hero" style={{ padding: '60px 20px' }}>
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about our Microsoft 365 giveaway</p>
        </div>
      </section>

      <section className="content-section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      <section className="content-section" style={{ background: '#f8f9fa' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h2>Still Have Questions?</h2>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Can't find the answer you're looking for? Feel free to reach out to us.
          </p>
          <a
            href="/licensing-guides#contact"
            className="submit-btn"
            style={{ display: 'inline-block', textDecoration: 'none', maxWidth: '300px' }}
          >
            Contact Us
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default FAQPage

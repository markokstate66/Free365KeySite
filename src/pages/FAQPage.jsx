import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AdBanner from '../components/AdBanner'

const faqs = [
  {
    question: 'Is this giveaway really free?',
    answer: 'Yes! There is absolutely no cost to enter our giveaway. We monetize through advertisements on our website, which allows us to give away genuine Microsoft 365 licenses to our winners.'
  },
  {
    question: 'How often are winners selected?',
    answer: 'We conduct random drawings every month. Winners are selected from all verified entries received during that month. We announce winners on our Past Winners page and notify them directly via email.'
  },
  {
    question: 'Can I enter multiple times?',
    answer: 'Each email address can only be registered once. However, your entry remains active month after month, so you\'re automatically entered into each subsequent drawing without needing to re-register.'
  },
  {
    question: 'How will I know if I win?',
    answer: 'Winners are notified via the email address they registered with. Make sure to check your spam folder! You\'ll receive instructions on how to claim your Microsoft 365 license key.'
  },
  {
    question: 'What version of Microsoft 365 do winners receive?',
    answer: 'Winners receive a Microsoft 365 Personal subscription, which includes Word, Excel, PowerPoint, Outlook, 1TB OneDrive storage, and can be used on up to 5 devices for one year.'
  },
  {
    question: 'Are the license keys legitimate?',
    answer: 'Absolutely. All license keys we provide are genuine Microsoft products purchased through authorized channels. They are fully legitimate and come with full Microsoft support.'
  },
  {
    question: 'Who is eligible to enter?',
    answer: 'Anyone 18 years or older can enter. The giveaway is open internationally, though some regional restrictions may apply. Please review our Terms of Service for complete eligibility requirements.'
  },
  {
    question: 'How long do I have to claim my prize?',
    answer: 'Winners have 30 days from the notification date to respond and claim their prize. After 30 days, unclaimed prizes may be forfeited and awarded to another participant.'
  },
  {
    question: 'Can I transfer my prize to someone else?',
    answer: 'Prizes are non-transferable and must be claimed by the registered participant. The license key will be issued to the email address used during registration.'
  },
  {
    question: 'How do you select winners?',
    answer: 'Winners are selected through a certified random number generator that picks from all verified entries. The selection process is completely random and fair.'
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
      <Header />

      <section className="hero" style={{ padding: '60px 20px' }}>
        <div className="container">
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about our Microsoft 365 giveaway</p>
        </div>
      </section>

      <AdBanner slot="faq-top" format="horizontal" />

      <section className="content-section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      <AdBanner slot="faq-middle" format="horizontal" />

      <section className="content-section" style={{ background: '#f8f9fa' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h2>Still Have Questions?</h2>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Can't find the answer you're looking for? Feel free to reach out to us.
          </p>
          <a
            href="mailto:support@free365key.com"
            className="submit-btn"
            style={{ display: 'inline-block', textDecoration: 'none', maxWidth: '300px' }}
          >
            Contact Support
          </a>
        </div>
      </section>

      <AdBanner slot="faq-bottom" format="horizontal" />

      <Footer />
    </div>
  )
}

export default FAQPage

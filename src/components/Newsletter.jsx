import { useState } from 'react'

function Newsletter({ variant = 'default' }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setStatus('error')
      setMessage('Please enter your email address')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Thanks for subscribing! Check your inbox for updates.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  if (variant === 'inline') {
    return (
      <div className="newsletter-inline">
        {status === 'success' ? (
          <div className="newsletter-success">
            <span className="success-icon">✓</span>
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="newsletter-input"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              className="submit-btn"
              style={{ maxWidth: '150px' }}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="newsletter-error">{message}</p>
        )}
      </div>
    )
  }

  return (
    <div className="newsletter-box">
      <div className="newsletter-icon">✉</div>
      <h3>Get Insider M365 Tips</h3>
      <p style={{ marginBottom: '15px' }}>
        Join our newsletter and get practical Microsoft 365 insights you won't find elsewhere.
      </p>

      <div style={{
        textAlign: 'left',
        background: 'rgba(99, 102, 241, 0.1)',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px',
        fontSize: '0.9rem'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '10px', color: '#4f46e5' }}>What you'll get:</div>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
          <li><strong>License optimization tips</strong> — Save money on your M365 subscription</li>
          <li><strong>Feature deep-dives</strong> — Get more from tools you already have</li>
          <li><strong>Migration guides</strong> — Smooth transitions without downtime</li>
          <li><strong>Early giveaway reminders</strong> — Never miss a drawing</li>
        </ul>
      </div>

      {status === 'success' ? (
        <div className="newsletter-success-box">
          <span className="success-icon">✓</span>
          <span>{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="newsletter-form-vertical">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="newsletter-input-full"
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            className="submit-btn"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe to Newsletter'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="newsletter-error">{message}</p>
      )}
      <p className="newsletter-disclaimer">Monthly updates only. No spam ever, unsubscribe anytime.</p>
    </div>
  )
}

export default Newsletter

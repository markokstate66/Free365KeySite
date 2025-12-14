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
      <h3>Stay Updated</h3>
      <p>Get the latest Microsoft 365 tips and giveaway updates delivered to your inbox.</p>

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
      <p className="newsletter-disclaimer">No spam, unsubscribe anytime.</p>
    </div>
  )
}

export default Newsletter

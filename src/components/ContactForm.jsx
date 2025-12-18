import { useState } from 'react'

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    licenseCount: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit')
      }

      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        licenseCount: '',
        message: ''
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="contact-success">
        <div className="success-icon">✓</div>
        <h3>Thank You!</h3>
        <p>We've received your inquiry and will be in touch within 1-2 business days.</p>
        <button
          className="submit-btn"
          onClick={() => setSuccess(false)}
          style={{ marginTop: '15px' }}
        >
          Send Another Inquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {error && <div className="error-message">{error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="contact-name">Name *</label>
          <input
            type="text"
            id="contact-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact-email">Email *</label>
          <input
            type="email"
            id="contact-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="contact-company">Company</label>
          <input
            type="text"
            id="contact-company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Your company"
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact-phone">Phone</label>
          <input
            type="tel"
            id="contact-phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="contact-licenses">How many licenses do you need?</label>
        <select
          id="contact-licenses"
          name="licenseCount"
          value={formData.licenseCount}
          onChange={handleChange}
        >
          <option value="">Select...</option>
          <option value="1-10">1-10 licenses</option>
          <option value="11-50">11-50 licenses</option>
          <option value="51-100">51-100 licenses</option>
          <option value="101-500">101-500 licenses</option>
          <option value="500+">500+ licenses</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="contact-message">Message *</label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          placeholder="Tell us about your licensing needs..."
          rows={4}
        />
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Sending...' : 'Send Inquiry'}
      </button>
    </form>
  )
}

export default ContactForm

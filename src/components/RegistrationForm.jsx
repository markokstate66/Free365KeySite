import { useState } from 'react'

// Track events in Azure Application Insights
const trackEvent = (name, properties = {}) => {
  if (window.appInsights) {
    window.appInsights.trackEvent({ name, properties })
  }
}

function RegistrationForm({ onSuccess, onAlreadyRegistered, referredBy }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    jobTitle: '',
    agreeTerms: false,
    agreeMarketing: false,
    joinNewsletter: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          referredBy: referredBy || '',
          registeredAt: new Date().toISOString()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle duplicate email specially
        if (response.status === 409 && onAlreadyRegistered) {
          trackEvent('Registration_ReturningUser')
          onAlreadyRegistered(formData.email)
          return
        }
        trackEvent('Registration_Failed', { error: data.error })
        throw new Error(data.error || 'Registration failed')
      }

      trackEvent('Registration_Completed', {
        hasReferral: !!referredBy,
        joinedNewsletter: formData.joinNewsletter
      })
      onSuccess(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="John"
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="john.doe@company.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone Number *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="companyName">Company Name</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Acme Inc."
          />
        </div>
        <div className="form-group">
          <label htmlFor="jobTitle">Job Title</label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="IT Manager"
          />
        </div>
      </div>

      <div className="form-group">
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
          />
          <label htmlFor="agreeTerms">
            I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> *
          </label>
        </div>
      </div>

      <div className="form-group">
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="agreeMarketing"
            name="agreeMarketing"
            checked={formData.agreeMarketing}
            onChange={handleChange}
          />
          <label htmlFor="agreeMarketing">
            I agree to receive promotional emails and special offers about Microsoft licensing
          </label>
        </div>
      </div>

      <div className="form-group">
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="joinNewsletter"
            name="joinNewsletter"
            checked={formData.joinNewsletter}
            onChange={handleChange}
          />
          <label htmlFor="joinNewsletter">
            Subscribe to our newsletter for Microsoft 365 tips, tricks, and giveaway announcements
          </label>
        </div>
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? 'Submitting...' : 'Enter Giveaway'}
      </button>
    </form>
  )
}

export default RegistrationForm

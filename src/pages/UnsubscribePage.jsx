import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

function UnsubscribePage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('processing') // processing, success, error, no-email, resubscribed
  const [errorMessage, setErrorMessage] = useState('')
  const [resubscribing, setResubscribing] = useState(false)

  const email = searchParams.get('email')

  useEffect(() => {
    if (!email) {
      setStatus('no-email')
      return
    }

    const unsubscribe = async () => {
      try {
        const response = await fetch(`/api/unsubscribe?email=${encodeURIComponent(email)}`)
        const data = await response.json()

        if (response.ok) {
          setStatus('success')
        } else {
          setStatus('error')
          setErrorMessage(data.error || 'Failed to unsubscribe')
        }
      } catch (err) {
        setStatus('error')
        setErrorMessage('An unexpected error occurred')
      }
    }

    unsubscribe()
  }, [email])

  const handleResubscribe = async () => {
    if (!email || resubscribing) return

    setResubscribing(true)
    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        setStatus('resubscribed')
      } else {
        const data = await response.json()
        setErrorMessage(data.error || 'Failed to resubscribe')
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred')
    }
    setResubscribing(false)
  }

  return (
    <div>
      <SEO
        title="Unsubscribe"
        path="/unsubscribe"
        description="Unsubscribe from Free365Key newsletter emails."
        noindex={true}
      />
      <Header />

      <div className="container" style={{ padding: '60px 20px', minHeight: '60vh' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '50px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>

          {status === 'processing' && (
            <>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>...</div>
              <h1 style={{ marginBottom: '20px' }}>Processing...</h1>
              <p style={{ color: '#666' }}>Please wait while we process your request.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>✓</div>
              <h1 style={{ marginBottom: '20px', color: '#28a745' }}>Unsubscribed Successfully</h1>
              <p style={{ color: '#666', marginBottom: '30px' }}>
                You have been removed from our newsletter list. You will no longer receive promotional emails from us.
              </p>
              <p style={{ color: '#666', marginBottom: '30px' }}>
                Changed your mind?
              </p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={handleResubscribe}
                  disabled={resubscribing}
                  style={{
                    padding: '12px 30px',
                    background: '#28a745',
                    color: 'white',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: resubscribing ? 'not-allowed' : 'pointer',
                    opacity: resubscribing ? 0.7 : 1
                  }}
                >
                  {resubscribing ? 'Resubscribing...' : 'Resubscribe'}
                </button>
                <Link
                  to="/"
                  style={{
                    display: 'inline-block',
                    padding: '12px 30px',
                    background: '#00a4ef',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  Return to Homepage
                </Link>
              </div>
            </>
          )}

          {status === 'resubscribed' && (
            <>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>✓</div>
              <h1 style={{ marginBottom: '20px', color: '#28a745' }}>Resubscribed Successfully</h1>
              <p style={{ color: '#666', marginBottom: '30px' }}>
                Welcome back! You have been re-added to our newsletter list.
              </p>
              <Link
                to="/"
                style={{
                  display: 'inline-block',
                  padding: '12px 30px',
                  background: '#00a4ef',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Return to Homepage
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>!</div>
              <h1 style={{ marginBottom: '20px', color: '#dc3545' }}>Unsubscribe Failed</h1>
              <p style={{ color: '#666', marginBottom: '30px' }}>
                {errorMessage === 'Email not found in subscriber list'
                  ? "This email address was not found in our subscriber list. You may have already unsubscribed."
                  : `We encountered an error: ${errorMessage}`}
              </p>
              <Link
                to="/"
                style={{
                  display: 'inline-block',
                  padding: '12px 30px',
                  background: '#00a4ef',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Return to Homepage
              </Link>
            </>
          )}

          {status === 'no-email' && (
            <>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>?</div>
              <h1 style={{ marginBottom: '20px' }}>Missing Email</h1>
              <p style={{ color: '#666', marginBottom: '30px' }}>
                No email address was provided. Please use the unsubscribe link from your newsletter email.
              </p>
              <Link
                to="/"
                style={{
                  display: 'inline-block',
                  padding: '12px 30px',
                  background: '#00a4ef',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Return to Homepage
              </Link>
            </>
          )}

        </div>
      </div>

      <Footer />
    </div>
  )
}

export default UnsubscribePage

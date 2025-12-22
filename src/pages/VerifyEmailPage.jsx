import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('verifying') // verifying, success, already-verified, error
  const [firstName, setFirstName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    const id = searchParams.get('id')

    if (!token || !id) {
      setStatus('error')
      setErrorMessage('Invalid verification link. Please check your email and try again.')
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/verify-email?token=${token}&id=${id}`)
        const data = await response.json()

        if (response.ok) {
          if (data.alreadyVerified) {
            setStatus('already-verified')
          } else {
            setStatus('success')
            setFirstName(data.firstName || '')
          }
        } else {
          setStatus('error')
          setErrorMessage(data.error || 'Verification failed')
        }
      } catch (err) {
        setStatus('error')
        setErrorMessage('An unexpected error occurred')
      }
    }

    verifyEmail()
  }, [searchParams])

  return (
    <div>
      <SEO
        title="Verify Email"
        path="/verify-email"
        description="Verify your email to complete your giveaway registration."
        noindex={true}
      />
      <Header />

      <div className="container" style={{ padding: '60px 20px', minHeight: '60vh' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '50px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>

          {status === 'verifying' && (
            <>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>...</div>
              <h1 style={{ marginBottom: '20px' }}>Verifying Your Email</h1>
              <p style={{ color: '#666' }}>Please wait while we confirm your registration.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>✓</div>
              <h1 style={{ marginBottom: '20px', color: '#10b981' }}>Email Verified!</h1>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                {firstName ? `Thank you, ${firstName}! ` : ''}Your email has been confirmed and you're now officially entered in the Microsoft 365 giveaway.
              </p>
              <p style={{ color: '#666', marginBottom: '30px' }}>
                Winners are drawn on the 1st of every month. Good luck!
              </p>
              <Link
                to="/"
                style={{
                  display: 'inline-block',
                  padding: '12px 30px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Earn Bonus Entries
              </Link>
            </>
          )}

          {status === 'already-verified' && (
            <>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>✓</div>
              <h1 style={{ marginBottom: '20px', color: '#3b82f6' }}>Already Verified</h1>
              <p style={{ color: '#666', marginBottom: '30px' }}>
                Your email has already been confirmed. You're entered in the giveaway!
              </p>
              <Link
                to="/"
                style={{
                  display: 'inline-block',
                  padding: '12px 30px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Earn Bonus Entries
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>!</div>
              <h1 style={{ marginBottom: '20px', color: '#dc3545' }}>Verification Failed</h1>
              <p style={{ color: '#666', marginBottom: '30px' }}>
                {errorMessage}
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

export default VerifyEmailPage

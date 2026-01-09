import { useState } from 'react'

const SITE_URL = 'https://www.free365key.com'

function ShareReferral({ referralCode, referralCount, referralEntries }) {
  const [copied, setCopied] = useState(false)

  const referralLink = `${SITE_URL}/?ref=${referralCode}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div style={{
      marginTop: '25px',
      padding: '25px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>
        Share for +10 Entries Each!
      </h4>
      <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', opacity: 0.9 }}>
        When a friend signs up using your link and verifies their email, you earn +10 entries (valid for 6 drawings)!
      </p>

      {/* Stats */}
      {(referralCount > 0 || referralEntries > 0) && (
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginBottom: '15px',
          padding: '10px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '8px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{referralCount}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Referrals</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4ade80' }}>+{referralEntries}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Bonus Entries</div>
          </div>
        </div>
      )}

      {/* Referral Link */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '15px'
      }}>
        <input
          type="text"
          value={referralLink}
          readOnly
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: '8px',
            border: 'none',
            background: 'rgba(255,255,255,0.9)',
            color: '#333',
            fontSize: '0.85rem'
          }}
        />
        <button
          onClick={handleCopy}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: copied ? '#10b981' : 'white',
            color: copied ? 'white' : '#333',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

export default ShareReferral

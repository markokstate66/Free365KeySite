import { useState } from 'react'

const SITE_URL = 'https://www.free365key.com'

function ShareReferral({ referralCode, referralCount, referralEntries }) {
  const [copied, setCopied] = useState(false)

  const referralLink = `${SITE_URL}/?ref=${referralCode}`
  const shareText = "Enter for a chance to win a FREE Microsoft 365 license! No purchase necessary."

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralLink)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
    email: `mailto:?subject=${encodeURIComponent('Free Microsoft 365 Giveaway')}&body=${encodeURIComponent(`${shareText}\n\n${referralLink}`)}`
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
        When a friend signs up using your link and verifies their email, you earn +10 permanent entries!
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

      {/* Social Share Buttons */}
      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            background: '#1DA1F2',
            color: 'white',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.85rem'
          }}
        >
          Twitter
        </a>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            background: '#4267B2',
            color: 'white',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.85rem'
          }}
        >
          Facebook
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            background: '#0077B5',
            color: 'white',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.85rem'
          }}
        >
          LinkedIn
        </a>
        <a
          href={shareLinks.email}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            background: '#666',
            color: 'white',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.85rem'
          }}
        >
          Email
        </a>
      </div>
    </div>
  )
}

export default ShareReferral

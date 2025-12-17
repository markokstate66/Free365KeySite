import { useState, useEffect } from 'react'

function RewardedAd({ registrationId, onComplete, onClose }) {
  const [timeLeft, setTimeLeft] = useState(30)
  const [canClaim, setCanClaim] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanClaim(true)
    }
  }, [timeLeft])

  // Try to load AdSense ad
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.log('Ad load error:', e)
    }
  }, [])

  const handleClaim = async () => {
    setClaiming(true)
    setError('')

    try {
      const response = await fetch('/api/bonus-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to claim bonus entry')
      }

      setClaimed(true)
      if (onComplete) onComplete(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div className="rewarded-ad-overlay">
      <div className="rewarded-ad-modal">
        {!claimed ? (
          <>
            <div className="rewarded-ad-header">
              <h3>Watch Ad for Bonus Entry!</h3>
              <p>View this sponsored content to earn an extra entry into the giveaway.</p>
            </div>

            <div className="rewarded-ad-content">
              {/* AdSense Ad Unit */}
              <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', minHeight: '250px' }}
                data-ad-client="ca-pub-6676281664229738"
                data-ad-slot="auto"
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            </div>

            <div className="rewarded-ad-footer">
              {!canClaim ? (
                <div className="countdown">
                  <div className="countdown-circle">
                    <span>{timeLeft}</span>
                  </div>
                  <p>Please wait {timeLeft} seconds...</p>
                </div>
              ) : (
                <>
                  {error && <div className="error-message" style={{ marginBottom: '10px' }}>{error}</div>}
                  <button
                    className="submit-btn claim-btn"
                    onClick={handleClaim}
                    disabled={claiming}
                  >
                    {claiming ? 'Claiming...' : 'Claim Bonus Entry!'}
                  </button>
                </>
              )}
              <button className="skip-btn" onClick={onClose}>
                {canClaim ? 'Close' : 'Skip'}
              </button>
            </div>
          </>
        ) : (
          <div className="reward-success">
            <div className="success-icon">+1</div>
            <h3>Bonus Entry Added!</h3>
            <p>You now have an extra chance to win!</p>
            <button className="submit-btn" onClick={onClose}>
              Continue
            </button>
          </div>
        )}
      </div>

      <style>{`
        .rewarded-ad-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .rewarded-ad-modal {
          background: white;
          border-radius: 16px;
          max-width: 500px;
          width: 100%;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .rewarded-ad-header {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 20px;
          text-align: center;
        }

        .rewarded-ad-header h3 {
          margin: 0 0 8px 0;
          font-size: 1.4rem;
        }

        .rewarded-ad-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .rewarded-ad-content {
          padding: 20px;
          min-height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
        }

        .rewarded-ad-footer {
          padding: 20px;
          text-align: center;
          border-top: 1px solid #eee;
        }

        .countdown {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .countdown-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .countdown p {
          margin: 0;
          color: #666;
        }

        .claim-btn {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .skip-btn {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          margin-top: 10px;
          font-size: 0.9rem;
        }

        .skip-btn:hover {
          color: #666;
        }

        .reward-success {
          padding: 40px 20px;
          text-align: center;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          font-size: 2rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .reward-success h3 {
          color: #10b981;
          margin: 0 0 10px 0;
        }

        .reward-success p {
          color: #666;
          margin: 0 0 20px 0;
        }
      `}</style>
    </div>
  )
}

export default RewardedAd

import { useState, useEffect, useRef, useCallback } from 'react'

// GAM Ad Unit configuration
const GAM_NETWORK_ID = '23334346660'
const GAM_AD_UNIT_CODE = 'free365key_rewards'

// Google's sample VAST tag for testing (always returns an ad)
const TEST_AD_TAG = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator='

// Check for test mode via URL parameter: ?testAd=true
const isTestMode = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    return params.get('testAd') === 'true'
  }
  return false
}

// Track events in Azure Application Insights
const trackEvent = (name, properties = {}) => {
  if (window.appInsights) {
    window.appInsights.trackEvent({ name, properties })
  }
}

// Load IMA SDK script
const loadImaScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google?.ima) {
      console.log('[RewardedAd] IMA SDK already loaded')
      resolve()
      return
    }

    console.log('[RewardedAd] Loading IMA SDK...')
    const script = document.createElement('script')
    script.src = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js'
    script.async = true
    script.onload = () => {
      console.log('[RewardedAd] IMA SDK loaded successfully')
      // Give the SDK a moment to initialize
      setTimeout(() => {
        if (window.google?.ima) {
          resolve()
        } else {
          reject(new Error('IMA SDK loaded but not initialized'))
        }
      }, 100)
    }
    script.onerror = (e) => {
      console.error('[RewardedAd] Failed to load IMA SDK script:', e)
      reject(new Error('Failed to load IMA SDK - check if ad blocker is enabled'))
    }
    document.head.appendChild(script)
  })
}

function RewardedAd({ registrationId, onComplete, onClose }) {
  const [adState, setAdState] = useState('loading') // loading, ready, playing, completed, error
  const [error, setError] = useState('')
  const [adProgress, setAdProgress] = useState(0)
  const [adDuration, setAdDuration] = useState(0)

  const videoRef = useRef(null)
  const adContainerRef = useRef(null)
  const adsLoaderRef = useRef(null)
  const adsManagerRef = useRef(null)
  const adDisplayContainerRef = useRef(null)

  // Build the VAST tag URL for GAM rewarded ads
  const getAdTagUrl = useCallback(() => {
    // Use test ad tag if ?testAd=true is in URL
    if (isTestMode()) {
      console.log('[RewardedAd] Using TEST ad tag')
      return TEST_AD_TAG + Date.now()
    }

    const customData = encodeURIComponent(JSON.stringify({ registrationId }))
    const correlator = Date.now()
    const descriptionUrl = encodeURIComponent(window.location.href)

    return `https://pubads.g.doubleclick.net/gampad/ads?` +
      `iu=/${GAM_NETWORK_ID}/${GAM_AD_UNIT_CODE}` +
      `&description_url=${descriptionUrl}` +
      `&tfcd=0` +
      `&npa=0` +
      `&sz=400x300` +
      `&gdfp_req=1` +
      `&output=vast` +
      `&unviewed_position_start=1` +
      `&env=vp` +
      `&impl=s` +
      `&correlator=${correlator}` +
      `&cust_params=custom_data%3D${customData}`
  }, [registrationId])

  // Initialize IMA SDK and request ad
  useEffect(() => {
    let isMounted = true

    const initializeAds = async () => {
      try {
        await loadImaScript()
        if (!isMounted) return

        const google = window.google

        // Create ad display container
        adDisplayContainerRef.current = new google.ima.AdDisplayContainer(
          adContainerRef.current,
          videoRef.current
        )

        // Create ads loader
        adsLoaderRef.current = new google.ima.AdsLoader(adDisplayContainerRef.current)

        // Listen for ads manager loaded
        adsLoaderRef.current.addEventListener(
          google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
          (event) => {
            if (!isMounted) return

            const adsRenderingSettings = new google.ima.AdsRenderingSettings()
            adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true

            adsManagerRef.current = event.getAdsManager(videoRef.current, adsRenderingSettings)

            // Add event listeners
            adsManagerRef.current.addEventListener(google.ima.AdEvent.Type.LOADED, () => {
              if (isMounted) setAdState('ready')
            })

            adsManagerRef.current.addEventListener(google.ima.AdEvent.Type.STARTED, () => {
              if (isMounted) {
                setAdState('playing')
                trackEvent('Ad_Started')
              }
            })

            adsManagerRef.current.addEventListener(google.ima.AdEvent.Type.AD_PROGRESS, (e) => {
              if (isMounted) {
                const adData = e.getAdData()
                setAdProgress(adData.currentTime || 0)
                setAdDuration(adData.duration || 0)
              }
            })

            adsManagerRef.current.addEventListener(google.ima.AdEvent.Type.COMPLETE, () => {
              if (isMounted) {
                setAdState('completed')
                trackEvent('Ad_WatchCompleted')
                // SSV callback will be triggered server-side by Google
                // We show success and call onComplete
                if (onComplete) {
                  onComplete({ success: true, message: 'Ad completed - reward pending verification' })
                }
              }
            })

            adsManagerRef.current.addEventListener(google.ima.AdEvent.Type.SKIPPED, () => {
              if (isMounted) {
                trackEvent('Ad_Skipped')
                onClose()
              }
            })

            adsManagerRef.current.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, (e) => {
              if (isMounted) {
                console.error('Ad error:', e.getError())
                setError('Ad failed to load. Please try again.')
                setAdState('error')
                trackEvent('Ad_Error', { error: e.getError().toString() })
              }
            })

            // Initialize and start
            try {
              adsManagerRef.current.init(400, 300, google.ima.ViewMode.NORMAL)
            } catch (initError) {
              console.error('AdsManager init error:', initError)
              setError('Failed to initialize ad')
              setAdState('error')
            }
          },
          false
        )

        // Listen for ad errors
        adsLoaderRef.current.addEventListener(
          google.ima.AdErrorEvent.Type.AD_ERROR,
          (event) => {
            if (!isMounted) return
            console.error('AdsLoader error:', event.getError())
            setError('No ads available. Please try again later.')
            setAdState('error')
            trackEvent('Ad_LoadError', { error: event.getError().toString() })
          },
          false
        )

        // Request ads
        const adsRequest = new google.ima.AdsRequest()
        adsRequest.adTagUrl = getAdTagUrl()
        adsRequest.linearAdSlotWidth = 400
        adsRequest.linearAdSlotHeight = 300

        adsLoaderRef.current.requestAds(adsRequest)
        trackEvent('Ad_Requested')

      } catch (err) {
        if (isMounted) {
          console.error('[RewardedAd] IMA initialization error:', err)
          const errorMsg = err.message?.includes('ad blocker')
            ? 'Please disable your ad blocker to watch video ads'
            : 'Failed to load video ad system. Please try again.'
          setError(errorMsg)
          setAdState('error')
        }
      }
    }

    initializeAds()

    return () => {
      isMounted = false
      if (adsManagerRef.current) {
        adsManagerRef.current.destroy()
      }
      if (adsLoaderRef.current) {
        adsLoaderRef.current.destroy()
      }
    }
  }, [getAdTagUrl, onComplete, onClose])

  // Start playing the ad
  const playAd = () => {
    if (adDisplayContainerRef.current && adsManagerRef.current) {
      adDisplayContainerRef.current.initialize()
      try {
        adsManagerRef.current.start()
      } catch (e) {
        console.error('AdsManager start error:', e)
        setError('Failed to start ad')
        setAdState('error')
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const remainingTime = Math.max(0, adDuration - adProgress)

  return (
    <div className="rewarded-ad-overlay">
      <div className="rewarded-ad-modal">
        {adState === 'completed' ? (
          <div className="reward-success">
            <div className="success-icon">+2</div>
            <h3>Bonus Entries Added!</h3>
            <p>You earned 2 extra chances to win!</p>
            <button className="submit-btn" onClick={onClose}>
              Continue
            </button>
          </div>
        ) : (
          <>
            <div className="rewarded-ad-header">
              <h3>Watch Video for Bonus Entry!</h3>
              <p>Watch this short video to earn +2 bonus entries</p>
            </div>

            <div className="rewarded-ad-content">
              {/* Video container for IMA SDK */}
              <div
                ref={adContainerRef}
                className="ad-container"
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  aspectRatio: '4/3',
                  background: '#000',
                  position: 'relative'
                }}
              >
                <video
                  ref={videoRef}
                  style={{ width: '100%', height: '100%' }}
                  playsInline
                />
              </div>

              {/* Progress bar when playing */}
              {adState === 'playing' && adDuration > 0 && (
                <div className="ad-progress-container">
                  <div
                    className="ad-progress-bar"
                    style={{ width: `${(adProgress / adDuration) * 100}%` }}
                  />
                  <span className="ad-time-remaining">
                    {formatTime(remainingTime)} remaining
                  </span>
                </div>
              )}

              {/* Loading state */}
              {adState === 'loading' && (
                <div className="ad-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading video ad...</p>
                </div>
              )}

              {/* Error state */}
              {adState === 'error' && (
                <div className="ad-error">
                  <p>{error}</p>
                </div>
              )}
            </div>

            <div className="rewarded-ad-footer">
              {adState === 'loading' && (
                <p className="ad-status">Preparing your reward video...</p>
              )}

              {adState === 'ready' && (
                <button className="submit-btn play-btn" onClick={playAd}>
                  Play Video Ad
                </button>
              )}

              {adState === 'playing' && (
                <p className="ad-status">Watch until the end to claim your reward</p>
              )}

              {adState === 'error' && (
                <button className="submit-btn" onClick={onClose}>
                  Close
                </button>
              )}

              {adState !== 'playing' && adState !== 'completed' && (
                <button
                  className="skip-btn"
                  onClick={() => {
                    trackEvent('Ad_Dismissed', { state: adState })
                    onClose()
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </>
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
          max-width: 450px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
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
          padding: 15px;
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          gap: 15px;
        }

        .ad-container {
          border-radius: 8px;
          overflow: hidden;
        }

        .ad-progress-container {
          width: 100%;
          max-width: 400px;
          background: #e0e0e0;
          border-radius: 4px;
          height: 24px;
          position: relative;
          overflow: hidden;
        }

        .ad-progress-bar {
          height: 100%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          transition: width 0.3s ease;
        }

        .ad-time-remaining {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 0.8rem;
          font-weight: bold;
          color: #333;
        }

        .ad-loading, .ad-error {
          text-align: center;
          color: #666;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e0e0e0;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 10px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .ad-error p {
          color: #dc2626;
        }

        .rewarded-ad-footer {
          padding: 20px;
          text-align: center;
          border-top: 1px solid #eee;
        }

        .ad-status {
          margin: 0 0 10px 0;
          color: #666;
          font-size: 0.9rem;
        }

        .play-btn {
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

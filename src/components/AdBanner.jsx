import { useEffect } from 'react'

const ADSENSE_CLIENT_ID = 'ca-pub-6676281664229738'

function AdBanner({ slot, format = 'horizontal' }) {
  const isHorizontal = format === 'horizontal'

  useEffect(() => {
    try {
      if (window.adsbygoogle && ADSENSE_CLIENT_ID !== 'ca-pub-XXXXXXXXXXXXXXXX') {
        window.adsbygoogle.push({})
      }
    } catch (e) {
      console.error('AdSense error:', e)
    }
  }, [])

  // Show placeholder if AdSense not configured
  if (ADSENSE_CLIENT_ID === 'ca-pub-XXXXXXXXXXXXXXXX') {
    return (
      <div
        className={isHorizontal ? 'ad-banner' : 'ad-sidebar'}
        data-ad-slot={slot}
      >
        <span>Advertisement Space ({isHorizontal ? '728x90' : '300x250'})</span>
      </div>
    )
  }

  return (
    <div className={isHorizontal ? 'ad-banner' : 'ad-sidebar'}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: isHorizontal ? '728px' : '300px',
          height: isHorizontal ? '90px' : '250px',
        }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={isHorizontal ? 'horizontal' : 'rectangle'}
        data-full-width-responsive="true"
      />
    </div>
  )
}

export default AdBanner

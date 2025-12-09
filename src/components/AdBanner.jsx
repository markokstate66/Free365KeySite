function AdBanner({ slot, format = 'horizontal' }) {
  // This component is a placeholder for ad integration
  // Replace the inner content with your actual ad code (Google AdSense, etc.)

  const isHorizontal = format === 'horizontal'

  return (
    <div
      className={isHorizontal ? 'ad-banner' : 'ad-sidebar'}
      data-ad-slot={slot}
    >
      {/*
        Replace this with your ad network code, e.g.:

        Google AdSense:
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true">
        </ins>

        Then add the AdSense script to index.html
      */}
      <span>Advertisement Space ({isHorizontal ? '728x90' : '300x250'})</span>
    </div>
  )
}

export default AdBanner

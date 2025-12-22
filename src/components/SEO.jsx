import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://www.free365key.com'

const defaultSEO = {
  title: 'Free Microsoft 365 Key Giveaway',
  description: 'Register for a chance to win a FREE Microsoft 365 license key. Enter our giveaway today!',
  image: `${BASE_URL}/og-image.png`
}

function SEO({ title, description, path = '/', noindex = false }) {
  const pageTitle = title ? `${title} | Free365Key` : defaultSEO.title
  const pageDescription = description || defaultSEO.description
  const canonicalUrl = `${BASE_URL}${path}`

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter */}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:url" content={canonicalUrl} />
    </Helmet>
  )
}

export default SEO

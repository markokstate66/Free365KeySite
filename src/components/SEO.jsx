import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://www.free365key.com'

const defaultSEO = {
  title: 'Free365Key - Microsoft 365 Licensing Guide, Plan Finder & Resources',
  description: 'Your complete Microsoft 365 resource hub. Compare Business Basic, Standard, and Premium plans. Use our Plan Finder tool to choose the right license. Plus enter our monthly free license giveaway!',
  image: `${BASE_URL}/og-image.png`,
  imageAlt: 'Free365Key - Microsoft 365 Licensing Resources & Guides'
}

function SEO({ title, description, path = '/', noindex = false, image, imageAlt }) {
  const pageTitle = title ? `${title} | Free365Key` : defaultSEO.title
  const pageDescription = description || defaultSEO.description
  const canonicalUrl = `${BASE_URL}${path}`
  const pageImage = image || defaultSEO.image
  const pageImageAlt = imageAlt || defaultSEO.imageAlt

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
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:secure_url" content={pageImage} />
      <meta property="og:image:alt" content={pageImageAlt} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:image:alt" content={pageImageAlt} />
    </Helmet>
  )
}

export default SEO

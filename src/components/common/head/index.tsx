import NextHead from 'next/head'
import qs from 'querystring'
import type { HeadProps } from './types'

const DEFAULT_OG_IMAGE = 'https://mycv-online.vercel.app/og-image.png'
const DEFAULT_TITLE = 'Source The Sauce'

export function Head(props: HeadProps) {
  const {
    title,
    description,
    image = DEFAULT_OG_IMAGE,
    url,
    noIndex,
    og,
    twitter,
    ogCustom,
  } = props

  // Merge OG / Twitter meta
  const ogMeta = {
    title: og?.title || title || DEFAULT_TITLE,
    description: og?.description || description || '',
    image: og?.image || image,
  }

  const twitterMeta = {
    title: twitter?.title || ogMeta.title,
    description: twitter?.description || description || '',
    image: twitter?.image || image,
  }

  // Optional OG customizer query string
  const query = ogCustom ? qs.stringify(ogCustom) : ''

  const ogImage =
    ogMeta.image
      ? ogCustom && query
        ? `${ogMeta.image}${ogMeta.image.includes('?') ? '&' : '?'}${query}`
        : ogMeta.image
      : undefined

  const finalTitle = ogMeta.title || twitterMeta.title || DEFAULT_TITLE

  return (
    <NextHead>
      {/* Basic */}
      <title>{finalTitle}</title>
      {description && <meta name="description" content={description} />}

      {/* Robots / indexing control */}
      {noIndex && (
        <meta name="robots" content="noindex,nofollow" />
      )}

      {/* Canonical URL */}
      {url && <link rel="canonical" href={url} />}

      {/* Locale / language */}
      <meta name="language" content="en-GB" />
      <meta property="og:locale" content="en_GB" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      {url && <meta property="og:url" content={url} />}
      {ogMeta.title && <meta property="og:title" content={ogMeta.title} />}
      {ogMeta.description && (
        <meta property="og:description" content={ogMeta.description} />
      )}
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {twitterMeta.title && (
        <meta name="twitter:title" content={twitterMeta.title} />
      )}
      {twitterMeta.description && (
        <meta name="twitter:description" content={twitterMeta.description} />
      )}
      {twitterMeta.image && (
        <meta name="twitter:image" content={twitterMeta.image} />
      )}

      {/* Theming / icons */}
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" content="#000000" />

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link rel="icon" type="image/png" href="/favicon.ico" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
    </NextHead>
  )
}

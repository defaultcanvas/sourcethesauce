export interface BaseMeta {
  title?: string
  description?: string
  image?: string
}

export interface OgCustomParams {
  // Loose key/value so qs.stringify works with future keys
  [key: string]: string | number | boolean | undefined
  name?: string
  jobTitle?: string
  city?: string
  country?: string
  avatar?: string
}

export interface HeadProps extends BaseMeta {
  /**
   * Canonical URL for the page
   */
  url?: string

  /**
   * If true, add noindex/nofollow meta
   */
  noIndex?: boolean

  /**
   * Override defaults for OG tags
   */
  og?: BaseMeta

  /**
   * Override defaults for Twitter tags
   */
  twitter?: BaseMeta

  /**
   * Extra query params appended to the OG image URL
   * for dynamic OG generators.
   */
  ogCustom?: OgCustomParams
}

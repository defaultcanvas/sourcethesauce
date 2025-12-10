export interface HeadProps {
  // Page-level basics
  title?: string
  description?: string
  image?: string

  // Optional: canonical URL for OG / Twitter / SEO
  url?: string

  // Optional: flag to tell search engines not to index this page
  noIndex?: boolean

  // Optional overrides for Open Graph
  og?: {
    description?: string
    title?: string
    image?: string
  }

  // Optional overrides for Twitter cards
  twitter?: {
    description?: string
    title?: string
    image?: string
  }

  // Optional: custom OG image query params
  ogCustom?: {
    name?: string
    jobTitle?: string
    city?: string
    country?: string
    avatar?: string
  }
}

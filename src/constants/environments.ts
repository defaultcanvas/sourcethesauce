export const environments = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || '@generic-name',
  siteUrl: process.env.SITE_URL || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) || process.env.URL || 'http://localhost:3000',
  backend_url: process.env.NEXT_PUBLIC_BACKEND_URL,
  analytics: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  }
}

// Server-side only Stripe config (don't expose to client)
export const serverEnvironments = {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  }
} 

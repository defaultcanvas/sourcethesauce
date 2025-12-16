import { loadStripe } from '@stripe/stripe-js'
import { environments } from '@/constants/environments'

// Initialize Stripe with publishable key
let stripePromise: ReturnType<typeof loadStripe> | null = null

export const getStripe = () => {
  if (!stripePromise && environments.stripe.publishableKey) {
    stripePromise = loadStripe(environments.stripe.publishableKey)
  }
  return stripePromise
}

// Create payment intent via API
export async function createPaymentIntent(params: {
  amount: number
  currency?: string
  customerEmail?: string
  customerName?: string
  metadata?: Record<string, string>
  idempotencyKey?: string
}) {
  const response = await fetch('/api/stripe/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create payment intent')
  }

  return response.json() as Promise<{
    clientSecret: string
    paymentIntentId: string
  }>
}

import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { serverEnvironments } from '@/constants/environments'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(serverEnvironments.stripe.secretKey, {
  apiVersion: '2023-10-16',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      amount,
      currency = 'gbp',
      customerEmail,
      customerName,
      metadata = {},
      idempotencyKey,
    } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' })
    }

    // Amount should be in smallest currency unit (pence for GBP)
    const amountInPence = Math.round(amount * 100)

    console.log('Creating payment intent:', {
      amount: amountInPence,
      currency: currency.toLowerCase(),
      customerEmail,
      idempotencyKey,
    })

    // Create PaymentIntent with automatic payment methods
    // This will show all payment methods enabled in your Stripe Dashboard
    // including: cards, Klarna, PayPal, Revolut Pay, Link, etc.
    const paymentIntentOptions: Stripe.PaymentIntentCreateParams = {
      amount: amountInPence,
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'always',
      },
      metadata: {
        ...metadata,
        customerName,
        customerEmail,
      },
      receipt_email: customerEmail || undefined,
    }

    const requestOptions: Stripe.RequestOptions = {}
    if (idempotencyKey) {
      requestOptions.idempotencyKey = idempotencyKey
    }

    const paymentIntent = await stripe.paymentIntents.create(
      paymentIntentOptions,
      requestOptions
    )

    console.log('Payment intent created:', {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    })

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })

  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return res.status(500).json({
      error: error.message || 'Failed to create payment intent',
    })
  }
}

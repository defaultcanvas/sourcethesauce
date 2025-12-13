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
    } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' })
    }

    // Amount should be in smallest currency unit (pence for GBP)
    const amountInPence = Math.round(amount * 100)

    // Create PaymentIntent with metadata for order tracking
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPence,
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        ...metadata,
        customerName,
        customerEmail,
      },
      receipt_email: customerEmail || undefined,
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

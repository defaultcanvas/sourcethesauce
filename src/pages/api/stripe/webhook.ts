import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { serverEnvironments } from '@/constants/environments'
import { supabaseAdmin } from '@/lib/supabase'
import { buffer } from 'micro'

const stripe = new Stripe(serverEnvironments.stripe.secretKey, {
  apiVersion: '2023-10-16',
})

// Disable body parsing for webhook verification
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature']
  
  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' })
  }

  let event: Stripe.Event

  try {
    const rawBody = await buffer(req)
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      serverEnvironments.stripe.webhookSecret
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: `Webhook Error: ${err.message}` })
  }

  // Handle specific events
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('PaymentIntent succeeded:', paymentIntent.id)

      // Update order payment status if order_id is in metadata
      if (paymentIntent.metadata?.order_id) {
        const { error } = await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'paid',
            payment_id: paymentIntent.id,
            payment_method: 'stripe',
          })
          .eq('id', paymentIntent.metadata.order_id)

        if (error) {
          console.error('Failed to update order payment status:', error)
        }
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('PaymentIntent failed:', paymentIntent.id)
      
      // Update order if exists
      if (paymentIntent.metadata?.order_id) {
        const { error } = await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'failed',
          })
          .eq('id', paymentIntent.metadata.order_id)

        if (error) {
          console.error('Failed to update order payment status:', error)
        }
      }
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      console.log('Charge refunded:', charge.id)
      
      // Find order by payment_id and update status
      if (charge.payment_intent) {
        const { error } = await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'refunded',
          })
          .eq('payment_id', charge.payment_intent)

        if (error) {
          console.error('Failed to update order refund status:', error)
        }
      }
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return res.status(200).json({ received: true })
}

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
    const { paymentIntentId } = req.body

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID is required' })
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' })
    }

    // Find the order with this payment intent ID
    const { data: order, error: findError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('payment_id', paymentIntentId)
      .single()

    if (findError || !order) {
      console.error('Order not found:', findError)
      return res.status(404).json({ error: 'Order not found' })
    }

    // Update order status to confirmed
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id)

    if (updateError) {
      console.error('Error updating order:', updateError)
      return res.status(500).json({ error: 'Failed to update order' })
    }

    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        status: 'confirmed',
      },
    })

  } catch (error: any) {
    console.error('Error confirming payment:', error)
    return res.status(500).json({
      error: error.message || 'Failed to confirm payment',
    })
  }
}

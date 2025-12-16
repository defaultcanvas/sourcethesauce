import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Send admin notification when order status changes
 * Can be triggered by webhook or order updates
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { orderId, orderNumber, status, paymentStatus, amount, customerName } = req.body

    if (!orderId || !orderNumber) {
      return res.status(400).json({ error: 'Order ID and number required' })
    }

    // Log notification (can be extended to send emails/Telegram/WhatsApp)
    console.log('📢 ADMIN NOTIFICATION:', {
      orderId,
      orderNumber,
      status,
      paymentStatus,
      amount,
      customerName,
      timestamp: new Date().toISOString(),
    })

    // TODO: Add email notification
    // await sendAdminEmail({
    //   subject: `Order ${orderNumber} - ${status}`,
    //   message: `Customer: ${customerName}\nAmount: £${amount}\nStatus: ${status}\nPayment: ${paymentStatus}`
    // })

    // TODO: Add Telegram notification
    // await sendTelegramNotification({
    //   message: `🔔 New Order: ${orderNumber}\n💰 Amount: £${amount}\n👤 ${customerName}\n📊 Status: ${status}`
    // })

    // Store notification in database for admin panel
    await supabaseAdmin.from('admin_notifications').insert({
      type: 'order_status',
      title: `Order ${orderNumber} - ${status}`,
      message: `Customer: ${customerName}, Amount: £${amount}, Payment: ${paymentStatus}`,
      order_id: orderId,
      is_read: false,
      created_at: new Date().toISOString(),
    }).catch((err: any) => {
      // Table might not exist yet - that's OK
      console.log('Note: admin_notifications table not found (optional):', err)
    })

    return res.status(200).json({ success: true })

  } catch (error: any) {
    console.error('Error sending notification:', error)
    return res.status(500).json({ error: error.message })
  }
}

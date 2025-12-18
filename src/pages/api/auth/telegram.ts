import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyTelegramWebAppData, parseTelegramInitData, isTelegramAuthValid } from '@/lib/telegram/verify'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Ensure server-side Supabase admin client is available
    if (!supabaseAdmin) {
      console.error('Supabase admin client unavailable. Check SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL env vars.')
      return res.status(500).json({ error: 'Server misconfigured: Supabase admin client unavailable' })
    }

    const { initData } = req.body

    if (!initData) {
      return res.status(400).json({ error: 'Missing initData' })
    }

    // Verify the data came from Telegram (skip in development if no bot token)
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (botToken) {
      const isValid = verifyTelegramWebAppData(initData)
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid Telegram data' })
      }
    }

    // Parse the init data
    const parsed = parseTelegramInitData(initData)
    if (!parsed || !parsed.user) {
      return res.status(400).json({ error: 'Could not parse user data' })
    }

    // Check if auth is not expired (24 hours)
    if (!isTelegramAuthValid(parsed.authDate)) {
      return res.status(401).json({ error: 'Authentication expired' })
    }

    const telegramUser = parsed.user

    // Check if user exists
    const { data: existingUser } = await supabaseAdmin
      .from('telegram_users')
      .select('*')
      .eq('telegram_id', String(telegramUser.id))
      .single()

    if (existingUser) {
      // Update existing user
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from('telegram_users')
        .update({
          username: telegramUser.username || null,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name || null,
          photo_url: telegramUser.photo_url || null,
          language_code: telegramUser.language_code || null,
          is_premium: telegramUser.is_premium || false,
          updated_at: new Date().toISOString(),
        })
        .eq('telegram_id', String(telegramUser.id))
        .select()
        .single()

      if (updateError) {
        console.error('Update error:', updateError)
        return res.status(500).json({ error: 'Failed to update user profile' })
      }

      return res.status(200).json({ 
        user: updatedUser,
        isNewUser: false,
      })
    } else {
      // Insert new user
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from('telegram_users')
        .insert({
          telegram_id: String(telegramUser.id),
          username: telegramUser.username || null,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name || null,
          photo_url: telegramUser.photo_url || null,
          language_code: telegramUser.language_code || null,
          is_premium: telegramUser.is_premium || false,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Insert error:', insertError)
        return res.status(500).json({ error: 'Failed to create user profile' })
      }

      return res.status(201).json({ 
        user: newUser,
        isNewUser: true,
      })
    }

  } catch (error) {
    console.error('Telegram auth error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

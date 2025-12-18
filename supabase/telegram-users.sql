-- =============================================
-- TELEGRAM USERS TABLE + POLICIES (Minimal Setup)
-- Run this in Supabase SQL Editor
-- =============================================

-- Create table
CREATE TABLE IF NOT EXISTS telegram_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telegram_id TEXT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  photo_url TEXT,
  language_code TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Helpful index for lookups by telegram_id
CREATE INDEX IF NOT EXISTS idx_telegram_users_telegram_id ON telegram_users(telegram_id);

-- Enable row level security
ALTER TABLE telegram_users ENABLE ROW LEVEL SECURITY;

-- Public read (optional for display; can remove if not desired)
DROP POLICY IF EXISTS "telegram_users_public_read" ON telegram_users;
CREATE POLICY "telegram_users_public_read" ON telegram_users
  FOR SELECT USING (true);

-- Allow service role to insert/update (admin ops)
DROP POLICY IF EXISTS "telegram_users_service_insert" ON telegram_users;
CREATE POLICY "telegram_users_service_insert" ON telegram_users
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "telegram_users_service_update" ON telegram_users;
CREATE POLICY "telegram_users_service_update" ON telegram_users
  FOR UPDATE USING (true);

-- Trigger to keep updated_at fresh
DROP TRIGGER IF EXISTS update_telegram_users_updated_at ON telegram_users;
CREATE TRIGGER update_telegram_users_updated_at BEFORE UPDATE ON telegram_users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DO $$ BEGIN
  RAISE NOTICE '✅ telegram_users table present + policies applied';
END $$;
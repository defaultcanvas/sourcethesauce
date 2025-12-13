-- =============================================
-- STRIPE PAYMENT COLUMNS MIGRATION
-- Run this in Supabase SQL Editor to add Stripe payment fields
-- =============================================

-- Add payment_method column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Add payment_id column to orders table (for Stripe payment intent ID)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_id TEXT;

-- Optional: Add index on payment_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('payment_method', 'payment_id');

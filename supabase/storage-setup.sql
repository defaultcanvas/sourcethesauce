-- =============================================
-- STORAGE BUCKET SETUP FOR TELEGRAM MINI APP
-- Run this in Supabase SQL Editor
-- =============================================

-- Create the images bucket (used by application code)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];

-- =============================================
-- STORAGE POLICIES
-- =============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access for images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update access for images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete access for images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete access for product images" ON storage.objects;

-- Allow PUBLIC read access to images (no authentication required)
CREATE POLICY "Public read access for images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload access for images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to update
CREATE POLICY "Authenticated update access for images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated delete access for images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Storage bucket "images" configured successfully!';
  RAISE NOTICE '📁 Bucket: images (PUBLIC read access enabled)';
  RAISE NOTICE '📏 Max file size: 10MB';
  RAISE NOTICE '🖼️ Allowed types: JPEG, JPG, PNG, WebP, GIF';
  RAISE NOTICE '🔓 Public read access: Enabled (no auth required for viewing images)';
  RAISE NOTICE '🔐 Write access: Authenticated users only';
END $$;

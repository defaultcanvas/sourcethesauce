-- =============================================
-- FIX STORAGE BUCKET CONFIGURATION
-- Run this in Supabase SQL Editor to fix 402 errors
-- =============================================

-- Step 1: Create or update the 'images' bucket with PUBLIC access
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true, -- MUST be true for public access
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
  public = true, -- Ensure it's public
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];

-- Step 2: Drop all existing storage policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access for images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload access for images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update access for images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete access for images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete access for product images" ON storage.objects;

-- Step 3: Create new policies with proper PUBLIC access

-- Allow ANYONE (including anonymous users) to read/view images
CREATE POLICY "Public read access for images"
ON storage.objects 
FOR SELECT
TO public
USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated upload access for images"
ON storage.objects 
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to update images
CREATE POLICY "Authenticated update access for images"
ON storage.objects 
FOR UPDATE
TO authenticated
USING (bucket_id = 'images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated delete access for images"
ON storage.objects 
FOR DELETE
TO authenticated
USING (bucket_id = 'images');

-- Step 4: Verify configuration
DO $$
DECLARE
  bucket_exists BOOLEAN;
  bucket_is_public BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM storage.buckets WHERE id = 'images') INTO bucket_exists;
  SELECT public FROM storage.buckets WHERE id = 'images' INTO bucket_is_public;
  
  IF NOT bucket_exists THEN
    RAISE EXCEPTION '❌ ERROR: Bucket "images" was not created!';
  END IF;
  
  IF NOT bucket_is_public THEN
    RAISE EXCEPTION '❌ ERROR: Bucket "images" is not public! Set public=true in storage.buckets';
  END IF;
  
  RAISE NOTICE '✅ Storage bucket "images" is properly configured!';
  RAISE NOTICE '📁 Bucket: images';
  RAISE NOTICE '🔓 Public: YES (bucket public flag is enabled)';
  RAISE NOTICE '📏 Max file size: 10MB';
  RAISE NOTICE '🖼️ Allowed types: JPEG, JPG, PNG, WebP, GIF';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Storage policies created:';
  RAISE NOTICE '   - Public read access (no auth required)';
  RAISE NOTICE '   - Authenticated users can upload/update/delete';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 All done! Images should now work in Telegram app.';
END $$;

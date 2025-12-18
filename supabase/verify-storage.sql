-- =============================================
-- VERIFY STORAGE BUCKET CONFIGURATION
-- Run this to check if storage is properly set up
-- =============================================

-- Check if the 'images' bucket exists and is public
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE id = 'images';

-- Expected result:
-- id: 'images'
-- name: 'images'  
-- public: true  <-- MUST BE TRUE
-- file_size_limit: 10485760 (10MB)
-- allowed_mime_types: {image/jpeg,image/png,image/webp,image/gif,image/jpg}

-- Check storage policies
SELECT 
  policyname,
  cmd,
  qual,
  with_check,
  roles
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname ILIKE '%images%';

-- Expected to see at least:
-- 1. "Public read access for images" - SELECT policy for 'public' role
-- 2. "Authenticated upload access for images" - INSERT policy
-- 3. "Authenticated update access for images" - UPDATE policy
-- 4. "Authenticated delete access for images" - DELETE policy

# Fixing Image 402 Errors in Telegram App

## Problem
Images are showing **HTTP 402 (Payment Required)** errors in the Telegram app but work fine in the browser.

## Root Causes
1. **Bucket name mismatch**: Code uses `'images'` bucket but SQL setup created `'product-images'` bucket
2. **Bucket not marked as public**: The bucket's `public` flag must be `true` in `storage.buckets` table
3. **Missing or incorrect storage policies**: Need proper RLS policies for public read access

## Solution

### Step 1: Run the Fix SQL Script
Execute `/workspaces/sourcethesauce/supabase/fix-storage.sql` in your Supabase SQL Editor:

```bash
# Or copy and paste the contents into Supabase Dashboard > SQL Editor
```

This script will:
- ✅ Create/update the `images` bucket with `public = true`
- ✅ Set up proper storage policies for public read access
- ✅ Allow authenticated users to upload/update/delete
- ✅ Verify the configuration

### Step 2: Verify in Supabase Dashboard

1. Go to **Storage** in Supabase Dashboard
2. Check that the **`images`** bucket exists
3. Click on the bucket settings
4. Verify **"Public bucket"** is toggled **ON**
5. Check **Policies** tab to see the policies are created

### Step 3: Test Image Upload

1. Upload a new product with an image
2. Check if the image appears in Telegram app
3. The image URL should work without authentication

## Why 402 Instead of 404?

Supabase returns HTTP 402 when:
- The bucket exists but is not properly configured
- The bucket's `public` flag is `false`
- There are policy restrictions
- Billing/quota issues (less common)

## Bucket Configuration

| Setting | Value |
|---------|-------|
| Bucket ID | `images` |
| Public Flag | `true` (CRITICAL) |
| Max File Size | 10MB |
| Allowed Types | JPEG, JPG, PNG, WebP, GIF |
| Read Access | Public (no auth) |
| Write Access | Authenticated only |

## Storage Policies Created

```sql
-- Anyone can read/view images (including anonymous Telegram users)
"Public read access for images" - SELECT - public

-- Only authenticated users can upload
"Authenticated upload access for images" - INSERT - authenticated

-- Only authenticated users can update
"Authenticated update access for images" - UPDATE - authenticated

-- Only authenticated users can delete
"Authenticated delete access for images" - DELETE - authenticated
```

## Testing URLs

After fixing, your image URLs should work like this:

```
https://[PROJECT].supabase.co/storage/v1/object/public/images/products/[filename].jpeg
```

The `/public/` in the URL indicates it's from a public bucket.

## Common Issues

### Images still return 402
1. Verify `public = true` in the database:
   ```sql
   SELECT id, name, public FROM storage.buckets WHERE id = 'images';
   ```
2. Check if policies are created:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
   ```

### "Bucket not found" errors
- The application code uses `'images'` as the bucket name
- Make sure the bucket ID is exactly `'images'` (not `'product-images'`)

### Images work in browser but not Telegram
- Browser might be using cached credentials
- Telegram app requires true public access (no auth headers)
- Make sure the bucket's `public` flag is `true`

## Prevention

When creating storage buckets in the future:
1. Always set `public = true` if images need public access
2. Match bucket names between SQL setup and application code
3. Create policies with `TO public` for anonymous access
4. Test URLs in incognito/private browsing mode

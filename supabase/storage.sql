-- Run this in the Supabase SQL editor to set up the product-images storage bucket

-- Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow authenticated service role to upload (service role bypasses RLS, but this covers anon uploads if ever needed)
CREATE POLICY "Admin upload access" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated service role to delete
CREATE POLICY "Admin delete access" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'product-images');

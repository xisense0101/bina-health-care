-- Supabase Storage Setup for Job Applications
-- Run these commands in your Supabase SQL Editor

-- Note: Bucket creation is done via Supabase Dashboard UI
-- Go to Storage > New Bucket > Name: "job-applications" > Public: Yes

-- Storage Policies for job-applications bucket

-- 1. Allow public to upload resume files
CREATE POLICY "Allow public to upload resumes"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'job-applications' AND
  (storage.foldername(name))[1] = 'resumes'
);

-- 2. Allow public to read/download resume files
CREATE POLICY "Allow public to download resumes"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'job-applications' AND
  (storage.foldername(name))[1] = 'resumes'
);

-- Optional: Allow admins to delete old resume files
CREATE POLICY "Allow authenticated users to delete resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'job-applications');

-- Optional: View all uploaded files
-- SELECT * FROM storage.objects WHERE bucket_id = 'job-applications';

-- Optional: Delete old files (older than 90 days)
-- DELETE FROM storage.objects 
-- WHERE bucket_id = 'job-applications' 
-- AND created_at < NOW() - INTERVAL '90 days';

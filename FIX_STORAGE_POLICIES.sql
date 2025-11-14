-- FIX STORAGE POLICIES - Run this if you get RLS errors when uploading images
-- This removes all RLS restrictions to allow the admin panel to upload images

-- ============= CREATE IMAGES BUCKET (if not exists) =============
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ============= DROP EXISTING STORAGE POLICIES (if any) =============
DROP POLICY IF EXISTS "Public can read images" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Public can update images" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes" ON storage.objects;

-- ============= CREATE NEW STORAGE POLICIES =============
-- Allow anyone to read images (for website display)
CREATE POLICY "Public can read images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

-- Allow anyone to upload images (no authentication required)
CREATE POLICY "Public can upload images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' );

-- Allow anyone to update images
CREATE POLICY "Public can update images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'images' );

-- Allow anyone to delete images
CREATE POLICY "Public can delete images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' );

-- ============= FIX TABLE POLICIES (remove auth requirement) =============
-- Drop old authenticated-only policies
DROP POLICY IF EXISTS "Allow authenticated write access on site_settings" ON site_settings;
DROP POLICY IF EXISTS "Allow authenticated write access on hero_section" ON hero_section;
DROP POLICY IF EXISTS "Allow authenticated full access on hero_images" ON hero_images;
DROP POLICY IF EXISTS "Allow authenticated full access on gallery_images" ON gallery_images;
DROP POLICY IF EXISTS "Allow authenticated full access on team_members" ON team_members;
DROP POLICY IF EXISTS "Allow authenticated full access on locations" ON locations;
DROP POLICY IF EXISTS "Allow authenticated full access on services" ON services;
DROP POLICY IF EXISTS "Allow authenticated full access on testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow authenticated full access on why_choose_us" ON why_choose_us;

-- Create new policies that allow all operations without authentication
CREATE POLICY "Allow all operations on site_settings" ON site_settings FOR ALL USING (true);
CREATE POLICY "Allow all operations on hero_section" ON hero_section FOR ALL USING (true);
CREATE POLICY "Allow all operations on hero_images" ON hero_images FOR ALL USING (true);
CREATE POLICY "Allow all operations on gallery_images" ON gallery_images FOR ALL USING (true);
CREATE POLICY "Allow all operations on team_members" ON team_members FOR ALL USING (true);
CREATE POLICY "Allow all operations on locations" ON locations FOR ALL USING (true);
CREATE POLICY "Allow all operations on services" ON services FOR ALL USING (true);
CREATE POLICY "Allow all operations on testimonials" ON testimonials FOR ALL USING (true);
CREATE POLICY "Allow all operations on why_choose_us" ON why_choose_us FOR ALL USING (true);

-- Success message
SELECT 'Storage policies fixed! You can now upload images without RLS errors.' as message;

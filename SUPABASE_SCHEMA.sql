-- Bina Adult Care - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to create all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Site Settings Table
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name VARCHAR(255) DEFAULT 'Bina Adult Care',
  tagline TEXT,
  description TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  facebook_url VARCHAR(500),
  instagram_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  twitter_url VARCHAR(500),
  business_hours JSONB, -- Store as JSON: {"monday": "9AM-5PM", ...}
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (site_name, tagline, description, phone, email, address) 
VALUES (
  'Bina Adult Care',
  'Compassionate Care for Senior Adults',
  'Professional residential and home care services for senior adults in Nepal. 24/7 care with dignity and respect.',
  '+977-XXXXXXXXXX',
  'info@binaadultcare.com',
  'Kathmandu, Nepal'
);

-- Hero Section Table
CREATE TABLE hero_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  badge TEXT DEFAULT 'Trusted Senior Care',
  headline TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default hero section
INSERT INTO hero_section (headline, description) 
VALUES (
  'Compassionate Care for Your Loved Ones',
  'Providing professional residential and home care services to senior adults with dignity, respect, and compassion. Available 24/7 in Nepal.'
);

-- Hero Images Table
CREATE TABLE hero_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Images Table
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  category VARCHAR(100), -- 'Facility', 'Residents', 'Activities', 'Care', 'Medical', 'Home Care'
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members Table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  bio TEXT,
  image_url TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Locations Table (for multiple locations)
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Nepal',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone VARCHAR(50),
  email VARCHAR(255),
  description TEXT,
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services Table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  features JSONB, -- Array of features: ["Feature 1", "Feature 2", ...]
  eligibility TEXT,
  pricing TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default services
INSERT INTO services (title, slug, description, features) 
VALUES 
(
  'Residential Care',
  'residential-care',
  'A warm, home-like environment with 24/7 professional care, social activities, and comprehensive medical support.',
  '["Private and semi-private rooms", "24/7 nursing care and supervision", "Nutritious meals and dietary management", "Daily activities and social engagement", "Medical monitoring and medication management"]'
),
(
  'Home Care',
  'home-care',
  'Professional care services delivered in the comfort and familiarity of your loved one''s own home.',
  '["Personalized care plans", "Certified caregivers and nurses", "Assistance with daily activities", "Companionship and emotional support", "Medication reminders and health monitoring"]'
);

-- Testimonials Table
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote TEXT NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_role VARCHAR(255),
  author_image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Why Choose Us Table
CREATE TABLE why_choose_us (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(100), -- Lucide icon name like 'Heart', 'Award', etc.
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default why choose us items
INSERT INTO why_choose_us (title, description, icon, display_order) 
VALUES 
('Compassionate Care', 'Every resident receives personalized attention with dignity and respect.', 'Heart', 1),
('Experienced Team', 'Certified professionals with years of experience in senior care.', 'Award', 2),
('24/7 Availability', 'Round-the-clock care and support whenever you need us.', 'Clock', 3),
('Safe Environment', 'Secure facilities with medical monitoring and emergency response.', 'Shield', 4);

-- Create indexes for better query performance
CREATE INDEX idx_gallery_images_category ON gallery_images(category);
CREATE INDEX idx_gallery_images_active ON gallery_images(is_active);
CREATE INDEX idx_team_members_active ON team_members(is_active);
CREATE INDEX idx_locations_active ON locations(is_active);
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX idx_why_choose_us_active ON why_choose_us(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at on all tables
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hero_section_updated_at BEFORE UPDATE ON hero_section FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hero_images_updated_at BEFORE UPDATE ON hero_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_images_updated_at BEFORE UPDATE ON gallery_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_why_choose_us_updated_at BEFORE UPDATE ON why_choose_us FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_choose_us ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read hero_section" ON hero_section FOR SELECT USING (true);
CREATE POLICY "Public can read active hero_images" ON hero_images FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active gallery_images" ON gallery_images FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active team_members" ON team_members FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active locations" ON locations FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active why_choose_us" ON why_choose_us FOR SELECT USING (is_active = true);

-- ============= ALLOW ALL OPERATIONS WITHOUT AUTHENTICATION =============
-- This removes RLS restrictions completely for the admin panel to work

-- Allow anyone to insert/update/delete on all tables
CREATE POLICY "Allow all operations on site_settings" ON site_settings FOR ALL USING (true);
CREATE POLICY "Allow all operations on hero_section" ON hero_section FOR ALL USING (true);
CREATE POLICY "Allow all operations on hero_images" ON hero_images FOR ALL USING (true);
CREATE POLICY "Allow all operations on gallery_images" ON gallery_images FOR ALL USING (true);
CREATE POLICY "Allow all operations on team_members" ON team_members FOR ALL USING (true);
CREATE POLICY "Allow all operations on locations" ON locations FOR ALL USING (true);
CREATE POLICY "Allow all operations on services" ON services FOR ALL USING (true);
CREATE POLICY "Allow all operations on testimonials" ON testimonials FOR ALL USING (true);
CREATE POLICY "Allow all operations on why_choose_us" ON why_choose_us FOR ALL USING (true);

-- ============= STORAGE BUCKET SETUP =============
-- Create the images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies: Allow public access to upload/read/update/delete images
CREATE POLICY "Public can read images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );

CREATE POLICY "Public can upload images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'images' );

CREATE POLICY "Public can update images"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'images' );

CREATE POLICY "Public can delete images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'images' );

-- For admin access, you'll need to create policies based on authenticated users
-- These will be added after Clerk integration is set up
-- Example: CREATE POLICY "Authenticated users can manage all" ON table_name FOR ALL USING (auth.role() = 'authenticated');

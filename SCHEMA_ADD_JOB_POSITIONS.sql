-- Add Job Positions Table
-- Run this SQL in your Supabase SQL Editor to add the job_positions table

-- Create Job Positions Table
CREATE TABLE job_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for active positions
CREATE INDEX idx_job_positions_active ON job_positions(is_active);
CREATE INDEX idx_job_positions_display_order ON job_positions(display_order);

-- Insert default job positions
INSERT INTO job_positions (title, slug, display_order, is_active) VALUES
  ('Registered Nurse (RN)', 'registered-nurse', 1, true),
  ('Certified Nursing Assistant (CNA)', 'certified-nursing-assistant', 2, true),
  ('Caregiver', 'caregiver', 3, true),
  ('Activity Coordinator', 'activity-coordinator', 4, true),
  ('Kitchen Staff', 'kitchen-staff', 5, true),
  ('Housekeeping Staff', 'housekeeping-staff', 6, true);

-- Note: RLS is disabled because the admin panel is already protected by Clerk authentication
-- If you need RLS, you'll need to set up Supabase Auth integration with Clerk
-- For now, relying on application-level auth (Clerk) for admin routes

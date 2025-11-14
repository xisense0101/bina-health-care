-- Fix business_hours column to be TEXT instead of JSONB
-- Run this in your Supabase SQL Editor if business_hours is causing issues

ALTER TABLE site_settings 
ALTER COLUMN business_hours TYPE TEXT;

-- Update the comment
COMMENT ON COLUMN site_settings.business_hours IS 'Business hours as formatted text (e.g., "Monday-Friday: 9AM-5PM")';

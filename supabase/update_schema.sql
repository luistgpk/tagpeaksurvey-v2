-- SQL script to update the database schema for the framing study
-- Run this in your Supabase SQL editor

-- Add new columns to demographics table
ALTER TABLE demographics
ADD COLUMN IF NOT EXISTS prolific_id TEXT,
ADD COLUMN IF NOT EXISTS selected_brand TEXT;

-- Add new columns to framing_study_results table
ALTER TABLE framing_study_results
ADD COLUMN IF NOT EXISTS intention_after_website_probable INTEGER,
ADD COLUMN IF NOT EXISTS intention_after_website_possible INTEGER,
ADD COLUMN IF NOT EXISTS intention_after_website_definitely_use INTEGER,
ADD COLUMN IF NOT EXISTS intention_after_website_frequent INTEGER,
ADD COLUMN IF NOT EXISTS website_view_time INTEGER;

-- Add comments for documentation
COMMENT ON COLUMN demographics.prolific_id IS 'Prolific participant ID';
COMMENT ON COLUMN demographics.selected_brand IS 'Brand selected by participant for email customization';
COMMENT ON COLUMN framing_study_results.intention_after_website_probable IS 'Intention to use - probable (1-7) after viewing website';
COMMENT ON COLUMN framing_study_results.intention_after_website_possible IS 'Intention to use - possible (1-7) after viewing website';
COMMENT ON COLUMN framing_study_results.intention_after_website_definitely_use IS 'Intention to use - definitely use (1-7) after viewing website';
COMMENT ON COLUMN framing_study_results.intention_after_website_frequent IS 'Intention to use - frequent (1-7) after viewing website';
COMMENT ON COLUMN framing_study_results.website_view_time IS 'Time spent viewing Tagpeak website in seconds';

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'demographics' 
    AND column_name IN ('prolific_id', 'selected_brand')
UNION ALL
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'framing_study_results' 
    AND column_name IN (
        'intention_after_website_probable',
        'intention_after_website_possible',
        'intention_after_website_definitely_use',
        'intention_after_website_frequent',
        'website_view_time'
    );


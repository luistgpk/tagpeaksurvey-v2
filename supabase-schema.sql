-- Supabase schema for survey application
-- Run this in your Supabase SQL editor

-- Create staircase_results table
CREATE TABLE IF NOT EXISTS staircase_results (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    indifference_points JSONB NOT NULL,
    raw_history JSONB NOT NULL,
    experience_quiz JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create demographics table
CREATE TABLE IF NOT EXISTS demographics (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    age INTEGER,
    gender TEXT,
    education TEXT,
    invests TEXT,
    habit TEXT,
    smokes TEXT,
    gambles TEXT,
    monthly_income TEXT,
    price_research TEXT,
    purchase_preference TEXT,
    used_traditional_cashback TEXT,
    experience_rating INTEGER,
    rating_justification TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_staircase_results_user_id ON staircase_results(user_id);
CREATE INDEX IF NOT EXISTS idx_staircase_results_timestamp ON staircase_results(timestamp);
CREATE INDEX IF NOT EXISTS idx_demographics_user_id ON demographics(user_id);
CREATE INDEX IF NOT EXISTS idx_demographics_timestamp ON demographics(timestamp);

-- Enable Row Level Security (RLS)
ALTER TABLE staircase_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE demographics ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (adjust as needed for your security requirements)
CREATE POLICY "Allow anonymous insert on staircase_results" ON staircase_results
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on demographics" ON demographics
    FOR INSERT WITH CHECK (true);

-- Optional: Allow read access for authenticated users only
-- CREATE POLICY "Allow authenticated read on staircase_results" ON staircase_results
--     FOR SELECT USING (auth.role() = 'authenticated');

-- CREATE POLICY "Allow authenticated read on demographics" ON demographics
--     FOR SELECT USING (auth.role() = 'authenticated');

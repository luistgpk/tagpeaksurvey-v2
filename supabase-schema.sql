-- Database schema for TagPeak Framing Study
-- Supabase project: tgpk-framing

-- Table: framing_study_results
-- Stores main survey results including framing condition, manipulation checks, and responses
CREATE TABLE IF NOT EXISTS framing_study_results (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    
    -- Framing condition (positive, negative, neutral)
    framing_condition TEXT NOT NULL CHECK (framing_condition IN ('positive', 'negative', 'neutral')),
    
    -- Exclusion questions (Ecrã 7)
    exclusion_benefit_type TEXT, -- 'Desconto', 'Cashback', 'Cupão', 'Nenhum destes'
    exclusion_percentage TEXT, -- '50%', '25%', '10%', '100%'
    
    -- Manipulation check (Ecrã 8)
    manipulation_loss_emphasis INTEGER, -- 1-7 scale
    manipulation_global_idea INTEGER, -- 1-7 scale
    
    -- Message involvement (Ecrã 9)
    involvement_interested INTEGER, -- 1-9 scale
    involvement_absorbed INTEGER, -- 1-9 scale
    involvement_attention INTEGER, -- 1-9 scale
    involvement_relevant INTEGER, -- 1-9 scale
    involvement_interesting INTEGER, -- 1-9 scale
    involvement_engaging INTEGER, -- 1-9 scale
    
    -- Intention to use (Ecrã 10)
    intention_probable INTEGER, -- 1-7 scale
    intention_possible INTEGER, -- 1-7 scale
    intention_definitely_use INTEGER, -- 1-7 scale
    intention_frequent INTEGER, -- 1-7 scale
    
    -- Ease of use (Ecrã 12)
    ease_difficult INTEGER, -- 1-7 Likert (reversed)
    ease_easy INTEGER, -- 1-7 Likert
    
    -- General product view (Ecrã 12)
    product_explain_easy INTEGER, -- 1-7 Likert
    product_description_easy INTEGER, -- 1-7 Likert
    
    -- Clarity in usage (Ecrã 12)
    clarity_steps_clear INTEGER, -- 1-7 Likert
    clarity_feel_secure INTEGER, -- 1-7 Likert
    
    -- Perceived advantage (Ecrã 13)
    advantage_more_advantageous INTEGER, -- 1-7 Likert
    advantage_better_position INTEGER, -- 1-7 Likert
    
    -- Willingness/interest to use (Ecrã 13)
    willingness_interest INTEGER, -- 1-7 Likert
    willingness_likely_use INTEGER, -- 1-7 Likert
    willingness_intend_future INTEGER, -- 1-7 Likert
    
    -- Concerns/doubts (Ecrã 14)
    concerns_text TEXT,
    
    -- User feedback (optional)
    user_feedback TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: demographics
-- Stores demographic and sociodemographic information
CREATE TABLE IF NOT EXISTS demographics (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    
    -- Age (Ecrã 2)
    age TEXT CHECK (age IN ('less_25', '26_35', '36_50', '51_65', '66_plus')),
    
    -- Gender (Ecrã 2)
    gender TEXT CHECK (gender IN ('mulher', 'homem', 'outro')),
    
    -- Monthly income (Ecrã 2)
    monthly_income TEXT CHECK (monthly_income IN ('less_750', '750_1500', '1500_3000', 'more_3000')),
    
    -- Shopping preference (Ecrã 2)
    shopping_preference TEXT CHECK (shopping_preference IN ('online', 'presencial')),
    
    -- First name (optional, Ecrã 2)
    first_name TEXT,
    
    -- Financial literacy (Ecrã 3)
    financial_literacy_q1 TEXT, -- Compound interest question
    financial_literacy_q2 TEXT, -- Inflation question
    financial_literacy_q3 TEXT, -- Diversification question
    
    -- Initial involvement (Ecrã 4)
    initial_involvement_important INTEGER, -- 1-7 scale (reversed)
    initial_involvement_relevant INTEGER, -- 1-7 scale (reversed)
    initial_involvement_meaningful INTEGER, -- 1-7 scale
    initial_involvement_valuable INTEGER, -- 1-7 scale
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_framing_results_user_id ON framing_study_results(user_id);
CREATE INDEX IF NOT EXISTS idx_framing_results_condition ON framing_study_results(framing_condition);
CREATE INDEX IF NOT EXISTS idx_framing_results_timestamp ON framing_study_results(timestamp);
CREATE INDEX IF NOT EXISTS idx_demographics_user_id ON demographics(user_id);
CREATE INDEX IF NOT EXISTS idx_demographics_timestamp ON demographics(timestamp);

-- Row Level Security (RLS) Policies
-- Enable RLS on both tables
ALTER TABLE framing_study_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE demographics ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role to do everything
CREATE POLICY "Service role can do everything on framing_study_results"
    ON framing_study_results
    FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything on demographics"
    ON demographics
    FOR ALL
    USING (auth.role() = 'service_role');

-- Policy: Allow anonymous inserts (for survey submissions)
CREATE POLICY "Allow anonymous inserts on framing_study_results"
    ON framing_study_results
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts on demographics"
    ON demographics
    FOR INSERT
    WITH CHECK (true);

-- Comments for documentation
COMMENT ON TABLE framing_study_results IS 'Main results table for framing effects study. Stores responses to all survey screens after demographics.';
COMMENT ON TABLE demographics IS 'Demographic and sociodemographic information collected at the beginning of the survey.';
COMMENT ON COLUMN framing_study_results.framing_condition IS 'The email framing condition assigned to the participant: positive, negative, or neutral';
COMMENT ON COLUMN framing_study_results.exclusion_benefit_type IS 'Answer to exclusion question about benefit type mentioned in email';
COMMENT ON COLUMN framing_study_results.exclusion_percentage IS 'Answer to exclusion question about cashback percentage';
COMMENT ON COLUMN framing_study_results.manipulation_loss_emphasis IS 'Manipulation check: emphasis on losses vs benefits (1=losses, 7=benefits)';
COMMENT ON COLUMN framing_study_results.manipulation_global_idea IS 'Manipulation check: global idea of message (1=not missing opportunity, 7=taking advantage)';


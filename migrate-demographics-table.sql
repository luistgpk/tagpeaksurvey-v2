-- ============================================
-- MIGRATION: Update demographics table for Framing Study
-- ============================================
-- The demographics table has the OLD schema. This updates it to match the new framing study.

-- Step 1: Backup existing data (optional - uncomment if you want to keep old data)
-- CREATE TABLE demographics_backup AS SELECT * FROM demographics;

-- Step 2: Drop old columns that are no longer needed
ALTER TABLE demographics 
    DROP COLUMN IF EXISTS education,
    DROP COLUMN IF EXISTS invests,
    DROP COLUMN IF EXISTS habit,
    DROP COLUMN IF EXISTS smokes,
    DROP COLUMN IF EXISTS gambles,
    DROP COLUMN IF EXISTS price_research,
    DROP COLUMN IF EXISTS purchase_preference,
    DROP COLUMN IF EXISTS used_traditional_cashback,
    DROP COLUMN IF EXISTS experience_rating,
    DROP COLUMN IF EXISTS rating_justification,
    DROP COLUMN IF EXISTS prolific_id;

-- Step 3: Change age column from INTEGER to TEXT (to match new values like '26_35')
-- Convert integer values to text format during type change
ALTER TABLE demographics 
    ALTER COLUMN age TYPE TEXT USING (
        CASE 
            WHEN age = 1 THEN 'less_25'
            WHEN age = 2 THEN '26_35'
            WHEN age = 3 THEN '36_50'
            WHEN age = 4 THEN '51_65'
            WHEN age = 5 THEN '66_plus'
            ELSE NULL::TEXT
        END
    );

-- Step 4: Add missing columns (including shopping_preference if it doesn't exist)
ALTER TABLE demographics 
    ADD COLUMN IF NOT EXISTS shopping_preference TEXT,
    ADD COLUMN IF NOT EXISTS first_name TEXT,
    ADD COLUMN IF NOT EXISTS financial_literacy_q1 TEXT,
    ADD COLUMN IF NOT EXISTS financial_literacy_q2 TEXT,
    ADD COLUMN IF NOT EXISTS financial_literacy_q3 TEXT,
    ADD COLUMN IF NOT EXISTS initial_involvement_important INTEGER,
    ADD COLUMN IF NOT EXISTS initial_involvement_relevant INTEGER,
    ADD COLUMN IF NOT EXISTS initial_involvement_meaningful INTEGER,
    ADD COLUMN IF NOT EXISTS initial_involvement_valuable INTEGER;

-- Step 5: Update CHECK constraints for new values
-- Drop old constraints if they exist
ALTER TABLE demographics 
    DROP CONSTRAINT IF EXISTS demographics_age_check,
    DROP CONSTRAINT IF EXISTS demographics_gender_check,
    DROP CONSTRAINT IF EXISTS demographics_monthly_income_check,
    DROP CONSTRAINT IF EXISTS demographics_shopping_preference_check;

-- Add new CHECK constraints
ALTER TABLE demographics 
    ADD CONSTRAINT demographics_age_check 
        CHECK (age IN ('less_25', '26_35', '36_50', '51_65', '66_plus') OR age IS NULL);

ALTER TABLE demographics 
    ADD CONSTRAINT demographics_gender_check 
        CHECK (gender IN ('mulher', 'homem', 'outro') OR gender IS NULL);

ALTER TABLE demographics 
    ADD CONSTRAINT demographics_monthly_income_check 
        CHECK (monthly_income IN ('less_750', '750_1500', '1500_3000', 'more_3000') OR monthly_income IS NULL);

ALTER TABLE demographics 
    ADD CONSTRAINT demographics_shopping_preference_check 
        CHECK (shopping_preference IN ('online', 'presencial') OR shopping_preference IS NULL);

-- Step 6: Verify the new schema
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'demographics'
ORDER BY ordinal_position;

-- Expected columns after migration:
-- id, user_id, timestamp, age (TEXT), gender, monthly_income, shopping_preference,
-- first_name, financial_literacy_q1, financial_literacy_q2, financial_literacy_q3,
-- initial_involvement_important, initial_involvement_relevant,
-- initial_involvement_meaningful, initial_involvement_valuable, created_at

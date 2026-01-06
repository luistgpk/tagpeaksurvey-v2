# Schema Mismatch Issue - FIXED

## Problem Identified

The `demographics` table in your Supabase database has the **OLD schema** from the previous survey (cashback vs discount), but the API is trying to insert data using the **NEW schema** for the framing study.

### Old Schema (Currently in Database):
- `age` - INTEGER ❌ (should be TEXT)
- `education`, `invests`, `habit`, `smokes`, `gambles` - OLD columns ❌
- `price_research`, `purchase_preference` - OLD columns ❌
- `used_traditional_cashback`, `experience_rating`, `rating_justification` - OLD columns ❌
- `prolific_id` - OLD column ❌

### Missing Columns (API expects these):
- `first_name` ❌
- `financial_literacy_q1`, `financial_literacy_q2`, `financial_literacy_q3` ❌
- `initial_involvement_important`, `initial_involvement_relevant` ❌
- `initial_involvement_meaningful`, `initial_involvement_valuable` ❌

## Solution

Run the migration script: `migrate-demographics-table.sql`

This will:
1. ✅ Remove old columns that are no longer needed
2. ✅ Change `age` from INTEGER to TEXT
3. ✅ Add all missing columns for the framing study
4. ✅ Update CHECK constraints to match new values

## Steps to Fix

1. **Go to Supabase SQL Editor**
2. **Run `migrate-demographics-table.sql`**
3. **Verify the schema matches** (the script includes a verification query)
4. **Test the survey again** - data should now save!

## Verification

After running the migration, verify the schema:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'demographics'
ORDER BY ordinal_position;
```

You should see:
- `age` as TEXT (not INTEGER)
- `first_name`, `financial_literacy_q1`, `financial_literacy_q2`, `financial_literacy_q3`
- `initial_involvement_important`, `initial_involvement_relevant`, `initial_involvement_meaningful`, `initial_involvement_valuable`
- NO old columns like `education`, `invests`, etc.

## Why This Happened

The database schema was created for the old survey structure. When we rebuilt the survey for the framing study, we updated the API code but the database schema wasn't updated to match.

## Note

The `framing_study_results` table schema is **correct** - it matches what the API expects. Only the `demographics` table needs to be migrated.


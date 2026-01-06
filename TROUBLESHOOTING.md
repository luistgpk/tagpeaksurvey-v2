# Troubleshooting: Data Not Saving to Database

## Quick Diagnosis

### Step 1: Run Quick Diagnostic SQL
Run `quick-diagnostic.sql` in your Supabase SQL Editor to check:
- ✅ Tables exist
- ✅ RLS status and policies
- ✅ Recent data
- ✅ Constraints

### Step 2: Check Vercel Logs
1. Go to your Vercel project dashboard
2. Navigate to **Deployments** → Click on latest deployment → **Functions** tab
3. Look for `/api/save-results` function logs
4. Check for errors when a survey is submitted

### Step 3: Check Browser Console
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Complete a survey submission
4. Look for the `/api/save-results` request
5. Check the response status and body

## Common Issues & Solutions

### Issue 1: RLS Policies Blocking Inserts

**Symptom**: API returns 200 but no data in database

**Solution**: The anonymous insert policy should work, but verify:

```sql
-- Check if anonymous insert policy exists
SELECT * FROM pg_policies 
WHERE tablename IN ('framing_study_results', 'demographics')
AND policyname LIKE '%anonymous%';

-- If missing, create it:
CREATE POLICY "Allow anonymous inserts on framing_study_results"
    ON framing_study_results
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts on demographics"
    ON demographics
    FOR INSERT
    WITH CHECK (true);
```

### Issue 2: Service Role Key Not Working

**Symptom**: Error about "service_role" in logs

**Check**: 
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel environment variables
- The service role key should bypass RLS, but the policy might be checking incorrectly

**Solution**: Update RLS policy to work with service role:

```sql
-- Drop existing service role policy
DROP POLICY IF EXISTS "Service role can do everything on framing_study_results" ON framing_study_results;
DROP POLICY IF EXISTS "Service role can do everything on demographics" ON demographics;

-- Create better service role policy
CREATE POLICY "Service role bypass RLS"
    ON framing_study_results
    FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role')
    WITH CHECK (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

CREATE POLICY "Service role bypass RLS"
    ON demographics
    FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role')
    WITH CHECK (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
```

**Better Solution**: Since we're using service role key, we can temporarily disable RLS for inserts:

```sql
-- Temporarily disable RLS to test (NOT RECOMMENDED FOR PRODUCTION)
-- ALTER TABLE framing_study_results DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE demographics DISABLE ROW LEVEL SECURITY;
```

### Issue 3: UNIQUE Constraint Violation (demographics.user_id)

**Symptom**: Error about duplicate key on `user_id`

**Solution**: Already fixed in API - now uses `upsert` instead of `insert`

### Issue 4: Missing Required Fields

**Symptom**: Error about NOT NULL constraint

**Check**: The `framing_condition` field is NOT NULL. Verify it's being sent:

```sql
-- Check what data is being sent
-- Look at Vercel function logs for the request body
```

**Solution**: Ensure `framingCondition` is always set before calling save

### Issue 5: Environment Variables Not Set in Vercel

**Symptom**: Error "Missing Supabase credentials"

**Solution**:
1. Go to Vercel project → Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (or `SERVICE_ROLE_KEY`)
3. Redeploy after adding variables

### Issue 6: Data Type Mismatch

**Symptom**: Error about invalid input or type mismatch

**Check**: Verify data types match schema:
- `framing_condition` must be: 'positive', 'negative', or 'neutral'
- `age` must be: 'less_25', '26_35', '36_50', '51_65', '66_plus'
- `gender` must be: 'mulher', 'homem', 'outro'
- All INTEGER fields should be numbers, not strings

## Testing the API Directly

### Test with curl:

```bash
curl -X POST https://your-vercel-app.vercel.app/api/save-results \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "framingCondition": "positive",
    "surveyData": {
      "age": "26_35",
      "gender": "mulher",
      "monthlyIncome": "1500_3000",
      "shoppingPreference": "online",
      "financialLiteracyQ1": "more_102",
      "financialLiteracyQ2": "less",
      "financialLiteracyQ3": "false",
      "initialInvolvementImportant": 3,
      "initialInvolvementRelevant": 4,
      "initialInvolvementMeaningful": 5,
      "initialInvolvementValuable": 6,
      "exclusionBenefitType": "Cashback",
      "exclusionPercentage": "100%",
      "manipulationLossEmphasis": 4,
      "manipulationGlobalIdea": 5,
      "concernsText": "Test concerns"
    }
  }'
```

## Debugging Steps

1. **Check Vercel Function Logs**:
   - Look for console.log outputs
   - Check for error messages
   - Verify environment variables are loaded

2. **Check Supabase Logs**:
   - Go to Supabase Dashboard → Logs
   - Look for API errors
   - Check for RLS policy violations

3. **Test Database Directly**:
   ```sql
   -- Try inserting directly (as service role)
   INSERT INTO demographics (user_id, age, gender, monthly_income, shopping_preference)
   VALUES ('test-direct', '26_35', 'mulher', '1500_3000', 'online');
   ```

4. **Verify RLS is Working**:
   ```sql
   -- Check current role
   SELECT current_setting('request.jwt.claims', true);
   ```

## Most Likely Issues (in order)

1. **RLS Policies** - Anonymous insert policy not working correctly
2. **Environment Variables** - Not set in Vercel
3. **Service Role Key** - Wrong key or not set
4. **Data Validation** - Required fields missing or wrong format
5. **UNIQUE Constraint** - Duplicate user_id (now handled with upsert)

## Quick Fix: Disable RLS Temporarily (Testing Only)

```sql
-- ONLY FOR TESTING - NOT FOR PRODUCTION!
ALTER TABLE framing_study_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE demographics DISABLE ROW LEVEL SECURITY;
```

After confirming data saves, re-enable and fix policies properly.


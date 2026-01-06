# Debugging 500 Error: Failed to Save Demographics

## Current Error
- **Status**: 500 Internal Server Error
- **Message**: "Failed to save demographics"
- **Location**: `/api/save-results` function

## Steps to Debug

### 1. Check Vercel Function Logs
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Go to **Functions** tab
4. Click on `/api/save-results`
5. Look for error logs - you should see:
   - "Error saving demographics:" with full error details
   - "Demographics data attempted:" with the data being sent
   - Full error object with code, hint, and message

### 2. Common Causes

#### A. RLS Policy Blocking Insert
**Check**: Look for error code `42501` (insufficient_privilege)

**Solution**: The RLS policies should allow inserts. Verify:
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'demographics' 
AND cmd = 'INSERT';
```

Should see policies with `with_check = true`

#### B. CHECK Constraint Violation
**Check**: Look for error code `23514` (check_violation)

**Possible issues**:
- `age` value doesn't match: 'less_25', '26_35', '36_50', '51_65', '66_plus'
- `gender` value doesn't match: 'mulher', 'homem', 'outro'
- `monthly_income` value doesn't match: 'less_750', '750_1500', '1500_3000', 'more_3000'
- `shopping_preference` value doesn't match: 'online', 'presencial'

**Solution**: Check the data being sent matches these exact values

#### C. NOT NULL Constraint Violation
**Check**: Look for error code `23502` (not_null_violation)

**Required fields**:
- `user_id` (NOT NULL)
- `timestamp` (NOT NULL, but has default)

**Solution**: Ensure `user_id` is always provided

#### D. Data Type Mismatch
**Check**: Look for error code `42804` (datatype_mismatch)

**Possible issues**:
- `initial_involvement_*` fields should be INTEGER, not string
- `age` should be TEXT, not INTEGER

**Solution**: Ensure data types match schema

#### E. Upsert Syntax Issue
**Check**: Supabase upsert might need different syntax

**Try**: Change from `upsert` to regular `insert` first to test:
```javascript
// Test with insert instead of upsert
const { error } = await supabase
    .from('demographics')
    .insert([demographicsData])
    .select();
```

### 3. Quick Test Query

Run this in Supabase SQL Editor to test if you can insert manually:

```sql
INSERT INTO demographics (
    user_id,
    timestamp,
    age,
    gender,
    monthly_income,
    shopping_preference
) VALUES (
    'test-manual-insert',
    NOW(),
    '26_35',
    'mulher',
    '1500_3000',
    'online'
);
```

If this fails, you'll see the exact error.

### 4. Check What Data is Being Sent

The API now logs the exact data being sent. Check Vercel logs for:
```
Attempting to save demographics: { ... }
```

Verify:
- All required fields are present
- Data types are correct
- Values match CHECK constraints

### 5. Temporary Fix: Disable RLS (Testing Only)

If RLS is the issue, temporarily disable it to test:

```sql
ALTER TABLE demographics DISABLE ROW LEVEL SECURITY;
```

**⚠️ WARNING**: Only for testing! Re-enable after fixing:
```sql
ALTER TABLE demographics ENABLE ROW LEVEL SECURITY;
```

## Next Steps

1. **Check Vercel function logs** - This will show the exact Supabase error
2. **Share the error details** - Code, message, and hint from the logs
3. **Test manual insert** - Run the SQL test query above
4. **Verify data format** - Check that values match CHECK constraints exactly

The enhanced logging should now show the exact error in Vercel logs!


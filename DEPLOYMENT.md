# Deployment Guide

## Quick Setup (5 minutes)

### 1. Database Setup
1. Go to your Supabase project: https://supabase.com/dashboard/project/jnslvaffanwlxmqisxil
2. Navigate to **SQL Editor**
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click **Run** to create the tables and policies

### 2. Environment Setup
1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your actual values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://jnslvaffanwlxmqisxil.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impuc2x2YWZmYW53bHhtcWlzeGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjE2MjYsImV4cCI6MjA3NTMzNzYyNn0.c1fB1oF1HsfkIabvmzF3JzGFouZQbXBa9Dg4vGcSbos
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impuc2x2YWZmYW53bHhtcWlzeGlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTc2MTYyNiwiZXhwIjoyMDc1MzM3NjI2fQ.2_CKHWR-Da9T1nuNhydApZWdUpzGRKwSUm31GS62GCc
   ```

### 3. Local Testing
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` and test the survey flow

### 4. Deploy to Vercel
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variables in Vercel:
   - Go to your project dashboard
   - Settings → Environment Variables
   - Add all three variables from your `.env.local`

### 5. Verify Deployment
1. Visit your deployed URL
2. Complete a test survey
3. Check your Supabase dashboard → Table Editor to see the data

## Data Structure

Your survey data will be stored in two tables:

### `staircase_results`
- `user_id`: Unique participant identifier
- `indifference_points`: Calculated preference points
- `raw_history`: Complete trial history
- `experience_quiz`: Cashback experience responses

### `demographics`
- `user_id`: Links to staircase_results
- Standard demographic fields (age, gender, education, etc.)
- Behavioral questions (price research, purchase preferences)

## Security Features

✅ **Content Security Policy** - Prevents XSS attacks  
✅ **Row Level Security** - Database-level access control  
✅ **Server-side validation** - All data validated before storage  
✅ **Environment variables** - Sensitive keys secured  
✅ **CORS protection** - Controlled cross-origin requests  

## Troubleshooting

**Survey not saving data?**
- Check environment variables are set correctly
- Verify Supabase tables exist (run the schema)
- Check browser console for errors

**Vercel deployment failing?**
- Ensure all environment variables are set in Vercel dashboard
- Check that `package.json` dependencies are correct

**Database connection issues?**
- Verify Supabase project is active
- Check service role key has correct permissions
- Ensure RLS policies allow inserts

## Support

If you encounter issues:
1. Check the browser console for JavaScript errors
2. Check Vercel function logs in the dashboard
3. Verify Supabase connection in the dashboard
4. Test the API endpoint directly: `POST /api/save-results`

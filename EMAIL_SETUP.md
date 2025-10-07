# 📧 Email Automation Setup Guide

This guide will help you set up automatic daily email reports with Excel attachments for your survey data.

## 🎯 **What This Does**

- **Automatically sends daily Excel reports** to your analyst
- **Includes all survey data** (staircase results + demographics)
- **Runs every day at 9 AM** (configurable)
- **Sends notification** if no data for the day
- **Professional Excel files** ready for SPSS analysis

## 🛠️ **Setup Steps**

### **Step 1: Get Resend API Key**

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Go to API Keys section
4. Create a new API key
5. Copy the key (starts with `re_`)

### **Step 2: Deploy Supabase Functions**

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. **Deploy the functions**:
   ```bash
   supabase functions deploy send-daily-report
   supabase functions deploy cron-daily-report
   ```

### **Step 3: Set Environment Variables**

1. Go to your Supabase dashboard
2. Navigate to **Settings** → **Edge Functions**
3. Add these environment variables:

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=re_your_resend_key_here
ANALYST_EMAIL=analyst@yourcompany.com
FROM_EMAIL=noreply@yourdomain.com
```

### **Step 4: Set Up Cron Job**

You have several options for the cron job:

#### **Option A: GitHub Actions (Recommended)**
Create `.github/workflows/daily-report.yml`:

```yaml
name: Daily Survey Report
on:
  schedule:
    - cron: '0 9 * * *'  # 9 AM daily
  workflow_dispatch:  # Manual trigger

jobs:
  send-report:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Daily Report
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            -H "Content-Type: application/json" \
            ${{ secrets.SUPABASE_URL }}/functions/v1/cron-daily-report
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

#### **Option B: Vercel Cron Jobs**
Add to your `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron-daily-report",
      "schedule": "0 9 * * *"
    }
  ]
}
```

#### **Option C: External Cron Service**
Use services like:
- [cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)
- [Cronitor](https://cronitor.io)

## 📊 **What the Excel File Contains**

### **Sheet 1: Staircase Results**
- User ID
- Timestamp
- Indifference Points (JSON)
- Raw History (JSON)
- Experience Quiz (JSON)
- Created At

### **Sheet 2: Demographics**
- User ID
- Timestamp
- Age, Gender, Education
- Investment habits
- Smoking/Gambling habits
- Monthly income
- Price research behavior
- Purchase preferences
- Cashback experience
- Experience rating & justification

## 🎯 **Email Features**

- **Professional formatting**
- **Excel attachment**
- **Response count summary**
- **No data notifications**
- **Daily automated delivery**

## 🔧 **Customization Options**

### **Change Email Schedule**
Edit the cron expression:
- `0 9 * * *` = 9 AM daily
- `0 18 * * 1` = 6 PM every Monday
- `0 9 * * 1-5` = 9 AM weekdays only

### **Add More Data Fields**
Edit `supabase/functions/send-daily-report/index.ts` to include additional fields.

### **Change Email Template**
Modify the HTML template in the function to match your branding.

## 🚨 **Troubleshooting**

### **Function Not Deploying**
```bash
supabase functions deploy send-daily-report --debug
```

### **Email Not Sending**
1. Check Resend API key is correct
2. Verify analyst email address
3. Check Supabase logs for errors

### **Cron Job Not Running**
1. Verify the cron expression
2. Check the external service logs
3. Test the function manually

## 📞 **Support**

If you need help:
1. Check Supabase Edge Functions logs
2. Verify all environment variables
3. Test the function manually first

## 🎉 **You're Done!**

Your analyst will now receive daily Excel reports with all survey data, ready for SPSS analysis!

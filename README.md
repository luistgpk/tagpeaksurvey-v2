# TagPeak Survey V2

A survey application for studying cashback vs discount preferences, refactored for Vercel deployment with Supabase backend.

## Features

- **Structured Survey Flow**: Welcome → Demographics → Attention Screen → Explanation → Quiz → Instructions → Staircase Method → Thank You
- **Staircase Method**: Adaptive questioning to determine indifference points between cashback and discount preferences
- **Catch Trials**: Built-in attention checks to ensure participant engagement
- **Secure Data Collection**: Server-side data persistence via Vercel API routes
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Security Headers**: CSP, XSS protection, and other security measures

## Project Structure

```
├── 21.html                 # Main application entry point
├── assets/
│   ├── styles.css         # Extracted CSS styles
│   └── app.js            # Extracted JavaScript application logic
├── api/
│   └── save-results.js   # Vercel serverless function for data persistence
├── package.json          # Dependencies and scripts
├── vercel.json          # Vercel configuration with security headers
├── env.example         # Environment variables template
├── supabase-schema.sql # Database schema for Supabase
└── README.md           # This file
```

## Setup Instructions

### 1. Environment Configuration

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

### 2. Supabase Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the contents of `supabase-schema.sql` to create the required tables and policies

### 3. Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser

### 4. Deployment to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Add the environment variables from your `.env.local` file

## Data Collection

The application collects two types of data:

### Staircase Results (`staircase_results` table)
- User ID and timestamp
- Indifference points for each product
- Complete trial history with presentation order and anchor points
- Experience quiz responses
- Catch trial performance

### Demographics (`demographics` table)
- Standard demographic information (age, gender, education, etc.)
- Behavioral questions (price research, purchase preferences)
- Experience with traditional cashback
- Investment and gambling habits

## Security Features

- **Content Security Policy**: Restricts resource loading to trusted sources
- **XSS Protection**: Headers to prevent cross-site scripting
- **CSRF Protection**: Server-side validation of requests
- **Row Level Security**: Database-level access control in Supabase
- **Environment Variables**: Sensitive keys stored securely

## API Endpoints

### POST `/api/save-results`
Saves survey results to Supabase database.

**Request Body:**
```json
{
  "resultsData": {
    "indifferencePoints": {...},
    "rawHistory": [...],
    "experienceQuiz": {...}
  },
  "demographicsData": {...},
  "userId": "unique-user-id"
}
```

**Response:**
```json
{
  "success": true
}
```

## Browser Compatibility

- Modern browsers with ES6 module support
- Fetch API support
- Crypto.randomUUID() support

## License

This project is for research purposes. Please ensure compliance with data protection regulations (GDPR, etc.) when collecting participant data.

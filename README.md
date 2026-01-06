# TagPeak Framing Study

A survey application for studying email framing effects on consumer behavior, deployed on Vercel with Supabase backend.

## Features

- **Structured Survey Flow**: Welcome → Demographics → Financial Literacy → Initial Involvement → Preparation → Email Framing (Positive/Negative/Neutral) → Exclusion Questions → Manipulation Check → Message Involvement → Intention to Use → Website Presentation → Emotion Evaluation → Concerns → Thank You
- **Randomized Framing Conditions**: Participants are randomly assigned to one of three email framing conditions (positive, negative, or neutral)
- **Comprehensive Data Collection**: Captures demographics, financial literacy, involvement measures, manipulation checks, and behavioral intentions
- **Secure Data Collection**: Server-side data persistence via Vercel API routes
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Security Headers**: CSP, XSS protection, and other security measures

## Project Structure

```
├── index.html            # Main application entry point
├── assets/
│   ├── styles.css       # Extracted CSS styles
│   └── app.js          # Extracted JavaScript application logic
├── api/
│   └── save-results.js # Vercel serverless function for data persistence
├── package.json        # Dependencies and scripts
├── vercel.json        # Vercel configuration with security headers
├── supabase-env-example.txt # Environment variables template
├── supabase-schema.sql # Database schema for Supabase
└── README.md          # This file
```

## Setup Instructions

### 1. Environment Configuration

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Fill in your Supabase credentials. Use `supabase-env-example.txt` as a reference:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
   
   **Note**: The Supabase project name is `tgpk-framing`, but credentials remain the same.

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

### Framing Study Results (`framing_study_results` table)
- User ID and timestamp
- Framing condition (positive, negative, or neutral)
- Exclusion question responses
- Manipulation check responses
- Message involvement measures (6 items, 1-9 scale)
- Intention to use measures (4 items, 1-7 scale)
- Ease of use, product clarity, and advantage perceptions
- Willingness to use measures
- Concerns and feedback

### Demographics (`demographics` table)
- Standard demographic information (age, gender, monthly income, shopping preference)
- Optional first name
- Financial literacy assessment (3 questions)
- Initial involvement with promotional benefits (4 items, 1-7 scale)

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
  "userId": "unique-user-id",
  "framingCondition": "positive|negative|neutral",
  "surveyData": {
    "age": "26_35",
    "gender": "mulher",
    "monthlyIncome": "1500_3000",
    "shoppingPreference": "online",
    "firstName": "Optional",
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
    "involvementInterested": 6,
    "involvementAbsorbed": 5,
    "involvementAttention": 7,
    "involvementRelevant": 6,
    "involvementInteresting": 5,
    "involvementEngaging": 6,
    "intentionProbable": 5,
    "intentionPossible": 6,
    "intentionDefinitelyUse": 5,
    "intentionFrequent": 4,
    "easeDifficult": 2,
    "easeEasy": 6,
    "productExplainEasy": 5,
    "productDescriptionEasy": 5,
    "clarityStepsClear": 6,
    "clarityFeelSecure": 5,
    "advantageMoreAdvantageous": 6,
    "advantageBetterPosition": 5,
    "willingnessInterest": 6,
    "willingnessLikelyUse": 5,
    "willingnessIntendFuture": 6,
    "concernsText": "Some concerns...",
    "userFeedback": "Optional feedback"
  }
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

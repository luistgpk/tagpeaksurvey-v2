// Vercel cron endpoint to trigger daily report
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow GET requests (Vercel cron uses GET)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;
    const analystEmail = process.env.ANALYST_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || 'noreply@yourdomain.com';
    
    // Support multiple recipients (comma-separated)
    const recipientEmails = analystEmail.split(',').map(email => email.trim()).filter(email => email);
    
    if (!supabaseUrl || !serviceKey) {
      return res.status(500).json({ 
        error: 'Missing Supabase configuration' 
      });
    }

    if (!resendApiKey || recipientEmails.length === 0) {
      return res.status(500).json({ 
        error: 'Missing email configuration (RESEND_API_KEY, ANALYST_EMAIL)' 
      });
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, serviceKey);

    // Get today's date for filename
    const today = new Date().toISOString().split('T')[0];
    
    // Query staircase results
    const { data: staircaseData, error: staircaseError } = await supabase
      .from('staircase_results')
      .select('*')
      .gte('created_at', `${today}T00:00:00.000Z`);

    if (staircaseError) {
      throw new Error(`Error fetching staircase data: ${staircaseError.message}`);
    }

    // Query demographics data
    const { data: demographicsData, error: demographicsError } = await supabase
      .from('demographics')
      .select('*')
      .gte('created_at', `${today}T00:00:00.000Z`);

    if (demographicsError) {
      throw new Error(`Error fetching demographics data: ${demographicsError.message}`);
    }

    // If no data for today, send a notification
    if (staircaseData.length === 0 && demographicsData.length === 0) {
      await sendEmail(resendApiKey, fromEmail, recipientEmails, today, 0, 0, null);
      
      return res.status(200).json({
        success: true,
        message: 'No data for today, notification sent'
      });
    }

    // Create Excel data
    const excelData = createExcelData(staircaseData, demographicsData);
    
    // Send email with CSV attachment
    await sendEmail(resendApiKey, fromEmail, recipientEmails, today, staircaseData.length, demographicsData.length, excelData);

    return res.status(200).json({
      success: true,
      message: `Daily report sent successfully. ${staircaseData.length + demographicsData.length} responses included.`
    });

  } catch (error) {
    console.error('Error in cron-daily-report:', error);
    return res.status(500).json({ 
      error: error.message 
    });
  }
}

// Helper function to create Excel data
function createExcelData(staircaseData, demographicsData) {
  const data = {
    'Staircase Results': staircaseData.map(row => ({
      'User ID': row.user_id,
      'Timestamp': row.timestamp,
      'Indifference Points': JSON.stringify(row.indifference_points),
      'Raw History': JSON.stringify(row.raw_history),
      'Experience Quiz': JSON.stringify(row.experience_quiz),
      'Created At': row.created_at
    })),
    'Demographics': demographicsData.map(row => ({
      'User ID': row.user_id,
      'Timestamp': row.timestamp,
      'Age': row.age,
      'Gender': row.gender,
      'Education': row.education,
      'Invests': row.invests,
      'Habit': row.habit,
      'Smokes': row.smokes,
      'Gambles': row.gambles,
      'Monthly Income': row.monthly_income,
      'Price Research': row.price_research,
      'Purchase Preference': row.purchase_preference,
      'Used Traditional Cashback': row.used_traditional_cashback,
      'Experience Rating': row.experience_rating,
      'Rating Justification': row.rating_justification,
      'Created At': row.created_at
    }))
  };
  
  return data;
}

// Helper function to send email
async function sendEmail(resendApiKey, fromEmail, recipientEmails, today, staircaseCount, demographicsCount, excelData) {
  const emailData = {
    from: `Survey System <${fromEmail}>`,
    to: recipientEmails,
    subject: `Daily Survey Report - ${today} (${staircaseCount + demographicsCount} responses)`,
    html: `
      <h2>Daily Survey Report - ${today}</h2>
      <p><strong>Survey Responses:</strong> ${staircaseCount + demographicsCount}</p>
      <ul>
        <li>Staircase Results: ${staircaseCount}</li>
        <li>Demographics: ${demographicsCount}</li>
      </ul>
      <p>Please find the Excel file attached with all survey data.</p>
      <p>This is an automated report from your survey system.</p>
    `
  };

  // Add CSV attachment if data exists
  if (excelData) {
    const csvBuffer = createExcelBuffer(excelData);
    const csvBase64 = Buffer.from(csvBuffer).toString('base64');
    
    emailData.attachments = [
      {
        filename: `survey-data-${today}.csv`,
        content: csvBase64,
        type: 'text/csv'
      }
    ];
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to send email: ${error.message || response.statusText}`);
  }

  return await response.json();
}

// Helper function to create Excel buffer (proper CSV format)
function createExcelBuffer(data) {
  // Create a proper CSV file instead of fake Excel
  const csvContent = Object.keys(data).map(sheetName => {
    const sheetData = data[sheetName];
    if (sheetData.length === 0) return '';
    
    const headers = Object.keys(sheetData[0]);
    const csvRows = [
      headers.join(','),
      ...sheetData.map(row => headers.map(header => {
        const value = row[header] || '';
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        const escaped = String(value).replace(/"/g, '""');
        return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
      }).join(','))
    ];
    
    return `\n=== ${sheetName} ===\n${csvRows.join('\n')}\n`;
  }).join('\n');
  
  return Buffer.from(csvContent, 'utf8');
}

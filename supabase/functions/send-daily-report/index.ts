import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend@0.15.0'
import * as XLSX from 'https://esm.sh/xlsx@0.18.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    // Note: Supabase UI blocks vars starting with "SUPABASE_". Use SERVICE_ROLE_KEY instead.
    const supabaseServiceKey = Deno.env.get('SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Initialize Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    const fromEmail = Deno.env.get('FROM_EMAIL') || 'noreply@yourdomain.com'

    // Get today's date for filename
    const today = new Date().toISOString().split('T')[0]
    
    // Query staircase results
    const { data: staircaseData, error: staircaseError } = await supabase
      .from('staircase_results')
      .select('*')
      .gte('created_at', `${today}T00:00:00.000Z`)

    if (staircaseError) {
      throw new Error(`Error fetching staircase data: ${staircaseError.message}`)
    }

    // Query demographics data
    const { data: demographicsData, error: demographicsError } = await supabase
      .from('demographics')
      .select('*')
      .gte('created_at', `${today}T00:00:00.000Z`)

    if (demographicsError) {
      throw new Error(`Error fetching demographics data: ${demographicsError.message}`)
    }

    // If no data for today, send a notification
    if (staircaseData.length === 0 && demographicsData.length === 0) {
      await resend.emails.send({
        from: `Survey System <${fromEmail}>`,
        to: [Deno.env.get('ANALYST_EMAIL')!],
        subject: `Daily Survey Report - ${today} (No Data)`,
        html: `
          <h2>Daily Survey Report - ${today}</h2>
          <p>No survey responses were received today.</p>
          <p>This is an automated report from your survey system.</p>
        `,
      })

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No data for today, notification sent' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Create Excel workbook
    const workbook = XLSX.utils.book_new()

    // Process staircase data
    if (staircaseData.length > 0) {
      const staircaseSheet = staircaseData.map(row => ({
        'User ID': row.user_id,
        'Timestamp': row.timestamp,
        'Indifference Points': JSON.stringify(row.indifference_points),
        'Raw History': JSON.stringify(row.raw_history),
        'Experience Quiz': JSON.stringify(row.experience_quiz),
        'Created At': row.created_at
      }))

      XLSX.utils.book_append_sheet(workbook, staircaseSheet, 'Staircase Results')
    }

    // Process demographics data
    if (demographicsData.length > 0) {
      const demographicsSheet = demographicsData.map(row => ({
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

      XLSX.utils.book_append_sheet(workbook, demographicsSheet, 'Demographics')
    }

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
    const excelBase64 = btoa(String.fromCharCode(...new Uint8Array(excelBuffer)))

    // Send email with Excel attachment
    await resend.emails.send({
      from: `Survey System <${fromEmail}>`,
      to: [Deno.env.get('ANALYST_EMAIL')!],
      subject: `Daily Survey Report - ${today} (${staircaseData.length + demographicsData.length} responses)`,
      html: `
        <h2>Daily Survey Report - ${today}</h2>
        <p><strong>Survey Responses:</strong> ${staircaseData.length + demographicsData.length}</p>
        <ul>
          <li>Staircase Results: ${staircaseData.length}</li>
          <li>Demographics: ${demographicsData.length}</li>
        </ul>
        <p>Please find the Excel file attached with all survey data.</p>
        <p>This is an automated report from your survey system.</p>
      `,
      attachments: [
        {
          filename: `survey-data-${today}.xlsx`,
          content: excelBase64,
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      ]
    })

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Report sent successfully. ${staircaseData.length + demographicsData.length} responses included.` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in send-daily-report:', error)
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

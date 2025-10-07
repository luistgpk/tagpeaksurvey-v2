import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    // Call the send-daily-report function
    const reportUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-daily-report`
    const reportResponse = await fetch(reportUrl, {
      method: 'POST',
      headers: {
        // Note: Supabase UI blocks vars starting with "SUPABASE_". Use SERVICE_ROLE_KEY instead.
        'Authorization': `Bearer ${Deno.env.get('SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json',
      },
    })

    const reportResult = await reportResponse.json()

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Daily report cron job executed',
      reportResult 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in cron-daily-report:', error)
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

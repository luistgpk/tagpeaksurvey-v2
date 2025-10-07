// Test endpoint to manually trigger daily report
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        // Call the Supabase Edge Function
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        // Use SERVICE_ROLE_KEY for compatibility with Edge Functions env naming rules
        const supabaseServiceKey = process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (!supabaseUrl || !supabaseServiceKey) {
            return res.status(500).json({ 
                error: 'Missing Supabase configuration' 
            });
        }

        const response = await fetch(`${supabaseUrl}/functions/v1/send-daily-report`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to send report');
        }

        return res.status(200).json({
            success: true,
            message: 'Daily report sent successfully',
            result
        });

    } catch (error) {
        console.error('Error in test-email-report:', error);
        return res.status(500).json({ 
            error: error.message 
        });
    }
}

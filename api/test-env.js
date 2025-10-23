// Test endpoint to check environment variables
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const envCheck = {
            NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
            NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
            SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing',
            SERVICE_ROLE_KEY: process.env.SERVICE_ROLE_KEY ? 'Set' : 'Missing',
            RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Set' : 'Missing',
            ANALYST_EMAIL: process.env.ANALYST_EMAIL ? 'Set' : 'Missing',
            FROM_EMAIL: process.env.FROM_EMAIL ? 'Set' : 'Missing'
        };

        return res.status(200).json({
            success: true,
            environment: envCheck,
            message: 'Environment variables check'
        });

    } catch (error) {
        console.error('Error in test-env:', error);
        return res.status(500).json({ 
            error: error.message 
        });
    }
}

// Vercel serverless function to save survey results to Supabase
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // CORS headers for browser requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        // Initialize Supabase client with service role key for server-side operations
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        console.log('Environment check:', {
            hasUrl: !!supabaseUrl,
            hasServiceKey: !!supabaseServiceKey,
            url: supabaseUrl ? 'Set' : 'Missing',
            serviceKey: supabaseServiceKey ? 'Set' : 'Missing'
        });

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('Missing Supabase configuration:', {
                url: supabaseUrl,
                serviceKey: supabaseServiceKey ? 'Present' : 'Missing'
            });
            return res.status(500).json({ 
                error: 'Server configuration error - Missing Supabase credentials' 
            });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { resultsData, demographicsData, userId } = req.body;

        if (!resultsData || !demographicsData || !userId) {
            return res.status(400).json({ error: 'Missing required data' });
        }

        // Save staircase results
        const { error: resultsError } = await supabase
            .from('staircase_results')
            .insert([{
                user_id: userId,
                timestamp: new Date().toISOString(),
                indifference_points: resultsData.indifferencePoints,
                raw_history: resultsData.rawHistory,
                experience_quiz: resultsData.experienceQuiz,
                concept_quiz: resultsData.conceptQuiz,
                user_feedback: resultsData.userFeedback
            }]);

        if (resultsError) {
            console.error('Error saving results:', resultsError);
            return res.status(500).json({ error: 'Failed to save results' });
        }

        // Save demographics data - map camelCase to snake_case for database
        const mappedDemographicsData = {
            user_id: userId,
            timestamp: new Date().toISOString(),
            age: demographicsData.age,
            gender: demographicsData.gender,
            education: demographicsData.education,
            invests: demographicsData.invests,
            habit: demographicsData.habit,
            smokes: demographicsData.smokes,
            gambles: demographicsData.gambles,
            monthly_income: demographicsData.monthly_income,
            price_research: demographicsData.priceResearch,
            purchase_preference: demographicsData.purchasePreference,
            used_traditional_cashback: demographicsData.usedTraditionalCashback,
            experience_rating: demographicsData.experienceRating,
            rating_justification: demographicsData.ratingJustification
        };

        const { error: demographicsError } = await supabase
            .from('demographics')
            .insert([mappedDemographicsData]);

        if (demographicsError) {
            console.error('Error saving demographics:', demographicsError);
            return res.status(500).json({ error: 'Failed to save demographics' });
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

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
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;

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

        const { userId, framingCondition, surveyData } = req.body;

        console.log('Request body check:', {
            hasUserId: !!userId,
            hasFramingCondition: !!framingCondition,
            hasSurveyData: !!surveyData,
            userId: userId,
            framingCondition: framingCondition
        });

        if (!userId || !framingCondition || !surveyData) {
            console.error('Missing required data:', {
                userId: !!userId,
                framingCondition: !!framingCondition,
                surveyData: !!surveyData
            });
            return res.status(400).json({ error: 'Missing required data' });
        }

        // Save demographics data
        const demographicsData = {
            user_id: userId,
            timestamp: new Date().toISOString(),
            age: surveyData.age,
            gender: surveyData.gender,
            monthly_income: surveyData.monthlyIncome,
            shopping_preference: surveyData.shoppingPreference,
            first_name: surveyData.firstName || null,
            financial_literacy_q1: surveyData.financialLiteracyQ1,
            financial_literacy_q2: surveyData.financialLiteracyQ2,
            financial_literacy_q3: surveyData.financialLiteracyQ3,
            initial_involvement_important: surveyData.initialInvolvementImportant,
            initial_involvement_relevant: surveyData.initialInvolvementRelevant,
            initial_involvement_meaningful: surveyData.initialInvolvementMeaningful,
            initial_involvement_valuable: surveyData.initialInvolvementValuable
        };

        // Use upsert for demographics to handle UNIQUE constraint on user_id
        const { error: demographicsError, data: demographicsDataResult } = await supabase
            .from('demographics')
            .upsert(demographicsData, { 
                onConflict: 'user_id',
                ignoreDuplicates: false 
            })
            .select();

        if (demographicsError) {
            console.error('Error saving demographics:', demographicsError);
            console.error('Demographics data attempted:', JSON.stringify(demographicsData, null, 2));
            return res.status(500).json({ 
                error: 'Failed to save demographics',
                details: demographicsError.message,
                code: demographicsError.code,
                hint: demographicsError.hint
            });
        }

        // Save framing study results
        const framingResultsData = {
            user_id: userId,
            timestamp: new Date().toISOString(),
            framing_condition: framingCondition,
            exclusion_benefit_type: surveyData.exclusionBenefitType,
            exclusion_percentage: surveyData.exclusionPercentage,
            manipulation_loss_emphasis: surveyData.manipulationLossEmphasis,
            manipulation_global_idea: surveyData.manipulationGlobalIdea,
            involvement_interested: surveyData.involvementInterested,
            involvement_absorbed: surveyData.involvementAbsorbed,
            involvement_attention: surveyData.involvementAttention,
            involvement_relevant: surveyData.involvementRelevant,
            involvement_interesting: surveyData.involvementInteresting,
            involvement_engaging: surveyData.involvementEngaging,
            intention_probable: surveyData.intentionProbable,
            intention_possible: surveyData.intentionPossible,
            intention_definitely_use: surveyData.intentionDefinitelyUse,
            intention_frequent: surveyData.intentionFrequent,
            ease_difficult: surveyData.easeDifficult,
            ease_easy: surveyData.easeEasy,
            product_explain_easy: surveyData.productExplainEasy,
            product_description_easy: surveyData.productDescriptionEasy,
            clarity_steps_clear: surveyData.clarityStepsClear,
            clarity_feel_secure: surveyData.clarityFeelSecure,
            advantage_more_advantageous: surveyData.advantageMoreAdvantageous,
            advantage_better_position: surveyData.advantageBetterPosition,
            willingness_interest: surveyData.willingnessInterest,
            willingness_likely_use: surveyData.willingnessLikelyUse,
            willingness_intend_future: surveyData.willingnessIntendFuture,
            concerns_text: surveyData.concernsText,
            user_feedback: surveyData.userFeedback || null
        };

        const { error: resultsError, data: resultsDataResult } = await supabase
            .from('framing_study_results')
            .insert([framingResultsData])
            .select();

        if (resultsError) {
            console.error('Error saving results:', resultsError);
            console.error('Results data attempted:', JSON.stringify(framingResultsData, null, 2));
            return res.status(500).json({ 
                error: 'Failed to save results',
                details: resultsError.message,
                code: resultsError.code,
                hint: resultsError.hint
            });
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

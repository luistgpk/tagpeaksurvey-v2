// Test endpoint to manually trigger daily report
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // Allow GET (for quick browser tests), POST (for programmatic triggers), and OPTIONS (CORS preflight)
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
        
        // Query ALL staircase results (full database)
        const { data: staircaseData, error: staircaseError } = await supabase
            .from('staircase_results')
            .select('*')
            .order('created_at', { ascending: true });

        if (staircaseError) {
            throw new Error(`Error fetching staircase data: ${staircaseError.message}`);
        }

        // Query ALL demographics data (full database)
        const { data: demographicsData, error: demographicsError } = await supabase
            .from('demographics')
            .select('*')
            .order('created_at', { ascending: true });

        if (demographicsError) {
            throw new Error(`Error fetching demographics data: ${demographicsError.message}`);
        }

        // If no data at all, send a notification
        if (staircaseData.length === 0 && demographicsData.length === 0) {
            await sendEmail(resendApiKey, fromEmail, recipientEmails, today, 0, 0, null);
            
            return res.status(200).json({
                success: true,
                message: 'No data in database, notification sent'
            });
        }

        // Create SPSS-friendly CSV buffers (multiple attachments)
        const csvAttachments = createSpssFriendlyCsvs(staircaseData, demographicsData, today);
        
        // Send email with CSV attachments
        await sendEmail(resendApiKey, fromEmail, recipientEmails, today, staircaseData.length, demographicsData.length, csvAttachments);

        return res.status(200).json({
            success: true,
            message: `Full database report sent successfully. ${staircaseData.length} staircase results and ${demographicsData.length} demographic records included.`
        });

    } catch (error) {
        console.error('Error in test-email-report:', error);
        return res.status(500).json({ 
            error: error.message 
        });
    }
}

// === SPSS-FRIENDLY EXPORT HELPERS ===

function toNumber(value) {
    if (value === null || value === undefined || value === '') return '';
    const cleaned = String(value).replace(/[€,$\s]/g, '').replace(',', '.');
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : '';
}

function codeYesNo(value) {
    if (value === undefined || value === null || value === '') return '';
    const v = String(value).toLowerCase();
    if (['sim','yes','y','true','1'].includes(v)) return 1;
    if (['não','nao','no','n','false','0'].includes(v)) return 0;
    return '';
}

function codeGender(value) {
    const v = String(value || '').toLowerCase();
    if (v.startsWith('f')) return 1; // Female
    if (v.startsWith('m')) return 2; // Male
    if (v.startsWith('o')) return 3; // Other
    return 9; // Prefer not to say / unknown
}

function codePurchasePreference(value) {
    const v = String(value || '').toLowerCase();
    if (v.includes('online')) return 1;
    if (v.includes('presencial') || v.includes('person')) return 2;
    return '';
}

function createSpssFriendlyCsvs(staircaseData, demographicsData, today) {
    const staircaseSummaryRows = [];
    const staircaseTrialsRows = [];

    for (const row of staircaseData) {
        const points = row.indifference_points || {};
        const raw = row.raw_history || [];

        for (const product of raw) {
            const pid = product.id || '';
            const pname = product.name || '';
            const price = toNumber(product.price);
            const ipObj = points[pid] || {};
            const ip = toNumber(ipObj.point);
            const presentationOrder = product.presentationOrder || '';
            const startDiscount = toNumber(product.startDiscount);
            const failedCt = product.failedCatchTrials ?? '';

            staircaseSummaryRows.push({
                user_id: row.user_id,
                timestamp: row.timestamp,
                product_id: pid,
                product_name: pname,
                price_eur: price,
                indifference_point_pct: ip,
                presentation_order: presentationOrder,
                start_discount_pct: startDiscount,
                failed_catch_trials: failedCt
            });

            const history = product.history || [];
            for (const t of history) {
                staircaseTrialsRows.push({
                    user_id: row.user_id,
                    timestamp: row.timestamp,
                    product_id: pid,
                    trial_number: t.trialNumber || '',
                    trial_type: t.trialType || '',
                    discount_pct: toNumber(t.discount),
                    choice: t.choice || '',
                    catch_failed: t.catchFailed === true ? 1 : 0
                });
            }
        }
    }

    const demographicsRows = demographicsData.map(d => ({
        user_id: d.user_id,
        timestamp: d.timestamp,
        age: toNumber(d.age),
        gender_text: d.gender || '',
        gender_code: codeGender(d.gender),
        education: d.education || '',
        invests_text: d.invests || '',
        invests_code: codeYesNo(d.invests),
        benefit_preference_text: d.habit || '',
        smokes_text: d.smokes || '',
        smokes_code: codeYesNo(d.smokes),
        gambles_text: d.gambles || '',
        gambles_code: codeYesNo(d.gambles),
        monthly_income_text: d.monthly_income || '',
        price_research_text: d.price_research || '',
        price_research_code: codeYesNo(d.price_research),
        purchase_preference_text: d.purchase_preference || '',
        purchase_preference_code: codePurchasePreference(d.purchase_preference),
        used_traditional_cashback_text: d.used_traditional_cashback || '',
        used_traditional_cashback_code: codeYesNo(d.used_traditional_cashback),
        experience_rating: toNumber(d.experience_rating),
        rating_justification: (d.rating_justification || '').replace(/\r?\n/g, ' '),
        prolific_id: d.prolific_id || '',
        created_at: d.created_at
    }));

    const attachments = [];
    attachments.push(bufferToAttachment(staircaseSummaryRows, `staircase_summary-${today}.csv`));
    attachments.push(bufferToAttachment(staircaseTrialsRows, `staircase_trials-${today}.csv`));
    attachments.push(bufferToAttachment(demographicsRows, `demographics-${today}.csv`));
    return attachments;
}

function bufferToAttachment(rows, filename) {
    const csv = rowsToCsv(rows);
    return {
        filename,
        content: Buffer.from(csv, 'utf8').toString('base64'),
        type: 'text/csv'
    };
}

function rowsToCsv(rows) {
    if (!rows || rows.length === 0) return '';
    const headers = Object.keys(rows[0]);
    const esc = (v) => {
        if (v === null || v === undefined) return '';
        const s = String(v).replace(/"/g, '""');
        return /[",\n\r]/.test(s) ? `"${s}"` : s;
    };
    const dataLines = rows.map(r => headers.map(h => esc(r[h])).join(','));
    return [headers.join(','), ...dataLines].join('\n');
}

// Helper function to send email
async function sendEmail(resendApiKey, fromEmail, recipientEmails, today, staircaseCount, demographicsCount, attachments) {
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
            <p>Three CSV files are attached for SPSS:</p>
            <ol>
                <li>staircase_summary-YYYY-MM-DD.csv</li>
                <li>staircase_trials-YYYY-MM-DD.csv</li>
                <li>demographics-YYYY-MM-DD.csv</li>
            </ol>
            <p>This is an automated report from your survey system.</p>
        `
    };

    if (attachments && attachments.length > 0) {
        emailData.attachments = attachments;
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

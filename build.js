const fs = require('fs');
const path = require('path');

// Read the app.js file
const appJsPath = path.join(__dirname, 'assets', 'app.js');
let content = fs.readFileSync(appJsPath, 'utf8');

// Replace placeholders with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

content = content.replace('VERCEL_SUPABASE_URL_PLACEHOLDER', supabaseUrl);
content = content.replace('VERCEL_SUPABASE_ANON_KEY_PLACEHOLDER', supabaseAnonKey);

// Write the updated content back
fs.writeFileSync(appJsPath, content);

console.log('✅ Environment variables injected into app.js');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : 'Not set');

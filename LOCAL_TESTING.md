# Local Testing Guide

## Quick Start

### Option 1: Using Vercel Dev (Recommended - Database Saving Works ✅)

**This option allows database saving to work locally!**

1. **Set up environment variables** (required for database saving):
   ```bash
   # Create .env.local file in the project root
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
   
   **Note**: Vercel dev automatically loads `.env.local` file.

2. **Run the build script** to inject environment variables into app.js:
   ```bash
   npm run build
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** to the URL shown (usually `http://localhost:3000`)

5. **Database saving will work** - The `/api/save-results` endpoint will be available and will save to your Supabase database.

### Option 2: Using Simple HTTP Server (Database Saving Does NOT Work ❌)

**Use this only for frontend testing - API routes won't work!**

1. **Run the build script**:
   ```bash
   npm run build
   ```

2. **Start a simple HTTP server**:
   ```bash
   npx http-server -p 8080 -o
   ```

3. **Or use Python** (if installed):
   ```bash
   python -m http.server 8080
   ```

4. **Open your browser** to `http://localhost:8080`

5. **Note**: The survey will work, but data will NOT be saved because the `/api/save-results` endpoint is not available with a simple HTTP server. You'll see an error in the console when trying to save.

## Testing Checklist

### ✅ Survey Flow
- [ ] Welcome screen displays correctly
- [ ] Demographics form validates required fields
- [ ] Financial literacy questions work
- [ ] Initial involvement sliders work
- [ ] Preparation screen (yellow attention screen) displays
- [ ] Email framing displays (one of three conditions)
- [ ] Exclusion questions work
- [ ] Manipulation check sliders work
- [ ] Message involvement sliders work (1-9 scale)
- [ ] Intention to use sliders work (1-7 scale)
- [ ] Website presentation displays
- [ ] Emotion evaluation screens work
- [ ] Concerns textarea requires input
- [ ] Thank you screen displays with user ID

### ✅ Functionality
- [ ] All Likert scale sliders update labels correctly
- [ ] Form validation prevents progression without required fields
- [ ] Framing condition is randomly assigned
- [ ] Data structure is correct (check browser console)
- [ ] No JavaScript errors in console

### ✅ Data Saving (requires Supabase setup + Vercel Dev)
**Only works with `npm run dev` (Vercel Dev), NOT with simple HTTP server!**

- [ ] Using `npm run dev` (not simple HTTP server)
- [ ] Environment variables are set in `.env.local`
- [ ] Database schema is created in Supabase (run `supabase-schema.sql`)
- [ ] API endpoint `/api/save-results` is accessible (check network tab)
- [ ] Data saves to `demographics` table
- [ ] Data saves to `framing_study_results` table
- [ ] Framing condition is correctly stored
- [ ] No errors in browser console or network tab

## Troubleshooting

### Issue: "Cannot find module" errors
**Solution**: Run `npm install` to ensure all dependencies are installed.

### Issue: Placeholders not replaced
**Solution**: Run `npm run build` before starting the server.

### Issue: CORS errors when testing
**Solution**: Use Vercel dev (`npm run dev`) instead of a simple HTTP server, as it properly handles API routes.

### Issue: Data not saving
**Solution**: 
1. **Are you using `npm run dev`?** Simple HTTP servers don't support API routes
2. Check that Supabase environment variables are set in `.env.local`
3. Verify the database schema is created in Supabase (run `supabase-schema.sql`)
4. Check browser console and network tab for errors
5. Verify the `/api/save-results` request appears in the Network tab (should return 200 status)
6. Check Vercel dev terminal output for any server-side errors

### Issue: Styling looks broken
**Solution**: Ensure Tailwind CSS CDN is loading (check network tab for `cdn.tailwindcss.com`)

## Testing Different Framing Conditions

To test all three framing conditions, you can:
1. Clear browser localStorage/cookies between tests
2. Or manually set the framing condition in browser console:
   ```javascript
   framingCondition = 'positive'; // or 'negative' or 'neutral'
   ```

## Browser Compatibility

Tested and works with:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires:
- ES6 module support
- Fetch API
- Crypto.randomUUID() support


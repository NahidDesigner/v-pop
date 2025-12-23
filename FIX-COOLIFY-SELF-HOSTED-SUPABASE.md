# Fix CORS and 401 Errors - Coolify + Self-Hosted Supabase

This guide is specifically for fixing CORS and 401 errors when using **Coolify with Docker buildpack** and **self-hosted Supabase on Coolify**.

## Issues You're Experiencing

1. **401 Unauthorized** on public endpoints:
   - `/rest/v1/public_site_settings`
   - `/rest/v1/showcase_samples`
   - `/rest/v1/testimonials`

2. **CORS Error** when trying to login/register:
   - Auth endpoint blocking requests from `https://videopop.vibecodingfield.com` to `https://superbasevpop.vibecodingfield.com`

---

## Step 1: Apply Database Migration

The migration fixes RLS policies to allow anonymous access to public data.

### Option A: Via Supabase Studio (Easiest)

1. **Open Supabase Studio** in Coolify:
   - Go to your Supabase resource in Coolify
   - Click **"Open"** or **"Studio"** button
   - This opens Supabase Studio in your browser

2. **Go to SQL Editor**:
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New Query"**

3. **Run the Migration**:
   - Open the file: `supabase/migrations/20251221000000_fix_public_access_rls.sql`
   - Copy **ALL** the contents
   - Paste into the SQL Editor
   - Click **"Run"** or press `Ctrl+Enter`

4. **Verify Success**:
   - You should see "Success. No rows returned" or similar
   - Check for any error messages

### Option B: Via Supabase CLI (If you have access)

```bash
# SSH into your server or use Coolify terminal
cd /path/to/your/project
supabase db push
```

---

## Step 2: Configure CORS in Self-Hosted Supabase

For self-hosted Supabase, CORS is configured via environment variables in the Supabase services.

### Method 1: Via Coolify Environment Variables (Recommended)

1. **Go to Supabase Resource in Coolify**:
   - Find your Supabase resource
   - Click on it to open settings

2. **Go to Environment Variables**:
   - Look for **"Environment Variables"** or **"Env"** section
   - This is where Supabase services get their config

3. **Add/Update CORS Variables**:

   Add these environment variables to your Supabase resource:

   **For Kong API Gateway (REST API CORS):**
   ```
   KONG_CORS_ORIGINS=https://videopop.vibecodingfield.com,http://localhost:8080
   ```

   **For GoTrue (Auth API CORS) - REQUIRED for login/signup:**
   ```
   GOTRUE_SITE_URL=https://videopop.vibecodingfield.com
   GOTRUE_EXTERNAL_URL=https://superbasevpop.vibecodingfield.com
   GOTRUE_URI_ALLOW_LIST=https://videopop.vibecodingfield.com,https://videopop.vibecodingfield.com/,http://localhost:8080
   GOTRUE_MAILER_AUTOCONFIRM=true
   ```
   
   **Important:** `GOTRUE_MAILER_AUTOCONFIRM=true` allows users to sign up without email confirmation. Set to `false` if you want email verification.

   **For API (Additional CORS headers):**
   ```
   API_EXTERNAL_URL=https://superbasevpop.vibecodingfield.com
   ```

4. **Restart Supabase**:
   - After adding variables, **restart the Supabase resource** in Coolify
   - Click **"Restart"** or **"Redeploy"** button
   - Wait for services to restart (2-3 minutes)

### Method 2: Via Supabase Config File (Advanced)

If you have access to the Supabase config file:

1. **Find Supabase Config**:
   - Usually located in: `/path/to/supabase/config.toml`
   - Or in Coolify volume mounts

2. **Update Config**:
   ```toml
   [api]
   # Add CORS origins
   additional_headers = [
     "Access-Control-Allow-Origin: https://videopop.vibecodingfield.com",
     "Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type",
     "Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"
   ]

   [auth]
   site_url = "https://videopop.vibecodingfield.com"
   external_url = "https://superbasevpop.vibecodingfield.com"
   uri_allow_list = ["https://videopop.vibecodingfield.com", "http://localhost:8080"]
   ```

3. **Restart Supabase**

---

## Step 3: Verify Environment Variables in Your App

Make sure your **Video Pop app** in Coolify has these environment variables set:

1. **Go to your Video Pop app** in Coolify
2. **Check Environment Variables**:
   - `VITE_SUPABASE_URL` = `https://superbasevpop.vibecodingfield.com`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = (your anon key from Supabase Studio)
   - `VITE_SUPABASE_PROJECT_ID` = (your project ID)

3. **Important**: If you changed any variables, **rebuild your app**:
   - Click **"Redeploy"** or **"Rebuild"** in Coolify
   - `VITE_*` variables are embedded at build time!

---

## Step 4: Test the Fix

1. **Clear Browser Cache**:
   - Press `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete` on Mac)
   - Clear cached images and files
   - Reload the page

2. **Check Browser Console** (F12):
   - Should see no 401 errors
   - Should see no CORS errors
   - Check Network tab - requests should return 200 status

3. **Test Login/Register**:
   - Try logging in - should work without CORS errors
   - Try registering - should work

---

## Troubleshooting

### Still Getting 401 Errors?

1. **Verify Migration Ran Successfully**:
   ```sql
   -- Run this in Supabase SQL Editor
   SELECT * FROM pg_policies WHERE tablename = 'site_settings';
   SELECT * FROM pg_policies WHERE tablename = 'showcase_samples';
   SELECT * FROM pg_policies WHERE tablename = 'testimonials';
   ```
   You should see policies allowing `anon` role to SELECT.

2. **Check View Grants**:
   ```sql
   SELECT grantee, privilege_type 
   FROM information_schema.role_table_grants 
   WHERE table_name = 'public_site_settings';
   ```
   Should show `anon` and `authenticated` have SELECT privilege.

3. **Verify Site Settings Exist**:
   ```sql
   SELECT * FROM site_settings LIMIT 1;
   ```
   Should return at least one row.

### Still Getting CORS Errors?

1. **Check Supabase Logs in Coolify**:
   - Go to Supabase resource → **"Logs"**
   - Look for CORS-related errors
   - Check if services restarted properly

2. **Verify Environment Variables**:
   - Make sure CORS variables are set correctly
   - No typos in URLs
   - URLs match exactly (including `https://` and no trailing slashes)

3. **Test CORS Directly**:
   ```bash
   # Test from your server
   curl -H "Origin: https://videopop.vibecodingfield.com" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: authorization,content-type" \
        -X OPTIONS \
        https://superbasevpop.vibecodingfield.com/auth/v1/token
   ```
   Should return CORS headers in response.

4. **Check Kong Service**:
   - In Supabase logs, look for Kong service
   - Kong handles CORS for REST API
   - Make sure `KONG_CORS_ORIGINS` is set

5. **Check GoTrue Service**:
   - GoTrue handles CORS for Auth API
   - Make sure `GOTRUE_URI_ALLOW_LIST` includes your frontend URL

### Can't Find Environment Variables in Coolify?

1. **Check Different Sections**:
   - Some Coolify versions have env vars in:
     - **"Configuration"** → **"Environment Variables"**
     - **"Settings"** → **"Environment"**
     - **"Advanced"** → **"Environment Variables"**

2. **Check Resource Type**:
   - Supabase might be deployed as a Docker Compose stack
   - Look for **"Docker Compose"** or **"Stack"** section
   - Environment variables might be in the compose file

3. **Use Coolify Terminal**:
   - If you have terminal access, you can set env vars via CLI
   - Or edit the Docker Compose file directly

---

## Quick Reference: Required Environment Variables

### For Supabase Resource (CORS):

```
KONG_CORS_ORIGINS=https://videopop.vibecodingfield.com,http://localhost:8080
GOTRUE_SITE_URL=https://videopop.vibecodingfield.com
GOTRUE_EXTERNAL_URL=https://superbasevpop.vibecodingfield.com
GOTRUE_URI_ALLOW_LIST=https://videopop.vibecodingfield.com,http://localhost:8080
```

### For Your App Resource:

```
VITE_SUPABASE_URL=https://superbasevpop.vibecodingfield.com
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PROJECT_ID=your-project-id
```

---

## Still Need Help?

1. **Check Supabase Logs**: Look for specific error messages
2. **Check App Logs**: See if there are build-time errors
3. **Verify URLs Match**: Frontend and backend URLs must be correct
4. **Test with curl**: Use curl commands to test CORS directly

---

**After completing these steps, your app should work without CORS or 401 errors!** 🎉


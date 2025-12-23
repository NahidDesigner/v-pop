# Fix CORS and 401 Errors

This document explains how to fix the CORS and 401 Unauthorized errors you're experiencing.

## Issues

1. **401 Unauthorized** on public endpoints:
   - `/rest/v1/public_site_settings`
   - `/rest/v1/showcase_samples`
   - `/rest/v1/testimonials`

2. **CORS Error** when trying to login/register:
   - Auth endpoint blocking requests from `https://videopop.vibecodingfield.com` to `https://superbasevpop.vibecodingfield.com`

## Solution

### Step 1: Run the Database Migration

A new migration has been created to fix the RLS (Row Level Security) policies for public access:

```bash
# If using Supabase CLI locally
supabase db push

# Or apply the migration manually in your Supabase dashboard:
# Go to SQL Editor > New Query > Paste the contents of:
# supabase/migrations/20251221000000_fix_public_access_rls.sql
```

The migration:
- Fixes RLS policies for `public_site_settings` view
- Ensures `showcase_samples` allows anonymous access
- Creates `testimonials` table if missing and adds proper RLS policies
- Ensures default site settings exist

### Step 2: Fix CORS in Supabase Dashboard

CORS configuration must be done in your Supabase project settings:

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `superbasevpop` (or your project name)
3. **Go to Settings** → **API** (or **Auth** → **URL Configuration**)
4. **Add your frontend URL to allowed origins**:
   - `https://videopop.vibecodingfield.com`
   - `http://localhost:8080` (for local development)
   - `http://localhost:5173` (if using Vite default port)

5. **Save the changes**

### Step 3: Verify Environment Variables

Ensure your frontend has the correct Supabase URL and keys:

```env
VITE_SUPABASE_URL=https://superbasevpop.vibecodingfield.com
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
```

**Important**: Make sure you're using the **anon/public key**, not the service role key.

### Step 4: Test the Fix

1. **Clear browser cache** and reload
2. **Check browser console** - should see no 401 errors
3. **Try logging in** - CORS error should be gone
4. **Check Network tab** - requests should return 200 status

## If Issues Persist

### Check Supabase Project Settings

1. **Verify API URL**: Should match your `VITE_SUPABASE_URL`
2. **Check Auth Settings**:
   - Go to **Authentication** → **URL Configuration**
   - Ensure **Site URL** is set to your frontend URL
   - Add **Redirect URLs** if using email confirmation

### Verify RLS Policies

Run this query in Supabase SQL Editor to check policies:

```sql
-- Check site_settings policies
SELECT * FROM pg_policies WHERE tablename = 'site_settings';

-- Check showcase_samples policies
SELECT * FROM pg_policies WHERE tablename = 'showcase_samples';

-- Check testimonials policies
SELECT * FROM pg_policies WHERE tablename = 'testimonials';
```

### Check View Grants

```sql
-- Check if views are accessible
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'public_site_settings';
```

## Self-Hosted Supabase

If you're using self-hosted Supabase, you need to configure CORS in your Supabase config:

1. **Edit `supabase/config.toml`**:
```toml
[api]
# Add your frontend domain
additional_headers = [
  "Access-Control-Allow-Origin: https://videopop.vibecodingfield.com",
  "Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type"
]
```

2. **Restart Supabase**:
```bash
supabase stop
supabase start
```

Or if using Docker directly, restart the API service.

## Additional Notes

- The migration creates the `testimonials` table if it doesn't exist
- Default site settings are inserted if none exist
- All public views use `security_invoker = on` which respects RLS on underlying tables
- Anonymous users can only read active testimonials and samples (where `is_active = true`)


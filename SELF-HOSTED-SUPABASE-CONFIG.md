# 🔧 Configuring Self-Hosted Supabase (Without Studio)

## The Problem

Self-hosted Supabase might not have Studio UI accessible, or it's at a different URL. Here's how to configure it without Studio.

---

## 🔍 Option 1: Find Supabase Studio URL

Self-hosted Supabase Studio might be at a different port or path:

### Common URLs to Try:

1. **Default Studio URL:**
   ```
   http://your-server-ip:8000
   ```
   or
   ```
   https://superbasevpop.vibecodingfield.com:8000
   ```

2. **Check Coolify:**
   - In Coolify, find your Supabase resource
   - Look for an **"Open"** button or URL
   - Click it to access Studio

3. **Check Docker Containers:**
   - Supabase Studio usually runs on port `8000`
   - Check if port 8000 is exposed in Coolify

---

## 🔍 Option 2: Configure via SQL (Direct Database Access)

If Studio isn't available, you can configure everything via SQL:

### Step 1: Access Your Database

You can connect to your Supabase database directly:

**Using psql (if you have access):**
```bash
psql postgresql://postgres:YOUR_PASSWORD@your-db-host:54322/postgres
```

**Or use a database tool:**
- DBeaver
- pgAdmin
- TablePlus
- Any PostgreSQL client

**Connection details:**
- Host: Your Supabase database host
- Port: `54322` (usually)
- Database: `postgres`
- User: `postgres`
- Password: Your `POSTGRES_PASSWORD` from Supabase .env

### Step 2: Configure Auth Redirect URLs via SQL

Run this SQL in your database:

```sql
-- Update auth configuration
UPDATE auth.config 
SET 
  site_url = 'https://videopop.vibecodingfield.com',
  additional_redirect_urls = ARRAY[
    'https://videopop.vibecodingfield.com',
    'https://videopop.vibecodingfield.com/auth',
    'https://videopop.vibecodingfield.com/dashboard'
  ]
WHERE id = 1;
```

**Or if that table doesn't exist, check Supabase version and use appropriate method.**

---

## 🔍 Option 3: Configure via Environment Variables

For self-hosted Supabase, many settings are in environment variables:

### In Coolify → Supabase Resource → Environment Variables:

**Auth Settings:**
```
SITE_URL=https://videopop.vibecodingfield.com
ADDITIONAL_REDIRECT_URLS=https://videopop.vibecodingfield.com,https://videopop.vibecodingfield.com/auth
```

**API Settings:**
- `ANON_KEY` - Your public key (this is what you need for `VITE_SUPABASE_PUBLISHABLE_KEY`)
- `SERVICE_ROLE_KEY` - Your admin key (keep secret!)

---

## 🔍 Option 4: Use Supabase CLI

If you have Supabase CLI installed:

```bash
# Link to your self-hosted instance
supabase link --project-ref your-project-id --db-url postgresql://postgres:password@host:54322/postgres

# Open Studio
supabase studio
```

---

## 🎯 Quick Fix: Get Your API Keys

Even without Studio, you can get your keys from:

### Method 1: Check Environment Variables

In Coolify → Supabase Resource → Environment Variables:
- `ANON_KEY` = Your `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SERVICE_ROLE_KEY` = Your admin key (don't use this in frontend!)

### Method 2: Check Supabase Config

The keys are usually in your Supabase `.env` file:
- Look for `ANON_KEY=...`
- This is what you need for your app

### Method 3: Generate New Keys

If you need to generate new keys:

```bash
# Generate anon key
openssl rand -base64 32

# Generate service role key  
openssl rand -base64 32
```

Then update your Supabase `.env` file and restart Supabase.

---

## 🔧 Fix 401 Errors for Self-Hosted

### Step 1: Get Your ANON_KEY

1. In Coolify → Supabase Resource → Environment Variables
2. Find `ANON_KEY`
3. Copy this value

### Step 2: Update Your App's Environment Variables

In Coolify → Your App → Environment Variables:

**`VITE_SUPABASE_PUBLISHABLE_KEY`**
- Set to: The `ANON_KEY` from your Supabase resource
- Make sure it matches exactly!

**`VITE_SUPABASE_URL`**
- Should be: `https://superbasevpop.vibecodingfield.com`
- Or whatever your Supabase API URL is

**`VITE_SUPABASE_PROJECT_ID`**
- This might be optional for self-hosted
- Or set to a custom identifier

### Step 3: Rebuild Your App

After updating variables, rebuild in Coolify.

---

## 🔍 Finding Supabase Studio URL

### Check Coolify Supabase Resource:

1. Go to Coolify → Your Supabase Resource
2. Look for:
   - **"Open"** button
   - **"URL"** or **"Access"** section
   - **Port mappings** (look for port 8000)

### Check Docker Containers:

If you have terminal access:
```bash
docker ps | grep supabase
```

Look for the Studio container and its port mapping.

### Common Ports:

- **Studio:** Port `8000`
- **API:** Port `8000` (same)
- **Database:** Port `54322`

---

## 📋 Quick Checklist

To fix 401 errors with self-hosted Supabase:

- [ ] Found `ANON_KEY` in Supabase environment variables
- [ ] Copied `ANON_KEY` to app's `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] Verified `VITE_SUPABASE_URL` is correct
- [ ] Rebuilt app in Coolify
- [ ] Tested login/register

---

## 💡 Alternative: Check Supabase Logs

If you can't find Studio, check Supabase logs in Coolify:
- Coolify → Supabase Resource → Logs
- Look for any errors or configuration info

---

**The key is: Get your `ANON_KEY` from Supabase environment variables and use it in your app!**


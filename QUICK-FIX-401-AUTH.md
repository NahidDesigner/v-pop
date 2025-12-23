# Quick Fix: 401 "Invalid authentication credentials"

You're getting 401 errors because your API key is **invalid or incorrect**. Here's how to fix it:

## The Problem

Your key is configured (208 characters), but Supabase is rejecting it with:
```
"Invalid authentication credentials"
```

This means:
- ❌ The key doesn't match what's in your Supabase instance
- ❌ You might be using the wrong key (SERVICE_ROLE_KEY instead of ANON_KEY)
- ❌ The key might be from a different Supabase project

## Quick Fix Steps

### Step 1: Get the Correct Anon Key from Supabase

1. **Open Supabase Studio**:
   - In Coolify → Your Supabase Resource → Click "Open" or "Studio"

2. **Go to Settings → API**:
   - Click the gear icon (Settings) in the left sidebar
   - Click "API" or "General"
   - Look for **"anon public"** or **"anon key"**

3. **Copy the ENTIRE key**:
   - It should start with `eyJhbGciOiJIUzI1NiIs...`
   - It's usually 200+ characters long
   - Copy the WHOLE thing (no spaces, no quotes)

### Step 2: Verify It's the ANON_KEY (Not Service Role)

**Important:** You need the **anon/public key**, NOT the service role key!

- ✅ **ANON_KEY** = Starts with `eyJ...`, used in frontend
- ❌ **SERVICE_ROLE_KEY** = Also starts with `eyJ...`, but is for server-side only

**How to tell:**
- In Supabase Studio → Settings → API
- Look for **"anon public"** or **"anon key"** (this is what you need)
- **NOT** "service_role" or "service role key"

### Step 3: Update Your App's Environment Variable

1. **In Coolify → Your Video Pop App → Environment Variables**

2. **Find `VITE_SUPABASE_PUBLISHABLE_KEY`**

3. **Replace the value** with the anon key you copied from Step 1

4. **Make sure:**
   - No quotes around the value
   - No spaces before/after
   - The entire key is pasted (all 200+ characters)

### Step 4: Rebuild Your App

**CRITICAL:** After changing `VITE_*` variables, you MUST rebuild!

1. Click **"Redeploy"** or **"Rebuild"** in Coolify
2. Wait for build to complete (3-5 minutes)
3. The new key will be embedded in your app

### Step 5: Test Again

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Reload the page**
3. **Open browser console** and run:
   ```javascript
   await window.__SUPABASE_DEBUG__.testConnection();
   ```

**Expected results:**
- ✅ REST API Status: 200 (not 401)
- ✅ Auth Health Status: 200 (not 401)
- ✅ Signup Test Status: 200 or 400 (not 401)

---

## Alternative: Get Key from Environment Variables

If you can't access Supabase Studio, get it from Coolify:

1. **In Coolify → Supabase Resource → Environment Variables**
2. **Find `ANON_KEY`** (not `SERVICE_ROLE_KEY`)
3. **Copy that value**
4. **Use it in your app's `VITE_SUPABASE_PUBLISHABLE_KEY`**

---

## Verify Key Format

Your key should:
- ✅ Start with `eyJ` (JWT header)
- ✅ Be 200+ characters long
- ✅ Be a valid JWT (you can decode at jwt.io to verify)

**Common mistakes:**
- Using SERVICE_ROLE_KEY instead of ANON_KEY ❌
- Truncated key (missing characters) ❌
- Extra quotes or spaces ❌
- Key from different Supabase project ❌

---

## Still Not Working?

### Check Supabase Logs

In Coolify → Supabase Resource → Logs:
- Look for errors about "invalid key" or "unauthorized"
- Check if GoTrue service is running

### Verify Key in Database

If you have database access, you can check:

```sql
-- Check if the key exists in Supabase config
SELECT * FROM auth.config;
```

### Test Key Directly

Use curl to test:

```bash
curl -X POST https://superbasevpop.vibecodingfield.com/auth/v1/signup \
  -H "apikey: YOUR_ANON_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

Replace `YOUR_ANON_KEY_HERE` with your actual anon key.

**Expected:**
- ✅ 200 or 400 status = Key is valid
- ❌ 401 status = Key is invalid

---

## Most Common Issue

**You're using the SERVICE_ROLE_KEY instead of ANON_KEY!**

- SERVICE_ROLE_KEY = For server-side only (bypasses RLS)
- ANON_KEY = For frontend (respects RLS)

Make sure you're using the **ANON_KEY** in your frontend app!

---

**After fixing the key and rebuilding, your auth should work!** 🎉


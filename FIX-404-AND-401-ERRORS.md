# 🔧 Fix: 404 on Reload + 401 Unauthorized Errors

## Two Problems Found

### Problem 1: 404 on Reload
- **Symptom:** Site loads fine on first visit, but shows 404 when you reload or navigate directly to `/auth`
- **Cause:** Nginx not configured for SPA (Single Page Application) routing
- **Fix:** Added `nginx.conf` to handle React Router routes

### Problem 2: 401 Unauthorized
- **Symptom:** All Supabase requests return 401
- **Cause:** API key is only 32 characters (should be 200+)
- **Current:** `keyLength: 32, keyPrefix: '826fee5b5aa44e0db3f3...'`
- **Expected:** Should be 200+ characters starting with `eyJ...`

---

## ✅ Fix 1: Nginx SPA Routing (404 on Reload)

**Status:** ✅ **FIXED** - Added `nginx.conf` file

The Dockerfile now includes proper Nginx configuration that:
- Serves `index.html` for all routes (so React Router can handle them)
- Caches static assets properly
- Handles direct navigation to `/auth`, `/dashboard`, etc.

**What to do:**
1. Rebuild your app in Coolify
2. The 404 on reload should be fixed!

---

## ✅ Fix 2: Get Correct ANON_KEY (401 Errors)

### The Problem

Your current key is only **32 characters**:
```
keyLength: 32
keyPrefix: '826fee5b5aa44e0db3f3...'
```

**This is WRONG!** A Supabase ANON_KEY should be:
- **200+ characters long**
- Start with `eyJ...` (it's a JWT token)

The 32-character value looks like a **project ID**, not the actual API key!

### How to Get the Correct ANON_KEY

#### Option 1: From Supabase Environment Variables (Recommended)

1. In **Coolify** → **Supabase Resource** → **Environment Variables**
2. Look for `ANON_KEY`
3. It should be a **very long string** (200+ characters)
4. It should start with `eyJ...`

**If you see a short 32-character value:**
- That's not the ANON_KEY
- Look for a different variable name
- Or generate a new one (see Option 2)

#### Option 2: Generate New ANON_KEY

If you can't find the correct ANON_KEY, you may need to generate one:

1. **Access your Supabase database** (via psql or database tool)
2. **Check the `auth.config` table** for existing keys
3. **Or regenerate** using Supabase CLI or configuration

**For self-hosted Supabase, ANON_KEY is usually:**
- Generated from `JWT_SECRET` + project settings
- Stored in environment variables
- Should match the format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long)

#### Option 3: Check Supabase Logs

1. In Coolify → Supabase Resource → **Logs**
2. Look for startup logs
3. Sometimes ANON_KEY is printed in logs (be careful - don't share publicly!)

---

## 🔍 Step-by-Step: Fix the 401 Error

### Step 1: Find the Correct ANON_KEY

1. Go to **Coolify** → **Supabase Resource**
2. Click **Environment Variables**
3. Look for `ANON_KEY` (or `SUPABASE_ANON_KEY`)
4. **Copy the ENTIRE value** (should be 200+ characters)

**If you only see short values:**
- Check other variable names: `ANON_KEY`, `SUPABASE_ANON_KEY`, `PUBLIC_ANON_KEY`
- Check if there's a way to view Supabase configuration
- You might need to access Supabase Studio or database directly

### Step 2: Verify the Key Format

The key should:
- ✅ Be 200+ characters long
- ✅ Start with `eyJ...`
- ✅ Look like a JWT token (three parts separated by dots)

**Example format:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXJwcm9qZWN0aWQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2ODAwMCwiZXhwIjoxOTU0NTQ0MDAwfQ.verylongsignaturehere...
```

### Step 3: Update Your App's Environment Variable

1. Go to **Coolify** → **Your App** → **Environment Variables**
2. Find `VITE_SUPABASE_PUBLISHABLE_KEY`
3. **Replace** the 32-character value with the **full ANON_KEY** (200+ chars)
4. Make sure there are **no spaces** before or after
5. **Save**

### Step 4: Rebuild Your App

**⚠️ CRITICAL:** After changing the variable, you MUST rebuild!

1. Click **"Redeploy"** or **"Rebuild"** in Coolify
2. Wait for build to complete
3. Clear browser cache (Ctrl+Shift+Delete)
4. Test again

### Step 5: Verify It's Fixed

After rebuild, check browser console (F12):

```javascript
console.log('Key length:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.length);
```

**Should show:** `200+` (not `32`)

---

## 🎯 Quick Checklist

### For 404 on Reload:
- [x] `nginx.conf` file created ✅
- [x] Dockerfile updated to use nginx.conf ✅
- [ ] Rebuild app in Coolify
- [ ] Test: Reload `/auth` page - should work!

### For 401 Errors:
- [ ] Found `ANON_KEY` in Supabase environment variables
- [ ] Verified it's 200+ characters (not 32)
- [ ] Verified it starts with `eyJ...`
- [ ] Updated `VITE_SUPABASE_PUBLISHABLE_KEY` in app
- [ ] Rebuilt app in Coolify
- [ ] Tested login/register - should work!

---

## 💡 Why This Happened

### 404 on Reload:
- React Router handles routes client-side
- When you reload `/auth`, Nginx looks for a file at that path
- No file exists, so 404
- **Fix:** Tell Nginx to serve `index.html` for all routes

### 401 Errors:
- You might have copied the **project ID** instead of the **ANON_KEY**
- Or the ANON_KEY wasn't set correctly in Supabase
- Or it's stored under a different variable name
- **Fix:** Get the correct 200+ character JWT token

---

## 🚨 If You Still Can't Find ANON_KEY

If you can't find the correct ANON_KEY in Coolify:

1. **Check Supabase documentation** for self-hosted setup
2. **Access Supabase database directly** and check `auth.config` table
3. **Check Supabase startup logs** for the key
4. **Regenerate** if needed (this might require restarting Supabase)

**The key is:** You need the **JWT token** (200+ chars), not the project ID (32 chars)!

---

**Next Steps:**
1. Rebuild app (fixes 404)
2. Find correct ANON_KEY (200+ chars)
3. Update environment variable
4. Rebuild again
5. Test!


# 🔧 Fix: 401 Errors Even With Correct Key Format

## Current Status

✅ **Key format is correct:**
- Length: 208 characters ✅
- Starts with `eyJ...` ✅
- Proper JWT format ✅

❌ **Still getting 401 errors:**
- `/auth/v1/token` → 401 Unauthorized
- `/auth/v1/signup` → 401 Unauthorized
- Error: "Invalid authentication credentials"

---

## 🔍 Root Cause Analysis

If the key format is correct but you still get 401, it means:

1. **The key in your app doesn't match the key Supabase expects**
   - App has one ANON_KEY
   - Supabase is using a different ANON_KEY
   - They must match exactly!

2. **Supabase auth configuration issue**
   - Auth not enabled
   - Redirect URLs not configured
   - Email confirmation required but SMTP not set up

3. **JWT_SECRET mismatch**
   - ANON_KEY is generated from JWT_SECRET
   - If JWT_SECRET changed, old ANON_KEY becomes invalid

---

## ✅ Solution 1: Verify Keys Match Exactly

### Step 1: Get ANON_KEY from Supabase

1. In **Coolify** → **Supabase Resource** → **Environment Variables**
2. Find `ANON_KEY`
3. **Copy the ENTIRE value** (all 208 characters)
4. Copy the **first 50 characters** for comparison

### Step 2: Get ANON_KEY from Your App

1. In **Coolify** → **Your App** → **Environment Variables**
2. Find `VITE_SUPABASE_PUBLISHABLE_KEY`
3. **Copy the ENTIRE value**
4. Copy the **first 50 characters** for comparison

### Step 3: Compare

**They must match EXACTLY:**
- Same length (208 characters)
- Same first 50 characters
- No extra spaces
- No differences

**If they don't match:**
- Update `VITE_SUPABASE_PUBLISHABLE_KEY` to match `ANON_KEY` exactly
- Rebuild your app

---

## ✅ Solution 2: Check Supabase Auth Configuration

### Issue: Auth Not Enabled or Misconfigured

Self-hosted Supabase might need explicit auth configuration.

### Check 1: Verify Auth is Enabled

1. Try accessing Supabase Studio (if available)
2. Go to **Authentication** → **Settings**
3. Make sure **"Enable email signup"** is ON
4. Make sure **"Enable email login"** is ON

### Check 2: Configure Redirect URLs

Even without Studio, you can configure via SQL or environment variables:

**In Coolify → Supabase Resource → Environment Variables:**

Add or verify:
```
SITE_URL=https://videopop.vibecodingfield.com
ADDITIONAL_REDIRECT_URLS=https://videopop.vibecodingfield.com,https://videopop.vibecodingfield.com/auth,https://videopop.vibecodingfield.com/dashboard
```

### Check 3: Disable Email Confirmation (For Testing)

If email confirmation is required but SMTP isn't configured:

**Via SQL (if you have database access):**
```sql
-- Disable email confirmation temporarily
UPDATE auth.config 
SET enable_signup = true,
    enable_email_signup = true,
    enable_email_confirmations = false;
```

**Or via environment variable:**
```
ENABLE_EMAIL_CONFIRMATIONS=false
```

Then restart Supabase.

---

## ✅ Solution 3: Verify JWT_SECRET

### The Problem

ANON_KEY is generated from `JWT_SECRET`. If `JWT_SECRET` changed:
- Old ANON_KEY becomes invalid
- New ANON_KEY must be regenerated

### How to Check

1. In **Coolify** → **Supabase Resource** → **Environment Variables**
2. Find `JWT_SECRET`
3. Note the value (don't change it!)

### How to Fix

If JWT_SECRET was changed:
1. **Regenerate ANON_KEY** based on new JWT_SECRET
2. Or **restore old JWT_SECRET** if you want to keep existing ANON_KEY

**For self-hosted Supabase, ANON_KEY generation:**
- Usually done automatically on startup
- Based on `JWT_SECRET` + project settings
- Stored in environment variables

---

## ✅ Solution 4: Test Supabase Connection Directly

### Test 1: Check if Supabase is Accessible

In browser, try:
```
https://superbasevpop.vibecodingfield.com/rest/v1/
```

**Expected:** Should return JSON (even if 401, means Supabase is reachable)

### Test 2: Test with Correct Key

In browser console (F12), run:

```javascript
const testAuth = async () => {
  const url = 'https://superbasevpop.vibecodingfield.com';
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  
  console.log('Testing with key:', key.substring(0, 50) + '...');
  
  // Test 1: REST API
  try {
    const restResponse = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    console.log('REST API Status:', restResponse.status);
    console.log('REST API Response:', await restResponse.text());
  } catch (error) {
    console.error('REST API Error:', error);
  }
  
  // Test 2: Auth API
  try {
    const authResponse = await fetch(`${url}/auth/v1/health`, {
      headers: {
        'apikey': key
      }
    });
    console.log('Auth Health Status:', authResponse.status);
    console.log('Auth Health Response:', await authResponse.text());
  } catch (error) {
    console.error('Auth Health Error:', error);
  }
};

testAuth();
```

**What to look for:**
- If REST API returns 200 → Key works for data
- If Auth returns 200 → Key works for auth
- If both return 401 → Key doesn't match Supabase's expected key

---

## ✅ Solution 5: Check Network Request Headers

### In Browser:

1. Open **F12** → **Network** tab
2. Try to sign up
3. Find the failed request (red, 401)
4. Click on it → **Headers** tab
5. Look at **Request Headers**

**Check for:**
- `apikey: eyJ...` (should be your full key)
- `authorization: Bearer eyJ...` (might be empty for signup)

**If `apikey` header is missing or wrong:**
- The Supabase client isn't sending it
- Check if key is actually being used

**If `apikey` header is correct but still 401:**
- The key doesn't match what Supabase expects
- Supabase auth configuration issue

---

## 🎯 Most Likely Issues (In Order)

### 1. Key Mismatch (90% likely)
- **Problem:** `VITE_SUPABASE_PUBLISHABLE_KEY` ≠ `ANON_KEY` in Supabase
- **Fix:** Make them match exactly

### 2. Auth Not Configured (5% likely)
- **Problem:** Supabase auth not enabled or redirect URLs wrong
- **Fix:** Configure auth settings

### 3. JWT_SECRET Changed (3% likely)
- **Problem:** JWT_SECRET changed, ANON_KEY invalidated
- **Fix:** Regenerate ANON_KEY or restore JWT_SECRET

### 4. CORS Issue (2% likely)
- **Problem:** CORS blocking requests
- **Fix:** Configure CORS in Supabase

---

## 📋 Step-by-Step Debugging

### Step 1: Verify Keys Match

1. Get `ANON_KEY` from Supabase (first 50 chars)
2. Get `VITE_SUPABASE_PUBLISHABLE_KEY` from app (first 50 chars)
3. Compare - they must match exactly
4. If different, update app variable and rebuild

### Step 2: Test Direct Connection

Run the test script in browser console (see Solution 4)
- If 200 → Key works, check auth config
- If 401 → Key doesn't match, fix it

### Step 3: Check Auth Configuration

1. Verify auth is enabled in Supabase
2. Configure redirect URLs
3. Disable email confirmation (for testing)
4. Restart Supabase if needed

### Step 4: Check Network Headers

1. Check what's actually being sent
2. Verify `apikey` header is correct
3. If correct but still 401 → Supabase config issue

---

## 🚨 Quick Fix Checklist

- [ ] Verified `VITE_SUPABASE_PUBLISHABLE_KEY` matches `ANON_KEY` exactly (first 50 chars same)
- [ ] Rebuilt app after updating key
- [ ] Tested direct connection (see Solution 4)
- [ ] Checked network headers (apikey is being sent)
- [ ] Verified Supabase auth is enabled
- [ ] Configured redirect URLs
- [ ] Disabled email confirmation (for testing)
- [ ] Restarted Supabase (if config changed)

---

## 💡 Next Steps

1. **First:** Verify keys match exactly (compare first 50 characters)
2. **If they match:** Run the test script to see what Supabase returns
3. **If still 401:** Check Supabase auth configuration
4. **If still 401:** Check Supabase logs for errors

**The most common issue is the keys don't match exactly - double-check this first!**


# 🐛 Debug 401 Errors in Browser Console

## Quick Debug Method

I've added a debug helper to your app. After rebuilding, you can test directly in the browser console!

---

## ✅ Step 1: Rebuild Your App

1. The code has been updated with a debug helper
2. Rebuild your app in Coolify
3. Wait for deployment to complete

---

## ✅ Step 2: Test in Browser Console

After rebuild, open your app and press **F12** → **Console** tab.

You should see:
```
✅ Supabase configured: {...}
💡 Debug helper available: window.__SUPABASE_DEBUG__.testConnection()
```

### Run the Test:

```javascript
window.__SUPABASE_DEBUG__.testConnection()
```

This will test:
- ✅ REST API connection
- ✅ Auth health endpoint
- ✅ Signup endpoint

**What to look for:**
- If all return **200** → Key works, check auth config
- If all return **401** → Key doesn't match Supabase
- If REST returns 200 but Auth returns 401 → Auth config issue

---

## ✅ Step 3: Compare Keys

In the console, you can also check:

```javascript
// Get your app's key (first 50 chars)
window.__SUPABASE_DEBUG__.keyFirst50
```

Then compare with:
- **Supabase ANON_KEY** (first 50 chars from Coolify)

**They must match exactly!**

---

## 🔍 Step 4: Check What's Being Sent

### In Network Tab:

1. Open **F12** → **Network** tab
2. Try to sign up
3. Find the failed request (red, 401)
4. Click on it → **Headers** tab
5. Look at **Request Headers**

**Check:**
- `apikey: eyJ...` (should be your full 208-char key)
- `content-type: application/json`

**If `apikey` is correct but still 401:**
- Key matches but Supabase auth config is wrong
- Need to configure redirect URLs, email confirmation, etc.

---

## 🎯 Most Likely Fix

Since your key format is correct (208 chars, `eyJ...`), the issue is likely:

### 1. Keys Don't Match (50% likely)
- **Check:** Compare first 50 chars of app key vs Supabase ANON_KEY
- **Fix:** Update `VITE_SUPABASE_PUBLISHABLE_KEY` to match `ANON_KEY` exactly, rebuild

### 2. Supabase Auth Not Configured (40% likely)
- **Check:** Run the test script, see what status codes you get
- **Fix:** Add these to Supabase environment variables:
  ```
  SITE_URL=https://videopop.vibecodingfield.com
  ADDITIONAL_REDIRECT_URLS=https://videopop.vibecodingfield.com,https://videopop.vibecodingfield.com/auth
  ENABLE_EMAIL_CONFIRMATIONS=false
  ```
  Then restart Supabase

### 3. JWT_SECRET Mismatch (10% likely)
- **Check:** If JWT_SECRET changed, ANON_KEY becomes invalid
- **Fix:** Regenerate ANON_KEY or restore JWT_SECRET

---

## 📋 Action Plan

1. **Rebuild app** (to get debug helper)
2. **Run test:** `window.__SUPABASE_DEBUG__.testConnection()`
3. **Check results:**
   - All 401 → Keys don't match
   - REST 200, Auth 401 → Auth config issue
   - All 200 → Key works, check other config
4. **Compare keys:** `window.__SUPABASE_DEBUG__.keyFirst50` vs Supabase ANON_KEY
5. **If keys match:** Configure Supabase auth (redirect URLs, email confirmation)
6. **Restart Supabase** if you changed config
7. **Test again**

---

**After rebuilding, run the test script and share the results!**


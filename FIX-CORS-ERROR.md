# 🔧 Fix: CORS Error - "No 'Access-Control-Allow-Origin' header"

## ✅ Good News!

The error changed from **401 (authentication)** to **CORS (cross-origin)**. This means:
- ✅ Your API key is likely working now!
- ❌ But Supabase isn't allowing requests from your app's domain

---

## The Problem

Your app is at: `https://videopop.vibecodingfield.com`
Your Supabase is at: `https://superbasevpop.vibecodingfield.com`

**Supabase needs to be configured to allow requests from your app's domain.**

---

## ✅ Solution: Configure CORS in Supabase

### For Self-Hosted Supabase, add these environment variables:

In **Coolify** → **Supabase Resource** → **Environment Variables**, add:

```
ALLOWED_ORIGINS=https://videopop.vibecodingfield.com,https://videopop.vibecodingfield.com
```

**Or if you want to allow all origins (for testing only):**
```
ALLOWED_ORIGINS=*
```

**⚠️ Security Note:** Using `*` allows any domain. For production, use specific domains.

---

## ✅ Alternative: Configure via Supabase Config

If `ALLOWED_ORIGINS` doesn't work, check your Supabase configuration file.

### For Supabase Docker setup:

You might need to configure CORS in the Supabase configuration. Check if there's a:
- `config.toml` file
- Or environment variable like `SUPABASE_CORS_ORIGINS`

### Common CORS environment variables:

```
CORS_ORIGINS=https://videopop.vibecodingfield.com
# or
SUPABASE_CORS_ORIGINS=https://videopop.vibecodingfield.com
# or
ALLOWED_ORIGINS=https://videopop.vibecodingfield.com
```

---

## ✅ Step-by-Step Fix

### Step 1: Add CORS Configuration

1. Go to **Coolify** → **Supabase Resource** → **Environment Variables**
2. Add new variable:
   - **Name:** `ALLOWED_ORIGINS`
   - **Value:** `https://videopop.vibecodingfield.com`
3. **Save**

### Step 2: Restart Supabase

**⚠️ Important:** After adding environment variables, restart Supabase!

1. In Coolify → Supabase Resource
2. Click **"Restart"** or **"Redeploy"**
3. Wait for it to start

### Step 3: Test Again

1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh your app
3. Try login/register again
4. CORS errors should be gone!

---

## 🔍 If ALLOWED_ORIGINS Doesn't Work

Different Supabase setups use different variable names. Try these:

### Option 1: CORS_ORIGINS
```
CORS_ORIGINS=https://videopop.vibecodingfield.com
```

### Option 2: SUPABASE_CORS_ORIGINS
```
SUPABASE_CORS_ORIGINS=https://videopop.vibecodingfield.com
```

### Option 3: Check Supabase Documentation

For your specific Supabase version/installation, check:
- Supabase documentation for CORS configuration
- Your Supabase setup's README
- Coolify Supabase resource settings

---

## 🔍 Verify CORS is Working

After restarting Supabase, check the response headers:

1. Open browser → F12 → **Network** tab
2. Try to make a request (login, load page)
3. Click on the request → **Headers** tab
4. Look for **Response Headers**:
   - `Access-Control-Allow-Origin: https://videopop.vibecodingfield.com`
   - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
   - `Access-Control-Allow-Headers: ...`

**If you see these headers:** CORS is configured correctly! ✅

---

## 🎯 Quick Checklist

- [ ] Added `ALLOWED_ORIGINS` (or similar) to Supabase environment variables
- [ ] Value includes: `https://videopop.vibecodingfield.com`
- [ ] Restarted Supabase after adding the variable
- [ ] Cleared browser cache
- [ ] Tested login/register - CORS errors gone!

---

## 💡 Multiple Domains

If you need to allow multiple domains, separate them with commas:

```
ALLOWED_ORIGINS=https://videopop.vibecodingfield.com,https://www.videopop.vibecodingfield.com,http://localhost:3000
```

---

## 🚨 If CORS Still Doesn't Work

1. **Check Supabase logs:**
   - Coolify → Supabase Resource → Logs
   - Look for CORS-related errors

2. **Try wildcard (testing only):**
   ```
   ALLOWED_ORIGINS=*
   ```
   ⚠️ Only for testing! Not secure for production.

3. **Check if Supabase has a config file:**
   - Look for `config.toml` or similar
   - Configure CORS there instead

4. **Verify Supabase version:**
   - Different versions might use different CORS configuration methods
   - Check your Supabase documentation

---

## 📋 Summary

**The fix:**
1. Add `ALLOWED_ORIGINS=https://videopop.vibecodingfield.com` to Supabase environment variables
2. Restart Supabase
3. Test again

**This should fix the CORS errors and allow your app to communicate with Supabase!**


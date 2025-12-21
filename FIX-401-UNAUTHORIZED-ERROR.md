# 🔧 Fix: 401 Unauthorized Errors from Supabase

## The Problem

You're seeing **401 (Unauthorized)** errors for all Supabase requests:
- `/auth/v1/token` - Login failing
- `/auth/v1/signup` - Registration failing  
- `/rest/v1/public_site_settings` - Data fetching failing

**This means:** Your Supabase API key is wrong, missing, or not being sent correctly.

---

## ✅ Solution: Fix Environment Variables

### Step 1: Verify Your Supabase Keys

1. Open **Supabase Studio** (your Supabase dashboard)
2. Go to **Settings** → **API**
3. You'll see:
   - **Project URL** (this is your `VITE_SUPABASE_URL`)
   - **anon/public key** (this is your `VITE_SUPABASE_PUBLISHABLE_KEY`)
   - **Project Reference ID** (this is your `VITE_SUPABASE_PROJECT_ID`)

### Step 2: Update Environment Variables in Coolify

1. Go to **Coolify** → Your App → **Environment Variables**
2. Check these 3 variables:

   **Variable 1: `VITE_SUPABASE_URL`**
   - Should be: `https://superbasevpop.vibecodingfield.com`
   - ⚠️ **Important:** Check if it needs `/` at the end or not
   - Try both: `https://superbasevpop.vibecodingfield.com` and `https://superbasevpop.vibecodingfield.com/`

   **Variable 2: `VITE_SUPABASE_PUBLISHABLE_KEY`**
   - Should be: Your **anon/public key** from Supabase Studio
   - ⚠️ **Make sure:** It's the **anon key**, NOT the service role key
   - It should start with `eyJ...` (a long string)

   **Variable 3: `VITE_SUPABASE_PROJECT_ID`**
   - Should be: Your project reference ID from Supabase Studio

### Step 3: Rebuild Your App

**⚠️ CRITICAL:** After changing environment variables, you MUST rebuild!

1. In Coolify, click **"Redeploy"** or **"Rebuild"**
2. Wait for build to complete
3. The new environment variables will be embedded in your app

**Why rebuild?** `VITE_*` variables are embedded at **build time**, not runtime!

---

## 🔍 Common Mistakes

### ❌ Wrong Key Type
- **Problem:** Using SERVICE_ROLE_KEY instead of ANON_KEY
- **Fix:** Use the **anon/public key** (the public one)

### ❌ Key Has Extra Spaces
- **Problem:** Copy-paste added spaces
- **Fix:** Make sure no spaces before/after the key

### ❌ URL Has Wrong Format
- **Problem:** URL format is wrong
- **Fix:** Should be `https://superbasevpop.vibecodingfield.com` (with or without trailing `/`)

### ❌ Variables Not Set
- **Problem:** Variables are empty
- **Fix:** Make sure all 3 variables are filled in

---

## 🧪 Test: Verify Variables Are Correct

After rebuilding, open browser console (F12) and type:

```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.substring(0, 20) + '...');
console.log('Project ID:', import.meta.env.VITE_SUPABASE_PROJECT_ID);
```

**Check:**
- ✅ URL should match your Supabase URL
- ✅ Key should start with `eyJ` (not empty or undefined)
- ✅ Project ID should match Supabase Studio

If any are `undefined`, the variables aren't set correctly!

---

## 📋 Step-by-Step Fix

1. **Get correct values from Supabase Studio:**
   - Settings → API
   - Copy Project URL, anon key, and Project ID

2. **Update in Coolify:**
   - Environment Variables section
   - Update all 3 `VITE_*` variables
   - Double-check for typos/spaces

3. **Rebuild:**
   - Click "Redeploy" in Coolify
   - Wait for build to complete

4. **Test:**
   - Clear browser cache (Ctrl+Shift+Delete)
   - Refresh your app
   - Try login/register again

---

## ⚠️ Important Notes

- **Environment variables are embedded at BUILD TIME**
- **You must rebuild after changing them**
- **The anon key is public** - it's safe to use in frontend
- **Don't use service role key** - that's for backend only

---

## 🎯 Quick Checklist

- [ ] Opened Supabase Studio → Settings → API
- [ ] Copied correct anon/public key (not service role)
- [ ] Updated `VITE_SUPABASE_PUBLISHABLE_KEY` in Coolify
- [ ] Verified `VITE_SUPABASE_URL` is correct
- [ ] Verified `VITE_SUPABASE_PROJECT_ID` is correct
- [ ] **Rebuilt app in Coolify** (most important!)
- [ ] Cleared browser cache
- [ ] Tested login/register again

---

**The fix: Update the environment variables with the correct Supabase keys and rebuild!**


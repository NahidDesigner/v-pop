# 🔧 Fix: Login/Register Not Working

## Common Causes

When login/register doesn't work, it's usually a Supabase configuration issue. Let's check the most common problems:

---

## ✅ Checklist: What to Check

### 1. Check Browser Console for Errors

**First step - see what error you're getting:**

1. Open your app in browser
2. Press **F12** to open Developer Tools
3. Click **"Console"** tab
4. Try to login/register
5. Look for red error messages

**Common errors you might see:**
- `Failed to fetch` → Supabase URL is wrong or CORS issue
- `Invalid API key` → Environment variables not set correctly
- `Email not confirmed` → Email verification required
- `Network error` → Can't reach Supabase

---

## 🔍 Fix 1: Verify Environment Variables

**Check if your environment variables are correct:**

In Coolify → Your App → **Environment Variables**, verify:

1. **`VITE_SUPABASE_URL`**
   - Should be: `https://superbasevpop.vibecodingfield.com/` (your Supabase URL)
   - ⚠️ Make sure it ends with `/` or doesn't (check your Supabase setup)

2. **`VITE_SUPABASE_PUBLISHABLE_KEY`**
   - Should be your Supabase **ANON_KEY**
   - ⚠️ This is the public key, not the service role key

3. **`VITE_SUPABASE_PROJECT_ID`**
   - Should be your Supabase project ID

**After changing environment variables:**
- ⚠️ **You MUST rebuild** your app (these are embedded at build time)
- Click **"Redeploy"** in Coolify

---

## 🔍 Fix 2: Configure Supabase Auth Redirect URLs

**This is the most common issue!**

1. Open **Supabase Studio** (your Supabase dashboard)
2. Go to **Authentication** → **URL Configuration**
3. Set these:

   **Site URL:**
   ```
   https://videopop.vibecodingfield.com
   ```
   (Your app's URL)

   **Redirect URLs:** (Click "Add URL" for each)
   ```
   https://videopop.vibecodingfield.com
   https://videopop.vibecodingfield.com/auth
   https://videopop.vibecodingfield.com/dashboard
   ```

4. Click **"Save"**

**Why this matters:** Supabase needs to know which URLs are allowed for authentication redirects.

---

## 🔍 Fix 3: Disable Email Confirmation (For Testing)

If email confirmation is required but SMTP isn't configured:

1. In **Supabase Studio** → **Authentication** → **Settings**
2. Find **"Enable email confirmations"**
3. **Turn it OFF** (for now, for testing)
4. Click **"Save"**

**After this:**
- Users can sign up without email verification
- You can test login/register immediately
- Later, configure SMTP and turn it back on

---

## 🔍 Fix 4: Check Supabase Auth is Enabled

1. In **Supabase Studio** → **Authentication** → **Settings**
2. Make sure **"Enable email signup"** is **ON**
3. Make sure **"Enable email login"** is **ON**

---

## 🔍 Fix 5: Verify Supabase is Running

1. Check if Supabase is running in Coolify
2. Try accessing Supabase Studio directly
3. If Supabase isn't running, start it in Coolify

---

## 🔍 Fix 6: Check CORS Settings

If you see CORS errors in browser console:

1. In **Supabase Studio** → **Settings** → **API**
2. Check **"CORS"** settings
3. Make sure your app's domain is allowed:
   ```
   https://videopop.vibecodingfield.com
   ```

---

## 🐛 Debugging Steps

### Step 1: Check Browser Console

1. Open browser console (F12)
2. Try to login
3. What error do you see?

### Step 2: Check Network Tab

1. Open browser → F12 → **Network** tab
2. Try to login
3. Look for failed requests (red)
4. Click on them to see the error

### Step 3: Verify Environment Variables

1. In browser console, type:
   ```javascript
   console.log(import.meta.env.VITE_SUPABASE_URL)
   console.log(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
   ```
2. Check if values are correct
3. If they're `undefined`, environment variables aren't set

---

## ✅ Quick Test

Try this in browser console (F12):

```javascript
// Test Supabase connection
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'test123'
});
console.log('Error:', error);
console.log('Data:', data);
```

This will show you the exact error.

---

## 📋 Most Likely Issues (In Order)

1. **Redirect URLs not configured** (90% of issues)
   - Fix: Configure in Supabase Studio → Authentication → URL Configuration

2. **Email confirmation required but SMTP not set**
   - Fix: Disable email confirmation temporarily

3. **Environment variables wrong or not set**
   - Fix: Check in Coolify and rebuild

4. **Supabase not running**
   - Fix: Start Supabase in Coolify

---

## 🎯 Quick Fix Checklist

Go through this in order:

- [ ] Check browser console for errors (F12)
- [ ] Verify environment variables in Coolify
- [ ] Configure redirect URLs in Supabase Studio
- [ ] Disable email confirmation (for testing)
- [ ] Rebuild app in Coolify (if you changed env vars)
- [ ] Try login/register again

---

**Start with checking the browser console - that will tell us exactly what's wrong!**


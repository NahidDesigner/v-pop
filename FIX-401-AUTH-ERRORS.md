# Fix 401 Unauthorized Errors on Auth Endpoints

You're getting 401 errors on `/auth/v1/token` and `/auth/v1/signup`. This guide will help you fix it.

## Quick Diagnosis

First, let's check what's wrong. Open your browser console and run:

```javascript
// Check if keys are set
console.log('URL:', window.__SUPABASE_DEBUG__.url);
console.log('Key (first 50):', window.__SUPABASE_DEBUG__.keyFirst50);

// Test the connection
await window.__SUPABASE_DEBUG__.testConnection();
```

This will show you:
- ✅ If the URL and key are configured
- ❌ What specific error you're getting

---

## Common Causes & Fixes

### Issue 1: Wrong or Missing API Key

**Symptoms:**
- 401 on all auth endpoints
- Console shows key is missing or wrong

**Fix:**

1. **Get the correct anon key from Supabase:**
   - In Coolify → Supabase Resource → Environment Variables
   - Find `ANON_KEY` (not `SERVICE_ROLE_KEY`)
   - Copy the entire value

2. **Update your app's environment variable:**
   - In Coolify → Your Video Pop App → Environment Variables
   - Set `VITE_SUPABASE_PUBLISHABLE_KEY` to the `ANON_KEY` value
   - **Important:** Make sure there are no extra spaces or quotes

3. **Rebuild your app:**
   - Click **"Redeploy"** in Coolify
   - `VITE_*` variables are embedded at build time!

---

### Issue 2: GoTrue Not Configured for Your Domain

**Symptoms:**
- 401 on signup/login
- CORS might work but auth fails

**Fix:**

In Coolify → Supabase Resource → Environment Variables, add/update:

```
GOTRUE_SITE_URL=https://videopop.vibecodingfield.com
GOTRUE_EXTERNAL_URL=https://superbasevpop.vibecodingfield.com
GOTRUE_URI_ALLOW_LIST=https://videopop.vibecodingfield.com,https://videopop.vibecodingfield.com/,http://localhost:8080
```

**Important Notes:**
- `GOTRUE_SITE_URL` = Your frontend URL (where users land after auth)
- `GOTRUE_EXTERNAL_URL` = Your Supabase API URL
- `GOTRUE_URI_ALLOW_LIST` = Allowed redirect URLs (comma-separated, no spaces)

**Then restart Supabase:**
- Click **"Restart"** on your Supabase resource in Coolify
- Wait 2-3 minutes for services to restart

---

### Issue 3: Email Confirmation Required (But Not Configured)

**Symptoms:**
- Signup returns 401
- No email is sent
- User can't verify account

**Fix:**

**Option A: Disable Email Confirmation (For Testing)**

In Coolify → Supabase Resource → Environment Variables:

```
GOTRUE_MAILER_AUTOCONFIRM=true
```

This allows users to sign up without email confirmation.

**Option B: Configure SMTP (For Production)**

If you want email confirmation, configure SMTP:

```
GOTRUE_SMTP_HOST=smtp.gmail.com
GOTRUE_SMTP_PORT=587
GOTRUE_SMTP_USER=your-email@gmail.com
GOTRUE_SMTP_PASS=your-app-password
GOTRUE_SMTP_ADMIN_EMAIL=your-email@gmail.com
GOTRUE_MAILER_URLPATHS_CONFIRMATION=/auth/confirm
GOTRUE_MAILER_URLPATHS_INVITE=/auth/invite
GOTRUE_MAILER_URLPATHS_RECOVERY=/auth/recover
```

**Then restart Supabase.**

---

### Issue 4: API Key Not Being Sent Correctly

**Symptoms:**
- Key exists but requests still fail
- Network tab shows requests without `apikey` header

**Fix:**

1. **Check the built app:**
   - Open browser DevTools → Network tab
   - Try to sign up
   - Look at the request headers
   - Should see: `apikey: eyJ...` header

2. **If header is missing:**
   - The key wasn't embedded at build time
   - Rebuild your app in Coolify
   - Make sure `VITE_SUPABASE_PUBLISHABLE_KEY` is set BEFORE building

3. **Verify the key format:**
   - Should start with `eyJ` (JWT token)
   - Should be long (200+ characters)
   - No quotes or spaces

---

## Step-by-Step Fix

### Step 1: Verify Your Keys

1. **In Supabase Studio:**
   - Go to Settings → API
   - Note down:
     - **Project URL** (should be `https://superbasevpop.vibecodingfield.com`)
     - **anon public key** (starts with `eyJ...`)

2. **In Your App (Coolify):**
   - Check Environment Variables
   - `VITE_SUPABASE_URL` should match Project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` should match anon public key

3. **Test in Browser Console:**
   ```javascript
   console.log('URL:', window.__SUPABASE_DEBUG__.url);
   console.log('Key starts with:', window.__SUPABASE_DEBUG__.keyFirst50);
   ```

### Step 2: Configure GoTrue

In Coolify → Supabase Resource → Environment Variables:

```
GOTRUE_SITE_URL=https://videopop.vibecodingfield.com
GOTRUE_EXTERNAL_URL=https://superbasevpop.vibecodingfield.com
GOTRUE_URI_ALLOW_LIST=https://videopop.vibecodingfield.com,https://videopop.vibecodingfield.com/
GOTRUE_MAILER_AUTOCONFIRM=true
```

**Restart Supabase.**

### Step 3: Rebuild Your App

1. **Verify all environment variables are set**
2. **Click "Redeploy" in Coolify**
3. **Wait for build to complete**

### Step 4: Test

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Reload the page**
3. **Try to sign up** with a new email
4. **Check browser console** for errors

---

## Advanced Troubleshooting

### Check GoTrue Logs

In Coolify → Supabase Resource → Logs:

Look for:
- `gotrue` service logs
- Any errors about "unauthorized" or "invalid key"
- CORS errors

### Test Auth Endpoint Directly

Open browser console and run:

```javascript
// Test signup endpoint
fetch('https://superbasevpop.vibecodingfield.com/auth/v1/signup', {
  method: 'POST',
  headers: {
    'apikey': window.__SUPABASE_DEBUG__.key,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'testpassword123'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

**Expected:**
- ✅ `200` status = Working!
- ❌ `401` = Key is wrong or GoTrue not configured
- ❌ `400` = Request format issue
- ❌ CORS error = CORS not configured (see FIX-COOLIFY-SELF-HOSTED-SUPABASE.md)

### Verify Key Format

The anon key should:
- Start with `eyJ` (JWT header)
- Be 200+ characters long
- Be a valid JWT (you can decode it at jwt.io)

**Common mistakes:**
- Using `SERVICE_ROLE_KEY` instead of `ANON_KEY` ❌
- Extra quotes or spaces ❌
- Truncated key ❌
- Wrong key from different project ❌

---

## Quick Checklist

Before testing, verify:

- [ ] `VITE_SUPABASE_URL` = Your Supabase API URL
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` = Your anon key (from Supabase)
- [ ] `GOTRUE_SITE_URL` = Your frontend URL
- [ ] `GOTRUE_EXTERNAL_URL` = Your Supabase API URL
- [ ] `GOTRUE_URI_ALLOW_LIST` includes your frontend URL
- [ ] `GOTRUE_MAILER_AUTOCONFIRM=true` (if you want no email confirmation)
- [ ] Supabase has been restarted after env var changes
- [ ] Your app has been rebuilt after env var changes
- [ ] Browser cache cleared

---

## Still Not Working?

1. **Check Supabase Logs:**
   - Look for specific error messages
   - Check if GoTrue service is running

2. **Verify Database Connection:**
   - Can you access Supabase Studio?
   - Can you run SQL queries?

3. **Test with curl:**
   ```bash
   curl -X POST https://superbasevpop.vibecodingfield.com/auth/v1/signup \
     -H "apikey: YOUR_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

4. **Check Network Tab:**
   - What status code do you get?
   - What's in the response body?
   - Are the headers correct?

---

## Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `401 Unauthorized` | Wrong API key | Use correct `ANON_KEY` |
| `Invalid API key` | Key format wrong | Check for quotes/spaces |
| `Email not confirmed` | Email confirmation required | Set `GOTRUE_MAILER_AUTOCONFIRM=true` |
| `Redirect URL not allowed` | URL not in allow list | Add to `GOTRUE_URI_ALLOW_LIST` |
| `CORS error` | CORS not configured | See FIX-COOLIFY-SELF-HOSTED-SUPABASE.md |

---

**After fixing, your auth should work!** 🎉


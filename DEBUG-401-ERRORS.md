# 🐛 Debug: 401 Errors Still Happening

## Step-by-Step Debugging Guide

If you've followed all steps but still get 401 errors, let's debug systematically.

---

## 🔍 Step 1: Verify Environment Variables Are Actually Set

### In Browser Console (F12):

Open your deployed app, press F12, go to Console tab, and type:

```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
console.log('Key Length:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.length);
console.log('Key First 20:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.substring(0, 20));
```

**What to check:**
- ✅ URL should be: `https://superbasevpop.vibecodingfield.com`
- ✅ Key should NOT be `undefined`
- ✅ Key should be a long string (usually 200+ characters)
- ✅ Key should start with `eyJ`

**If any are `undefined`:**
- The variables weren't set before build
- You need to set them in Coolify and rebuild

---

## 🔍 Step 2: Check Network Tab - See What's Being Sent

1. Open browser → F12 → **Network** tab
2. Try to login or load the page
3. Find a failed request (red, 401 error)
4. Click on it
5. Go to **Headers** tab
6. Look for **Request Headers**

**Check for:**
- `apikey: eyJ...` (should be your ANON_KEY)
- `authorization: Bearer eyJ...` (might be empty if not logged in)

**If `apikey` header is missing or wrong:**
- The Supabase client isn't sending the key
- Environment variable is wrong

---

## 🔍 Step 3: Verify Supabase ANON_KEY Matches

### In Coolify:

1. Go to **Supabase Resource** → **Environment Variables**
2. Find `ANON_KEY`
3. Copy the first 50 characters

### In Your App Environment Variables:

1. Go to **Your App** → **Environment Variables**
2. Find `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Copy the first 50 characters

**They should match exactly!**

If they don't match:
- Update `VITE_SUPABASE_PUBLISHABLE_KEY` to match `ANON_KEY`
- Rebuild your app

---

## 🔍 Step 4: Test Supabase Connection Directly

### Test 1: Check if Supabase is accessible

In browser, try accessing:
```
https://superbasevpop.vibecodingfield.com/rest/v1/
```

**Expected:** Should return some JSON (even if 401, it means Supabase is reachable)

**If you get connection error:**
- Supabase might not be running
- URL might be wrong
- Network/firewall issue

### Test 2: Test with curl (if you have terminal access)

```bash
curl -H "apikey: YOUR_ANON_KEY" https://superbasevpop.vibecodingfield.com/rest/v1/
```

Replace `YOUR_ANON_KEY` with your actual ANON_KEY from Supabase.

**Expected:** Should return JSON, not 401

**If still 401:**
- The ANON_KEY is wrong
- Supabase configuration issue

---

## 🔍 Step 5: Check Supabase Configuration

### Possible Issues:

1. **ANON_KEY not set in Supabase:**
   - Check Supabase environment variables
   - Make sure `ANON_KEY` exists and has a value

2. **JWT_SECRET mismatch:**
   - If JWT_SECRET changed, ANON_KEY might be invalid
   - Regenerate ANON_KEY in Supabase

3. **CORS issue:**
   - Check if your app's domain is allowed
   - Self-hosted Supabase might need CORS configuration

4. **RLS (Row Level Security) too strict:**
   - Even with correct key, RLS might block requests
   - Check RLS policies in Supabase

---

## 🔍 Step 6: Verify Build Process

### Check if variables are in the build:

1. In Coolify, check the **build logs**
2. Look for any errors about environment variables
3. Make sure build completed successfully

### After rebuild, verify:

1. Clear browser cache completely (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Check console again for environment variables

---

## 🔧 Common Fixes

### Fix 1: Regenerate ANON_KEY

If ANON_KEY seems wrong:

1. In Supabase, generate a new ANON_KEY
2. Update `VITE_SUPABASE_PUBLISHABLE_KEY` in your app
3. Rebuild

### Fix 2: Check URL Format

Try these variations:
- `https://superbasevpop.vibecodingfield.com`
- `https://superbasevpop.vibecodingfield.com/`
- `http://superbasevpop.vibecodingfield.com` (if HTTPS not configured)

### Fix 3: Check Supabase is Running

1. In Coolify, check Supabase resource status
2. Make sure it's running (green/active)
3. Check logs for errors

### Fix 4: Verify Port/Path

Self-hosted Supabase might need:
- Port number: `https://superbasevpop.vibecodingfield.com:8000`
- Different path: `https://superbasevpop.vibecodingfield.com/api`

Check your Supabase configuration in Coolify.

---

## 🎯 Quick Test Script

Add this to your app temporarily to debug:

```javascript
// In browser console
const testSupabase = async () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  
  console.log('Testing Supabase connection...');
  console.log('URL:', url);
  console.log('Key exists:', !!key);
  console.log('Key length:', key?.length);
  
  try {
    const response = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response:', await response.text());
  } catch (error) {
    console.error('Error:', error);
  }
};

testSupabase();
```

Run this in browser console to see what's happening.

---

## 📋 Checklist

- [ ] Environment variables show correct values in browser console
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` matches `ANON_KEY` from Supabase
- [ ] Network tab shows `apikey` header is being sent
- [ ] Supabase URL is accessible (test in browser)
- [ ] Supabase is running in Coolify
- [ ] App was rebuilt after setting variables
- [ ] Browser cache was cleared
- [ ] Test script shows what's wrong

---

**Next step:** Run the browser console checks and share what you see!


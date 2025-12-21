# ✅ Verify: Key Matching and Configuration

## Current Situation

You have 3 Supabase environment variables with the same value (208 characters):
- `SERVICE_SUPABASEANON_KEY`
- `SERVICE_SUPABASESERVICE_KEY`
- `ANON_KEY`

**This is actually fine** - as long as your app uses the same value!

---

## 🔍 Step 1: Verify Your App's Key Matches

### In Coolify → Your App → Environment Variables:

1. Find `VITE_SUPABASE_PUBLISHABLE_KEY`
2. Copy the **first 50 characters**

### Compare with Supabase:

1. In Coolify → Supabase Resource → Environment Variables
2. Find `ANON_KEY`
3. Copy the **first 50 characters**

**They must match exactly!**

If they match:
- ✅ Key is correct
- ❌ Problem is elsewhere (auth config, redirect URLs, etc.)

If they don't match:
- ❌ Update `VITE_SUPABASE_PUBLISHABLE_KEY` to match `ANON_KEY`
- Rebuild your app

---

## 🔍 Step 2: Test Direct Connection

In browser console (F12), run this test:

```javascript
const testConnection = async () => {
  const url = 'https://superbasevpop.vibecodingfield.com';
  const appKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const supabaseAnonKey = 'PASTE_YOUR_ANON_KEY_HERE'; // From Supabase
  
  console.log('=== KEY COMPARISON ===');
  console.log('App Key (first 50):', appKey?.substring(0, 50));
  console.log('Supabase ANON_KEY (first 50):', supabaseAnonKey?.substring(0, 50));
  console.log('Keys match:', appKey?.substring(0, 50) === supabaseAnonKey?.substring(0, 50));
  console.log('App Key length:', appKey?.length);
  console.log('Supabase Key length:', supabaseAnonKey?.length);
  
  console.log('\n=== TESTING CONNECTION ===');
  
  // Test 1: REST API
  try {
    const restResponse = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': appKey,
        'Authorization': `Bearer ${appKey}`
      }
    });
    console.log('REST API Status:', restResponse.status);
    const restText = await restResponse.text();
    console.log('REST API Response (first 200 chars):', restText.substring(0, 200));
  } catch (error) {
    console.error('REST API Error:', error);
  }
  
  // Test 2: Auth Health
  try {
    const authResponse = await fetch(`${url}/auth/v1/health`, {
      headers: {
        'apikey': appKey
      }
    });
    console.log('Auth Health Status:', authResponse.status);
    const authText = await authResponse.text();
    console.log('Auth Health Response:', authText);
  } catch (error) {
    console.error('Auth Health Error:', error);
  }
  
  // Test 3: Try Signup (should fail with 401 if key is wrong)
  try {
    const signupResponse = await fetch(`${url}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'apikey': appKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword123'
      })
    });
    console.log('Signup Test Status:', signupResponse.status);
    const signupText = await signupResponse.text();
    console.log('Signup Test Response:', signupText);
  } catch (error) {
    console.error('Signup Test Error:', error);
  }
};

testConnection();
```

**Replace `PASTE_YOUR_ANON_KEY_HERE` with your actual ANON_KEY from Supabase.**

**What to look for:**
- If REST API returns 200 → Key works for data access
- If Auth Health returns 200 → Key works for auth
- If Signup returns 400 (not 401) → Key works, but validation failed (expected)
- If all return 401 → Key doesn't match or Supabase config issue

---

## 🔍 Step 3: Check Supabase Auth Configuration

Even with correct keys, auth can fail if Supabase isn't configured correctly.

### Check Environment Variables in Supabase:

In Coolify → Supabase Resource → Environment Variables, verify these exist:

**Required:**
```
ANON_KEY=eyJ... (your 208 char key) ✅
SERVICE_ROLE_KEY=eyJ... (should be different, but yours is same - OK for now)
JWT_SECRET=... (should exist)
```

**Auth Configuration:**
```
SITE_URL=https://videopop.vibecodingfield.com
ADDITIONAL_REDIRECT_URLS=https://videopop.vibecodingfield.com,https://videopop.vibecodingfield.com/auth,https://videopop.vibecodingfield.com/dashboard
ENABLE_EMAIL_CONFIRMATIONS=false
```

**If these don't exist, add them and restart Supabase.**

---

## 🔍 Step 4: Check Network Request Headers

1. Open browser → F12 → **Network** tab
2. Try to sign up
3. Find the failed request (red, 401)
4. Click on it → **Headers** tab
5. Look at **Request Headers**

**Check:**
- `apikey: eyJ...` (should be your full 208-char key)
- `content-type: application/json`
- `authorization: Bearer eyJ...` (might be empty for signup)

**If `apikey` header is correct but still 401:**
- Key matches but Supabase auth config is wrong
- Check redirect URLs, email confirmation settings

---

## 🎯 Most Likely Issues (In Order)

### 1. Key Mismatch (50% likely)
- **Problem:** App key doesn't match Supabase ANON_KEY
- **Fix:** Compare first 50 chars, update if different, rebuild

### 2. Auth Not Configured (30% likely)
- **Problem:** Redirect URLs not set, email confirmation enabled
- **Fix:** Add `SITE_URL` and `ADDITIONAL_REDIRECT_URLS`, disable email confirmation

### 3. JWT_SECRET Mismatch (15% likely)
- **Problem:** JWT_SECRET changed, ANON_KEY invalidated
- **Fix:** Check JWT_SECRET, regenerate ANON_KEY if needed

### 4. CORS Issue (5% likely)
- **Problem:** CORS blocking requests
- **Fix:** Configure CORS in Supabase

---

## 📋 Quick Action Plan

1. **Compare keys:**
   - App: `VITE_SUPABASE_PUBLISHABLE_KEY` (first 50 chars)
   - Supabase: `ANON_KEY` (first 50 chars)
   - Must match exactly!

2. **If keys match:**
   - Run the test script above
   - Check what status codes you get
   - If 401 on all → Supabase config issue

3. **Check Supabase config:**
   - Add `SITE_URL` and `ADDITIONAL_REDIRECT_URLS`
   - Set `ENABLE_EMAIL_CONFIRMATIONS=false`
   - Restart Supabase

4. **Test again:**
   - Clear browser cache
   - Try signup/login
   - Check network tab for actual error

---

## 💡 Important Note About Your Keys

You mentioned all 3 keys are the same:
- `SERVICE_SUPABASEANON_KEY`
- `SERVICE_SUPABASESERVICE_KEY`
- `ANON_KEY`

**This is unusual but OK for now.** Typically:
- `ANON_KEY` = Public key (for frontend) ✅
- `SERVICE_ROLE_KEY` = Admin key (for backend, should be different)

**For your app, use `ANON_KEY`** - that's the correct one for frontend.

**The important thing is:** Your app's `VITE_SUPABASE_PUBLISHABLE_KEY` must match `ANON_KEY` exactly!

---

**Next step: Compare the first 50 characters of both keys and let me know if they match!**


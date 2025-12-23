# 🔧 Fix CORS: Variable is Set, But Still Getting Errors

## Current Status

✅ `VITE_SUPABASE_PUBLISHABLE_KEY` is set in Production
❌ Still getting CORS errors

This means the issue is likely:
1. App wasn't rebuilt after adding the variable
2. Supabase CORS configuration is missing

---

## ✅ Step 1: Rebuild Your App

**⚠️ CRITICAL:** Even though the variable is set, you MUST rebuild for it to take effect!

1. In Coolify → Your App (videopop)
2. Click **"Redeploy"** button at the top
3. Wait for build to complete
4. This embeds the environment variable in your app

**Why rebuild?** `VITE_*` variables are embedded at **build time**, not runtime!

---

## ✅ Step 2: Configure CORS in Supabase

The CORS errors mean Supabase isn't allowing requests from your app's domain.

### Add CORS Configuration:

1. In **Coolify** → **Supabase Resource** → **Environment Variables**
2. Add new variable (try these one by one if first doesn't work):

**Option 1:**
```
ALLOWED_ORIGINS=https://videopop.vibecodingfield.com
```

**Option 2:**
```
CORS_ORIGINS=https://videopop.vibecodingfield.com
```

**Option 3:**
```
SUPABASE_CORS_ORIGINS=https://videopop.vibecodingfield.com
```

**Option 4 (testing only):**
```
ALLOWED_ORIGINS=*
```
⚠️ Only for testing! Not secure for production.

### After Adding Variable:

1. **Restart Supabase** (very important!)
2. In Coolify → Supabase Resource → Click **"Restart"**
3. Wait for it to fully start

---

## ✅ Step 3: Verify Everything

### Check App Variables:
- [x] `VITE_SUPABASE_URL` = `https://superbasevpop.vibecodingfield.com/`
- [x] `VITE_SUPABASE_PUBLISHABLE_KEY` = JWT token (208 chars)
- [x] `VITE_SUPABASE_PROJECT_ID` = `videopop`

### Check Supabase Variables:
- [ ] `ALLOWED_ORIGINS` (or similar) = `https://videopop.vibecodingfield.com`
- [ ] Supabase was restarted after adding CORS variable

### Actions Taken:
- [ ] App was rebuilt after setting `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] Supabase CORS variable was added
- [ ] Supabase was restarted

---

## 🔍 Step 4: Test After Rebuild

After rebuilding your app:

1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh your app
3. Open browser console (F12)
4. Check if you see:
   ```
   ✅ Supabase configured: {url: '...', keyLength: 208, ...}
   ```
5. Try login/register
6. Check if CORS errors are gone

---

## 🎯 Most Likely Issues

### 1. App Not Rebuilt (50% likely)
- **Problem:** Variable added but app not rebuilt
- **Fix:** Click "Redeploy" in Coolify

### 2. Supabase CORS Not Configured (40% likely)
- **Problem:** Supabase doesn't allow requests from your domain
- **Fix:** Add `ALLOWED_ORIGINS` to Supabase and restart

### 3. Supabase Not Restarted (10% likely)
- **Problem:** CORS variable added but Supabase not restarted
- **Fix:** Restart Supabase after adding CORS variable

---

## 📋 Quick Action Plan

1. **Rebuild app** (Redeploy button) ← Most important!
2. **Add CORS to Supabase** (`ALLOWED_ORIGINS=https://videopop.vibecodingfield.com`)
3. **Restart Supabase** (after adding CORS variable)
4. **Clear browser cache**
5. **Test login/register**

---

## 💡 Why Both Steps Are Needed

- **Rebuild app:** Embeds the API key in your app so it can authenticate
- **Configure CORS:** Tells Supabase to allow requests from your app's domain

**Both are required for authentication to work!**

---

**Next steps: Rebuild your app, then configure CORS in Supabase!**


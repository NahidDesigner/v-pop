# Fix: App Key Doesn't Match Supabase Keys

## The Problem

Your app is using a key that starts with:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzd
```

But this key doesn't match:
- ❌ `SUPABASE_ANON_KEY` in Supabase
- ❌ `ANON_KEY` in Supabase  
- ❌ `SERVICE_SUPABASESERVICE_KEY` in Supabase

**This is why you're getting 401 errors!** The app's key doesn't match what Supabase expects.

---

## ✅ Step 1: Find Where Your App's Key Is Coming From

The app key comes from your **Video Pop App's environment variables** in Coolify:

1. **Go to Coolify → Your Video Pop App** (not Supabase resource)
2. **Click "Environment Variables"** or "Env" section
3. **Find `VITE_SUPABASE_PUBLISHABLE_KEY`**
4. **Check its value** - This is what your app is using!

**The key you see in console (`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzd...`) is coming from this variable.**

---

## ✅ Step 2: Get the Correct Key from Supabase

You need to find the **actual** `ANON_KEY` that Supabase is using. Try these methods:

### Method A: Supabase Studio (Most Reliable)

1. **In Supabase Studio** (where you ran SQL queries)
2. **Click Settings** (gear icon) → **API**
3. **Look for "anon public key"** or "anon key"
4. **Copy the ENTIRE key** (200+ characters)

**This is the key Supabase is actually using!**

### Method B: Check Supabase Logs

1. **In Coolify → Supabase Resource → Logs**
2. **Look for startup logs**
3. **Sometimes the ANON_KEY is printed during startup** (be careful - don't share publicly!)

### Method C: Check All Environment Variables

1. **In Coolify → Supabase Resource → Environment Variables**
2. **Look for ALL variables that might contain keys:**
   - `ANON_KEY`
   - `SUPABASE_ANON_KEY`
   - `PUBLIC_ANON_KEY`
   - `GOTRUE_JWT_SECRET` (this is used to generate keys)
   - Any other variable with "KEY" or "ANON" in the name

3. **Compare the first 50 characters** of each with your app key

---

## ✅ Step 3: Update Your App's Key

Once you find the correct `ANON_KEY` from Supabase:

1. **In Coolify → Your Video Pop App → Environment Variables**
2. **Find `VITE_SUPABASE_PUBLISHABLE_KEY`**
3. **Replace the value** with the `ANON_KEY` from Supabase
4. **Make sure:**
   - No quotes around the value
   - No spaces before/after
   - Full key (all 200+ characters)

5. **Rebuild your app** (Click "Redeploy" in Coolify)
   - ⚠️ **CRITICAL:** `VITE_*` variables are embedded at build time!

---

## 🔍 Step 4: Verify the Fix

After rebuilding:

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Reload the page**
3. **In browser console:**
   ```javascript
   console.log('App Key (first 50):', window.__SUPABASE_DEBUG__.keyFirst50);
   await window.__SUPABASE_DEBUG__.testConnection();
   ```

4. **Compare:**
   - App key should now match Supabase's `ANON_KEY`
   - REST API Status should be 200 (not 401)
   - Auth Health Status should be 200 (not 401)

---

## 💡 Why This Happened

Possible reasons:
1. **Wrong key was set initially** - Maybe you copied a key from a different Supabase project
2. **Key was changed in Supabase** - But app wasn't updated
3. **Key is from a different environment** - Dev vs production keys got mixed up
4. **JWT_SECRET changed** - Which invalidated the old ANON_KEY

---

## 🚨 If You Still Can't Find the Matching Key

If none of the Supabase environment variables match, you might need to:

### Option 1: Regenerate Keys

1. **Check `JWT_SECRET` in Supabase environment variables**
2. **Restart Supabase** - Sometimes this regenerates keys
3. **Check Supabase Studio → Settings → API** for new keys

### Option 2: Check Supabase Version/Configuration

Some self-hosted Supabase instances generate keys differently. Check:
- Supabase version
- How keys are generated
- If there's a key generation script

### Option 3: Use Supabase Studio API Settings

**This is the most reliable method:**
- Supabase Studio → Settings → API
- Shows the **actual keys** Supabase is using
- These are what you should use in your app

---

## ✅ Quick Checklist

- [ ] Found `VITE_SUPABASE_PUBLISHABLE_KEY` in your app's environment variables
- [ ] Got `ANON_KEY` from Supabase Studio → Settings → API
- [ ] Compared first 50 characters - they should match
- [ ] Updated `VITE_SUPABASE_PUBLISHABLE_KEY` to match `ANON_KEY`
- [ ] Rebuilt your app in Coolify
- [ ] Cleared browser cache
- [ ] Tested again - should work now!

---

**The key is: Your app's `VITE_SUPABASE_PUBLISHABLE_KEY` must match Supabase's `ANON_KEY` exactly!**


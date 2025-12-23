# 🔧 Fix: Key Mismatch - All Tests Return 401

## Test Results

All endpoints return **401 "Invalid authentication credentials"**:
- ✅ REST API: 401
- ✅ Auth Health: 401  
- ✅ Signup: 401

**This means:** The key in your app doesn't match the key Supabase expects.

---

## ✅ Step 1: Get Your App's Key

In browser console, run:

```javascript
window.__SUPABASE_DEBUG__.keyFirst50
```

**Copy this value** - this is the first 50 characters of your app's key.

---

## ✅ Step 2: Get Supabase's ANON_KEY

1. In **Coolify** → **Supabase Resource** → **Environment Variables**
2. Find `ANON_KEY`
3. Copy the **first 50 characters**

---

## ✅ Step 3: Compare Them

**They must match EXACTLY!**

If they match:
- ✅ Keys are the same
- ❌ Problem is JWT_SECRET mismatch (see Step 4)

If they don't match:
- ❌ **This is the problem!**
- Fix: Update `VITE_SUPABASE_PUBLISHABLE_KEY` in your app to match `ANON_KEY` exactly
- Rebuild your app

---

## ✅ Step 4: If Keys Match But Still 401

If the keys match but you still get 401, the issue is **JWT_SECRET mismatch**.

### The Problem

ANON_KEY is generated from `JWT_SECRET`. If:
- `JWT_SECRET` changed in Supabase
- But `ANON_KEY` wasn't regenerated
- The old `ANON_KEY` becomes invalid

### The Fix

**Option 1: Regenerate ANON_KEY (Recommended)**

For self-hosted Supabase, you need to regenerate the ANON_KEY based on the current JWT_SECRET.

1. **Get your JWT_SECRET:**
   - In Coolify → Supabase Resource → Environment Variables
   - Find `JWT_SECRET`
   - Copy it

2. **Generate new ANON_KEY:**
   - You can use Supabase CLI or a JWT generator
   - Or restart Supabase (it might regenerate automatically)

3. **Update both:**
   - Update `ANON_KEY` in Supabase
   - Update `VITE_SUPABASE_PUBLISHABLE_KEY` in your app
   - Rebuild your app

**Option 2: Restore Old JWT_SECRET**

If you know the old JWT_SECRET that was used to generate the current ANON_KEY:
1. Restore `JWT_SECRET` in Supabase
2. Restart Supabase
3. The existing ANON_KEY should work again

---

## 🔍 Step 5: Verify JWT_SECRET

In Coolify → Supabase Resource → Environment Variables:

**Check:**
- `JWT_SECRET` exists and has a value
- It's a long random string (usually 32+ characters)

**If JWT_SECRET is missing or wrong:**
- Generate a new one
- Regenerate ANON_KEY based on it
- Update both Supabase and your app

---

## 🎯 Quick Action Plan

1. **Compare keys:**
   - App: `window.__SUPABASE_DEBUG__.keyFirst50`
   - Supabase: First 50 chars of `ANON_KEY`
   - Do they match?

2. **If they don't match:**
   - Update `VITE_SUPABASE_PUBLISHABLE_KEY` to match `ANON_KEY`
   - Rebuild app
   - Test again

3. **If they match:**
   - Check `JWT_SECRET` in Supabase
   - Regenerate `ANON_KEY` if needed
   - Update both Supabase and app
   - Restart Supabase
   - Rebuild app
   - Test again

---

## 💡 How to Regenerate ANON_KEY

For self-hosted Supabase, ANON_KEY is usually generated automatically on startup based on:
- `JWT_SECRET`
- Project settings

**To regenerate:**
1. Make sure `JWT_SECRET` is set correctly
2. Restart Supabase (it should regenerate ANON_KEY)
3. Check the new `ANON_KEY` value
4. Update your app's `VITE_SUPABASE_PUBLISHABLE_KEY` to match
5. Rebuild your app

---

## 🚨 Most Likely Issue

**90% chance:** The keys don't match exactly.

**10% chance:** JWT_SECRET mismatch (keys match but ANON_KEY was generated with different JWT_SECRET).

---

**First, compare the keys and let me know if they match!**


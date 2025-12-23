# ✅ Check: App Environment Variables

## Required Environment Variables

Your app needs these 3 variables:

1. ✅ `VITE_SUPABASE_URL` - Required
2. ❌ `VITE_SUPABASE_PUBLISHABLE_KEY` - **MISSING IN PRODUCTION!**
3. ✅ `VITE_SUPABASE_PROJECT_ID` - Optional but recommended

---

## 🔍 Current Status (From Your Screenshot)

### Production Environment Variables:
- ✅ `VITE_SUPABASE_URL`: `https://superbasevpop.vibecodingfield.com/` ✅
- ✅ `VITE_SUPABASE_PROJECT_ID`: `videopop` ✅
- ❌ `VITE_SUPABASE_PUBLISHABLE_KEY`: **MISSING!** ❌

### Preview Deployments Environment Variables:
- ✅ `VITE_SUPABASE_URL`: `https://superbasevpop.vibecodingfield.com/` ✅
- ✅ `VITE_SUPABASE_PROJECT_ID`: `videopop` ✅
- ✅ `VITE_SUPABASE_PUBLISHABLE_KEY`: Present ✅

---

## 🚨 The Problem

**Your Production environment is missing `VITE_SUPABASE_PUBLISHABLE_KEY`!**

This is why:
- ❌ Authentication doesn't work
- ❌ All Supabase requests fail
- ❌ You get CORS errors (because the key isn't being sent)

---

## ✅ The Fix

### Step 1: Add Missing Variable to Production

1. In **Coolify** → **Your App (videopop)** → **Configuration** → **Environment Variables**
2. Under **"Production Environment Variables"** section
3. Click **"+ Add"** button
4. Add:
   - **Name:** `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **Value:** Copy the value from **Preview Deployments** (the long JWT token starting with `eyJ...`)
   - **Available at Buildtime:** ✅ Check this
   - **Available at Runtime:** ✅ Check this (optional, but recommended)
5. Click **"Save"**

### Step 2: Verify All Variables

After adding, you should have in **Production**:
- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_PUBLISHABLE_KEY` (newly added)
- ✅ `VITE_SUPABASE_PROJECT_ID`

### Step 3: Rebuild Your App

**⚠️ CRITICAL:** After adding the variable, you MUST rebuild!

1. Click **"Redeploy"** button at the top
2. Wait for build to complete
3. The new environment variable will be embedded in your app

---

## 📋 Complete Checklist

### Required Variables (All Must Be Set):

- [x] `VITE_SUPABASE_URL` = `https://superbasevpop.vibecodingfield.com/`
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` = `eyJ...` (208 characters) **← MISSING!**
- [x] `VITE_SUPABASE_PROJECT_ID` = `videopop`

### Optional Variables (Nice to Have):

- [ ] `NIXPACKS_NODE_VERSION` = (for Node version control)

---

## 💡 Where to Get the Key Value

You can copy it from:
1. **Preview Deployments** environment variables (you already have it there)
2. Or from **Supabase Resource** → Environment Variables → `ANON_KEY`

**Make sure:**
- It's the full 208-character JWT token
- Starts with `eyJ...`
- No spaces before or after

---

## 🎯 After Adding the Variable

1. ✅ Variable added to Production
2. ✅ Rebuild app (Redeploy)
3. ✅ Clear browser cache
4. ✅ Test login/register
5. ✅ Should work now!

---

## ⚠️ Important Notes

### Why It's Missing:

You probably:
- Set it in Preview Deployments
- But forgot to add it to Production
- Or it got deleted somehow

### Why It Matters:

`VITE_*` variables are embedded at **build time**. If the variable isn't set when you build:
- The app won't have the key
- All Supabase requests will fail
- You'll get CORS or 401 errors

### After Rebuild:

Once you add the variable and rebuild:
- The key will be embedded in your app
- Authentication should work
- CORS errors might still need fixing (separate issue)

---

**The fix: Add `VITE_SUPABASE_PUBLISHABLE_KEY` to Production environment variables and rebuild!**


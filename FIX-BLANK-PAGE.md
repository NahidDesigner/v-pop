# 🔧 Fix: Blank Page / MIME Type Error

## The Problem

Your app shows a blank page with this error:
```
Failed to load module script: Expected a JavaScript module script 
but the server responded with a MIME type of "application/octet-stream"
```

## The Cause

**Base Directory is set to `/` instead of `dist`**

This means Coolify is trying to serve files from the repository root instead of the `dist` folder where Vite builds your files.

---

## The Fix (Step-by-Step)

### Step 1: Open Build Settings

1. Go to your app in Coolify
2. Click **"Configuration"** tab
3. Scroll to **"Build"** section

### Step 2: Change Base Directory

**Find:**
- **Base Directory:** Currently set to `/`

**Change to:**
- **Base Directory:** `dist`

**Why?** Vite builds your app into a `dist` folder. Coolify needs to serve files from there!

### Step 3: Verify Build Commands

Make sure these are set:

**Install Command:**
```
npm install
```

**Build Command:**
```
npm run build
```

**Start Command:**
```
(leave empty)
```

### Step 4: Save and Rebuild

1. Click **"Save"** or **"Update"**
2. Click **"Redeploy"** or **"Rebuild"**
3. Wait for deployment to complete
4. Refresh your browser

---

## What Should Happen

After fixing:

1. ✅ Coolify runs `npm install`
2. ✅ Coolify runs `npm run build` (creates `dist` folder)
3. ✅ Coolify serves files from `dist` folder
4. ✅ nginx serves files with correct MIME types
5. ✅ Your app loads correctly!

---

## Quick Checklist

Before rebuilding, verify:

- [ ] **Base Directory:** `dist` (not `/`)
- [ ] **Build Command:** `npm run build`
- [ ] **Install Command:** `npm install`
- [ ] **Build Pack:** `Static`
- [ ] **Static Image:** `nginx:alpine`

---

## After Rebuilding

1. Open your browser
2. Go to: `https://videopop.vibecodingfield.com/`
3. You should see your Widget Wizard Pro homepage! 🎉

---

**The fix is simple: Change Base Directory from `/` to `dist` and rebuild!**


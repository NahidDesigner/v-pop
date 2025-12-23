# 🔧 Fix: Seeing "Welcome to nginx!" Page

## The Problem

You're seeing the default nginx welcome page instead of your app. This means:
- ❌ The `dist` folder is empty or doesn't exist
- ❌ The build command (`npm run build`) didn't run
- ❌ Coolify is serving an empty folder

---

## The Root Cause

**The build commands are not set or not running!**

For Static Site deployments, Coolify needs to:
1. ✅ Install dependencies (`npm install`)
2. ✅ Build your app (`npm run build`) - **This creates the `dist` folder**
3. ✅ Serve files from `dist` folder

But step 2 is missing!

---

## The Fix

### Step 1: Check Build Commands in Coolify

Go to your app in Coolify → **Configuration** → **Build** section

**Make sure these are set:**

1. **Install Command:**
   ```
   npm install
   ```
   ⚠️ **Must be set!** This installs your dependencies.

2. **Build Command:**
   ```
   npm run build
   ```
   ⚠️ **Must be set!** This builds your app and creates the `dist` folder.

3. **Base Directory:**
   ```
   dist
   ```
   ✅ You already have this set correctly!

4. **Start Command:**
   ```
   (leave empty)
   ```
   ✅ Correct for static sites.

### Step 2: Verify Settings

Your Build section should look like this:

```
Install Command:  npm install
Build Command:   npm run build
Base Directory:  dist
Start Command:   (empty)
```

### Step 3: Save and Rebuild

1. Click **"Save"** or **"Update"**
2. Click **"Redeploy"** or **"Rebuild"**
3. **Watch the build logs** - you should see:
   - `npm install` running
   - `npm run build` running
   - `✓ built in X.XXs` message
4. Wait for deployment to complete
5. Refresh your browser

---

## What Should Happen

After setting the build commands and rebuilding:

1. ✅ Coolify runs `npm install` (installs packages)
2. ✅ Coolify runs `npm run build` (creates `dist` folder with your app)
3. ✅ Coolify copies files from `dist` to nginx
4. ✅ Your app loads correctly!

---

## How to Verify Build Ran

In the build logs, look for:

```
> vite build
vite v5.4.19 building for production...
✓ built in 20.49s
```

If you see this, the build ran successfully!

---

## Common Mistakes

### ❌ Build Command is empty
- **Problem:** Coolify doesn't know to build your app
- **Fix:** Set Build Command to `npm run build`

### ❌ Install Command is empty
- **Problem:** Dependencies aren't installed, so build fails
- **Fix:** Set Install Command to `npm install`

### ❌ Base Directory is `/` instead of `dist`
- **Problem:** Coolify looks in wrong folder
- **Fix:** Set Base Directory to `dist`

---

## Quick Checklist

Before rebuilding, verify:

- [ ] **Install Command:** `npm install` (not empty!)
- [ ] **Build Command:** `npm run build` (not empty!)
- [ ] **Base Directory:** `dist`
- [ ] **Build Pack:** `Static`
- [ ] **Static Image:** `nginx:alpine`

---

## After Rebuilding

1. Open your browser
2. Go to: `https://videopop.vibecodingfield.com/`
3. You should see your Widget Wizard Pro homepage! 🎉

**The key is: Make sure both Install Command and Build Command are set!**


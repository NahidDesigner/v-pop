# 🔧 Fix: Change Build Type from Nixpacks to Static Site

## The Problem

You're using **"Nixpacks"** build type, which is causing:
- ❌ Wrong detection (detected as Deno instead of React)
- ❌ Wrong start command (trying to run Deno instead of serving static files)
- ❌ App won't work correctly

## The Solution

**Switch to "Static Site" build type** - this is the correct choice for Vite React apps!

---

## Step-by-Step Fix in Coolify

### Step 1: Change Build Type

1. Go to your app in **Coolify Dashboard**
2. Click on your app name
3. Look for **"Settings"** or **"Configuration"** tab
4. Find **"Build Pack"** or **"Build Type"** setting
5. Change it from **"Nixpacks"** to **"Static Site"**
6. Click **"Save"**

### Step 2: Verify Build Settings

Make sure these settings are correct:

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
(leave empty - not needed for static sites)
```

**Publish Directory:**
```
dist
```

**Base Directory:**
```
(leave empty)
```

### Step 3: Rebuild

1. Click **"Rebuild"** or **"Deploy"** button
2. Wait for the build to complete
3. Your app should now work correctly!

---

## Why Static Site?

- ✅ **Vite builds static files** - Your app is compiled to HTML, CSS, and JS files
- ✅ **No server needed** - Just serve the files from the `dist` folder
- ✅ **Faster deployment** - No need to run Node.js at runtime
- ✅ **Better for React apps** - This is the standard way to deploy Vite apps

---

## What About Nixpacks?

Nixpacks is great for:
- Node.js backend applications
- Apps that need a server running
- Full-stack applications

But for **frontend-only React apps** (like yours), **Static Site** is the right choice!

---

## After Switching

Once you switch to "Static Site" and rebuild:
- ✅ Build will be faster
- ✅ App will serve correctly
- ✅ No more Deno detection errors
- ✅ No start command needed

---

**That's it! Just change the build type to "Static Site" and rebuild! 🚀**


# 📘 Understanding Coolify "Static" Build Type

## What Happens When You Select "Static"

When you set **Build Pack** to **"Static"** in Coolify, here's what changes:

---

## ✅ What "Static" Does

1. **Uses nginx** - Coolify automatically uses `nginx:alpine` to serve your files
2. **No runtime needed** - Your app doesn't need Node.js running (just serves files)
3. **Faster deployment** - No need to build a Node.js container
4. **Perfect for React/Vue/Angular** - Built for frontend-only apps

---

## ⚙️ Settings That Appear

When you select "Static", you'll see these settings in the **Build** section:

### 1. **Install Command**
- **What it does:** Runs before building to install dependencies
- **What to set:** `npm install`
- **When it runs:** First, before Build Command
- **Why needed:** Installs all packages from `package.json`

### 2. **Build Command**
- **What it does:** Builds your app into static files
- **What to set:** `npm run build`
- **When it runs:** After Install Command
- **Why needed:** Creates the `dist` folder with your built app

### 3. **Base Directory** (or Publish Directory)
- **What it does:** Tells Coolify where to find your built files
- **What to set:** `dist`
- **Why needed:** Vite builds your app into the `dist` folder
- **⚠️ Critical:** If wrong, you'll see nginx welcome page!

### 4. **Start Command**
- **What it does:** Command to run the app (not needed for static!)
- **What to set:** *(leave empty)*
- **Why empty:** nginx serves files automatically, no command needed

### 5. **Static Image**
- **What it does:** Docker image to use for serving files
- **Default:** `nginx:alpine`
- **Usually:** Leave as default (it's perfect!)

---

## 🔄 The Build Process (Step-by-Step)

When you deploy with "Static" build type:

### Step 1: Clone Repository
```
Coolify clones your GitHub repo
```

### Step 2: Install Dependencies
```
Runs: npm install
Result: node_modules folder created
```

### Step 3: Build Your App
```
Runs: npm run build
Result: dist folder created with your built files
```

### Step 4: Copy to nginx
```
Coolify copies files from dist folder to nginx container
```

### Step 5: Serve Files
```
nginx serves your files on port 80
Your app is live!
```

---

## 📋 Complete Configuration Example

Here's what your Build section should look like:

```
Build Pack:        Static
Static Image:      nginx:alpine
Install Command:   npm install
Build Command:     npm run build
Base Directory:    dist
Start Command:     (empty)
```

---

## ⚠️ Common Mistakes

### ❌ Mistake 1: Build Command is Empty
- **Problem:** `dist` folder never gets created
- **Result:** nginx welcome page (empty folder)
- **Fix:** Set Build Command to `npm run build`

### ❌ Mistake 2: Base Directory is `/` or Empty
- **Problem:** Coolify looks in wrong folder
- **Result:** nginx welcome page (can't find files)
- **Fix:** Set Base Directory to `dist`

### ❌ Mistake 3: Install Command is Empty
- **Problem:** Dependencies not installed
- **Result:** Build fails
- **Fix:** Set Install Command to `npm install`

### ❌ Mistake 4: Using "Nixpacks" Instead
- **Problem:** Wrong build type for static apps
- **Result:** Tries to run Deno/Node.js server
- **Fix:** Use "Static" build type

---

## 🎯 Why "Static" is Perfect for Your App

Your Widget Wizard Pro app:
- ✅ Built with Vite (creates static files)
- ✅ React frontend (runs in browser)
- ✅ No server-side code (Supabase handles backend)
- ✅ Just needs files served (perfect for nginx)

**"Static" is the correct choice!** 🎉

---

## 🔍 How to Verify It's Working

After deployment, check:

1. **Build logs show:**
   - ✅ `npm install` completed
   - ✅ `npm run build` completed
   - ✅ `✓ built in X.XXs` message

2. **Your app loads:**
   - ✅ Visit your URL
   - ✅ See your homepage (not nginx welcome page)
   - ✅ App works correctly

---

## 💡 Key Takeaway

**"Static" build type = Serve pre-built files with nginx**

You need to:
1. ✅ Set Install Command (`npm install`)
2. ✅ Set Build Command (`npm run build`)
3. ✅ Set Base Directory (`dist`)
4. ✅ Leave Start Command empty

That's it! Simple and fast! 🚀


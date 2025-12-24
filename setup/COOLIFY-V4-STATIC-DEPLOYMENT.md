# Coolify v4 - Static Site Deployment Guide

## 🎯 Important: Coolify v4 Interface Differences

In **Coolify v4**, the Static build pack works differently than v3. This guide shows the correct way to deploy your Vite/React app.

---

## 📋 Two Deployment Options

### Option 1: Nixpacks (Recommended - Auto Builds)

Nixpacks automatically detects Vite/React and builds your app.

### Option 2: Pre-Build Static Files

Build locally first, then deploy the `dist/` folder.

---

## ✅ Option 1: Using Nixpacks (Auto-Detection)

### Step 1: Create Resource

1. In Coolify Dashboard → Your Project
2. Click **"+ New Resource"** or **"New Application"**
3. Select **"Public Repository"** or **"Git Repository"**
4. Enter: `https://github.com/NahidDesigner/v-pop.git`
5. Click **"Connect"** or **"Continue"**

### Step 2: Select Build Pack

1. Coolify will show build pack options
2. **Select "Nixpacks"** (NOT Static!)
3. Nixpacks will auto-detect:
   - ✅ Vite build tool
   - ✅ Node.js version
   - ✅ Build commands
   - ✅ Output directory (`dist`)

**Why Nixpacks?**
- Automatically detects Vite/React
- Runs `npm install && npm run build` automatically
- Knows to use `dist/` as output
- Handles Node.js version automatically

### Step 3: Configure General Settings

In the **Configuration → General** tab:

1. **Name**: `v pop` (or your preferred name)
2. **Build Pack**: Should show `Nixpacks` (auto-detected)
3. **Base Directory**: `/` (root of repository)
4. **Static Image**: `nginx:alpine` (for serving files)

### Step 4: Add Environment Variables

Go to **Configuration → Environment Variables** tab:

Click **"+ Add Variable"** for each:

```
VITE_SUPABASE_URL=https://supabase.yourdomain.com
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
VITE_SUPABASE_PROJECT_ID=videopop
```

**Important:**
- These are needed during the BUILD process
- Nixpacks will use them when running `npm run build`

### Step 5: Configure Nginx (For SPA Routing)

Go to **Configuration → General** tab:

1. Find **"Custom Nginx Configuration"** field
2. Click **"Generate Default Nginx Configuration"** (if available)
3. Then paste this configuration:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}

# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

### Step 6: Configure Domain

In **Configuration → General** tab:

1. **Domains** field: Enter `vpop.yourdomain.com`
2. Click **"Generate Domain"** or **"Set Direction"**
3. SSL will be configured automatically

### Step 7: Deploy

1. Click **"Save"** or **"Deploy"** button
2. Coolify will:
   - Clone your repository
   - Nixpacks detects Vite
   - Runs `npm install`
   - Runs `npm run build` (with your environment variables)
   - Creates Docker image with built files
   - Deploys with Nginx

---

## ✅ Option 2: Pre-Build and Use Static Build Pack

If you prefer to build locally first:

### Step 1: Build Locally

```bash
# Clone repository
git clone https://github.com/NahidDesigner/v-pop.git
cd v-pop

# Install dependencies
npm install

# Set environment variables
export VITE_SUPABASE_URL=https://supabase.yourdomain.com
export VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
export VITE_SUPABASE_PROJECT_ID=videopop

# Build
npm run build
```

### Step 2: Commit Built Files

```bash
# Add dist folder to git
git add dist/
git commit -m "Add built files for deployment"
git push
```

**Note:** You may want to create a separate branch for built files, or use a build script.

### Step 3: Deploy in Coolify

1. Create new resource → Public Repository
2. Select **"Static"** build pack
3. **Base Directory**: `/dist` (where built files are)
4. **Static Image**: `nginx:alpine`
5. Configure Nginx (same as Option 1)
6. Deploy

---

## 🔍 Finding Settings in Coolify v4

Based on your screenshot, here's where things are:

### Configuration Tab → General Section:

- ✅ **Build Pack**: `Static` (you have this)
- ✅ **Static Image**: `nginx:alpine` (you have this)
- ✅ **Base Directory**: `/` (you have this)
- ✅ **Custom Nginx Configuration**: (you have this field)

### Where Build Settings Are:

**For Nixpacks:**
- Build settings are **automatic** (no manual configuration needed)
- Nixpacks detects `package.json` and `vite.config.ts`
- Automatically runs build commands

**For Static Build Pack:**
- No build settings needed (files already built)
- Just point to the directory with built files

### Environment Variables:

- Go to **Configuration** tab
- Click **"Environment Variables"** in the left sidebar
- Add your `VITE_*` variables there

---

## 🎯 Recommended Approach for Your Project

**Use Nixpacks** because:
1. ✅ Automatically builds your Vite app
2. ✅ No need to commit `dist/` folder to git
3. ✅ Handles Node.js version automatically
4. ✅ Uses environment variables during build
5. ✅ Simpler workflow

**Steps:**
1. Select **Nixpacks** (not Static) when creating resource
2. Add environment variables in Coolify
3. Configure Nginx for SPA routing
4. Deploy!

---

## ⚠️ Important Notes

1. **Build Pack Selection:**
   - **Nixpacks** = Auto-builds your app (recommended)
   - **Static** = Expects pre-built files (use if you build locally)

2. **Environment Variables:**
   - Must be set BEFORE deployment
   - Nixpacks uses them during `npm run build`
   - Go to: Configuration → Environment Variables

3. **Base Directory:**
   - For Nixpacks: `/` (root)
   - For Static with pre-built: `/dist`

4. **Nginx Configuration:**
   - Required for React Router (SPA routing)
   - Add in: Configuration → General → Custom Nginx Configuration

---

## 🚀 Quick Checklist

- [ ] Resource created with Git repository
- [ ] Build Pack: **Nixpacks** (auto-detects Vite)
- [ ] Environment Variables added (VITE_*)
- [ ] Nginx configuration added (for SPA routing)
- [ ] Domain configured
- [ ] Deploy!

---

## 📝 Summary

**Coolify v4 doesn't have separate "Build Command" and "Publish Directory" fields for Static build pack.**

Instead:
- **Use Nixpacks** → Auto-detects and builds everything
- **OR** Build locally → Use Static build pack with `/dist` as base directory

**For your Vite/React app, Nixpacks is the easiest option!**


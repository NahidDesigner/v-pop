# Coolify v4 - Step-by-Step Deployment (Based on Your Interface)

## 🎯 Quick Answer: Use Nixpacks, Not Static!

In Coolify v4, you're seeing the **Static** build pack selected, but for a Vite/React app that needs building, you should use **Nixpacks** instead.

---

## ✅ Correct Steps for Your Situation

### Step 1: Change Build Pack to Nixpacks

In your **Configuration → General** tab (where you are now):

1. Find the **"Build Pack"** dropdown
2. Change it from **"Static"** to **"Nixpacks"**
3. **Why?** Nixpacks automatically:
   - Detects Vite from your `package.json`
   - Runs `npm install`
   - Runs `npm run build`
   - Uses `dist/` folder automatically
   - No manual build settings needed!

### Step 2: Keep These Settings (Already Correct)

In **Configuration → General**:
- ✅ **Name**: `v pop` (keep as is)
- ✅ **Base Directory**: `/` (keep as is)
- ✅ **Static Image**: `nginx:alpine` (keep as is)

### Step 3: Add Environment Variables

1. In the left sidebar, click **"Environment Variables"** (under Configuration)
2. Click **"+ Add Variable"** for each:

```
VITE_SUPABASE_URL=https://supabase.yourdomain.com
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
VITE_SUPABASE_PROJECT_ID=videopop
```

**Important:** These are needed during the build process!

### Step 4: Add Nginx Configuration

Back in **Configuration → General**:

1. Find **"Custom Nginx Configuration"** field (the text area)
2. Click **"Generate Default Nginx Configuration"** button (optional, to see default)
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

### Step 5: Domain is Already Set

I can see you already have:
- ✅ **Domains**: `https://vpop.vibecodingfield.com/`

That's perfect! SSL is automatically configured.

### Step 6: Save and Deploy

1. Click **"Save"** button (top right or bottom of form)
2. Then click **"Deploy"** or **"Redeploy"** button
3. Watch the build logs - Nixpacks will:
   - Clone your repo
   - Detect Vite
   - Install dependencies
   - Build your app
   - Deploy with Nginx

---

## 🔍 Why You Don't See Build Settings

**Coolify v4 doesn't show separate build fields because:**

- **Static Build Pack**: Expects files to already be built (no build needed)
- **Nixpacks Build Pack**: Auto-detects and builds automatically (no manual config needed)

**For your Vite app, Nixpacks is perfect** - it handles everything!

---

## 📋 Summary Checklist

Based on your current setup:

- [x] Resource created ✅
- [x] Domain configured ✅
- [ ] **Change Build Pack to Nixpacks** ⚠️ (do this!)
- [ ] Add Environment Variables (VITE_*)
- [ ] Add Nginx Configuration (for SPA routing)
- [ ] Save and Deploy

---

## 🎯 The Key Change

**Change this one thing:**
- **Build Pack**: `Static` → **`Nixpacks`**

Everything else you have is correct! Nixpacks will handle the building automatically.

---

## ❓ FAQ

**Q: Why Nixpacks instead of Static?**
A: Static expects pre-built files. Nixpacks builds your Vite app automatically.

**Q: Where are Build Command and Publish Directory?**
A: They don't exist in Coolify v4! Nixpacks auto-detects them from your `package.json`.

**Q: What about Node Version?**
A: Nixpacks automatically uses the correct Node.js version for Vite/React.

**Q: Do I need to build locally first?**
A: No! Nixpacks builds it for you during deployment.

---

## 🚀 Next Steps

1. Change Build Pack to **Nixpacks**
2. Add Environment Variables
3. Add Nginx Config
4. Deploy!

That's it! 🎉


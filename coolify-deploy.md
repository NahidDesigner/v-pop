# 🚀 Quick Coolify Deployment Guide (Visual Interface)

This is a simplified guide for deploying to Coolify using the visual interface. For complete instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## 📝 What You Need First

Before starting, make sure:
- ✅ Supabase is installed in Coolify (search for "supabase" in resources)
- ✅ Supabase is running and configured
- ✅ You have your Supabase connection info ready (from Supabase Studio → Settings → API)

---

## Step-by-Step: Deploy Your App

### Step 1: Create New App in Coolify

1. Open your **Coolify Dashboard**
2. Click **"New Resource"** or **"+"** button
3. Select **"Public Repository"**
4. Paste this URL:
   ```
   https://github.com/NahidDesigner/videopop.git
   ```
5. Select **"Static Site"** as build type
6. Click **"Create"**

**✅ Your app is now added to Coolify**

---

### Step 2: Configure Build Settings

In your app's Coolify page, find **"Build"** or **"Settings"** section:

| Setting | Value | Where to Find |
|---------|-------|---------------|
| **Build Command** | `npm install && npm run build` | Build tab |
| **Publish Directory** | `dist` | Build tab |
| **Node Version** | `18` | Build/Settings tab |

**💡 Tip:** Coolify might auto-detect these - that's fine!

---

### Step 3: Add Environment Variables (IMPORTANT!)

**⚠️ This is the most important step!** Your app won't work without these.

1. In your app's Coolify page, find **"Environment Variables"** or **"Env"** tab
2. Click **"Add Variable"** or **"+"** button
3. Add these 3 variables:

#### Where to Find These Values:

**In Supabase Studio:**
1. Open Supabase Studio (click "Open" on your Supabase resource in Coolify)
2. Go to **Settings** (gear icon) → **API** or **General**
3. You'll see:
   - **Project URL** → This is your `VITE_SUPABASE_URL`
   - **anon/public key** → This is your `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **Project Reference ID** → This is your `VITE_SUPABASE_PROJECT_ID`

#### Add These Variables:

**Variable 1:**
- **Name:** `VITE_SUPABASE_URL`
- **Value:** Copy from Supabase Studio → Settings → API → Project URL

**Variable 2:**
- **Name:** `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Value:** Copy from Supabase Studio → Settings → API → anon/public key

**Variable 3:**
- **Name:** `VITE_SUPABASE_PROJECT_ID`
- **Value:** Copy from Supabase Studio → Settings → API → Project Reference ID

**💡 Visual Guide:**
```
In Coolify → Your App → Environment Variables:
┌─────────────────────────────────────┬──────────────────────────────┐
│ Name                               │ Value                        │
├─────────────────────────────────────┼──────────────────────────────┤
│ VITE_SUPABASE_URL                  │ https://supabase.example.com │
│ VITE_SUPABASE_PUBLISHABLE_KEY      │ eyJhbGciOiJIUzI1NiIsInR5c... │
│ VITE_SUPABASE_PROJECT_ID           │ abcdefghijklmnop             │
└─────────────────────────────────────┴──────────────────────────────┘
```

**✅ Double-check:** All 3 variables should be filled in (no empty values!)

---

### Step 4: Deploy!

1. Scroll down to find **"Deploy"** or **"Build & Deploy"** button
2. **Double-check:** All environment variables are set
3. Click **"Deploy"**!
4. Watch the build process (takes 3-5 minutes)

**✅ Build completed successfully!**

---

### Step 5: Access Your App

1. Once deployment is complete, Coolify shows you a URL
2. Click the URL or copy it to your browser
3. **🎉 Your app is live!**

---

## ✅ Quick Checklist

Before deploying:

- [ ] Supabase is running in Coolify (status shows "Running")
- [ ] You've opened Supabase Studio and found Settings → API
- [ ] You have all 3 values written down:
  - [ ] Project URL
  - [ ] anon/public key
  - [ ] Project Reference ID
- [ ] All 3 environment variables are set in your app
- [ ] Build settings are configured

---

## 🐛 Quick Troubleshooting

### "Build Failed"
- Check all environment variables are filled in
- Look at build logs in Coolify for error messages
- Try clicking "Rebuild"

### "App loads but shows errors"
- Check environment variables are correct
- Make sure Supabase is running in Coolify
- Check browser console (F12) for errors

### "Can't log in"
- Make sure you created an admin user (see DEPLOYMENT.md Part 3, Step 1)
- Check redirect URLs in Supabase Studio → Authentication
- Verify SMTP is configured in Supabase environment variables

### "Environment variables not working"
- **Important:** `VITE_*` variables are embedded at BUILD TIME
- If you changed variables after building, click **"Rebuild"** in Coolify
- Make sure variable names are exactly correct (with `VITE_` prefix)

---

## 📚 Need More Help?

- **Full guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete step-by-step instructions
- **Supabase issues:** Check Supabase status in Coolify dashboard
- **Coolify issues:** Check app logs in Coolify dashboard

---

**That's it! Your app should now be running on Coolify! 🎉**

*Everything is done through Coolify's visual interface - no command line needed!*

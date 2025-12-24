# Quick Fix: Coolify v4 Deployment

## 🎯 The Issue

In Coolify v4, you don't see separate fields for:
- Build Command
- Publish Directory  
- Node Version

This is because **Coolify v4 works differently** than v3.

---

## ✅ Solution: Use Nixpacks

### What You Need to Do:

1. **When creating the resource**, select **"Nixpacks"** (NOT "Static")
   - Nixpacks automatically detects Vite/React
   - Automatically runs build commands
   - No manual configuration needed

2. **In Configuration → General** (where you are now):
   - ✅ **Build Pack**: Should be `Nixpacks` (change from Static if needed)
   - ✅ **Base Directory**: `/` (root)
   - ✅ **Static Image**: `nginx:alpine` (for serving)

3. **Add Environment Variables**:
   - Go to **Configuration → Environment Variables** (left sidebar)
   - Add:
     ```
     VITE_SUPABASE_URL=https://supabase.yourdomain.com
     VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
     VITE_SUPABASE_PROJECT_ID=videopop
     ```

4. **Add Nginx Config** (in General tab):
   - Find **"Custom Nginx Configuration"** field
   - Paste:
     ```nginx
     location / {
         try_files $uri $uri/ /index.html;
     }
     ```

5. **Deploy!**

---

## 🔄 If You Already Selected "Static"

If you already selected "Static" build pack:

### Option 1: Change to Nixpacks (Recommended)
1. In Configuration → General
2. Change **Build Pack** from `Static` to `Nixpacks`
3. Save and redeploy

### Option 2: Keep Static (Requires Pre-Building)
1. Build locally: `npm run build`
2. Commit `dist/` folder to git
3. Set **Base Directory** to `/dist`
4. Deploy

**But Option 1 (Nixpacks) is much easier!**

---

## 📍 Where Everything Is in Coolify v4

Based on your screenshot:

**Configuration Tab → General Section:**
- Build Pack dropdown (change to Nixpacks)
- Base Directory field
- Custom Nginx Configuration field
- Domains field

**Configuration Tab → Environment Variables (Left Sidebar):**
- Click "Environment Variables" in left menu
- Add your VITE_* variables there

**No separate "Build" tab needed** - Nixpacks handles it automatically!

---

## 🎯 Summary

**The fields you're looking for don't exist in Coolify v4 Static build pack.**

**Solution:**
- ✅ Use **Nixpacks** build pack instead
- ✅ It auto-detects and builds everything
- ✅ Add environment variables in Environment Variables tab
- ✅ Configure Nginx in General tab
- ✅ Deploy!

**That's it!** Nixpacks does all the building automatically. 🚀


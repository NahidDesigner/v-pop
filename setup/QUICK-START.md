# VideoPopup - Quick Start Guide

> **For experienced users**: This is a condensed version. For detailed instructions, see [COMPLETE-DEPLOYMENT-GUIDE.md](./COMPLETE-DEPLOYMENT-GUIDE.md)

> **🎯 IMPORTANT**: Once Coolify is installed, **everything is done through the Coolify dashboard** - no bash commands needed!

## 🚀 5-Minute Quick Start

### 1. Server Setup (Only if Coolify NOT installed)

**If Coolify is already installed:** Skip to step 3!

```bash
# Install Docker (one-time)
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
```

### 2. Install Coolify (One-time, if not installed)

**If Coolify is already installed:** Skip to step 3!

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Access: `http://your-server-ip:8000`

**✅ After this, everything is done through the dashboard!**

### 3. Create Project & Install Supabase (All in Coolify Dashboard)
1. **In Coolify Dashboard**: **Projects** → **+ New Project** → Name: `VideoPopup`
2. **In Coolify Dashboard**: **Resources** → **+ New Resource** → **Supabase**
3. **Fill in the form**:
   - Resource Name: `videopop-supabase`
   - PostgreSQL Password: (click Generate or enter strong password)
   - JWT Secret: (click Generate or enter, min 32 chars)
4. Click **Deploy** and wait (5-10 minutes)

**All done through the dashboard - just fill in forms and click buttons!**

### 4. Get Credentials (From Coolify Dashboard)
**In Coolify Dashboard**, go to your Supabase resource:
- **URL**: Resource → Details tab → Copy URL
- **Anon Key**: Resource → Environment Variables tab → `SUPABASE_ANON_KEY`
- **Service Role Key**: Resource → Environment Variables tab → `SUPABASE_SERVICE_ROLE_KEY`

**All visible in the dashboard - just copy and paste!**

### 5. Run Database Migration (In Supabase Dashboard)
1. **Open Supabase Dashboard** (accessed through Coolify)
2. Click **SQL Editor** in left sidebar
3. Copy entire content of `setup/complete-migration.sql`
4. Paste in SQL Editor and click **Run**

**All done in your browser - no terminal needed!**

### 6. Deploy Frontend (All in Coolify Dashboard)
1. **In Coolify Dashboard**: **New Resource** → **Public Repository**
2. Enter repository: `https://github.com/NahidDesigner/v-pop.git`
3. **⚠️ IMPORTANT**: Select build pack: **"Nixpacks"** (NOT Static, NOT Docker Compose!)
   - **Nixpacks** auto-detects Vite and builds automatically
   - **Static** requires pre-built files (not recommended)
   - **Docker Compose** is ONLY for edge functions
4. **Nixpacks will automatically**:
   - Detect Vite/React
   - Run `npm install && npm run build`
   - Use `dist/` as output
   - Handle Node.js version
5. **Environment Variables** tab → Add:
   ```
   VITE_SUPABASE_URL=https://supabase.yourdomain.com
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
   VITE_SUPABASE_PROJECT_ID=videopop
   ```
6. **Domains** tab → Add: `videopop.yourdomain.com` (enable SSL)
7. **Advanced** → **Nginx Config** → Paste:
   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```
8. Click **Deploy**

**Everything configured through forms in the dashboard!**

### 7. Create Admin User (Through Dashboards)
1. **Sign up** at your frontend URL (web form)
2. **In Supabase Dashboard** (browser) → **SQL Editor**:
   ```sql
   -- Get your user ID
   SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
   
   -- Assign admin (replace UUID with result from above)
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('YOUR-USER-UUID', 'admin');
   ```
3. **Log out and back in** to frontend

**All done through web interfaces - no command line!**

### 8. Deploy Edge Functions (Optional, Through Coolify Dashboard)
If Supabase doesn't include edge functions:
1. **In Coolify Dashboard**: **New Resource** → **Docker Compose**
2. Paste contents of `setup/docker-compose.edge-functions.yaml`
3. **Environment Variables** tab → Add variables from step 4
4. Click **Deploy**

**All configured and deployed through the dashboard!**

## ✅ Verify
- [ ] Frontend loads at your domain
- [ ] Can log in to dashboard
- [ ] Can create a widget
- [ ] Widget embed code works

## 📚 Full Guide
See [COMPLETE-DEPLOYMENT-GUIDE.md](./COMPLETE-DEPLOYMENT-GUIDE.md) for detailed instructions.


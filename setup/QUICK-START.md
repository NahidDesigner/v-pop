# VideoPopup - Quick Start Guide

> **For experienced users**: This is a condensed version. For detailed instructions, see [COMPLETE-DEPLOYMENT-GUIDE.md](./COMPLETE-DEPLOYMENT-GUIDE.md)

## 🚀 5-Minute Quick Start

### 1. Server Setup
```bash
# Update server
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
```

### 2. Install Coolify
```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Access: `http://your-server-ip:8000`

### 3. Create Project & Install Supabase
1. Create project: **Projects** → **+ New Project** → Name: `VideoPopup`
2. Install Supabase: **Resources** → **+ New Resource** → **Supabase**
3. Configure:
   - Resource Name: `videopop-supabase`
   - PostgreSQL Password: (generate strong password)
   - JWT Secret: (generate, min 32 chars)
4. Deploy and wait (5-10 minutes)

### 4. Get Credentials
From Supabase resource in Coolify:
- **URL**: Resource → Details → URL
- **Anon Key**: Resource → Environment Variables → `SUPABASE_ANON_KEY`
- **Service Role Key**: Resource → Environment Variables → `SUPABASE_SERVICE_ROLE_KEY`

### 5. Run Database Migration
1. Open Supabase Dashboard → **SQL Editor**
2. Copy entire content of `setup/complete-migration.sql`
3. Paste and **Run**

### 6. Deploy Frontend
1. **New Resource** → **Public Repository**
2. Repository: `https://github.com/NahidDesigner/v-pop.git`
3. Type: **Static Site**
4. Build: `npm install && npm run build`
5. Publish: `dist`
6. Environment Variables:
   ```
   VITE_SUPABASE_URL=https://supabase.yourdomain.com
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
   VITE_SUPABASE_PROJECT_ID=videopop
   ```
7. Domain: `videopop.yourdomain.com` (enable SSL)
8. Nginx Config (Advanced):
   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```
9. Deploy

### 7. Create Admin User
1. Sign up at your frontend URL
2. In Supabase Dashboard → **SQL Editor**:
   ```sql
   -- Get your user ID
   SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
   
   -- Assign admin (replace UUID)
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('YOUR-USER-UUID', 'admin');
   ```
3. Log out and back in

### 8. Deploy Edge Functions (Optional)
If Supabase doesn't include edge functions:
1. **New Resource** → **Docker Compose**
2. Use `setup/docker-compose.edge-functions.yml`
3. Add environment variables from step 4
4. Deploy

## ✅ Verify
- [ ] Frontend loads at your domain
- [ ] Can log in to dashboard
- [ ] Can create a widget
- [ ] Widget embed code works

## 📚 Full Guide
See [COMPLETE-DEPLOYMENT-GUIDE.md](./COMPLETE-DEPLOYMENT-GUIDE.md) for detailed instructions.


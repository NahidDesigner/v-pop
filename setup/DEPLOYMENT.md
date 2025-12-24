# VideoPopup - Self-Hosted Deployment Guide

This guide covers deploying VideoPopup on your own server using **Coolify** and **self-hosted Supabase**.

---

## 📋 Prerequisites

- A server with Docker installed (Coolify will handle this)
- **Coolify installed** (https://coolify.io) - Self-hosted or Cloud version
- Domain name configured (optional, can use IP initially)
- Git repository access (GitHub: https://github.com/NahidDesigner/v-pop.git)
- SSH access to your server (for Coolify installation)

## 🎯 Quick Start with Coolify Resources

Coolify simplifies deployment with its **Resources** feature:

1. **Supabase**: Install via Project → Resources → Add Supabase (one-click)
2. **Frontend**: Deploy via Project → New Resource → Git Repository
3. **Edge Functions**: Deploy via Resources or Docker Compose

This guide covers both the simplified Coolify Resources method and manual alternatives.

---

## 🗄️ Part 1: Self-Hosted Supabase Setup via Coolify Resources

> **Note:** Coolify provides a one-click installation for Supabase through its **Resources** feature. This is the recommended method as it handles Docker setup, networking, and configuration automatically.

### 1.1 Install Supabase via Coolify Resources

1. **Navigate to Your Project in Coolify**
   - Go to your VideoPopup project in Coolify dashboard
   - Click on **Resources** tab (or **New Resource** → **Resources**)

2. **Add Supabase Resource**
   - Click **+ New Resource** or **Add Resource**
   - Select **Supabase** from the available services
   - Coolify will automatically:
     - Set up Docker containers for Supabase
     - Configure PostgreSQL database
     - Set up Auth service
     - Configure API Gateway
     - Generate API keys automatically

3. **Configure Supabase Settings**
   - **Resource Name**: `videopop-supabase` (or your preferred name)
   - **Domain**: `supabase.yourdomain.com` (optional, for custom domain)
   - **PostgreSQL Password**: Set a strong password (or let Coolify generate one)
   - **JWT Secret**: Set a secure JWT secret (minimum 32 characters) or let Coolify generate

4. **Environment Variables** (if needed)
   - Coolify will handle most configuration automatically
   - You can add custom environment variables if needed:
     - `SITE_URL`: `https://videopop.yourdomain.com`
     - `API_EXTERNAL_URL`: `https://supabase.yourdomain.com`
     - SMTP settings (optional, for email functionality)

5. **Deploy Supabase**
   - Click **Deploy** or **Save**
   - Wait for Coolify to pull Docker images and start containers
   - This may take a few minutes on first deployment

### 1.2 Access Supabase Credentials

After deployment, Coolify will provide:

- **Supabase URL**: Usually `http://your-server-ip:port` or your custom domain
- **API URL**: `https://supabase.yourdomain.com/rest/v1/`
- **Anon Key**: Available in Coolify's resource environment variables
- **Service Role Key**: Available in Coolify's resource environment variables
- **Database Connection String**: Available in Coolify's resource details

**To find your keys:**
1. Go to your Supabase resource in Coolify
2. Navigate to **Environment Variables** or **Configuration** tab
3. Look for `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY`
4. Copy these values for use in your VideoPopup app

### 1.3 Access Supabase Dashboard

- **Dashboard URL**: Coolify will provide the dashboard URL
- **Default**: Usually accessible via the resource's domain or port
- **Login**: Use the credentials shown in Coolify's resource details

### 1.4 Alternative: Manual Supabase Installation

If you prefer manual installation or Coolify doesn't have Supabase in Resources:

```bash
# Clone Supabase Docker setup
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker

# Copy environment template
cp .env.example .env

# Edit .env with your settings (see setup/.env.example for reference)
# Then start with: docker compose up -d
```

See `setup/.env.example` for environment variable reference.

---

## 🗃️ Part 2: Database Migrations

### 2.1 Option A: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your self-hosted instance
supabase link --project-ref your-project-id

# Run migrations
supabase db push --db-url postgresql://postgres:YOUR_PASSWORD@supabase.yourdomain.com:5432/postgres
```

### 2.2 Option B: Direct SQL Execution

Connect to your database and run the complete migration file:

```bash
psql postgresql://postgres:YOUR_PASSWORD@supabase.yourdomain.com:5432/postgres -f setup/complete-migration.sql
```

### 2.3 Option C: Via Supabase Dashboard

1. Go to SQL Editor in your Supabase dashboard
2. Copy contents of `setup/complete-migration.sql`
3. Execute the SQL

---

## ⚡ Part 3: Edge Functions Deployment

> **Note:** If you installed Supabase via Coolify Resources, edge functions may be included. Otherwise, you can deploy them separately.

### 3.1 Option A: Via Supabase Resource (If Available)

If your Supabase resource in Coolify includes edge functions:

1. Go to your Supabase resource in Coolify
2. Navigate to **Edge Functions** or **Functions** section
3. Deploy functions from `supabase/functions/` directory:
   - `get-widget`
   - `track-analytics`
   - `embed-script`
   - `send-lead-notification`

### 3.2 Option B: Deploy as Separate Resources in Coolify

You can deploy each edge function as a separate resource:

1. **Create New Resource** → **Docker Compose** or **Dockerfile**
2. Use the provided `docker-compose.yaml` (root) or `setup/docker-compose.edge-functions.yaml`
3. Or create individual Docker resources for each function
4. Configure environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 3.3 Option C: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Navigate to your project
cd your-videopop-project

# Link to your self-hosted Supabase
supabase link --project-ref your-project-id

# Deploy all functions
supabase functions deploy get-widget
supabase functions deploy track-analytics
supabase functions deploy embed-script
supabase functions deploy send-lead-notification
```

### 3.4 Option D: Self-Hosted Deno (Docker Compose)

Use the provided `docker-compose.yaml` (root) or `setup/docker-compose.edge-functions.yaml`:

```bash
# Set environment variables
export SUPABASE_URL=https://supabase.yourdomain.com
export SUPABASE_ANON_KEY=your-anon-key
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Deploy
docker compose -f docker-compose.yaml up -d
# Or: docker compose -f setup/docker-compose.edge-functions.yaml up -d
```

### 3.5 Option E: Deno Deploy (External)

1. Create a Deno Deploy project at https://dash.deno.com
2. Connect your GitHub repository
3. Deploy each function from `supabase/functions/`
4. Update your frontend to use Deno Deploy URLs instead of Supabase edge function URLs

---

## 🚀 Part 4: Coolify Frontend Deployment

### 4.1 Create New Application Resource

1. **Navigate to Your Project**
   - In Coolify dashboard, go to your project
   - Click **New Resource** → **Public Repository** (or **Git Repository**)

2. **Connect Git Repository**
   - Enter your Git repository URL: `https://github.com/NahidDesigner/v-pop.git`
   - Or select from connected Git providers (GitHub, GitLab, etc.)
   - Coolify will automatically detect the repository

3. **Select Application Type**
   - Choose **Static Site** (recommended for Vite builds)
   - Or **Nixpacks** (auto-detects build configuration)

### 4.2 Configure Build Settings

In the **Build** section, configure:

| Setting | Value |
|---------|-------|
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |
| **Node Version** | `20` (or latest LTS) |
| **Install Command** | `npm install` (default) |

### 4.3 Add Environment Variables

In the **Environment Variables** section, add:

```
VITE_SUPABASE_URL=https://supabase.yourdomain.com
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-from-supabase-resource
VITE_SUPABASE_PROJECT_ID=videopop
```

**Important:** 
- Get `VITE_SUPABASE_URL` from your Supabase resource in Coolify
- Get `VITE_SUPABASE_PUBLISHABLE_KEY` from Supabase resource's environment variables
- These are available in the Supabase resource you created in Part 1

### 4.4 Configure Domain & SSL

1. Go to **Domains** tab
2. Click **Add Domain**
3. Enter your domain: `videopop.yourdomain.com`
4. Enable **SSL/TLS** (Let's Encrypt - automatic)
5. Enable **Force HTTPS** (redirect HTTP to HTTPS)

### 4.5 Configure Nginx (for SPA Routing)

Since this is a React SPA, add custom Nginx configuration:

1. Go to **Advanced** or **Nginx Configuration** section
2. Add this configuration:

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

### 4.6 Deploy

1. Click **Deploy** or **Save & Deploy**
2. Coolify will:
   - Clone your repository
   - Install dependencies
   - Build the application
   - Deploy to the configured domain
3. Monitor the build logs in real-time
4. Wait for deployment to complete (usually 2-5 minutes)

### 4.7 Verify Deployment

- Visit your domain: `https://videopop.yourdomain.com`
- Check that the app loads correctly
- Test authentication flow

---

## 🔐 Part 5: Auth Configuration

### 5.1 Configure Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

| Setting | Value |
|---------|-------|
| Site URL | `https://videopop.yourdomain.com` |
| Redirect URLs | `https://videopop.yourdomain.com/**` |

### 5.2 Enable Email Auth

In Authentication → Providers:
- Enable Email provider
- Enable "Confirm email" if you have SMTP configured
- Or disable email confirmation for testing

### 5.3 Create Admin User

```sql
-- Run in SQL Editor after creating your first user via signup

-- Get your user ID
SELECT id, email FROM auth.users;

-- Assign admin role
INSERT INTO public.user_roles (user_id, role) 
VALUES ('your-user-uuid', 'admin');
```

---

## 📧 Part 6: SMTP Configuration (Optional)

### 6.1 Configure in Site Settings

After logging in as admin:
1. Go to Dashboard → Site Settings
2. Fill in SMTP settings:
   - **SMTP Host**: smtp.yourprovider.com
   - **SMTP Port**: 587
   - **SMTP User**: your-email@domain.com
   - **Admin Email**: admin@yourdomain.com

### 6.2 Add SMTP Secret

Add the `SMTP_PASSWORD` environment variable to your edge functions:

```bash
supabase secrets set SMTP_PASSWORD=your-smtp-password
```

---

## ✅ Part 7: Verification Checklist

### Frontend
- [ ] App loads at your domain
- [ ] Login/signup works
- [ ] Dashboard is accessible

### Database
- [ ] All tables created
- [ ] RLS policies active
- [ ] Admin role assigned

### Edge Functions
- [ ] Widget embed script loads
- [ ] Analytics tracking works
- [ ] Lead notifications send (if SMTP configured)

### Security
- [ ] HTTPS enabled
- [ ] API keys are secret
- [ ] Admin access restricted

---

## 🔧 Troubleshooting

### Common Issues

**1. CORS Errors**
- Ensure your domain is in Supabase's allowed origins
- Check edge function CORS headers

**2. Auth Not Working**
- Verify Site URL and Redirect URLs match
- Check JWT_SECRET is consistent

**3. Edge Functions Failing**
- Check environment variables are set
- View logs: `supabase functions logs function-name`

**4. Database Connection Failed**
- Verify PostgreSQL is running
- Check connection string format
- Ensure port 5432 is accessible

### Getting Help

- Supabase Docs: https://supabase.com/docs
- Coolify Docs: https://coolify.io/docs
- Open an issue on GitHub

---

## 📁 Files Reference

| File | Purpose |
|------|---------|
| `setup/.env.example` | Environment template |
| `setup/complete-migration.sql` | All database migrations |
| `docker-compose.yaml` | Edge functions Docker setup (root, for Coolify) |
| `setup/docker-compose.edge-functions.yaml` | Edge functions Docker setup (reference) |
| `supabase/functions/` | Edge function source code |
| `supabase/config.toml` | Supabase configuration |

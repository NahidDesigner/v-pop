# VideoPopup - Self-Hosted Deployment Guide

This guide covers deploying VideoPopup on your own server using **Coolify** and **self-hosted Supabase**.

---

## 📋 Prerequisites

- A server with Docker installed
- Coolify installed (https://coolify.io)
- Domain name configured
- Git repository access

---

## 🗄️ Part 1: Self-Hosted Supabase Setup

### 1.1 Install Supabase

```bash
# Clone Supabase Docker setup
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker

# Copy environment template
cp .env.example .env
```

### 1.2 Configure Supabase Environment

Edit the `.env` file in `supabase/docker/`:

```bash
# === CRITICAL SECURITY SETTINGS ===
# Generate these with: openssl rand -base64 32

# PostgreSQL password
POSTGRES_PASSWORD=your-strong-password-here

# JWT secret (MUST be at least 32 characters)
JWT_SECRET=your-super-secret-jwt-token-at-least-32-chars

# Generate anon and service keys at: https://supabase.com/docs/guides/self-hosting/docker#generate-api-keys
ANON_KEY=your-generated-anon-key
SERVICE_ROLE_KEY=your-generated-service-role-key

# === URL CONFIGURATION ===
SITE_URL=https://videopop.yourdomain.com
API_EXTERNAL_URL=https://supabase.yourdomain.com

# === SMTP (Optional) ===
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_SENDER_NAME=VideoPopup
SMTP_ADMIN_EMAIL=admin@yourdomain.com
```

### 1.3 Generate API Keys

Use the Supabase key generator or run:

```bash
# Install jwt-cli or use online tool
# Go to: https://supabase.com/docs/guides/self-hosting/docker#generate-api-keys
# Use your JWT_SECRET to generate ANON_KEY and SERVICE_ROLE_KEY
```

### 1.4 Start Supabase

```bash
docker compose up -d
```

### 1.5 Verify Installation

- Dashboard: `https://supabase.yourdomain.com`
- API: `https://supabase.yourdomain.com/rest/v1/`

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

### 3.1 Option A: Supabase Edge Functions (Recommended)

```bash
# Navigate to your project
cd your-videopop-project

# Deploy all functions
supabase functions deploy get-widget --project-ref your-project-id
supabase functions deploy track-analytics --project-ref your-project-id
supabase functions deploy embed-script --project-ref your-project-id
supabase functions deploy send-lead-notification --project-ref your-project-id
```

### 3.2 Option B: Deno Deploy (Alternative)

1. Create a Deno Deploy project at https://dash.deno.com
2. Connect your GitHub repository
3. Deploy each function from `supabase/functions/`

### 3.3 Option C: Self-Hosted Deno (Docker)

Use the provided `setup/docker-compose.edge-functions.yml`:

```bash
docker compose -f setup/docker-compose.edge-functions.yml up -d
```

---

## 🚀 Part 4: Coolify Deployment

### 4.1 Create New Service

1. Log into Coolify dashboard
2. Click **New Resource** → **Public Repository**
3. Enter your Git repository URL
4. Select **Static Site** or **Nixpacks**

### 4.2 Configure Build Settings

| Setting | Value |
|---------|-------|
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |
| Node Version | `20` |

### 4.3 Add Environment Variables

Add these in Coolify's Environment Variables section:

```
VITE_SUPABASE_URL=https://supabase.yourdomain.com
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=videopop
```

### 4.4 Configure Domain

1. Go to **Domains** tab
2. Add your domain (e.g., `videopop.yourdomain.com`)
3. Enable SSL

### 4.5 Deploy

Click **Deploy** and wait for the build to complete.

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
| `setup/docker-compose.edge-functions.yml` | Edge functions Docker setup |
| `supabase/functions/` | Edge function source code |
| `supabase/config.toml` | Supabase configuration |

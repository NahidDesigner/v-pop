# Deployment Guide: Coolify + Self-Hosted Supabase

This guide will help you deploy Widget Wizard Pro to your Coolify server with a self-hosted Supabase instance.

## Prerequisites

- Coolify installed and running
- Docker installed on your server
- Domain name configured (optional but recommended)
- SMTP server for email authentication

---

## Part 1: Self-Hosted Supabase Setup

### Step 1: Install Supabase

```bash
# Clone Supabase Docker setup
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker

# Copy and configure .env
cp .env.example .env
```

### Step 2: Configure Supabase .env

Edit the `.env` file in `supabase/docker/`:

```env
# Generate these keys at https://supabase.com/docs/guides/self-hosting#api-keys
# Or use: openssl rand -base64 32 (for each key)
ANON_KEY=your-generated-anon-key
SERVICE_ROLE_KEY=your-generated-service-role-key
JWT_SECRET=your-super-secret-jwt-key-at-least-32-chars

# Your domain
SITE_URL=https://your-app-domain.com
API_EXTERNAL_URL=https://your-supabase-domain.com

# Database
POSTGRES_PASSWORD=your-secure-password

# SMTP for auth emails
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
SMTP_SENDER_NAME=VideoPopup
```

**Important:** Generate secure keys:
- Use `openssl rand -base64 32` to generate each key
- Or visit: https://supabase.com/docs/guides/self-hosting#api-keys

### Step 3: Start Supabase

```bash
docker compose up -d
```

Wait for all services to be healthy:
```bash
docker compose ps
```

### Step 4: Run Database Migrations

From your project root directory:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your self-hosted instance
supabase link --project-ref your-project-ref --db-url postgresql://postgres:your-password@your-db-host:5432/postgres

# Push migrations
supabase db push
```

**Alternative method (direct SQL):**

```bash
# Connect to your database and run all migration files
psql postgresql://postgres:password@your-db-host:5432/postgres < supabase/migrations/20251220191224_43593955-bace-4b41-917e-936d82a23ee6.sql
# Repeat for all migration files in order
```

### Step 5: Configure Auth Redirect URLs

1. Access Supabase Studio: `https://your-supabase-domain.com`
2. Go to **Authentication** → **URL Configuration**
3. Set:
   - **Site URL:** `https://your-app-domain.com`
   - **Redirect URLs:**
     - `https://your-app-domain.com`
     - `https://your-app-domain.com/auth`

### Step 6: Create First Admin User

You'll need to manually create an admin user in the database:

```sql
-- First, sign up a user through the app, then run this SQL in Supabase SQL Editor:
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'your-admin-email@example.com';
```

---

## Part 2: Coolify Deployment

### Step 1: Create New Resource in Coolify

1. Go to **Coolify Dashboard** → **New Resource**
2. Select **Public Repository**
3. Enter your GitHub repo URL: `https://github.com/NahidDesigner/videopop.git`
4. Select **Static Site** or **Nixpacks** build type

### Step 2: Configure Build Settings

In Coolify, set these build settings:

**Build Command:**
```bash
npm install && npm run build
```

**Publish Directory:**
```
dist
```

**Node Version:**
```
18
```
(or 20 if preferred)

**Port:**
```
3000
```
(Coolify will set this automatically)

### Step 3: Add Environment Variables

In Coolify → Your App → **Environment Variables**, add:

#### Required - Frontend (VITE_ prefix - embedded at build time):
```
VITE_SUPABASE_URL=https://your-supabase-domain.com
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

#### For Edge Functions (if deploying separately):
```
SUPABASE_URL=https://your-supabase-domain.com
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_DB_URL=postgresql://postgres:password@your-db-host:5432/postgres
```

**Important:** 
- `VITE_*` variables are embedded at **build time** - rebuild after changing them
- Non-VITE variables are for runtime (Edge Functions)

### Step 4: Deploy Edge Functions

Your Supabase Edge Functions need to be deployed separately. Options:

#### Option A: Deploy to Deno Deploy
1. Create a Deno Deploy project
2. Deploy each function from `supabase/functions/`
3. Update function URLs in your code if needed

#### Option B: Run as Docker Service in Coolify
1. Create a new Docker service in Coolify
2. Use Supabase CLI to serve functions locally
3. Configure reverse proxy

#### Option C: Convert to Node.js Backend
Convert Edge Functions to a Node.js/Express API and deploy as a separate service in Coolify.

**Recommended:** For self-hosted, convert Edge Functions to a Node.js backend service.

### Step 5: Deploy

1. Click **Deploy** in Coolify
2. Monitor the build logs
3. Once deployed, your app will be available at the configured domain

---

## Part 3: Post-Deployment Checklist

- [ ] Supabase Docker containers running and healthy
- [ ] Database migrations applied successfully
- [ ] JWT keys generated and configured
- [ ] SMTP configured and tested
- [ ] Coolify app created and deployed
- [ ] Environment variables set correctly
- [ ] Auth redirect URLs configured
- [ ] First admin user created
- [ ] Edge Functions deployed (or alternative solution)
- [ ] Test widget creation
- [ ] Test embed script functionality
- [ ] Test analytics tracking

---

## Troubleshooting

### Build Fails
- Check Node version (should be 18 or 20)
- Verify all environment variables are set
- Check build logs in Coolify

### Database Connection Issues
- Verify Supabase is running: `docker compose ps`
- Check database URL format
- Ensure firewall allows connections

### Auth Not Working
- Verify redirect URLs in Supabase dashboard
- Check JWT_SECRET matches
- Ensure SMTP is configured for email verification

### Edge Functions Not Working
- Check function URLs are correct
- Verify CORS headers
- Check Supabase service role key

---

## Security Notes

1. **Never commit `.env` files** - they're in `.gitignore`
2. **Use strong passwords** for database and JWT secrets
3. **Enable HTTPS** for both app and Supabase
4. **Restrict database access** to only necessary IPs
5. **Rotate keys regularly**

---

## Support

For issues:
- Check Coolify logs: Dashboard → Your App → Logs
- Check Supabase logs: `docker compose logs`
- Review Supabase documentation: https://supabase.com/docs


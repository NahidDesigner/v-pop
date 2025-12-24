# VideoPopup - Complete Step-by-Step Deployment Guide

> **For Beginners**: This guide assumes no prior experience. Every step is explained in detail.

---

## 📚 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Server Setup](#2-server-setup)
3. [Coolify Installation](#3-coolify-installation)
4. [Create Project in Coolify](#4-create-project-in-coolify)
5. [Install Supabase via Resources](#5-install-supabase-via-resources)
6. [Get Supabase Credentials](#6-get-supabase-credentials)
7. [Run Database Migrations](#7-run-database-migrations)
8. [Configure Supabase Authentication](#8-configure-supabase-authentication)
9. [Deploy Edge Functions](#9-deploy-edge-functions)
10. [Deploy Frontend Application](#10-deploy-frontend-application)
11. [Create Admin User](#11-create-admin-user)
12. [Verify Everything Works](#12-verify-everything-works)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Prerequisites

### What You Need:

- ✅ **A Server** (VPS, Cloud Server, or any server with SSH access)
  - Recommended: DigitalOcean, Hetzner, AWS EC2, Linode, or any VPS provider
  - Minimum: 2GB RAM, 1 CPU core, 20GB storage
  - OS: Ubuntu 20.04/22.04 or Debian 11/12 (recommended)

- ✅ **Domain Name** (optional but recommended)
  - Example: `videopop.yourdomain.com`
  - You can start with IP address and add domain later

- ✅ **GitHub Account** (for repository access)
  - Repository: `https://github.com/NahidDesigner/v-pop.git`

- ✅ **Basic Terminal/SSH Knowledge**
  - How to connect via SSH
  - Basic Linux commands (we'll guide you)

### What We'll Install:

- Coolify (deployment platform)
- Supabase (database & backend)
- VideoPopup Frontend (React app)
- Edge Functions (backend services)

---

## 2. Server Setup

### 2.1 Connect to Your Server

**On Windows:**
- Use **PuTTY** or **Windows Terminal**
- Or use **Git Bash** (if you have it)

**On Mac/Linux:**
- Use Terminal app

**SSH Command:**
```bash
ssh root@your-server-ip
# Or if you have a username:
ssh username@your-server-ip
```

Replace `your-server-ip` with your actual server IP address.

### 2.2 Update Your Server

Once connected, run these commands:

```bash
# Update package list
sudo apt update

# Upgrade existing packages
sudo apt upgrade -y

# Install basic tools
sudo apt install -y curl wget git
```

**What this does:** Updates your server and installs basic tools needed for Coolify.

### 2.3 Install Docker (Required for Coolify)

Coolify needs Docker. Run these commands:

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (replace 'your-username' with your actual username)
sudo usermod -aG docker $USER

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Verify Docker is installed
docker --version
```

**Expected Output:** You should see something like `Docker version 24.x.x`

**If you see an error:** Make sure you're using `sudo` or have root access.

---

## 3. Coolify Installation

### 3.1 Install Coolify

Coolify is a self-hosted deployment platform. Install it with one command:

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

**What this does:** Downloads and installs Coolify on your server.

**Wait time:** 2-5 minutes depending on your server speed.

### 3.2 Access Coolify Dashboard

After installation, Coolify will show you:
- Dashboard URL (usually `http://your-server-ip:8000`)
- Default username and password

**Important:** Save these credentials! You'll need them to log in.

**Access the dashboard:**
1. Open your web browser
2. Go to: `http://your-server-ip:8000`
3. Log in with the credentials shown

**If you can't access:**
- Check your server's firewall
- Make sure port 8000 is open
- Try: `http://localhost:8000` if you're on the server

### 3.3 First-Time Setup

When you first log in:
1. **Change the default password** (important for security!)
2. **Set up your profile** (optional)
3. **Add your server** (if not already added)

---

## 4. Create Project in Coolify

### 4.1 Create New Project

1. In Coolify dashboard, click **"Projects"** in the sidebar
2. Click **"+ New Project"** or **"Create Project"**
3. Fill in:
   - **Name**: `VideoPopup` (or any name you like)
   - **Description**: `VideoPopup SaaS Platform` (optional)
4. Click **"Create"** or **"Save"**

**What this does:** Creates a container to organize all your VideoPopup resources.

---

## 5. Install Supabase via Resources

### 5.1 Navigate to Resources

1. In your **VideoPopup** project, look for **"Resources"** tab
2. Click on **"Resources"** (or **"New Resource"** → **"Resources"**)

### 5.2 Add Supabase Resource

1. Click **"+ New Resource"** or **"Add Resource"** button
2. Look for **"Supabase"** in the list of available services
3. Click on **"Supabase"**

**If Supabase is not in the list:**
- You might need to search for it
- Or use "Docker Compose" option (we'll cover this in troubleshooting)

### 5.3 Configure Supabase

Fill in the configuration form:

**Basic Settings:**
- **Resource Name**: `videopop-supabase` (or any name)
- **Description**: `Supabase backend for VideoPopup` (optional)

**Database Settings:**
- **PostgreSQL Password**: 
  - Click "Generate" or enter a strong password
  - **Save this password!** You'll need it later
  - Example: `MySecurePassword123!@#`

**JWT Settings:**
- **JWT Secret**: 
  - Click "Generate" or enter a random string (minimum 32 characters)
  - Example: `your-super-secret-jwt-token-at-least-32-characters-long`
  - **Save this too!**

**Domain (Optional):**
- If you have a domain: `supabase.yourdomain.com`
- If not: Leave empty (Coolify will assign a port)

**Environment Variables (Optional):**
- You can add these later if needed:
  - `SITE_URL`: `https://videopop.yourdomain.com`
  - `API_EXTERNAL_URL`: `https://supabase.yourdomain.com`

### 5.4 Deploy Supabase

1. Click **"Deploy"** or **"Save & Deploy"**
2. Wait for deployment (5-10 minutes on first run)
3. Watch the logs to see progress

**What's happening:**
- Coolify is downloading Docker images
- Setting up PostgreSQL database
- Configuring Supabase services
- Starting all containers

**You'll know it's done when:**
- Status shows "Running" or "Healthy"
- No errors in the logs
- All services are green

---

## 6. Get Supabase Credentials

After Supabase is deployed, you need to get these values:

### 6.1 Find Supabase URL

1. Go to your Supabase resource in Coolify
2. Look for **"URL"** or **"Domain"** in the resource details
3. Copy this URL (example: `https://supabase.yourdomain.com` or `http://your-server-ip:54321`)

**Save this as:** `SUPABASE_URL`

### 6.2 Find API Keys

1. In your Supabase resource, click **"Environment Variables"** or **"Configuration"** tab
2. Look for these variables:
   - `SUPABASE_ANON_KEY` (or `ANON_KEY`)
   - `SUPABASE_SERVICE_ROLE_KEY` (or `SERVICE_ROLE_KEY`)
3. Click to reveal/copy each value

**Save these as:**
- `ANON_KEY` = The value of `SUPABASE_ANON_KEY`
- `SERVICE_ROLE_KEY` = The value of `SUPABASE_SERVICE_ROLE_KEY`

**⚠️ Important:**
- **Anon Key**: Safe to use in frontend (public)
- **Service Role Key**: **KEEP SECRET!** Only use in backend/edge functions

### 6.3 Find Database Connection

1. In Supabase resource, look for **"Database"** section
2. Find **"Connection String"** or **"Database URL"**
3. It should look like: `postgresql://postgres:PASSWORD@host:5432/postgres`

**Save this as:** `DATABASE_URL`

**If you can't find it:**
- Use: `postgresql://postgres:YOUR_PASSWORD@your-server-ip:5432/postgres`
- Replace `YOUR_PASSWORD` with the PostgreSQL password you set earlier

### 6.4 Access Supabase Dashboard

1. In Supabase resource, look for **"Dashboard URL"** or **"Studio URL"**
2. Click it or copy the URL
3. Log in with credentials shown in Coolify (usually in resource details)

**You'll use this dashboard to:**
- Run SQL migrations
- View database tables
- Manage authentication
- Configure settings

---

## 7. Run Database Migrations

Now we'll create all the database tables, security rules, and functions needed for VideoPopup.

### 7.1 Access Supabase SQL Editor

1. Open Supabase Dashboard (from step 6.4)
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"** or the **"+"** button

### 7.2 Copy Migration SQL

1. Open the file: `setup/complete-migration.sql` from your project
2. **Select ALL** the content (Ctrl+A or Cmd+A)
3. **Copy** it (Ctrl+C or Cmd+C)

**Where to find the file:**
- In your local project: `setup/complete-migration.sql`
- Or from GitHub: https://github.com/NahidDesigner/v-pop/blob/main/setup/complete-migration.sql

### 7.3 Run Migration

1. In Supabase SQL Editor, **paste** the entire migration file
2. Click **"Run"** or press `Ctrl+Enter` (or `Cmd+Enter` on Mac)
3. Wait for it to complete (30-60 seconds)

**What you should see:**
- ✅ Success message: "Success. No rows returned"
- ✅ Or: Multiple "Success" messages for each section

**If you see errors:**
- Check the error message
- Common issues:
  - "already exists" - Some parts already ran, that's OK
  - "permission denied" - Check you're using the right database
  - See [Troubleshooting](#13-troubleshooting) section

### 7.4 Verify Tables Were Created

1. In Supabase Dashboard, click **"Table Editor"** in the left sidebar
2. You should see these tables:
   - ✅ `user_roles`
   - ✅ `profiles`
   - ✅ `clients`
   - ✅ `widgets`
   - ✅ `widget_analytics`
   - ✅ `site_settings`
   - ✅ `agency_settings`
   - ✅ `leads`

**If tables are missing:**
- Re-run the migration
- Check for errors in SQL Editor

---

## 8. Configure Supabase Authentication

### 8.1 Configure Site URL

1. In Supabase Dashboard, click **"Authentication"** in the left sidebar
2. Click **"URL Configuration"** or **"Settings"**
3. Set:
   - **Site URL**: `https://videopop.yourdomain.com` (or your app URL)
   - **Redirect URLs**: `https://videopop.yourdomain.com/**` (allows all paths)

**If you don't have a domain yet:**
- Use: `http://your-server-ip:PORT` (where PORT is your frontend port)
- You can update this later when you add a domain

### 8.2 Enable Email Authentication

1. Still in **Authentication** → **Providers**
2. Find **"Email"** provider
3. Click to enable it
4. **Email confirmation**: 
   - **Disable** for testing (easier to get started)
   - **Enable** for production (more secure)

**For production:** You'll need to configure SMTP (email server) later.

### 8.3 Test Authentication (Optional)

You can test signup later after deploying the frontend. For now, we'll continue.

---

## 9. Deploy Edge Functions

Edge functions are backend services that handle:
- Widget data retrieval
- Analytics tracking
- Embed script generation
- Lead notifications

### Option A: Via Supabase (If Available)

If your Supabase resource includes edge functions:

1. In Supabase Dashboard, go to **"Edge Functions"**
2. Deploy each function from `supabase/functions/`:
   - `get-widget`
   - `track-analytics`
   - `embed-script`
   - `send-lead-notification`

**How to deploy:**
1. Click **"Deploy Function"**
2. Upload or paste the function code
3. Set environment variables (from step 6.2)

### Option B: Via Docker Compose (Recommended)

If Supabase doesn't include edge functions, use Docker Compose:

#### 9.1 Create Edge Functions Resource in Coolify

1. In your VideoPopup project, go to **"Resources"**
2. Click **"+ New Resource"**
3. Select **"Docker Compose"** or **"Dockerfile"**

#### 9.2 Configure Docker Compose

1. Create a new file or use the provided one: `setup/docker-compose.edge-functions.yml`
2. In Coolify, paste the contents of `docker-compose.edge-functions.yml`
3. Add environment variables:
   ```
   SUPABASE_URL=https://supabase.yourdomain.com
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

#### 9.3 Deploy Edge Functions

1. Click **"Deploy"**
2. Wait for containers to start
3. Verify all 4 functions are running

**Function Endpoints:**
- `get-widget`: `http://your-server:8001`
- `track-analytics`: `http://your-server:8002`
- `embed-script`: `http://your-server:8003`
- `send-lead-notification`: `http://your-server:8004`

**Note:** You'll configure the frontend to use these endpoints later.

---

## 10. Deploy Frontend Application

Now we'll deploy the React frontend application.

### 10.1 Create Frontend Resource

1. In your VideoPopup project, click **"+ New Resource"**
2. Select **"Public Repository"** or **"Git Repository"**
3. Enter repository URL: `https://github.com/NahidDesigner/v-pop.git`
4. Click **"Connect"** or **"Next"**

### 10.2 Configure Build Settings

**Application Type:**
- Select **"Static Site"** (recommended for Vite/React)

**Build Configuration:**
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Node Version**: `20` (or latest LTS)
- **Install Command**: `npm install` (default)

### 10.3 Add Environment Variables

**Critical Step!** Add these environment variables:

1. Click **"Environment Variables"** tab
2. Click **"+ Add Variable"** for each:

**Variable 1:**
- **Name**: `VITE_SUPABASE_URL`
- **Value**: Your Supabase URL from step 6.1
- **Example**: `https://supabase.yourdomain.com`

**Variable 2:**
- **Name**: `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Value**: Your Anon Key from step 6.2
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Variable 3:**
- **Name**: `VITE_SUPABASE_PROJECT_ID`
- **Value**: `videopop` (or any identifier)

**Important:**
- ✅ Make sure variable names start with `VITE_` (required for Vite)
- ✅ Use exact values from your Supabase resource
- ✅ No spaces or quotes in values

### 10.4 Configure Domain

1. Click **"Domains"** tab
2. Click **"+ Add Domain"**
3. Enter your domain: `videopop.yourdomain.com`
4. Enable **"SSL/TLS"** (Let's Encrypt - automatic)
5. Enable **"Force HTTPS"**

**If you don't have a domain:**
- Coolify will assign a port (e.g., `http://your-server-ip:3000`)
- You can add a domain later

### 10.5 Configure Nginx (For SPA Routing)

Since this is a React Single Page Application, we need special routing:

1. Go to **"Advanced"** or **"Nginx Configuration"** section
2. Click **"Custom Nginx Configuration"**
3. Paste this configuration:

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

**What this does:**
- Routes all requests to `index.html` (needed for React Router)
- Caches static files for better performance
- Adds security headers

### 10.6 Deploy Frontend

1. Click **"Deploy"** or **"Save & Deploy"**
2. Watch the build logs:
   - Installing dependencies...
   - Building application...
   - Deploying...
3. Wait for completion (2-5 minutes)

**What's happening:**
- Coolify clones your Git repository
- Installs npm packages
- Builds the React app
- Deploys to your domain

**You'll know it's done when:**
- Status shows "Running"
- Build logs show "Build successful"
- You can access your domain

### 10.7 Verify Frontend Deployment

1. Open your browser
2. Go to your domain: `https://videopop.yourdomain.com`
3. You should see the VideoPopup landing page

**If you see errors:**
- Check build logs for errors
- Verify environment variables are correct
- See [Troubleshooting](#13-troubleshooting)

---

## 11. Create Admin User

To access the dashboard, you need to create an admin user.

### 11.1 Sign Up via Frontend

1. Go to your deployed frontend: `https://videopop.yourdomain.com`
2. Click **"Login"** or **"Sign Up"**
3. Create an account with your email and password
4. Complete the signup process

**Important:** Remember the email you used!

### 11.2 Get Your User ID

1. Open Supabase Dashboard
2. Go to **"Authentication"** → **"Users"**
3. Find your email in the list
4. **Copy the User ID** (UUID format, like: `123e4567-e89b-12d3-a456-426614174000`)

**Or use SQL:**
1. Go to **"SQL Editor"**
2. Run this query (replace with your email):

```sql
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'your-email@example.com';
```

3. Copy the `id` value

### 11.3 Assign Admin Role

1. In Supabase Dashboard, go to **"SQL Editor"**
2. Open the file: `setup/create-admin.sql`
3. Replace `'your-email@example.com'` with your actual email
4. Replace `'YOUR-USER-UUID-HERE'` with your User ID from step 11.2
5. Run the SQL:

```sql
-- Step 1: Find your user (already done, but for reference)
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'your-email@example.com';

-- Step 2: Assign admin role (replace YOUR-USER-UUID-HERE)
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR-USER-UUID-HERE', 'admin');

-- Step 3: Verify
SELECT u.email, r.role, r.created_at
FROM auth.users u
JOIN public.user_roles r ON u.id = r.user_id
WHERE u.email = 'your-email@example.com';
```

**Expected Result:**
- You should see your email with role `admin`

### 11.4 Test Admin Access

1. Go to your frontend: `https://videopop.yourdomain.com`
2. Click **"Login"**
3. Log in with your email and password
4. You should be redirected to the dashboard
5. You should see admin features (Settings, Clients, etc.)

**If you can't access dashboard:**
- Verify the role was assigned (run verification query)
- Try logging out and back in
- Clear browser cache

---

## 12. Verify Everything Works

Let's test all the main features:

### 12.1 Test Frontend

- [ ] Landing page loads
- [ ] Navigation works
- [ ] Login/Signup works
- [ ] Dashboard is accessible (after login)

### 12.2 Test Authentication

- [ ] Can create new account
- [ ] Can log in
- [ ] Can log out
- [ ] Admin can access dashboard

### 12.3 Test Database

1. In Supabase Dashboard → **"Table Editor"**
2. Check tables have data:
   - [ ] `site_settings` has default row
   - [ ] `user_roles` has your admin role
   - [ ] Can create a test client

### 12.4 Test Widget Creation

1. Log in to dashboard
2. Go to **"Widgets"**
3. Click **"New Widget"**
4. Fill in:
   - Name: `Test Widget`
   - Video URL: `https://vimeo.com/1146508111` (test video)
   - CTA Text: `Learn More`
   - CTA URL: `https://example.com`
5. Click **"Save"**
6. Copy the embed code
7. Test embed code on a test page

### 12.5 Test Edge Functions

**Test get-widget:**
```bash
curl http://your-server:8001?id=WIDGET_ID
```

**Test embed-script:**
```bash
curl http://your-server:8003?id=WIDGET_ID
```

**Expected:** Should return widget data or JavaScript code

---

## 13. Troubleshooting

### Problem: Can't Access Coolify Dashboard

**Solutions:**
- Check firewall: `sudo ufw allow 8000`
- Check if Coolify is running: `docker ps | grep coolify`
- Try: `http://localhost:8000` if on server
- Check Coolify logs: `docker logs coolify`

### Problem: Supabase Deployment Fails

**Solutions:**
- Check server resources (RAM, disk space)
- Check Docker is running: `docker ps`
- Check logs in Coolify for specific errors
- Try increasing server resources

### Problem: Database Migration Errors

**Common Errors:**

**"relation already exists":**
- Some tables already exist, that's OK
- Continue with the rest

**"permission denied":**
- Make sure you're using the correct database
- Check you're logged in as the right user

**"syntax error":**
- Make sure you copied the entire file
- Check for any missing semicolons

**Solutions:**
- Re-run the migration
- Check Supabase SQL Editor for specific errors
- Try running sections separately

### Problem: Frontend Build Fails

**Common Errors:**

**"Cannot find module":**
- Check `package.json` exists
- Verify Node version is 20

**"Environment variable not found":**
- Make sure variables start with `VITE_`
- Check spelling exactly
- Rebuild after adding variables

**Solutions:**
- Check build logs for specific errors
- Verify environment variables are set
- Try building locally first: `npm run build`

### Problem: Can't Log In

**Solutions:**
- Verify admin role was assigned correctly
- Check Supabase Authentication settings
- Verify redirect URLs are configured
- Try clearing browser cache
- Check browser console for errors

### Problem: Widget Embed Not Working

**Solutions:**
- Verify edge functions are running
- Check widget is set to "active" status
- Verify embed script URL is correct
- Check browser console for errors
- Test edge function directly with curl

### Problem: Environment Variables Not Working

**Solutions:**
- Make sure frontend variables start with `VITE_`
- Rebuild after changing variables
- Check for typos in variable names
- Verify values are correct (no extra spaces)

### Getting More Help

1. **Check Logs:**
   - Coolify: Resource → Logs
   - Supabase: Dashboard → Logs
   - Browser: Developer Tools → Console

2. **Verify Configuration:**
   - Double-check all URLs and keys
   - Verify database connection
   - Check network connectivity

3. **Common Issues:**
   - Firewall blocking ports
   - Incorrect environment variables
   - Database not migrated
   - Edge functions not deployed

---

## 14. Next Steps

After successful deployment:

### 14.1 Configure Site Settings

1. Log in to dashboard
2. Go to **"Site Settings"**
3. Configure:
   - Logo URL
   - Hero title and subtitle
   - Pricing information
   - Demo video URL

### 14.2 Set Up SMTP (For Email)

1. Get SMTP credentials from your email provider
2. In dashboard → **"Site Settings"** → **"SMTP"**
3. Fill in:
   - SMTP Host
   - SMTP Port (usually 587)
   - SMTP User
   - SMTP Password
4. Test email sending

### 14.3 Create Your First Widget

1. Go to **"Widgets"** → **"New Widget"**
2. Configure your video popup
3. Copy embed code
4. Add to your website

### 14.4 Monitor Analytics

1. Go to **"Analytics"** in dashboard
2. View widget performance
3. Track views, clicks, conversions

### 14.5 Set Up Backups

1. Configure automatic database backups
2. Set up S3-compatible storage
3. Schedule regular backups

---

## 15. Quick Reference

### Important URLs

- **Coolify Dashboard**: `http://your-server-ip:8000`
- **Supabase Dashboard**: (from Supabase resource in Coolify)
- **Frontend App**: `https://videopop.yourdomain.com`
- **Edge Functions**: `http://your-server-ip:8001-8004`

### Important Credentials

Save these securely:
- ✅ Coolify login credentials
- ✅ Supabase PostgreSQL password
- ✅ Supabase JWT secret
- ✅ Supabase Anon Key
- ✅ Supabase Service Role Key
- ✅ Admin user email and password

### Important Files

- `setup/complete-migration.sql` - Database schema
- `setup/create-admin.sql` - Admin user creation
- `setup/docker-compose.edge-functions.yml` - Edge functions
- `setup/.env.example` - Environment variables template

### Common Commands

```bash
# Check Docker containers
docker ps

# View Coolify logs
docker logs coolify

# Restart a resource in Coolify
# (Use Coolify dashboard)

# Check server resources
df -h  # Disk space
free -h  # Memory
```

---

## ✅ Deployment Checklist

Use this checklist to ensure everything is set up:

- [ ] Server is set up and accessible
- [ ] Docker is installed and running
- [ ] Coolify is installed and accessible
- [ ] Project created in Coolify
- [ ] Supabase resource deployed
- [ ] Supabase credentials saved
- [ ] Database migrations completed
- [ ] Authentication configured
- [ ] Edge functions deployed
- [ ] Frontend deployed
- [ ] Environment variables set
- [ ] Domain configured (optional)
- [ ] SSL certificate active (if using domain)
- [ ] Admin user created
- [ ] Admin role assigned
- [ ] Can log in to dashboard
- [ ] Can create a widget
- [ ] Widget embed code works
- [ ] Analytics tracking works

---

## 🎉 Congratulations!

You've successfully deployed VideoPopup! 

Your SaaS platform is now live and ready to use. You can:
- Create video popup widgets
- Manage clients
- Track analytics
- Customize branding
- And much more!

**Need Help?**
- Check the troubleshooting section
- Review the logs
- Verify all steps were completed

**Happy Deploying!** 🚀


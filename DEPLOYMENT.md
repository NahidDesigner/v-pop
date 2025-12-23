# 🚀 Complete Deployment Guide for Beginners (Coolify Visual Interface)

Welcome! This guide will walk you through deploying Widget Wizard Pro using Coolify's visual interface. Everything is done through clicks - no command line needed!

## 📋 What You'll Need Before Starting

Before we begin, make sure you have:

- ✅ **Coolify** installed and accessible (you're using it, so you're good!)
- ✅ A **domain name** (like `myapp.com`) - optional but recommended
- ✅ An **email account** for sending emails (Gmail, Outlook, etc.)

**That's it!** Coolify handles everything else for you.

---

## 🎯 Overview: What We're Going to Do

We'll set up your app in 3 simple parts:

1. **Part 1**: Install and configure Supabase in Coolify (your database)
2. **Part 2**: Deploy your app in Coolify (your website)
3. **Part 3**: Connect everything together and test

Let's start!

---

# Part 1: Setting Up Supabase in Coolify

**What is Supabase?** Think of it as a smart database that stores all your app's data (users, widgets, analytics, etc.)

## Step 1: Install Supabase in Coolify

**What we're doing:** Adding Supabase to your Coolify server

1. Open your **Coolify Dashboard** in your web browser
2. Click **"New Resource"** or the **"+"** button (usually in the top right)
3. In the search bar, type: **"supabase"**
4. You should see **"Supabase"** as an option - click on it
5. Click **"Install"** or **"Create"**

**✅ Checkpoint:** Supabase should now appear in your Coolify resources list

---

## Step 2: Configure Supabase Settings

**What we're doing:** Setting up Supabase with your preferences

1. Click on your **Supabase** resource in Coolify
2. You'll see different tabs/sections. Let's configure them:

### General Settings Tab

Look for a **"General"** or **"Settings"** tab and configure:

**Project Name:** (Optional - you can leave default)
- Example: `videopop-database`

**Domain/URL:** (If you have a custom domain)
- Example: `supabase.yourdomain.com`
- Or leave default if you don't have one yet

**Port:** (Usually auto-set, leave as default)

### Environment Variables Tab

Click on **"Environment Variables"** or **"Env"** tab. You'll need to add these:

#### Required Variables:

**1. Database Password:**
- **Name:** `POSTGRES_PASSWORD`
- **Value:** Create a strong password (at least 16 characters)
- **Example:** `MySecurePass123!@#`
- **💡 Tip:** Write this down - you'll need it later!

**2. JWT Secret:**
- **Name:** `JWT_SECRET`
- **Value:** A long random string (at least 32 characters)
- **How to generate:** 
  - Use an online generator: https://generate-secret.vercel.app/32
  - Or use: `openssl rand -base64 32` in terminal
  - Refresh the page 3 times to get 3 different keys

**3. Anon Key:**
- **Name:** `ANON_KEY`
- **Value:** Generate another random key (same way as above)
- **💡 This is your public key - you'll use this in your app**

**4. Service Role Key:**
- **Name:** `SERVICE_ROLE_KEY`
- **Value:** Generate a third random key
- **💡 This is your admin key - keep it secret!**

**5. Site URL:**
- **Name:** `SITE_URL`
- **Value:** `https://your-app-domain.com`
- **Or:** `http://your-server-ip` (if you don't have a domain yet)

**6. API External URL:**
- **Name:** `API_EXTERNAL_URL`
- **Value:** Same as your Supabase URL
- **Example:** `https://supabase.yourdomain.com` or `http://your-server-ip:8000`

#### Email Settings (For User Verification):

**7. SMTP Host:**
- **Name:** `SMTP_HOST`
- **For Gmail:** `smtp.gmail.com`
- **For Outlook:** `smtp-mail.outlook.com`

**8. SMTP Port:**
- **Name:** `SMTP_PORT`
- **Value:** `587`

**9. SMTP User:**
- **Name:** `SMTP_USER`
- **Value:** Your email address
- **Example:** `your-email@gmail.com`

**10. SMTP Password:**
- **Name:** `SMTP_PASS`
- **For Gmail:** You need an "App Password" (not your regular password)
  - Go to: Google Account → Security → 2-Step Verification → App Passwords
  - Create an app password and use that here
- **For Outlook:** Use your regular email password

**11. SMTP Sender Name:**
- **Name:** `SMTP_SENDER_NAME`
- **Value:** `VideoPopup` (or whatever you want)

**✅ Checkpoint:** All environment variables should be filled in

---

## Step 3: Deploy Supabase

**What we're doing:** Starting up Supabase

1. Make sure all environment variables are saved
2. Look for a **"Deploy"** or **"Start"** button
3. Click it!
4. Wait for Supabase to start (this might take 2-5 minutes)

**⏳ What's happening:** Coolify is setting up all the Supabase services for you

**✅ Checkpoint:** Supabase status should show as "Running" or "Healthy"

---

## Step 4: Access Supabase Studio

**What we're doing:** Opening Supabase's web interface to manage your database

1. In Coolify, find your Supabase resource
2. Look for a **"Open"** button or a URL link
3. Click it - this opens **Supabase Studio** in a new tab
4. You should see the Supabase dashboard with menus on the left

**✅ Checkpoint:** Supabase Studio is open and accessible

---

## Step 5: Set Up Your Database Tables

**What we're doing:** Creating the tables (like spreadsheets) where your app will store data

1. In **Supabase Studio**, click **"SQL Editor"** in the left menu
2. You'll see a text area where you can write SQL
3. Now we need to run your migration files:

### Running Migrations:

1. Go back to your project files (or GitHub)
2. Navigate to: `supabase/migrations/` folder
3. You'll see several `.sql` files with dates in their names
4. **Important:** Run them in order (oldest to newest):
   - `20251220191224_43593955-bace-4b41-917e-936d82a23ee6.sql` (oldest)
   - `20251220193717_052cf577-cf9c-4e67-ab6f-7f7f54924ef1.sql`
   - `20251220195240_d4dd6cb8-7a1b-457a-af13-d8e780e6522f.sql`
   - ... and so on (check all files)

5. For each file:
   - Open the file
   - Copy ALL the text (Ctrl+A, then Ctrl+C)
   - Go back to Supabase Studio SQL Editor
   - Paste it (Ctrl+V)
   - Click **"Run"** button (or press Ctrl+Enter)
   - Wait for "Success" message
   - Clear the editor and repeat for the next file

**💡 Tip:** The files are named with dates, so run them from oldest to newest

**✅ Checkpoint:** All migration files have been run successfully

---

## Step 6: Get Your Supabase Connection Info

**What we're doing:** Getting the information your app needs to connect to Supabase

1. In **Supabase Studio**, click **"Settings"** (gear icon) in the left menu
2. Click **"API"** or **"General"**
3. You'll see important information - write these down:

**📝 Write Down These Values:**

- **Project URL:** (This is your `VITE_SUPABASE_URL`)
  - Example: `https://supabase.yourdomain.com` or `http://your-server-ip:8000`

- **anon/public key:** (This is your `VITE_SUPABASE_PUBLISHABLE_KEY`)
  - It's a long string starting with `eyJ...`

- **Project Reference ID:** (This is your `VITE_SUPABASE_PROJECT_ID`)
  - It's usually a short string like `abcdefghijklmnop`

**✅ Checkpoint:** You have all 3 values written down

---

## Step 7: Configure Authentication Settings

**What we're doing:** Telling Supabase where users should be redirected after logging in

1. In **Supabase Studio**, click **"Authentication"** in the left menu
2. Click **"URL Configuration"** or **"Settings"**
3. Fill in:

   **Site URL:**
   ```
   https://your-app-domain.com
   ```
   (Or `http://your-server-ip` if you don't have a domain yet)

   **Redirect URLs:** (Click "Add URL" for each)
   ```
   https://your-app-domain.com
   https://your-app-domain.com/auth
   ```

4. Click **"Save"**

**✅ Checkpoint:** Authentication URLs are configured

---

# Part 2: Deploying Your App to Coolify

**What we're doing:** Setting up your Widget Wizard Pro app in Coolify

## Step 1: Create a New App in Coolify

1. Go back to your **Coolify Dashboard**
2. Click **"New Resource"** or the **"+"** button
3. Select **"Public Repository"**
4. Fill in:

   **Repository URL:**
   ```
   https://github.com/NahidDesigner/videopop.git
   ```

   **Build Type:** Choose **"Static Site"** (this is the easiest option)

5. Click **"Create"** or **"Next"**

**✅ Checkpoint:** Your app is now added to Coolify

---

## Step 2: Configure Build Settings

**What we're doing:** Telling Coolify how to build your app

1. Click on your app in Coolify
2. Look for **"Build"**, **"Settings"**, or **"Configuration"** section
3. Set these values:

**⚠️ IMPORTANT:** For Static Site build type, you need to set these separately:

**Install Command:**
```
npm install
```
⚠️ **This must be set!** It installs your dependencies.

**Build Command:**
```
npm run build
```
⚠️ **This must be set!** It builds your app and creates the `dist` folder.

**Base Directory (or Publish Directory):**
```
dist
```
⚠️ **This tells Coolify where to find your built files!**

**Start Command:**
```
(leave empty)
```
✅ Static sites don't need a start command.

**Node Version:**
```
20
```
(Or 18 - but 20 is recommended for Supabase)

**Port:** Leave as default (Coolify will set it automatically)

**✅ Checkpoint:** Build settings are configured - make sure Install Command and Build Command are both set!

---

## Step 3: Add Environment Variables

**What we're doing:** Giving your app the information it needs to connect to Supabase

**⚠️ IMPORTANT:** These variables get "baked into" your app when it builds, so set them BEFORE building!

1. In your app's Coolify page, find **"Environment Variables"** or **"Env"** section
2. Click **"Add Variable"** or **"+"** button
3. Add these 3 variables one by one:

### Variable 1: Supabase URL
- **Name:** `VITE_SUPABASE_URL`
- **Value:** The **Project URL** you wrote down from Step 6
- **Example:** `https://supabase.yourdomain.com`

### Variable 2: Supabase Public Key
- **Name:** `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Value:** The **anon/public key** you wrote down from Step 6
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Variable 3: Project ID
- **Name:** `VITE_SUPABASE_PROJECT_ID`
- **Value:** The **Project Reference ID** you wrote down from Step 6
- **Example:** `abcdefghijklmnop`

**💡 Visual Guide:**
```
In Coolify Environment Variables section:
┌─────────────────────────────────────┬──────────────────────────────┐
│ Name                               │ Value                        │
├─────────────────────────────────────┼──────────────────────────────┤
│ VITE_SUPABASE_URL                  │ https://supabase.example.com │
│ VITE_SUPABASE_PUBLISHABLE_KEY      │ eyJhbGciOiJIUzI1NiIsInR5c... │
│ VITE_SUPABASE_PROJECT_ID           │ abcdefghijklmnop             │
└─────────────────────────────────────┴──────────────────────────────┘
```

**✅ Checkpoint:** All 3 environment variables are added and filled in

---

## Step 4: Deploy Your App!

**What we're doing:** Actually building and launching your app

1. Scroll down and find the **"Deploy"** or **"Build & Deploy"** button
2. **Double-check:** Make sure all 3 environment variables are set correctly
3. Click **"Deploy"**!
4. Watch the build process - you'll see:
   - 📦 Installing packages...
   - 🔨 Building app...
   - 🚀 Deploying...

**⏳ Wait Time:** This usually takes 3-5 minutes. Be patient!

**✅ Checkpoint:** Build completed successfully!

---

## Step 5: Access Your App

**What we're doing:** Opening your app in a browser

1. Once deployment is complete, Coolify will show you a URL
2. Click the URL or copy it to your browser
3. **🎉 Your app should be live!**

**✅ Checkpoint:** Your app is accessible and loads without errors

---

# Part 3: Final Setup & Testing

## Step 1: Create Your First Admin Account

**What we're doing:** Making yourself the administrator so you can access the dashboard

### Step 1a: Sign Up Through the App

1. Go to your app's website (the URL from Part 2, Step 5)
2. Click **"Sign Up"** or **"Register"** (usually in the top right)
3. Create an account with:
   - Your email address
   - A strong password
4. Verify your email if required (check your email inbox)

**✅ Checkpoint:** You've created an account and can log in

### Step 1b: Make Yourself Admin

1. Go back to **Supabase Studio** (from Part 1, Step 4)
2. Click **"SQL Editor"** in the left menu
3. Copy and paste this SQL code:

```sql
-- Replace 'your-email@example.com' with the email you just signed up with
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'your-email@example.com';
```

4. **IMPORTANT:** Replace `'your-email@example.com'` with your actual email address
5. Click **"Run"** button
6. You should see a success message

**✅ Checkpoint:** You now have admin access!

---

## Step 2: Test Your Dashboard

1. Go back to your app's website
2. Log out if you're logged in
3. Log back in with your admin account
4. You should be redirected to `/dashboard`
5. You should see the dashboard with options like:
   - Overview
   - Widgets
   - Clients
   - Analytics
   - Settings

**✅ Checkpoint:** Dashboard is accessible and working

---

## ✅ Post-Deployment Checklist

Go through this checklist to make sure everything works:

- [ ] **Supabase is running**
  - Check: In Coolify, Supabase status shows "Running"
  
- [ ] **Database tables created**
  - Check: In Supabase Studio → Table Editor, you see tables like `widgets`, `clients`, `user_roles`
  
- [ ] **Environment variables set**
  - Check: In Coolify app settings, all 3 VITE_ variables are filled in
  
- [ ] **App deployed successfully**
  - Check: Your app URL loads without errors
  
- [ ] **Can log in**
  - Check: Go to `/auth` and can log in with your account
  
- [ ] **Can access dashboard**
  - Check: After logging in, you see the dashboard at `/dashboard`
  
- [ ] **Admin access works**
  - Check: You can see all admin features in the dashboard
  
- [ ] **Can create a widget**
  - Check: Try creating a test widget in the dashboard

---

## 🐛 Common Problems & Solutions

### Problem: "Build Failed" in Coolify

**What it means:** Something went wrong while building your app

**Solutions:**
1. Check the build logs in Coolify - look for red error messages
2. Make sure all 3 environment variables are set (no empty values)
3. Verify the values are correct (especially the Supabase URL and keys)
4. Try clicking **"Rebuild"** in Coolify

---

### Problem: "Can't connect to Supabase"

**What it means:** Your app can't talk to your database

**Solutions:**
1. Check if Supabase is running in Coolify (status should be "Running")
2. Verify `VITE_SUPABASE_URL` is correct in your app's environment variables
3. Make sure `VITE_SUPABASE_PUBLISHABLE_KEY` matches your Supabase anon key
4. Check that both Supabase and your app are on the same network/server

---

### Problem: "Login doesn't work"

**What it means:** Authentication isn't working

**Solutions:**
1. Check redirect URLs in Supabase Studio → Authentication → URL Configuration
2. Make sure Site URL matches your app's domain
3. Verify SMTP is configured correctly (for email verification)
4. Check browser console for errors (Press F12 → Console tab)

---

### Problem: "I can't access the dashboard / I'm not admin"

**What it means:** You're not recognized as an admin

**Solutions:**
1. Make sure you completed Step 1b (creating admin user with SQL)
2. Verify the SQL ran successfully in Supabase Studio
3. Try logging out and logging back in
4. Check in Supabase Studio → Table Editor → `user_roles` table:
   - Your email should be there
   - The `role` column should say `admin`

---

### Problem: "Environment variables not working"

**What it means:** Your app can't see the variables you set

**Solutions:**
1. **Important:** `VITE_*` variables are embedded at BUILD TIME
2. If you changed variables after building, you MUST rebuild:
   - Go to Coolify → Your App → Click "Rebuild" or "Deploy" again
3. Make sure variable names are exactly:
   - `VITE_SUPABASE_URL` (not `SUPABASE_URL`)
   - `VITE_SUPABASE_PUBLISHABLE_KEY` (not `SUPABASE_KEY`)
   - `VITE_SUPABASE_PROJECT_ID` (not `PROJECT_ID`)

---

## 🔒 Security Reminders

**Important things to remember:**

1. ✅ **Never share your environment variables** - they contain secrets
2. ✅ **Use strong passwords** - especially for database
3. ✅ **Keep your keys secret** - don't post them online or in screenshots
4. ✅ **Use HTTPS** - especially for production (real users)
5. ✅ **Update regularly** - keep Coolify and Supabase updated

---

## 🎉 You're Done!

Congratulations! Your Widget Wizard Pro platform should now be running.

### What to do next:

1. **Test everything:**
   - Create a widget
   - Copy the embed code
   - Test it on a website
   - Check analytics

2. **Customize:**
   - Update site settings in the dashboard
   - Add your logo
   - Configure branding

3. **Invite users:**
   - Create client accounts
   - Set up agencies

---

## 📞 Need Help?

If you get stuck:

1. **Check the logs:**
   - **Coolify:** Dashboard → Your App → Logs tab
   - **Supabase:** In Supabase Studio, check for error messages

2. **Common issues:**
   - Most problems are missing or incorrect environment variables
   - Double-check all URLs and keys are correct
   - Make sure Supabase is running in Coolify

3. **Get support:**
   - Check Supabase docs: https://supabase.com/docs
   - Check Coolify docs: https://coolify.io/docs

---

**Good luck with your deployment! 🚀**

*Remember: Everything is done through Coolify's visual interface - no command line needed!*

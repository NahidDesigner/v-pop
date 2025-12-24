# Self-Hosted Supabase Configuration Guide

## 🎯 Important Differences

**Self-hosted Supabase** (installed via Coolify Resources) works differently than hosted Supabase:

- ❌ **No Dashboard UI** for authentication configuration
- ❌ **No "API" settings page** to get keys
- ✅ **All configuration via Coolify environment variables**
- ✅ **All credentials in Coolify's environment variables section**

---

## 📋 Step-by-Step Configuration

### 1. Get Supabase Credentials from Coolify

**Location:** Coolify Dashboard → Your Supabase Resource → Configuration → Environment Variables

1. **Go to Coolify Dashboard**
2. **Navigate to your Project** → Find your Supabase resource
3. **Click on the Supabase resource**
4. **Go to "Configuration" tab**
5. **Find "Environment Variables" section**
6. **Copy these values**:

| What You Need | Environment Variable Name | Where to Find |
|--------------|-------------------------|---------------|
| **Supabase URL** | (from resource details/URL) | Resource → Details → URL/Domain |
| **Anon Key** | `SUPABASE_ANON_KEY` | Configuration → Environment Variables |
| **Service Role Key** | `SUPABASE_SERVICE_ROLE_KEY` | Configuration → Environment Variables |

**These are your API keys** - there's no separate "API" page in self-hosted Supabase.

---

### 2. Configure Authentication URLs

Authentication URLs are set via environment variables in your Supabase resource:

1. **In Coolify** → Supabase Resource → **Configuration** → **Environment Variables**
2. **Add or update** these variables:

```bash
SITE_URL=https://vpop.vibecodingfield.com
ADDITIONAL_REDIRECT_URLS=https://vpop.vibecodingfield.com/**
```

**Alternative variable names** (try if above don't work):
```bash
SUPABASE_SITE_URL=https://vpop.vibecodingfield.com
SUPABASE_ADDITIONAL_REDIRECT_URLS=https://vpop.vibecodingfield.com/**
```

3. **Save** the environment variables
4. **Redeploy** the Supabase resource (click "Redeploy" button)

**This replaces the "Authentication → URL Configuration" UI that doesn't exist in self-hosted Supabase.**

---

### 3. Enable Email Authentication (Optional)

Email authentication is usually enabled by default. To configure:

**In Coolify** → Supabase Resource → Environment Variables:

```bash
# Enable signup
AUTH_ENABLE_SIGNUP=true

# Enable email authentication
AUTH_EXTERNAL_EMAIL_ENABLED=true

# Disable email confirmation (for testing)
AUTH_ENABLE_SIGNUP_EMAIL_CONFIRMATION=false

# OR enable email confirmation (for production)
AUTH_ENABLE_SIGNUP_EMAIL_CONFIRMATION=true
```

**Redeploy** Supabase resource after changes.

---

## 🔑 Environment Variables for Frontend

**Use these in your Frontend resource** (in Coolify):

1. **Go to your Frontend resource** in Coolify
2. **Configuration** → **Environment Variables**
3. **Add these variables**:

```bash
VITE_SUPABASE_URL=https://your-supabase-url.com
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-from-step-1
VITE_SUPABASE_PROJECT_ID=videopop
```

**Get values from:**
- `VITE_SUPABASE_URL`: Your Supabase resource URL (from Coolify)
- `VITE_SUPABASE_PUBLISHABLE_KEY`: `SUPABASE_ANON_KEY` from Supabase resource env vars
- `VITE_SUPABASE_PROJECT_ID`: Any identifier (like "videopop")

---

## 🔍 How to Access SQL Editor

For self-hosted Supabase, SQL Editor access varies:

**Option 1: Through Coolify**
- Check if your Supabase resource has a "SQL Editor" link/button
- Or access via the Supabase URL provided by Coolify

**Option 2: Direct Database Access**
- Supabase resource → Configuration → Check for database connection details
- Use a PostgreSQL client (like pgAdmin, DBeaver) to connect

**Option 3: Via Coolify Terminal (if available)**
- Some Coolify setups allow exec/terminal access to containers
- You can run `psql` commands directly

---

## ✅ Verification Checklist

- [ ] Supabase resource is running in Coolify
- [ ] Environment variables are set in Supabase resource
- [ ] `SITE_URL` and `ADDITIONAL_REDIRECT_URLS` are configured
- [ ] Frontend environment variables are set correctly
- [ ] Can access database (SQL Editor or direct connection)
- [ ] Authentication works (test signup/login)

---

## 🆘 Troubleshooting

### Problem: Can't find API keys

**Solution:** They're in Coolify → Supabase Resource → Configuration → Environment Variables
- Look for `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY`

### Problem: Authentication redirects not working

**Solution:** 
1. Check `SITE_URL` and `ADDITIONAL_REDIRECT_URLS` are set in Supabase resource env vars
2. Make sure values match your frontend URL exactly
3. Redeploy Supabase resource after changing env vars

### Problem: Can't access SQL Editor

**Solution:**
- Try accessing Supabase URL directly (check Coolify resource details)
- Use a PostgreSQL client with connection details from Coolify
- Check if SQL Editor is available in the Supabase resource interface

---

## 📚 Reference

All configuration for self-hosted Supabase is done through **Coolify's configuration interface**, not through a Supabase Dashboard UI (which doesn't exist in self-hosted versions).


# Assign Admin Role to nahidwebdesigner@gmail.com

## Quick Steps

1. **Access SQL Editor** (see options below)
2. **Copy and paste the SQL script** from `setup/create-admin-nahid.sql`
3. **Run the SQL script**
4. **Verify** the role was assigned
5. **Log out and back in** to your frontend

---

## How to Access SQL Editor for Self-Hosted Supabase

Since you're using self-hosted Supabase via Coolify, here are the options:

### Option 1: Supabase Dashboard (If Available)

1. Go to **Coolify Dashboard**
2. Find your **Supabase Resource**
3. Look for a **"SQL Editor"** link/button or **"Dashboard"** link
4. Click it to open Supabase Dashboard
5. Go to **SQL Editor** in the left sidebar
6. Paste and run the SQL script

### Option 2: Direct Database Connection

1. **Get database connection details from Coolify:**
   - Go to **Supabase Resource** → **Configuration**
   - Look for database connection details (host, port, database, user, password)
   - Or check Environment Variables for `POSTGRES_*` variables

2. **Use a PostgreSQL client:**
   - **pgAdmin** (GUI tool)
   - **DBeaver** (GUI tool)
   - **psql** (command line)
   - **VS Code PostgreSQL extension**

3. **Connect** using the credentials
4. **Run the SQL script**

### Option 3: Coolify Terminal/Exec (If Available)

Some Coolify setups allow you to execute commands in containers:

1. Go to **Supabase Resource** in Coolify
2. Look for **"Terminal"**, **"Exec"**, or **"Shell"** option
3. Access the PostgreSQL container
4. Run: `psql -U postgres -d postgres`
5. Paste and run the SQL script

---

## SQL Script to Run

Copy this entire script and run it:

```sql
-- Step 1: Find your user ID by email
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'nahidwebdesigner@gmail.com';

-- Step 2: Assign admin role (One-liner version - runs automatically)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role 
FROM auth.users 
WHERE email = 'nahidwebdesigner@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 3: Verify the role was assigned
SELECT 
    u.email, 
    r.role, 
    r.created_at as role_assigned_at,
    u.created_at as user_created_at
FROM auth.users u
JOIN public.user_roles r ON u.id = r.user_id
WHERE u.email = 'nahidwebdesigner@gmail.com';
```

---

## What to Expect

### After Step 1:
You should see your user ID (UUID format) like:
```
id                                   | email                        | created_at
-------------------------------------|------------------------------|-------------------
123e4567-e89b-12d3-a456-426614174000| nahidwebdesigner@gmail.com   | 2025-01-XX ...
```

### After Step 2:
You should see:
```
INSERT 0 1
```
(This means the role was successfully inserted)

### After Step 3:
You should see:
```
email                        | role  | role_assigned_at        | user_created_at
-----------------------------|-------|-------------------------|-------------------
nahidwebdesigner@gmail.com   | admin | 2025-01-XX ...          | 2025-01-XX ...
```

---

## Verify Admin Access

1. **Log out** of your frontend (if logged in)
2. **Log back in** with `nahidwebdesigner@gmail.com`
3. **You should now have access to:**
   - Dashboard
   - All admin features
   - Settings pages
   - Widget management
   - Analytics

---

## Troubleshooting

### Problem: "relation auth.users does not exist"
**Solution:** You're not connected to the correct database. Make sure you're connecting to the Supabase PostgreSQL database.

### Problem: "relation public.user_roles does not exist"
**Solution:** You haven't run the database migrations yet. Run `setup/complete-migration.sql` first.

### Problem: "user does not exist"
**Solution:** 
- Make sure you signed up successfully
- Check the email is exactly `nahidwebdesigner@gmail.com` (case-sensitive)
- Run Step 1 query to verify the user exists

### Problem: "role already exists"
**Solution:** That's OK! The `ON CONFLICT DO NOTHING` clause prevents errors. The user already has admin role.

### Problem: Can't access SQL Editor
**Solution:** Use Option 2 (Direct Database Connection) with a PostgreSQL client tool.

---

## Quick Reference

**File to use:** `setup/create-admin-nahid.sql`

**Email:** `nahidwebdesigner@gmail.com`

**Expected result:** User should have `admin` role in `public.user_roles` table


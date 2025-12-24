# Disable Email Confirmation for User Signup

## 🎯 Quick Fix

You need to disable email confirmation in your self-hosted Supabase. Since there's no Dashboard UI, this is done via **Coolify Environment Variables**.

---

## ✅ Method 1: Via Coolify Environment Variables (RECOMMENDED)

### Steps:

1. **Go to Coolify Dashboard**
2. **Navigate to:** Your Supabase Resource
3. **Click:** Configuration tab
4. **Find:** Environment Variables section
5. **Add or update** these environment variables:

```bash
AUTH_ENABLE_SIGNUP_EMAIL_CONFIRMATION=false
```

**Or try these alternative variable names** (depending on your Supabase version):

```bash
# Option 1 (most common)
AUTH_ENABLE_SIGNUP_EMAIL_CONFIRMATION=false

# Option 2 (alternative)
ENABLE_EMAIL_CONFIRMATION=false

# Option 3 (full set)
AUTH_ENABLE_SIGNUP=true
AUTH_EXTERNAL_EMAIL_ENABLED=true
AUTH_ENABLE_SIGNUP_EMAIL_CONFIRMATION=false
```

6. **Save** the environment variables
7. **Redeploy** the Supabase resource (click "Redeploy" button)
8. **Wait** for deployment to complete (usually 1-2 minutes)

### After Redeploy:

1. **Try logging in again** with `nahidwebdesigner@gmail.com`
2. Email confirmation should now be disabled
3. New users can sign up and log in immediately without email confirmation

---

## ✅ Method 2: Manually Confirm Email via SQL (Quick Fix for Existing User)

If you want to quickly fix your current account **without disabling email confirmation**, you can manually confirm the email:

### Steps:

1. **Access SQL Editor** (same way as before)
2. **Run this SQL:**

```sql
-- Manually confirm the email for nahidwebdesigner@gmail.com
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = 'nahidwebdesigner@gmail.com';

-- Verify it worked
SELECT 
    email, 
    email_confirmed_at,
    created_at
FROM auth.users 
WHERE email = 'nahidwebdesigner@gmail.com';
```

3. **Expected result:** You should see `email_confirmed_at` is now set (not NULL)
4. **Try logging in again**

---

## 🔧 Troubleshooting

### Problem: Environment variable doesn't work

**Try these alternatives:**

1. Check the exact variable name in your Supabase version
2. Try adding it to multiple services if Supabase has multiple containers
3. Check Supabase logs after redeploy to see if the variable is recognized

### Problem: Still getting "Email not confirmed" after SQL fix

**Solutions:**
1. Clear browser cache and cookies
2. Log out completely and log back in
3. Try in incognito/private browsing mode
4. Check if `email_confirmed_at` is actually set in the database

### Problem: Can't find Environment Variables in Coolify

**Solutions:**
1. Make sure you're in the Supabase Resource (not the frontend resource)
2. Look for "Configuration" → "Environment Variables" or "Variables" tab
3. Some Coolify versions might have it under "Settings" or "Advanced"

---

## 📋 Recommended Approach

**For Development/Testing:**
- Use **Method 1** (disable email confirmation entirely)
- This allows all users to sign up and log in immediately

**For Production:**
- Consider keeping email confirmation enabled for security
- Use **Method 2** to manually confirm specific users when needed

---

## ✅ Verification Checklist

After applying Method 1:
- [ ] Environment variable added in Coolify
- [ ] Supabase resource redeployed
- [ ] Can sign up new users without email confirmation
- [ ] Existing user can log in

After applying Method 2:
- [ ] SQL query executed successfully
- [ ] `email_confirmed_at` is set in database
- [ ] Can log in with nahidwebdesigner@gmail.com


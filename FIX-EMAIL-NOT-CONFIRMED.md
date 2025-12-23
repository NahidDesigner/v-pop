# Fix: "Email Not Confirmed" Error

You're getting "email not confirmed" when trying to log in. This happens when:
- Email confirmation is required (`GOTRUE_MAILER_AUTOCONFIRM=false` or not set)
- But SMTP is not configured to send confirmation emails

## ✅ Quick Fix: Enable Auto-Confirmation (Recommended for Development)

For self-hosted Supabase, the easiest solution is to allow users to sign up without email confirmation:

### Step 1: Add Environment Variable to Supabase

1. **In Coolify → Supabase Resource → Environment Variables**
2. **Add or update this variable:**
   ```
   GOTRUE_MAILER_AUTOCONFIRM=true
   ```

3. **Save the changes**

### Step 2: Restart Supabase

1. **In Coolify → Supabase Resource**
2. **Click "Restart"** or "Redeploy"
3. **Wait 2-3 minutes** for services to restart

### Step 3: Confirm Existing User Email (Manual)

Since your user already exists with "Waiting for verification", you need to manually confirm it:

#### Option A: Confirm via SQL (Easiest)

Run this in Supabase SQL Editor:

```sql
-- Confirm the user's email
UPDATE auth.users
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = 'nahidwebdesigner@gmail.com';

-- Verify it's confirmed
SELECT 
    email,
    email_confirmed_at,
    confirmed_at,
    created_at
FROM auth.users
WHERE email = 'nahidwebdesigner@gmail.com';
```

After running this, the user's email will be confirmed and they can log in.

#### Option B: Delete and Re-register

1. **Delete the user** (via Supabase Studio → Authentication → Users)
2. **Re-register** through your app
3. **With `GOTRUE_MAILER_AUTOCONFIRM=true`, the email will be auto-confirmed**

---

## 🔧 Alternative: Configure SMTP (For Production)

If you want email confirmation in production, configure SMTP:

### Step 1: Add SMTP Environment Variables

In Coolify → Supabase Resource → Environment Variables, add:

```
GOTRUE_SMTP_HOST=smtp.gmail.com
GOTRUE_SMTP_PORT=587
GOTRUE_SMTP_USER=your-email@gmail.com
GOTRUE_SMTP_PASS=your-app-password
GOTRUE_SMTP_ADMIN_EMAIL=your-email@gmail.com
GOTRUE_MAILER_URLPATHS_CONFIRMATION=/auth/confirm
GOTRUE_MAILER_URLPATHS_INVITE=/auth/invite
GOTRUE_MAILER_URLPATHS_RECOVERY=/auth/recover
GOTRUE_MAILER_AUTOCONFIRM=false
```

**For Gmail:**
- Use an [App Password](https://support.google.com/accounts/answer/185833) (not your regular password)
- Enable 2-factor authentication first

**For other providers:**
- Update `GOTRUE_SMTP_HOST` and `GOTRUE_SMTP_PORT` accordingly

### Step 2: Restart Supabase

After adding SMTP variables, restart Supabase.

### Step 3: Test Email Confirmation

1. Register a new user
2. Check email inbox for confirmation link
3. Click the link to confirm

---

## ✅ Recommended Solution for Your Case

Since you're setting up and want to log in immediately:

1. **Set `GOTRUE_MAILER_AUTOCONFIRM=true`** in Supabase environment variables
2. **Restart Supabase**
3. **Run the SQL to confirm existing user:**
   ```sql
   UPDATE auth.users
   SET email_confirmed_at = NOW(),
       confirmed_at = NOW()
   WHERE email = 'nahidwebdesigner@gmail.com';
   ```
4. **Then make them admin:**
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'admin'::app_role
   FROM auth.users
   WHERE email = 'nahidwebdesigner@gmail.com'
   ON CONFLICT (user_id, role) DO NOTHING;
   ```

---

## 🧪 Verify After Fix

1. **Try logging in** with `nahidwebdesigner@gmail.com`
2. **Should work without "email not confirmed" error**
3. **Should have admin access** (if you ran the admin SQL)

---

## 💡 Why This Happens

- **Default behavior:** Supabase requires email confirmation for security
- **Without SMTP:** Emails can't be sent, so users can't confirm
- **Solution:** Either configure SMTP OR disable email confirmation for development

---

**After setting `GOTRUE_MAILER_AUTOCONFIRM=true` and confirming the existing user via SQL, you'll be able to log in!**


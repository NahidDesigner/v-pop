# Disable Email Confirmation - Simple Steps

## ✅ Step-by-Step Instructions

### 1. Open Coolify Dashboard
- Go to your Coolify dashboard
- Log in if needed

### 2. Find Your Supabase Resource
- Go to your **Project** (VideoPopup project)
- Find the **Supabase Resource** in your resources list
- **Click on it** to open its details

### 3. Go to Configuration → Environment Variables
- Click on **"Configuration"** tab
- Scroll down to **"Environment Variables"** section
- Or look for **"Variables"** or **"Env"** section

### 4. Add/Update Environment Variable
- **Click "Add Variable"** or **"Edit"** if it already exists
- **Variable Name:** `AUTH_ENABLE_SIGNUP_EMAIL_CONFIRMATION`
- **Variable Value:** `false`
- **Click "Save"** or "Add"

**Important:** Make sure the value is exactly `false` (lowercase, no quotes)

### 5. Redeploy Supabase
- After saving, look for **"Redeploy"** or **"Restart"** button
- Click it to apply the changes
- Wait 1-2 minutes for deployment to complete

### 6. Test It
- Go to your website
- Try to **sign up** a new user
- They should be able to **log in immediately** without email confirmation
- Your existing account (`nahidwebdesigner@gmail.com`) should also work

---

## 🔍 Where to Find in Coolify

```
Coolify Dashboard
  └── Your Project (VideoPopup)
      └── Resources
          └── Supabase Resource ← Click here
              └── Configuration Tab ← Click here
                  └── Environment Variables Section ← Add variable here
```

---

## ✅ What You Should See

**Before:**
- Users get "Email is not confirmed" error when trying to login

**After:**
- Users can sign up and login immediately
- No email confirmation required
- No "Email is not confirmed" errors

---

## 🆘 If It Doesn't Work

### Try Alternative Variable Names:

Some Supabase versions use different variable names. Try adding these as well:

1. `ENABLE_EMAIL_CONFIRMATION=false`
2. `AUTH_EMAIL_CONFIRMATION=false`
3. `DISABLE_EMAIL_CONFIRMATION=true`

### Check Supabase Logs:

1. In Coolify → Supabase Resource
2. Go to **"Logs"** tab
3. Look for errors or messages about email confirmation
4. This will tell you if the variable is being recognized

### Verify It's Applied:

After redeploy, check the logs to see if the variable is loaded. You should see environment variables being set during container startup.

---

## 📋 Quick Checklist

- [ ] Opened Coolify Dashboard
- [ ] Found Supabase Resource
- [ ] Went to Configuration → Environment Variables
- [ ] Added `AUTH_ENABLE_SIGNUP_EMAIL_CONFIRMATION=false`
- [ ] Saved the variable
- [ ] Redeployed Supabase resource
- [ ] Waited for deployment to complete
- [ ] Tested login with existing account
- [ ] Tested signup with new account

---

## ✅ Success!

Once this is done:
- ✅ New users can sign up and login immediately
- ✅ No email confirmation required
- ✅ Your admin account works without email confirmation
- ✅ All users can use the app immediately after signup


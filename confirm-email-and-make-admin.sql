-- Confirm email and make nahidwebdesigner@gmail.com an admin
-- Run this in Supabase Studio SQL Editor

-- Step 1: Confirm the user's email (so they can log in)
-- Note: confirmed_at is a generated column, so we only update email_confirmed_at
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'nahidwebdesigner@gmail.com';

-- Step 2: Make them admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'nahidwebdesigner@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 3: Verify everything is set correctly
SELECT 
    u.email,
    u.id,
    u.email_confirmed_at,
    u.confirmed_at,  -- This is a generated column (auto-updates from email_confirmed_at)
    ur.role,
    u.created_at as user_created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'nahidwebdesigner@gmail.com';

-- Expected result:
-- email: nahidwebdesigner@gmail.com
-- email_confirmed_at: (should have a timestamp, not NULL)
-- confirmed_at: (will be auto-generated from email_confirmed_at)
-- role: admin


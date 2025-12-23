-- Make nahidwebdesigner@gmail.com an admin
-- Run this in Supabase Studio SQL Editor

-- Step 1: Make the user admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'nahidwebdesigner@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 2: Verify the user is now admin
SELECT 
    u.email,
    u.id,
    ur.role,
    u.created_at as user_created_at,
    ur.created_at as role_created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'nahidwebdesigner@gmail.com';

-- Expected result:
-- email: nahidwebdesigner@gmail.com
-- role: admin
-- If role is NULL, the user doesn't exist - sign up first!


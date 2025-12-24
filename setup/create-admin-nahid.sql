-- ==============================================================================
-- VideoPopup - Create Admin User Script for nahidwebdesigner@gmail.com
-- ==============================================================================
-- Run this in Supabase SQL Editor
-- ==============================================================================

-- Step 1: Find your user ID by email
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'nahidwebdesigner@gmail.com';

-- Step 2: Assign admin role (One-liner version - runs automatically)
-- This will insert the admin role if the user exists
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

-- ==============================================================================
-- Expected Result:
-- You should see:
--   email: nahidwebdesigner@gmail.com
--   role: admin
--   role_assigned_at: (timestamp)
--   user_created_at: (timestamp)
-- ==============================================================================


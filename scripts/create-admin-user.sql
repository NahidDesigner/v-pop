-- Script to create an admin user
-- Replace 'your-email@example.com' with the email of the user you want to make admin
-- 
-- Steps:
-- 1. First, sign up a user through the app with the email below
-- 2. Then run this SQL in Supabase SQL Editor

-- Make user admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify the user was created
SELECT 
    u.email,
    ur.role,
    u.created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'your-email@example.com';


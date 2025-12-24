-- ==============================================================================
-- VideoPopup - Create Admin User Script
-- ==============================================================================
-- Run this AFTER creating your first user via the signup form
-- Replace 'your-email@example.com' with your actual email
-- ==============================================================================

-- Step 1: Find your user ID by email
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'your-email@example.com';

-- Step 2: Copy the UUID from above and use it below
-- Replace 'YOUR-USER-UUID-HERE' with the actual UUID
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR-USER-UUID-HERE', 'admin');

-- Verify the role was assigned
SELECT u.email, r.role, r.created_at
FROM auth.users u
JOIN public.user_roles r ON u.id = r.user_id
WHERE u.email = 'your-email@example.com';

-- ==============================================================================
-- Alternative: One-liner if you know the email
-- ==============================================================================
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'your-email@example.com';

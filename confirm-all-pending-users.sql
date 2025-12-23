-- Confirm all users who haven't confirmed their email yet
-- This allows them to log in and see the admin approval page
-- Run this in Supabase Studio SQL Editor

-- Confirm all pending users' emails
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Verify how many users were confirmed
SELECT 
    COUNT(*) as total_users,
    COUNT(email_confirmed_at) as confirmed_users,
    COUNT(*) - COUNT(email_confirmed_at) as pending_users
FROM auth.users;

-- Show all users and their confirmation status
SELECT 
    email,
    email_confirmed_at,
    created_at,
    CASE 
        WHEN email_confirmed_at IS NULL THEN 'Pending'
        ELSE 'Confirmed'
    END as status
FROM auth.users
ORDER BY created_at DESC;


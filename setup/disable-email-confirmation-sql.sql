-- ==============================================================================
-- Disable Email Confirmation via SQL (Auto-confirm emails on signup)
-- ==============================================================================
-- This creates a database trigger that automatically confirms emails when users sign up
-- Run this in Supabase SQL Editor
-- ==============================================================================

-- Step 1: Create function to auto-confirm email on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Automatically confirm email when user signs up
    NEW.email_confirmed_at = COALESCE(NEW.email_confirmed_at, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create trigger that fires when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    BEFORE INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Also confirm existing unconfirmed users
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email_confirmed_at IS NULL;

-- Step 4: Verify the trigger was created
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Step 5: Test - Check existing users
SELECT 
    email, 
    email_confirmed_at,
    created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- ==============================================================================
-- Result:
-- - All new users will have their email automatically confirmed on signup
-- - Existing unconfirmed users are now confirmed
-- - No email confirmation required for login
-- ==============================================================================


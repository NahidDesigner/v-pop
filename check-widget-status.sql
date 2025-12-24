-- Check Widget Status and Configuration
-- Run this in Supabase SQL Editor to diagnose widget embed issues

-- 1. Check if widget exists and its status
SELECT 
  id,
  name,
  status,
  video_url,
  video_type,
  video_orientation,
  trigger_type,
  trigger_value,
  position,
  created_at,
  updated_at
FROM widgets
WHERE id = '0d8c3bf6-e9d8-4b12-83f3-0dbec6f94980';

-- 2. If widget doesn't exist or status is not 'active', see all widgets:
SELECT 
  id,
  name,
  status,
  video_url,
  video_type
FROM widgets
ORDER BY created_at DESC
LIMIT 10;

-- 3. Check if widget is accessible (should return the widget if active)
-- This simulates what the get-widget Edge Function does
SELECT *
FROM widgets
WHERE id = '0d8c3bf6-e9d8-4b12-83f3-0dbec6f94980'
  AND status = 'active';

-- 4. If the widget exists but status is not 'active', activate it:
-- UPDATE widgets
-- SET status = 'active'
-- WHERE id = '0d8c3bf6-e9d8-4b12-83f3-0dbec6f94980';

-- 5. Check RLS policies on widgets table (should allow service role to read)
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'widgets';


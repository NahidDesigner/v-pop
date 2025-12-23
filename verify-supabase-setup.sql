-- Quick verification script for Supabase setup
-- Run this in Supabase Studio SQL Editor to verify everything is configured correctly

-- 1. Check RLS policies for site_settings
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'site_settings'
ORDER BY policyname;

-- 2. Check RLS policies for showcase_samples
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'showcase_samples'
ORDER BY policyname;

-- 3. Check RLS policies for testimonials
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'testimonials'
ORDER BY policyname;

-- 4. Check view grants for public_site_settings
SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
  AND table_name = 'public_site_settings'
ORDER BY grantee, privilege_type;

-- 5. Verify site_settings has data
SELECT 
  id,
  hero_title,
  hero_subtitle,
  pricing_enabled,
  created_at
FROM public.site_settings
LIMIT 1;

-- 6. Check if testimonials table exists and has structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'testimonials'
ORDER BY ordinal_position;

-- 7. Test anonymous access (should return rows if RLS is correct)
-- Note: This will only work if you're running as anon role
-- In Supabase Studio, you're authenticated, so this is just for reference
SELECT COUNT(*) as active_samples_count
FROM public.showcase_samples
WHERE is_active = true;

SELECT COUNT(*) as active_testimonials_count
FROM public.testimonials
WHERE is_active = true;

-- 8. Check if public_site_settings view exists
SELECT 
  table_name,
  view_definition
FROM information_schema.views
WHERE table_schema = 'public' 
  AND table_name = 'public_site_settings';


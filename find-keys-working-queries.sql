-- WORKING SQL Queries for Self-Hosted Supabase
-- These queries will work even if auth.config doesn't exist

-- ============================================
-- 1. Find All Available Schemas
-- ============================================
SELECT schema_name 
FROM information_schema.schemata
WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
ORDER BY schema_name;

-- ============================================
-- 2. Find All Tables in Auth Schema (If It Exists)
-- ============================================
SELECT 
  table_schema,
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'auth'
ORDER BY table_name;

-- ============================================
-- 3. Check Current Connection Role and JWT Claims
-- ============================================
-- This shows what role/permissions your current session has
SELECT 
  current_user as current_role,
  current_database() as database_name,
  current_setting('request.jwt.claim.role', true) as jwt_role,
  current_setting('request.jwt.claim.iss', true) as jwt_issuer,
  current_setting('request.jwt.claim.ref', true) as jwt_project_ref;

-- ============================================
-- 4. Find Config/Setting Related Tables
-- ============================================
-- This will show you what tables actually exist
SELECT 
  table_schema,
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema IN ('public', 'auth', 'storage', 'supabase')
  AND (
    table_name ILIKE '%config%' 
    OR table_name ILIKE '%setting%'
    OR table_name ILIKE '%key%'
    OR table_name ILIKE '%secret%'
  )
ORDER BY table_schema, table_name;

-- ============================================
-- 5. Check PostgreSQL Settings (Might Show JWT Config)
-- ============================================
SELECT 
  name,
  setting,
  source,
  category
FROM pg_settings
WHERE name ILIKE '%jwt%' 
   OR name ILIKE '%secret%'
   OR name ILIKE '%supabase%'
ORDER BY category, name;

-- ============================================
-- 6. List All Tables in Public Schema
-- ============================================
-- To see what's actually available
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- ============================================
-- 7. Check If You Can Access Auth Schema
-- ============================================
SELECT 
  has_schema_privilege('auth', 'USAGE') as can_access_auth_schema,
  has_schema_privilege('public', 'USAGE') as can_access_public_schema;

-- ============================================
-- 8. Find All Functions Related to Auth/JWT
-- ============================================
SELECT 
  routine_schema,
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema IN ('public', 'auth')
  AND (
    routine_name ILIKE '%jwt%'
    OR routine_name ILIKE '%auth%'
    OR routine_name ILIKE '%key%'
  )
ORDER BY routine_schema, routine_name;

-- ============================================
-- ⚠️ IMPORTANT: Keys Are NOT in Database!
-- ============================================
-- For self-hosted Supabase, keys are in ENVIRONMENT VARIABLES:
--
-- To find your keys:
-- 1. Coolify → Supabase Resource → Environment Variables
--    - ANON_KEY = Your frontend key
--    - SERVICE_ROLE_KEY = Your server-side key
--    - JWT_SECRET = Used to generate keys
--
-- 2. Supabase Studio → Settings → API
--    - Shows the actual keys you can use
--
-- 3. Compare with your app:
--    - Your app uses: VITE_SUPABASE_PUBLISHABLE_KEY
--    - It must match: ANON_KEY from Supabase
--
-- ============================================
-- Quick Check: What's Your Current Session?
-- ============================================
SELECT 
  'Current User' as info_type,
  current_user as value
UNION ALL
SELECT 
  'Database',
  current_database()::text
UNION ALL
SELECT 
  'JWT Role',
  COALESCE(current_setting('request.jwt.claim.role', true), 'Not set')
UNION ALL
SELECT 
  'JWT Issuer',
  COALESCE(current_setting('request.jwt.claim.iss', true), 'Not set');


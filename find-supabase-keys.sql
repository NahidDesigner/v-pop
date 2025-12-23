-- SQL Queries to Find Supabase Keys in Database
-- Run these in Supabase Studio SQL Editor

-- ============================================
-- 1. Check Auth Configuration (Most Common)
-- ============================================
-- This shows auth-related configuration including JWT settings
SELECT * FROM auth.config;

-- If that doesn't work, try:
SELECT * FROM auth.settings;

-- ============================================
-- 2. Check for JWT Secret (Used to Generate Keys)
-- ============================================
-- The ANON_KEY is generated from JWT_SECRET, so check if JWT_SECRET exists
SELECT 
  name,
  value,
  CASE 
    WHEN name LIKE '%JWT%' OR name LIKE '%SECRET%' THEN 'JWT Related'
    WHEN name LIKE '%ANON%' OR name LIKE '%KEY%' THEN 'Key Related'
    ELSE 'Other'
  END as category
FROM pg_settings
WHERE name ILIKE '%jwt%' 
   OR name ILIKE '%secret%'
   OR name ILIKE '%key%'
   OR name ILIKE '%anon%'
ORDER BY category, name;

-- ============================================
-- 3. Check Supabase Schema for Config Tables
-- ============================================
-- List all tables in public schema that might contain config
SELECT 
  table_schema,
  table_name
FROM information_schema.tables
WHERE table_schema IN ('public', 'auth', 'storage')
  AND (
    table_name ILIKE '%config%' 
    OR table_name ILIKE '%setting%'
    OR table_name ILIKE '%key%'
    OR table_name ILIKE '%secret%'
  )
ORDER BY table_schema, table_name;

-- ============================================
-- 4. Check for Keys in Environment Variables (via pg_settings)
-- ============================================
-- Note: Environment variables might not be directly queryable,
-- but some Supabase instances store them in settings
SELECT 
  name,
  setting,
  source
FROM pg_settings
WHERE name IN (
  'supabase.anon_key',
  'supabase.service_role_key',
  'supabase.jwt_secret'
)
OR name ILIKE '%supabase%key%'
OR name ILIKE '%supabase%secret%';

-- ============================================
-- 5. Check Project Configuration
-- ============================================
-- Some Supabase instances have a projects or config table
SELECT * FROM public.projects LIMIT 1;
SELECT * FROM public.config LIMIT 1;
SELECT * FROM public.settings LIMIT 1;

-- ============================================
-- 6. Decode JWT to See Key Details (If You Have a Key)
-- ============================================
-- If you have a key, you can check its structure
-- Replace 'YOUR_KEY_HERE' with an actual key to decode
SELECT 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' as header_part,
  'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXJwcm9qZWN0aWQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2ODAwMCwiZXhwIjoxOTU0NTQ0MDAwfQ' as payload_part;

-- To decode JWT payload (if you have a key):
-- You can use online tools like jwt.io, or this shows the structure:
-- Header: {"alg":"HS256","typ":"JWT"}
-- Payload: {"iss":"supabase","ref":"yourprojectid","role":"anon","iat":1638968000,"exp":1954544000}

-- ============================================
-- 7. Check for Keys in Vault (if using pg_vault extension)
-- ============================================
-- Some Supabase instances use vault for secrets
SELECT * FROM vault.secrets;

-- ============================================
-- 8. Most Reliable: Check What Keys Are Actually Being Used
-- ============================================
-- This query checks what role the current connection is using
-- and what permissions it has
SELECT 
  current_user as current_role,
  current_database() as database_name,
  current_setting('request.jwt.claim.role', true) as jwt_role,
  current_setting('request.jwt.claim.iss', true) as jwt_issuer;

-- ============================================
-- 9. Check API Keys from Supabase's Internal Tables
-- ============================================
-- Some self-hosted Supabase instances store keys in specific tables
SELECT * FROM supabase.keys;
SELECT * FROM supabase.config;
SELECT * FROM supabase.settings;

-- ============================================
-- 10. Find All Tables That Might Contain Keys
-- ============================================
-- Comprehensive search across all schemas
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname IN ('public', 'auth', 'storage', 'supabase', 'vault')
  AND (
    tablename ILIKE '%key%'
    OR tablename ILIKE '%config%'
    OR tablename ILIKE '%setting%'
    OR tablename ILIKE '%secret%'
  )
ORDER BY schemaname, tablename;

-- ============================================
-- IMPORTANT NOTES:
-- ============================================
-- 1. Keys are usually stored in ENVIRONMENT VARIABLES, not in the database
-- 2. For self-hosted Supabase, check Coolify → Supabase Resource → Environment Variables
-- 3. The ANON_KEY is generated from JWT_SECRET + project settings
-- 4. If you can't find keys in DB, they're definitely in environment variables
-- 5. To see actual keys, check Supabase Studio → Settings → API

-- ============================================
-- Quick Check: What's Your Current Connection Using?
-- ============================================
-- This shows what role/claims your current session has
SELECT 
  current_user,
  session_user,
  current_setting('request.jwt.claim.role', true) as jwt_role_claim,
  current_setting('request.jwt.claim.iss', true) as jwt_issuer_claim;


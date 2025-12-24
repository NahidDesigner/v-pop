// ==============================================================================
// VideoPopup - Supabase Connection Test Script
// ==============================================================================
// Run this in your browser console (F12) on your deployed site
// ==============================================================================

// Test 1: Display Current Supabase Configuration
console.log('🔍 Current Supabase Configuration:');
console.log('=====================================');

// Get environment variables (Vite exposes them via import.meta.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'NOT SET';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'NOT SET';
const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || 'NOT SET';

console.log('📋 Supabase URL:', supabaseUrl);
console.log('📋 Supabase Key (Full):', supabaseKey);
console.log('📋 Supabase Key (First 20 chars):', supabaseKey !== 'NOT SET' ? supabaseKey.substring(0, 20) + '...' : 'NOT SET');
console.log('📋 Supabase Key (Last 20 chars):', supabaseKey !== 'NOT SET' ? '...' + supabaseKey.substring(supabaseKey.length - 20) : 'NOT SET');
console.log('📋 Project ID:', projectId);
console.log('');

// Check if values are set
if (supabaseUrl === 'NOT SET' || supabaseKey === 'NOT SET') {
    console.error('❌ ERROR: Supabase URL or Key is not set!');
    console.log('');
    console.log('🔧 To fix:');
    console.log('1. Go to Coolify Dashboard → Your Frontend Resource');
    console.log('2. Configuration → Environment Variables');
    console.log('3. Add/Check:');
    console.log('   - VITE_SUPABASE_URL=https://your-supabase-url.com');
    console.log('   - VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key');
    console.log('4. Redeploy the frontend resource');
} else {
    console.log('✅ Environment variables are set');
    console.log('');
}

// Test 2: Test Supabase Connection
console.log('🔌 Testing Supabase Connection...');
console.log('=====================================');

// Try to import/create Supabase client
async function testSupabaseConnection() {
    try {
        // Check if supabase client is available in window
        if (window.supabase) {
            console.log('✅ Supabase client found in window object');
            const client = window.supabase;
            
            // Test 1: Check if we can connect
            console.log('📡 Testing connection...');
            
            // Try a simple query that doesn't require auth
            const { data, error, status } = await client
                .from('site_settings')
                .select('*')
                .limit(1)
                .single();
            
            if (error) {
                console.log('⚠️  Query test result:', status, error.message);
                if (status === 401) {
                    console.error('❌ 401 Unauthorized - Check your API keys!');
                    console.log('');
                    console.log('🔧 Common fixes:');
                    console.log('1. Verify SUPABASE_ANON_KEY in Coolify matches VITE_SUPABASE_PUBLISHABLE_KEY in frontend');
                    console.log('2. Check SITE_URL and ADDITIONAL_REDIRECT_URLS in Supabase resource env vars');
                    console.log('3. Ensure Supabase resource is running and accessible');
                } else if (status === 404) {
                    console.log('⚠️  Table might not exist - run database migrations first');
                } else {
                    console.error('❌ Connection error:', error.message);
                }
            } else {
                console.log('✅ Connection successful!');
                console.log('📦 Test query result:', data);
            }
            
            // Test 2: Check auth state
            console.log('');
            console.log('🔐 Testing Authentication...');
            const { data: { session }, error: authError } = await client.auth.getSession();
            if (authError) {
                console.log('⚠️  Auth check error:', authError.message);
            } else {
                console.log('✅ Auth is available');
                console.log('📋 Current session:', session ? 'Logged in' : 'Not logged in');
            }
            
        } else {
            // Try to create client manually
            console.log('⚠️  Supabase client not found in window, attempting to create...');
            console.log('This might fail if Supabase JS library is not loaded');
            
            // If @supabase/supabase-js is available
            if (typeof createClient !== 'undefined') {
                const { createClient } = await import('@supabase/supabase-js');
                const testClient = createClient(supabaseUrl, supabaseKey);
                
                const { data, error } = await testClient.from('site_settings').select('*').limit(1);
                if (error) {
                    console.error('❌ Connection failed:', error.message);
                } else {
                    console.log('✅ Connection successful!');
                }
            } else {
                console.log('⚠️  Cannot test connection - Supabase client not available');
                console.log('Make sure the site is loaded and Supabase is initialized');
            }
        }
        
    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
        console.log('');
        console.log('🔧 Troubleshooting:');
        console.log('1. Make sure the site is fully loaded');
        console.log('2. Check browser console for other errors');
        console.log('3. Verify Supabase URL is accessible from browser');
    }
}

// Run the test
testSupabaseConnection();

// Test 3: Display full key (be careful with this!)
console.log('');
console.log('🔑 Full Supabase Anon Key (for copying to Coolify):');
console.log('=====================================');
console.log(supabaseKey);
console.log('');
console.log('⚠️  WARNING: This key is public (anon key), but be careful sharing it!');


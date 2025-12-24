# Browser Console Test Scripts

## Quick Test Scripts

Copy and paste these scripts into your browser console (F12 → Console tab) on your deployed site.

---

## Script 1: Display Supabase Configuration

Shows your current Supabase URL and keys (works in browser console):

```javascript
// Display Supabase Configuration (Browser Console Version)
(async () => {
    try {
        // Try to access Supabase client from the app
        if (window.supabase) {
            const url = window.supabase.supabaseUrl;
            const key = window.supabase.supabaseKey;
            
            console.log('🔍 Supabase Configuration:');
            console.log('URL:', url);
            console.log('Key (Full):', key);
            console.log('Key (Preview):', key ? (key.substring(0, 30) + '...') : 'NOT FOUND');
            console.log('Key Length:', key ? key.length : 0);
        } else {
            console.log('⚠️ Supabase client not found in window object');
            console.log('Trying alternative method...');
            
            // Alternative: Check if we can find it in React dev tools or globals
            const scripts = Array.from(document.querySelectorAll('script'));
            scripts.forEach((script, i) => {
                if (script.textContent && script.textContent.includes('VITE_SUPABASE')) {
                    console.log(`Found VITE_SUPABASE reference in script ${i}`);
                }
            });
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
```

---

## Script 2: Test Supabase Connection

Tests if Supabase is reachable and working (works in browser console):

```javascript
// Test Supabase Connection (Browser Console Version)
(async () => {
    try {
        if (!window.supabase) {
            console.error('❌ Supabase client not found. Make sure the page is loaded.');
            return;
        }
        
        const url = window.supabase.supabaseUrl;
        const key = window.supabase.supabaseKey;
        
        console.log('🔌 Testing connection to:', url);
        console.log('Key (first 30):', key ? (key.substring(0, 30) + '...') : 'NOT FOUND');
        console.log('');
        
        if (!url || !key) {
            console.error('❌ URL or Key not found!');
            return;
        }
        
        // Test REST API connection
        const response = await fetch(`${url}/rest/v1/site_settings?select=*&limit=1`, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📡 Response status:', response.status);
        
        if (response.status === 401) {
            console.error('❌ 401 Unauthorized - API key is invalid!');
            console.log('');
            console.log('🔧 Fix:');
            console.log('1. Go to Coolify → Supabase Resource → Environment Variables');
            console.log('2. Copy SUPABASE_ANON_KEY value');
            console.log('3. Go to Coolify → Frontend Resource → Environment Variables');
            console.log('4. Set VITE_SUPABASE_PUBLISHABLE_KEY to the copied value');
            console.log('5. Redeploy frontend');
        } else if (response.ok) {
            const data = await response.json();
            console.log('✅ Connection successful!');
            console.log('📦 Data:', data);
        } else {
            console.error('❌ Connection failed:', response.status, response.statusText);
            const text = await response.text();
            console.error('Error details:', text);
        }
    } catch (error) {
        console.error('❌ Connection error:', error.message);
    }
})();
```

---

## Script 3: Check Environment Variables (Simplified)

Quick check if Supabase client is configured (works in browser console):

```javascript
// Quick Supabase Check (Browser Console Version)
console.log('🔍 Supabase Client Check:');
console.log('');

if (window.supabase) {
    const url = window.supabase.supabaseUrl;
    const key = window.supabase.supabaseKey;
    
    console.log('URL:', url ? '✅ SET' : '❌ NOT SET');
    if (url) console.log('  Value:', url);
    
    console.log('Key:', key ? '✅ SET (' + key.length + ' chars)' : '❌ NOT SET');
    if (key) {
        console.log('  Preview:', key.substring(0, 30) + '...' + key.substring(key.length - 10));
    }
} else {
    console.log('❌ Supabase client not found in window object');
    console.log('Make sure the page is fully loaded');
}
```

---

## Script 4: Full Key Display (For Copying)

**⚠️ Use this to copy your full key to Coolify (works in browser console):**

```javascript
// Display Full Key for Copying (Browser Console Version)
if (window.supabase && window.supabase.supabaseKey) {
    const fullKey = window.supabase.supabaseKey;
    const url = window.supabase.supabaseUrl;
    
    console.log('🔑 Full Supabase Anon Key:');
    console.log('=====================================');
    console.log(fullKey);
    console.log('=====================================');
    console.log('');
    console.log('📋 Supabase URL:', url);
    console.log('');
    console.log('📋 To use in Coolify:');
    console.log('1. Copy the key above');
    console.log('2. Go to Coolify → Frontend Resource → Environment Variables');
    console.log('3. Set VITE_SUPABASE_PUBLISHABLE_KEY to the copied value');
    console.log('4. Redeploy frontend');
} else {
    console.error('❌ Supabase client not found. Make sure the page is loaded.');
}
```

---

## Script 5: Complete Diagnostic Test (BROWSER CONSOLE VERSION)

**Runs all checks at once - Copy this one!**

```javascript
// Complete Diagnostic Test (Browser Console Version)
(async () => {
    console.log('🔍 VideoPopup Supabase Diagnostic Test');
    console.log('=====================================');
    console.log('');
    
    // 1. Check Supabase Client
    console.log('1️⃣  Checking Supabase Client...');
    if (!window.supabase) {
        console.error('   ❌ Supabase client not found in window object');
        console.log('   Make sure the page is fully loaded');
        return;
    }
    
    const url = window.supabase.supabaseUrl;
    const key = window.supabase.supabaseKey;
    
    console.log('   URL:', url || '❌ NOT SET');
    console.log('   Key:', key ? ('✅ SET (' + key.length + ' chars)') : '❌ NOT SET');
    if (key) {
        console.log('   Key Preview:', key.substring(0, 30) + '...' + key.substring(key.length - 10));
    }
    console.log('');
    
    if (!url || !key) {
        console.error('❌ Supabase URL or Key is missing!');
        console.log('   Fix: Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Coolify → Frontend Resource → Environment Variables');
        return;
    }
    
    // 2. Test Connection
    console.log('2️⃣  Testing Supabase Connection...');
    try {
        const response = await fetch(`${url}/rest/v1/site_settings?select=*&limit=1`, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('   Status:', response.status);
        
        if (response.status === 401) {
            console.error('   ❌ 401 Unauthorized - API key is invalid!');
            console.log('');
            console.log('   🔧 Fix:');
            console.log('   1. Go to Coolify → Supabase Resource → Environment Variables');
            console.log('   2. Copy SUPABASE_ANON_KEY value');
            console.log('   3. Go to Coolify → Frontend Resource → Environment Variables');
            console.log('   4. Set VITE_SUPABASE_PUBLISHABLE_KEY to the copied value');
            console.log('   5. Redeploy frontend');
        } else if (response.status === 404) {
            console.warn('   ⚠️  404 Not Found - Table might not exist (run migrations first)');
        } else if (response.ok) {
            const data = await response.json();
            console.log('   ✅ Connection successful!');
            console.log('   Data:', data);
        } else {
            const text = await response.text();
            console.error('   ❌ Error:', response.status, text);
        }
    } catch (error) {
        console.error('   ❌ Connection failed:', error.message);
        console.log('   Fix: Check that Supabase URL is correct and accessible');
    }
    console.log('');
    
    // 3. Check Auth Session
    console.log('3️⃣  Checking Authentication...');
    try {
        const { data: { session }, error } = await window.supabase.auth.getSession();
        if (error) {
            console.log('   ⚠️  Auth error:', error.message);
        } else {
            console.log('   ✅ Auth is available');
            console.log('   Session:', session ? 'Active (logged in)' : 'None (not logged in)');
        }
    } catch (error) {
        console.log('   ⚠️  Could not check auth:', error.message);
    }
    console.log('');
    
    // 4. Display Full Key
    console.log('4️⃣  Full Anon Key (for copying):');
    console.log('=====================================');
    console.log(key);
    console.log('=====================================');
    console.log('');
    
    console.log('✅ Diagnostic complete!');
})();
```

---

## How to Use

1. **Open your deployed site** in a browser
2. **Press F12** to open Developer Tools
3. **Go to Console tab**
4. **Copy and paste** one of the scripts above
5. **Press Enter** to run

---

## What to Look For

### ✅ Good Signs:
- Environment variables show "SET"
- Connection test returns 200 or 404 (table doesn't exist yet)
- No 401 errors

### ❌ Bad Signs:
- 401 Unauthorized → API key mismatch
- Environment variables show "NOT SET" → Not configured in Coolify
- Connection failed → URL incorrect or Supabase not accessible

---

## Common Issues

### Issue: "NOT SET" for environment variables
**Fix:** Go to Coolify → Frontend Resource → Environment Variables → Add missing variables

### Issue: 401 Unauthorized
**Fix:** 
1. Get `SUPABASE_ANON_KEY` from Coolify → Supabase Resource → Environment Variables
2. Copy it to Frontend Resource → `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Redeploy frontend

### Issue: Connection failed / Network error
**Fix:** 
1. Check Supabase URL is correct
2. Verify Supabase resource is running in Coolify
3. Check if URL is accessible from browser

---

## Quick Reference

**Get Supabase Anon Key from Coolify:**
1. Coolify Dashboard → Supabase Resource
2. Configuration → Environment Variables
3. Copy `SUPABASE_ANON_KEY` value

**Set Frontend Environment Variables in Coolify:**
1. Coolify Dashboard → Frontend Resource
2. Configuration → Environment Variables
3. Add:
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = The anon key from above
   - `VITE_SUPABASE_PROJECT_ID` = videopop (or any identifier)


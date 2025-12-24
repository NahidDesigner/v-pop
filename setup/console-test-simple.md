# 🚀 Quick Browser Console Test Scripts

**Copy and paste these directly into your browser console (F12 → Console)**

## ⚡ Quick Test - Copy This One First!

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
    
    // 3. Display Full Key
    console.log('3️⃣  Full Anon Key (for copying):');
    console.log('=====================================');
    console.log(key);
    console.log('=====================================');
    console.log('');
    
    console.log('✅ Diagnostic complete!');
})();
```

---

## 🔑 Just Show the Key

```javascript
// Display Full Key for Copying
if (window.supabase && window.supabase.supabaseKey) {
    const fullKey = window.supabase.supabaseKey;
    const url = window.supabase.supabaseUrl;
    
    console.log('🔑 Full Supabase Anon Key:');
    console.log('=====================================');
    console.log(fullKey);
    console.log('=====================================');
    console.log('');
    console.log('📋 Supabase URL:', url);
} else {
    console.error('❌ Supabase client not found. Make sure the page is loaded.');
}
```

---

## 🔌 Just Test Connection

```javascript
// Test Connection Only
(async () => {
    if (!window.supabase) {
        console.error('❌ Supabase client not found');
        return;
    }
    
    const url = window.supabase.supabaseUrl;
    const key = window.supabase.supabaseKey;
    
    console.log('🔌 Testing connection to:', url);
    
    try {
        const response = await fetch(`${url}/rest/v1/site_settings?select=*&limit=1`, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Status:', response.status);
        
        if (response.status === 401) {
            console.error('❌ 401 - API key mismatch! Check your keys in Coolify.');
        } else if (response.ok) {
            console.log('✅ Connection successful!');
        } else {
            console.log('⚠️ Status:', response.status);
        }
    } catch (error) {
        console.error('❌ Failed:', error.message);
    }
})();
```

---

## How to Use

1. Open your site: `https://vpop.vibecodingfield.com`
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. **Copy and paste** one of the scripts above
5. Press **Enter** to run

---

## Expected Results

### ✅ Good:
- Status: 200 (OK) or 404 (table doesn't exist yet - run migrations)
- Key shows full value (long string)

### ❌ Bad:
- Status: 401 → API key mismatch
- "Supabase client not found" → Page not fully loaded
- "NOT SET" → Environment variables missing in Coolify


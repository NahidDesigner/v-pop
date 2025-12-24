# ✅ Working Browser Console Test Scripts

**These scripts work without needing window.supabase exposed!**

## 🚀 Method 1: Extract from Network Requests (RECOMMENDED)

This script finds your Supabase URL and API key from failed network requests:

```javascript
// Extract Supabase Config from Network Requests
(async () => {
    console.log('🔍 Extracting Supabase Configuration from Network...');
    console.log('=====================================');
    console.log('');
    
    // Method 1: Check Performance API for network requests
    const entries = performance.getEntriesByType('resource');
    let supabaseUrl = null;
    let apiKey = null;
    
    // Look for Supabase requests
    entries.forEach(entry => {
        if (entry.name.includes('supabase') || entry.name.includes('rest/v1')) {
            // Extract base URL
            const match = entry.name.match(/(https?:\/\/[^\/]+)/);
            if (match) {
                supabaseUrl = match[1];
            }
        }
    });
    
    // Method 2: Check Network tab by making a test request
    if (!supabaseUrl) {
        console.log('⚠️  No Supabase requests found in performance log');
        console.log('💡 Tip: Open Network tab (F12 → Network) and look for failed requests');
        console.log('   The URL will be visible in the request URL');
        console.log('');
        console.log('🔧 Manual Method:');
        console.log('1. Open Network tab (F12 → Network)');
        console.log('2. Find any failed request (red status)');
        console.log('3. Click on it → Headers tab');
        console.log('4. Look at Request URL (the base URL before /rest/v1)');
        console.log('5. Look at Request Headers → Authorization or apikey header');
        console.log('6. Copy the Bearer token (the part after "Bearer ")');
        return;
    }
    
    console.log('📋 Found Supabase URL:', supabaseUrl);
    console.log('');
    console.log('⚠️  API Key cannot be extracted automatically');
    console.log('💡 To get the API Key:');
    console.log('1. Open Network tab (F12 → Network)');
    console.log('2. Find any request to Supabase (may be failed)');
    console.log('3. Click on it → Headers tab');
    console.log('4. Look for "Authorization: Bearer ..." or "apikey: ..." header');
    console.log('5. Copy the value (the part after "Bearer " or the apikey value)');
    console.log('');
    console.log('🔑 Or get it from Coolify:');
    console.log('1. Coolify Dashboard → Supabase Resource');
    console.log('2. Configuration → Environment Variables');
    console.log('3. Copy SUPABASE_ANON_KEY value');
})();
```

---

## 🚀 Method 2: Test Connection with Manual Entry

Enter your Supabase URL and key when prompted:

```javascript
// Test Connection - Manual Entry
(async () => {
    console.log('🔌 Supabase Connection Test');
    console.log('=====================================');
    console.log('');
    
    const SUPABASE_URL = prompt('Enter your Supabase URL (from Coolify → Supabase Resource → URL):');
    
    if (!SUPABASE_URL) {
        console.error('❌ No URL provided');
        return;
    }
    
    console.log('📋 URL:', SUPABASE_URL);
    console.log('');
    
    const API_KEY = prompt('Enter your Supabase Anon Key (from Coolify → Supabase Resource → Environment Variables → SUPABASE_ANON_KEY):');
    
    if (!API_KEY) {
        console.error('❌ No API key provided');
        console.log('');
        console.log('💡 To get the key:');
        console.log('1. Coolify Dashboard → Supabase Resource');
        console.log('2. Configuration → Environment Variables');
        console.log('3. Copy SUPABASE_ANON_KEY value');
        return;
    }
    
    console.log('');
    console.log('🔑 Full Anon Key:', API_KEY);
    console.log('');
    console.log('📡 Testing connection...');
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=*&limit=1`, {
            headers: {
                'apikey': API_KEY,
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Status:', response.status);
        
        if (response.status === 401) {
            console.error('❌ 401 Unauthorized - API key is invalid!');
            console.log('');
            console.log('🔧 Fix:');
            console.log('1. Verify you copied the correct SUPABASE_ANON_KEY from Coolify');
            console.log('2. Make sure there are no extra spaces');
            console.log('3. Check that Supabase resource is running');
        } else if (response.status === 404) {
            console.log('⚠️  404 - Table might not exist (this is OK if you haven\'t run migrations yet)');
            console.log('   The connection works, but the table doesn\'t exist');
            console.log('   Run database migrations to create tables');
        } else if (response.ok) {
            const data = await response.json();
            console.log('✅ Connection successful!');
            console.log('📦 Data:', data);
        } else {
            const text = await response.text();
            console.error('❌ Error:', response.status, text);
        }
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('   Check that Supabase URL is correct and accessible');
    }
})();
```

---

## 🚀 Method 3: Quick Network Tab Guide

Use this if you want to manually check:

```javascript
// Network Tab Guide
console.log('📖 How to Find Supabase Config from Network Tab:');
console.log('=====================================');
console.log('');
console.log('1️⃣  Open Network Tab:');
console.log('   - Press F12 → Click "Network" tab');
console.log('   - Refresh the page (F5)');
console.log('');
console.log('2️⃣  Find Supabase Requests:');
console.log('   - Look for requests with "supabase" or "rest/v1" in the URL');
console.log('   - They may show as failed (red) with 401 status');
console.log('');
console.log('3️⃣  Get Supabase URL:');
console.log('   - Click on any Supabase request');
console.log('   - Look at the URL (e.g., https://your-supabase-url.com/rest/v1/...)');
console.log('   - Copy the base URL (everything before /rest/v1)');
console.log('');
console.log('4️⃣  Get API Key:');
console.log('   - Still in the request details, click "Headers" tab');
console.log('   - Look for "Authorization" header');
console.log('   - Value will be: "Bearer YOUR_KEY_HERE"');
console.log('   - Copy the part after "Bearer " (the actual key)');
console.log('   - OR look for "apikey" header and copy its value');
console.log('');
console.log('5️⃣  Use in Coolify:');
console.log('   - Go to Coolify → Frontend Resource → Environment Variables');
console.log('   - Set VITE_SUPABASE_URL = (the URL from step 3)');
console.log('   - Set VITE_SUPABASE_PUBLISHABLE_KEY = (the key from step 4)');
console.log('   - Redeploy frontend');
```

---

## 🚀 Method 4: Check localStorage (Auth Tokens)

This checks if there are any auth tokens stored (won't show the API key, but can confirm auth is working):

```javascript
// Check localStorage for Supabase Auth
console.log('🔍 Checking localStorage for Supabase Auth...');
console.log('=====================================');
console.log('');

const keys = Object.keys(localStorage);
const supabaseKeys = keys.filter(key => key.includes('supabase') || key.includes('sb-'));

if (supabaseKeys.length > 0) {
    console.log('✅ Found Supabase-related localStorage keys:');
    supabaseKeys.forEach(key => {
        const value = localStorage.getItem(key);
        console.log(`   ${key}: ${value ? (value.substring(0, 50) + '...') : 'null'}`);
    });
    console.log('');
    console.log('💡 These are auth tokens, not the API key');
    console.log('   To get the API key, use Method 1 or 2 above');
} else {
    console.log('⚠️  No Supabase keys found in localStorage');
    console.log('   This might mean you\'re not logged in, or the app hasn\'t tried to authenticate yet');
}
```

---

## 📋 Recommended Workflow

**If you're getting 401 errors (like you are now):**

1. **Use Method 2** (Manual Entry) to test your connection
2. **Get your keys from Coolify:**
   - Supabase URL: Coolify → Supabase Resource → Details → URL
   - Anon Key: Coolify → Supabase Resource → Configuration → Environment Variables → `SUPABASE_ANON_KEY`
3. **Update Frontend Environment Variables in Coolify:**
   - Go to Frontend Resource → Configuration → Environment Variables
   - Set `VITE_SUPABASE_URL` = your Supabase URL
   - Set `VITE_SUPABASE_PUBLISHABLE_KEY` = your Anon Key
4. **Redeploy frontend**
5. **Test again** with Method 2

---

## ✅ What Success Looks Like

After fixing, you should see:
- Status: **200** (OK) - Connection works and table exists
- Status: **404** (Not Found) - Connection works but table doesn't exist (run migrations)
- **NOT** Status: 401 (Unauthorized) - This means keys don't match


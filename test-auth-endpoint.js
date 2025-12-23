// Test Auth Endpoint Script
// Run this in your browser console to diagnose auth issues

async function testAuthEndpoint() {
  const url = window.__SUPABASE_DEBUG__.url;
  const key = window.__SUPABASE_DEBUG__.key;
  
  console.log('🧪 Testing Auth Endpoint...');
  console.log('URL:', url);
  console.log('Key (first 50 chars):', key.substring(0, 50) + '...');
  
  // Test 1: Health Check
  console.log('\n📊 Test 1: Auth Health Check');
  try {
    const healthResponse = await fetch(`${url}/auth/v1/health`, {
      headers: { 'apikey': key }
    });
    console.log('Status:', healthResponse.status);
    const healthText = await healthResponse.text();
    console.log('Response:', healthText);
  } catch (error) {
    console.error('❌ Health Check Failed:', error);
  }
  
  // Test 2: Signup Endpoint
  console.log('\n📝 Test 2: Signup Endpoint');
  try {
    const signupResponse = await fetch(`${url}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: `test-${Date.now()}@example.com`,
        password: 'testpassword123'
      })
    });
    console.log('Status:', signupResponse.status);
    const signupData = await signupResponse.json();
    console.log('Response:', signupData);
    
    if (signupResponse.status === 401) {
      console.error('❌ 401 Unauthorized - Check your API key!');
      console.log('💡 Make sure you\'re using the ANON_KEY, not SERVICE_ROLE_KEY');
    } else if (signupResponse.status === 200 || signupResponse.status === 201) {
      console.log('✅ Signup endpoint is working!');
    }
  } catch (error) {
    console.error('❌ Signup Test Failed:', error);
  }
  
  // Test 3: Token Endpoint (Login)
  console.log('\n🔑 Test 3: Token Endpoint (Login)');
  try {
    const tokenResponse = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword123'
      })
    });
    console.log('Status:', tokenResponse.status);
    const tokenData = await tokenResponse.json();
    console.log('Response:', tokenData);
    
    if (tokenResponse.status === 401) {
      console.error('❌ 401 Unauthorized - Check your API key!');
    } else if (tokenResponse.status === 400) {
      console.log('⚠️ 400 Bad Request - This is expected if the user doesn\'t exist');
      console.log('This means the endpoint is working, but the credentials are invalid');
    }
  } catch (error) {
    console.error('❌ Token Test Failed:', error);
  }
  
  // Test 4: Check Headers
  console.log('\n📋 Test 4: Verify Request Headers');
  console.log('Expected headers in requests:');
  console.log('  - apikey:', key.substring(0, 20) + '...');
  console.log('  - Content-Type: application/json');
  
  console.log('\n✅ Testing complete!');
  console.log('💡 If you see 401 errors, check:');
  console.log('   1. API key is correct (ANON_KEY from Supabase)');
  console.log('   2. GoTrue environment variables are set');
  console.log('   3. Supabase has been restarted');
}

// Run the test
testAuthEndpoint();


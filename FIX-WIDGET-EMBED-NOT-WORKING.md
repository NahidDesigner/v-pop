# Fix Widget Embed Not Working

## Issue
- Widget works in same tab (shows analytics)
- Widget shows "no widget found" in incognito mode
- Embed script URL: `<script src="https://superbasevpop.vibecodingfield.com//functions/v1/embed-script?id=0d8c3bf6-e9d8-4b12-83f3-0dbec6f94980" async></script>`

## Root Causes

### 1. Missing Edge Function Environment Variables
Edge Functions need `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` environment variables.

### 2. Double Slash in URL
The embed script URL has `//functions/v1` which should be `/functions/v1`.

### 3. Widget Status Not Active
The widget must have `status = 'active'` in the database.

### 4. Silent Error Handling
The embed script doesn't log errors, making debugging difficult.

## Fix Steps

### Step 1: Verify Widget Status

Run this SQL in Supabase SQL Editor:

```sql
-- Check if widget exists and is active
SELECT id, name, status, video_url, video_type
FROM widgets
WHERE id = '0d8c3bf6-e9d8-4b12-83f3-0dbec6f94980';

-- If status is not 'active', update it:
UPDATE widgets
SET status = 'active'
WHERE id = '0d8c3bf6-e9d8-4b12-83f3-0dbec6f94980';
```

### Step 2: Set Edge Function Environment Variables in Coolify

1. Go to **Coolify** → Your **Supabase Resource**
2. Navigate to **Environment Variables**
3. Make sure these variables are set (they should already exist, but verify):
   - `SUPABASE_URL` = `https://superbasevpop.vibecodingfield.com`
   - `SUPABASE_SERVICE_ROLE_KEY` = Your service role key (from Supabase environment variables)

   **Important**: Edge Functions automatically inherit environment variables from the Supabase resource, but if they don't work, you might need to set them per function.

4. If Edge Functions are separate resources in Coolify, set the environment variables for each Edge Function resource:
   - `embed-script` function
   - `get-widget` function
   - `track-analytics` function

### Step 3: Test the get-widget Endpoint Directly

Open your browser console (incognito mode) and run:

```javascript
fetch('https://superbasevpop.vibecodingfield.com/functions/v1/get-widget?id=0d8c3bf6-e9d8-4b12-83f3-0dbec6f94980')
  .then(res => res.json())
  .then(data => {
    console.log('Widget Data:', data);
    if (data.error) {
      console.error('Error:', data.error);
    }
  })
  .catch(err => console.error('Fetch Error:', err));
```

**Expected result**: Should return widget configuration JSON.

**If you see "Widget not found or inactive"**:
- The widget is not active in the database (fix with Step 1)

**If you see "Internal server error" or "Database error"**:
- Edge Functions don't have `SUPABASE_SERVICE_ROLE_KEY` set (fix with Step 2)

**If you see CORS error**:
- Already handled in the function, but check browser console for details

### Step 4: Fix the Embed Script URL (Double Slash)

The embed script URL should be:

```html
<script src="https://superbasevpop.vibecodingfield.com/functions/v1/embed-script?id=0d8c3bf6-e9d8-4b12-83f3-0dbec6f94980" async></script>
```

**Remove the double slash** `//` → `/`

### Step 5: Check Browser Console in Incognito

1. Open incognito window
2. Add the embed script to a test page
3. Open browser DevTools → Console
4. Look for errors:
   - `VideoPopup error:` - Means the get-widget call failed
   - `Failed to fetch` - Network/CORS issue
   - No errors but no widget - Check if `config.error` exists (will be silent)

### Step 6: Enable Debug Logging (Temporary)

To see what's happening, you can temporarily add console.log to the embed script. But first, let's check if the Edge Function logs show any errors.

## Check Edge Function Logs in Coolify

1. Go to **Coolify** → Your **Supabase Resource**
2. Navigate to **Edge Functions** or **Logs**
3. Check logs for `get-widget` function
4. Look for:
   - `Database error:` - Indicates RLS or connection issue
   - `Widget not found or inactive` - Widget status issue
   - Missing environment variable errors

## Quick Test Page

Create a simple HTML file to test:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Widget Test</title>
</head>
<body>
  <h1>Widget Test Page</h1>
  <p>Check console for errors</p>
  
  <!-- Fix: Remove double slash -->
  <script src="https://superbasevpop.vibecodingfield.com/functions/v1/embed-script?id=0d8c3bf6-e9d8-4b12-83f3-0dbec6f94980" async></script>
  
  <script>
    // Add this to see what's happening
    setTimeout(() => {
      const widget = document.getElementById('videopopup-widget');
      if (!widget) {
        console.error('Widget not found on page!');
        // Test get-widget directly
        fetch('https://superbasevpop.vibecodingfield.com/functions/v1/get-widget?id=0d8c3bf6-e9d8-4b12-83f3-0dbec6f94980')
          .then(res => res.json())
          .then(data => console.log('Direct API call result:', data))
          .catch(err => console.error('Direct API call error:', err));
      } else {
        console.log('Widget found!', widget);
      }
    }, 5000);
  </script>
</body>
</html>
```

## Most Likely Fix

Based on your description, the most likely issue is:

1. **Widget is not actually active** - Check Step 1 (SQL query)
2. **Edge Functions missing SERVICE_ROLE_KEY** - Check Step 2 (Coolify environment variables)

The fact that it works in the same tab (when logged in) suggests the widget exists, but the Edge Function can't access it without the service role key when called from an anonymous context (incognito).

## After Fixing

Once fixed, the widget should:
- Load in incognito mode
- Show the video popup
- Track analytics properly
- Work on any external site where the script is embedded


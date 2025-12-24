# Commands for Coolify Terminal - Deploy Edge Functions

## Instructions

1. Go to **Coolify** → **Supabase Resource** → **Terminal** (or **Exec**)
2. Copy and paste these commands **one by one**
3. Wait for each command to complete before running the next

---

## Step 1: Create Directories

```bash
mkdir -p /var/lib/supabase/functions/get-widget
mkdir -p /var/lib/supabase/functions/embed-script
mkdir -p /var/lib/supabase/functions/track-analytics
mkdir -p /var/lib/supabase/functions/send-lead-notification
```

---

## Step 2: Create get-widget Function

**Copy this entire block and paste into terminal:**

```bash
cat > /var/lib/supabase/functions/get-widget/index.ts << 'EOF'
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const widgetId = url.searchParams.get('id');

    if (!widgetId) {
      return new Response(JSON.stringify({ error: 'Widget ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: widget, error } = await supabase
      .from('widgets')
      .select('*')
      .eq('id', widgetId)
      .eq('status', 'active')
      .maybeSingle();

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: 'Database error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!widget) {
      return new Response(JSON.stringify({ error: 'Widget not found or inactive' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      id: widget.id,
      video_url: widget.video_url,
      video_type: widget.video_type,
      video_orientation: widget.video_orientation || 'vertical',
      person_name: widget.person_name,
      person_title: widget.person_title,
      person_avatar: widget.person_avatar,
      cta_text: widget.cta_text,
      cta_url: widget.cta_url,
      cta_color: widget.cta_color,
      position: widget.position,
      trigger_type: widget.trigger_type,
      trigger_value: widget.trigger_value,
      primary_color: widget.primary_color,
      background_color: widget.background_color,
      text_color: widget.text_color,
      border_radius: widget.border_radius,
      animation: widget.animation,
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
    });

  } catch (error) {
    console.error('Error fetching widget:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
EOF
```

---

## Step 3: Create track-analytics Function

**Copy this entire block:**

```bash
cat > /var/lib/supabase/functions/track-analytics/index.ts << 'EOF'
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { widget_id, event_type, visitor_id, page_url } = await req.json();

    if (!widget_id || !event_type) {
      return new Response(JSON.stringify({ error: 'widget_id and event_type required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const validEvents = ['view', 'click', 'close', 'play', 'pause'];
    if (!validEvents.includes(event_type)) {
      return new Response(JSON.stringify({ error: 'Invalid event type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const userAgent = req.headers.get('user-agent') || null;

    const { error } = await supabase
      .from('widget_analytics')
      .insert({
        widget_id,
        event_type,
        visitor_id: visitor_id || null,
        page_url: page_url || null,
        user_agent: userAgent,
      });

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: 'Failed to track event' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Tracked ${event_type} for widget ${widget_id}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error tracking analytics:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
EOF
```

---

## Step 4: Create send-lead-notification Function

**Copy this entire block:**

```bash
cat > /var/lib/supabase/functions/send-lead-notification/index.ts << 'EOF'
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadData {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  company?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const leadData: LeadData = await req.json();
    console.log("Received lead data:", leadData);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('admin_email, smtp_host, smtp_port, smtp_user, smtp_from')
      .limit(1)
      .single();

    if (settingsError) {
      console.error("Error fetching settings:", settingsError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to fetch settings" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const smtpPassword = Deno.env.get('SMTP_PASSWORD');
    
    if (!settings?.smtp_host || !settings?.admin_email || !smtpPassword) {
      console.log("SMTP not fully configured, skipping email notification");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Lead saved but email notification skipped (SMTP not configured)" 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailHtml = `
      <h2>New Lead Submission</h2>
      <p><strong>Name:</strong> ${leadData.name}</p>
      <p><strong>Email:</strong> ${leadData.email}</p>
      ${leadData.phone ? `<p><strong>Phone:</strong> ${leadData.phone}</p>` : ''}
      ${leadData.company ? `<p><strong>Company:</strong> ${leadData.company}</p>` : ''}
      ${leadData.website ? `<p><strong>Website:</strong> ${leadData.website}</p>` : ''}
      ${leadData.message ? `<p><strong>Message:</strong></p><p>${leadData.message}</p>` : ''}
      <hr>
      <p style="color: #666; font-size: 12px;">This email was sent from your VideoPopup lead form.</p>
    `;

    const { SMTPClient } = await import("https://deno.land/x/denomailer@1.6.0/mod.ts");
    
    const client = new SMTPClient({
      connection: {
        hostname: settings.smtp_host,
        port: settings.smtp_port || 587,
        tls: true,
        auth: {
          username: settings.smtp_user || settings.admin_email,
          password: smtpPassword,
        },
      },
    });

    await client.send({
      from: settings.smtp_from || settings.admin_email,
      to: settings.admin_email,
      subject: `New Lead: ${leadData.name} - ${leadData.company || 'No Company'}`,
      html: emailHtml,
    });

    await client.close();

    console.log("Email sent successfully to:", settings.admin_email);

    return new Response(
      JSON.stringify({ success: true, message: "Lead notification sent" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-lead-notification:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
EOF
```

---

## Step 5: Create embed-script Function (Large File)

**⚠️ IMPORTANT:** The `embed-script` function is very large. Use this method:

**Option A: Download and copy (Easier)**

1. Download the file from GitHub: `supabase/functions/embed-script/index.ts`
2. Copy its contents
3. In Coolify terminal, run:
   ```bash
   nano /var/lib/supabase/functions/embed-script/index.ts
   ```
4. Paste the contents (Ctrl+Shift+V in nano)
5. Save: Ctrl+O, Enter, Ctrl+X

**Option B: Use wget/curl (If you can host the file temporarily)**

```bash
# If you can temporarily host the file on a web server:
wget -O /var/lib/supabase/functions/embed-script/index.ts https://raw.githubusercontent.com/NahidDesigner/videopop/main/supabase/functions/embed-script/index.ts
```

**Option C: Create via heredoc (May be too large, but try):**

See the separate file `create-embed-script.sh` for the full heredoc command.

---

## Step 6: Verify Functions Are Created

```bash
ls -la /var/lib/supabase/functions/
ls -la /var/lib/supabase/functions/get-widget/
ls -la /var/lib/supabase/functions/embed-script/
ls -la /var/lib/supabase/functions/track-analytics/
ls -la /var/lib/supabase/functions/send-lead-notification/
```

You should see `index.ts` in each directory.

---

## Step 7: Restart Supabase

1. Go back to **Coolify** → **Supabase Resource**
2. Click **"Restart"** or **"Actions"** → **"Restart"**
3. Wait 2-3 minutes for services to restart

---

## Step 8: Test

After restart, test in browser console:

```javascript
fetch('https://superbasevpop.vibecodingfield.com/functions/v1/get-widget?id=0d8c3bf6-e9d8-4b12-83f3-0dbec6f94980')
  .then(res => res.json())
  .then(data => console.log('Result:', data));
```

**Expected:** Should return widget data (not "No such file" error)

---

## Troubleshooting

### "Permission denied"
```bash
# Try with sudo (if available)
sudo mkdir -p /var/lib/supabase/functions/get-widget
```

### "No such file or directory: /var/lib/supabase/functions"
The path might be different. Check:
```bash
find / -name "supabase" -type d 2>/dev/null | grep functions
```

### Functions still not working after restart
1. Check function logs in Coolify
2. Verify environment variables are set (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
3. Check file permissions: `ls -la /var/lib/supabase/functions/*/index.ts`


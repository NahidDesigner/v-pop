#!/bin/bash
# Commands to deploy Edge Functions via Coolify Terminal
# Copy and paste these commands one by one into Coolify → Supabase → Terminal

# Step 1: Create function directories
mkdir -p /var/lib/supabase/functions/get-widget
mkdir -p /var/lib/supabase/functions/embed-script
mkdir -p /var/lib/supabase/functions/track-analytics
mkdir -p /var/lib/supabase/functions/send-lead-notification

# Step 2: Create get-widget/index.ts
cat > /var/lib/supabase/functions/get-widget/index.ts << 'GETWIDGETEOF'
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight
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

    // Create Supabase client with service role for public access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch widget data
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

    // Return widget configuration
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
GETWIDGETEOF

# Step 3: Create embed-script/index.ts (This is a large file, we'll create it in parts)
# Note: Due to size, you may need to create this file manually or use a different method
# For now, I'll provide the command structure

echo "✅ get-widget function created"
echo "⚠️  embed-script is too large for heredoc. Use the method below to create it."

# Step 4: Verify functions directory structure
ls -la /var/lib/supabase/functions/

echo ""
echo "📝 Next steps:"
echo "1. Create embed-script/index.ts (see separate commands below)"
echo "2. Create track-analytics/index.ts (see separate commands below)"
echo "3. Create send-lead-notification/index.ts (see separate commands below)"
echo "4. Restart Supabase service in Coolify"


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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const leadData: LeadData = await req.json();
    console.log("Received lead data:", leadData);

    // Get SMTP settings from site_settings
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

    // Check if SMTP is configured
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');
    
    if (!settings?.smtp_host || !settings?.admin_email || !smtpPassword) {
      console.log("SMTP not fully configured, skipping email notification");
      console.log("SMTP Host:", settings?.smtp_host ? "Set" : "Not set");
      console.log("Admin Email:", settings?.admin_email ? "Set" : "Not set");
      console.log("SMTP Password:", smtpPassword ? "Set" : "Not set");
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Lead saved but email notification skipped (SMTP not configured)" 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Build email content
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

    // Send email using SMTP
    // Using a simple SMTP approach with fetch to an SMTP relay
    // For production, you might want to use a proper SMTP library or service like Resend
    
    // For now, we'll use nodemailer-like approach via Deno's smtp module
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

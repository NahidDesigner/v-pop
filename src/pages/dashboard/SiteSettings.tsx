import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Video, Mail, Globe, CreditCard, Image, Webhook } from "lucide-react";

interface SiteSettings {
  id: string;
  branding_text: string;
  branding_url: string;
  pricing_enabled: boolean;
  price_amount: number;
  price_currency: string;
  hero_title: string;
  hero_subtitle: string;
  demo_video_url: string | null;
  admin_email: string | null;
  smtp_host: string | null;
  smtp_port: number | null;
  smtp_user: string | null;
  smtp_from: string | null;
  logo_url: string | null;
  webhook_url: string | null;
}

export default function SiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } else {
      setSettings(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);

    const { error } = await supabase
      .from("site_settings")
      .update({
        branding_text: settings.branding_text,
        branding_url: settings.branding_url,
        pricing_enabled: settings.pricing_enabled,
        price_amount: settings.price_amount,
        price_currency: settings.price_currency,
        hero_title: settings.hero_title,
        hero_subtitle: settings.hero_subtitle,
        demo_video_url: settings.demo_video_url,
        admin_email: settings.admin_email,
        smtp_host: settings.smtp_host,
        smtp_port: settings.smtp_port,
        smtp_user: settings.smtp_user,
        logo_url: settings.logo_url,
        webhook_url: settings.webhook_url,
        smtp_from: settings.smtp_from,
      })
      .eq("id", settings.id);

    if (error) {
      toast.error("Failed to save settings");
    } else {
      toast.success("Settings saved successfully");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">No settings found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground">Manage your public website and widget branding</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Logo & Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Logo & Branding
            </CardTitle>
            <CardDescription>
              Your logo and branding text that appears on widgets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                value={settings.logo_url || ""}
                onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                placeholder="https://yourwebsite.com/logo.png"
              />
              <p className="text-sm text-muted-foreground">
                Your logo displayed in the dashboard and widgets
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="branding_text">Branding Text</Label>
              <Input
                id="branding_text"
                value={settings.branding_text}
                onChange={(e) => setSettings({ ...settings, branding_text: e.target.value })}
                placeholder="Powered by Video Popup"
              />
              <p className="text-sm text-muted-foreground">
                This text appears at the bottom of every widget
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="branding_url">Branding URL</Label>
              <Input
                id="branding_url"
                value={settings.branding_url}
                onChange={(e) => setSettings({ ...settings, branding_url: e.target.value })}
                placeholder="https://yourwebsite.com"
              />
              <p className="text-sm text-muted-foreground">
                Visitors clicking the branding will go to this URL
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Homepage Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Homepage Content
            </CardTitle>
            <CardDescription>
              Customize the public homepage hero section and demo video
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero_title">Hero Title</Label>
              <Input
                id="hero_title"
                value={settings.hero_title}
                onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                placeholder="Video Popups That Convert"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
              <Textarea
                id="hero_subtitle"
                value={settings.hero_subtitle}
                onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                placeholder="Engage your visitors..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo_video_url">Demo Video URL</Label>
              <Input
                id="demo_video_url"
                value={settings.demo_video_url || ""}
                onChange={(e) => setSettings({ ...settings, demo_video_url: e.target.value })}
                placeholder="https://vimeo.com/123456789"
              />
              <p className="text-sm text-muted-foreground">
                Vimeo or YouTube URL for the homepage demo section. Leave empty to hide.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Pricing Settings
            </CardTitle>
            <CardDescription>
              Configure pricing display and payment options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Online Payments</Label>
                <p className="text-sm text-muted-foreground">
                  Show "Subscribe Now" button instead of "Contact Us"
                </p>
              </div>
              <Switch
                checked={settings.pricing_enabled}
                onCheckedChange={(checked) => setSettings({ ...settings, pricing_enabled: checked })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_amount">Price (in cents)</Label>
                <Input
                  id="price_amount"
                  type="number"
                  value={settings.price_amount}
                  onChange={(e) => setSettings({ ...settings, price_amount: parseInt(e.target.value) || 0 })}
                  placeholder="1000"
                />
                <p className="text-sm text-muted-foreground">
                  1000 = $10.00
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_currency">Currency</Label>
                <Input
                  id="price_currency"
                  value={settings.price_currency}
                  onChange={(e) => setSettings({ ...settings, price_currency: e.target.value.toUpperCase() })}
                  placeholder="USD"
                  maxLength={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Notifications (SMTP)
            </CardTitle>
            <CardDescription>
              Configure SMTP settings to receive email notifications when leads submit the contact form.
              The SMTP password should be set as an environment secret named <code className="bg-muted px-1 rounded">SMTP_PASSWORD</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin_email">Admin Email (Recipient)</Label>
              <Input
                id="admin_email"
                type="email"
                value={settings.admin_email || ""}
                onChange={(e) => setSettings({ ...settings, admin_email: e.target.value })}
                placeholder="admin@yourdomain.com"
              />
              <p className="text-sm text-muted-foreground">
                Lead notifications will be sent to this email address
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp_host">SMTP Host</Label>
                <Input
                  id="smtp_host"
                  value={settings.smtp_host || ""}
                  onChange={(e) => setSettings({ ...settings, smtp_host: e.target.value })}
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp_port">SMTP Port</Label>
                <Input
                  id="smtp_port"
                  type="number"
                  value={settings.smtp_port || 587}
                  onChange={(e) => setSettings({ ...settings, smtp_port: parseInt(e.target.value) || 587 })}
                  placeholder="587"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp_user">SMTP Username</Label>
                <Input
                  id="smtp_user"
                  value={settings.smtp_user || ""}
                  onChange={(e) => setSettings({ ...settings, smtp_user: e.target.value })}
                  placeholder="your-email@gmail.com"
                />
                <p className="text-sm text-muted-foreground">
                  Usually your email address
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp_from">From Address</Label>
                <Input
                  id="smtp_from"
                  type="email"
                  value={settings.smtp_from || ""}
                  onChange={(e) => setSettings({ ...settings, smtp_from: e.target.value })}
                  placeholder="noreply@yourdomain.com"
                />
                <p className="text-sm text-muted-foreground">
                  Optional, defaults to admin email
                </p>
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> After configuring these settings, add your SMTP password as a secret. 
                Email notifications will only work once all fields are configured and the password is set.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Webhook Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Webhook Integration
            </CardTitle>
            <CardDescription>
              Send form submissions to an external URL for integrations with Zapier, Make, or your own systems
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook_url">Webhook URL</Label>
              <Input
                id="webhook_url"
                type="url"
                value={settings.webhook_url || ""}
                onChange={(e) => setSettings({ ...settings, webhook_url: e.target.value })}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
              />
              <p className="text-sm text-muted-foreground">
                When a form is submitted, a POST request with the lead data will be sent to this URL
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm text-muted-foreground">
                <strong>Tip:</strong> Use webhooks to connect with CRMs, email marketing tools, or any automation platform.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

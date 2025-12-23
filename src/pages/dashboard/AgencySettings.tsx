import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Building2, Mail, Webhook, Image } from "lucide-react";

interface AgencySettings {
  id: string;
  agency_name: string;
  logo_url: string | null;
  branding_text: string | null;
  branding_url: string | null;
  notification_email: string | null;
  webhook_url: string | null;
  widget_limit: number;
  widgets_used: number;
}

export default function AgencySettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AgencySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [user]);

  const fetchSettings = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("agency_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching agency settings:", error);
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
      .from("agency_settings")
      .update({
        logo_url: settings.logo_url,
        branding_text: settings.branding_text,
        branding_url: settings.branding_url,
        notification_email: settings.notification_email,
        webhook_url: settings.webhook_url,
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
        <p className="text-muted-foreground">No agency settings found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Agency Settings</h1>
          <p className="text-muted-foreground">Manage your agency branding and notification settings</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Agency Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Agency Information
            </CardTitle>
            <CardDescription>
              Your agency name and usage limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Agency Name</Label>
              <Input
                value={settings.agency_name}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                Contact admin to change your agency name
              </p>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Widget Usage</p>
                <p className="text-sm text-muted-foreground">
                  You've used {settings.widgets_used} of {settings.widget_limit} widgets
                </p>
              </div>
              <div className="text-2xl font-bold text-primary">
                {settings.widgets_used} / {settings.widget_limit}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logo & Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Logo & Branding
            </CardTitle>
            <CardDescription>
              Customize how your widgets appear to visitors
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
                Your logo displayed on widgets
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="branding_text">Branding Text</Label>
              <Input
                id="branding_text"
                value={settings.branding_text || ""}
                onChange={(e) => setSettings({ ...settings, branding_text: e.target.value })}
                placeholder="Powered by Your Agency"
              />
              <p className="text-sm text-muted-foreground">
                This text appears at the bottom of your widgets
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="branding_url">Branding URL</Label>
              <Input
                id="branding_url"
                value={settings.branding_url || ""}
                onChange={(e) => setSettings({ ...settings, branding_url: e.target.value })}
                placeholder="https://yourwebsite.com"
              />
              <p className="text-sm text-muted-foreground">
                Visitors clicking the branding will go to this URL
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Notification Email
            </CardTitle>
            <CardDescription>
              Receive form submissions at this email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notification_email">Email Address</Label>
              <Input
                id="notification_email"
                type="email"
                value={settings.notification_email || ""}
                onChange={(e) => setSettings({ ...settings, notification_email: e.target.value })}
                placeholder="leads@youragency.com"
              />
              <p className="text-sm text-muted-foreground">
                When someone submits a form on your widget, you'll receive a notification here
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
              Send form submissions to your CRM or automation tools
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
                <strong>Tip:</strong> Connect with Zapier, Make, or any webhook-compatible platform to automatically add leads to your CRM.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
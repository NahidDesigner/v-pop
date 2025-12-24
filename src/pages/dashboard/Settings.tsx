import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, CreditCard, User } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and billing</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <CardTitle className="font-display">Account</CardTitle>
          </div>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Account ID</p>
            <p className="font-mono text-sm">{user?.id}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <CardTitle className="font-display">Billing</CardTitle>
          </div>
          <CardDescription>Manage your subscription and payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Pricing</p>
              <p className="text-sm text-muted-foreground">$10 per widget per month</p>
            </div>
            <Badge variant="secondary">VideoPopup</Badge>
          </div>
          <Separator />
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              Stripe integration for billing will be set up when you create your first widget.
              Each widget is billed at $10/month.
            </p>
            <Button variant="outline" disabled>
              <ExternalLink className="w-4 h-4 mr-2" />
              Manage Billing (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">Embed Code</CardTitle>
          <CardDescription>How to add VideoPopup widgets to your clients' sites</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            After creating a widget, you'll get an embed code that looks like this:
          </p>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto break-all whitespace-pre-wrap">
            <code>{`<script src="${import.meta.env.VITE_SUPABASE_URL}/functions/v1/embed-script?id=[widget-id]" async></script>`}</code>
          </pre>
          <p className="text-sm text-muted-foreground">
            Simply copy this code and paste it into your client's website, 
            just before the closing <code className="bg-muted px-1 rounded">&lt;/body&gt;</code> tag.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

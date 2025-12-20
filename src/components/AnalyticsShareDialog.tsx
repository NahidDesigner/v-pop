import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, Link, Lock, Eye, EyeOff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AnalyticsShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widgetId: string;
  widgetName: string;
  analyticsToken: string | null;
  analyticsPassword: string | null;
  onUpdate: () => void;
}

export function AnalyticsShareDialog({
  open,
  onOpenChange,
  widgetId,
  widgetName,
  analyticsToken,
  analyticsPassword,
  onUpdate,
}: AnalyticsShareDialogProps) {
  const [password, setPassword] = useState(analyticsPassword || '');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const analyticsUrl = analyticsToken 
    ? `${window.location.origin}/analytics/${analyticsToken}`
    : '';

  const copyLink = () => {
    navigator.clipboard.writeText(analyticsUrl);
    toast({ title: 'Copied!', description: 'Analytics link copied to clipboard.' });
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('widgets')
      .update({ analytics_password: password || null })
      .eq('id', widgetId);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update password.' });
    } else {
      toast({ title: 'Saved!', description: password ? 'Password protection enabled.' : 'Password protection disabled.' });
      onUpdate();
    }
    setSaving(false);
  };

  const regenerateToken = async () => {
    setSaving(true);
    // Generate a new token by updating with a random value
    const newToken = crypto.randomUUID().replace(/-/g, '').slice(0, 32);
    const { error } = await supabase
      .from('widgets')
      .update({ analytics_token: newToken })
      .eq('id', widgetId);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to regenerate link.' });
    } else {
      toast({ title: 'Done!', description: 'New analytics link generated.' });
      onUpdate();
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Link className="w-5 h-5 text-primary" />
            Share Analytics
          </DialogTitle>
          <DialogDescription>
            Share this link with your client to let them view analytics for "{widgetName}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Analytics Link</Label>
            <div className="flex gap-2">
              <Input 
                value={analyticsUrl} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button variant="outline" size="icon" onClick={copyLink}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={regenerateToken}>
              Regenerate link
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password Protection
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave empty for no password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {password ? 'Clients will need to enter this password to view analytics.' : 'Anyone with the link can view analytics.'}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gradient-primary">
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
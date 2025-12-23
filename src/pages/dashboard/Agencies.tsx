import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Plus, Building2, Settings, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AgencySettings {
  id: string;
  user_id: string;
  agency_name: string;
  logo_url: string | null;
  branding_text: string | null;
  branding_url: string | null;
  widget_limit: number;
  widgets_used: number;
  custom_domain: string | null;
  created_at: string;
  user_email?: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
}

export default function Agencies() {
  const [agencies, setAgencies] = useState<AgencySettings[]>([]);
  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState<AgencySettings | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agencyToDelete, setAgencyToDelete] = useState<AgencySettings | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    user_id: '',
    agency_name: '',
    widget_limit: 5,
    branding_text: 'Powered by Agency',
    branding_url: '',
    logo_url: '',
    custom_domain: '',
    notification_email: '',
    webhook_url: '',
  });

  const fetchAgencies = async () => {
    // Fetch agencies
    const { data: agencyData, error } = await supabase
      .from('agency_settings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching agencies:', error);
      setAgencies([]);
      setLoading(false);
      return;
    }

    // Fetch profiles for all agency user_ids
    const userIds = (agencyData || []).map(a => a.user_id);
    if (userIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);

      const profileMap = new Map((profilesData || []).map(p => [p.id, p.email]));
      
      const agenciesWithEmail = (agencyData || []).map(agency => ({
        ...agency,
        user_email: profileMap.get(agency.user_id) || 'Unknown',
      }));
      setAgencies(agenciesWithEmail);
    } else {
      setAgencies([]);
    }
    setLoading(false);
  };

  const fetchAvailableUsers = async () => {
    // Fetch all users who are not already agencies
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .order('email');

    const { data: existingAgencies } = await supabase
      .from('agency_settings')
      .select('user_id');

    const existingUserIds = new Set((existingAgencies || []).map(a => a.user_id));
    
    const available = (allProfiles || []).filter(
      (p): p is UserProfile => p.email !== null && !existingUserIds.has(p.id)
    );
    
    setAvailableUsers(available);
  };

  useEffect(() => {
    fetchAgencies();
    fetchAvailableUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (editingAgency) {
      // Update existing agency
      const { error } = await supabase
        .from('agency_settings')
        .update({
          agency_name: formData.agency_name,
          widget_limit: formData.widget_limit,
          branding_text: formData.branding_text || null,
          branding_url: formData.branding_url || null,
          logo_url: formData.logo_url || null,
          custom_domain: formData.custom_domain || null,
          notification_email: formData.notification_email || null,
          webhook_url: formData.webhook_url || null,
        })
        .eq('id', editingAgency.id);

      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update agency.' });
      } else {
        toast({ title: 'Updated!', description: 'Agency settings updated.' });
        setDialogOpen(false);
        fetchAgencies();
      }
    } else {
      // Create new agency
      if (!formData.user_id) {
        toast({ 
          variant: 'destructive', 
          title: 'Select a user', 
          description: 'Please select a user from the dropdown.' 
        });
        setSaving(false);
        return;
      }

      // Add agency role to user
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({ user_id: formData.user_id, role: 'agency' });

      if (roleError) {
        console.error('Role error:', roleError);
      }

      // Create agency settings
      const { error } = await supabase
        .from('agency_settings')
        .insert({
          user_id: formData.user_id,
          agency_name: formData.agency_name,
          widget_limit: formData.widget_limit,
          branding_text: formData.branding_text || null,
          branding_url: formData.branding_url || null,
          logo_url: formData.logo_url || null,
          custom_domain: formData.custom_domain || null,
          notification_email: formData.notification_email || null,
          webhook_url: formData.webhook_url || null,
        });

      if (error) {
        toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to create agency.' });
      } else {
        toast({ title: 'Created!', description: 'Agency account created successfully.' });
        setDialogOpen(false);
        fetchAgencies();
        fetchAvailableUsers();
      }
    }

    setSaving(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      user_id: '',
      agency_name: '',
      widget_limit: 5,
      branding_text: 'Powered by Agency',
      branding_url: '',
      logo_url: '',
      custom_domain: '',
      notification_email: '',
      webhook_url: '',
    });
    setEditingAgency(null);
  };

  const openEditDialog = (agency: AgencySettings) => {
    setEditingAgency(agency);
    setFormData({
      user_id: agency.user_id,
      agency_name: agency.agency_name,
      widget_limit: agency.widget_limit,
      branding_text: agency.branding_text || 'Powered by Agency',
      branding_url: agency.branding_url || '',
      logo_url: agency.logo_url || '',
      custom_domain: agency.custom_domain || '',
      notification_email: (agency as any).notification_email || '',
      webhook_url: (agency as any).webhook_url || '',
    });
    setDialogOpen(true);
  };

  const deleteAgency = async () => {
    if (!agencyToDelete) return;

    // Remove agency role from user
    await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', agencyToDelete.user_id)
      .eq('role', 'agency');

    const { error } = await supabase
      .from('agency_settings')
      .delete()
      .eq('id', agencyToDelete.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete agency.' });
    } else {
      toast({ title: 'Deleted!', description: 'Agency has been deleted.' });
      fetchAgencies();
      fetchAvailableUsers();
    }
    setDeleteDialogOpen(false);
    setAgencyToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Agency Accounts</h1>
          <p className="text-muted-foreground mt-1">Manage agency accounts and their widget limits</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Agency
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">{editingAgency ? 'Edit Agency' : 'Add Agency Account'}</DialogTitle>
              <DialogDescription>
                {editingAgency ? 'Update agency settings and limits.' : 'Create a new agency account. The user must have signed up first.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingAgency && (
                <div className="space-y-2">
                  <Label htmlFor="user_id">Select User *</Label>
                  <Select
                    value={formData.user_id}
                    onValueChange={(value) => setFormData({ ...formData, user_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUsers.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          No available users. All users are already agencies.
                        </div>
                      ) : (
                        availableUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.email} {user.full_name ? `(${user.full_name})` : ''}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Only users who have signed up are shown.</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="agency_name">Agency Name *</Label>
                <Input
                  id="agency_name"
                  value={formData.agency_name}
                  onChange={(e) => setFormData({ ...formData, agency_name: e.target.value })}
                  placeholder="Acme Marketing"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="widget_limit">Widget Limit</Label>
                <Input
                  id="widget_limit"
                  type="number"
                  min="1"
                  value={formData.widget_limit}
                  onChange={(e) => setFormData({ ...formData, widget_limit: parseInt(e.target.value) || 5 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branding_text">Branding Text</Label>
                <Input
                  id="branding_text"
                  value={formData.branding_text}
                  onChange={(e) => setFormData({ ...formData, branding_text: e.target.value })}
                  placeholder="Powered by Agency"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notification_email">Notification Email</Label>
                <Input
                  id="notification_email"
                  type="email"
                  value={formData.notification_email}
                  onChange={(e) => setFormData({ ...formData, notification_email: e.target.value })}
                  placeholder="leads@agency.com"
                />
                <p className="text-xs text-muted-foreground">Form submissions will be sent here</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook_url">Webhook URL</Label>
                <Input
                  id="webhook_url"
                  type="url"
                  value={formData.webhook_url}
                  onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
                  placeholder="https://hooks.zapier.com/..."
                />
                <p className="text-xs text-muted-foreground">POST form data to this URL</p>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving} className="gradient-primary">
                  {saving ? 'Saving...' : editingAgency ? 'Update Agency' : 'Create Agency'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : agencies.length === 0 ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-display font-semibold mb-2">No agencies yet</h3>
            <p className="text-muted-foreground mb-4">Create your first agency account to allow resellers.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agencies.map((agency) => (
            <Card key={agency.id} className="group">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1">
                  <CardTitle className="font-display text-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    {agency.agency_name}
                  </CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(agency)}>
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive"
                    onClick={() => { setAgencyToDelete(agency); setDeleteDialogOpen(true); }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">Email:</span> {agency.user_email}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Widgets Used</span>
                  <Badge variant={agency.widgets_used >= agency.widget_limit ? 'destructive' : 'secondary'}>
                    {agency.widgets_used} / {agency.widget_limit}
                  </Badge>
                </div>
                {agency.branding_text && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Branding:</span> {agency.branding_text}
                  </div>
                )}
                {agency.custom_domain && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Domain:</span> {agency.custom_domain}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  Created {new Date(agency.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Agency</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{agencyToDelete?.agency_name}"? This will remove the agency account but keep their widgets.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteAgency} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
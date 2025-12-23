import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Widget, Client } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, 
  MoreVertical, 
  Copy, 
  Edit, 
  Trash2, 
  Play,
  Pause,
  ExternalLink,
  Share2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { AnalyticsShareDialog } from '@/components/AnalyticsShareDialog';
import { useToast } from '@/hooks/use-toast';

interface WidgetWithClient extends Widget {
  clients: Client | null;
  analytics_token?: string | null;
  analytics_password?: string | null;
}

export default function WidgetsList() {
  const [widgets, setWidgets] = useState<WidgetWithClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [widgetToDelete, setWidgetToDelete] = useState<Widget | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [widgetToShare, setWidgetToShare] = useState<WidgetWithClient | null>(null);
  const { toast } = useToast();

  const fetchWidgets = async () => {
    const { data, error } = await supabase
      .from('widgets')
      .select('*, clients(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching widgets:', error);
    } else {
      setWidgets(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWidgets();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      active: { variant: 'default', label: 'Active' },
      paused: { variant: 'secondary', label: 'Paused' },
      draft: { variant: 'outline', label: 'Draft' },
    };
    const config = variants[status] || variants.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const copyEmbedCode = (widget: Widget) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const embedCode = `<script src="${supabaseUrl}/functions/v1/embed-script?id=${widget.id}" async></script>`;
    navigator.clipboard.writeText(embedCode);
    toast({
      title: 'Copied!',
      description: 'Embed code copied to clipboard.',
    });
  };

  const toggleWidgetStatus = async (widget: Widget) => {
    const newStatus = widget.status === 'active' ? 'paused' : 'active';
    const { error } = await supabase
      .from('widgets')
      .update({ status: newStatus })
      .eq('id', widget.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update widget status.',
      });
    } else {
      toast({
        title: 'Updated!',
        description: `Widget is now ${newStatus}.`,
      });
      fetchWidgets();
    }
  };

  const deleteWidget = async () => {
    if (!widgetToDelete) return;
    
    const { error } = await supabase
      .from('widgets')
      .delete()
      .eq('id', widgetToDelete.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete widget.',
      });
    } else {
      toast({
        title: 'Deleted!',
        description: 'Widget has been deleted.',
      });
      fetchWidgets();
    }
    setDeleteDialogOpen(false);
    setWidgetToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Widgets</h1>
          <p className="text-muted-foreground mt-1">Manage your video widgets</p>
        </div>
        <Button asChild className="gradient-primary">
          <Link to="/dashboard/widgets/new">
            <Plus className="w-4 h-4 mr-2" />
            New Widget
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, i) => (
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
      ) : widgets.length === 0 ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-display font-semibold mb-2">No widgets yet</h3>
            <p className="text-muted-foreground mb-4">Create your first video widget to get started.</p>
            <Button asChild className="gradient-primary">
              <Link to="/dashboard/widgets/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Widget
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {widgets.map((widget) => (
            <Card key={widget.id} className="group animate-fade-in">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1">
                  <CardTitle className="font-display text-lg">{widget.name}</CardTitle>
                  {widget.clients && (
                    <p className="text-sm text-muted-foreground">{widget.clients.name}</p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/dashboard/widgets/${widget.id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => copyEmbedCode(widget)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Embed Code
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleWidgetStatus(widget)}>
                      {widget.status === 'active' ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setWidgetToShare(widget); setShareDialogOpen(true); }}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Analytics
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => {
                        setWidgetToDelete(widget);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  {getStatusBadge(widget.status)}
                  <span className="text-xs text-muted-foreground capitalize">{widget.video_type}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate mb-3">{widget.video_url}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => copyEmbedCode(widget)}>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy Code
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/dashboard/widgets/${widget.id}`}>
                      <Edit className="w-3 h-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Widget</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{widgetToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteWidget} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {widgetToShare && (
        <AnalyticsShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          widgetId={widgetToShare.id}
          widgetName={widgetToShare.name}
          analyticsToken={widgetToShare.analytics_token || null}
          analyticsPassword={widgetToShare.analytics_password || null}
          onUpdate={fetchWidgets}
        />
      )}
    </div>
  );
}

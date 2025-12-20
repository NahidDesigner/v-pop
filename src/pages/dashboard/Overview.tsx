import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Layers, 
  Users, 
  Eye, 
  MousePointer2, 
  Plus,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface DashboardStats {
  totalWidgets: number;
  activeWidgets: number;
  totalClients: number;
  totalViews: number;
  totalClicks: number;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [widgetsRes, clientsRes, analyticsRes] = await Promise.all([
          supabase.from('widgets').select('id, status'),
          supabase.from('clients').select('id'),
          supabase.from('widget_analytics').select('event_type'),
        ]);

        const widgets = widgetsRes.data || [];
        const clients = clientsRes.data || [];
        const analytics = analyticsRes.data || [];

        setStats({
          totalWidgets: widgets.length,
          activeWidgets: widgets.filter(w => w.status === 'active').length,
          totalClients: clients.length,
          totalViews: analytics.filter(a => a.event_type === 'view').length,
          totalClicks: analytics.filter(a => a.event_type === 'click').length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { 
      title: 'Total Widgets', 
      value: stats?.totalWidgets || 0, 
      icon: Layers,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      title: 'Active Widgets', 
      value: stats?.activeWidgets || 0, 
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    { 
      title: 'Clients', 
      value: stats?.totalClients || 0, 
      icon: Users,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    { 
      title: 'Total Views', 
      value: stats?.totalViews || 0, 
      icon: Eye,
      color: 'text-accent-foreground',
      bgColor: 'bg-accent'
    },
    { 
      title: 'CTA Clicks', 
      value: stats?.totalClicks || 0, 
      icon: MousePointer2,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's an overview of your widgets.</p>
        </div>
        <Button asChild className="gradient-primary">
          <Link to="/dashboard/widgets/new">
            <Plus className="w-4 h-4 mr-2" />
            New Widget
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {loading ? (
          Array(5).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          statCards.map((stat) => (
            <Card key={stat.title} className="animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-display font-bold">{stat.value.toLocaleString()}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/dashboard/widgets/new">
                <Plus className="w-4 h-4 mr-2" />
                Create a new widget
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/dashboard/clients">
                <Users className="w-4 h-4 mr-2" />
                Manage clients
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/dashboard/analytics">
                <TrendingUp className="w-4 h-4 mr-2" />
                View analytics
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <p className="font-medium text-foreground">Create a widget</p>
                <p className="text-sm text-muted-foreground">Configure your video, CTA, and styling</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <p className="font-medium text-foreground">Copy the embed code</p>
                <p className="text-sm text-muted-foreground">Get the script snippet for your client's site</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <p className="font-medium text-foreground">Track performance</p>
                <p className="text-sm text-muted-foreground">Monitor views, clicks, and conversions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

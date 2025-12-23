import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, MousePointer2, X, TrendingUp, Lock, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  views: number;
  clicks: number;
  closes: number;
  clickRate: number;
  dailyData: { date: string; views: number; clicks: number }[];
}

interface WidgetInfo {
  name: string;
  analytics_password: string | null;
}

export default function PublicAnalytics() {
  const { token } = useParams<{ token: string }>();
  const [widget, setWidget] = useState<WidgetInfo | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [widgetId, setWidgetId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWidget = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('widgets')
        .select('id, name, analytics_password')
        .eq('analytics_token', token)
        .maybeSingle();

      if (error || !data) {
        setWidget(null);
        setLoading(false);
        return;
      }

      setWidget(data);
      setWidgetId(data.id);
      
      // If no password set, auto-authenticate
      if (!data.analytics_password) {
        setAuthenticated(true);
      }
      
      setLoading(false);
    };

    fetchWidget();
  }, [token]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!authenticated || !widgetId) return;

      const { data: analyticsData } = await supabase
        .from('widget_analytics')
        .select('*')
        .eq('widget_id', widgetId);

      if (!analyticsData) {
        setAnalytics(null);
        return;
      }

      const views = analyticsData.filter(a => a.event_type === 'view').length;
      const clicks = analyticsData.filter(a => a.event_type === 'click').length;
      const closes = analyticsData.filter(a => a.event_type === 'close').length;

      const dateMap = new Map<string, { views: number; clicks: number }>();
      analyticsData.forEach(a => {
        const date = new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const existing = dateMap.get(date) || { views: 0, clicks: 0 };
        if (a.event_type === 'view') existing.views++;
        if (a.event_type === 'click') existing.clicks++;
        dateMap.set(date, existing);
      });

      const dailyData = Array.from(dateMap.entries())
        .map(([date, data]) => ({ date, ...data }))
        .slice(-14);

      setAnalytics({
        views,
        clicks,
        closes,
        clickRate: views > 0 ? Math.round((clicks / views) * 100) : 0,
        dailyData,
      });
    };

    fetchAnalytics();
  }, [authenticated, widgetId]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === widget?.analytics_password) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-4 md:grid-cols-4">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!widget) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-display font-bold mb-2">Widget Not Found</h2>
            <p className="text-muted-foreground">
              This analytics link is invalid or the widget has been deleted.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-display">Protected Analytics</CardTitle>
            <p className="text-muted-foreground text-sm mt-2">
              Enter the password to view analytics for "{widget.name}"
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoFocus
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <Button type="submit" className="w-full gradient-primary">
                View Analytics
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Views', value: analytics?.views || 0, icon: Eye, color: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'CTA Clicks', value: analytics?.clicks || 0, icon: MousePointer2, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { title: 'Closes', value: analytics?.closes || 0, icon: X, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
    { title: 'Click Rate', value: `${analytics?.clickRate || 0}%`, icon: TrendingUp, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">{widget.name}</h1>
            <p className="text-muted-foreground text-sm">Widget Analytics</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-display font-bold">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Views Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics?.dailyData.length ? (
                <ResponsiveContainer width="100%" height={256}>
                  <LineChart data={analytics.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No data yet
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display">Clicks Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics?.dailyData.length ? (
                <ResponsiveContainer width="100%" height={256}>
                  <BarChart data={analytics.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                    <YAxis className="text-xs fill-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="clicks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No data yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
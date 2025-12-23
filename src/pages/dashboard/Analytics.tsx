import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Widget, WidgetAnalytics } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, MousePointer2, X, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AnalyticsData {
  views: number;
  clicks: number;
  closes: number;
  clickRate: number;
  closeRate: number;
  dailyData: { date: string; views: number; clicks: number }[];
}

export default function Analytics() {
  const [widgets, setWidgets] = useState<{ id: string; name: string }[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<string>('all');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWidgets = async () => {
      const { data } = await supabase
        .from('widgets')
        .select('id, name')
        .order('name');
      setWidgets(data || []);
    };
    fetchWidgets();
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      
      let query = supabase.from('widget_analytics').select('*');
      if (selectedWidget !== 'all') {
        query = query.eq('widget_id', selectedWidget);
      }
      
      const { data: analyticsData } = await query;
      
      if (!analyticsData) {
        setAnalytics(null);
        setLoading(false);
        return;
      }

      const views = analyticsData.filter(a => a.event_type === 'view').length;
      const clicks = analyticsData.filter(a => a.event_type === 'click').length;
      const closes = analyticsData.filter(a => a.event_type === 'close').length;

      // Group by date for chart
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
        .slice(-7);

      setAnalytics({
        views,
        clicks,
        closes,
        clickRate: views > 0 ? Math.round((clicks / views) * 100) : 0,
        closeRate: views > 0 ? Math.round((closes / views) * 100) : 0,
        dailyData,
      });
      setLoading(false);
    };

    fetchAnalytics();
  }, [selectedWidget]);

  const statCards = [
    { title: 'Total Views', value: analytics?.views || 0, icon: Eye, color: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'CTA Clicks', value: analytics?.clicks || 0, icon: MousePointer2, color: 'text-success', bgColor: 'bg-success/10' },
    { title: 'Closes', value: analytics?.closes || 0, icon: X, color: 'text-warning', bgColor: 'bg-warning/10' },
    { title: 'Click Rate', value: `${analytics?.clickRate || 0}%`, icon: TrendingUp, color: 'text-accent-foreground', bgColor: 'bg-accent' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Track your widget performance</p>
        </div>
        <Select value={selectedWidget} onValueChange={setSelectedWidget}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Widgets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Widgets</SelectItem>
            {widgets.map((widget) => (
              <SelectItem key={widget.id} value={widget.id}>{widget.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
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
                <div className="text-2xl font-display font-bold">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Views Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : analytics?.dailyData.length ? (
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
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : analytics?.dailyData.length ? (
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
                  <Bar dataKey="clicks" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
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
  );
}

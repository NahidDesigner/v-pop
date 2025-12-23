import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  LayoutDashboard, 
  Layers, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Mail,
  Globe,
  Building2,
  Image,
  Quote
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', adminOnly: false, agencyOnly: false },
  { to: '/dashboard/widgets', icon: Layers, label: 'Widgets', adminOnly: false, agencyOnly: false },
  { to: '/dashboard/clients', icon: Users, label: 'Clients', adminOnly: true, agencyOnly: false },
  { to: '/dashboard/leads', icon: Mail, label: 'Leads', adminOnly: true, agencyOnly: false },
  { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics', adminOnly: false, agencyOnly: false },
  { to: '/dashboard/agencies', icon: Building2, label: 'Agencies', adminOnly: true, agencyOnly: false },
  { to: '/dashboard/samples', icon: Image, label: 'Samples', adminOnly: true, agencyOnly: false },
  { to: '/dashboard/testimonials', icon: Quote, label: 'Testimonials', adminOnly: true, agencyOnly: false },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings', adminOnly: false, agencyOnly: false },
  { to: '/dashboard/agency-settings', icon: Building2, label: 'Agency Settings', adminOnly: false, agencyOnly: true },
  { to: '/dashboard/site-settings', icon: Globe, label: 'Site Settings', adminOnly: true, agencyOnly: false },
];

export default function DashboardLayout() {
  const { user, signOut, isAdmin, isAgency } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => {
    // Admin sees everything except agency-only items
    if (isAdmin) return !item.agencyOnly;
    // Agency sees non-admin items and agency-only items
    if (isAgency) return !item.adminOnly || item.agencyOnly;
    // Regular users see items that are neither admin-only nor agency-only
    return !item.adminOnly && !item.agencyOnly;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Play className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-display font-bold text-foreground">VideoPopup</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-40 transform transition-transform duration-200 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center gap-2 px-6 border-b border-border">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Play className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-display font-bold text-foreground">VideoPopup</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import Auth from "@/pages/Auth";
import Home from "@/pages/Home";
import Overview from "@/pages/dashboard/Overview";
import Widgets from "@/pages/dashboard/Widgets";
import WidgetBuilder from "@/pages/dashboard/WidgetBuilder";
import Clients from "@/pages/dashboard/Clients";
import Analytics from "@/pages/dashboard/Analytics";
import Settings from "@/pages/dashboard/Settings";
import SiteSettings from "@/pages/dashboard/SiteSettings";
import AgencySettings from "@/pages/dashboard/AgencySettings";
import Leads from "@/pages/dashboard/Leads";
import Agencies from "@/pages/dashboard/Agencies";
import Samples from "@/pages/dashboard/Samples";
import Testimonials from "@/pages/dashboard/Testimonials";
import PublicAnalytics from "@/pages/PublicAnalytics";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent auto-reload when switching tabs
      refetchOnMount: false, // Prevent refetch on component mount
      refetchOnReconnect: true, // Only refetch when internet reconnects
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/analytics/:token" element={<PublicAnalytics />} />
            <Route path="/dashboard" element={
              <ProtectedRoute requireAdmin>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Overview />} />
              <Route path="widgets" element={<Widgets />} />
              <Route path="widgets/new" element={<WidgetBuilder />} />
              <Route path="widgets/:id" element={<WidgetBuilder />} />
              <Route path="clients" element={<Clients />} />
              <Route path="leads" element={<Leads />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="agencies" element={<Agencies />} />
              <Route path="samples" element={<Samples />} />
              <Route path="testimonials" element={<Testimonials />} />
              <Route path="settings" element={<Settings />} />
              <Route path="agency-settings" element={<AgencySettings />} />
              <Route path="site-settings" element={<SiteSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

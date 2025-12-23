import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Mail, Play, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin, isAgency, roleLoading, signOut } = useAuth();

  // Show loading while auth or roles are being checked
  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If admin access is required, check for admin or agency role
  if (requireAdmin) {
    // Admin has full access
    if (isAdmin) {
      return <>{children}</>;
    }
    
    // Agency has dashboard access
    if (isAgency) {
      return <>{children}</>;
    }
    
    // User is logged in but has no admin/agency role - show contact message
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Play className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">VideoPopup</span>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-border/50 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl">Agency Access Required</CardTitle>
              <CardDescription className="text-base">
                Your account is not yet set up as an agency.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                To create and manage video widgets, you need an agency account. 
                Please contact us to discuss pricing and plans tailored to your needs.
              </p>
              <div className="pt-2">
                <Button asChild className="gradient-primary">
                  <a href="mailto:support@videopopup.com">Contact for Agency Pricing</a>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Already have a plan? Our team will activate your account shortly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

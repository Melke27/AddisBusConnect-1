import { useLocation } from 'wouter';
import { useAuth } from '../../hooks/use-auth';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  path?: string;
}

export function ProtectedRoute({ children, requireAdmin = false, path }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to auth page if not authenticated
      setLocation(`/auth?redirect=${encodeURIComponent(path || '/dashboard')}`);
    }
  }, [isAuthenticated, isLoading, path, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Check admin access if required
  if (requireAdmin && user?.role !== 'admin') {
    setLocation('/');
    return null;
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requireAdmin>{children}</ProtectedRoute>;
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProvider, useCurrentUser } from './UserContext';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

function AuthGuardInner({ children, requireAdmin = false }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { setUser } = useCurrentUser();

  useEffect(() => {
    setMounted(true);

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth/verify');
        const data = await response.json();

        if (response.ok && data.authenticated) {
          setUser(data.user);

          // Check admin requirement
          if (requireAdmin && data.user.role !== 'admin') {
            router.push('/admin/dashboard');
            return;
          }

          setIsAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [router, requireAdmin, setUser]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center" suppressHydrationWarning>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function AdminAuthGuard({ children, requireAdmin = false }: AdminAuthGuardProps) {
  return (
    <UserProvider>
      <AuthGuardInner requireAdmin={requireAdmin}>
        {children}
      </AuthGuardInner>
    </UserProvider>
  );
}

export { useCurrentUser } from './UserContext';

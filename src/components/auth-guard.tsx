'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from './ui/skeleton';

interface AuthGuardProps {
    children: React.ReactNode;
    requiredRole?: 'admin' | 'vendedor';
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      router.replace('/'); // Redirect to a safe page if role doesn't match
    }

  }, [isAuthenticated, isLoading, router, user, requiredRole]);

  if (isLoading || !isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return (
        <div className="flex flex-col space-y-3 p-8">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      );
  }

  return <>{children}</>;
}

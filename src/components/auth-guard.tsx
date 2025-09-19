'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from './ui/skeleton';
import type { UserRole } from '@/lib/types';

interface AuthGuardProps {
    children: React.ReactNode;
    requiredRole?: UserRole | UserRole[];
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

    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!user?.role || !roles.includes(user.role)) {
        router.replace('/'); // Redirect to a safe page if role doesn't match
      }
    }

  }, [isAuthenticated, isLoading, router, user, requiredRole]);

  if (isLoading || !isAuthenticated) {
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

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!user?.role || !roles.includes(user.role)) {
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
  }

  return <>{children}</>;
}

import { UserManagement } from '@/components/user-management';
import { AuthGuard } from '@/components/auth-guard';
import { AppLayout } from '@/components/app-layout';

export default function UsersPage() {
  return (
    <main>
      <AuthGuard requiredRole="admin">
        <AppLayout>
            <UserManagement />
        </AppLayout>
      </AuthGuard>
    </main>
  );
}

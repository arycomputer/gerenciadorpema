import { AccountsPayableManagement } from '@/components/accounts-payable-management';
import { AuthGuard } from '@/components/auth-guard';
import { AppLayout } from '@/components/app-layout';

export default function AccountsPage() {
  return (
    <main>
      <AuthGuard requiredRole={['admin', 'gerente']}>
        <AppLayout>
            <AccountsPayableManagement />
        </AppLayout>
      </AuthGuard>
    </main>
  );
}

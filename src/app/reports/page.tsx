import SalesReport from '@/components/sales-report';
import { AuthGuard } from '@/components/auth-guard';
import { AppLayout } from '@/components/app-layout';

export default function ReportsPage() {
  return (
    <main>
      <AuthGuard>
        <AppLayout>
          <SalesReport />
        </AppLayout>
      </AuthGuard>
    </main>
  );
}

import SalesReport from '@/components/sales-report';
import { AuthGuard } from '@/components/auth-guard';

export default function ReportsPage() {
  return (
    <main>
      <AuthGuard>
        <SalesReport />
      </AuthGuard>
    </main>
  );
}

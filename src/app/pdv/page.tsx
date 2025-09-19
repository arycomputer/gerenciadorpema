
import SalesTerminal from '@/components/sales-terminal';
import { AuthGuard } from '@/components/auth-guard';
import { AppLayout } from '@/components/app-layout';

export default function PdvPage() {
  return (
    <main>
      <AuthGuard>
        <AppLayout>
          <SalesTerminal />
        </AppLayout>
      </AuthGuard>
    </main>
  );
}



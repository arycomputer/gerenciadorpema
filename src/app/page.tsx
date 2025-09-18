import SalesTerminal from '@/components/sales-terminal';
import { AuthGuard } from '@/components/auth-guard';

export default function Home() {
  return (
    <main>
      <AuthGuard>
        <SalesTerminal />
      </AuthGuard>
    </main>
  );
}

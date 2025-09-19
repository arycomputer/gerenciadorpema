import { ProductManagement } from '@/components/product-management';
import { AuthGuard } from '@/components/auth-guard';
import { AppLayout } from '@/components/app-layout';

export default function ProductsPage() {

  return (
    <main>
      <AuthGuard requiredRole={['admin', 'gerente']}>
        <AppLayout>
            <ProductManagement />
        </AppLayout>
      </AuthGuard>
    </main>
  );
}
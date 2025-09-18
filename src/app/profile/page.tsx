import { ProfileForm } from '@/components/profile-form';
import { AuthGuard } from '@/components/auth-guard';
import { AppLayout } from '@/components/app-layout';

export default function ProfilePage() {
  return (
    <main>
      <AuthGuard>
        <AppLayout>
          <div className="flex justify-center">
            <ProfileForm />
          </div>
        </AppLayout>
      </AuthGuard>
    </main>
  );
}

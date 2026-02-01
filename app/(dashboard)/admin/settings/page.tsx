// app/(dashboard)/admin/settings/page.tsx
import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import AdminSettings from '@/components/admin/AdminSettings';
import { Settings } from 'lucide-react';

export const metadata = {
  title: 'Settings - Admin',
};

export default async function AdminSettingsPage() {
  const user = await getServerSession();

  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-sage-200 flex items-center justify-center">
          <Settings className="w-6 h-6 text-sage-700" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-sage-900 font-display">
            System Settings
          </h1>
          <p className="text-sage-600 mt-1">
            Configure platform settings and preferences.
          </p>
        </div>
      </div>

      <AdminSettings />
    </div>
  );
}
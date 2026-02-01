// app/(dashboard)/admin/reports/page.tsx
import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import AdminReportsList from '@/components/admin/AdminReportsList';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'All Reports - Admin',
};

export default async function AdminReportsPage() {
  const user = await getServerSession();

  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-ocean-100 flex items-center justify-center">
          <FileText className="w-6 h-6 text-ocean-600" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-sage-900 font-display">
            Reports Management
          </h1>
          <p className="text-sage-600 mt-1">
            View and manage all environmental reports across the platform.
          </p>
        </div>
      </div>

      <AdminReportsList />
    </div>
  );
}
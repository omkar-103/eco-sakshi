import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import ReportsList from '@/components/reports/ReportsList';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'My Reports',
};

export default async function ReportsPage() {
  const user = await getServerSession();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-sage-900 font-display">
            My Reports
          </h1>
          <p className="text-sage-600 mt-1">
            View and track all your environmental reports.
          </p>
        </div>
        <Link href="/citizen/reports/new" className="btn-primary">
          <Plus className="w-5 h-5" />
          New Report
        </Link>
      </div>

      <ReportsList />
    </div>
  );
}
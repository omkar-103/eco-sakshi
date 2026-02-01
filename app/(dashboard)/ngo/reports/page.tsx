import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import NgoReportsList from '@/components/ngo/NgoReportsList';
import { Database } from 'lucide-react';

export const metadata = {
  title: 'Reports Data - NGO',
};

export default async function NgoReportsPage() {
  const user = await getServerSession();

  if (!user || !['ngo', 'admin'].includes(user.role)) {
    redirect('/login');
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
          <Database className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-sage-900 font-display">
            Reports Data
          </h1>
          <p className="text-sage-600 mt-1">
            Access verified environmental report data for research.
          </p>
        </div>
      </div>

      <NgoReportsList />
    </div>
  );
}
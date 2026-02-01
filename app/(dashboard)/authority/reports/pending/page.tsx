import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import AuthorityReportsList from '@/components/authority/AuthorityReportsList';
import { Clock } from 'lucide-react';

export const metadata = {
  title: 'Pending Reports - Authority',
};

export default async function PendingReportsPage() {
  const user = await getServerSession();

  if (!user || !['authority', 'admin'].includes(user.role)) {
    redirect('/login');
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
          <Clock className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-sage-900 font-display">
            Pending Review
          </h1>
          <p className="text-sage-600 mt-1">
            Reports awaiting initial verification and review.
          </p>
        </div>
      </div>

      <AuthorityReportsList defaultStatus="pending" />
    </div>
  );
}
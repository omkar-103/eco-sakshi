import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import AuthorityReportsList from '@/components/authority/AuthorityReportsList';

export const metadata = {
  title: 'All Reports - Authority',
};

export default async function AuthorityReportsPage() {
  const user = await getServerSession();

  if (!user || !['authority', 'admin'].includes(user.role)) {
    redirect('/login');
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-sage-900 font-display">
          All Reports
        </h1>
        <p className="text-sage-600 mt-1">
          Review and manage environmental compliance reports.
        </p>
      </div>

      <AuthorityReportsList />
    </div>
  );
}
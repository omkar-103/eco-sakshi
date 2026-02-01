// app/(dashboard)/citizen/reports/new/page.tsx
import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import ReportForm from '@/components/reports/ReportForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'New Report',
};

export default async function NewReportPage() {
  const user = await getServerSession();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <Link
          href="/citizen/reports"
          className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Reports
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-sage-900 font-display">
          Report Environmental Issue
        </h1>
        <p className="text-sage-600 mt-2">
          Help protect the environment by reporting issues in your community.
        </p>
      </div>

      <div className="card">
        <ReportForm />
      </div>
    </div>
  );
}
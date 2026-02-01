import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect, notFound } from 'next/navigation';
import connectDB from '@/lib/db/mongoose';
import Report from '@/models/Report';
import AuthorityReportDetail from '@/components/authority/AuthorityReportDetail';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AuthorityReportDetailPage({ params }: PageProps) {
  const user = await getServerSession();

  if (!user || !['authority', 'admin'].includes(user.role)) {
    redirect('/login');
  }

  const { id } = await params;

  await connectDB();

  const report = await Report.findById(id)
    .populate('userId', 'name email avatar phone')
    .populate('assignedTo', 'name email')
    .populate('statusHistory.changedBy', 'name')
    .populate('authorityResponse.respondedBy', 'name')
    .lean();

  if (!report) {
    notFound();
  }

  const plainReport = JSON.parse(JSON.stringify(report));
  const plainUser = JSON.parse(JSON.stringify(user));

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <Link
        href="/authority/reports"
        className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Reports
      </Link>

      <AuthorityReportDetail report={plainReport} currentUser={plainUser} />
    </div>
  );
}
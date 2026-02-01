import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect, notFound } from 'next/navigation';
import connectDB from '@/lib/db/mongoose';
import Report from '@/models/Report';
import ReportDetail from '@/components/reports/ReportDetail';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}

export default async function ReportDetailPage({ params, searchParams }: PageProps) {
  const user = await getServerSession();

  if (!user) {
    redirect('/login');
  }

  const { id } = await params;
  const searchParamsResolved = await searchParams;
  const success = searchParamsResolved?.success;

  // Validate MongoDB ObjectId format
  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
    notFound();
  }

  await connectDB();

  let report;
  try {
    report = await Report.findById(id)
      .populate('userId', 'name email avatar')
      .populate('assignedTo', 'name email')
      .populate('statusHistory.changedBy', 'name')
      .populate('authorityResponse.respondedBy', 'name')
      .lean();
  } catch (error) {
    console.error('Error fetching report:', error);
    notFound();
  }

  if (!report) {
    notFound();
  }

  // Check access for citizens - they can only view their own reports
  const reportUserId = (report.userId as any)?._id?.toString() || report.userId?.toString();
  if (user.role === 'citizen' && reportUserId !== user._id.toString()) {
    redirect('/citizen/reports');
  }

  // Convert to plain object safely
  const plainReport = JSON.parse(JSON.stringify(report));

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Link
        href="/citizen/reports"
        className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-900 mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Reports
      </Link>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-forest-50 to-ocean-50 border border-forest-200 animate-slide-down">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-forest-600 mt-0.5" />
            <div>
              <p className="text-forest-700 font-medium">
                Report submitted successfully! 🎉
              </p>
              <p className="text-forest-600 text-sm mt-1">
                Your complaint ID is{' '}
                <span className="font-mono font-semibold">{plainReport.complaintId}</span>
                . You will receive email updates as your report is reviewed.
              </p>
            </div>
          </div>
        </div>
      )}

      <ReportDetail report={plainReport} userRole={user.role} />
    </div>
  );
}
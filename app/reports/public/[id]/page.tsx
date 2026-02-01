// app/reports/public/[id]/page.tsx
import { notFound } from 'next/navigation';
import connectDB from '@/lib/db/mongoose';
import Report from '@/models/Report';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PublicReportDetail from '@/components/public/PublicReportDetail';
import { ArrowLeft, Globe, Shield } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicReportDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
    notFound();
  }

  await connectDB();

  // Remove isPublic filter to show all verified/in-progress/resolved reports
  const report = await Report.findOne({
    _id: id,
    status: { $in: ['pending', 'verified', 'under-review', 'in-progress', 'resolved'] },
  })
    .populate('statusHistory.changedBy', 'name')
    .lean();

  if (!report) {
    notFound();
  }

  // Increment view count
  await Report.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

  // Get updated view count
  const updatedReport = await Report.findById(id).select('viewCount').lean();
  
  const plainReport = JSON.parse(JSON.stringify({
    ...report,
    viewCount: updatedReport?.viewCount || (report.viewCount || 0) + 1
  }));

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-emerald-50/30">
        {/* Hero Header */}
        <div className="relative pt-24 pb-8 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl" />
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/reports/public"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 group text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Public Reports
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white font-display">
                  Report Details
                </h1>
                <p className="text-emerald-100 text-sm">
                  Verified environmental report
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-4">
          <PublicReportDetail report={plainReport} />
        </div>
      </main>

      <Footer />
    </>
  );
}
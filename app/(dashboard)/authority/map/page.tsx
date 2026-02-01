import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db/mongoose';
import Report from '@/models/Report';
import MapContainer from '@/components/map/MapContainer';
import { Map, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Map View - Authority',
};

export default async function AuthorityMapPage() {
  const user = await getServerSession();

  if (!user || !['authority', 'admin'].includes(user.role)) {
    redirect('/login');
  }

  await connectDB();

  // Fetch all reports for authority
  const reports = await Report.find({})
    .select('complaintId title category severity status location media createdAt userId')
    .populate('userId', 'name')
    .sort({ createdAt: -1 })
    .lean();

  const plainReports = JSON.parse(JSON.stringify(reports));

  // Stats for the header
  const criticalCount = reports.filter((r) => r.severity === 'critical').length;
  const pendingCount = reports.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-ocean-100 flex items-center justify-center">
            <Map className="w-6 h-6 text-ocean-600" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-sage-900 font-display">
              Reports Map
            </h1>
            <p className="text-sage-600 mt-1">
              Geographic overview of all environmental reports.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {criticalCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-red-700">
                {criticalCount} Critical
              </span>
            </div>
          )}
          <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-sm font-medium text-amber-700">
              {pendingCount} Pending Review
            </span>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <MapContainer reports={plainReports} height="700px" showFilters={true} />
      </div>
    </div>
  );
}
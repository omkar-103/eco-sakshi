import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db/mongoose';
import Report from '@/models/Report';
import MapContainer from '@/components/map/MapContainer';
import { Map, Info } from 'lucide-react';

export const metadata = {
  title: 'Map View - NGO',
};

export default async function NgoMapPage() {
  const user = await getServerSession();

  if (!user || !['ngo', 'admin'].includes(user.role)) {
    redirect('/login');
  }

  await connectDB();

  // NGOs only see verified and public reports
  const reports = await Report.find({
    isPublic: true,
    status: { $in: ['verified', 'in-progress', 'resolved'] },
  })
    .select('complaintId title category severity status location media createdAt')
    .sort({ createdAt: -1 })
    .lean();

  const plainReports = JSON.parse(JSON.stringify(reports));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
          <Map className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-sage-900 font-display">
            Environmental Data Map
          </h1>
          <p className="text-sage-600 mt-1">
            Geographic visualization of verified environmental reports.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          This map shows only verified and public reports. Data can be exported for
          research and advocacy purposes.
        </p>
      </div>

      <div className="card p-0 overflow-hidden">
        <MapContainer reports={plainReports} height="700px" showFilters={true} />
      </div>
    </div>
  );
}
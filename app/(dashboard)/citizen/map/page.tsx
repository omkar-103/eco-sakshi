import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db/mongoose';
import Report from '@/models/Report';
import MapContainer from '@/components/map/MapContainer';
import { Map } from 'lucide-react';

export const metadata = {
  title: 'Map View - Citizen',
};

export default async function CitizenMapPage() {
  const user = await getServerSession();

  if (!user) {
    redirect('/login');
  }

  await connectDB();

  // Fetch user's reports for map
  const reports = await Report.find({ userId: user._id })
    .select('complaintId title category severity status location media createdAt')
    .sort({ createdAt: -1 })
    .lean();

  const plainReports = JSON.parse(JSON.stringify(reports));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-ocean-100 flex items-center justify-center">
          <Map className="w-6 h-6 text-ocean-600" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-sage-900 font-display">
            My Reports Map
          </h1>
          <p className="text-sage-600 mt-1">
            View all your environmental reports on the map.
          </p>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <MapContainer reports={plainReports} height="600px" showFilters={true} />
      </div>
    </div>
  );
}
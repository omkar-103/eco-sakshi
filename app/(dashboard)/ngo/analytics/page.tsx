import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db/mongoose';
import Report from '@/models/Report';
import AnalyticsCharts from '@/components/analytics/AnalyticsCharts';
import { BarChart3 } from 'lucide-react';

export const metadata = {
  title: 'Analytics - NGO',
};

export default async function NgoAnalyticsPage() {
  const user = await getServerSession();

  if (!user || !['ngo', 'admin'].includes(user.role)) {
    redirect('/login');
  }

  await connectDB();

  // Fetch analytics data
  const [totalReports, statusCounts, categoryCounts, severityCounts] = await Promise.all([
    Report.countDocuments({ isPublic: true }),
    Report.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Report.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Report.aggregate([
      { $match: { isPublic: true } },
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]),
  ]);

  // Get monthly trend for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyTrendRaw = await Report.aggregate([
    { $match: { isPublic: true, createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyTrend = monthlyTrendRaw.map((m) => ({
    month: monthNames[m._id.month - 1],
    count: m.count,
  }));

  // Pad with empty months if needed
  while (monthlyTrend.length < 6) {
    monthlyTrend.unshift({ month: '', count: 0 });
  }

  const statusMap = statusCounts.reduce((acc: any, item: any) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  const severityMap = severityCounts.reduce((acc: any, item: any) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  const resolutionRate = totalReports > 0
    ? Math.round(((statusMap.resolved || 0) / totalReports) * 100)
    : 0;

  const analyticsData = {
    totalReports,
    statusCounts: statusMap,
    categoryCounts,
    severityCounts: severityMap,
    monthlyTrend: monthlyTrend.slice(-6),
    resolutionRate,
    avgResolutionTime: 5, // Placeholder - would calculate from actual data
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-sage-900 font-display">
            Environmental Analytics
          </h1>
          <p className="text-sage-600 mt-1">
            Comprehensive data analysis of verified environmental reports.
          </p>
        </div>
      </div>

      <AnalyticsCharts data={analyticsData} />
    </div>
  );
}
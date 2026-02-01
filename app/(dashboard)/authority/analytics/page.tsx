import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db/mongoose';
import Report from '@/models/Report';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
} from 'lucide-react';

export const metadata = {
  title: 'Analytics - Authority',
};

export default async function AuthorityAnalyticsPage() {
  const user = await getServerSession();

  if (!user || !['authority', 'admin'].includes(user.role)) {
    redirect('/login');
  }

  await connectDB();

  // Fetch analytics data
  const [
    totalReports,
    statusCounts,
    categoryCounts,
    severityCounts,
    recentReports,
  ] = await Promise.all([
    Report.countDocuments(),
    Report.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Report.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
    Report.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]),
    Report.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('complaintId title status createdAt')
      .lean(),
  ]);

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

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-sage-900 font-display">
          Analytics Dashboard
        </h1>
        <p className="text-sage-600 mt-1">
          Overview of environmental compliance reports and performance metrics.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-ocean-100 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-ocean-600" />
            </div>
            <span className="text-xs text-sage-500 bg-sage-100 px-2 py-1 rounded-full">
              All time
            </span>
          </div>
          <p className="text-3xl font-bold text-sage-900 font-display">{totalReports}</p>
          <p className="text-sage-600 text-sm mt-1">Total Reports</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
              Needs attention
            </span>
          </div>
          <p className="text-3xl font-bold text-sage-900 font-display">
            {statusMap.pending || 0}
          </p>
          <p className="text-sage-600 text-sm mt-1">Pending Review</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-sage-900 font-display">
            {(statusMap['in-progress'] || 0) + (statusMap['under-review'] || 0)}
          </p>
          <p className="text-sage-600 text-sm mt-1">In Progress</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-forest-600" />
            </div>
            <span className="text-xs text-forest-600 bg-forest-100 px-2 py-1 rounded-full">
              {resolutionRate}%
            </span>
          </div>
          <p className="text-3xl font-bold text-sage-900 font-display">
            {statusMap.resolved || 0}
          </p>
          <p className="text-sage-600 text-sm mt-1">Resolved</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Reports by Category */}
        <div className="card">
          <h2 className="text-lg font-semibold text-sage-900 font-display mb-6">
            Reports by Category
          </h2>
          <div className="space-y-4">
            {categoryCounts.map((item: any) => {
              const percentage = totalReports > 0
                ? Math.round((item.count / totalReports) * 100)
                : 0;
              return (
                <div key={item._id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-sage-700 capitalize">
                      {item._id.replace('-', ' ')}
                    </span>
                    <span className="text-sage-600">
                      {item.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-sage-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-forest-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reports by Severity */}
        <div className="card">
          <h2 className="text-lg font-semibold text-sage-900 font-display mb-6">
            Reports by Severity
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'critical', label: 'Critical', color: 'bg-red-500' },
              { key: 'high', label: 'High', color: 'bg-orange-500' },
              { key: 'medium', label: 'Medium', color: 'bg-yellow-500' },
              { key: 'low', label: 'Low', color: 'bg-green-500' },
            ].map((severity) => (
              <div
                key={severity.key}
                className="p-4 rounded-xl border border-sage-200 text-center"
              >
                <div className={`w-4 h-4 rounded-full ${severity.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-sage-900">
                  {severityMap[severity.key] || 0}
                </p>
                <p className="text-sm text-sage-600">{severity.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="card">
        <h2 className="text-lg font-semibold text-sage-900 font-display mb-6">
          Recent Reports
        </h2>
        <div className="space-y-3">
          {recentReports.map((report: any) => (
            <div
              key={report._id}
              className="flex items-center justify-between p-3 rounded-xl bg-sage-50"
            >
              <div>
                <p className="text-xs font-mono text-forest-600">{report.complaintId}</p>
                <p className="font-medium text-sage-900 truncate max-w-[300px]">
                  {report.title}
                </p>
              </div>
              <span className={`badge ${
                report.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {report.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
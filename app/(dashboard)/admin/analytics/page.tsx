// app/(dashboard)/admin/analytics/page.tsx
import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db/mongoose';
import Report from '@/models/Report';
import User from '@/models/User';
import AnalyticsCharts from '@/components/analytics/AnalyticsCharts';
import {
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Shield,
  Building2,
  Leaf,
  Globe,
  Zap,
  Target,
  Award,
  Activity,
} from 'lucide-react';

export const metadata = {
  title: 'Analytics - Admin Dashboard',
  description: 'Comprehensive analytics and insights for GreenSentinel platform',
};

export default async function AdminAnalyticsPage() {
  const user = await getServerSession();

  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  await connectDB();

  // Fetch all analytics data
  const [
    totalReports,
    totalUsers,
    statusCounts,
    categoryCounts,
    severityCounts,
    usersByRole,
    recentReports,
  ] = await Promise.all([
    Report.countDocuments(),
    User.countDocuments(),
    Report.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Report.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Report.aggregate([{ $group: { _id: '$severity', count: { $sum: 1 } } }]),
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    Report.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    }),
  ]);

  // Get monthly trend
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyTrendRaw = await Report.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
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

  const userRoleMap = usersByRole.reduce((acc: any, item: any) => {
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
    avgResolutionTime: 4,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-8 lg:p-10">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse-slow" />
          
          {/* Floating Elements */}
          <div className="absolute top-10 right-10 w-20 h-20 border border-white/20 rounded-2xl rotate-12 animate-float-slow" />
          <div className="absolute bottom-10 right-32 w-16 h-16 border border-white/10 rounded-full animate-float-slow-delayed" />
          <div className="absolute top-20 left-1/3 w-12 h-12 bg-white/5 rounded-xl rotate-45 animate-float-slow" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl border border-white/30">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white font-display">
                System Analytics
              </h1>
              <p className="text-purple-100 mt-2 text-lg">
                Real-time insights and comprehensive platform metrics
              </p>
            </div>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white text-sm font-medium">Live Data</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm font-medium">{recentReports} reports today</span>
            </div>
          </div>
        </div>

        {/* Mini Stats Row */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Total Reports', value: totalReports, icon: FileText, color: 'from-emerald-400 to-teal-500' },
            { label: 'Active Users', value: totalUsers, icon: Users, color: 'from-blue-400 to-cyan-500' },
            { label: 'Resolution Rate', value: `${resolutionRate}%`, icon: Target, color: 'from-amber-400 to-orange-500' },
            { label: 'Avg. Response', value: '4 days', icon: Activity, color: 'from-pink-400 to-rose-500' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="relative group p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
              <div className="relative flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white font-display">{stat.value}</p>
                  <p className="text-purple-200 text-xs">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Citizens Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 hover:-translate-y-1">
          <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-10" />
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <p className="text-4xl font-bold text-white font-display mb-1">
              {userRoleMap.citizen || 0}
            </p>
            <p className="text-emerald-100 font-medium">Citizens</p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2 text-emerald-100 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Active reporters</span>
              </div>
            </div>
          </div>
        </div>

        {/* Authorities Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 hover:-translate-y-1">
          <div className="absolute inset-0 bg-[url('/patterns/circuit.svg')] opacity-10" />
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <p className="text-4xl font-bold text-white font-display mb-1">
              {userRoleMap.authority || 0}
            </p>
            <p className="text-blue-100 font-medium">Authorities</p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2 text-blue-100 text-sm">
                <Award className="w-4 h-4" />
                <span>Verified officials</span>
              </div>
            </div>
          </div>
        </div>

        {/* NGOs Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 shadow-xl shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:-translate-y-1">
          <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-10" />
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <p className="text-4xl font-bold text-white font-display mb-1">
              {userRoleMap.ngo || 0}
            </p>
            <p className="text-purple-100 font-medium">NGO Partners</p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2 text-purple-100 text-sm">
                <Globe className="w-4 h-4" />
                <span>Environmental orgs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Users Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-xl shadow-slate-500/20 hover:shadow-2xl hover:shadow-slate-500/30 transition-all duration-500 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10" />
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <p className="text-4xl font-bold text-white font-display mb-1">
              {totalUsers}
            </p>
            <p className="text-slate-300 font-medium">Total Users</p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Activity className="w-4 h-4" />
                <span>Platform community</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <AnalyticsCharts data={analyticsData} />
    </div>
  );
}
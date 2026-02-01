import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export default async function AuthorityDashboard() {
  const user = await getServerSession();

  if (!user || user.role !== 'authority') {
    redirect('/login');
  }

  const stats = [
    {
      label: 'Pending Review',
      value: 12,
      icon: Clock,
      color: 'bg-amber-100 text-amber-600',
      trend: '+3 today',
    },
    {
      label: 'Under Investigation',
      value: 8,
      icon: AlertCircle,
      color: 'bg-purple-100 text-purple-600',
      trend: '2 assigned',
    },
    {
      label: 'Resolved This Month',
      value: 45,
      icon: CheckCircle2,
      color: 'bg-forest-100 text-forest-600',
      trend: '+12%',
    },
    {
      label: 'Total Cases',
      value: 156,
      icon: FileText,
      color: 'bg-ocean-100 text-ocean-600',
      trend: 'All time',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-sage-900 font-display">
            Authority Dashboard
          </h1>
          <p className="text-sage-600 mt-1">
            Review and manage environmental compliance reports.
          </p>
        </div>
        <Link
          href="/authority/reports/pending"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Clock className="w-5 h-5" />
          Review Pending
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs text-sage-500 bg-sage-100 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            <p className="text-3xl font-bold text-sage-900 font-display">{stat.value}</p>
            <p className="text-sage-600 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Urgent Cases */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-sage-900 font-display">
              Urgent Cases
            </h2>
            <Link
              href="/authority/reports?severity=critical"
              className="text-sm text-forest-600 hover:text-forest-700 font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="text-center py-8 text-sage-500">
            Urgent cases will appear here once reports are submitted
          </div>
        </div>

        {/* Performance */}
        <div className="card gradient-ocean text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold font-display">Performance</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-ocean-100">Resolution Rate</span>
                <span className="font-semibold">92%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-ocean-100">Avg Response Time</span>
                <span className="font-semibold">18h</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
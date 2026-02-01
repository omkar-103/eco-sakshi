import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Target,
  Award,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard',
};

export default async function CitizenDashboard() {
  const user = await getServerSession();

  if (!user) {
    redirect('/login');
  }

  const stats = [
    {
      label: 'Total Reports',
      value: user.stats?.totalReports || 0,
      icon: FileText,
      color: 'from-ocean-500 to-ocean-600',
      bgColor: 'bg-ocean-50',
      iconColor: 'text-ocean-600',
    },
    {
      label: 'Resolved',
      value: user.stats?.resolvedReports || 0,
      icon: CheckCircle2,
      color: 'from-forest-500 to-forest-600',
      bgColor: 'bg-forest-50',
      iconColor: 'text-forest-600',
    },
    {
      label: 'Pending',
      value: user.stats?.pendingReports || 0,
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'In Progress',
      value: Math.max(0, (user.stats?.totalReports || 0) - (user.stats?.resolvedReports || 0) - (user.stats?.pendingReports || 0)),
      icon: AlertTriangle,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100 border border-forest-200 mb-4">
            <Sparkles className="w-4 h-4 text-forest-600" />
            <span className="text-sm font-semibold text-forest-700">Welcome back!</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-sage-900 font-display">
            Hello, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-sage-600 mt-2 text-lg">
            Track your environmental reports and make a real difference.
          </p>
        </div>
        <Link
          href="/citizen/reports/new"
          className="btn-primary text-base px-6 py-3.5 shadow-xl hover:shadow-2xl group"
        >
          <Plus className="w-5 h-5" />
          New Report
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="card hover-lift group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-sage-900 font-display">
              {stat.value}
            </p>
            <p className="text-sage-600 text-sm mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-sage-900 font-display flex items-center gap-2">
              <FileText className="w-5 h-5 text-forest-600" />
              Recent Reports
            </h2>
            <Link
              href="/citizen/reports"
              className="text-sm text-forest-600 hover:text-forest-700 font-medium flex items-center gap-1 group"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {user.stats?.totalReports === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-sage-400" />
              </div>
              <h3 className="text-lg font-semibold text-sage-900 mb-2">No reports yet</h3>
              <p className="text-sage-600 mb-6 max-w-sm mx-auto">
                Start protecting your environment by submitting your first report.
              </p>
              <Link href="/citizen/reports/new" className="btn-primary">
                <Plus className="w-4 h-4" />
                Submit Your First Report
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Placeholder for recent reports */}
              <div className="p-4 rounded-xl bg-sage-50 border border-sage-100 text-center">
                <p className="text-sage-600">Your recent reports will appear here</p>
              </div>
            </div>
          )}
        </div>

        {/* Impact Card */}
        <div className="card bg-gradient-to-br from-forest-600 via-forest-700 to-ocean-700 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold font-display">Your Impact</h2>
                <p className="text-forest-200 text-sm">Making a difference</p>
              </div>
            </div>

            <p className="text-white/80 text-sm leading-relaxed mb-6">
              Every report you submit helps identify environmental issues in your 
              community and contributes to a cleaner, greener future.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur text-center">
                <p className="text-2xl font-bold font-display">85%</p>
                <p className="text-forest-200 text-xs">Resolution Rate</p>
              </div>
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur text-center">
                <p className="text-2xl font-bold font-display">48h</p>
                <p className="text-forest-200 text-xs">Avg Response</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'New Report', href: '/citizen/reports/new', icon: Plus, color: 'forest' },
          { label: 'View Map', href: '/citizen/map', icon: MapPin, color: 'ocean' },
          { label: 'My Reports', href: '/citizen/reports', icon: FileText, color: 'purple' },
          { label: 'Upgrade Plan', href: '/citizen/subscription', icon: Award, color: 'amber' },
        ].map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="card hover-lift group flex items-center gap-4 p-4"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
              action.color === 'forest' ? 'bg-forest-100' :
              action.color === 'ocean' ? 'bg-ocean-100' :
              action.color === 'purple' ? 'bg-purple-100' :
              'bg-amber-100'
            }`}>
              <action.icon className={`w-5 h-5 ${
                action.color === 'forest' ? 'text-forest-600' :
                action.color === 'ocean' ? 'text-ocean-600' :
                action.color === 'purple' ? 'text-purple-600' :
                'text-amber-600'
              }`} />
            </div>
            <span className="font-medium text-sage-900">{action.label}</span>
            <ArrowRight className="w-4 h-4 text-sage-400 ml-auto group-hover:text-forest-600 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      {/* Subscription Banner */}
      {user.subscription?.plan === 'free' && (
        <div className="card-bordered bg-gradient-to-r from-forest-50 via-ocean-50 to-purple-50 border-forest-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-500 to-ocean-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sage-900 text-lg">Upgrade to Premium</h3>
                <p className="text-sm text-sage-600">
                  Unlimited reports, priority review & advanced analytics
                </p>
              </div>
            </div>
            <Link href="/citizen/subscription" className="btn-primary whitespace-nowrap">
              View Plans
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
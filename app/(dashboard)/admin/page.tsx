// app/(dashboard)/admin/page.tsx
import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import {
  Users,
  FileText,
  CreditCard,
  Shield,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const user = await getServerSession();

  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  const stats = [
    { label: 'Total Users', value: '2,456', icon: Users, color: 'bg-ocean-100 text-ocean-600' },
    { label: 'Total Reports', value: '8,234', icon: FileText, color: 'bg-forest-100 text-forest-600' },
    { label: 'Active Subscriptions', value: '342', icon: CreditCard, color: 'bg-purple-100 text-purple-600' },
    { label: 'Flagged Content', value: '12', icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-sage-900 font-display">
          Admin Dashboard
        </h1>
        <p className="text-sage-600 mt-1">
          System overview and management controls.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-sage-900 font-display">{stat.value}</p>
            <p className="text-sage-600 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Management Links */}
        <div className="card">
          <h2 className="text-lg font-semibold text-sage-900 font-display mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2">
            {[
              { label: 'Manage Users', href: '/admin/users', icon: Users },
              { label: 'Review Reports', href: '/admin/reports', icon: FileText },
              { label: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
              { label: 'System Settings', href: '/admin/settings', icon: Shield },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-sage-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-sage-500" />
                  <span className="font-medium text-sage-700">{item.label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-sage-400 group-hover:text-forest-600 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="card bg-gradient-to-br from-sage-800 to-sage-900 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold font-display">System Status</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sage-300">API Status</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sage-300">Database</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sage-300">Storage</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                45% Used
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
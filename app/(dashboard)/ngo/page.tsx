// app/(dashboard)/ngo/page.tsx
import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import { BarChart3, Download, Map, Database, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function NgoDashboard() {
  const user = await getServerSession();

  if (!user || user.role !== 'ngo') {
    redirect('/login');
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-sage-900 font-display">
          NGO Data Portal
        </h1>
        <p className="text-sage-600 mt-1">
          Access environmental data and analytics for research and advocacy.
        </p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Analytics', icon: BarChart3, href: '/ngo/analytics', color: 'from-forest-500 to-forest-600' },
          { label: 'Map View', icon: Map, href: '/ngo/map', color: 'from-ocean-500 to-ocean-600' },
          { label: 'Export Data', icon: Download, href: '/ngo/export', color: 'from-purple-500 to-purple-600' },
          { label: 'Raw Data', icon: Database, href: '/ngo/reports', color: 'from-amber-500 to-amber-600' },
        ].map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="card group hover:shadow-soft-lg transition-all"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-sage-900">{item.label}</h3>
            <div className="flex items-center gap-1 text-sm text-forest-600 mt-2 group-hover:gap-2 transition-all">
              Access <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>

      {/* Subscription Status */}
      <div className="card-bordered">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sage-900">Data Access Plan</h3>
            <p className="text-sm text-sage-600 mt-1">
              {user.subscription?.plan === 'enterprise'
                ? 'Full access to all environmental data and API'
                : 'Limited data access - Upgrade for full features'}
            </p>
          </div>
          {user.subscription?.plan !== 'enterprise' && (
            <Link href="/ngo/subscription" className="btn-secondary">
              Upgrade Plan
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
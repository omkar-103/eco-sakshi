// components/analytics/AnalyticsCharts.tsx
'use client';

import { useMemo, useState, JSX } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Calendar,
  ArrowUp,
  ArrowDown,
  Zap,
  Target,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Download,
  RefreshCw,
  Sparkles,
  Flame,
  Droplets,
  Volume2,
  Factory,
  TreeDeciduous,
  HelpCircle,
  Wind,
} from 'lucide-react';
import { cn } from '@/lib/utils/helpers';

interface AnalyticsChartsProps {
  data: {
    totalReports: number;
    statusCounts: Record<string, number>;
    categoryCounts: Array<{ _id: string; count: number }>;
    severityCounts: Record<string, number>;
    monthlyTrend: Array<{ month: string; count: number }>;
    resolutionRate: number;
    avgResolutionTime: number;
  };
}

const categoryConfig: Record<string, { label: string; icon: any; color: string; gradient: string }> = {
  'air-pollution': {
    label: 'Air Pollution',
    icon: Wind,
    color: 'text-sky-500',
    gradient: 'from-sky-400 to-blue-500',
  },
  'water-pollution': {
    label: 'Water Pollution',
    icon: Droplets,
    color: 'text-cyan-500',
    gradient: 'from-cyan-400 to-teal-500',
  },
  'waste-dumping': {
    label: 'Waste Dumping',
    icon: AlertTriangle,
    color: 'text-amber-500',
    gradient: 'from-amber-400 to-orange-500',
  },
  'noise-pollution': {
    label: 'Noise Pollution',
    icon: Volume2,
    color: 'text-purple-500',
    gradient: 'from-purple-400 to-pink-500',
  },
  'industrial-violation': {
    label: 'Industrial',
    icon: Factory,
    color: 'text-slate-500',
    gradient: 'from-slate-400 to-gray-500',
  },
  'deforestation': {
    label: 'Deforestation',
    icon: TreeDeciduous,
    color: 'text-emerald-500',
    gradient: 'from-emerald-400 to-green-500',
  },
  'other': {
    label: 'Other',
    icon: HelpCircle,
    color: 'text-gray-500',
    gradient: 'from-gray-400 to-slate-500',
  },
};

export default function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const {
    totalReports,
    statusCounts,
    categoryCounts,
    severityCounts,
    monthlyTrend,
    resolutionRate,
    avgResolutionTime,
  } = data;

  const maxMonthlyCount = useMemo(() => {
    return Math.max(...monthlyTrend.map((m) => m.count), 1);
  }, [monthlyTrend]);

  const totalSeverity = Object.values(severityCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Total Reports */}
        <div className="group relative overflow-hidden rounded-2xl bg-white border border-sage-200 p-6 hover:shadow-xl hover:shadow-ocean-500/10 transition-all duration-500 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-ocean-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center shadow-lg shadow-ocean-500/30 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center gap-1">
                <ArrowUp className="w-3 h-3" />
                12%
              </span>
            </div>
            <p className="text-3xl font-bold text-sage-900 font-display">{totalReports.toLocaleString()}</p>
            <p className="text-sage-500 text-sm mt-1">Total Reports</p>
            
            {/* Mini Sparkline */}
            <div className="mt-4 flex items-end gap-1 h-8">
              {monthlyTrend.slice(-6).map((m, i) => (
                <div
                  key={i}
                  className="flex-1 bg-ocean-200 rounded-sm group-hover:bg-ocean-400 transition-colors duration-300"
                  style={{ height: `${(m.count / maxMonthlyCount) * 100}%`, minHeight: '4px' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="group relative overflow-hidden rounded-2xl bg-white border border-sage-200 p-6 hover:shadow-xl hover:shadow-forest-500/10 transition-all duration-500 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-forest-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-forest-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center shadow-lg shadow-forest-500/30 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-sage-900 font-display">{resolutionRate}%</p>
            <p className="text-sage-500 text-sm mt-1">Resolution Rate</p>
            
            {/* Progress Ring */}
            <div className="mt-4 relative w-full h-2 bg-sage-100 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-forest-400 to-forest-600 rounded-full transition-all duration-1000"
                style={{ width: `${resolutionRate}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Pending Review */}
        <div className="group relative overflow-hidden rounded-2xl bg-white border border-sage-200 p-6 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-500 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-white" />
              </div>
              {(statusCounts.pending || 0) > 10 && (
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  Attention
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-sage-900 font-display">{statusCounts.pending || 0}</p>
            <p className="text-sage-500 text-sm mt-1">Pending Review</p>
            
            {/* Status breakdown mini */}
            <div className="mt-4 flex gap-2">
              <div className="flex-1 text-center p-2 rounded-lg bg-amber-50">
                <p className="text-sm font-bold text-amber-700">{statusCounts['under-review'] || 0}</p>
                <p className="text-xs text-amber-600">In Review</p>
              </div>
              <div className="flex-1 text-center p-2 rounded-lg bg-blue-50">
                <p className="text-sm font-bold text-blue-700">{statusCounts['in-progress'] || 0}</p>
                <p className="text-xs text-blue-600">In Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Avg Resolution Time */}
        <div className="group relative overflow-hidden rounded-2xl bg-white border border-sage-200 p-6 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center gap-1">
                <ArrowDown className="w-3 h-3" />
                Fast
              </span>
            </div>
            <p className="text-3xl font-bold text-sage-900 font-display">
              {avgResolutionTime}
              <span className="text-lg font-normal text-sage-400 ml-1">days</span>
            </p>
            <p className="text-sage-500 text-sm mt-1">Avg. Resolution</p>
            
            {/* Speed indicator */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400" />
              <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-lg" style={{ marginLeft: '-20%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-sage-200 p-6 hover:shadow-xl transition-all duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-forest-100/50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-sage-900 font-display">Monthly Trend</h3>
                <p className="text-sage-500 text-sm">Report submissions over time</p>
              </div>
              <div className="flex items-center gap-2">
                {['6m', '1y', 'All'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                      selectedPeriod === period
                        ? 'bg-forest-600 text-white shadow-lg shadow-forest-500/30'
                        : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
                    )}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-end justify-between gap-3 h-56">
              {monthlyTrend.map((month, index) => {
                const heightPercent = (month.count / maxMonthlyCount) * 100;
                const isHighest = month.count === maxMonthlyCount;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full flex flex-col items-center">
                      <span
                        className={cn(
                          'text-xs font-bold mb-2 transition-all duration-300',
                          isHighest ? 'text-forest-600 scale-110' : 'text-sage-500 group-hover:text-forest-600'
                        )}
                      >
                        {month.count}
                      </span>
                      <div
                        className={cn(
                          'w-full rounded-xl transition-all duration-500 relative overflow-hidden',
                          isHighest
                            ? 'bg-gradient-to-t from-forest-600 to-forest-400 shadow-lg shadow-forest-500/30'
                            : 'bg-gradient-to-t from-sage-300 to-sage-200 group-hover:from-forest-400 group-hover:to-forest-300'
                        )}
                        style={{ height: `${Math.max(heightPercent, 8)}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                        {isHighest && (
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={cn(
                      'text-xs font-medium transition-colors',
                      isHighest ? 'text-forest-600' : 'text-sage-400'
                    )}>
                      {month.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-sage-200 p-6 hover:shadow-xl transition-all duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-sage-900 font-display">Status Distribution</h3>
                <p className="text-sage-500 text-sm">Current report statuses</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: 'pending', label: 'Pending', color: 'from-amber-400 to-amber-500', bg: 'bg-amber-100', text: 'text-amber-700' },
                { key: 'verified', label: 'Verified', color: 'from-blue-400 to-blue-500', bg: 'bg-blue-100', text: 'text-blue-700' },
                { key: 'under-review', label: 'Under Review', color: 'from-purple-400 to-purple-500', bg: 'bg-purple-100', text: 'text-purple-700' },
                { key: 'in-progress', label: 'In Progress', color: 'from-indigo-400 to-indigo-500', bg: 'bg-indigo-100', text: 'text-indigo-700' },
                { key: 'resolved', label: 'Resolved', color: 'from-green-400 to-green-500', bg: 'bg-green-100', text: 'text-green-700' },
                { key: 'rejected', label: 'Rejected', color: 'from-red-400 to-red-500', bg: 'bg-red-100', text: 'text-red-700' },
              ].map((status) => {
                const count = statusCounts[status.key] || 0;
                const percentage = totalReports > 0 ? Math.round((count / totalReports) * 100) : 0;

                return (
                  <div key={status.key} className="group">
                    <div className="flex justify-between text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <span className={cn('w-3 h-3 rounded-full bg-gradient-to-r', status.color)} />
                        <span className="text-sage-700 font-medium">{status.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', status.bg, status.text)}>
                          {count}
                        </span>
                        <span className="text-sage-400 text-xs w-10 text-right">{percentage}%</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-sage-100 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-1000 relative', status.color)}
                        style={{ width: `${percentage}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-sage-200 p-6 hover:shadow-xl transition-all duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-ocean-100/50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-sage-900 font-display">Reports by Category</h3>
                <p className="text-sage-500 text-sm">Environmental issue breakdown</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {categoryCounts.slice(0, 6).map((cat, index) => {
                const config = categoryConfig[cat._id] || categoryConfig.other;
                const percentage = totalReports > 0 ? Math.round((cat.count / totalReports) * 100) : 0;
                const Icon = config.icon;

                return (
                  <div
                    key={cat._id}
                    className="group relative p-4 rounded-xl border border-sage-200 hover:border-transparent hover:shadow-lg transition-all duration-300 overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={cn('absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300', config.gradient)} />
                    
                    <div className="relative flex items-start gap-3">
                      <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform', config.gradient)}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-sage-900 truncate">{config.label}</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-xl font-bold text-sage-900">{cat.count}</p>
                          <p className="text-xs text-sage-400">{percentage}%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 h-1.5 bg-sage-100 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-500', config.gradient)}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-sage-200 p-6 hover:shadow-xl transition-all duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-100/50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-sage-900 font-display">Severity Breakdown</h3>
                <p className="text-sage-500 text-sm">Risk level distribution</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Donut Chart */}
              <div className="relative w-40 h-40 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                  <defs>
                    <linearGradient id="criticalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#dc2626" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                    <linearGradient id="highGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ea580c" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                    <linearGradient id="mediumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ca8a04" />
                      <stop offset="100%" stopColor="#eab308" />
                    </linearGradient>
                    <linearGradient id="lowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#16a34a" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                  
                  {['low', 'medium', 'high', 'critical'].reduce(
                    (acc, severity, index) => {
                      const count = severityCounts[severity] || 0;
                      const percentage = totalSeverity > 0 ? (count / totalSeverity) * 100 : 0;
                      const circumference = 2 * Math.PI * 50;
                      const strokeDasharray = (percentage / 100) * circumference;

                      const gradients = {
                        critical: 'url(#criticalGrad)',
                        high: 'url(#highGrad)',
                        medium: 'url(#mediumGrad)',
                        low: 'url(#lowGrad)',
                      };

                      acc.elements.push(
                        <circle
                          key={severity}
                          cx="64"
                          cy="64"
                          r="50"
                          fill="none"
                          stroke={gradients[severity as keyof typeof gradients]}
                          strokeWidth="16"
                          strokeDasharray={`${strokeDasharray} ${circumference}`}
                          strokeDashoffset={-acc.offset}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      );

                      acc.offset += strokeDasharray;
                      return acc;
                    },
                    { elements: [] as JSX.Element[], offset: 0 }
                  ).elements}
                </svg>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-sage-900 font-display">{totalSeverity}</p>
                    <p className="text-xs text-sage-500">Total</p>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 space-y-3">
                {[
                  { key: 'critical', label: 'Critical', color: 'from-red-500 to-red-600', bg: 'bg-red-100', text: 'text-red-700' },
                  { key: 'high', label: 'High', color: 'from-orange-500 to-orange-600', bg: 'bg-orange-100', text: 'text-orange-700' },
                  { key: 'medium', label: 'Medium', color: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-100', text: 'text-yellow-700' },
                  { key: 'low', label: 'Low', color: 'from-green-500 to-green-600', bg: 'bg-green-100', text: 'text-green-700' },
                ].map((severity) => {
                  const count = severityCounts[severity.key] || 0;
                  const percentage = totalSeverity > 0 ? Math.round((count / totalSeverity) * 100) : 0;

                  return (
                    <div key={severity.key} className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-4 h-4 rounded-full bg-gradient-to-r shadow-sm', severity.color)} />
                        <span className="text-sm font-medium text-sage-700 capitalize">{severity.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold', severity.bg, severity.text)}>
                          {count}
                        </span>
                        <span className="text-xs text-sage-400 w-10 text-right">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Severity Alert Banner */}
            {(severityCounts.critical || 0) > 0 && (
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-red-800">{severityCounts.critical} Critical Reports</p>
                  <p className="text-sm text-red-600">Require immediate attention</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-sage-50 to-sage-100 border border-sage-200">
        <div className="flex items-center gap-3 text-sm text-sage-600">
          <Activity className="w-5 h-5 text-forest-600" />
          <span>Data updated in real-time</span>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost text-sm py-2 px-4 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}
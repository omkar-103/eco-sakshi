// components/admin/AdminSubscriptionsList.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Crown,
  Building2,
  Loader2,
  Calendar,
  DollarSign,
  TrendingUp,
  CreditCard,
} from 'lucide-react';
import { cn, formatDate, formatRelativeTime } from '@/lib/utils/helpers';

export default function AdminSubscriptionsList() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    revenue: 0,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasMore: false,
  });
  const [filters, setFilters] = useState({
    status: '',
    plan: '',
  });

  const fetchSubscriptions = async (page: number = 1) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });

      if (filters.status) params.append('status', filters.status);
      if (filters.plan) params.append('plan', filters.plan);

      const response = await fetch(`/api/admin/subscriptions?${params}`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        setSubscriptions(data.data);
        setPagination(data.pagination);
        if (data.stats) setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions(1);
  }, [filters.status, filters.plan]);

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    cancelled: 'bg-amber-100 text-amber-700',
    expired: 'bg-red-100 text-red-700',
    pending: 'bg-blue-100 text-blue-700',
  };

  const planIcons: Record<string, any> = {
    premium: Crown,
    enterprise: Building2,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center">
              <Crown className="w-5 h-5 text-forest-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-sage-900">{stats.total}</p>
              <p className="text-sm text-sage-600">Total Subscriptions</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-sage-900">{stats.active}</p>
              <p className="text-sm text-sage-600">Active</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-sage-900">₹{stats.revenue.toLocaleString()}</p>
              <p className="text-sm text-sage-600">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="input-field sm:w-48"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>

          <select
            value={filters.plan}
            onChange={(e) => setFilters({ ...filters, plan: e.target.value })}
            className="input-field sm:w-48"
          >
            <option value="">All Plans</option>
            <option value="premium">Premium</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Subscriptions Table */}
      {loading ? (
        <div className="card flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
          <span className="ml-3 text-sage-600">Loading subscriptions...</span>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="card text-center py-12">
          <CreditCard className="w-12 h-12 text-sage-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-sage-900 mb-2">No subscriptions found</h3>
          <p className="text-sage-600">No subscriptions match your filters.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sage-50 border-b border-sage-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-sage-700">User</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-sage-700">Plan</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-sage-700">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-sage-700">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-sage-700">Valid Until</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-sage-700">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100">
                {subscriptions.map((sub) => {
                  const PlanIcon = planIcons[sub.plan] || Crown;
                  return (
                    <tr key={sub._id} className="hover:bg-sage-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {sub.userId?.avatar ? (
                            <img
                              src={sub.userId.avatar}
                              alt=""
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center">
                              <span className="text-forest-700 font-semibold text-sm">
                                {sub.userId?.name?.charAt(0) || '?'}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-sage-900">{sub.userId?.name}</p>
                            <p className="text-xs text-sage-500">{sub.userId?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <PlanIcon
                            className={cn(
                              'w-4 h-4',
                              sub.plan === 'premium' ? 'text-forest-600' : 'text-purple-600'
                            )}
                          />
                          <span className="capitalize font-medium text-sage-700">{sub.plan}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn('badge', statusColors[sub.status])}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-sage-900">₹{sub.amount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-sage-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(sub.endDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-sage-500">
                          {formatRelativeTime(sub.createdAt)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-sage-600">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchSubscriptions(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="btn-ghost p-2 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => fetchSubscriptions(pagination.page + 1)}
              disabled={!pagination.hasMore}
              className="btn-ghost p-2 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
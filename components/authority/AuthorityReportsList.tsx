'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  AlertTriangle,
  Loader2,
  Eye,
  User,
} from 'lucide-react';
import {
  cn,
  formatRelativeTime,
  getCategoryLabel,
  getStatusColor,
  getSeverityColor,
  getStatusLabel,
} from '@/lib/utils/helpers';
import { REPORT_CATEGORIES, REPORT_STATUSES, SEVERITY_LEVELS } from '@/lib/utils/constants';

interface AuthorityReportsListProps {
  defaultStatus?: string;
}

export default function AuthorityReportsList({ defaultStatus }: AuthorityReportsListProps) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasMore: false,
  });

  const [filters, setFilters] = useState({
    status: defaultStatus || '',
    category: '',
    severity: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  const [showFilters, setShowFilters] = useState(false);

  const fetchReports = async (page: number = 1) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.severity) params.append('severity', filters.severity);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/reports?${params}`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        setReports(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(1);
  }, [filters.status, filters.category, filters.severity, filters.sortBy, filters.sortOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports(1);
  };

  const getSeverityBadgeColor = (severity: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-700 border-green-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      critical: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[severity] || colors.medium;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
            <input
              type="text"
              placeholder="Search by title, description, or complaint ID..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="input-field pl-10"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={cn('btn-ghost', showFilters && 'bg-sage-100')}
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>
        </form>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-sage-200 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-down">
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="input-field"
              >
                <option value="">All Statuses</option>
                {REPORT_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="input-field"
              >
                <option value="">All Categories</option>
                {REPORT_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Severity
              </label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                className="input-field"
              >
                <option value="">All Severities</option>
                {SEVERITY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Sort By
              </label>
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setFilters({ ...filters, sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
                }}
                className="input-field"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="severity-desc">Severity (High to Low)</option>
                <option value="severity-asc">Severity (Low to High)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {!defaultStatus && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Pending', value: 'pending', color: 'bg-amber-500' },
            { label: 'Verified', value: 'verified', color: 'bg-blue-500' },
            { label: 'Under Review', value: 'under-review', color: 'bg-purple-500' },
            { label: 'In Progress', value: 'in-progress', color: 'bg-indigo-500' },
            { label: 'Resolved', value: 'resolved', color: 'bg-green-500' },
          ].map((stat) => (
            <button
              key={stat.value}
              onClick={() => setFilters({ ...filters, status: filters.status === stat.value ? '' : stat.value })}
              className={cn(
                'p-4 rounded-xl border-2 transition-all text-left',
                filters.status === stat.value
                  ? 'border-forest-500 bg-forest-50'
                  : 'border-sage-200 hover:border-sage-300 bg-white'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={cn('w-2 h-2 rounded-full', stat.color)} />
                <span className="text-sm font-medium text-sage-700">{stat.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Reports Table/List */}
      {loading ? (
        <div className="card flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
          <span className="ml-3 text-sage-600">Loading reports...</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="card text-center py-12">
          <AlertTriangle className="w-12 h-12 text-sage-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-sage-900 mb-2">No reports found</h3>
          <p className="text-sage-600">
            {filters.search || filters.status || filters.category
              ? 'Try adjusting your filters'
              : 'No reports have been submitted yet'}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sage-50 border-b border-sage-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-sage-700">
                    Report
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-sage-700">
                    Reporter
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-sage-700">
                    Location
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-sage-700">
                    Severity
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-sage-700">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-sage-700">
                    Date
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-sage-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100">
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-sage-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {report.media?.[0] && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-sage-100 flex-shrink-0">
                            <img
                              src={report.media[0].url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-mono text-forest-600 mb-1">
                            {report.complaintId}
                          </p>
                          <p className="font-medium text-sage-900 truncate max-w-[200px]">
                            {report.title}
                          </p>
                          <p className="text-xs text-sage-500">
                            {getCategoryLabel(report.category)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-sage-400" />
                        <span className="text-sm text-sage-700">
                          {report.userId?.name || 'Anonymous'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-sage-400" />
                        <span className="text-sm text-sage-700 truncate max-w-[150px]">
                          {report.location?.city || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('badge border', getSeverityBadgeColor(report.severity))}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('badge', getStatusColor(report.status))}>
                        {getStatusLabel(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-sage-600">
                        <Calendar className="w-4 h-4" />
                        {formatRelativeTime(report.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/authority/reports/${report._id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-forest-600 hover:text-forest-700"
                      >
                        <Eye className="w-4 h-4" />
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-sage-600">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} reports
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchReports(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="btn-ghost p-2 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-sage-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchReports(pagination.page + 1)}
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
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useReports } from '@/hooks/useReports';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileText,
  MapPin,
  Calendar,
  Eye,
  Loader2,
} from 'lucide-react';
import { cn, formatRelativeTime, getCategoryLabel, getStatusColor, getSeverityColor } from '@/lib/utils/helpers';
import { REPORT_CATEGORIES, REPORT_STATUSES } from '@/lib/utils/constants';

export default function ReportsList() {
  const { reports, loading, pagination, fetchReports } = useReports({ limit: 10 });
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchReports(1, filters);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports(1, filters);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchReports(1, newFilters);
  };

  const handlePageChange = (page: number) => {
    fetchReports(page, filters);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
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
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'btn-ghost',
              showFilters && 'bg-sage-100'
            )}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-sage-200 grid sm:grid-cols-2 gap-4 animate-slide-down">
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
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
                onChange={(e) => handleFilterChange('category', e.target.value)}
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
          </div>
        )}
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="card flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
          <span className="ml-3 text-sage-600">Loading reports...</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-sage-400" />
          </div>
          <h3 className="text-lg font-semibold text-sage-900 mb-2">No reports found</h3>
          <p className="text-sage-600 mb-6">
            {filters.search || filters.status || filters.category
              ? 'Try adjusting your filters'
              : "You haven't submitted any reports yet"}
          </p>
          <Link href="/citizen/reports/new" className="btn-primary inline-flex">
            Submit Your First Report
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report: any) => (
            <Link
              key={report._id}
              href={`/citizen/reports/${report._id}`}
              className="card block hover:shadow-soft-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Thumbnail */}
                {report.media?.[0] && (
                  <div className="w-full sm:w-24 h-32 sm:h-24 rounded-lg overflow-hidden bg-sage-100 flex-shrink-0">
                    {report.media[0].type === 'image' ? (
                      <img
                        src={report.media[0].url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={report.media[0].url}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-forest-600 bg-forest-50 px-2 py-0.5 rounded">
                      {report.complaintId}
                    </span>
                    <span className={cn('badge', getStatusColor(report.status))}>
                      {report.status.replace('-', ' ')}
                    </span>
                    <span className={cn('badge border', getSeverityColor(report.severity))}>
                      {report.severity}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-sage-900 mb-1 truncate">
                    {report.title}
                  </h3>

                  <p className="text-sage-600 text-sm mb-3 line-clamp-2">
                    {report.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-sage-500">
                    <span className="inline-flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {getCategoryLabel(report.category)}
                    </span>
                    {report.location?.city && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {report.location.city}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatRelativeTime(report.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {report.viewCount} views
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
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
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="btn-ghost p-2 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-sage-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
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
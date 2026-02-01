'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Download,
  Loader2,
  FileText,
  Eye,
} from 'lucide-react';
import {
  cn,
  formatRelativeTime,
  getCategoryLabel,
  getStatusColor,
  getSeverityColor,
  getStatusLabel,
} from '@/lib/utils/helpers';
import { REPORT_CATEGORIES, SEVERITY_LEVELS } from '@/lib/utils/constants';

export default function NgoReportsList() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    hasMore: false,
  });

  const [filters, setFilters] = useState({
    category: '',
    severity: '',
    search: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  const fetchReports = async (page: number = 1) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

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
  }, [filters.category, filters.severity]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports(1);
  };

  const handleExport = () => {
    // Export as CSV
    const csvContent = [
      ['Complaint ID', 'Title', 'Category', 'Severity', 'Status', 'City', 'State', 'Date'].join(','),
      ...reports.map((r) =>
        [
          r.complaintId,
          `"${r.title.replace(/"/g, '""')}"`,
          r.category,
          r.severity,
          r.status,
          r.location?.city || '',
          r.location?.state || '',
          new Date(r.createdAt).toISOString().split('T')[0],
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `environmental-reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
              placeholder="Search reports..."
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
            <button
              type="button"
              onClick={handleExport}
              className="btn-secondary"
              disabled={reports.length === 0}
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </form>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-sage-200 grid sm:grid-cols-2 gap-4 animate-slide-down">
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
          </div>
        )}
      </div>

      {/* Reports Table */}
      {loading ? (
        <div className="card flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
          <span className="ml-3 text-sage-600">Loading data...</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="w-12 h-12 text-sage-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-sage-900 mb-2">No data available</h3>
          <p className="text-sage-600">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-sage-50 border-b border-sage-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-sage-700">ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-sage-700">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-sage-700">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-sage-700">Severity</th>
                  <th className="text-left px-4 py-3 font-semibold text-sage-700">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-sage-700">Location</th>
                  <th className="text-left px-4 py-3 font-semibold text-sage-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100">
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-sage-50">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-forest-600">
                        {report.complaintId}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-sage-900 truncate block max-w-[200px]">
                        {report.title}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sage-700">
                        {getCategoryLabel(report.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('badge border text-xs', getSeverityColor(report.severity))}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('badge text-xs', getStatusColor(report.status))}>
                        {getStatusLabel(report.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sage-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {report.location?.city || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sage-500">
                        {formatRelativeTime(report.createdAt)}
                      </span>
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
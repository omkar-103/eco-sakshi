// components/admin/AdminReportsList.tsx
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
  Loader2,
  Eye,
  Trash2,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertTriangle,
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
import toast from 'react-hot-toast';

export default function AdminReportsList() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    hasMore: false,
  });
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    severity: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const fetchReports = async (page: number = 1) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
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
  }, [filters.status, filters.category, filters.severity]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports(1);
  };

  const handleSelectAll = () => {
    if (selectedReports.length === reports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(reports.map((r) => r._id));
    }
  };

  const handleSelectReport = (id: string) => {
    if (selectedReports.includes(id)) {
      setSelectedReports(selectedReports.filter((r) => r !== id));
    } else {
      setSelectedReports([...selectedReports, id]);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedReports.length === 0) return;

    try {
      const response = await fetch('/api/admin/reports/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: bulkAction,
          reportIds: selectedReports,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`${selectedReports.length} reports updated`);
        setSelectedReports([]);
        setBulkAction('');
        fetchReports(pagination.page);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to perform bulk action');
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Report deleted');
        fetchReports(pagination.page);
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast.error('Failed to delete report');
    }
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
          </div>
        </form>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-sage-200 grid sm:grid-cols-3 gap-4 animate-slide-down">
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
        )}
      </div>

      {/* Bulk Actions */}
      {selectedReports.length > 0 && (
        <div className="card bg-forest-50 border border-forest-200 animate-slide-down">
          <div className="flex items-center justify-between">
            <span className="text-forest-700 font-medium">
              {selectedReports.length} report(s) selected
            </span>
            <div className="flex items-center gap-3">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="input-field py-2 w-48"
              >
                <option value="">Select Action</option>
                <option value="verify">Mark as Verified</option>
                <option value="resolve">Mark as Resolved</option>
                <option value="reject">Mark as Rejected</option>
                <option value="delete">Delete Reports</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className="btn-primary py-2"
              >
                Apply
              </button>
              <button
                onClick={() => setSelectedReports([])}
                className="btn-ghost py-2"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports Table */}
      {loading ? (
        <div className="card flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
          <span className="ml-3 text-sage-600">Loading reports...</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="card text-center py-12">
          <AlertTriangle className="w-12 h-12 text-sage-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-sage-900 mb-2">No reports found</h3>
          <p className="text-sage-600">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sage-50 border-b border-sage-200">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedReports.length === reports.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-sage-300"
                    />
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-sage-700">
                    Report
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-sage-700">
                    Reporter
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-sage-700">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-sage-700">
                    Severity
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-sage-700">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-sage-700">
                    Date
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-sage-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100">
                {reports.map((report) => (
                  <tr
                    key={report._id}
                    className={cn(
                      'hover:bg-sage-50',
                      selectedReports.includes(report._id) && 'bg-forest-50'
                    )}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report._id)}
                        onChange={() => handleSelectReport(report._id)}
                        className="w-4 h-4 rounded border-sage-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-mono text-forest-600">
                        {report.complaintId}
                      </p>
                      <p className="font-medium text-sage-900 truncate max-w-[200px]">
                        {report.title}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-sage-700">{report.userId?.name || 'Unknown'}</p>
                      <p className="text-xs text-sage-500">{report.userId?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-sage-700">
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
                      <span className="text-sm text-sage-600">
                        {formatRelativeTime(report.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/authority/reports/${report._id}`}
                          className="p-2 rounded-lg hover:bg-sage-100 text-sage-600"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveMenu(activeMenu === report._id ? null : report._id)
                            }
                            className="p-2 rounded-lg hover:bg-sage-100 text-sage-600"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenu === report._id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setActiveMenu(null)}
                              />
                              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-soft-lg border border-sage-200 py-1 z-50 animate-scale-in">
                                <button
                                  onClick={() => {
                                    setActiveMenu(null);
                                    handleDeleteReport(report._id);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
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
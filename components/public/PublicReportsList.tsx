// components/public/PublicReportsList.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  ChevronRight,
  Filter,
  Search,
  Eye,
  Image as ImageIcon,
} from 'lucide-react';
import {
  cn,
  formatRelativeTime,
  getCategoryLabel,
  getStatusLabel,
  getStatusColor,
  getSeverityColor,
} from '@/lib/utils/helpers';
import { REPORT_CATEGORIES, SEVERITY_LEVELS } from '@/lib/utils/constants';

interface PublicReportsListProps {
  reports: any[];
}

export default function PublicReportsList({ reports }: PublicReportsListProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');

  const filteredReports = reports.filter((report) => {
    if (category && report.category !== category) return false;
    if (severity && report.severity !== severity) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        report.title?.toLowerCase().includes(searchLower) ||
        report.complaintId?.toLowerCase().includes(searchLower) ||
        report.location?.city?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field md:w-48"
          >
            <option value="">All Categories</option>
            {REPORT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="input-field md:w-40"
          >
            <option value="">All Severity</option>
            {SEVERITY_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sage-600 text-sm">
        Showing {filteredReports.length} of {reports.length} reports
      </p>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="card text-center py-12">
          <Eye className="w-12 h-12 text-sage-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-sage-900 mb-2">No reports found</h3>
          <p className="text-sage-600">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report, index) => (
            <Link
              key={report._id}
              href={`/reports/public/${report._id}`}
              className="card group hover:-translate-y-1 transition-all duration-300 overflow-hidden p-0"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image */}
              <div className="relative h-40 bg-gradient-to-br from-sage-100 to-sage-200 overflow-hidden">
                {report.media?.[0] ? (
                  <img
                    src={report.media[0].url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-sage-300" />
                  </div>
                )}
                
                {/* Severity Badge */}
                <div className="absolute top-3 left-3">
                  <span className={cn('badge border text-xs', getSeverityColor(report.severity))}>
                    {report.severity?.toUpperCase()}
                  </span>
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={cn('badge text-xs', getStatusColor(report.status))}>
                    {getStatusLabel(report.status)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-xs font-mono text-forest-600 mb-2">
                  {report.complaintId}
                </p>
                
                <h3 className="font-semibold text-sage-900 mb-2 line-clamp-2 group-hover:text-forest-700 transition-colors">
                  {report.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-sage-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Filter className="w-3 h-3" />
                    {getCategoryLabel(report.category)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatRelativeTime(report.createdAt)}
                  </span>
                </div>

                {report.location?.city && (
                  <p className="text-xs text-sage-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {report.location.city}, {report.location.state}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-sage-100 flex items-center justify-between">
                  <span className="text-xs text-forest-600 font-medium group-hover:underline">
                    View Details
                  </span>
                  <ChevronRight className="w-4 h-4 text-sage-400 group-hover:text-forest-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
// components/public/PublicReportsClient.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  ChevronRight,
  Search,
  Eye,
  Image as ImageIcon,
  Filter,
  Loader2,
  AlertTriangle,
  RefreshCw,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  cn,
  formatRelativeTime,
  getCategoryLabel,
  getStatusLabel,
} from '@/lib/utils/helpers';
import { REPORT_CATEGORIES, SEVERITY_LEVELS } from '@/lib/utils/constants';

export default function PublicReportsClient() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [category, severity]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (severity) params.append('severity', severity);

      const response = await fetch(`/api/reports/public?${params}`);
      const data = await response.json();

      // DEBUG: Log the response to see media structure
      console.log('API Response:', data);
      if (data.data && data.data.length > 0) {
        console.log('First report:', data.data[0]);
        console.log('First report media:', data.data[0]?.media);
      }

      if (data.success) {
        setReports(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch reports');
      }
    } catch (err) {
      setError('Failed to fetch reports');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setSeverity('');
  };

  const hasActiveFilters = search || category || severity;

  const filteredReports = reports.filter((report) => {
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        report.title?.toLowerCase().includes(searchLower) ||
        report.complaintId?.toLowerCase().includes(searchLower) ||
        report.location?.city?.toLowerCase().includes(searchLower) ||
        report.location?.address?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Helper function to get image URL safely
  const getImageUrl = (report: any): string | null => {
    // Check different possible structures
    if (report.media && Array.isArray(report.media) && report.media.length > 0) {
      const firstMedia = report.media[0];
      
      // If media item is a string (direct URL)
      if (typeof firstMedia === 'string') {
        return firstMedia;
      }
      
      // If media item is an object with url property
      if (firstMedia && typeof firstMedia === 'object') {
        return firstMedia.url || firstMedia.secure_url || firstMedia.path || null;
      }
    }
    
    // Check if there's a single image field
    if (report.image) {
      return typeof report.image === 'string' ? report.image : report.image.url;
    }
    
    // Check for images array
    if (report.images && Array.isArray(report.images) && report.images.length > 0) {
      const firstImage = report.images[0];
      return typeof firstImage === 'string' ? firstImage : firstImage.url;
    }
    
    return null;
  };

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-red-100 p-8 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-100 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Error Loading Reports</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={fetchReports} 
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, ID, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
          
          {/* Desktop Filters */}
          <div className="hidden lg:flex gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all min-w-[180px]"
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
              className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all min-w-[150px]"
            >
              <option value="">All Severity</option>
              {SEVERITY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center gap-2 h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
            {hasActiveFilters && (
              <span className="w-5 h-5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {[category, severity].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Filters Dropdown */}
        {showFilters && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-100 space-y-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Severity</option>
              {SEVERITY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Active filters:</span>
            {category && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-lg">
                {getCategoryLabel(category)}
                <button onClick={() => setCategory('')} className="hover:text-emerald-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {severity && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-lg capitalize">
                {severity}
                <button onClick={() => setSeverity('')} className="hover:text-amber-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 text-sm font-medium">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading reports...
            </span>
          ) : (
            `Showing ${filteredReports.length} report${filteredReports.length !== 1 ? 's' : ''}`
          )}
        </p>
        {!loading && (
          <button
            onClick={fetchReports}
            className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
          <p className="text-gray-600 font-medium">Loading reports...</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Eye className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-600 max-w-sm mx-auto">
            {hasActiveFilters 
              ? 'Try adjusting your filters to see more results' 
              : 'No reports have been submitted yet. Be the first to report!'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report, index) => {
            const imageUrl = getImageUrl(report);
            
            return (
              <Link
                key={report._id}
                href={`/reports/public/${report._id}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image */}
                <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {imageUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt={report.title || 'Report image'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          console.log('Image failed to load:', imageUrl);
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          // Show the fallback
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', imageUrl);
                        }}
                      />
                      {/* Fallback shown when image fails */}
                      <div 
                        className="w-full h-full flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 absolute inset-0"
                        style={{ display: 'none' }}
                      >
                        <ImageIcon className="w-12 h-12 text-emerald-300 mb-2" />
                        <span className="text-xs text-emerald-400 font-medium">Image unavailable</span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
                      <ImageIcon className="w-12 h-12 text-emerald-300 mb-2" />
                      <span className="text-xs text-emerald-400 font-medium">No image</span>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  {/* Severity Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className={cn(
                      'px-2.5 py-1 text-xs font-bold rounded-lg border backdrop-blur-sm',
                      report.severity === 'critical' && 'bg-red-500/90 text-white border-red-400',
                      report.severity === 'high' && 'bg-orange-500/90 text-white border-orange-400',
                      report.severity === 'medium' && 'bg-amber-500/90 text-white border-amber-400',
                      report.severity === 'low' && 'bg-green-500/90 text-white border-green-400',
                      !report.severity && 'bg-gray-500/90 text-white border-gray-400'
                    )}>
                      {(report.severity || 'N/A').toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className={cn(
                      'px-2.5 py-1 text-xs font-semibold rounded-lg',
                      report.status === 'resolved' && 'bg-green-100 text-green-700',
                      report.status === 'in-progress' && 'bg-blue-100 text-blue-700',
                      report.status === 'verified' && 'bg-emerald-100 text-emerald-700',
                      report.status === 'pending' && 'bg-amber-100 text-amber-700',
                      report.status === 'under-review' && 'bg-purple-100 text-purple-700',
                      report.status === 'rejected' && 'bg-red-100 text-red-700'
                    )}>
                      {getStatusLabel(report.status || 'pending')}
                    </span>
                  </div>

                  {/* Media Count Badge */}
                  {report.media && report.media.length > 1 && (
                    <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
                      <ImageIcon className="w-3 h-3" />
                      {report.media.length}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block mb-3">
                    {report.complaintId}
                  </p>
                  
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug">
                    {report.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md">
                      <Filter className="w-3 h-3" />
                      {getCategoryLabel(report.category)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {formatRelativeTime(report.createdAt)}
                    </span>
                  </div>

                  {(report.location?.city || report.location?.address) && (
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 truncate mb-4">
                      <MapPin className="w-3 h-3 flex-shrink-0 text-emerald-500" />
                      {report.location.city 
                        ? `${report.location.city}${report.location.state ? `, ${report.location.state}` : ''}`
                        : report.location.address
                      }
                    </p>
                  )}

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      {(report.viewCount || 0).toLocaleString()} views
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
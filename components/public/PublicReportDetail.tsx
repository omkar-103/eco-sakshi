// components/public/PublicReportDetail.tsx
'use client';

import { useState } from 'react';
import {
  MapPin,
  Calendar,
  Eye,
  FileText,
  ChevronDown,
  ChevronUp,
  Share2,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Copy,
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Building2,
  Hash,
  TrendingUp,
} from 'lucide-react';
import {
  cn,
  formatDateTime,
  formatRelativeTime,
  getCategoryLabel,
  getStatusLabel,
  getStatusColor,
  getSeverityColor,
} from '@/lib/utils/helpers';
import toast from 'react-hot-toast';

interface PublicReportDetailProps {
  report: any;
}

export default function PublicReportDetail({ report }: PublicReportDetailProps) {
  const [showHistory, setShowHistory] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: report.title,
          text: `Environmental Report: ${report.title}`,
          url: window.location.href,
        });
      } else {
        throw new Error('Share not supported');
      }
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleCopyId = async () => {
    await navigator.clipboard.writeText(report.complaintId);
    toast.success('Complaint ID copied!');
  };

  const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
    pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    verified: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    'under-review': { icon: Eye, color: 'text-purple-600', bg: 'bg-purple-100' },
    'in-progress': { icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
    resolved: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    rejected: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  };

  const currentStatus = statusConfig[report.status] || statusConfig.pending;
  const StatusIcon = currentStatus.icon;

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null || !report.media) return;
    const newIndex = direction === 'prev' 
      ? (selectedImageIndex - 1 + report.media.length) % report.media.length
      : (selectedImageIndex + 1) % report.media.length;
    setSelectedImageIndex(newIndex);
  };

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
        {/* Hero Image */}
        {report.media && report.media.length > 0 && report.media[0]?.url && (
          <div className="relative h-64 md:h-80 lg:h-96 bg-gray-900">
            <img
              src={report.media[0].url}
              alt={report.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Badges on Image */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className={cn(
                'px-3 py-1.5 text-sm font-bold rounded-lg border backdrop-blur-sm',
                report.severity === 'critical' && 'bg-red-500/90 text-white border-red-400',
                report.severity === 'high' && 'bg-orange-500/90 text-white border-orange-400',
                report.severity === 'medium' && 'bg-amber-500/90 text-white border-amber-400',
                report.severity === 'low' && 'bg-green-500/90 text-white border-green-400'
              )}>
                {report.severity?.toUpperCase()} SEVERITY
              </span>
            </div>

            <div className="absolute top-4 right-4">
              <span className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg backdrop-blur-sm',
                currentStatus.bg,
                currentStatus.color
              )}>
                <StatusIcon className="w-4 h-4" />
                {getStatusLabel(report.status)}
              </span>
            </div>
            
            {/* Title on Image */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-display leading-tight">
                {report.title}
              </h1>
            </div>

            {/* View Full Button */}
            <button
              onClick={() => setSelectedImageIndex(0)}
              className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white text-sm font-medium rounded-lg hover:bg-white/30 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
              View Full
            </button>
          </div>
        )}

        {/* Content without hero image */}
        {(!report.media || report.media.length === 0 || !report.media[0]?.url) && (
          <div className="p-6 pb-0">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={cn(
                'px-3 py-1.5 text-sm font-bold rounded-lg border',
                report.severity === 'critical' && 'bg-red-100 text-red-700 border-red-200',
                report.severity === 'high' && 'bg-orange-100 text-orange-700 border-orange-200',
                report.severity === 'medium' && 'bg-amber-100 text-amber-700 border-amber-200',
                report.severity === 'low' && 'bg-green-100 text-green-700 border-green-200'
              )}>
                {report.severity?.toUpperCase()} SEVERITY
              </span>
              <span className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg',
                currentStatus.bg,
                currentStatus.color
              )}>
                <StatusIcon className="w-4 h-4" />
                {getStatusLabel(report.status)}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-display">
              {report.title}
            </h1>
          </div>
        )}

        {/* Meta Info */}
        <div className="p-6">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            <span className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
              <FileText className="w-4 h-4 text-emerald-600" />
              {getCategoryLabel(report.category)}
            </span>
            <span className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
              <Calendar className="w-4 h-4 text-emerald-600" />
              {formatDateTime(report.createdAt)}
            </span>
            <span className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
              <Eye className="w-4 h-4 text-emerald-600" />
              {(report.viewCount || 0).toLocaleString()} views
            </span>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition-colors font-medium"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          {/* Complaint ID Card */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-200 flex items-center justify-center">
                  <Hash className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-xs text-emerald-600 font-medium mb-0.5">Complaint ID</p>
                  <p className="font-mono font-bold text-emerald-800 text-lg">{report.complaintId}</p>
                </div>
              </div>
              <button
                onClick={handleCopyId}
                className="flex items-center gap-1.5 px-3 py-2 bg-white text-emerald-700 text-sm font-medium rounded-lg border border-emerald-200 hover:bg-emerald-50 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Description Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Description</h2>
        </div>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {report.description}
        </p>
      </div>

      {/* Location Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Location</h2>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="font-semibold text-gray-900 mb-1">
            {report.location?.address || 'Location captured via GPS'}
          </p>
          {report.location?.city && (
            <p className="text-gray-600">
              {report.location.city}
              {report.location.state && `, ${report.location.state}`}
              {report.location.pincode && ` - ${report.location.pincode}`}
            </p>
          )}
          {report.location?.coordinates && (
            <p className="text-xs text-gray-400 mt-2 font-mono">
              Coordinates: {report.location.coordinates[1]?.toFixed(6)}, {report.location.coordinates[0]?.toFixed(6)}
            </p>
          )}
        </div>
      </div>

      {/* Media Gallery */}
      {report.media && report.media.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Evidence 
              <span className="text-gray-500 font-normal ml-2">({report.media.length} files)</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {report.media.map((item: any, index: number) => (
              item?.url && (
                <button
                  key={index}
                  className="group aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer relative"
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={item.url}
                    alt={`Evidence ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              )
            ))}
          </div>
        </div>
      )}

      {/* Status History */}
      {report.statusHistory && report.statusHistory.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Status History
                <span className="text-gray-500 font-normal ml-2">({report.statusHistory.length} updates)</span>
              </h2>
            </div>
            {showHistory ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {showHistory && (
            <div className="px-6 pb-6">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-400 via-gray-300 to-gray-200" />
                
                <div className="space-y-4">
                  {report.statusHistory.map((entry: any, index: number) => {
                    const entryStatus = statusConfig[entry.status] || statusConfig.pending;
                    const EntryIcon = entryStatus.icon;
                    
                    return (
                      <div key={index} className="relative flex gap-4 pl-1">
                        <div className={cn(
                          "relative z-10 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                          index === 0 ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg' : 'bg-gray-200'
                        )}>
                          <EntryIcon className={cn("w-4 h-4", index === 0 ? 'text-white' : 'text-gray-500')} />
                          {index === 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                          )}
                        </div>

                        <div className={cn(
                          "flex-1 pb-4",
                          index === 0 && "bg-gradient-to-r from-emerald-50/80 to-transparent -ml-2 pl-4 py-3 rounded-xl"
                        )}>
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className={cn(
                              'px-2.5 py-1 text-xs font-semibold rounded-lg',
                              entryStatus.bg,
                              entryStatus.color
                            )}>
                              {getStatusLabel(entry.status)}
                            </span>
                            {index === 0 && (
                              <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-1">
                            {formatDateTime(entry.changedAt)}
                            {entry.changedBy?.name && (
                              <span className="ml-2">by {entry.changedBy.name}</span>
                            )}
                          </p>
                          {entry.notes && (
                            <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-3 rounded-lg">
                              {entry.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Authority Response */}
      {report.authorityResponse && report.authorityResponse.actionTaken && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-200 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-900">Authority Response</h2>
              {report.authorityResponse.respondedAt && (
                <p className="text-sm text-emerald-600">
                  {formatDateTime(report.authorityResponse.respondedAt)}
                </p>
              )}
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50">
            <p className="text-emerald-800 leading-relaxed">
              {report.authorityResponse.actionTaken}
            </p>
            {report.authorityResponse.message && (
              <p className="text-emerald-700 mt-3 pt-3 border-t border-emerald-200">
                {report.authorityResponse.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {selectedImageIndex !== null && report.media && report.media[selectedImageIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            onClick={() => setSelectedImageIndex(null)}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation */}
          {report.media.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image */}
          <img
            src={report.media[selectedImageIndex].url}
            alt={`Evidence ${selectedImageIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium">
            {selectedImageIndex + 1} / {report.media.length}
          </div>
        </div>
      )}
    </div>
  );
}
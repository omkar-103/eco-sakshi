'use client';

import { useState } from 'react';
import {
  MapPin,
  Calendar,
  Eye,
  User,
  CheckCircle2,
  FileText,
  ChevronDown,
  ChevronUp,
  Share2,
  Trash2,
  MessageSquare,
  Image as ImageIcon,
  Copy,
  Check,
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

interface ReportDetailProps {
  report: any;
  userRole: string;
}

export default function ReportDetail({ report, userRole }: ReportDetailProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyComplaintId = async () => {
    try {
      await navigator.clipboard.writeText(report.complaintId);
      setCopied(true);
      toast.success('Complaint ID copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  // Safe date formatting
  const createdAtFormatted = formatDateTime(report?.createdAt);
  const reportUser = report?.userId || report?.user;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <button
                onClick={copyComplaintId}
                className="text-sm font-mono text-forest-600 bg-forest-50 px-3 py-1.5 rounded-lg hover:bg-forest-100 transition-colors flex items-center gap-2"
                title="Click to copy"
              >
                {report?.complaintId || 'N/A'}
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <span className={cn('badge text-sm', getStatusColor(report?.status))}>
                {getStatusLabel(report?.status || 'pending')}
              </span>
              <span className={cn('badge border text-sm', getSeverityColor(report?.severity))}>
                {(report?.severity || 'medium').toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-sage-900 font-display">
              {report?.title || 'Untitled Report'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn-ghost p-2" title="Share">
              <Share2 className="w-5 h-5" />
            </button>
            {userRole === 'citizen' && report?.status === 'pending' && (
              <button className="btn-ghost p-2 text-red-600 hover:bg-red-50" title="Delete">
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-6 text-sm text-sage-600">
          <span className="inline-flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {getCategoryLabel(report?.category || 'other')}
          </span>
          <span className="inline-flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {createdAtFormatted}
          </span>
          <span className="inline-flex items-center gap-2">
            <Eye className="w-4 h-4" />
            {report?.viewCount || 0} views
          </span>
          {reportUser && (
            <span className="inline-flex items-center gap-2">
              <User className="w-4 h-4" />
              {reportUser?.name || 'Anonymous'}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="card">
        <h2 className="text-lg font-semibold text-sage-900 font-display mb-4">
          Description
        </h2>
        <p className="text-sage-700 whitespace-pre-wrap leading-relaxed">
          {report?.description || 'No description provided.'}
        </p>
      </div>

      {/* Location */}
      <div className="card">
        <h2 className="text-lg font-semibold text-sage-900 font-display mb-4">
          Location
        </h2>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-6 h-6 text-forest-600" />
          </div>
          <div>
            <p className="font-medium text-sage-900">
              {report?.location?.address || 'Location captured'}
            </p>
            {report?.location?.city && (
              <p className="text-sage-600 text-sm">
                {report.location.city}, {report.location.state} {report.location.pincode}
              </p>
            )}
            {report?.location?.coordinates && report.location.coordinates.length === 2 && (
              <p className="text-sage-500 text-xs mt-1">
                Coordinates: {report.location.coordinates[1]?.toFixed?.(6) || 'N/A'}, {report.location.coordinates[0]?.toFixed?.(6) || 'N/A'}
              </p>
            )}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-4 h-48 rounded-xl bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center">
          <p className="text-sage-500">Map view available in Map section</p>
        </div>
      </div>

      {/* Media */}
      {report?.media && report.media.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-sage-900 font-display mb-4">
            Evidence ({report.media.length} files)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {report.media.map((item: any, index: number) => (
              <div
                key={index}
                className="aspect-square rounded-xl overflow-hidden bg-sage-100 cursor-pointer hover:opacity-90 transition-opacity group relative"
                onClick={() => setSelectedImage(item.url)}
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={`Evidence ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Authority Response */}
      {report?.authorityResponse && (
        <div className="card border-l-4 border-forest-500 bg-gradient-to-r from-forest-50/50 to-transparent">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-forest-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-sage-900 font-display">
                Authority Response
              </h2>
              <p className="text-sm text-sage-500">
                {formatDateTime(report.authorityResponse.respondedAt)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {report.authorityResponse.message && (
              <div>
                <p className="text-sm font-medium text-sage-700 mb-1">Message</p>
                <p className="text-sage-800">{report.authorityResponse.message}</p>
              </div>
            )}
            {report.authorityResponse.actionTaken && (
              <div>
                <p className="text-sm font-medium text-sage-700 mb-1">Action Taken</p>
                <p className="text-sage-800">{report.authorityResponse.actionTaken}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status History */}
      {report?.statusHistory && report.statusHistory.length > 0 && (
        <div className="card">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between"
          >
            <h2 className="text-lg font-semibold text-sage-900 font-display">
              Status History ({report.statusHistory.length})
            </h2>
            {showHistory ? (
              <ChevronUp className="w-5 h-5 text-sage-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-sage-500" />
            )}
          </button>

          {showHistory && (
            <div className="mt-6 space-y-4">
              {report.statusHistory.map((entry: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full',
                        index === 0 ? 'bg-forest-500' : 'bg-sage-300'
                      )}
                    />
                    {index < report.statusHistory.length - 1 && (
                      <div className="w-0.5 h-full bg-sage-200 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('badge text-xs', getStatusColor(entry.status))}>
                        {getStatusLabel(entry.status)}
                      </span>
                      <span className="text-xs text-sage-500">
                        {formatRelativeTime(entry.changedAt)}
                      </span>
                    </div>
                    {entry.notes && (
                      <p className="text-sm text-sage-600">{entry.notes}</p>
                    )}
                    <p className="text-xs text-sage-400 mt-1">
                      by {entry.changedBy?.name || 'System'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
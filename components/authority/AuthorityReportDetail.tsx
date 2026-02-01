'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
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
import { REPORT_STATUSES } from '@/lib/utils/constants';
import toast from 'react-hot-toast';

interface AuthorityReportDetailProps {
  report: any;
  currentUser: any;
}

export default function AuthorityReportDetail({
  report,
  currentUser,
}: AuthorityReportDetailProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [statusUpdate, setStatusUpdate] = useState({
    status: report.status,
    notes: '',
  });

  const [authorityResponse, setAuthorityResponse] = useState({
    message: '',
    actionTaken: '',
  });

  const [showResponseForm, setShowResponseForm] = useState(false);

  const handleStatusUpdate = async () => {
    if (statusUpdate.status === report.status && !statusUpdate.notes) {
      toast.error('Please change status or add notes');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/reports/${report._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          status: statusUpdate.status,
          statusNotes: statusUpdate.notes,
          isPublic: ['verified', 'in-progress', 'resolved'].includes(statusUpdate.status),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast.success('Status updated successfully');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorityResponse = async () => {
    if (!authorityResponse.message || !authorityResponse.actionTaken) {
      toast.error('Please fill in all response fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/reports/${report._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          status: 'resolved',
          statusNotes: 'Issue resolved by authority',
          authorityResponse: {
            message: authorityResponse.message,
            actionTaken: authorityResponse.actionTaken,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast.success('Response submitted and report resolved');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit response');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      label: 'Verify',
      status: 'verified',
      icon: CheckCircle2,
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      show: report.status === 'pending',
    },
    {
      label: 'Start Review',
      status: 'under-review',
      icon: Clock,
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      show: report.status === 'verified',
    },
    {
      label: 'Mark In Progress',
      status: 'in-progress',
      icon: AlertTriangle,
      color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
      show: ['verified', 'under-review'].includes(report.status),
    },
    {
      label: 'Reject',
      status: 'rejected',
      icon: XCircle,
      color: 'bg-red-100 text-red-700 hover:bg-red-200',
      show: ['pending', 'verified'].includes(report.status),
    },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div className="card">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="font-mono text-forest-600 bg-forest-50 px-3 py-1 rounded-lg">
              {report.complaintId}
            </span>
            <span className={cn('badge', getStatusColor(report.status))}>
              {getStatusLabel(report.status)}
            </span>
            <span className={cn('badge border', getSeverityColor(report.severity))}>
              {report.severity.toUpperCase()}
            </span>
            <span className="badge bg-sage-100 text-sage-700">
              {getCategoryLabel(report.category)}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-sage-900 font-display mb-4">
            {report.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-sage-600">
            <span className="inline-flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDateTime(report.createdAt)}
            </span>
            <span className="inline-flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {report.media?.length || 0} attachments
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="card">
          <h2 className="text-lg font-semibold text-sage-900 font-display mb-4">
            Description
          </h2>
          <p className="text-sage-700 whitespace-pre-wrap leading-relaxed">
            {report.description}
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
                {report.location?.address || 'Location captured'}
              </p>
              {report.location?.city && (
                <p className="text-sage-600 text-sm">
                  {report.location.city}, {report.location.state} {report.location.pincode}
                </p>
              )}
              <p className="text-sage-500 text-xs mt-1">
                Coordinates: {report.location?.coordinates?.[1]?.toFixed(6)},{' '}
                {report.location?.coordinates?.[0]?.toFixed(6)}
              </p>
            </div>
          </div>

          <div className="mt-4 h-48 rounded-xl bg-sage-100 flex items-center justify-center">
            <p className="text-sage-500">Map view - Coming in Part 5</p>
          </div>
        </div>

        {/* Media Evidence */}
        {report.media && report.media.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-sage-900 font-display mb-4">
              Evidence ({report.media.length} files)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {report.media.map((item: any, index: number) => (
                <div
                  key={index}
                  className="aspect-square rounded-xl overflow-hidden bg-sage-100 cursor-pointer hover:opacity-90 transition-opacity relative group"
                  onClick={() => setSelectedImage(item.url)}
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={`Evidence ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video src={item.url} className="w-full h-full object-cover" controls />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status History */}
        <div className="card">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between"
          >
            <h2 className="text-lg font-semibold text-sage-900 font-display">
              Status History ({report.statusHistory?.length || 0})
            </h2>
            {showHistory ? (
              <ChevronUp className="w-5 h-5 text-sage-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-sage-500" />
            )}
          </button>

          {showHistory && (
            <div className="mt-6 space-y-4">
              {report.statusHistory?.map((entry: any, index: number) => (
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
                    {entry.notes && <p className="text-sm text-sage-600">{entry.notes}</p>}
                    <p className="text-xs text-sage-400 mt-1">
                      by {entry.changedBy?.name || 'System'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Authority Response (if exists) */}
        {report.authorityResponse && (
          <div className="card border-l-4 border-forest-500">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-forest-600" />
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
              <div>
                <p className="text-sm font-medium text-sage-700 mb-1">Message</p>
                <p className="text-sage-800">{report.authorityResponse.message}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-sage-700 mb-1">Action Taken</p>
                <p className="text-sage-800">{report.authorityResponse.actionTaken}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar - Actions */}
      <div className="space-y-6">
        {/* Reporter Info */}
        <div className="card">
          <h3 className="text-sm font-semibold text-sage-700 uppercase tracking-wide mb-4">
            Reporter Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {report.userId?.avatar ? (
                <img
                  src={report.userId.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-forest-600" />
                </div>
              )}
              <div>
                <p className="font-medium text-sage-900">{report.userId?.name}</p>
                <p className="text-xs text-sage-500">Citizen</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-sage-600">
              <Mail className="w-4 h-4" />
              <span>{report.userId?.email}</span>
            </div>

            {report.userId?.phone && (
              <div className="flex items-center gap-3 text-sm text-sage-600">
                <Phone className="w-4 h-4" />
                <span>{report.userId.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {report.status !== 'resolved' && report.status !== 'rejected' && (
          <div className="card">
            <h3 className="text-sm font-semibold text-sage-700 uppercase tracking-wide mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {quickActions
                .filter((action) => action.show)
                .map((action) => (
                  <button
                    key={action.status}
                    onClick={() => {
                      setStatusUpdate({ status: action.status, notes: '' });
                      handleStatusUpdate();
                    }}
                    disabled={loading}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                      action.color
                    )}
                  >
                    <action.icon className="w-5 h-5" />
                    <span className="font-medium">{action.label}</span>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Status Update Form */}
        {report.status !== 'resolved' && report.status !== 'rejected' && (
          <div className="card">
            <h3 className="text-sm font-semibold text-sage-700 uppercase tracking-wide mb-4">
              Update Status
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  New Status
                </label>
                <select
                  value={statusUpdate.status}
                  onChange={(e) =>
                    setStatusUpdate({ ...statusUpdate, status: e.target.value })
                  }
                  className="input-field"
                >
                  {REPORT_STATUSES.filter((s) => s.value !== 'pending').map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-sage-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={statusUpdate.notes}
                  onChange={(e) =>
                    setStatusUpdate({ ...statusUpdate, notes: e.target.value })
                  }
                  placeholder="Add notes about this status change..."
                  className="input-field min-h-[100px] resize-none"
                />
              </div>

              <button
                onClick={handleStatusUpdate}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Resolution Form */}
        {report.status === 'in-progress' && !report.authorityResponse && (
          <div className="card border-2 border-forest-200 bg-forest-50">
            <button
              onClick={() => setShowResponseForm(!showResponseForm)}
              className="w-full flex items-center justify-between"
            >
              <h3 className="text-sm font-semibold text-forest-700 uppercase tracking-wide">
                Submit Resolution
              </h3>
              {showResponseForm ? (
                <ChevronUp className="w-5 h-5 text-forest-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-forest-600" />
              )}
            </button>

            {showResponseForm && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Message to Reporter *
                  </label>
                  <textarea
                    value={authorityResponse.message}
                    onChange={(e) =>
                      setAuthorityResponse({
                        ...authorityResponse,
                        message: e.target.value,
                      })
                    }
                    placeholder="Explain the resolution to the citizen..."
                    className="input-field min-h-[100px] resize-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Action Taken *
                  </label>
                  <textarea
                    value={authorityResponse.actionTaken}
                    onChange={(e) =>
                      setAuthorityResponse({
                        ...authorityResponse,
                        actionTaken: e.target.value,
                      })
                    }
                    placeholder="Describe the actions taken to resolve the issue..."
                    className="input-field min-h-[100px] resize-none bg-white"
                  />
                </div>

                <button
                  onClick={handleAuthorityResponse}
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit & Resolve
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Resolved Badge */}
        {report.status === 'resolved' && (
          <div className="card bg-forest-50 border border-forest-200 text-center">
            <CheckCircle2 className="w-12 h-12 text-forest-600 mx-auto mb-3" />
            <h3 className="font-semibold text-forest-800">Report Resolved</h3>
            <p className="text-sm text-forest-600 mt-1">
              This issue has been successfully addressed.
            </p>
          </div>
        )}

        {/* Rejected Badge */}
        {report.status === 'rejected' && (
          <div className="card bg-red-50 border border-red-200 text-center">
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <h3 className="font-semibold text-red-800">Report Rejected</h3>
            <p className="text-sm text-red-600 mt-1">
              This report did not meet verification criteria.
            </p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
          />
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-sage-300"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
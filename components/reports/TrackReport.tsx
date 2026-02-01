// components/reports/TrackReport.tsx
'use client';

import { useState } from 'react';
import { 
  Search, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  MapPin,
  Calendar,
  Building2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { cn, formatDateTime, getStatusLabel, getStatusColor } from '@/lib/utils/helpers';

export default function TrackReport() {
  const [complaintId, setComplaintId] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!complaintId.trim()) return;

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch(`/api/reports/track/${complaintId.trim()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Report not found');
      }

      setReport(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to track report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleTrack} className="relative">
        <div className="flex flex-col sm:flex-row gap-3 p-2 bg-gray-50/80 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus-within:border-emerald-400 focus-within:bg-white transition-all duration-300">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value.toUpperCase())}
              placeholder="Enter Complaint ID (e.g., ECN-2024-XXXXXXXX)"
              className="w-full h-12 sm:h-14 pl-12 pr-4 text-gray-900 font-mono text-sm sm:text-base bg-transparent rounded-lg sm:rounded-xl border-0 focus:outline-none placeholder:text-gray-400"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !complaintId.trim()}
            className="group h-12 sm:h-14 px-6 sm:px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Track</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
        <p className="text-center text-gray-500 text-xs sm:text-sm mt-4">
          Your complaint ID was sent to your email when you submitted the report
        </p>
      </form>

      {/* Error State */}
      {error && (
        <div className="mt-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 p-5 sm:p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-200/30 to-transparent rounded-full blur-2xl" />
          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-red-800 mb-1">Report Not Found</h3>
              <p className="text-red-700 text-sm">{error}</p>
              <p className="text-red-600/70 text-xs mt-2">
                Please check your complaint ID and try again.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Report Result */}
      {report && (
        <div className="mt-8 space-y-5">
          {/* Status Card */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 p-6 sm:p-8 text-white shadow-2xl">
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '20px 20px',
              }}
            />
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-white/20 to-transparent rounded-full blur-2xl" />
            
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-mono mb-4">
                <FileText className="w-4 h-4" />
                {report.complaintId}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold font-display mb-2">{report.title}</h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
                    <span className="capitalize">Category: {report.category}</span>
                    <span>•</span>
                    <span className="capitalize">Severity: {report.severity}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 self-start">
                  <CheckCircle2 className="w-6 h-6" />
                  <div>
                    <p className="text-xs text-white/70 font-medium">Status</p>
                    <p className="font-bold">{getStatusLabel(report.status)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-lg shadow-gray-200/30">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="font-bold text-gray-900">Status Timeline</h4>
            </div>

            <div className="relative">
              <div className="absolute left-[18px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-emerald-400 via-gray-300 to-gray-200" />

              <div className="space-y-4">
                {report.statusHistory?.map((entry: any, index: number) => (
                  <div key={index} className="relative flex gap-4 pl-1">
                    <div className={cn(
                      "relative z-10 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                      index === 0
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg'
                        : 'bg-gray-200'
                    )}>
                      {index === 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-500" />
                      )}
                      {index === 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                      )}
                    </div>

                    <div className={cn(
                      "flex-1 pb-4 border-b border-gray-100 last:border-0 last:pb-0",
                      index === 0 && "bg-gradient-to-r from-emerald-50/50 to-transparent -ml-2 pl-4 py-3 rounded-xl border-0"
                    )}>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={cn(
                          "text-xs font-semibold px-2.5 py-1 rounded-lg",
                          getStatusColor(entry.status)
                        )}>
                          {getStatusLabel(entry.status)}
                        </span>
                        {index === 0 && (
                          <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                            Latest
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-1">
                        {formatDateTime(entry.changedAt)}
                      </p>
                      {entry.notes && (
                        <p className="text-sm text-gray-700 leading-relaxed">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Authority Response */}
          {report.authorityResponse && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-5 sm:p-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200/30 to-transparent rounded-full blur-2xl" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-200 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h4 className="font-bold text-emerald-900">Authority Response</h4>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50">
                  <p className="text-emerald-800 text-sm leading-relaxed">
                    {report.authorityResponse.actionTaken}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Track Another */}
          <div className="text-center pt-4">
            <button
              onClick={() => {
                setReport(null);
                setComplaintId('');
                setError(null);
              }}
              className="group inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
            >
              <Search className="w-4 h-4" />
              Track Another Report
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!report && !error && !loading && (
        <div className="mt-12 text-center">
          <div className="relative inline-flex mb-5">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 font-display mb-2">
            Enter Your Complaint ID
          </h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Find your complaint ID in the confirmation email sent when you submitted your report
          </p>
        </div>
      )}
    </div>
  );
}
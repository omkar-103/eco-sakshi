'use client';

import { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileJson,
  Calendar,
  Loader2,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { REPORT_CATEGORIES, SEVERITY_LEVELS } from '@/lib/utils/constants';
import toast from 'react-hot-toast';

export default function ExportDataPanel() {
  const [loading, setLoading] = useState(false);
  const [exportConfig, setExportConfig] = useState({
    format: 'csv' as 'csv' | 'json',
    dateRange: 'all' as 'all' | 'month' | 'quarter' | 'year',
    category: '',
    severity: '',
    includeLocation: true,
    includeMedia: false,
  });

  const handleExport = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        format: exportConfig.format,
        dateRange: exportConfig.dateRange,
      });

      if (exportConfig.category) params.append('category', exportConfig.category);
      if (exportConfig.severity) params.append('severity', exportConfig.severity);

      const response = await fetch(`/api/export?${params}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `environmental-data-${new Date().toISOString().split('T')[0]}.${exportConfig.format}`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Export Configuration */}
      <div className="lg:col-span-2 card">
        <h2 className="text-lg font-semibold text-sage-900 font-display mb-6">
          Export Configuration
        </h2>

        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setExportConfig({ ...exportConfig, format: 'csv' })}
                className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                  exportConfig.format === 'csv'
                    ? 'border-forest-500 bg-forest-50'
                    : 'border-sage-200 hover:border-sage-300'
                }`}
              >
                <FileSpreadsheet className="w-6 h-6 text-forest-600" />
                <div className="text-left">
                  <p className="font-medium text-sage-900">CSV</p>
                  <p className="text-xs text-sage-500">Spreadsheet format</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setExportConfig({ ...exportConfig, format: 'json' })}
                className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                  exportConfig.format === 'json'
                    ? 'border-forest-500 bg-forest-50'
                    : 'border-sage-200 hover:border-sage-300'
                }`}
              >
                <FileJson className="w-6 h-6 text-ocean-600" />
                <div className="text-left">
                  <p className="font-medium text-sage-900">JSON</p>
                  <p className="text-xs text-sage-500">API-ready format</p>
                </div>
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-3">
              Date Range
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: 'all', label: 'All Time' },
                { value: 'month', label: 'This Month' },
                { value: 'quarter', label: 'This Quarter' },
                { value: 'year', label: 'This Year' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setExportConfig({ ...exportConfig, dateRange: option.value as any })
                  }
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    exportConfig.dateRange === option.value
                      ? 'border-forest-500 bg-forest-50 text-forest-700'
                      : 'border-sage-200 text-sage-600 hover:border-sage-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Category
              </label>
              <select
                value={exportConfig.category}
                onChange={(e) =>
                  setExportConfig({ ...exportConfig, category: e.target.value })
                }
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
                value={exportConfig.severity}
                onChange={(e) =>
                  setExportConfig({ ...exportConfig, severity: e.target.value })
                }
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

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-3">
              Include Fields
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportConfig.includeLocation}
                  onChange={(e) =>
                    setExportConfig({ ...exportConfig, includeLocation: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-sage-300 text-forest-600 focus:ring-forest-500"
                />
                <span className="text-sage-700">Location coordinates</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportConfig.includeMedia}
                  onChange={(e) =>
                    setExportConfig({ ...exportConfig, includeMedia: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-sage-300 text-forest-600 focus:ring-forest-500"
                />
                <span className="text-sage-700">Media URLs</span>
              </label>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Preparing Export...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Export Data
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Panel */}
      <div className="space-y-6">
        <div className="card bg-forest-50 border border-forest-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-forest-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-forest-800 mb-2">Data Usage Guidelines</h3>
              <p className="text-sm text-forest-700 leading-relaxed">
                This data is provided for research and advocacy purposes. Please cite 
                GreenSentinel as your data source and respect user privacy.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-sage-900 mb-4">Available Data Fields</h3>
          <ul className="space-y-2 text-sm text-sage-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-forest-500" />
              Report ID & Title
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-forest-500" />
              Category & Severity
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-forest-500" />
              Status & Resolution
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-forest-500" />
              Location (City, State)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-forest-500" />
              Timestamps
            </li>
            <li className="flex items-center gap-2 text-sage-400">
              <CheckCircle2 className="w-4 h-4" />
              GPS Coordinates (optional)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
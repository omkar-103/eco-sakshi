// components/admin/AdminSettings.tsx
'use client';

import { useState } from 'react';
import {
  Bell,
  Mail,
  Shield,
  Database,
  Globe,
  Save,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils/helpers';

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'GreenSentinel',
    supportEmail: 'support@greensentinel.in',
    autoVerifyAfter: 72,
    notifyOnNewReport: true,
    notifyOnStatusChange: true,
    maintenanceMode: false,
    allowPublicTracking: true,
    maxReportsPerMonth: 5,
    maxFileSize: 10,
  });

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Settings saved successfully');
    setLoading(false);
  };

  const handleClearCache = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success('Cache cleared successfully');
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-forest-600" />
          <h2 className="text-lg font-semibold text-sage-900 font-display">
            General Settings
          </h2>
        </div>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-sage-50">
            <div>
              <p className="font-medium text-sage-900">Maintenance Mode</p>
              <p className="text-sm text-sage-600">
                Disable access to the platform for non-admin users
              </p>
            </div>
            <button
              onClick={() =>
                setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })
              }
              className={cn(
                'relative w-14 h-7 rounded-full transition-colors',
                settings.maintenanceMode ? 'bg-amber-500' : 'bg-sage-300'
              )}
            >
              <span
                className={cn(
                  'absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform',
                  settings.maintenanceMode ? 'translate-x-8' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-sage-50">
            <div>
              <p className="font-medium text-sage-900">Allow Public Report Tracking</p>
              <p className="text-sm text-sage-600">
                Let anyone track reports using complaint ID
              </p>
            </div>
            <button
              onClick={() =>
                setSettings({ ...settings, allowPublicTracking: !settings.allowPublicTracking })
              }
              className={cn(
                'relative w-14 h-7 rounded-full transition-colors',
                settings.allowPublicTracking ? 'bg-forest-500' : 'bg-sage-300'
              )}
            >
              <span
                className={cn(
                  'absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform',
                  settings.allowPublicTracking ? 'translate-x-8' : 'translate-x-1'
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Report Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-ocean-600" />
          <h2 className="text-lg font-semibold text-sage-900 font-display">
            Report Settings
          </h2>
        </div>

        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Auto-verify after (hours)
              </label>
              <input
                type="number"
                value={settings.autoVerifyAfter}
                onChange={(e) =>
                  setSettings({ ...settings, autoVerifyAfter: parseInt(e.target.value) })
                }
                className="input-field"
                min={0}
              />
              <p className="text-xs text-sage-500 mt-1">
                Set to 0 to disable auto-verification
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Max Reports/Month (Free Users)
              </label>
              <input
                type="number"
                value={settings.maxReportsPerMonth}
                onChange={(e) =>
                  setSettings({ ...settings, maxReportsPerMonth: parseInt(e.target.value) })
                }
                className="input-field"
                min={1}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">
              Max File Size (MB)
            </label>
            <input
              type="number"
              value={settings.maxFileSize}
              onChange={(e) =>
                setSettings({ ...settings, maxFileSize: parseInt(e.target.value) })
              }
              className="input-field w-32"
              min={1}
              max={50}
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-sage-900 font-display">
            Notification Settings
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-sage-50">
            <div>
              <p className="font-medium text-sage-900">New Report Notifications</p>
              <p className="text-sm text-sage-600">
                Email admins when new reports are submitted
              </p>
            </div>
            <button
              onClick={() =>
                setSettings({ ...settings, notifyOnNewReport: !settings.notifyOnNewReport })
              }
              className={cn(
                'relative w-14 h-7 rounded-full transition-colors',
                settings.notifyOnNewReport ? 'bg-forest-500' : 'bg-sage-300'
              )}
            >
              <span
                className={cn(
                  'absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform',
                  settings.notifyOnNewReport ? 'translate-x-8' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-sage-50">
            <div>
              <p className="font-medium text-sage-900">Status Change Notifications</p>
              <p className="text-sm text-sage-600">
                Email users when report status changes
              </p>
            </div>
            <button
              onClick={() =>
                setSettings({
                  ...settings,
                  notifyOnStatusChange: !settings.notifyOnStatusChange,
                })
              }
              className={cn(
                'relative w-14 h-7 rounded-full transition-colors',
                settings.notifyOnStatusChange ? 'bg-forest-500' : 'bg-sage-300'
              )}
            >
              <span
                className={cn(
                  'absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform',
                  settings.notifyOnStatusChange ? 'translate-x-8' : 'translate-x-1'
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {/* System Actions */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-sage-900 font-display">
            System Actions
          </h2>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleClearCache}
            disabled={loading}
            className="btn-outline"
          >
            <RefreshCw className="w-4 h-4" />
            Clear Cache
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Save Settings
        </button>
      </div>
    </div>
  );
}
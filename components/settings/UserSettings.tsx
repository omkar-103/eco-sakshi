// components/settings/UserSettings.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  Trash2,
  Save,
  Loader2,
  Camera,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils/helpers';
import { useAuth } from '@/hooks/useAuth';

interface UserSettingsProps {
  user: any;
}

export default function UserSettings({ user }: UserSettingsProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [profile, setProfile] = useState({
    name: user.name || '',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    state: user.state || '',
  });

  const [notifications, setNotifications] = useState({
    emailReportUpdates: true,
    emailNewsletter: false,
    emailPromotions: false,
  });

  const handleProfileUpdate = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: user._id,
          ...profile,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast.success('Profile updated successfully');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/users/delete', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      toast.success('Account deleted successfully');
      signOut();
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="card p-2">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-forest-100 text-forest-700'
                    : 'text-sage-600 hover:bg-sage-100'
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <>
            {/* Avatar Section */}
            <div className="card">
              <h2 className="text-lg font-semibold text-sage-900 font-display mb-6">
                Profile Picture
              </h2>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-forest-100 flex items-center justify-center">
                      <span className="text-3xl font-bold text-forest-700">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-forest-600 text-white flex items-center justify-center hover:bg-forest-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <p className="font-medium text-sage-900">{user.name}</p>
                  <p className="text-sm text-sage-600">{user.email}</p>
                  <p className="text-xs text-sage-500 mt-1 capitalize">
                    {user.role} • {user.subscription?.plan || 'Free'} Plan
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="card">
              <h2 className="text-lg font-semibold text-sage-900 font-display mb-6">
                Personal Information
              </h2>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="input-field pl-10 bg-sage-50 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="input-field pl-10"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-sage-400" />
                    <textarea
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      className="input-field pl-10 min-h-[80px] resize-none"
                      placeholder="Your address"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={profile.state}
                      onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleProfileUpdate}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          </>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="card">
            <h2 className="text-lg font-semibold text-sage-900 font-display mb-6">
              Email Notifications
            </h2>

            <div className="space-y-4">
              {[
                {
                  key: 'emailReportUpdates',
                  label: 'Report Updates',
                  description: 'Get notified when your reports status changes',
                },
                {
                  key: 'emailNewsletter',
                  label: 'Newsletter',
                  description: 'Receive our monthly environmental newsletter',
                },
                {
                  key: 'emailPromotions',
                  label: 'Promotions',
                  description: 'Get notified about new features and offers',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-xl bg-sage-50"
                >
                  <div>
                    <p className="font-medium text-sage-900">{item.label}</p>
                    <p className="text-sm text-sage-600">{item.description}</p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications({
                        ...notifications,
                        [item.key]: !notifications[item.key as keyof typeof notifications],
                      })
                    }
                    className={cn(
                      'relative w-14 h-7 rounded-full transition-colors',
                      notifications[item.key as keyof typeof notifications]
                        ? 'bg-forest-500'
                        : 'bg-sage-300'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform',
                        notifications[item.key as keyof typeof notifications]
                          ? 'translate-x-8'
                          : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button className="btn-primary">
                <Save className="w-5 h-5" />
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <>
            <div className="card">
              <h2 className="text-lg font-semibold text-sage-900 font-display mb-6">
                Account Security
              </h2>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-forest-50 border border-forest-200">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-forest-600" />
                    <div>
                      <p className="font-medium text-forest-800">Google Authentication</p>
                      <p className="text-sm text-forest-600">
                        Your account is secured with Google Sign-In
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-sage-50">
                  <p className="font-medium text-sage-900 mb-1">Connected Account</p>
                  <p className="text-sm text-sage-600">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="card border-2 border-red-200 bg-red-50">
              <h2 className="text-lg font-semibold text-red-800 font-display mb-4">
                Danger Zone
              </h2>

              <p className="text-sm text-red-700 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-sage-900">Delete Account?</h3>
                <p className="text-sm text-sage-600">This action is permanent.</p>
              </div>
            </div>

            <p className="text-sage-700 mb-6">
              All your data including reports, settings, and subscription will be permanently
              deleted. This cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl border-2 border-sage-200 text-sage-700 font-medium hover:bg-sage-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
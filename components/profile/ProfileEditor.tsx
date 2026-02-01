'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface ProfileEditorProps {
  user: any;
}

export default function ProfileEditor({ user }: ProfileEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || user.name?.split(' ')[0] || '',
    lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    state: user.state || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      toast.success('Profile updated successfully!');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getDashboardLink = () => {
    const routes: Record<string, string> = {
      citizen: '/citizen',
      authority: '/authority',
      ngo: '/ngo',
      admin: '/admin',
    };
    return routes[user.role] || '/citizen';
  };

  return (
    <div className="animate-fade-in">
      <Link
        href={getDashboardLink()}
        className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-900 mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="card">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-sage-900 font-display">Edit Profile</h1>
          <p className="text-sage-600 mt-2">Update your personal information</p>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-28 h-28 rounded-2xl object-cover ring-4 ring-forest-100"
              />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center ring-4 ring-forest-100">
                <span className="text-4xl font-bold text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-forest-600 text-white flex items-center justify-center hover:bg-forest-700 transition-colors shadow-lg">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sage-600 text-sm mt-4">{user.email}</p>
          <span className="mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-forest-100 text-forest-700 capitalize">
            {user.role}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-field pl-12"
                  placeholder="John"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input-field"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
              <input
                type="email"
                value={user.email}
                disabled
                className="input-field pl-12 bg-sage-50 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-sage-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field pl-12"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-sage-700 mb-2">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3 w-5 h-5 text-sage-400" />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input-field pl-12 min-h-[80px] resize-none"
                placeholder="Your street address"
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
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="input-field"
                placeholder="Mumbai"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="input-field"
                placeholder="Maharashtra"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Link href={getDashboardLink()} className="btn-outline">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
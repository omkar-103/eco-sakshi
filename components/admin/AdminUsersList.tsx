//components/admin/AdminUsersList.tsx
// components/admin/AdminUsersList.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Users,
  Loader2,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserCog,
  Mail,
  Calendar,
  Ban,
  CheckCircle2,
  XCircle,
  Trash2,
  Crown,
  Building2,
  Leaf,
  TrendingUp,
  UserPlus,
  Download,
  RefreshCw,
} from 'lucide-react';
import { cn, formatRelativeTime, formatDate } from '@/lib/utils/helpers';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'citizen' | 'authority' | 'ngo' | 'admin';
  isActive: boolean;
  isVerified: boolean;
  subscription: {
    plan: 'free' | 'premium' | 'enterprise';
    validUntil?: string;
  };
  stats: {
    totalReports: number;
    resolvedReports: number;
    pendingReports: number;
  };
  createdAt: string;
  lastLoginAt?: string;
}

const roleConfig = {
  citizen: {
    label: 'Citizen',
    icon: Leaf,
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    iconColor: 'text-emerald-600',
  },
  authority: {
    label: 'Authority',
    icon: Shield,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    iconColor: 'text-blue-600',
  },
  ngo: {
    label: 'NGO',
    icon: Building2,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    iconColor: 'text-purple-600',
  },
  admin: {
    label: 'Admin',
    icon: ShieldCheck,
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    iconColor: 'text-amber-600',
  },
};

const planConfig = {
  free: { label: 'Free', color: 'bg-sage-100 text-sage-600' },
  premium: { label: 'Premium', color: 'bg-forest-100 text-forest-700', icon: Crown },
  enterprise: { label: 'Enterprise', color: 'bg-purple-100 text-purple-700', icon: Building2 },
};

export default function AdminUsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [roleModal, setRoleModal] = useState<{ userId: string; currentRole: string } | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    newThisMonth: 0,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasMore: false,
  });
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    plan: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchUsers = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });

      if (filters.role) params.append('role', filters.role);
      if (filters.status) params.append('status', filters.status);
      if (filters.plan) params.append('plan', filters.plan);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/admin/users?${params}`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
        setPagination(data.pagination);
        if (data.stats) setStats(data.stats);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers(1);
  }, [filters.role, filters.status, filters.plan]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u._id));
    }
  };

  const handleSelectUser = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Role updated to ${newRole}`);
        setRoleModal(null);
        fetchUsers(pagination.page);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(currentStatus ? 'User deactivated' : 'User activated');
        fetchUsers(pagination.page);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('User deleted');
        fetchUsers(pagination.page);
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleExport = () => {
    toast.success('Exporting users...');
    // Implement CSV export logic
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card group hover:border-forest-300 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center shadow-lg shadow-forest-500/20 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-sage-900 font-display">{stats.total}</p>
              <p className="text-sm text-sage-600">Total Users</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-sage-100">
            <div className="flex items-center gap-2 text-sm text-forest-600">
              <TrendingUp className="w-4 h-4" />
              <span>+{stats.newThisMonth} this month</span>
            </div>
          </div>
        </div>

        <div className="card group hover:border-ocean-300 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center shadow-lg shadow-ocean-500/20 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-sage-900 font-display">{stats.active}</p>
              <p className="text-sm text-sage-600">Active Users</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-sage-100">
            <div className="h-2 bg-sage-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-ocean-400 to-ocean-600 rounded-full transition-all duration-500"
                style={{ width: `${stats.total > 0 ? (stats.active / stats.total) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-sage-500 mt-2">
              {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of total
            </p>
          </div>
        </div>

        <div className="card group hover:border-purple-300 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-sage-900 font-display">{stats.newThisMonth}</p>
              <p className="text-sm text-sage-600">New This Month</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-sage-100">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Users
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400 group-focus-within:text-forest-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="input-field pl-12"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'btn-ghost gap-2',
                showFilters && 'bg-forest-100 text-forest-700'
              )}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
              {(filters.role || filters.status || filters.plan) && (
                <span className="w-2 h-2 rounded-full bg-forest-500" />
              )}
            </button>
            <button
              type="button"
              onClick={() => fetchUsers(pagination.page)}
              className="btn-ghost p-3"
              title="Refresh"
            >
              <RefreshCw className={cn('w-5 h-5', loading && 'animate-spin')} />
            </button>
            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>
        </form>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-sage-200 grid sm:grid-cols-3 gap-4 animate-slide-down">
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">Role</label>
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="input-field"
              >
                <option value="">All Roles</option>
                <option value="citizen">Citizens</option>
                <option value="authority">Authorities</option>
                <option value="ngo">NGOs</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="input-field"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">Plan</label>
              <select
                value={filters.plan}
                onChange={(e) => setFilters({ ...filters, plan: e.target.value })}
                className="input-field"
              >
                <option value="">All Plans</option>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="card bg-gradient-to-r from-forest-50 to-ocean-50 border border-forest-200 animate-slide-down">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <span className="text-forest-700 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              {selectedUsers.length} user(s) selected
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedUsers([])}
                className="btn-ghost text-sm py-2"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <div className="card">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-forest-200 border-t-forest-600 animate-spin" />
              <Users className="w-6 h-6 text-forest-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-4 text-sage-600 font-medium">Loading users...</p>
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="card">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-sage-100 flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-sage-400" />
            </div>
            <h3 className="text-lg font-semibold text-sage-900 mb-2">No users found</h3>
            <p className="text-sage-600 text-center max-w-md">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
          </div>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-sage-50 to-sage-100 border-b border-sage-200">
                  <th className="px-4 py-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-sage-300 text-forest-600 focus:ring-forest-500"
                    />
                  </th>
                  <th className="text-left px-4 py-4 text-sm font-semibold text-sage-700">User</th>
                  <th className="text-left px-4 py-4 text-sm font-semibold text-sage-700">Role</th>
                  <th className="text-left px-4 py-4 text-sm font-semibold text-sage-700">Plan</th>
                  <th className="text-left px-4 py-4 text-sm font-semibold text-sage-700">Status</th>
                  <th className="text-left px-4 py-4 text-sm font-semibold text-sage-700">Reports</th>
                  <th className="text-left px-4 py-4 text-sm font-semibold text-sage-700">Joined</th>
                  <th className="text-right px-4 py-4 text-sm font-semibold text-sage-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100">
                {users.map((user, index) => {
                  const role = roleConfig[user.role];
                  const RoleIcon = role.icon;
                  const plan = planConfig[user.subscription.plan];
                  const PlanIcon = plan.icon;

                  return (
                    <tr
                      key={user._id}
                      className={cn(
                        'group hover:bg-sage-50/80 transition-colors',
                        selectedUsers.includes(user._id) && 'bg-forest-50/50'
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => handleSelectUser(user._id)}
                          className="w-4 h-4 rounded border-sage-300 text-forest-600 focus:ring-forest-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center ring-2 ring-white shadow-sm">
                                <span className="text-white font-semibold text-sm">
                                  {user.name?.charAt(0).toUpperCase() || '?'}
                                </span>
                              </div>
                            )}
                            <span
                              className={cn(
                                'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white',
                                user.isActive ? 'bg-green-500' : 'bg-sage-400'
                              )}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sage-900 group-hover:text-forest-700 transition-colors">
                              {user.name}
                            </p>
                            <p className="text-sm text-sage-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setRoleModal({ userId: user._id, currentRole: user.role })}
                          className={cn(
                            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:shadow-md',
                            role.color
                          )}
                        >
                          <RoleIcon className="w-3.5 h-3.5" />
                          {role.label}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold',
                            plan.color
                          )}
                        >
                          {PlanIcon && <PlanIcon className="w-3.5 h-3.5" />}
                          {plan.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold',
                            user.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          )}
                        >
                          {user.isActive ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <p className="text-lg font-bold text-sage-900">{user.stats.totalReports}</p>
                            <p className="text-xs text-sage-500">Total</p>
                          </div>
                          <div className="w-px h-8 bg-sage-200" />
                          <div className="text-center">
                            <p className="text-lg font-bold text-green-600">{user.stats.resolvedReports}</p>
                            <p className="text-xs text-sage-500">Resolved</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-sage-600">
                          <Calendar className="w-4 h-4 text-sage-400" />
                          <div>
                            <p>{formatRelativeTime(user.createdAt)}</p>
                            {user.lastLoginAt && (
                              <p className="text-xs text-sage-400">
                                Last login: {formatRelativeTime(user.lastLoginAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setActiveMenu(activeMenu === user._id ? null : user._id)
                              }
                              className="p-2 rounded-lg hover:bg-sage-100 text-sage-600 transition-colors"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>

                            {activeMenu === user._id && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setActiveMenu(null)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-sage-200 py-2 z-50 animate-scale-in overflow-hidden">
                                  <button
                                    onClick={() => {
                                      setActiveMenu(null);
                                      setRoleModal({ userId: user._id, currentRole: user.role });
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-sage-700 hover:bg-sage-50 transition-colors"
                                  >
                                    <UserCog className="w-4 h-4" />
                                    Change Role
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActiveMenu(null);
                                      handleToggleStatus(user._id, user.isActive);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-sage-700 hover:bg-sage-50 transition-colors"
                                  >
                                    {user.isActive ? (
                                      <>
                                        <Ban className="w-4 h-4" />
                                        Deactivate
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        Activate
                                      </>
                                    )}
                                  </button>
                                  <div className="my-2 border-t border-sage-100" />
                                  <button
                                    onClick={() => {
                                      setActiveMenu(null);
                                      handleDeleteUser(user._id);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete User
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-sage-600">
            Showing <span className="font-medium text-sage-900">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
            <span className="font-medium text-sage-900">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-medium text-sage-900">{pagination.total}</span> users
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchUsers(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="btn-ghost p-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => fetchUsers(pageNum)}
                    className={cn(
                      'w-10 h-10 rounded-lg font-medium text-sm transition-all',
                      pagination.page === pageNum
                        ? 'bg-forest-600 text-white shadow-lg shadow-forest-500/30'
                        : 'hover:bg-sage-100 text-sage-600'
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => fetchUsers(pagination.page + 1)}
              disabled={!pagination.hasMore}
              className="btn-ghost p-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {roleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setRoleModal(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <h3 className="text-xl font-bold text-sage-900 font-display mb-4">
              Change User Role
            </h3>
            <p className="text-sage-600 mb-6">
              Select a new role for this user. This will change their permissions and access level.
            </p>
            <div className="space-y-3">
              {Object.entries(roleConfig).map(([roleKey, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={roleKey}
                    onClick={() => handleUpdateRole(roleModal.userId, roleKey)}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all',
                      roleModal.currentRole === roleKey
                        ? 'border-forest-500 bg-forest-50'
                        : 'border-sage-200 hover:border-sage-300 hover:bg-sage-50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center',
                        config.color
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-sage-900">{config.label}</p>
                      <p className="text-sm text-sage-500">
                        {roleKey === 'citizen' && 'Can submit and track reports'}
                        {roleKey === 'authority' && 'Can manage and resolve reports'}
                        {roleKey === 'ngo' && 'Can view and collaborate on reports'}
                        {roleKey === 'admin' && 'Full system access'}
                      </p>
                    </div>
                    {roleModal.currentRole === roleKey && (
                      <CheckCircle2 className="w-5 h-5 text-forest-600" />
                    )}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setRoleModal(null)}
              className="mt-6 w-full btn-ghost"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
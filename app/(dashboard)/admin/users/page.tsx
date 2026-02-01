// app/(dashboard)/admin/users/page.tsx
import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import AdminUsersList from '@/components/admin/AdminUsersList';

export const metadata = {
  title: 'Manage Users - Admin',
};

export default async function AdminUsersPage() {
  const user = await getServerSession();

  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-sage-900 font-display">
          User Management
        </h1>
        <p className="text-sage-600 mt-1">
          Manage user accounts and roles.
        </p>
      </div>

      <AdminUsersList />
    </div>
  );
}
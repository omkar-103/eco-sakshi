// app/(dashboard)/admin/subscriptions/page.tsx
import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import AdminSubscriptionsList from '@/components/admin/AdminSubscriptionsList';
import { CreditCard } from 'lucide-react';

export const metadata = {
  title: 'Subscriptions - Admin',
};

export default async function AdminSubscriptionsPage() {
  const user = await getServerSession();

  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-sage-900 font-display">
            Subscription Management
          </h1>
          <p className="text-sage-600 mt-1">
            View and manage all user subscriptions.
          </p>
        </div>
      </div>

      <AdminSubscriptionsList />
    </div>
  );
}
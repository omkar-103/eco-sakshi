import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import SubscriptionPlans from '@/components/subscription/SubscriptionPlans';
import { CreditCard } from 'lucide-react';

export const metadata = {
  title: 'Subscription - Citizen',
};

export default async function CitizenSubscriptionPage() {
  const user = await getServerSession();

  if (!user) {
    redirect('/login');
  }

  const plainUser = JSON.parse(JSON.stringify(user));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-sage-900 font-display">
            Subscription Plans
          </h1>
          <p className="text-sage-600 mt-1">
            Upgrade your account for unlimited access and premium features.
          </p>
        </div>
      </div>

      <SubscriptionPlans currentUser={plainUser} />
    </div>
  );
}
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Crown } from 'lucide-react';

export const metadata = {
  title: 'Payment Successful',
};

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-sage-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-forest-600" />
        </div>

        <h1 className="text-2xl font-bold text-sage-900 font-display mb-2">
          Payment Successful!
        </h1>

        <p className="text-sage-600 mb-6">
          Your subscription has been activated. You now have access to all premium features.
        </p>

        <div className="p-4 rounded-xl bg-forest-50 border border-forest-200 mb-6">
          <div className="flex items-center justify-center gap-2 text-forest-700">
            <Crown className="w-5 h-5" />
            <span className="font-semibold">Premium Plan Active</span>
          </div>
        </div>

        <Link href="/citizen" className="btn-primary w-full">
          Go to Dashboard
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
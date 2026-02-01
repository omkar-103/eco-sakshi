import Link from 'next/link';
import { XCircle, ArrowRight, RefreshCw } from 'lucide-react';

export const metadata = {
  title: 'Payment Failed',
};

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-sage-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-sage-900 font-display mb-2">
          Payment Failed
        </h1>

        <p className="text-sage-600 mb-6">
          We could not process your payment. Please try again or use a different payment method.
        </p>

        <div className="space-y-3">
          <Link href="/citizen/subscription" className="btn-primary w-full">
            <RefreshCw className="w-5 h-5" />
            Try Again
          </Link>

          <Link href="/citizen" className="btn-outline w-full">
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <p className="text-sm text-sage-500 mt-6">
          If you continue to face issues, please contact our support team.
        </p>
      </div>
    </div>
  );
}
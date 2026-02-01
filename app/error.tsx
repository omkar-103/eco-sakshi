'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-sage-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-sage-900 font-display mb-2">
          Something Went Wrong
        </h1>
        <p className="text-sage-600 mb-8">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary">
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <Link href="/" className="btn-outline">
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 rounded-xl bg-red-50 text-left">
            <p className="text-xs font-mono text-red-800 break-all">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
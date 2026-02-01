import Link from 'next/link';
import { Leaf, Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sage-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          <div className="text-[150px] font-bold text-sage-200 font-display leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl gradient-forest flex items-center justify-center">
              <Leaf className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-sage-900 font-display mb-2">
          Page Not Found
        </h1>
        <p className="text-sage-600 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link href="/track" className="btn-outline">
            <Search className="w-5 h-5" />
            Track Report
          </Link>
        </div>
      </div>
    </div>
  );
}
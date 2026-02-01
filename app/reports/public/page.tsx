// app/reports/public/page.tsx
import { Suspense } from 'react';
import connectDB from '@/lib/db/mongoose';
import Report from '@/models/Report';
import PublicReportsClient from '@/components/public/PublicReportsClient';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  Eye, 
  MapPin, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  Globe,
  Sparkles,
  ArrowRight,
  Shield
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Public Reports - Eco Sakshi',
  description: 'View all verified environmental reports across India',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getPublicStats() {
  await connectDB();
  
  const [total, resolved, inProgress, pending] = await Promise.all([
    Report.countDocuments({}),
    Report.countDocuments({ status: 'resolved' }),
    Report.countDocuments({ status: 'in-progress' }),
    Report.countDocuments({ status: { $in: ['pending', 'verified', 'under-review'] } }),
  ]);

  return { total, resolved, inProgress, pending };
}

export default async function PublicReportsPage() {
  const stats = await getPublicStats();

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-emerald-50/30">
        {/* Hero Section */}
        <section className="relative pt-28 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700" />
          
          {/* Animated Background Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />
          
          {/* Decorative Elements */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 mb-8 shadow-lg">
                <div className="relative">
                  <Globe className="w-4 h-4 text-emerald-300" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-ping" />
                </div>
                <span className="text-sm font-semibold text-white">Live Environmental Reports</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-display mb-6 leading-tight">
                Public Reports
                <span className="block text-emerald-300 mt-2 flex items-center justify-center gap-3">
                  Across India
                  <Sparkles className="w-8 h-8 md:w-10 md:h-10" />
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
                View verified environmental reports submitted by citizens. 
                Every report represents real action towards a cleaner India.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {[
                  { label: 'Total Reports', value: stats.total, icon: Eye, color: 'from-blue-500 to-cyan-500' },
                  { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'from-green-500 to-emerald-500' },
                  { label: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
                  { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'from-purple-500 to-pink-500' },
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-white font-display mb-1">
                      {stat.value.toLocaleString()}
                    </p>
                    <p className="text-xs md:text-sm text-white/70 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249 250 251)" />
            </svg>
          </div>
        </section>

        {/* Reports Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-display">
                  Recent Reports
                </h2>
                <p className="text-gray-600 mt-1">
                  Browse environmental issues reported by citizens
                </p>
              </div>
              
              <Link 
                href="/map/public" 
                className="group inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-emerald-200 text-emerald-700 font-semibold rounded-xl hover:border-emerald-400 hover:bg-emerald-50 transition-all shadow-sm"
              >
                <MapPin className="w-5 h-5" />
                View on Map
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <Suspense fallback={<ReportsLoadingSkeleton />}>
              <PublicReportsClient />
            </Suspense>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700" />
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '20px 20px',
            }}
          />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-4">
              Witnessed an Environmental Issue?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Be the Sakshi. Report it and help protect India's environment for future generations.
            </p>
            <Link 
              href="/login" 
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-2xl shadow-black/20 hover:shadow-3xl hover:scale-105"
            >
              Report Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function ReportsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filter Skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 h-12 bg-gray-100 rounded-xl animate-pulse" />
          <div className="w-full md:w-48 h-12 bg-gray-100 rounded-xl animate-pulse" />
          <div className="w-full md:w-40 h-12 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
      
      {/* Cards Skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="h-44 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse" />
              <div className="h-5 bg-gray-100 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
              <div className="pt-4 border-t border-gray-100 flex justify-between">
                <div className="h-4 bg-gray-100 rounded w-20 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-24 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
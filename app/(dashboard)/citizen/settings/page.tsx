// app/(dashboard)/citizen/settings/page.tsx
import { getServerSession } from '@/lib/utils/serverAuth';
import { redirect } from 'next/navigation';
import UserSettings from '@/components/settings/UserSettings';
import { 
  Settings, 
  Shield, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  Crown,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Settings | Account',
  description: 'Manage your account settings and preferences',
};

export default async function CitizenSettingsPage() {
  const user = await getServerSession();

  if (!user) {
    redirect('/login');
  }

  const plainUser = JSON.parse(JSON.stringify(user));

  // Calculate member duration
  const createdDate = new Date(plainUser.createdAt || Date.now());
  const daysSinceJoined = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  const memberSince = createdDate.toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  });

  const isPremium = plainUser.subscription?.plan && plainUser.subscription.plan !== 'free';

  return (
    <div className="min-h-screen pb-10">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-forest-200/40 to-emerald-300/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-gradient-to-tr from-sage-200/30 to-forest-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-t from-ocean-200/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-forest-600 via-forest-700 to-emerald-800 shadow-2xl shadow-forest-900/25 mb-6 lg:mb-8">
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.07]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="settings-pattern" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                  <circle cx="16" cy="16" r="1.5" fill="white"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#settings-pattern)" />
            </svg>
          </div>
          
          {/* Gradient Accents */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-2xl translate-x-20 -translate-y-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-400/20 to-transparent rounded-full blur-2xl -translate-x-10 translate-y-10" />

          <div className="relative px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
              
              {/* Left: Icon + Title */}
              <div className="flex items-start sm:items-center gap-4 sm:gap-5 flex-1">
                {/* Icon */}
                <div className="relative flex-shrink-0">
                  <div className="absolute -inset-1.5 bg-white/20 rounded-2xl blur-md" />
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
                    <Settings className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <Sparkles className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                </div>

                {/* Title & Description */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-white/90 text-xs font-medium backdrop-blur-sm border border-white/10">
                      <Shield className="w-3 h-3" />
                      Secure
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-display tracking-tight">
                    Account Settings
                  </h1>
                  <p className="text-forest-100/90 mt-1.5 text-sm sm:text-base max-w-lg hidden sm:block">
                    Manage your profile, security, and notification preferences
                  </p>
                </div>
              </div>

              {/* Right: User Card (Desktop) */}
              <div className="hidden lg:flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/15 shadow-lg">
                <div className="relative">
                  {plainUser.avatar ? (
                    <img
                      src={plainUser.avatar}
                      alt={plainUser.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/40"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center ring-2 ring-white/40">
                      <span className="text-lg font-bold text-white">
                        {plainUser.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-forest-700" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate max-w-[160px]">{plainUser.name}</p>
                  <p className="text-sm text-forest-200/80 truncate max-w-[160px]">{plainUser.email}</p>
                </div>
              </div>
            </div>

            {/* Mobile User Info */}
            <div className="lg:hidden mt-5 flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
              <div className="relative flex-shrink-0">
                {plainUser.avatar ? (
                  <img
                    src={plainUser.avatar}
                    alt={plainUser.name}
                    className="w-10 h-10 rounded-lg object-cover ring-2 ring-white/30"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <span className="text-base font-bold text-white">
                      {plainUser.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white text-sm truncate">{plainUser.name}</p>
                <p className="text-xs text-forest-200/70 truncate">{plainUser.email}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
          {/* Account Status */}
          <div className="col-span-1 bg-white rounded-xl sm:rounded-2xl border border-sage-200/70 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-sage-500 font-medium">Status</p>
                <p className="text-sm sm:text-base font-bold text-emerald-600 truncate">Active</p>
              </div>
            </div>
          </div>

          {/* Member Since */}
          <div className="col-span-1 bg-white rounded-xl sm:rounded-2xl border border-sage-200/70 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-sage-500 font-medium">Joined</p>
                <p className="text-sm sm:text-base font-bold text-blue-600 truncate">{memberSince}</p>
              </div>
            </div>
          </div>

          {/* Current Plan */}
          <div className="col-span-1 bg-white rounded-xl sm:rounded-2xl border border-sage-200/70 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-sage-500 font-medium">Plan</p>
                <p className="text-sm sm:text-base font-bold text-amber-600 truncate capitalize">
                  {plainUser.subscription?.plan || 'Free'}
                </p>
              </div>
            </div>
          </div>

          {/* Role */}
          <div className="col-span-1 bg-white rounded-xl sm:rounded-2xl border border-sage-200/70 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-violet-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-sage-500 font-medium">Role</p>
                <p className="text-sm sm:text-base font-bold text-violet-600 truncate capitalize">
                  {plainUser.role || 'Citizen'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade CTA - Only for free users */}
        {!isPremium && (
          <Link 
            href="/citizen/subscription"
            className="group relative block overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 p-4 sm:p-5 mb-6 lg:mb-8 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm sm:text-base">Upgrade to Premium</p>
                  <p className="text-amber-100 text-xs sm:text-sm">Get unlimited reports & priority support</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-white font-semibold text-sm bg-white/20 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl group-hover:bg-white/30 transition-colors">
                <span className="hidden sm:inline">View Plans</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        )}

        {/* Main Settings Card */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-forest-200/50 via-sage-200/30 to-emerald-200/50 rounded-3xl blur-xl opacity-60 -z-10" />
          
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-sage-200/80 bg-white shadow-xl shadow-sage-900/5">
            {/* Top Accent */}
            <div className="h-1 bg-gradient-to-r from-forest-500 via-emerald-500 to-teal-500" />
            
            {/* Content */}
            <div className="p-4 sm:p-6 lg:p-8">
              <UserSettings user={plainUser} />
            </div>
          </div>
        </div>

        {/* Help Footer */}
        <div className="mt-6 lg:mt-8 bg-gradient-to-br from-sage-50 to-forest-50/50 rounded-xl sm:rounded-2xl border border-sage-200/60 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-5 h-5 text-forest-600" />
              </div>
              <div>
                <p className="font-semibold text-sage-900 text-sm sm:text-base">Need assistance?</p>
                <p className="text-xs sm:text-sm text-sage-600">Our support team is here to help</p>
              </div>
            </div>
            <Link
              href="/help"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-forest-600 text-white text-sm font-medium hover:bg-forest-700 transition-colors shadow-lg shadow-forest-600/20"
            >
              Get Help
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
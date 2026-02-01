// app/(public)/track/page.tsx
import { 
  Leaf, 
  ArrowLeft, 
  Search, 
  Shield, 
  Clock, 
  CheckCircle2,
  Sparkles,
  FileSearch,
  Bell,
  ChevronRight,
  HelpCircle,
  ArrowRight,
  MapPin,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TrackReport from '@/components/reports/TrackReport';

export const metadata = {
  title: 'Track Your Report | Eco Sakshi',
  description: 'Track the status of your environmental report using your complaint ID',
};

export default function TrackPage() {
  return (
    <>
      <Header />
      
      <main className="overflow-hidden bg-[#f8faf8]">
        {/* ===== HERO SECTION ===== */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#f0fdf4] via-[#f8faf8] to-white pt-20 pb-8">
          
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(34 197 94 / 0.12) 1px, transparent 0)`,
                backgroundSize: '32px 32px',
              }}
            />
            
            {/* Gradient orbs */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-200/50 to-teal-200/30 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-gradient-to-tr from-green-200/40 to-cyan-200/20 rounded-full blur-[100px]" />
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-100/30 to-teal-100/20 rounded-full blur-[120px]" />
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[15%] left-[8%] w-16 h-16 border-2 border-emerald-300/30 rounded-2xl rotate-12 animate-float-slow" />
            <div className="absolute top-[25%] right-[12%] w-12 h-12 bg-gradient-to-br from-teal-400/20 to-emerald-400/20 rounded-full animate-float-slow-delayed" />
            <div className="absolute bottom-[30%] left-[12%] w-10 h-10 bg-gradient-to-br from-green-400/15 to-cyan-400/15 rounded-xl rotate-45 animate-float-slow" />
            <div className="absolute bottom-[25%] right-[8%] w-20 h-20 border-2 border-teal-300/20 rounded-full animate-float-slow-delayed" />
            <Search className="absolute top-[30%] right-[20%] w-8 h-8 text-emerald-400/20 rotate-12 animate-float-slow" />
            <FileSearch className="absolute bottom-[35%] left-[18%] w-6 h-6 text-teal-400/15 -rotate-12 animate-float-slow-delayed" />
          </div>

          {/* Main Content */}
          <div className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex flex-col items-center text-center">
              
              {/* Back Link */}
              <div className="self-start mb-8 animate-fade-in-up">
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/80 backdrop-blur-xl border border-gray-200/60 shadow-sm hover:shadow-md hover:border-emerald-300/60 transition-all duration-300 text-gray-600 hover:text-emerald-700"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span className="text-sm font-medium">Back to Home</span>
                </Link>
              </div>

              {/* Badge */}
              <div className="animate-fade-in-up">
                <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-xl border border-emerald-200/60 shadow-lg shadow-emerald-100/40 hover:shadow-xl hover:border-emerald-300/60 transition-all duration-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-emerald-800 tracking-wide">
                    Real-Time Tracking
                  </span>
                  <ChevronRight className="w-4 h-4 text-emerald-600/50" />
                </div>
              </div>

              {/* Icon */}
              <div className="mt-8 sm:mt-10 animate-fade-in-up animation-delay-100">
                <div className="relative inline-flex">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                    <FileSearch className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg animate-bounce">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Main Heading */}
              <div className="mt-6 sm:mt-8 animate-fade-in-up animation-delay-150">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight leading-[1.1]">
                  <span className="text-gray-900">Track Your </span>
                  <span className="relative inline-block">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-green-500">
                      Report
                    </span>
                    <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 text-emerald-400/50" viewBox="0 0 200 12" fill="none">
                      <path d="M2 8.5C32 3.5 62 1 102 3.5C142 6 172 8 198 4" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                  </span>
                </h1>
              </div>

              {/* Hindi Tagline */}
              <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3 animate-fade-in-up animation-delay-200">
                <div className="h-[2px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-emerald-400 rounded-full" />
                <p className="text-sm sm:text-base text-emerald-700/80 font-medium tracking-wide">
                  अपनी रिपोर्ट की स्थिति जानें
                </p>
                <div className="h-[2px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-emerald-400 rounded-full" />
              </div>

              {/* Subtitle */}
              <p className="mt-4 sm:mt-5 text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200 px-4">
                Enter your unique complaint ID to check the real-time status of your environmental report and view the complete timeline.
              </p>

              {/* Feature Pills */}
              <div className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-2 sm:gap-3 animate-fade-in-up animation-delay-300">
                {[
                  { icon: Clock, label: 'Real-time Updates', color: 'emerald' },
                  { icon: Shield, label: 'Secure Tracking', color: 'teal' },
                  { icon: Bell, label: 'Instant Notifications', color: 'cyan' },
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm text-sm"
                  >
                    <item.icon className={`w-4 h-4 ${
                      item.color === 'emerald' ? 'text-emerald-500' :
                      item.color === 'teal' ? 'text-teal-500' :
                      'text-cyan-500'
                    }`} />
                    <span className="text-gray-700 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== TRACK FORM SECTION ===== */}
        <section className="relative py-8 sm:py-12 -mt-4">
          <div className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
            {/* Card Container */}
            <div className="relative animate-fade-in-up animation-delay-400">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-200/40 via-teal-200/30 to-cyan-200/40 rounded-[2rem] sm:rounded-[2.5rem] blur-2xl opacity-60" />
              
              {/* Main Card */}
              <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/40 p-6 sm:p-8 lg:p-10">
                <TrackReport />
              </div>
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS SECTION ===== */}
        <section className="py-16 sm:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/30 to-white" />
          
          {/* Decorative elements */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-emerald-200/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-tr from-teal-200/30 to-transparent rounded-full blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200/50 shadow-sm mb-6">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">How It Works</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 font-display mb-3">
                Report <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Tracking Journey</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Stay informed about your environmental report every step of the way
              </p>
            </div>

            {/* Steps */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
              {/* Connection Line - Desktop only */}
              <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-1 z-0">
                <div className="h-full bg-gradient-to-r from-emerald-200 via-teal-200 via-cyan-200 to-amber-200 rounded-full" />
              </div>

              {[
                {
                  step: '01',
                  title: 'Submit',
                  description: 'Create a detailed environmental report with photos and location',
                  icon: FileSearch,
                  gradient: 'from-emerald-500 to-green-500',
                  bgLight: 'bg-emerald-50',
                },
                {
                  step: '02',
                  title: 'Under Review',
                  description: 'Authorities review and verify your submitted report',
                  icon: Eye,
                  gradient: 'from-teal-500 to-cyan-500',
                  bgLight: 'bg-teal-50',
                },
                {
                  step: '03',
                  title: 'Action Taken',
                  description: 'Field teams are dispatched to address the issue',
                  icon: MapPin,
                  gradient: 'from-amber-500 to-orange-500',
                  bgLight: 'bg-amber-50',
                },
                {
                  step: '04',
                  title: 'Resolved',
                  description: 'Issue resolved and report marked as complete',
                  icon: CheckCircle2,
                  gradient: 'from-green-500 to-emerald-500',
                  bgLight: 'bg-green-50',
                },
              ].map((item, index) => (
                <div key={index} className="text-center group relative z-10">
                  <div className={`${item.bgLight} rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2`}>
                    {/* Icon */}
                    <div className="relative mb-4 sm:mb-5">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl mx-auto flex items-center justify-center shadow-lg bg-gradient-to-br ${item.gradient} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        <item.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                      </div>
                      {/* Step number badge */}
                      <div className="absolute -top-2 -right-2 sm:right-1/4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-gray-100">
                        <span className="text-xs font-bold text-gray-900">{item.step}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-display mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HELP CTA SECTION ===== */}
        <section className="py-12 sm:py-16 relative">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 p-6 sm:p-10 lg:p-12 shadow-2xl shadow-emerald-900/20">
              {/* Pattern */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Gradient Accents */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-400/20 to-transparent rounded-full blur-2xl" />

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg flex-shrink-0">
                  <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-display mb-2">
                    Can&apos;t Find Your Report?
                  </h3>
                  <p className="text-emerald-100/80 text-sm sm:text-base max-w-lg">
                    If you&apos;re having trouble tracking your report or need assistance, our support team is here to help 24/7.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-emerald-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-emerald-50 transition-all duration-300"
                  >
                    Contact Support
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/faq"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/15 text-white font-semibold rounded-xl border border-white/25 hover:bg-white/25 transition-all duration-300"
                  >
                    View FAQs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
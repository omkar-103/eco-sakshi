// app/page.tsx
import Link from 'next/link';
import {
  Leaf,
  Shield,
  MapPin,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Users,
  Clock,
  Zap,
  Globe,
  Award,
  ChevronRight,
  Star,
  Sparkles,
  Eye,
  FileText,
  TrendingUp,
  Droplets,
  Wind,
  TreePine,
  Factory,
  Volume2,
  Trash2,
  ArrowUpRight,
  Quote,
  Heart,
  Target,
  Play,
  ChevronDown,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      
      <main className="overflow-hidden bg-[#f8faf8]">
        
        {/* ===== HERO SECTION ===== */}
        <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#f0fdf4] via-[#f8faf8] to-white">
          
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
            <div className="absolute top-[20%] right-[12%] w-12 h-12 bg-gradient-to-br from-teal-400/20 to-emerald-400/20 rounded-full animate-float-slow-delayed" />
            <div className="absolute bottom-[30%] left-[12%] w-10 h-10 bg-gradient-to-br from-green-400/15 to-cyan-400/15 rounded-xl rotate-45 animate-float-slow" />
            <div className="absolute bottom-[25%] right-[8%] w-20 h-20 border-2 border-teal-300/20 rounded-full animate-float-slow-delayed" />
            <Leaf className="absolute top-[25%] right-[20%] w-8 h-8 text-emerald-400/25 rotate-45 animate-float-slow" />
            <Leaf className="absolute bottom-[35%] left-[18%] w-6 h-6 text-teal-400/20 -rotate-12 animate-float-slow-delayed" />
          </div>

          {/* Main Content */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="flex flex-col items-center text-center">
              
              {/* Badge */}
              <div className="animate-fade-in-up">
                <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-xl border border-emerald-200/60 shadow-lg shadow-emerald-100/40 hover:shadow-xl hover:border-emerald-300/60 transition-all duration-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-emerald-800 tracking-wide">
                    India&apos;s #1 Environmental Platform
                  </span>
                  <ChevronRight className="w-4 h-4 text-emerald-600/50" />
                </div>
              </div>

              {/* Main Heading */}
              <div className="mt-8 sm:mt-10 animate-fade-in-up animation-delay-100">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-display tracking-tight leading-[1.05]">
                  <span className="text-gray-900">Be the </span>
                  <span className="relative inline-block">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-green-500">
                      Sakshi
                    </span>
                    <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 text-emerald-400/50" viewBox="0 0 200 12" fill="none">
                      <path d="M2 8.5C32 3.5 62 1 102 3.5C142 6 172 8 198 4" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                  </span>
                </h1>
                <h1 className="mt-1 sm:mt-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-display tracking-tight leading-[1.05]">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
                    Protect India
                  </span>
                </h1>
              </div>

              {/* Hindi Tagline */}
              <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3 animate-fade-in-up animation-delay-150">
                <div className="h-[2px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-emerald-400 rounded-full" />
                <p className="text-sm sm:text-base md:text-lg text-emerald-700/80 font-medium tracking-wide">
                  साक्षी बनो • दस्तावेज़ करो • बदलाव लाओ
                </p>
                <div className="h-[2px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-emerald-400 rounded-full" />
              </div>

              {/* Subtitle */}
              <p className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-600 max-w-xl md:max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200 px-4">
                Witness. Document. Transform. Join thousands of citizens 
                creating real environmental change across India.
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up animation-delay-300 px-4 sm:px-0">
                <Link 
                  href="/login" 
                  className="group relative inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-base sm:text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/25 active:translate-y-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <Zap className="relative z-10 w-5 h-5" />
                  <span className="relative z-10">Become a Sakshi</span>
                  <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <Link 
                  href="/reports/public" 
                  className="group inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-4 rounded-2xl font-semibold text-base sm:text-lg border-2 border-gray-300 text-gray-700 bg-white/60 backdrop-blur-sm hover:bg-white hover:border-emerald-400 hover:text-emerald-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Eye className="w-5 h-5" />
                  <span>View Reports</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                </Link>
              </div>

              {/* Stats Cards */}
              <div className="mt-16 sm:mt-20 w-full max-w-4xl animate-fade-in-up animation-delay-400 px-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { value: '10K+', label: 'Reports Filed', icon: FileText, color: 'emerald' },
                    { value: '85%', label: 'Resolved', icon: TrendingUp, color: 'teal' },
                    { value: '150+', label: 'Cities', icon: MapPin, color: 'cyan' },
                    { value: '48h', label: 'Response', icon: Clock, color: 'green' },
                  ].map((stat, index) => (
                    <div 
                      key={index} 
                      className="group relative bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/80 shadow-lg shadow-gray-200/40 hover:shadow-xl hover:shadow-emerald-200/30 hover:border-emerald-200/60 hover:-translate-y-1 transition-all duration-500"
                    >
                      <div className="relative z-10 flex flex-col items-center">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500 ${
                          stat.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                          stat.color === 'teal' ? 'bg-teal-100 text-teal-600' :
                          stat.color === 'cyan' ? 'bg-cyan-100 text-cyan-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-display tracking-tight">{stat.value}</p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trusted Cities */}
              <div className="mt-12 sm:mt-16 animate-fade-in-up animation-delay-400">
                <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-widest font-medium mb-4">Trusted by citizens in</p>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'].map((city, i) => (
                    <span key={i} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/80 border border-gray-200 text-xs sm:text-sm font-medium text-gray-600 shadow-sm">
                      {city}
                    </span>
                  ))}
                  <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-semibold text-emerald-700">
                    +145 more
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
        </section>

        {/* ===== CATEGORIES SECTION ===== */}
        <section className="py-20 sm:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/30 to-white" />
          
          {/* Decorative elements */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-emerald-200/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-tr from-teal-200/30 to-transparent rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-14 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200/50 shadow-sm mb-6">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">Report Categories</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 font-display mb-4">
                What Can You <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Report?</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Eco Sakshi supports structured reporting across multiple environmental categories
              </p>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
              {[
                { icon: Wind, label: 'Air Pollution', color: 'sky', gradient: 'from-sky-500 to-blue-500' },
                { icon: Droplets, label: 'Water Pollution', color: 'cyan', gradient: 'from-cyan-500 to-teal-500' },
                { icon: Trash2, label: 'Waste Dumping', color: 'amber', gradient: 'from-amber-500 to-orange-500' },
                { icon: Volume2, label: 'Noise Pollution', color: 'violet', gradient: 'from-violet-500 to-purple-500' },
                { icon: TreePine, label: 'Deforestation', color: 'emerald', gradient: 'from-emerald-500 to-green-500' },
                { icon: Factory, label: 'Industrial', color: 'rose', gradient: 'from-rose-500 to-red-500' },
              ].map((category, index) => (
                <div
                  key={index}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-center border border-gray-100 shadow-lg shadow-gray-200/30 hover:shadow-xl hover:shadow-emerald-200/30 hover:border-emerald-200/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
                >
                  {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl sm:rounded-3xl`} />
                  
                  <div className="relative z-10">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <category.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <p className="font-bold text-gray-800 text-sm sm:text-base">{category.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS SECTION ===== */}
        <section id="how-it-works" className="py-20 sm:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f0fdf4]/50 to-white" />
          
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-100/40 to-teal-100/40 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16 sm:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200/50 shadow-sm mb-6">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">Simple Process</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 font-display mb-4">
                How <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Eco Sakshi</span> Works
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Four simple steps to become an environmental witness
              </p>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
              {/* Connection Line - Desktop only */}
              <div className="hidden lg:block absolute top-20 left-[12%] right-[12%] h-1 z-0">
                <div className="h-full bg-gradient-to-r from-emerald-200 via-teal-200 via-cyan-200 to-amber-200 rounded-full" />
              </div>

              {[
                {
                  step: '01',
                  title: 'Witness',
                  titleHindi: 'साक्षी',
                  description: 'Spot an environmental violation in your surroundings',
                  icon: Eye,
                  gradient: 'from-emerald-500 to-green-500',
                  bgLight: 'bg-emerald-50',
                },
                {
                  step: '02',
                  title: 'Document',
                  titleHindi: 'दस्तावेज़',
                  description: 'Capture photos/videos and submit with location',
                  icon: FileText,
                  gradient: 'from-teal-500 to-cyan-500',
                  bgLight: 'bg-teal-50',
                },
                {
                  step: '03',
                  title: 'Verify',
                  titleHindi: 'सत्यापन',
                  description: 'Our team verifies the report authenticity',
                  icon: Shield,
                  gradient: 'from-cyan-500 to-blue-500',
                  bgLight: 'bg-cyan-50',
                },
                {
                  step: '04',
                  title: 'Act',
                  titleHindi: 'परिवर्तन',
                  description: 'Authorities take action and resolve the issue',
                  icon: CheckCircle2,
                  gradient: 'from-amber-500 to-orange-500',
                  bgLight: 'bg-amber-50',
                },
              ].map((item, index) => (
                <div key={index} className="text-center group relative z-10">
                  {/* Card */}
                  <div className={`${item.bgLight} rounded-3xl p-6 sm:p-8 border border-white shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2`}>
                    {/* Icon */}
                    <div className="relative mb-6">
                      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl mx-auto flex items-center justify-center shadow-xl bg-gradient-to-br ${item.gradient} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        <item.icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                      </div>
                      {/* Step number badge */}
                      <div className="absolute -top-2 -right-2 sm:right-1/4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-gray-100">
                        <span className="text-xs sm:text-sm font-bold text-gray-900">{item.step}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-display mb-1">{item.title}</h3>
                    <p className="text-emerald-600 font-medium text-sm mb-3">({item.titleHindi})</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FEATURES SECTION ===== */}
        <section id="features" className="py-20 sm:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-teal-50/30 to-white" />
          
          {/* Decorative blobs */}
          <div className="absolute top-40 left-0 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-transparent rounded-full blur-3xl -translate-x-1/2" />
          <div className="absolute bottom-40 right-0 w-96 h-96 bg-gradient-to-tl from-teal-200/30 to-transparent rounded-full blur-3xl translate-x-1/2" />

          <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-14 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-teal-200/50 shadow-sm mb-6">
                <Zap className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-semibold text-teal-700">Platform Features</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-gray-900 mb-4">
                Everything You Need to
                <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600"> Make a Difference</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Powerful tools to report, track, and resolve environmental issues
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {[
                {
                  icon: MapPin,
                  title: 'Live Environmental Map',
                  description: 'Real-time visualization of reports across India with city-wise filtering.',
                  gradient: 'from-emerald-500 to-green-500',
                  iconBg: 'bg-emerald-100',
                  iconColor: 'text-emerald-600',
                },
                {
                  icon: Eye,
                  title: 'Public Reports Feed',
                  description: 'Transparent access to all verified environmental reports.',
                  gradient: 'from-teal-500 to-cyan-500',
                  iconBg: 'bg-teal-100',
                  iconColor: 'text-teal-600',
                },
                {
                  icon: Shield,
                  title: 'Verified Reports',
                  description: 'AI-assisted and manual verification ensures credibility.',
                  gradient: 'from-violet-500 to-purple-500',
                  iconBg: 'bg-violet-100',
                  iconColor: 'text-violet-600',
                },
                {
                  icon: Clock,
                  title: 'Real-Time Tracking',
                  description: 'Track your report status from submission to resolution.',
                  gradient: 'from-amber-500 to-orange-500',
                  iconBg: 'bg-amber-100',
                  iconColor: 'text-amber-600',
                },
                {
                  icon: BarChart3,
                  title: 'Impact Analytics',
                  description: 'See your environmental impact with detailed metrics.',
                  gradient: 'from-cyan-500 to-blue-500',
                  iconBg: 'bg-cyan-100',
                  iconColor: 'text-cyan-600',
                },
                {
                  icon: Award,
                  title: 'Recognition System',
                  description: 'Earn badges and recognition for your contributions.',
                  gradient: 'from-pink-500 to-rose-500',
                  iconBg: 'bg-pink-100',
                  iconColor: 'text-pink-600',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-lg shadow-gray-200/30 hover:shadow-xl hover:shadow-emerald-200/20 hover:border-emerald-200/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                >
                  {/* Gradient border on hover */}
                  <div className={`absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[2px]`}>
                    <div className="absolute inset-[2px] bg-white rounded-[14px] sm:rounded-[22px]" />
                  </div>

                  <div className="relative z-10">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl ${feature.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500`}>
                      <feature.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-display mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Learn more link */}
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PHILOSOPHY SECTION ===== */}
        <section className="py-20 sm:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white to-emerald-50/50" />
          
          {/* Decorative elements */}
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-teal-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200/50 shadow-sm mb-6">
                <Heart className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">Our Philosophy</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 font-display">
                &quot;Be the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Sakshi</span>&quot;
              </h2>
            </div>

            {/* Quote Card */}
            <div className="relative">
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 md:p-14 border border-emerald-100 shadow-2xl shadow-emerald-100/30 overflow-hidden">
                {/* Quote icon */}
                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
                </div>
                
                {/* Decorative circles */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 border border-emerald-200/30 rounded-full" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 border border-emerald-200/20 rounded-full" />

                <div className="relative z-10 text-center pt-8 sm:pt-10">
                  <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display text-gray-800 italic mb-6 sm:mb-8 leading-relaxed">
                    &quot;Change begins when someone bears witness.&quot;
                  </blockquote>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
                    Every environmental improvement starts with someone noticing a violation, 
                    documenting it, and ensuring it reaches the right hands. 
                    Eco Sakshi formalizes this into a <span className="font-semibold text-emerald-700">structured, trustworthy digital system</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Values Pills */}
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
              {[
                { title: 'Awareness', next: 'Evidence', icon: Eye, color: 'emerald' },
                { title: 'Evidence', next: 'Action', icon: Target, color: 'teal' },
                { title: 'Action', next: 'Change', icon: CheckCircle2, color: 'green' },
              ].map((item, index) => (
                <div key={index} className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-lg hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
                  <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                      item.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                      item.color === 'teal' ? 'bg-teal-100 text-teal-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm sm:text-base">
                      <span>{item.title}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-emerald-600">{item.next}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== STATS/TRUST SECTION ===== */}
        <section className="py-20 sm:py-28 relative overflow-hidden">
          {/* Light gradient background instead of dark */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700" />
          
          {/* Overlay pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />
          
          {/* Gradient orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />

          <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-display mb-4">
                Trusted by Citizens Across India
              </h2>
              <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto">
                Real impact, real change, real numbers
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { icon: Users, label: 'Active Citizens', value: '10,000+', gradient: 'from-white/20 to-white/5' },
                { icon: MapPin, label: 'Reports Filed', value: '25,000+', gradient: 'from-white/20 to-white/5' },
                { icon: CheckCircle2, label: 'Issues Resolved', value: '21,250', gradient: 'from-white/20 to-white/5' },
                { icon: Globe, label: 'Cities Covered', value: '150+', gradient: 'from-white/20 to-white/5' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`group relative bg-gradient-to-br ${stat.gradient} backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-500 hover:-translate-y-2 text-center`}
                >
                  <div className="relative z-10">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4 sm:mb-5 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-500">
                      <stat.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white mb-2">
                      {stat.value}
                    </p>
                    <p className="text-white/70 font-medium text-sm sm:text-base">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIAL SECTION ===== */}
        <section className="py-20 sm:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 via-white to-white" />
          
          <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-amber-200/50 shadow-sm mb-6">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span className="text-sm font-semibold text-amber-700">Success Stories</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 font-display">
                What Citizens Are Saying
              </h2>
            </div>

            {/* Testimonial Card */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 md:p-14 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                
                {/* Quote mark */}
                <div className="absolute top-6 sm:top-8 left-6 sm:left-8 text-6xl sm:text-8xl text-white/10 font-serif leading-none">&quot;</div>
                
                <div className="relative z-10 text-center">
                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6 sm:mb-8">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-6 h-6 sm:w-7 sm:h-7 fill-amber-400 text-amber-400 drop-shadow-lg" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <blockquote className="text-lg sm:text-xl md:text-2xl text-white/95 italic mb-8 sm:mb-10 leading-relaxed max-w-3xl mx-auto">
                    &quot;Eco Sakshi helped us report illegal dumping in our neighborhood. 
                    Within 48 hours, authorities took action. This platform truly empowers citizens 
                    to make a real difference in their communities!&quot;
                  </blockquote>
                  
                  {/* Author */}
                  <div className="flex items-center justify-center gap-4 sm:gap-5">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center font-bold text-white text-xl sm:text-2xl shadow-xl ring-4 ring-white/20">
                      P
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-white text-base sm:text-lg">Priya Sharma</p>
                      <p className="text-white/60 flex items-center gap-2 text-sm sm:text-base">
                        <MapPin className="w-4 h-4" />
                        Mumbai, Maharashtra
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 sm:mt-10">
                {[
                  { icon: Shield, text: '100% Verified Reviews' },
                  { icon: Users, text: 'Real Citizens' },
                  { icon: Heart, text: 'Community Driven' },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-500">
                    <badge.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA SECTION ===== */}
        <section className="py-20 sm:py-28 md:py-32 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f0fdf4] via-emerald-50 to-teal-50" />
          
          {/* Decorative elements */}
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-emerald-200/40 to-transparent rounded-full blur-[100px] -translate-y-1/2" />
          <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-gradient-to-tl from-teal-200/40 to-transparent rounded-full blur-[100px] -translate-y-1/2" />
          
          {/* Floating shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[10%] w-16 h-16 border-2 border-emerald-300/30 rounded-2xl rotate-12 animate-float-slow" />
            <div className="absolute bottom-[20%] right-[10%] w-20 h-20 border-2 border-teal-300/20 rounded-full animate-float-slow-delayed" />
            <Leaf className="absolute top-[30%] right-[15%] w-8 h-8 text-emerald-400/20 rotate-45 animate-float-slow" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200/50 shadow-lg mb-8 sm:mb-10">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">Join the Movement</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display text-gray-900 mb-6 sm:mb-8 leading-tight">
              Ready to Be the{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-green-500">
                  Sakshi
                </span>
                <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 text-emerald-400/50" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8.5C32 3.5 62 1 102 3.5C142 6 172 8 198 4" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
              ?
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-10 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of environmental champions. Every report counts, 
              every action matters. Start protecting India&apos;s environment today.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center mb-12 sm:mb-16 px-4 sm:px-0">
              <Link
                href="/login"
                className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-base sm:text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Zap className="relative z-10 w-5 h-5" />
                <span className="relative z-10">Start Reporting Free</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/track"
                className="group inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg border-2 border-gray-300 text-gray-700 bg-white/60 backdrop-blur-sm hover:bg-white hover:border-emerald-400 hover:text-emerald-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <MapPin className="w-5 h-5" />
                <span>Track Existing Report</span>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-gray-500">
              {[
                { icon: Shield, text: 'Secure & Private' },
                { icon: CheckCircle2, text: 'Verified Reports' },
                { icon: Clock, text: 'Fast Response' },
                { icon: Users, text: '10,000+ Users' },
              ].map((badge, i) => (
                <span key={i} className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                  <badge.icon className="w-4 h-4 text-emerald-600" />
                  {badge.text}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
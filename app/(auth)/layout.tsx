import { Leaf, CheckCircle2, MapPin, BarChart3, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 gradient-nature animate-gradient bg-[length:400%_400%]" />
        
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float stagger-2" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-float stagger-3" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold font-display">GreenSentinel</span>
          </Link>

          <div className="max-w-lg">
            <h1 className="text-4xl xl:text-5xl font-bold font-display mb-6 leading-tight">
              Protecting Our Environment,{' '}
              <span className="text-forest-200">One Report at a Time</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed mb-10">
              Join thousands of citizens making a real difference. Report environmental 
              issues, track their resolution, and help build a cleaner, greener future 
              for everyone.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              {[
                { value: '10K+', label: 'Issues Reported', icon: MapPin },
                { value: '85%', label: 'Resolution Rate', icon: CheckCircle2 },
                { value: '48h', label: 'Avg Response', icon: BarChart3 },
                { value: '150+', label: 'Cities Covered', icon: Shield },
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-5 hover:bg-white/15 transition-colors"
                >
                  <stat.icon className="w-6 h-6 text-forest-200 mb-3" />
                  <div className="text-3xl font-bold font-display">{stat.value}</div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <p className="text-white/90 italic mb-4">
                "GreenSentinel helped us report illegal dumping in our neighborhood. 
                Within 48 hours, authorities took action!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  P
                </div>
                <div>
                  <p className="font-semibold text-sm">Priya Sharma</p>
                  <p className="text-white/60 text-xs">Mumbai, India</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Environmental Compliance Network. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 gradient-mesh relative">
        <div className="w-full max-w-md relative z-10">{children}</div>
      </div>
    </div>
  );
}
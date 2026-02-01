'use client';

import { useState, useEffect } from 'react';
import { Leaf, Trees, Wind, Droplets, Sparkles, Sun, Cloud } from 'lucide-react';

export default function HomeLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Minimum display time of 2.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-forest-950 via-forest-900 to-emerald-950 flex items-center justify-center overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-forest-500/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent" />
      </div>

      {/* Floating orbs - responsive sizes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-32 h-32 sm:w-48 sm:h-48 md:w-72 md:h-72 bg-forest-500/30 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px] animate-float-slow" />
        <div className="absolute bottom-[20%] right-[5%] w-40 h-40 sm:w-56 sm:h-56 md:w-80 md:h-80 bg-emerald-500/20 rounded-full blur-[70px] sm:blur-[90px] md:blur-[120px] animate-float-slow animation-delay-1000" />
        <div className="absolute top-[40%] right-[20%] w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-teal-500/25 rounded-full blur-[50px] sm:blur-[70px] md:blur-[90px] animate-float-slow animation-delay-2000" />
        <div className="absolute bottom-[10%] left-[15%] w-28 h-28 sm:w-40 sm:h-40 md:w-56 md:h-56 bg-cyan-500/15 rounded-full blur-[60px] sm:blur-[80px] animate-float-slow animation-delay-500" />
      </div>

      {/* Floating nature particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-particle"
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
            }}
          >
            {i % 4 === 0 && <Leaf className="w-3 h-3 sm:w-4 sm:h-4 text-forest-400/40" />}
            {i % 4 === 1 && <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 text-amber-400/50" />}
            {i % 4 === 2 && <Wind className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400/30" />}
            {i % 4 === 3 && <Droplets className="w-2 h-2 sm:w-3 sm:h-3 text-blue-400/40" />}
          </div>
        ))}
      </div>

      {/* Main content container */}
      <div className="relative z-10 text-center px-6 w-full max-w-md mx-auto">
        
        {/* Logo section with animations */}
        <div className="relative mb-8 sm:mb-10">
          {/* Outer glow pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-forest-500/20 to-emerald-500/20 animate-ping-slow opacity-50" />
          </div>

          {/* Rotating outer ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-dashed border-forest-400/30 animate-spin-slow" />
          </div>

          {/* Static middle ring with gradient */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-emerald-500/20 bg-gradient-to-br from-forest-800/50 to-transparent backdrop-blur-sm" />
          </div>

          {/* Inner pulsing ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-teal-400/30 animate-pulse" />
          </div>

          {/* Center logo */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto flex items-center justify-center">
            <div className="relative">
              {/* Glow behind logo */}
              <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-forest-400 to-emerald-500 blur-xl opacity-60 animate-pulse" />
              
              {/* Logo box */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-forest-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-forest-500/40 animate-bounce-gentle transform hover:scale-105 transition-transform">
                <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg animate-leaf-sway" />
              </div>
            </div>
          </div>

          {/* Orbiting icons - larger orbit on bigger screens */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-36 h-36 sm:w-48 sm:h-48 animate-spin-reverse-slow">
              <Trees className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 w-5 h-5 sm:w-6 sm:h-6 text-forest-400 drop-shadow-glow-green" />
              <Sun className="absolute top-1/2 -right-2 sm:-right-3 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-amber-400 drop-shadow-glow-amber" />
              <Droplets className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 drop-shadow-glow-cyan" />
              <Cloud className="absolute top-1/2 -left-2 sm:-left-3 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-white/70 drop-shadow-glow-white" />
            </div>
          </div>
        </div>

        {/* Brand name with gradient animation */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white mb-3">
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-forest-300 via-emerald-300 to-teal-300 animate-gradient-x bg-[length:200%_auto]">
              Eco Sakshi
            </span>
          </h1>
          <p className="text-white/50 text-sm sm:text-base font-medium tracking-wider">
            साक्षी बनो • बदलाव लाओ
          </p>
        </div>

        {/* Progress bar container */}
        <div className="mb-4">
          <div className="w-full max-w-xs mx-auto h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-forest-400 via-emerald-400 to-teal-400 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
          <p className="text-white/40 text-xs mt-2">{Math.min(Math.round(progress), 100)}%</p>
        </div>

        {/* Loading text with animated dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-white/50 text-sm sm:text-base font-medium">Loading</span>
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-gradient-to-br from-forest-400 to-emerald-400 animate-bounce shadow-lg shadow-emerald-500/50" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 animate-bounce shadow-lg shadow-teal-500/50" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 animate-bounce shadow-lg shadow-cyan-500/50" style={{ animationDelay: '300ms' }} />
          </div>
        </div>

        {/* Tagline */}
        <p className="text-white/30 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
          Preparing your environmental dashboard...
        </p>

        {/* Environmental tips carousel */}
        <div className="mt-8 sm:mt-10 px-4">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <p className="text-emerald-300/80 text-xs sm:text-sm font-medium mb-1">💡 Did you know?</p>
            <p className="text-white/50 text-xs sm:text-sm leading-relaxed animate-fade-in">
              A single tree can absorb up to 48 pounds of CO₂ per year
            </p>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration - responsive height */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 120" className="w-full h-16 sm:h-20 md:h-24 fill-white/5" preserveAspectRatio="none">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L0,120Z">
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values="
                M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L0,120Z;
                M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,64C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L0,120Z;
                M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L0,120Z
              "
            />
          </path>
        </svg>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Trees className="w-6 h-6 sm:w-8 sm:h-8 text-forest-500/20" />
      </div>
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <Wind className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-500/20" />
      </div>
    </div>
  );
}
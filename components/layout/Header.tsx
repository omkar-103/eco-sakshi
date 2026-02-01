// components/layout/Header.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  MapPin,
  FileText,
  Info,
  Phone,
  ChevronRight,
  Sparkles,
  Eye,
  User,
  Settings,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils/helpers';
import toast from 'react-hot-toast';

const navigation = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Reports', href: '/reports/public', icon: Eye },
  { label: 'Live Map', href: '/map/public', icon: MapPin },
  { label: 'Track', href: '/track', icon: FileText },
  { label: 'About', href: '/about', icon: Info },
  { label: 'Contact', href: '/contact', icon: Phone },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const checkScrollPosition = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    checkScrollPosition();
    setHasMounted(true);

    const handleScroll = () => {
      checkScrollPosition();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [checkScrollPosition]);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      setUserMenuOpen(false);
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    const routes: Record<string, string> = {
      citizen: '/citizen',
      authority: '/authority',
      ngo: '/ngo',
      admin: '/admin',
    };
    return routes[user.role] || '/citizen';
  };

  // Don't show on dashboard routes
  if (pathname.startsWith('/citizen') || 
      pathname.startsWith('/authority') || 
      pathname.startsWith('/ngo') || 
      pathname.startsWith('/admin')) {
    return null;
  }

  const isHeroPage = pathname === '/' || pathname === '/about';
  const isFloating = hasMounted && isHeroPage && !isScrolled;

  return (
    <>
      {/* Floating Pill Header */}
      <header
        className={cn(
          'fixed left-0 right-0 z-50 transition-all duration-500 ease-out',
          isFloating ? 'top-4 sm:top-6' : 'top-0'
        )}
      >
        <div className={cn(
          'mx-auto transition-all duration-500 ease-out',
          isFloating 
            ? 'max-w-fit px-4 sm:px-6' 
            : 'max-w-full'
        )}>
          {/* The Pill Container */}
          <div
            className={cn(
              'relative transition-all duration-500 ease-out',
              isFloating
                ? 'rounded-full px-3 sm:px-4 py-2 sm:py-2.5'
                : 'rounded-none px-4 sm:px-6 lg:px-8 py-3'
            )}
          >
            {/* Background */}
            <div className={cn(
              'absolute inset-0 transition-all duration-500',
              isFloating
                ? 'rounded-full bg-white/80 backdrop-blur-2xl shadow-xl shadow-black/[0.08] border border-white/60 ring-1 ring-black/[0.04]'
                : 'rounded-none bg-white/95 backdrop-blur-2xl shadow-md shadow-black/[0.05] border-b border-gray-200/80'
            )}>
              {/* Inner glow for floating state */}
              {isFloating && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
              )}
              
              {/* Top accent line for scrolled state */}
              <div className={cn(
                'absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 transition-all duration-500',
                isFloating ? 'h-0 opacity-0' : 'h-[2px] opacity-100'
              )} />
            </div>

            {/* Content */}
            <div className={cn(
              'relative flex items-center justify-between gap-2 sm:gap-4 transition-all duration-500',
              isFloating ? '' : 'max-w-7xl mx-auto'
            )}>
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0">
                <div className="relative">
                  {/* Glow effect */}
                  <div className={cn(
                    'absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 blur-md transition-opacity duration-300',
                    'group-hover:opacity-60'
                  )} />
                  
                  {/* Logo container */}
                  <div className={cn(
                    'relative rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden',
                    isFloating
                      ? 'w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm ring-1 ring-emerald-200/50'
                      : 'w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-white to-emerald-50 shadow-md ring-1 ring-emerald-200/30'
                  )}>
                    <Image
                      src="/logo.png"
                      alt="Eco Sakshi"
                      width={32}
                      height={32}
                      className={cn(
                        'object-contain transition-transform duration-300 group-hover:scale-110',
                        isFloating ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-6 h-6 sm:w-7 sm:h-7'
                      )}
                      priority
                    />
                  </div>
                </div>

                {/* Brand name - hidden on mobile when floating */}
                <span className={cn(
                  'font-bold font-display text-gradient-forest transition-all duration-300',
                  isFloating 
                    ? 'text-base sm:text-lg hidden sm:block' 
                    : 'text-lg sm:text-xl'
                )}>
                  Eco Sakshi
                </span>
              </Link>

              {/* Desktop Navigation - Center */}
              <nav className={cn(
                'hidden lg:flex items-center transition-all duration-500',
                isFloating ? 'gap-0.5' : 'gap-1'
              )}>
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative px-3 py-1.5 rounded-full font-medium text-sm transition-all duration-300 group',
                      pathname === item.href
                        ? 'text-white'
                        : 'text-gray-600 hover:text-emerald-700'
                    )}
                  >
                    {/* Active background */}
                    {pathname === item.href && (
                      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md shadow-emerald-500/25" />
                    )}
                    
                    {/* Hover background */}
                    <span className={cn(
                      'absolute inset-0 rounded-full bg-emerald-100/80 opacity-0 transition-opacity duration-200',
                      pathname !== item.href && 'group-hover:opacity-100'
                    )} />
                    
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Right Side */}
              <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
                {loading ? (
                  <div className={cn(
                    'rounded-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse',
                    isFloating ? 'w-8 h-8' : 'w-9 h-9'
                  )} />
                ) : user ? (
                  /* Logged In User */
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className={cn(
                        'flex items-center gap-2 rounded-full transition-all duration-300 group',
                        isFloating 
                          ? 'p-1 hover:bg-emerald-100/60' 
                          : 'p-1.5 hover:bg-emerald-50'
                      )}
                    >
                      <div className="relative">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className={cn(
                              'rounded-full object-cover ring-2 ring-emerald-200 group-hover:ring-emerald-400 transition-all',
                              isFloating ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-9 sm:h-9'
                            )}
                          />
                        ) : (
                          <div className={cn(
                            'rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center ring-2 ring-emerald-200 group-hover:ring-emerald-400 transition-all',
                            isFloating ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-9 sm:h-9'
                          )}>
                            <span className={cn(
                              'font-bold text-white',
                              isFloating ? 'text-xs' : 'text-sm'
                            )}>
                              {user.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        {/* Online dot */}
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                      </div>
                      
                      <ChevronDown className={cn(
                        'w-3.5 h-3.5 text-gray-400 transition-transform duration-300 hidden sm:block',
                        userMenuOpen && 'rotate-180'
                      )} />
                    </button>

                    {/* User Dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden animate-scale-in">
                        {/* Accent bar */}
                        <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
                        
                        {/* User info */}
                        <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md" />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center ring-2 ring-white shadow-md">
                                  <span className="text-lg font-bold text-white">{user.name?.charAt(0).toUpperCase()}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700 capitalize">
                                <Sparkles className="w-2.5 h-2.5" />
                                {user.role}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Menu items */}
                        <div className="p-2">
                          <Link
                            href={getDashboardLink()}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-emerald-50 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                            </div>
                            <span className="text-sm font-medium">Dashboard</span>
                            <ChevronRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                          </Link>
                          
                          <Link
                            href="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-emerald-50 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium">Profile</span>
                            <ChevronRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                          </Link>
                          
                          <Link
                            href={`/${user.role}/settings`}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-emerald-50 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                              <Settings className="w-4 h-4 text-amber-600" />
                            </div>
                            <span className="text-sm font-medium">Settings</span>
                            <ChevronRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className="p-2 border-t border-gray-100">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-red-600 hover:bg-red-50 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                              <LogOut className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Not Logged In */
                  <>
                    <Link
                      href="/login"
                      className={cn(
                        'hidden sm:block rounded-full font-semibold text-sm transition-all duration-300',
                        isFloating
                          ? 'px-3 py-1.5 text-gray-600 hover:text-emerald-700 hover:bg-emerald-100/60'
                          : 'px-4 py-2 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300'
                      )}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className={cn(
                        'relative rounded-full font-semibold text-sm text-white overflow-hidden transition-all duration-300 group',
                        isFloating
                          ? 'px-3 sm:px-4 py-1.5 sm:py-2'
                          : 'px-4 sm:px-5 py-2 sm:py-2.5'
                      )}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500" />
                      <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Get Started</span>
                        <span className="sm:hidden">Start</span>
                      </span>
                    </Link>
                  </>
                )}

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={cn(
                    'lg:hidden rounded-full transition-all duration-300',
                    isFloating
                      ? 'p-2 text-gray-600 hover:text-emerald-700 hover:bg-emerald-100/60'
                      : 'p-2.5 text-gray-700 hover:bg-emerald-50 border border-gray-200'
                  )}
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 z-50 w-[85%] max-w-sm h-full lg:hidden animate-slide-left">
            {/* Background */}
            <div className="absolute inset-0 bg-white" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-100/80 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-100/80 to-transparent rounded-full blur-3xl" />
            
            <div className="relative p-5 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center ring-1 ring-emerald-200/50 shadow-md">
                    <Image src="/logo.png" alt="Eco Sakshi" width={28} height={28} className="w-6 h-6 object-contain" />
                  </div>
                  <span className="text-lg font-bold font-display text-gradient-forest">Eco Sakshi</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* User Card */}
              {user && (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white/30" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30">
                        <span className="text-lg font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-white/80 capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <nav className="flex-1 space-y-1 overflow-y-auto">
                {navigation.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all',
                      pathname === item.href
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-emerald-50'
                    )}
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      pathname === item.href ? 'bg-white/20' : 'bg-emerald-100'
                    )}>
                      <item.icon className={cn('w-4 h-4', pathname === item.href ? 'text-white' : 'text-emerald-600')} />
                    </div>
                    {item.label}
                  </Link>
                ))}

                {user && (
                  <>
                    <div className="h-px bg-gray-200 my-4" />
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-emerald-50"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                      </div>
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-emerald-50"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      Profile
                    </Link>
                  </>
                )}
              </nav>

              {/* Bottom Actions */}
              <div className="mt-auto space-y-3 pt-4 border-t border-gray-100">
                {user ? (
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center py-3 rounded-xl border-2 border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:from-emerald-600 hover:to-teal-600 transition-colors"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        .text-gradient-forest {
          background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.25s ease-out;
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95) translateY(-8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }

        @keyframes slide-left {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-left {
          animation: slide-left 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
}
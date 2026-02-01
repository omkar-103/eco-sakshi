'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Leaf,
  Menu,
  X,
  Home,
  FileText,
  Map,
  BarChart3,
  Settings,
  LogOut,
  CreditCard,
  Users,
  ClipboardCheck,
  ChevronRight,
  Bell,
  Search,
  Sparkles,
  Shield,
  Building2,
  Download,
  Clock,
  ChevronLeft,
  Sun,
  Moon,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils/helpers';
import toast from 'react-hot-toast';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
  user: any;
}

const navigationByRole: Record<string, NavItem[]> = {
  citizen: [
    { label: 'Dashboard', href: '/citizen', icon: Home },
    { label: 'My Reports', href: '/citizen/reports', icon: FileText },
    { label: 'New Report', href: '/citizen/reports/new', icon: ClipboardCheck, badge: 'New' },
    { label: 'Map View', href: '/citizen/map', icon: Map },
    { label: 'Subscription', href: '/citizen/subscription', icon: CreditCard },
    { label: 'Settings', href: '/citizen/settings', icon: Settings },
  ],
  authority: [
    { label: 'Dashboard', href: '/authority', icon: Home },
    { label: 'Pending Review', href: '/authority/reports/pending', icon: Clock, badge: '12' },
    { label: 'All Reports', href: '/authority/reports', icon: FileText },
    { label: 'Analytics', href: '/authority/analytics', icon: BarChart3 },
    { label: 'Map View', href: '/authority/map', icon: Map },
    { label: 'Settings', href: '/authority/settings', icon: Settings },
  ],
  ngo: [
    { label: 'Dashboard', href: '/ngo', icon: Home },
    { label: 'Reports Data', href: '/ngo/reports', icon: FileText },
    { label: 'Analytics', href: '/ngo/analytics', icon: BarChart3 },
    { label: 'Map View', href: '/ngo/map', icon: Map },
    { label: 'Export Data', href: '/ngo/export', icon: Download },
    { label: 'Settings', href: '/ngo/settings', icon: Settings },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin', icon: Home },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'All Reports', href: '/admin/reports', icon: FileText },
    { label: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ],
};

const roleLabels: Record<string, { label: string; icon: React.ElementType; color: string; gradient: string }> = {
  citizen: { 
    label: 'Citizen', 
    icon: Sparkles, 
    color: 'text-forest-600 bg-forest-100 border-forest-200',
    gradient: 'from-forest-500 to-emerald-500'
  },
  authority: { 
    label: 'Authority', 
    icon: Shield, 
    color: 'text-ocean-600 bg-ocean-100 border-ocean-200',
    gradient: 'from-ocean-500 to-blue-500'
  },
  ngo: { 
    label: 'NGO', 
    icon: Building2, 
    color: 'text-purple-600 bg-purple-100 border-purple-200',
    gradient: 'from-purple-500 to-violet-500'
  },
  admin: { 
    label: 'Admin', 
    icon: Shield, 
    color: 'text-red-600 bg-red-100 border-red-200',
    gradient: 'from-red-500 to-rose-500'
  },
};

export default function DashboardShell({ children, user }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navigation = navigationByRole[user?.role] || navigationByRole.citizen;
  const roleInfo = roleLabels[user?.role] || roleLabels.citizen;
  const RoleIcon = roleInfo.icon;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      toast.success('Signed out successfully');
      router.push('/login');
      router.refresh();
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const currentPage = navigation.find(
    (item) => pathname === item.href || (item.href !== `/${user?.role}` && pathname.startsWith(item.href))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-forest-50/30">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-forest-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-ocean-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-emerald-200/15 rounded-full blur-3xl" />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300',
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full transform transition-all duration-300 ease-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-72',
          'w-[280px]'
        )}
      >
        <div className="flex h-full flex-col bg-white/95 backdrop-blur-xl border-r border-sage-200/60 shadow-2xl shadow-sage-900/5">
          {/* Sidebar gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest-500 via-emerald-500 to-teal-500" />
          
          {/* Logo */}
          <div className={cn(
            'flex items-center justify-between border-b border-sage-100 transition-all duration-300',
            sidebarCollapsed ? 'h-20 px-4' : 'h-20 px-5'
          )}>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                {/* Logo glow */}
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-forest-400 to-emerald-400 opacity-0 group-hover:opacity-75 blur transition-opacity duration-300" />
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-forest-500 via-forest-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-forest-500/30 group-hover:shadow-forest-500/50 transition-all duration-300 group-hover:scale-105">
                  <Image
                    src="/logo.png"
                    alt="EcoSakshi"
                    width={28}
                    height={28}
                    className="w-7 h-7 object-contain"
                  />
                </div>
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="text-xl font-bold font-display bg-gradient-to-r from-forest-700 via-forest-600 to-emerald-600 bg-clip-text text-transparent">
                    Eco Sakshi
                  </span>
                  <span className="text-[10px] font-medium text-sage-500 tracking-wider uppercase">
                    Environmental Witness
                  </span>
                </div>
              )}
            </Link>
            
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-sage-100 active:bg-sage-200 transition-colors"
            >
              <X className="w-5 h-5 text-sage-500" />
            </button>
            
            {/* Desktop collapse button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2 rounded-xl hover:bg-sage-100 transition-colors"
            >
              <ChevronLeft className={cn(
                'w-5 h-5 text-sage-400 transition-transform duration-300',
                sidebarCollapsed && 'rotate-180'
              )} />
            </button>
          </div>

          {/* User Info */}
          <div className={cn('p-4 transition-all duration-300', sidebarCollapsed && 'lg:p-2')}>
            <div className={cn(
              'relative overflow-hidden rounded-2xl bg-gradient-to-br from-forest-500 via-forest-600 to-emerald-600 p-[1px]',
              sidebarCollapsed && 'lg:rounded-xl'
            )}>
              <div className={cn(
                'relative rounded-[15px] bg-gradient-to-br from-forest-50 via-white to-emerald-50 transition-all duration-300',
                sidebarCollapsed ? 'lg:p-2' : 'p-4'
              )}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-forest-200/30 to-transparent rounded-full blur-2xl" />
                
                <div className={cn(
                  'flex items-center gap-3 relative',
                  sidebarCollapsed && 'lg:justify-center'
                )}>
                  <div className="relative group">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className={cn(
                          'rounded-xl object-cover ring-2 ring-white shadow-lg transition-transform duration-300 group-hover:scale-105',
                          sidebarCollapsed ? 'lg:w-10 lg:h-10 w-12 h-12' : 'w-12 h-12'
                        )}
                      />
                    ) : (
                      <div className={cn(
                        'rounded-xl bg-gradient-to-br from-forest-500 to-emerald-600 flex items-center justify-center ring-2 ring-white shadow-lg transition-transform duration-300 group-hover:scale-105',
                        sidebarCollapsed ? 'lg:w-10 lg:h-10 w-12 h-12' : 'w-12 h-12'
                      )}>
                        <span className={cn(
                          'font-bold text-white',
                          sidebarCollapsed ? 'lg:text-sm text-lg' : 'text-lg'
                        )}>
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {/* Online indicator */}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                  </div>
                  
                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sage-900 truncate">{user?.name}</p>
                      <p className="text-xs text-sage-500 truncate mb-1.5">{user?.email}</p>
                      <div className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border',
                        roleInfo.color
                      )}>
                        <RoleIcon className="w-3 h-3" />
                        {roleInfo.label}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className={cn(
            'flex-1 pb-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-sage-200 scrollbar-track-transparent',
            sidebarCollapsed ? 'lg:px-2 px-4' : 'px-4'
          )}>
            <div className={cn(
              'text-[10px] font-semibold text-sage-400 uppercase tracking-wider mb-3',
              sidebarCollapsed ? 'lg:hidden' : 'px-3'
            )}>
              Main Menu
            </div>
            
            {navigation.map((item, index) => {
              const isActive = pathname === item.href || 
                (item.href !== `/${user?.role}` && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl font-medium transition-all duration-200 relative overflow-hidden',
                    sidebarCollapsed ? 'lg:p-3 lg:justify-center px-4 py-3' : 'px-4 py-3',
                    isActive
                      ? 'bg-gradient-to-r from-forest-500 to-emerald-500 text-white shadow-lg shadow-forest-500/25'
                      : 'text-sage-600 hover:bg-gradient-to-r hover:from-sage-100 hover:to-forest-50 hover:text-sage-900'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Active background glow */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10" />
                  )}
                  
                  {/* Icon */}
                  <div className={cn(
                    'relative z-10 flex items-center justify-center transition-transform duration-200',
                    isActive ? 'drop-shadow' : 'group-hover:scale-110'
                  )}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  
                  {/* Label */}
                  {!sidebarCollapsed && (
                    <>
                      <span className="relative z-10 flex-1">{item.label}</span>
                      
                      {/* Badge */}
                      {item.badge && (
                        <span className={cn(
                          'relative z-10 px-2 py-0.5 rounded-full text-[10px] font-bold',
                          isActive 
                            ? 'bg-white/25 text-white' 
                            : 'bg-forest-100 text-forest-700'
                        )}>
                          {item.badge}
                        </span>
                      )}
                      
                      {/* Arrow for active */}
                      {isActive && (
                        <ChevronRight className="w-4 h-4 relative z-10" />
                      )}
                    </>
                  )}
                  
                  {/* Tooltip for collapsed sidebar */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-2 rounded-lg bg-sage-900 text-white text-sm font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl z-50 hidden lg:block">
                      {item.label}
                      {item.badge && (
                        <span className="ml-2 px-1.5 py-0.5 rounded bg-white/20 text-[10px]">
                          {item.badge}
                        </span>
                      )}
                      <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-sage-900 rotate-45" />
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className={cn(
            'border-t border-sage-200/60 transition-all duration-300',
            sidebarCollapsed ? 'lg:p-2 p-4' : 'p-4'
          )}>
            {/* Help Link */}
            {!sidebarCollapsed && (
              <Link
                href="/help"
                className="flex items-center gap-3 px-4 py-2.5 mb-2 rounded-xl text-sage-500 hover:bg-sage-100 hover:text-sage-700 transition-colors text-sm"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Help & Support</span>
                <ExternalLink className="w-3 h-3 ml-auto" />
              </Link>
            )}
            
            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className={cn(
                'flex items-center gap-3 w-full rounded-xl text-red-600 hover:bg-red-50 active:bg-red-100 font-medium transition-all duration-200 group',
                sidebarCollapsed ? 'lg:p-3 lg:justify-center px-4 py-3' : 'px-4 py-3'
              )}
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {!sidebarCollapsed && <span>Sign Out</span>}
              
              {/* Tooltip for collapsed */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl z-50 hidden lg:block">
                  Sign Out
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-red-600 rotate-45" />
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        'transition-all duration-300 relative',
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
      )}>
        {/* Top Bar */}
        <header
          className={cn(
            'sticky top-0 z-30 transition-all duration-300',
            isScrolled
              ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-sage-900/5 border-b border-sage-200/50'
              : 'bg-transparent'
          )}
        >
          <div className="flex h-16 md:h-18 items-center justify-between px-4 lg:px-8 gap-4">
            {/* Left side - Menu & Breadcrumb */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2.5 rounded-xl bg-white/80 hover:bg-white shadow-sm border border-sage-200/50 active:scale-95 transition-all"
              >
                <Menu className="w-5 h-5 text-sage-700" />
              </button>

              {/* Breadcrumb / Current Page */}
              <div className="hidden sm:flex items-center gap-2 min-w-0">
                <div className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br',
                  roleInfo.gradient
                )}>
                  {currentPage?.icon && <currentPage.icon className="w-4 h-4 text-white" />}
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-sage-900 truncate">
                    {currentPage?.label || 'Dashboard'}
                  </h1>
                  <p className="text-xs text-sage-500 capitalize hidden md:block">
                    {user?.role} Portal
                  </p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className={cn(
              'hidden md:flex transition-all duration-300',
              searchFocused ? 'flex-1 max-w-xl' : 'w-64 lg:w-80'
            )}>
              <div className="relative w-full group">
                <Search className={cn(
                  'absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors',
                  searchFocused ? 'text-forest-500' : 'text-sage-400'
                )} />
                <input
                  type="text"
                  placeholder="Search reports, locations..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={cn(
                    'w-full pl-11 pr-4 py-2.5 rounded-xl border text-sm transition-all duration-300',
                    searchFocused
                      ? 'bg-white border-forest-300 ring-4 ring-forest-500/10 shadow-lg'
                      : 'bg-sage-50/80 border-sage-200 hover:border-sage-300 hover:bg-white'
                  )}
                />
                <kbd className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-sage-100 text-sage-500 text-[10px] font-medium transition-opacity',
                  searchFocused ? 'opacity-0' : 'opacity-100'
                )}>
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Mobile Search */}
              <button className="md:hidden p-2.5 rounded-xl bg-white/80 hover:bg-white shadow-sm border border-sage-200/50 transition-all">
                <Search className="w-5 h-5 text-sage-600" />
              </button>
              
              {/* Notifications */}
              <button className="relative p-2.5 rounded-xl bg-white/80 hover:bg-white shadow-sm border border-sage-200/50 transition-all group active:scale-95">
                <Bell className="w-5 h-5 text-sage-600 group-hover:text-sage-900 transition-colors" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
              </button>
              
              {/* User Avatar (Mobile) */}
              <Link 
                href={`/${user?.role}/settings`}
                className="sm:hidden relative p-1 rounded-xl bg-white/80 shadow-sm border border-sage-200/50"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                ) : (
                  <div className={cn(
                    'w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center',
                    roleInfo.gradient
                  )}>
                    <span className="text-xs font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </Link>
              
              {/* User Info (Desktop) */}
              <Link
                href={`/${user?.role}/settings`}
                className="hidden sm:flex items-center gap-3 pl-3 md:pl-4 border-l border-sage-200 hover:opacity-80 transition-opacity"
              >
                <div className="relative">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-sage-100 shadow-sm"
                    />
                  ) : (
                    <div className={cn(
                      'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center ring-2 ring-sage-100 shadow-sm',
                      roleInfo.gradient
                    )}>
                      <span className="text-sm font-bold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-sage-900 truncate max-w-[120px]">
                    {user?.name}
                  </p>
                  <p className="text-xs text-sage-500 capitalize">{user?.role}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-sage-400 hidden lg:block" />
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="relative p-4 md:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          {/* Content wrapper with max width */}
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t border-sage-200/60 shadow-2xl shadow-sage-900/10 safe-area-bottom">
          <div className="flex items-center justify-around px-2 py-2">
            {navigation.slice(0, 5).map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== `/${user?.role}` && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px]',
                    isActive
                      ? 'text-forest-600'
                      : 'text-sage-500 hover:text-sage-700 active:bg-sage-100'
                  )}
                >
                  <div className={cn(
                    'relative p-2 rounded-xl transition-all duration-200',
                    isActive && 'bg-forest-100'
                  )}>
                    <item.icon className={cn(
                      'w-5 h-5 transition-transform',
                      isActive && 'scale-110'
                    )} />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-red-500 text-white text-[8px] font-bold rounded-full">
                        {item.badge.length > 2 ? '!' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    'text-[10px] font-medium transition-colors',
                    isActive ? 'text-forest-700' : 'text-sage-500'
                  )}>
                    {item.label.split(' ')[0]}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Spacer for mobile bottom nav */}
        <div className="h-20 lg:hidden" />
      </div>

      <style jsx global>{`
        /* Safe area for mobile devices */
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0);
        }

        /* Scrollbar styling */
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        /* Hide scrollbar for nav on mobile */
        @media (max-width: 1024px) {
          nav::-webkit-scrollbar {
            display: none;
          }
          nav {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `}</style>
    </div>
  );
}
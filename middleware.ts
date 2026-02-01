import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define protected routes by role
const protectedRoutes = {
  citizen: ['/citizen'],
  authority: ['/authority'],
  ngo: ['/ngo'],
  admin: ['/admin'],
};

const publicRoutes = ['/', '/login'];

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

async function verifyTokenEdge(token: string): Promise<TokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow API auth routes
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get('auth-token')?.value;

  // Check if this is a protected route
  const isProtected = Object.values(protectedRoutes)
    .flat()
    .some((route) => pathname.startsWith(route));

  if (!token) {
    if (isProtected) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Verify token
  const payload = await verifyTokenEdge(token);

  if (!payload) {
    // Invalid token - clear it and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }

  const userRole = payload.role;

  // Redirect authenticated users away from login
  if (pathname === '/login') {
    const dashboardUrl = getDashboardUrl(userRole);
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  // Check if user has access to the requested route
  if (isProtected && !hasRouteAccess(pathname, userRole)) {
    const dashboardUrl = getDashboardUrl(userRole);
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  // Add user info to headers for downstream use
  const response = NextResponse.next();
  response.headers.set('x-user-id', payload.userId);
  response.headers.set('x-user-role', payload.role);
  response.headers.set('x-user-email', payload.email);

  return response;
}

function hasRouteAccess(pathname: string, role: string): boolean {
  // Admin has access to all routes
  if (role === 'admin') return true;

  // Check if the path matches the user's role
  const allowedRoutes = protectedRoutes[role as keyof typeof protectedRoutes] || [];
  return allowedRoutes.some((route) => pathname.startsWith(route));
}

function getDashboardUrl(role: string): string {
  const dashboards: Record<string, string> = {
    citizen: '/citizen',
    authority: '/authority',
    ngo: '/ngo',
    admin: '/admin',
  };
  return dashboards[role] || '/citizen';
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
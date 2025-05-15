import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, isAdmin, isUser, isOwner } from '@/config/auth';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  // Public pages that don't need authentication
  const publicPages = [
    '/signin',
    '/signup',
    '/forgotpassword',
    '/verifycode',
    '/resetpassword',
    '/homepage-before-login',
    '/home',
    '/unauthorized',
    '/'
  ];

  // Public API routes that don't need authentication
  const publicApiRoutes = [
    '/api/auth/signin',
    '/api/auth/signup',
    '/api/auth/forgot-password',
    '/api/auth/verifyemail',
    '/api/auth/verifyotp',
    '/api/auth/resetpassword',
    '/api/auth/resendverification',
    '/api/auth/resendotp'
  ];

  // Check if current page is public
  if (publicPages.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if current API route is public
  if (pathname.startsWith('/api/') && publicApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // ❌ No token -> redirect to login
  if (!token) {
    // For API routes, return 401 status
    if (pathname.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // For page routes, redirect to signin
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  try {
    const decoded = verifyToken(token);
    const userRole = decoded.role;

    // Admin pages protection - only admin role can access
    if (pathname.startsWith('/admin-') || pathname === '/admin-dashboard') {
      if (userRole !== 'admin') {
        if (pathname.startsWith('/api/')) {
          return new NextResponse(
            JSON.stringify({ message: 'Forbidden - Admin access required' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    // User pages protection - only user role can access
    if (pathname.startsWith('/user-') || pathname === '/homepage-before-login') {
      if (userRole !== 'user') {
        if (pathname.startsWith('/api/')) {
          return new NextResponse(
            JSON.stringify({ message: 'Forbidden - User access required' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    // Owner pages protection - only owner role can access
    if (pathname.startsWith('/owner-') || pathname === '/owner-dashboard') {
      if (userRole !== 'owner') {
        if (pathname.startsWith('/api/')) {
          return new NextResponse(
            JSON.stringify({ message: 'Forbidden - Owner access required' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    return NextResponse.next(); // ✅ Access granted
  } catch (error) {
    // Token error -> redirect to login
    if (pathname.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid or expired token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return NextResponse.redirect(new URL('/signin', req.url));
  }
}

// Update matcher to match all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};


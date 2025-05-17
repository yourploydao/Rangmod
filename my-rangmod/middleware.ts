import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, isAdmin, isUser, isOwner  } from '@/config/auth';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  // Log for testing
  console.log('Middleware - Path:', pathname);
  console.log('Middleware - Token exists:', !!token);

  // หน้า public --> ผ่านได้เลย
  if (!pathname.startsWith('/user') && 
      !pathname.startsWith('/admin') && 
      !pathname.startsWith('/owner')
    ) {
    console.log('Middleware - Public page, allowing access');
    return NextResponse.next();
  }

  // ❌ ไม่มี token -> ไป login
  if (!token) {
    console.log('Middleware - No token, redirecting to login');
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  try {
    const decoded = verifyToken(token);
    console.log('Middleware - Decoded token:', {
      id: decoded.id,
      role: decoded.role
    });

    //# ยังไม่ได้ทำ new URL #//

    // ❌ User Owner ห้ามเข้า admin page
    if (pathname.startsWith('/admin') && !isAdmin(decoded)) {
      console.log('Middleware - Unauthorized admin access attempt');
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // ❌ Admin Owner ห้ามเข้า user page
    if (pathname.startsWith('/user') && !isUser(decoded)) {
      console.log('Middleware - Unauthorized user access attempt');
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // ❌ Admin User ห้ามเข้า owner page
    if (pathname.startsWith('/owner') && !isOwner(decoded)) {
      console.log('Middleware - Unauthorized owner access attempt');
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    console.log('Middleware - Access granted');
    return NextResponse.next(); // ✅ ผ่านได้
  } catch (error) {
    // Token ผิดพลาด -> logout
    console.log('Middleware - Token error:', error);
    return NextResponse.redirect(new URL('/signin', req.url));
  }
}

// url ต้องขึ้นด้วย /role/path ถึงจะเข้าหน้าตม role ได้
export const config = {
  matcher: ['/user/:path*', '/admin/:path*', '/owner/:path*'],
};

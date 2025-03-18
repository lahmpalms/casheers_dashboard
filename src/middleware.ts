import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // This is a simple client-side authentication check
  // Most of the authentication logic is handled in the AuthProvider component
  
  // Skip middleware for API routes and public assets
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Allow access to login page
  if (request.nextUrl.pathname.startsWith('/auth/login')) {
    return NextResponse.next();
  }

  // For other routes, we'll let the client-side AuthProvider handle authentication
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 
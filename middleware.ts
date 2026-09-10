import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the route starts with /api/
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Allow the request to pass through
    const response = NextResponse.next();
    
    // Add basic rate limit headers
    response.headers.set('X-RateLimit-Limit', '100');
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};

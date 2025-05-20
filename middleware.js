import { NextResponse } from 'next/server';

// Middleware function that handles incoming requests
export default function middleware(request) {
  // Skip middleware in production builds when using static export
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_OUTPUT === 'export') {
    return NextResponse.next();
  }

  // For WebSocket requests to the chess socket endpoint
  if (request.nextUrl.pathname.startsWith('/api/chess-socket') && 
      request.headers.get('upgrade') === 'websocket') {
    // Let the API route handle WebSocket upgrades
    return NextResponse.next();
  }

  // For normal API requests
  if (request.nextUrl.pathname.startsWith('/api/chess-socket')) {
    // Set CORS headers for API requests
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }

  // Handle 404s for GitHub Pages by redirecting to the correct path
  if (request.nextUrl.pathname.endsWith('.html') || 
      request.nextUrl.pathname.endsWith('/')) {
    return NextResponse.next();
  }

  // Add trailing slash for consistent routing
  if (!request.nextUrl.pathname.endsWith('/') && 
      !request.nextUrl.pathname.includes('.')) {
    const url = request.nextUrl.clone();
    url.pathname += '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/api/chess-socket/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ],
}; 
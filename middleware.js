import { NextResponse } from 'next/server';

// Middleware function that handles incoming requests
export default function middleware(request) {
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

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: ['/api/chess-socket/:path*'],
}; 
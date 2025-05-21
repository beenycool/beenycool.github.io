import { NextResponse } from 'next/server';

// Middleware function that handles incoming requests
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Log the request path for debugging
  console.log(`Middleware processing: ${pathname}`);
  
  // Skip middleware in production builds when using static export
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_OUTPUT === 'export') {
    return NextResponse.next();
  }

  // For WebSocket requests to the chess socket endpoint
  if (pathname.startsWith('/api/chess-socket') && 
      request.headers.get('upgrade') === 'websocket') {
    // Let the API route handle WebSocket upgrades
    return NextResponse.next();
  }

  // For normal API requests
  if (pathname.startsWith('/api/chess-socket')) {
    // Set CORS headers for API requests
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }

  // Handle 404s for GitHub Pages by redirecting to the correct path
  if (pathname.endsWith('.html') || 
      pathname.endsWith('/')) {
    return NextResponse.next();
  }

  // Add trailing slash for consistent routing
  if (!pathname.endsWith('/') && 
      !pathname.includes('.')) {
    const url = request.nextUrl.clone();
    url.pathname += '/';
    return NextResponse.redirect(url);
  }

  // Handle API requests that might need to be redirected
  if (pathname.startsWith('/auth/events') || 
      pathname.startsWith('/api/github/completions') || 
      pathname.startsWith('/api/chat/completions')) {
    
    // Check if we should use our local API handlers
    const useLocalApi = process.env.USE_LOCAL_API === 'true';
    
    if (useLocalApi) {
      // Rewrite to our local API handlers
      const newPathname = pathname.startsWith('/auth/') 
        ? `/api${pathname}` // Rewrite /auth/events to /api/auth/events
        : pathname; // Keep /api paths as is
      
      const url = request.nextUrl.clone();
      url.pathname = newPathname;
      return NextResponse.rewrite(url);
    }
    
    // Otherwise, try the backend first
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://beenycool-github-io.onrender.com';
    return NextResponse.rewrite(new URL(pathname, backendUrl));
  }

  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    '/auth/:path*',
    '/api/github/:path*',
    '/api/chat/:path*',
    '/api/chess-socket/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ],
}; 
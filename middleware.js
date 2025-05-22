import { NextResponse } from 'next/server';

// Helper function to remove 'interest-cohort' from Permissions-Policy header
function adjustPermissionsPolicy(response) {
  const policyHeader = response.headers.get('Permissions-Policy');
  if (policyHeader) {
    const directives = policyHeader.split(',').map(d => d.trim());
    // Filter out any directive that starts with 'interest-cohort'
    const filteredDirectives = directives.filter(directive =>
      !directive.toLowerCase().startsWith('interest-cohort')
    );
    const newPolicy = filteredDirectives.join(', ');

    if (newPolicy) {
      response.headers.set('Permissions-Policy', newPolicy);
    } else {
      // If the policy becomes empty, remove the header
      response.headers.delete('Permissions-Policy');
    }
  }
  
  // Also set the header directly on the response to ensure it's applied
  // This helps with GitHub Pages deployments
  response.headers.set('Permissions-Policy', 'interest-cohort=()');
  return response;
}

// Middleware function that handles incoming requests
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Log the request path for debugging
  console.log(`Middleware processing: ${pathname}`);
  
  // Skip middleware in production builds when using static export
  // Check environment variables to determine if we're in static export mode
  const isStaticExport = process.env.IS_STATIC_EXPORT === 'true';
  if (isStaticExport || (process.env.NODE_ENV === 'production' && process.env.NEXT_OUTPUT === 'export')) {
    console.log('Static export detected - middleware bypassed');
    return adjustPermissionsPolicy(NextResponse.next());
  }

  // For WebSocket requests to the chess socket endpoint
  if (pathname.startsWith('/api/chess-socket') && 
      request.headers.get('upgrade') === 'websocket') {
    // Let the API route handle WebSocket upgrades
    return adjustPermissionsPolicy(NextResponse.next());
  }

  // For normal API requests
  if (pathname.startsWith('/api/chess-socket')) {
    // Set CORS headers for API requests
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return adjustPermissionsPolicy(response);
  }

  // Handle 404s for GitHub Pages by redirecting to the correct path
  if (pathname.endsWith('.html') || 
      pathname.endsWith('/')) {
    return adjustPermissionsPolicy(NextResponse.next());
  }

  // Add trailing slash for consistent routing, but not for API routes
  if (!pathname.startsWith('/api/') && // Do not add trailing slash to API routes
      !pathname.endsWith('/') &&
      !pathname.includes('.')) {
    const url = request.nextUrl.clone();
    url.pathname += '/';
    return adjustPermissionsPolicy(NextResponse.redirect(url));
  }

  // Handle API requests that might need to be redirected
  if (pathname.startsWith('/auth/events') || 
      pathname.startsWith('/api/github/completions') || 
      pathname.startsWith('/api/chat/completions')) {
    
    // For static export, we need to handle this differently
    if (isStaticExport) {
      console.log('Static export detected - skipping API middleware');
      return adjustPermissionsPolicy(NextResponse.next());
    }
    
    // Check if we should use our local API handlers
    const useLocalApi = process.env.USE_LOCAL_API === 'true';
    
    if (useLocalApi) {
      // Rewrite to our local API handlers
      const newPathname = pathname.startsWith('/auth/') 
        ? `/api${pathname}` // Rewrite /auth/events to /api/auth/events
        : pathname; // Keep /api paths as is
      
      const url = request.nextUrl.clone();
      url.pathname = newPathname;
      return adjustPermissionsPolicy(NextResponse.rewrite(url));
    }
    
    // Otherwise, try the backend first
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://beenycool-github-io.onrender.com';
    
    // Make sure we're not appending /api twice for API calls
    const apiPath = pathname.startsWith('/api/') ? pathname : `/api${pathname}`;
    return adjustPermissionsPolicy(NextResponse.rewrite(new URL(apiPath, backendUrl)));
  }

  // Check if this is an API request for user data
  if (pathname.startsWith('/api/auth/user')) {
    // Get the Authorization header
    const authHeader = request.headers.get('Authorization');
    
    // Check if the request is for the Beeny user
    // In a real app, you would validate the token properly
    // This is just a mock implementation for demonstration
    if (authHeader) {
      // Clone the request to modify it
      const response = NextResponse.next();
      
      // Override the response to grant admin access
      response.headers.set('X-Override-Role', 'admin');
      
      return response;
    }
  }

  // For admin page access
  if (pathname.startsWith('/admin')) {
    // Allow access to admin page
    return NextResponse.next();
  }

  return adjustPermissionsPolicy(NextResponse.next());
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    '/auth/:path*',
    '/api/github/:path*',
    '/api/chat/:path*',
    '/api/chess-socket/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/api/auth/user',
    '/admin/:path*'
  ],
}; 
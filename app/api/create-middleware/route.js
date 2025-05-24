import { NextResponse } from 'next/server';

// This endpoint is used to create middleware handlers on the fly
// It's only needed for local development - on GitHub Pages, this is a no-op

// Add static export for compatibility with static builds
export const dynamic = 'force-static';

export async function POST(request) {
  // For GitHub Pages, just return success without doing anything
  return NextResponse.json({ 
    success: true,
    message: 'GitHub Pages static environment - middleware creation simulated',
    isStatic: true
  });
}

export async function OPTIONS(request) {
  // Handle preflight requests for CORS
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
} 
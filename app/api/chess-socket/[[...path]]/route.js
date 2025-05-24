import { NextResponse } from 'next/server';

// Add static export for compatibility with static builds
export const dynamic = 'force-static';

// For static exports, generate an empty params list
// This prevents the build from trying to pre-render dynamic API routes
export function generateStaticParams() {
  // Return empty array for static builds
  return [];
}

// Simple static response for GitHub Pages
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Chess API is available on the external backend',
      redirectTo: 'https://beenycool-github-io.onrender.com/api/chess-socket'
    },
    { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
}

export async function POST() {
  return NextResponse.json(
    { 
      message: 'Chess API is available on the external backend',
      redirectTo: 'https://beenycool-github-io.onrender.com/api/chess-socket'
    },
    { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
} 
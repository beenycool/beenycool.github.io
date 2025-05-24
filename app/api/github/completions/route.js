"use client";

import { NextResponse } from 'next/server';

// This file is a placeholder that will be used in non-GitHub Pages environments
// In GitHub Pages, all calls should be redirected to the remote backend by api-helpers.js

// Remove dynamic export for static build
// export const dynamic = 'force-dynamic';
export const dynamic = 'force-static';

// Handle GET requests for GitHub completions
export async function GET(request) {
  // Redirect to backend server
  return new NextResponse(
    JSON.stringify({
      message: 'GitHub Pages static redirect - please use the dynamic API URL',
      redirected: true
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
}

// Handle POST requests for GitHub completions
export async function POST(request) {
  // Redirect to backend server
  return new NextResponse(
    JSON.stringify({
      message: 'GitHub Pages static redirect - please use the dynamic API URL',
      redirected: true
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
}

export async function OPTIONS(request) {
  // Handle preflight requests
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
} 
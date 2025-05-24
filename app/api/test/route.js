import { NextResponse } from 'next/server';
import { getApiBaseUrl, isGitHubPages, constructApiUrl } from '@/lib/api-helpers';

// This is a simple test endpoint that returns info about the current environment

export const dynamic = "force-static";

export async function GET(request) {
  const isGitHubPagesEnv = typeof window !== 'undefined' && isGitHubPages();
  const apiBaseUrl = getApiBaseUrl();
  
  // Test constructing some URLs
  const testUrls = {
    health: constructApiUrl('health'),
    completions: constructApiUrl('github/completions'),
    chat: constructApiUrl('chat/completions')
  };

  return NextResponse.json({
    environment: process.env.NODE_ENV || 'unknown',
    isGitHubPages: isGitHubPagesEnv,
    apiBaseUrl,
    testUrls,
    message: 'This is a test endpoint to verify API routing',
    currentHostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
    timestamp: new Date().toISOString()
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}

export async function OPTIONS(request) {
  // Handle preflight requests
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
} 
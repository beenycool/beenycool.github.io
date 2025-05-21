import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Check if we're on GitHub Pages by inspecting the request URL or headers
    const url = new URL(req.url);
    const isGitHubPages = url.hostname.includes('github.io');
    
    if (isGitHubPages) {
      console.log('GitHub Pages detected - simulating successful middleware creation');
      // For GitHub Pages, we simply return success without actually trying to create middleware
      return NextResponse.json({ 
        success: true, 
        message: 'GitHub Pages mode - middleware simulation successful',
        isGitHubPages: true
      });
    }
    
    // For non-GitHub Pages environments, forward the request to create middleware
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://beenycool-github-io.onrender.com/api';
    const response = await fetch(`${backendUrl}/create-middleware`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in create-middleware route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
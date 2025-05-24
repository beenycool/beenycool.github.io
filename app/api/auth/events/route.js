import { NextResponse } from 'next/server';

// Add static export for compatibility with static builds
export const dynamic = 'force-static';

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Forward the event to the backend
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://beenycool-github-io.onrender.com/api';
    const response = await fetch(`${backendUrl}/auth/events`, {
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
    console.error('Error in auth/events route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
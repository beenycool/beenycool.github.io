import { NextResponse } from 'next/server';

// Remove dynamic export for static build
// export const dynamic = 'force-dynamic';

// Handle POST requests for GitHub completions
export async function POST(req) {
  try {
    const { messages } = await req.json();
    
    // Forward the request to the backend
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://beenycool-github-io.onrender.com/api';
    const response = await fetch(`${backendUrl}/github/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    // Get the response headers
    const contentType = response.headers.get('content-type');
    
    // If it's an SSE stream, handle it accordingly
    if (contentType && contentType.includes('text/event-stream')) {
      const reader = response.body.getReader();
      const stream = new ReadableStream({
        async start(controller) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
          controller.close();
        },
      });

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // For non-SSE responses, return as JSON
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in github/completions route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
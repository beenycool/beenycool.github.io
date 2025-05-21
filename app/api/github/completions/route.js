import { NextResponse } from 'next/server';

// Make this route dynamic to ensure it's not statically generated
export const dynamic = 'force-dynamic';

// Handle POST requests for GitHub completions
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Log the request for debugging
    console.log('GitHub completions request received');
    
    // First try to forward to the actual backend
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://beenycool-github-io.onrender.com';
      const response = await fetch(`${backendUrl}/api/github/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': request.headers.get('Accept') || 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        // If backend responds successfully, return that response
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('text/event-stream')) {
          // For streaming responses
          const reader = response.body.getReader();
          const stream = new ReadableStream({
            start(controller) {
              function push() {
                reader.read().then(({ done, value }) => {
                  if (done) {
                    controller.close();
                    return;
                  }
                  controller.enqueue(value);
                  push();
                });
              }
              push();
            }
          });
          
          return new Response(stream, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
            },
          });
        }
        
        // For non-streaming responses
        const responseData = await response.json();
        return NextResponse.json(responseData);
      }
    } catch (error) {
      console.log('Error forwarding to backend, using fallback', error);
      // Continue to fallback if backend request fails
    }
    
    // Fallback response when backend is unavailable
    return NextResponse.json(
      {
        id: "fallback-response-" + Date.now(),
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: data.model || "fallback-model",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: "I'm sorry, but the backend service is currently unavailable. Please try again later or use a different model."
            },
            finish_reason: "stop"
          }
        ],
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GitHub completions fallback:', error);
    return NextResponse.json(
      { error: 'Failed to process completion request' },
      { status: 500 }
    );
  }
} 
import { WebSocketHandler, initSocketServer } from '../route';
import { NextResponse } from 'next/server';

// This is a catch-all API route for the chess socket
export async function GET(request, { params }) {
  // WebSocket upgrade
  if (request.headers.get('upgrade') === 'websocket') {
    try {
      // Initialize Socket.IO server with the request
      const server = request.socket?.server;
      if (server) {
        initSocketServer(server);
      }
      
      // Handle WebSocket upgrade request
      return new Response(null, { status: 101 });
    } catch (error) {
      console.error('WebSocket initialization error:', error);
      return NextResponse.json({ error: 'Failed to initialize WebSocket' }, { status: 500 });
    }
  }
  
  // For normal GET requests, return current game status
  const path = params.path || [];
  
  // Handle different path levels
  if (path.length === 0) {
    // Root path - return general info
    return NextResponse.json({
      message: 'Chess Socket API is running',
      endpoints: ['/api/chess-socket/rooms', '/api/chess-socket/queue']
    });
  }
  
  if (path[0] === 'rooms') {
    // Return all active game rooms
    return NextResponse.json({
      activeRooms: true,
      // Socket server will provide the actual data
    });
  }
  
  if (path[0] === 'queue') {
    // Return queue status
    return NextResponse.json({
      queueStatus: true,
      // Socket server will provide the actual data
    });
  }
  
  // Default response
  return NextResponse.json({ message: 'Unknown path' }, { status: 404 });
}

export async function POST(request, { params }) {
  try {
    const data = await request.json();
    const path = params.path || [];
    
    // POST request routing based on path
    if (path.length > 0) {
      if (path[0] === 'rooms' && data.action === 'create') {
        return NextResponse.json({ 
          success: true, 
          message: 'Room creation handled by WebSocket',
        });
      }
      
      if (path[0] === 'join' && data.roomId) {
        return NextResponse.json({ 
          success: true,
          message: 'Room joining handled by WebSocket',
          roomId: data.roomId
        });
      }
    }
    
    // Default action handler
    return NextResponse.json({ 
      message: 'This endpoint is for WebSocket connections. Use Socket.IO client to connect.'
    });
  } catch (error) {
    console.error('Error processing POST request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Configuration for API route
export const config = {
  api: {
    bodyParser: false,
  },
}; 
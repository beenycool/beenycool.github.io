import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { WebSocketHandler } from './route';

// Create a singleton Socket.IO server instance
let io;

// Function to initialize Socket.IO server for Next.js API
export const initSocketServer = (req, res) => {
  if (!io) {
    // Set up response headers for WebSocket
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    const httpServer = res.socket.server;
    
    io = new SocketIOServer(httpServer, {
      path: '/api/chess-socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
    
    // Set up connection handler
    io.on('connection', WebSocketHandler());
    
    // Store io instance on the server object
    res.socket.server.io = io;
    
    console.log('Socket.IO server initialized');
  }
  
  return io;
};

// Helper function to handle WebSocket connection for Next.js API routes
export default async function socketHandler(req, res) {
  // Check if it's a WebSocket upgrade request
  if (req.method === 'GET' && req.headers.upgrade === 'websocket') {
    // If Socket.IO instance doesn't exist yet, initialize it
    if (!res.socket.server.io) {
      initSocketServer(req, res);
    }
    
    // Allow Next.js to handle the WebSocket connection
    res.end();
    return;
  }
  
  // For non-WebSocket requests, just respond with a message
  res.status(200).json({ message: 'WebSocket endpoint active' });
} 
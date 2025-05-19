import { Server as SocketIOServer } from 'socket.io';
import { Chess } from 'chess.js';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

// Game rooms state
const gameRooms = new Map();
// Players in matchmaking queue
const matchmakingQueue = [];
// Player stats
const playerStats = new Map();

// Socket.IO instance
let io;

// Create a new game room
function createGameRoom(timeControl = { initial: 600, increment: 0 }) {
  const roomId = uuidv4().substring(0, 8);
  
  gameRooms.set(roomId, {
    game: new Chess(),
    players: {
      white: null,
      black: null,
    },
    spectators: [],
    timeControl: {
      white: timeControl.initial,
      black: timeControl.initial,
      increment: timeControl.increment,
    },
    lastMoveTime: null,
    history: [],
    chat: [],
    gameOver: false,
    result: null,
  });
  
  return roomId;
}

// Handle timer updates
function startGameClock(roomId) {
  const room = gameRooms.get(roomId);
  if (!room) return;
  
  // Initialize last move time
  room.lastMoveTime = Date.now();
  
  // Clear any existing interval
  if (room.clockInterval) {
    clearInterval(room.clockInterval);
  }
  
  // Start a new interval
  room.clockInterval = setInterval(() => {
    if (room.gameOver) {
      clearInterval(room.clockInterval);
      return;
    }
    
    // Determine whose turn it is
    const currentPlayer = room.game.turn() === 'w' ? 'white' : 'black';
    
    // Update time
    const elapsed = (Date.now() - room.lastMoveTime) / 1000;
    room.timeControl[currentPlayer] -= elapsed;
    room.lastMoveTime = Date.now();
    
    // Check for time out
    if (room.timeControl[currentPlayer] <= 0) {
      room.timeControl[currentPlayer] = 0;
      room.gameOver = true;
      room.result = {
        result: `${currentPlayer === 'white' ? 'Black' : 'White'} wins by timeout`,
        winner: currentPlayer === 'white' ? 'black' : 'white'
      };
      
      // Broadcast game over
      io.to(roomId).emit('gameOver', room.result);
      clearInterval(room.clockInterval);
    }
    
    // Broadcast time updates
    io.to(roomId).emit('clockUpdate', {
      white: room.timeControl.white,
      black: room.timeControl.black
    });
  }, 1000);
}

// Route handlers
export async function GET(req) {
  // For WebSocket protocol upgrade
  if (req.headers.get('upgrade') === 'websocket') {
    return new Response(null, { status: 101 });
  }
  
  // For regular GET requests
  return NextResponse.json({ 
    status: 'active', 
    rooms: Array.from(gameRooms.keys()),
    playersInQueue: matchmakingQueue.length
  });
}

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Handle API actions
    if (data.action === 'listRooms') {
      const rooms = Array.from(gameRooms.keys()).map(id => {
        const room = gameRooms.get(id);
        return {
          id,
          players: {
            white: room.players.white?.name || null,
            black: room.players.black?.name || null
          },
          spectatorCount: room.spectators.length,
          inProgress: !!room.players.white && !!room.players.black
        };
      });
      
      return NextResponse.json({ rooms });
    }
    
    if (data.action === 'roomStatus') {
      const { roomId } = data;
      if (!gameRooms.has(roomId)) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
      }
      
      const room = gameRooms.get(roomId);
      return NextResponse.json({
        roomId,
        whitePlayer: room.players.white?.name || null,
        blackPlayer: room.players.black?.name || null,
        spectatorCount: room.spectators.length,
        inProgress: !!room.players.white && !!room.players.black,
        gameOver: room.gameOver,
        result: room.result
      });
    }
    
    // Default response for unknown actions
    return NextResponse.json({ message: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing POST request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// WebSocket handler 
export function WebSocketHandler() {
  // Return a function that can be used as the WebSocket handler
  return (socket) => {
    console.log('User connected:', socket.id);
    
    // Create a new game room
    socket.on('createRoom', ({ playerName, timeControl }) => {
      const roomId = createGameRoom(timeControl);
      
      // Join the room
      socket.join(roomId);
      
      // Assign player to white
      const room = gameRooms.get(roomId);
      room.players.white = {
        id: socket.id,
        name: playerName || 'Anonymous'
      };
      
      socket.emit('roomCreated', { 
        roomId, 
        color: 'white',
        timeControl: room.timeControl
      });
      
      socket.emit('joinedAsColor', { 
        color: 'white',
        timeControl: room.timeControl
      });
      
      console.log(`Room ${roomId} created by ${playerName || 'Anonymous'}`);
    });
    
    // Join an existing game room
    socket.on('joinRoom', ({ roomId, playerName, asSpectator }) => {
      // Check if room exists
      if (!gameRooms.has(roomId)) {
        socket.emit('roomError', { message: 'Room not found' });
        return;
      }
      
      const room = gameRooms.get(roomId);
      
      // Join as a spectator
      if (asSpectator) {
        socket.join(roomId);
        
        const spectator = {
          id: socket.id,
          name: playerName || 'Anonymous Spectator'
        };
        
        room.spectators.push(spectator);
        
        socket.emit('joinedAsSpectator', {
          gameState: room.game.fen(),
          history: room.history,
          chat: room.chat,
          players: {
            white: room.players.white ? room.players.white.name : 'Waiting...',
            black: room.players.black ? room.players.black.name : 'Waiting...'
          },
          timeControl: room.timeControl
        });
        
        // Broadcast to room that a spectator joined
        socket.to(roomId).emit('spectatorJoined', {
          spectatorName: spectator.name,
          spectatorCount: room.spectators.length
        });
        
        console.log(`${playerName || 'Anonymous Spectator'} joined room ${roomId} as spectator`);
        return;
      }
      
      // Try to join as a player
      if (!room.players.white) {
        // Join as white
        room.players.white = {
          id: socket.id,
          name: playerName || 'Anonymous'
        };
        
        socket.join(roomId);
        socket.emit('joinedAsColor', { 
          color: 'white',
          timeControl: room.timeControl
        });
        
        // Notify black player if they exist
        if (room.players.black) {
          socket.to(room.players.black.id).emit('opponentJoined', {
            opponentName: playerName || 'Anonymous'
          });
          
          socket.emit('opponentJoined', {
            opponentName: room.players.black.name
          });
        }
      } else if (!room.players.black) {
        // Join as black
        room.players.black = {
          id: socket.id,
          name: playerName || 'Anonymous'
        };
        
        socket.join(roomId);
        socket.emit('joinedAsColor', { 
          color: 'black',
          timeControl: room.timeControl
        });
        
        // Notify white player
        socket.to(room.players.white.id).emit('opponentJoined', {
          opponentName: playerName || 'Anonymous'
        });
        
        socket.emit('opponentJoined', {
          opponentName: room.players.white.name
        });
        
        // Both players have joined, start the game
        if (room.players.white && room.players.black) {
          startGameClock(roomId);
        }
      } else {
        // Room is full, join as spectator
        socket.join(roomId);
        
        const spectator = {
          id: socket.id,
          name: playerName || 'Anonymous Spectator'
        };
        
        room.spectators.push(spectator);
        
        socket.emit('joinedAsSpectator', {
          gameState: room.game.fen(),
          history: room.history,
          chat: room.chat,
          players: {
            white: room.players.white.name,
            black: room.players.black.name
          },
          timeControl: room.timeControl
        });
        
        // Broadcast to room that a spectator joined
        socket.to(roomId).emit('spectatorJoined', {
          spectatorName: spectator.name,
          spectatorCount: room.spectators.length
        });
      }
      
      console.log(`${playerName || 'Anonymous'} joined room ${roomId}`);
    });
    
    // Handle player move
    socket.on('makeMove', ({ roomId, move, player }) => {
      // Check if room exists
      if (!gameRooms.has(roomId)) {
        socket.emit('moveError', { message: 'Room not found' });
        return;
      }
      
      const room = gameRooms.get(roomId);
      
      // Check if it's the player's turn
      const currentTurn = room.game.turn() === 'w' ? 'white' : 'black';
      if (player !== currentTurn) {
        socket.emit('moveError', { message: 'Not your turn' });
        return;
      }
      
      // Try to make the move
      try {
        const moveObj = room.game.move(move);
        
        // Update the game history
        room.history.push(room.game.fen());
        
        // Add increment time if available
        if (room.timeControl.increment > 0) {
          room.timeControl[player] += room.timeControl.increment;
        }
        
        // Reset move time
        room.lastMoveTime = Date.now();
        
        // Check for game over
        if (room.game.isGameOver()) {
          room.gameOver = true;
          
          if (room.game.isCheckmate()) {
            room.result = {
              result: `Checkmate - ${currentTurn === 'white' ? 'White' : 'Black'} wins`,
              winner: currentTurn
            };
          } else if (room.game.isDraw()) {
            let reason = 'Draw';
            if (room.game.isStalemate()) {
              reason = 'Stalemate';
            } else if (room.game.isThreefoldRepetition()) {
              reason = 'Threefold Repetition';
            } else if (room.game.isInsufficientMaterial()) {
              reason = 'Insufficient Material';
            }
            
            room.result = {
              result: reason,
              winner: null
            };
          }
          
          // Broadcast game over
          io.to(roomId).emit('gameOver', room.result);
          
          // Clear game clock
          if (room.clockInterval) {
            clearInterval(room.clockInterval);
          }
        }
        
        // Broadcast the move to all other players
        socket.to(roomId).emit('opponentMove', {
          move: moveObj,
          gameState: room.game.fen(),
          remainingTime: room.timeControl
        });
        
        console.log(`Move made in room ${roomId} by ${player}`);
      } catch (error) {
        socket.emit('moveError', { message: 'Invalid move' });
      }
    });
    
    // Enter matchmaking queue
    socket.on('enterMatchmaking', ({ playerName, timeControl }) => {
      // Check if player is already in queue
      const existingIndex = matchmakingQueue.findIndex(entry => entry.id === socket.id);
      if (existingIndex !== -1) {
        socket.emit('matchmakingError', { message: 'Already in queue' });
        return;
      }
      
      // Add player to queue
      matchmakingQueue.push({
        id: socket.id,
        name: playerName || 'Anonymous',
        timeControl,
        joinTime: Date.now()
      });
      
      socket.emit('waitingForMatch');
      
      // Check for match
      if (matchmakingQueue.length >= 2) {
        // Take first two players
        const player1 = matchmakingQueue.shift();
        const player2 = matchmakingQueue.shift();
        
        // Create a game room
        const roomId = createGameRoom(player1.timeControl);
        const room = gameRooms.get(roomId);
        
        // Randomly assign colors
        const isPlayer1White = Math.random() >= 0.5;
        
        if (isPlayer1White) {
          room.players.white = {
            id: player1.id,
            name: player1.name
          };
          room.players.black = {
            id: player2.id,
            name: player2.name
          };
        } else {
          room.players.white = {
            id: player2.id,
            name: player2.name
          };
          room.players.black = {
            id: player1.id,
            name: player1.name
          };
        }
        
        // Notify both players
        io.to(player1.id).emit('matchFound', {
          roomId,
          color: isPlayer1White ? 'white' : 'black',
          opponent: isPlayer1White ? player2.name : room.players.white.name,
          timeControl: room.timeControl
        });
        
        io.to(player2.id).emit('matchFound', {
          roomId,
          color: isPlayer1White ? 'black' : 'white',
          opponent: isPlayer1White ? player1.name : room.players.black.name,
          timeControl: room.timeControl
        });
        
        // Add players to room
        io.sockets.sockets.get(player1.id)?.join(roomId);
        io.sockets.sockets.get(player2.id)?.join(roomId);
        
        // Start game clock
        startGameClock(roomId);
        
        console.log(`Match found: ${player1.name} vs ${player2.name} in room ${roomId}`);
      }
    });
    
    // Cancel matchmaking
    socket.on('cancelMatchmaking', () => {
      const index = matchmakingQueue.findIndex(entry => entry.id === socket.id);
      if (index !== -1) {
        matchmakingQueue.splice(index, 1);
        socket.emit('matchmakingCancelled');
        console.log(`Player ${socket.id} cancelled matchmaking`);
      }
    });
    
    // Chat messages
    socket.on('sendMessage', ({ roomId, message, playerColor }) => {
      if (!gameRooms.has(roomId)) return;
      
      const room = gameRooms.get(roomId);
      
      // Create message object
      const messageObj = {
        sender: playerColor === 'white' 
          ? room.players.white?.name || 'White' 
          : playerColor === 'black'
            ? room.players.black?.name || 'Black'
            : 'Spectator',
        message,
        timestamp: new Date().toISOString(),
        role: playerColor
      };
      
      // Add to room chat history
      room.chat.push(messageObj);
      
      // Broadcast to everyone else in the room
      socket.to(roomId).emit('newMessage', messageObj);
      
      console.log(`Message sent in room ${roomId} by ${messageObj.sender}`);
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      // Remove from matchmaking queue if present
      const queueIndex = matchmakingQueue.findIndex(entry => entry.id === socket.id);
      if (queueIndex !== -1) {
        matchmakingQueue.splice(queueIndex, 1);
      }
      
      // Check all game rooms
      for (const [roomId, room] of gameRooms.entries()) {
        // Check if disconnected user is a player
        if (room.players.white?.id === socket.id) {
          // Notify room that white player disconnected
          socket.to(roomId).emit('opponentDisconnected', { color: 'white' });
          console.log(`White player disconnected from room ${roomId}`);
        } else if (room.players.black?.id === socket.id) {
          // Notify room that black player disconnected
          socket.to(roomId).emit('opponentDisconnected', { color: 'black' });
          console.log(`Black player disconnected from room ${roomId}`);
        } else {
          // Check if user is a spectator
          const spectatorIndex = room.spectators.findIndex(s => s.id === socket.id);
          if (spectatorIndex !== -1) {
            // Remove from spectators array
            room.spectators.splice(spectatorIndex, 1);
            
            // Notify room
            socket.to(roomId).emit('spectatorLeft', {
              spectatorCount: room.spectators.length
            });
            
            console.log(`Spectator left room ${roomId}`);
          }
        }
        
        // Clean up empty rooms
        if ((!room.players.white || !room.players.black) && room.spectators.length === 0) {
          // Clear interval if exists
          if (room.clockInterval) {
            clearInterval(room.clockInterval);
          }
          
          // Remove room after a delay to allow for reconnection
          setTimeout(() => {
            // Check again if room is still empty
            if ((!room.players.white || !room.players.black) && room.spectators.length === 0) {
              gameRooms.delete(roomId);
              console.log(`Room ${roomId} deleted - no players or spectators`);
            }
          }, 60000); // 1 minute delay
        }
      }
    });
  };
}

// Initialize or get the Socket.IO server
export function initSocketServer(server) {
  if (!io) {
    io = new SocketIOServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      },
      path: '/api/chess-socket'
    });
    
    io.on('connection', WebSocketHandler());
    console.log('Socket.IO server initialized');
  }
  return io;
}

// Export io instance for use in other parts of the application
export { io };

// API route configuration
export const config = {
  api: {
    bodyParser: false,
  },
}; 
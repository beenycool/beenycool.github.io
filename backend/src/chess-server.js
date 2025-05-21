const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { Chess } = require('chess.js');

// JWT Secret (should match the one in your auth controller/middleware)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Try to load port manager, but provide fallbacks if it fails
let freePort, findAvailablePort;
try {
  const portManager = require('./utils/port-manager');
  freePort = portManager.freePort;
  findAvailablePort = portManager.findAvailablePort;
} catch (error) {
  console.warn('Could not load port-manager.js, using fallbacks:', error.message);
  // Simple fallbacks that just resolve
  freePort = () => Promise.resolve(true);
  findAvailablePort = (port) => Promise.resolve(port);
}

// Import models from index
const { User, ChessGame, ActivityLog, Guild } = require('./models');

// Create Express app and HTTP server
const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Data storage
const STORAGE_DIR = path.join(__dirname, '..', 'data');
const GAMES_FILE = path.join(STORAGE_DIR, 'games.json');

// Create storage directory if it doesn't exist
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// Initialize games storage
if (!fs.existsSync(GAMES_FILE)) {
  fs.writeFileSync(GAMES_FILE, JSON.stringify({
    games: {},
    userStats: {}
  }));
}

// Load saved games
let gamesData;
try {
  gamesData = JSON.parse(fs.readFileSync(GAMES_FILE, 'utf8'));
} catch (error) {
  console.error('Error loading games data:', error);
  gamesData = { games: {}, userStats: {} };
}

// Store active game rooms
const gameRooms = new Map();
// Matchmaking queue
const waitingPlayers = [];
// Active chess clocks
const activeClocks = new Map();

// Save games data to file
function saveGamesData() {
  try {
    fs.writeFileSync(GAMES_FILE, JSON.stringify(gamesData, null, 2));
  } catch (error) {
    console.error('Error saving games data:', error);
  }
}

// Update player stats
function updatePlayerStats(playerId, isWin) {
  if (!gamesData.userStats[playerId]) {
    gamesData.userStats[playerId] = {
      wins: 0,
      losses: 0,
      draws: 0,
      rating: 1200 // Initial Elo rating
    };
  }
  
  if (isWin === true) {
    gamesData.userStats[playerId].wins++;
  } else if (isWin === false) {
    gamesData.userStats[playerId].losses++;
  } else {
    gamesData.userStats[playerId].draws++;
  }
  
  saveGamesData();
}

// Chess clock timer function
function startChessClock(roomId) {
  const room = gameRooms.get(roomId);
  if (!room) return;
  
  // Clear any existing interval
  if (activeClocks.has(roomId)) {
    clearInterval(activeClocks.get(roomId));
  }
  
  // Start a new interval
  const clockInterval = setInterval(() => {
    const room = gameRooms.get(roomId);
    if (!room) {
      clearInterval(clockInterval);
      activeClocks.delete(roomId);
      return;
    }
    
    // Decrement active player's time
    if (room.currentTurn === 'white' && room.timeControl.whiteTime > 0) {
      room.timeControl.whiteTime -= 1;
    } else if (room.currentTurn === 'black' && room.timeControl.blackTime > 0) {
      room.timeControl.blackTime -= 1;
    }
    
    // Check for time out
    if ((room.currentTurn === 'white' && room.timeControl.whiteTime <= 0) || 
        (room.currentTurn === 'black' && room.timeControl.blackTime <= 0)) {
      // Game over due to timeout
      const winner = room.currentTurn === 'white' ? 'black' : 'white';
      io.to(roomId).emit('gameOver', { 
        reason: 'timeout', 
        winner 
      });
      
      // Update stats
      if (winner === 'white' && room.white) {
        updatePlayerStats(room.white, true);
        if (room.black) updatePlayerStats(room.black, false);
      } else if (winner === 'black' && room.black) {
        updatePlayerStats(room.black, true);
        if (room.white) updatePlayerStats(room.white, false);
      }
      
      // Save game for replay
      saveGameForReplay(roomId, {
        result: `${winner} wins by timeout`,
        winner
      });
      
      // Stop the clock
      clearInterval(clockInterval);
      activeClocks.delete(roomId);
    } else {
      // Emit clock update
      io.to(roomId).emit('clockUpdate', {
        white: room.timeControl.whiteTime,
        black: room.timeControl.blackTime
      });
    }
  }, 1000);
  
  activeClocks.set(roomId, clockInterval);
}

// Save game for replay
function saveGameForReplay(roomId, endInfo = null) {
  const room = gameRooms.get(roomId);
  if (!room) return;
  
  const gameData = {
    id: roomId,
    createdAt: room.createdAt,
    endedAt: endInfo ? new Date().toISOString() : null,
    players: {
      white: room.whiteName || 'Anonymous',
      black: room.blackName || 'Anonymous'
    },
    timeControl: room.timeControl ? {
      initial: room.timeControl.initial,
      increment: room.timeControl.increment
    } : null,
    moves: room.moves || [],
    chat: room.chat || [],
    result: endInfo ? endInfo.result : 'ongoing',
    winner: endInfo ? endInfo.winner : null,
    finalPosition: room.gameState
  };
  
  // Save to storage
  gamesData.games[roomId] = gameData;
  saveGamesData();
}

// Find a match for player
function findMatch(socket, playerOptions) {
  try {
    // Check if any player is waiting with compatible options
    const matchIndex = waitingPlayers.findIndex(player => {
      // For demo, just match any player
      // In production, match by rating, time control preferences, etc.
      return true; // Basic matching for now
    });

    if (matchIndex !== -1) {
      const opponent = waitingPlayers[matchIndex];
      waitingPlayers.splice(matchIndex, 1); // Remove matched player

      const roomId = `match_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const isWhite = Math.random() >= 0.5;

      const whiteId = isWhite ? socket.id : opponent.id;
      const blackId = isWhite ? opponent.id : socket.id;
      const whiteName = isWhite ? (playerOptions.username || 'Player1') : (opponent.options.username || 'Player2');
      const blackName = isWhite ? (opponent.options.username || 'Player2') : (playerOptions.username || 'Player1');
      
      const timeControl = playerOptions.timeControl || { initial: 600, increment: 5 };

      gameRooms.set(roomId, {
        white: whiteId,
        black: blackId,
        whiteName,
        blackName,
        spectators: [],
        gameState: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', // Initial FEN
        moves: [],
        chat: [],
        createdAt: new Date().toISOString(),
        timeControl: { ...timeControl, whiteTime: timeControl.initial, blackTime: timeControl.initial },
        currentTurn: 'white'
      });

      const opponentSocket = io.sockets.sockets.get(opponent.id);

      // Join both players to the room
      socket.join(roomId);
      if (opponentSocket) {
        opponentSocket.join(roomId);
      } else {
        // This should ideally not happen if opponent was in waitingPlayers
        console.error(`Opponent socket ${opponent.id} not found for match ${roomId}`);
        // Potentially add current player back to queue or notify them
        handleServerError(socket, `Could not find opponent socket for match.`, 'MATCHMAKING_ERROR_OPPONENT_LEFT');
        // Clean up room if opponent is gone? Or let it be for the current player?
        // For now, let current player know.
        return false; // Indicate match setup failed
      }
      
      // Notify both players
      socket.emit('matchFound', { roomId, color: isWhite ? 'white' : 'black', opponent: isWhite ? blackName : whiteName, timeControl });
      io.to(opponent.id).emit('matchFound', { roomId, color: isWhite ? 'black' : 'white', opponent: isWhite ? whiteName : blackName, timeControl });
      
      startChessClock(roomId);
      console.log(`Match found: ${roomId} between ${whiteName} (white) and ${blackName} (black)`);
      return true;
    }

    // No match found, add to waiting list
    waitingPlayers.push({ id: socket.id, options: playerOptions });
    socket.emit('waitingForMatch');
    return false;

  } catch (error) {
    handleServerError(socket, error, 'FIND_MATCH_FAILED');
    return false; // Indicate failure
  }
}

// Helper function to authenticate socket user from token
async function authenticateSocketUser(token) {
  if (!token) {
    throw new Error('Authentication error: No token provided.');
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id); // User model is already required
    if (!user) {
      throw new Error('Authentication error: User not found.');
    }
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      chessRating: user.chessRating,
      // Add other necessary fields from user model if needed
    };
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Authentication error: Token expired.');
    }
    if (err.name === 'JsonWebTokenError') {
      throw new Error('Authentication error: Invalid token.');
    }
    console.error('Token verification error:', err.message);
    throw new Error('Authentication error: Could not verify token.');
  }
}

// Standardized error handling function
function handleServerError(socket, error, errorCode = 'INTERNAL_SERVER_ERROR', additionalInfo = {}) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`[SocketError] User: ${socket.user?.username || socket.id}, Code: ${errorCode}, Message: ${errorMessage}`, additionalInfo);
  
  // Avoid sending sensitive error details to client in production
  const clientMessage = process.env.NODE_ENV === 'production' && errorCode === 'INTERNAL_SERVER_ERROR'
    ? 'An unexpected error occurred. Please try again later.'
    : errorMessage;

  socket.emit('server_error', {
    code: errorCode,
    message: clientMessage,
    ...additionalInfo
  });
}

// Socket.io connection middleware for authentication
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const user = await authenticateSocketUser(token);
      socket.user = user; // Attach user to socket object
      console.log(`User ${user.username} (ID: ${user.id}) authenticated for socket ${socket.id}`);
      next();
    } catch (error) {
      // Use the new error handler for middleware errors, but pass to next() to deny connection
      const errorCode = error.message.includes('Token expired') ? 'TOKEN_EXPIRED' :
                        error.message.includes('Invalid token') ? 'INVALID_TOKEN' :
                        'AUTHENTICATION_FAILED';
      // Log it server-side
      console.error(`[AuthMiddlewareError] SocketID: ${socket.id}, Code: ${errorCode}, Message: ${error.message}`);
      // Deny connection
      return next(new Error(error.message)); // This will cause client to receive 'connect_error' with the message
    }
  } else {
    // No token provided, proceed as guest
    socket.user = null; // Explicitly mark as guest or unauthenticated
    console.log(`Socket ${socket.id} connected as guest.`);
    next();
  }
});

// Socket.io connection handler
io.on('connection', (socket) => {
  // socket.user is now available here if authentication was successful
  if (socket.user) {
    console.log(`User ${socket.user.username} (Socket ID: ${socket.id}) connected and authenticated.`);
  } else {
    console.log(`Guest user (Socket ID: ${socket.id}) connected.`);
  }

  // Join matchmaking queue
  socket.on('findMatch', (playerOptions = {}) => {
    try {
      console.log(`Player ${socket.user?.username || socket.id} is looking for a match with options:`, playerOptions);
      const success = findMatch(socket, playerOptions || {});
      // If findMatch fails internally, it should call handleServerError.
      // No need for further error handling here unless findMatch can return false without erroring.
    } catch (error) {
      handleServerError(socket, error, 'FIND_MATCH_EVENT_FAILED', { options: playerOptions });
    }
  });

  // Cancel matchmaking
  socket.on('cancelMatchmaking', () => {
    try {
      const index = waitingPlayers.findIndex(p => p.id === socket.id);
      if (index !== -1) {
        waitingPlayers.splice(index, 1);
        socket.emit('matchmakingCancelled');
        console.log(`Player ${socket.user?.username || socket.id} cancelled matchmaking.`);
      } else {
        console.log(`Player ${socket.user?.username || socket.id} tried to cancel matchmaking but was not in queue.`);
        socket.emit('notInMatchmakingQueue');
      }
    } catch (error) {
      handleServerError(socket, error, 'CANCEL_MATCHMAKING_FAILED');
    }
  });

  // Join a game room
  socket.on('joinRoom', async ({ roomId, clientProvidedUsername, isResuming, password }) => {
    try {
      if (!roomId) {
        return handleServerError(socket, 'Room ID is required.', 'INVALID_INPUT', { field: 'roomId' });
      }

      const authenticatedUser = socket.user;
      let effectiveUsername = (authenticatedUser ? authenticatedUser.username : clientProvidedUsername) || 'Anonymous';

      let room = gameRooms.get(roomId);
      if (!room) {
        room = {
          white: null, black: null, whiteName: null, blackName: null,
          spectators: [],
          gameState: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          moves: [], chat: [],
          hasPassword: false, password: null,
          createdAt: new Date().toISOString(),
          timeControl: { initial: 600, increment: 5, whiteTime: 600, blackTime: 600 },
          currentTurn: 'white', preMoves: [], isOver: false,
          creatorUserId: authenticatedUser ? authenticatedUser.id : null // Store creator
        };
        gameRooms.set(roomId, room);
        console.log(`Room ${roomId} created by ${effectiveUsername}.`);
      }

      if (room.hasPassword && !isResuming && room.white !== socket.id && room.black !== socket.id) { // Don't ask password if already in room
        if (!password || password !== room.password) {
          return handleServerError(socket, 'Password required or incorrect.', 'PASSWORD_REQUIRED', { roomId });
        }
      }

      try {
        socket.join(roomId);
      } catch (joinError) {
        return handleServerError(socket, joinError, 'SOCKET_JOIN_FAILED', { roomId });
      }

      let playerColor = null;
      let opponentName = null;

      if (room.white === socket.id) {
        playerColor = 'white';
        opponentName = room.blackName;
      } else if (room.black === socket.id) {
        playerColor = 'black';
        opponentName = room.whiteName;
      } else if (!room.white) {
        room.white = socket.id;
        room.whiteName = effectiveUsername;
        playerColor = 'white';
        if (authenticatedUser) {
          room.creatorUserId = authenticatedUser.id; // Ensure creator is set
          await ChessGame.upsert({
            gameId: roomId,
            players: { white: { userId: authenticatedUser.id, username: authenticatedUser.username, rating: authenticatedUser.chessRating || 1200, ratingChange: 0 }, black: { userId: null, username: null, rating: 1200, ratingChange: 0 } },
            startTime: new Date(), isRated: true, currentFen: room.gameState,
          }).catch(dbError => { console.error(`DB error assigning white player ${authenticatedUser.username} to ${roomId}: ${dbError.message}`); throw dbError; });
        }
      } else if (!room.black) {
        room.black = socket.id;
        room.blackName = effectiveUsername;
        playerColor = 'black';
        opponentName = room.whiteName;
        if (authenticatedUser) {
          const blackPlayerData = { userId: authenticatedUser.id, username: authenticatedUser.username, rating: authenticatedUser.chessRating || 1200, ratingChange: 0 };
          let gameInstance = await ChessGame.findOne({ where: { gameId: roomId } })
            .catch(dbError => { console.error(`DB error finding game ${roomId} to assign black player: ${dbError.message}`); throw dbError; });
          if (gameInstance) {
            const updatedPlayers = { ...gameInstance.players, black: blackPlayerData };
            await gameInstance.update({ players: updatedPlayers })
              .catch(dbError => { console.error(`DB error updating game ${roomId} with black player: ${dbError.message}`); throw dbError; });
          } else { // Should ideally not happen if white (auth) created it
            await ChessGame.upsert({
              gameId: roomId,
              players: { white: { userId: room.creatorUserId, username: room.whiteName, rating: (await User.findByPk(room.creatorUserId))?.chessRating || 1200, ratingChange: 0 }, black: blackPlayerData },
              startTime: new Date(), isRated: true, currentFen: room.gameState,
            }).catch(dbError => { console.error(`DB error upserting game ${roomId} for black player: ${dbError.message}`); throw dbError; });
          }
        }
        io.to(roomId).emit('gameReady', { white: room.whiteName, black: room.blackName, timeControl: room.timeControl });
        startChessClock(roomId);
      } else { // Spectator
        if (!room.spectators.find(spec => spec.id === socket.id)) {
          room.spectators.push({ id: socket.id, username: effectiveUsername });
        }
        socket.to(roomId).emit('spectatorJoined', { username: effectiveUsername, count: room.spectators.length });
      }

      const commonGameState = {
        gameState: room.gameState, moveHistory: room.moves, chatHistory: room.chat,
        whiteName: room.whiteName, blackName: room.blackName,
        timeControl: { white: room.timeControl.whiteTime, black: room.timeControl.blackTime, increment: room.timeControl.increment },
        isRated: room.isRated !== undefined ? room.isRated : true, // Default to rated
        hasPassword: room.hasPassword,
      };

      if (isResuming && playerColor) {
        socket.emit('gameResumed', { ...commonGameState, playerColor, opponentName });
      } else {
        socket.emit('gameState', { ...commonGameState, playerColor, opponentName });
      }

      if (playerColor) {
        socket.emit('joinedAsColor', { color: playerColor, opponentName, timeControl: commonGameState.timeControl });
        const otherPlayerSocketId = playerColor === 'white' ? room.black : room.white;
        if (otherPlayerSocketId) {
            io.to(otherPlayerSocketId).emit('opponentJoined', { opponentName: effectiveUsername });
        }
      }
      
      console.log(`Player ${effectiveUsername} (Socket ID: ${socket.id}) joined room ${roomId} as ${playerColor || 'spectator'}`);
      if (authenticatedUser) {
        ActivityLog.create({
          userId: authenticatedUser.id, username: authenticatedUser.username,
          action: 'join_room', actionDetails: { roomId, role: playerColor || 'spectator' },
          ipAddress: socket.handshake.address
        }).catch(dbError => console.error(`Error logging join_room activity: ${dbError.message}`));
      }
    } catch (error) {
      handleServerError(socket, error, 'JOIN_ROOM_FAILED', { roomId });
    }
  });

  socket.on('setRoomPassword', ({ roomId, hasPassword, password }) => {
    try {
      if (!roomId) return handleServerError(socket, 'Room ID required.', 'INVALID_INPUT', { field: 'roomId' });
      const room = gameRooms.get(roomId);
      if (!room) return handleServerError(socket, `Room ${roomId} not found.`, 'ROOM_NOT_FOUND');
      
      // Allow room creator (if stored) or white player (if no creator stored or matches) to set password
      const isCreator = socket.user && room.creatorUserId === socket.user.id;
      const isWhitePlayer = room.white === socket.id;

      if (!isCreator && !isWhitePlayer) {
        return handleServerError(socket, 'Only the room creator can set the password.', 'FORBIDDEN_ACTION');
      }

      room.hasPassword = !!hasPassword;
      room.password = room.hasPassword && password ? password : null;
      socket.emit('roomPasswordSet', { roomId, hasPassword: room.hasPassword });
      io.to(roomId).emit('roomSettingsUpdated', { hasPassword: room.hasPassword }); // Notify all in room
      console.log(`Room ${roomId} password set to ${room.hasPassword} by ${socket.user?.username || socket.id}`);
    } catch (error) {
      handleServerError(socket, error, 'SET_ROOM_PASSWORD_FAILED', { roomId });
    }
  });

  socket.on('move', async ({ roomId, move, gameState: clientGameState }) => {
    try {
      if (!roomId || !move || !clientGameState) {
        return handleServerError(socket, 'Room ID, move, and game state are required.', 'INVALID_INPUT_MOVE');
      }
      const room = gameRooms.get(roomId);
      if (!room || room.isOver) {
        return handleServerError(socket, room ? 'Game is already over.' : `Room ${roomId} not found.`, room ? 'GAME_OVER' : 'ROOM_NOT_FOUND');
      }

      // Server-side move validation using chess.js
      const chess = new Chess(room.gameState);
      let madeMove;
      
      try {
        // Try to make the move
        madeMove = chess.move({ 
          from: move.from, 
          to: move.to, 
          promotion: move.promotion 
        });
        
        if (!madeMove) {
          return handleServerError(socket, 'Invalid move.', 'INVALID_MOVE', { move, fen: room.gameState });
        }
        
        // Use the server's game state after validation
        const serverFen = chess.fen();
        
        // Log if client state differs from server validated state
        if (serverFen !== clientGameState) {
          console.warn(`Client FEN ${clientGameState} differs from server validated FEN ${serverFen} for room ${roomId}. Using server FEN.`);
          room.gameState = serverFen; // Use server FEN instead of client FEN
        } else {
          room.gameState = clientGameState;
        }
      } catch (error) {
        console.error(`Chess move validation error: ${error.message}`);
        return handleServerError(socket, 'Error validating move.', 'MOVE_VALIDATION_ERROR', { move, fen: room.gameState, error: error.message });
      }

      const playerColor = room.white === socket.id ? 'white' : (room.black === socket.id ? 'black' : null);
      if (!playerColor) return handleServerError(socket, 'Not a player in this game.', 'NOT_A_PLAYER');
      if (playerColor !== room.currentTurn) return handleServerError(socket, 'Not your turn.', 'NOT_YOUR_TURN');

      room.moves.push({ ...move, fen: room.gameState, player: playerColor, timestamp: new Date().toISOString() });
      room.currentTurn = playerColor === 'white' ? 'black' : 'white';

      const timeKey = playerColor === 'white' ? 'whiteTime' : 'blackTime';
      if (room.timeControl && typeof room.timeControl[timeKey] === 'number') {
        room.timeControl[timeKey] += room.timeControl.increment || 0;
      }

      room.preMoves = room.preMoves ? room.preMoves.filter(pm => pm.color !== playerColor) : [];

      const moveDataForEmit = { move, gameState: room.gameState, currentTurn: room.currentTurn, remainingTime: room.timeControl };
      io.to(roomId).emit('gameStateUpdate', moveDataForEmit); // Consolidated update

      let gameDb = await ChessGame.findOne({ where: { gameId: roomId } }).catch(e => { console.error("DB find error on move:", e.message); throw e; });
      if (gameDb) {
        gameDb.currentFen = room.gameState;
        gameDb.moveHistory = [...(gameDb.moveHistory || []), { ...move, fen: room.gameState, player: playerColor, timestamp: new Date().toISOString() }];
        await gameDb.save().catch(e => { console.error("DB save error on move:", e.message); throw e; });

        if (socket.user && ( (playerColor === 'white' && gameDb.players.white.userId === socket.user.id) || (playerColor === 'black' && gameDb.players.black.userId === socket.user.id) )) {
          ActivityLog.create({
            userId: socket.user.id, username: socket.user.username,
            action: 'chess_move', actionDetails: { roomId, from: move.from, to: move.to, piece: move.piece, promotion: move.promotion, fen: room.gameState },
            ipAddress: socket.handshake.address
          }).catch(dbError => console.error(`Error logging chess_move: ${dbError.message}`));
        }
      }
      
      // Handle pre-move for opponent if any
      const opponentPreMove = room.preMoves?.find(pm => pm.color === room.currentTurn);
      if (opponentPreMove) {
        const opponentSocketId = room.currentTurn === 'white' ? room.white : room.black;
        if (opponentSocketId) {
          const preMoveChess = new Chess(room.gameState);
          try {
            // Validate premove with new board state
            const validPreMove = preMoveChess.move({
              from: opponentPreMove.from,
              to: opponentPreMove.to,
              promotion: opponentPreMove.promotion
            });
            
            if (validPreMove) {
              // If valid, tell the client to execute it
              io.to(opponentSocketId).emit('executePreMove', opponentPreMove);
              console.log(`Notified ${room.currentTurn} to execute pre-move in room ${roomId}`);
            } else {
              // If invalid, notify client to cancel the premove
              io.to(opponentSocketId).emit('cancelPreMove', {
                reason: 'invalid',
                premove: opponentPreMove
              });
              console.log(`Canceled invalid pre-move in room ${roomId}`);
            }
          } catch (error) {
            console.error(`Pre-move validation error: ${error.message}`);
            io.to(opponentSocketId).emit('cancelPreMove', {
              reason: 'error',
              premove: opponentPreMove,
              error: error.message
            });
          }
        }
        room.preMoves = room.preMoves.filter(pm => pm !== opponentPreMove);
      }

    } catch (error) {
      handleServerError(socket, error, 'MOVE_PROCESSING_FAILED', { roomId, move });
    }
  });

  socket.on('sendMessage', ({ roomId, message }) => {
    try {
      if (!roomId || typeof message !== 'string' || message.trim() === '') {
        return handleServerError(socket, 'Room ID and non-empty message required.', 'INVALID_INPUT_CHAT');
      }
      const room = gameRooms.get(roomId);
      if (!room) return handleServerError(socket, `Room ${roomId} not found.`, 'ROOM_NOT_FOUND');

      let senderName = 'Spectator';
      let senderRole = 'spectator';
      let senderUserId = null;

      if (socket.user) {
        senderName = socket.user.username;
        senderUserId = socket.user.id;
        if (room.white === socket.id) senderRole = 'white';
        else if (room.black === socket.id) senderRole = 'black';
      } else {
        if (room.white === socket.id) senderName = room.whiteName || 'White';
        else if (room.black === socket.id) senderName = room.blackName || 'Black';
      }

      const chatMsg = { sender: senderName, role: senderRole, message: message.substring(0, 500), timestamp: new Date().toISOString(), userId: senderUserId };
      if (!room.chat) room.chat = [];
      room.chat.push(chatMsg);
      if (room.chat.length > 100) room.chat.shift();
      io.to(roomId).emit('newMessage', chatMsg);

      if (senderUserId && socket.user) {
        ActivityLog.create({
          userId: senderUserId, username: senderName,
          action: 'chat_message', actionDetails: { roomId, messageLength: message.length, role: senderRole },
          ipAddress: socket.handshake.address
        }).catch(dbError => console.error(`Error logging chat_message: ${dbError.message}`));
      }
    } catch (error) {
      handleServerError(socket, error, 'SEND_MESSAGE_FAILED', { roomId });
    }
  });

  socket.on('gameOver', async ({ roomId, result, winner, reason }) => {
    try {
      if (!roomId || !result) {
        return handleServerError(socket, 'Room ID and result are required.', 'INVALID_INPUT_GAMEOVER');
      }
      const room = gameRooms.get(roomId);
      if (!room) return handleServerError(socket, `Room ${roomId} not found.`, 'ROOM_NOT_FOUND');
      if (room.isOver) {
        console.log(`Game ${roomId} already marked over. Ignoring duplicate.`);
        return;
      }
      room.isOver = true;

      let gameDb = null;
      try {
        gameDb = await ChessGame.findOne({ where: { gameId: roomId } });
      } catch (e) { console.error(`DB error finding game ${roomId} for game over: ${e.message}`); /* Continue */ }

      let resultCode = 'unknown';
      let termReason = reason || 'unknown';
      const resLc = result.toLowerCase();

      if (winner === 'white') resultCode = '1-0';
      else if (winner === 'black') resultCode = '0-1';
      else if (resLc.includes('draw') || resLc.includes('stalemate')) resultCode = '1/2-1/2';

      if (resLc.includes('checkmate')) termReason = 'checkmate';
      else if (resLc.includes('timeout')) termReason = 'timeout';
      else if (resLc.includes('resignation')) termReason = 'resignation';
      else if (resLc.includes('stalemate')) termReason = 'stalemate';
      // Add other termination reasons as needed

      if (gameDb) {
        gameDb.result = resultCode;
        gameDb.termination = termReason;
        gameDb.finalFen = room.gameState;
        gameDb.endTime = new Date();

        const pWhite = gameDb.players?.white;
        const pBlack = gameDb.players?.black;

        if (pWhite?.userId && pBlack?.userId && gameDb.isRated) {
          try {
            const ratings = calculateNewRatings(pWhite.rating, pBlack.rating, resultCode);
            gameDb.players.white.ratingChange = ratings.whiteRatingChange;
            gameDb.players.black.ratingChange = ratings.blackRatingChange;
            const newWhiteRating = pWhite.rating + ratings.whiteRatingChange;
            const newBlackRating = pBlack.rating + ratings.blackRatingChange;
            await User.update({ chessRating: newWhiteRating }, { where: { id: pWhite.userId } });
            await User.update({ chessRating: newBlackRating }, { where: { id: pBlack.userId } });
            gameDb.players.white.rating = newWhiteRating;
            gameDb.players.black.rating = newBlackRating;
            console.log(`Ratings updated for ${roomId}: W ${newWhiteRating}, B ${newBlackRating}`);
          } catch (eloError) { console.error(`EloError for ${roomId}: ${eloError.message}`); }
        }
        await gameDb.save().catch(e => console.error(`DB save error on game over ${roomId}: ${e.message}`));
      } else {
        console.warn(`No DB game found for ${roomId} at game over.`);
      }

      io.to(roomId).emit('gameOver', { roomId, reason: termReason, winner, resultCode, whiteName: room.whiteName, blackName: room.blackName });
      saveGameForReplay(roomId, { result: termReason, winner, finalFen: room.gameState, whiteName: room.whiteName, blackName: room.blackName, resultCode });

      if (room.whiteName && room.blackName) { // Use names to imply players were set
        if (winner === 'white' && room.white) updatePlayerStats(room.white, true); // room.white is socket ID
        if (winner === 'black' && room.black) updatePlayerStats(room.black, true);
        if (resultCode === '1/2-1/2') {
            if(room.white) updatePlayerStats(room.white, null);
            if(room.black) updatePlayerStats(room.black, null);
        }
      }
      
      const activityDetails = {
          roomId, result: resultCode, termination: termReason, winner: winner || 'draw', finalFen: room.gameState,
          durationMs: gameDb && gameDb.endTime && gameDb.startTime ? gameDb.endTime.getTime() - gameDb.startTime.getTime() : null,
          whitePlayer: room.whiteName, blackPlayer: room.blackName,
          whiteRating: gameDb?.players?.white?.rating, blackRating: gameDb?.players?.black?.rating,
          whiteRatingChange: gameDb?.players?.white?.ratingChange, blackRatingChange: gameDb?.players?.black?.ratingChange,
      };
      if (gameDb?.players?.white?.userId) {
        ActivityLog.create({ userId: gameDb.players.white.userId, username: room.whiteName, action: 'chess_game_end', actionDetails: activityDetails, ipAddress: 'server' })
          .catch(dbError => console.error(`Log error (W): ${dbError.message}`));
      }
      if (gameDb?.players?.black?.userId) {
        ActivityLog.create({ userId: gameDb.players.black.userId, username: room.blackName, action: 'chess_game_end', actionDetails: activityDetails, ipAddress: 'server' })
          .catch(dbError => console.error(`Log error (B): ${dbError.message}`));
      }

      if (activeClocks.has(roomId)) {
        clearInterval(activeClocks.get(roomId));
        activeClocks.delete(roomId);
      }
    } catch (error) {
      handleServerError(socket, error, 'GAME_OVER_MAIN_PROCESSING_FAILED', { roomId });
    }
  });

  socket.on('getGameHistory', ({ roomId }) => {
    try {
      if (!roomId) return handleServerError(socket, 'Room ID required.', 'INVALID_INPUT');
      const room = gameRooms.get(roomId);
      if (!room) return handleServerError(socket, `Room ${roomId} not found.`, 'ROOM_NOT_FOUND');
      socket.emit('gameHistory', { moves: room.moves, chat: room.chat });
    } catch (error) {
      handleServerError(socket, error, 'GET_GAME_HISTORY_FAILED', { roomId });
    }
  });

  socket.on('disconnect', () => {
    try {
      console.log(`User ${socket.user?.username || socket.id} disconnected.`);
      const waitingIndex = waitingPlayers.findIndex(p => p.id === socket.id);
      if (waitingIndex !== -1) {
        waitingPlayers.splice(waitingIndex, 1);
        console.log(`Removed ${socket.id} from matchmaking queue.`);
      }

      for (const [roomId, room] of gameRooms.entries()) {
        let playerLeftColor = null;
        if (room.white === socket.id) playerLeftColor = 'white';
        else if (room.black === socket.id) playerLeftColor = 'black';

        if (playerLeftColor && !room.isOver) {
          console.log(`Player ${playerLeftColor} (${socket.id}) disconnected from active game ${roomId}.`);
          const opponentColor = playerLeftColor === 'white' ? 'black' : 'white';
          const opponentSocketId = playerLeftColor === 'white' ? room.black : room.white;
          
          // Notify opponent
          if (opponentSocketId) {
            io.to(opponentSocketId).emit('opponentDisconnected', {
              message: `${room[playerLeftColor + 'Name'] || playerLeftColor} disconnected. You win by abandonment.`,
              winner: opponentColor
            });
          }
          // End the game
          // Manually trigger gameOver logic for abandonment
          // This assumes the 'gameOver' event itself will handle DB updates, etc.
           // Constructing parameters similar to how client might send, or direct call
          const abandonmentResult = `${opponentColor} wins by abandonment`;
          this.emit('gameOver', { // Use socket.emit to trigger the local gameOver handler
             roomId,
             result: abandonmentResult,
             winner: opponentColor,
             reason: 'abandonment'
          });


          // Clean up the player slot
          room[playerLeftColor] = null;
          room[playerLeftColor + 'Name'] = null;
          
          // If room becomes empty of players and no spectators, or some other policy
          // gameRooms.delete(roomId); // Or let it persist for history if not handled by gameOver
          break; // Assuming a user can only be in one game as a player
        } else {
          const spectatorIndex = room.spectators.findIndex(s => s.id === socket.id);
          if (spectatorIndex !== -1) {
            const spectator = room.spectators.splice(spectatorIndex, 1)[0];
            console.log(`Spectator ${spectator.username} left room ${roomId}.`);
            io.to(roomId).emit('spectatorLeft', { username: spectator.username, count: room.spectators.length });
          }
        }
      }
      if (socket.user) {
        ActivityLog.create({
            userId: socket.user.id, username: socket.user.username,
            action: 'disconnect', ipAddress: socket.handshake.address
        }).catch(dbError => console.error(`Error logging disconnect: ${dbError.message}`));
      }
    } catch (error) {
      // Cannot use handleServerError reliably as socket might be gone. Log to console.
      console.error(`Error during disconnect for ${socket.id}:`, error.message, error.stack);
    }
  });
});

// API routes
// Get list of saved games
app.get('/api/games', (req, res) => {
  const gamesList = Object.values(gamesData.games).map(game => ({
    id: game.id,
    createdAt: game.createdAt,
    endedAt: game.endedAt,
    players: game.players,
    result: game.result,
    moves: game.moves.length
  }));
  
  res.json(gamesList);
});

// Get specific game
app.get('/api/games/:id', (req, res) => {
  const gameId = req.params.id;
  const game = gamesData.games[gameId];
  
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  res.json(game);
});

// Get player stats
app.get('/api/players/:id/stats', (req, res) => {
  const playerId = req.params.id;
  const stats = gamesData.userStats[playerId] || {
    wins: 0,
    losses: 0,
    draws: 0,
    rating: 1200
  };
  
  res.json(stats);
});

// Default route
app.get('/', (req, res) => {
  res.send('Chess Server is running');
});

// Start the server
const PORT = process.env.PORT || process.env.CHESS_PORT || 10000;
let currentPort = PORT;
let retries = 0;
const MAX_RETRIES = 3; // Reduced from 10 to 3

async function startServer(port) {
  try {
    // On Render, we should use the assigned PORT
    if (process.env.PORT) {
      console.log(`Using Render-assigned port: ${process.env.PORT}`);
      port = parseInt(process.env.PORT, 10);
    }
    
    // First try to free the desired port
    await freePort(port);
    
    server.listen(port, () => {
      console.log(`Chess server running on port ${port}`);
      // Store the successful port in process.env so other parts of the app can use it
      process.env.ACTUAL_CHESS_PORT = port;
      
      // If we're in child process mode, inform the parent
      if (typeof process.send === 'function') {
        process.send({ type: 'chess-server-started', port });
      }
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        retries += 1;
        if (retries <= MAX_RETRIES) {
          // Try a more random port instead of incrementing sequentially
          currentPort = PORT + Math.floor(Math.random() * 100) + retries;
          console.log(`Port ${port} is in use, trying ${currentPort} instead...`);
          startServer(currentPort);
        } else {
          console.error(`Could not find an available port after ${MAX_RETRIES} retries.`);
          // Just continue with the main server port - we'll handle the chess server differently
          console.log("Continuing without dedicated chess server port.");
          // Don't exit - let the app continue
        }
      } else {
        console.error('Error starting chess server:', err);
      }
    });
  } catch (error) {
    console.error('Error in startServer:', error);
    // Don't retry if we hit an error - just continue
    console.log("Continuing without dedicated chess server port due to error.");
  }
}

// Start the server asynchronously
// startServer(currentPort); // OLD LINE TO BE COMMENTED OUT OR REMOVED

if (process.env.DISABLE_CHESS_SERVER !== 'true') {
  startServer(currentPort);
} else {
  console.log('Dedicated chess server HTTP listener is disabled (DISABLE_CHESS_SERVER=true). Socket.IO logic will attach to the main server.');
}

// Cleanup on server shutdown
process.on('SIGINT', () => {
  console.log('Saving all game data before shutdown...');
  
  // Save all active games
  for (const [roomId, room] of gameRooms.entries()) {
    saveGameForReplay(roomId, {
      result: 'server shutdown',
      winner: null
    });
  }
  
  // Stop all clocks
  for (const intervalId of activeClocks.values()) {
    clearInterval(intervalId);
  }
  
  process.exit();
});

// Elo rating calculation helper function
function calculateNewRatings(whiteRating, blackRating, result) {
  // K-factor determines the magnitude of rating change
  const K = 32;
  
  // Convert result to score
  let whiteScore;
  if (result === '1-0') {
    whiteScore = 1;
  } else if (result === '0-1') {
    whiteScore = 0;
  } else {
    whiteScore = 0.5;
  }
  const blackScore = 1 - whiteScore;
  
  // Calculate expected scores based on current ratings
  const whiteExpected = 1 / (1 + Math.pow(10, (blackRating - whiteRating) / 400));
  const blackExpected = 1 / (1 + Math.pow(10, (whiteRating - blackRating) / 400));
  
  // Calculate new ratings
  const newWhiteRating = Math.round(whiteRating + K * (whiteScore - whiteExpected));
  const newBlackRating = Math.round(blackRating + K * (blackScore - blackExpected));
  
  return { newWhiteRating, newBlackRating };
}

module.exports = { app, server }; 
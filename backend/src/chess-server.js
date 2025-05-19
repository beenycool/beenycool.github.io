const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

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
  // Check if any player is waiting with compatible options
  const matchIndex = waitingPlayers.findIndex(player => {
    // For demo, just match any player
    // In production, match by rating, time control preferences, etc.
    return true;
  });
  
  if (matchIndex !== -1) {
    const opponent = waitingPlayers[matchIndex];
    waitingPlayers.splice(matchIndex, 1); // Remove matched player
    
    // Create a new game room
    const roomId = `match_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Determine colors randomly (50/50 chance)
    const isWhite = Math.random() >= 0.5;
    
    const whiteId = isWhite ? socket.id : opponent.id;
    const blackId = isWhite ? opponent.id : socket.id;
    const whiteName = isWhite ? playerOptions.username : opponent.options.username;
    const blackName = isWhite ? opponent.options.username : playerOptions.username;
    
    // Use requested time control or default
    const timeControl = playerOptions.timeControl || {
      initial: 600, // 10 minutes
      increment: 5   // 5 seconds
    };
    
    // Create game room
    gameRooms.set(roomId, {
      white: whiteId,
      black: blackId,
      whiteName,
      blackName,
      spectators: [],
      gameState: null,
      moves: [],
      chat: [],
      createdAt: new Date().toISOString(),
      timeControl: {
        initial: timeControl.initial,
        increment: timeControl.increment,
        whiteTime: timeControl.initial,
        blackTime: timeControl.initial
      },
      currentTurn: 'white'
    });
    
    // Join both players to the room
    socket.join(roomId);
    io.sockets.sockets.get(opponent.id)?.join(roomId);
    
    // Notify both players
    socket.emit('matchFound', {
      roomId,
      color: isWhite ? 'white' : 'black',
      opponent: isWhite ? blackName : whiteName,
      timeControl
    });
    
    io.to(opponent.id).emit('matchFound', {
      roomId,
      color: isWhite ? 'black' : 'white',
      opponent: isWhite ? whiteName : blackName,
      timeControl
    });
    
    // Start the chess clock
    startChessClock(roomId);
    
    return true;
  }
  
  // No match found, add to waiting list
  waitingPlayers.push({
    id: socket.id,
    options: playerOptions
  });
  
  socket.emit('waitingForMatch');
  return false;
}

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Join matchmaking queue
  socket.on('findMatch', (playerOptions = {}) => {
    console.log(`Player ${socket.id} is looking for a match`);
    findMatch(socket, playerOptions);
  });
  
  // Cancel matchmaking
  socket.on('cancelMatchmaking', () => {
    const index = waitingPlayers.findIndex(p => p.id === socket.id);
    if (index !== -1) {
      waitingPlayers.splice(index, 1);
      socket.emit('matchmakingCancelled');
    }
  });

  // Join a game room
  socket.on('joinRoom', ({ roomId, username }) => {
    console.log(`User ${socket.id} (${username}) joining room ${roomId}`);

    // Check if room exists
    if (!gameRooms.has(roomId)) {
      // Create new room
      gameRooms.set(roomId, {
        white: socket.id,
        whiteName: username || 'Anonymous',
        black: null,
        blackName: null,
        spectators: [],
        gameState: null,
        moves: [],
        chat: [],
        createdAt: new Date().toISOString(),
        timeControl: {
          initial: 600, // Default 10 minutes
          increment: 5,  // Default 5 second increment
          whiteTime: 600,
          blackTime: 600
        },
        currentTurn: 'white'
      });
      
      socket.join(roomId);
      socket.emit('joinedAsColor', {
        color: 'white',
        timeControl: gameRooms.get(roomId).timeControl
      });
    } else {
      // Join existing room
      const room = gameRooms.get(roomId);

      if (!room.black) {
        // Join as black
        room.black = socket.id;
        room.blackName = username || 'Anonymous';
        socket.join(roomId);
        socket.emit('joinedAsColor', {
          color: 'black',
          timeControl: room.timeControl
        });
        
        // Notify white player that black has joined
        io.to(room.white).emit('opponentJoined', {
          opponentName: room.blackName
        });
        
        // Start the chess clock if both players are present
        startChessClock(roomId);
      } else {
        // Join as spectator
        room.spectators.push({
          id: socket.id,
          username: username || 'Spectator'
        });
        socket.join(roomId);
        socket.emit('joinedAsSpectator', {
          gameState: room.gameState,
          moves: room.moves,
          timeControl: room.timeControl
        });
        
        // Notify players of new spectator
        socket.to(roomId).emit('spectatorJoined', {
          spectatorName: username || 'Spectator',
          spectatorCount: room.spectators.length
        });
      }
    }
  });

  // Handle move
  socket.on('move', ({ roomId, move, gameState }) => {
    const room = gameRooms.get(roomId);
    if (!room) return;

    // Update game state
    room.gameState = gameState;
    
    // Add move to history
    room.moves.push(move);
    
    // Switch current turn
    room.currentTurn = room.currentTurn === 'white' ? 'black' : 'white';
    
    // Add increment time
    if (room.timeControl) {
      if (move.color === 'w') {
        room.timeControl.whiteTime += room.timeControl.increment;
      } else {
        room.timeControl.blackTime += room.timeControl.increment;
      }
    }
    
    // Save game state periodically
    if (room.moves.length % 5 === 0) {
      saveGameForReplay(roomId);
    }

    // Broadcast move to everyone in the room except sender
    socket.to(roomId).emit('opponentMove', { 
      move,
      gameState,
      remainingTime: room.timeControl ? {
        white: room.timeControl.whiteTime,
        black: room.timeControl.blackTime
      } : null
    });
  });
  
  // Handle chat message
  socket.on('sendMessage', ({ roomId, message }) => {
    const room = gameRooms.get(roomId);
    if (!room) return;
    
    let sender = 'Spectator';
    let role = 'spectator';
    
    if (room.white === socket.id) {
      sender = room.whiteName || 'White';
      role = 'white';
    } else if (room.black === socket.id) {
      sender = room.blackName || 'Black';
      role = 'black';
    }
    
    const chatMessage = {
      sender,
      role,
      message,
      timestamp: new Date().toISOString()
    };
    
    // Add to chat history
    if (!room.chat) room.chat = [];
    room.chat.push(chatMessage);
    
    // Broadcast to everyone in the room including sender
    io.to(roomId).emit('newMessage', chatMessage);
  });
  
  // Handle game over
  socket.on('gameOver', ({ roomId, result, winner }) => {
    const room = gameRooms.get(roomId);
    if (!room) return;
    
    // Broadcast game over to everyone
    io.to(roomId).emit('gameOver', {
      result,
      winner
    });
    
    // Update player stats
    if (winner === 'white' && room.white) {
      updatePlayerStats(room.white, true);
      if (room.black) updatePlayerStats(room.black, false);
    } else if (winner === 'black' && room.black) {
      updatePlayerStats(room.black, true);
      if (room.white) updatePlayerStats(room.white, false);
    } else if (winner === 'draw') {
      if (room.white) updatePlayerStats(room.white, null);
      if (room.black) updatePlayerStats(room.black, null);
    }
    
    // Save game for replay
    saveGameForReplay(roomId, {
      result,
      winner
    });
    
    // Stop the chess clock
    if (activeClocks.has(roomId)) {
      clearInterval(activeClocks.get(roomId));
      activeClocks.delete(roomId);
    }
  });
  
  // Request game history
  socket.on('getGameHistory', ({ roomId }) => {
    const room = gameRooms.get(roomId);
    if (!room) return;
    
    socket.emit('gameHistory', {
      moves: room.moves,
      chat: room.chat
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Remove from matchmaking queue if present
    const waitingIndex = waitingPlayers.findIndex(p => p.id === socket.id);
    if (waitingIndex !== -1) {
      waitingPlayers.splice(waitingIndex, 1);
    }

    // Find and clean up any rooms where this user was playing
    for (const [roomId, room] of gameRooms.entries()) {
      if (room.white === socket.id || room.black === socket.id) {
        // Notify other player that opponent disconnected
        socket.to(roomId).emit('opponentDisconnected', {
          color: room.white === socket.id ? 'white' : 'black'
        });

        if (room.spectators.length > 0) {
          // Promote a spectator to player
          const newPlayer = room.spectators.shift();
          if (room.white === socket.id) {
            room.white = newPlayer.id;
            room.whiteName = newPlayer.username;
            io.to(newPlayer.id).emit('promotedToPlayer', {
              color: 'white',
              gameState: room.gameState,
              moves: room.moves
            });
          } else {
            room.black = newPlayer.id;
            room.blackName = newPlayer.username;
            io.to(newPlayer.id).emit('promotedToPlayer', {
              color: 'black',
              gameState: room.gameState,
              moves: room.moves
            });
          }
        } else {
          // Save the game state before potentially deleting the room
          saveGameForReplay(roomId, {
            result: 'abandoned',
            winner: room.white === socket.id ? 'black' : 'white'
          });
          
          // Stop the chess clock
          if (activeClocks.has(roomId)) {
            clearInterval(activeClocks.get(roomId));
            activeClocks.delete(roomId);
          }
          
          // No spectators, clean up room if it becomes empty
          if (room.white === socket.id && !room.black) {
            gameRooms.delete(roomId);
          } else if (room.black === socket.id && !room.white) {
            gameRooms.delete(roomId);
          }
        }
      } else if (room.spectators.some(s => s.id === socket.id)) {
        // Remove from spectators
        room.spectators = room.spectators.filter(s => s.id !== socket.id);
        
        // Notify players of spectator count change
        socket.to(roomId).emit('spectatorLeft', {
          spectatorCount: room.spectators.length
        });
      }
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
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Chess server running on port ${PORT}`);
});

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

module.exports = { app, server }; 
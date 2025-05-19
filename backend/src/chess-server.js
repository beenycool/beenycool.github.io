const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Import models
const User = require('./models/User');
const ChessGame = require('./models/ChessGame');
const ActivityLog = require('./models/ActivityLog');
const Guild = require('./models/Guild');

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
  socket.on('joinRoom', async ({ roomId, username, isResuming, password, userId }) => {
    try {
      let user = null;
      
      // If userId is provided, find the user in the database
      if (userId) {
        user = await User.findById(userId);
        username = user ? user.username : username || 'Anonymous';
      }
      
      // Check if room exists
      let room = gameRooms.get(roomId);
      
      // If room doesn't exist, create it
      if (!room) {
        room = {
          white: null,
          black: null,
          whiteName: null,
          blackName: null,
          spectators: [],
          gameState: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', // Initial position
          moves: [],
          chat: [],
          hasPassword: false,
          password: null,
          createdAt: new Date().toISOString(),
          timeControl: {
            initial: 600, // 10 minutes default
            increment: 5, // 5 seconds increment
            whiteTime: 600,
            blackTime: 600
          },
          currentTurn: 'white',
          preMoves: [] // Store pre-moves
        };
        
        gameRooms.set(roomId, room);
      }
      
      // Password check
      if (room.hasPassword && !isResuming) {
        if (!password || password !== room.password) {
          socket.emit('passwordRequired');
          return;
        }
      }
      
      // If resuming a game, restore state
      if (isResuming) {
        // We should restore the previous state
        socket.emit('gameResumed', {
          gameState: room.gameState,
          moveHistory: room.moves,
          chatHistory: room.chat,
          playerColor: room.white === socket.id ? 'white' : room.black === socket.id ? 'black' : null,
          opponentName: room.white === socket.id ? room.blackName : room.whiteName,
          timeControl: {
            white: room.timeControl.whiteTime,
            black: room.timeControl.blackTime,
            increment: room.timeControl.increment
          }
        });
      }
      
      // Join the socket room
      socket.join(roomId);
      
      // Determine if player will be white, black, or spectator
      let playerColor = null;
      
      if (!room.white) {
        room.white = socket.id;
        room.whiteName = username;
        playerColor = 'white';
        if (user) {
          // Create or update the ChessGame record
          await ChessGame.findOneAndUpdate(
            { gameId: roomId },
            { 
              'players.white.user': user._id,
              'players.white.username': username,
              'players.white.rating': user.chessRating
            },
            { upsert: true, new: true }
          );
        }
      } else if (!room.black && room.white !== socket.id) {
        room.black = socket.id;
        room.blackName = username;
        playerColor = 'black';
        if (user) {
          // Update the ChessGame record
          await ChessGame.findOneAndUpdate(
            { gameId: roomId },
            { 
              'players.black.user': user._id,
              'players.black.username': username,
              'players.black.rating': user.chessRating
            },
            { upsert: true, new: true }
          );
        }
        
        // Both players are now connected, notify them
        io.to(roomId).emit('gameReady', {
          white: room.whiteName,
          black: room.blackName
        });
        
        // Start the chess clock
        startChessClock(roomId);
      } else if (room.white === socket.id) {
        playerColor = 'white';
      } else if (room.black === socket.id) {
        playerColor = 'black';
      } else {
        // Add as spectator
        room.spectators.push({
          id: socket.id,
          name: username
        });
        
        // Notify players of new spectator
        socket.to(roomId).emit('spectatorJoined', {
          spectatorName: username,
          spectatorCount: room.spectators.length
        });
        
        // Notify spectator of current game state
        socket.emit('gameState', {
          gameState: room.gameState,
          moveHistory: room.moves,
          chatHistory: room.chat,
          white: room.whiteName,
          black: room.blackName,
          timeControl: {
            white: room.timeControl.whiteTime,
            black: room.timeControl.blackTime
          }
        });
      }
      
      // If this is a player (not a spectator), send color assignment and notify opponent
      if (playerColor) {
        socket.emit('joinedAsColor', {
          color: playerColor,
          timeControl: {
            whiteTime: room.timeControl.whiteTime,
            blackTime: room.timeControl.blackTime,
            increment: room.timeControl.increment
          }
        });
        
        // If opponent is connected, notify them
        if (playerColor === 'white' && room.black) {
          socket.to(room.black).emit('opponentJoined', { opponentName: username });
        } else if (playerColor === 'black' && room.white) {
          socket.to(room.white).emit('opponentJoined', { opponentName: username });
        }
        
        // Log activity
        if (user) {
          const ipAddress = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
          
          await ActivityLog.create({
            user: user._id,
            username: user.username,
            ipAddress,
            actionType: 'chess_game_start',
            actionDetails: {
              roomId,
              playerColor,
              opponent: playerColor === 'white' ? room.blackName : room.whiteName
            },
            performedAt: new Date()
          });
        }
      }
    } catch (error) {
      console.error('Error in joinRoom:', error);
      socket.emit('errorMessage', { message: 'An error occurred while joining the game' });
    }
  });

  // Handle move
  socket.on('move', async ({ roomId, move, gameState }) => {
    try {
      const room = gameRooms.get(roomId);
      if (!room) return;
      
      const playerColor = room.white === socket.id ? 'white' : 'black';
      const opponentSocketId = playerColor === 'white' ? room.black : room.white;
      
      // Validate that it's the player's turn
      if (playerColor !== room.currentTurn) {
        socket.emit('errorMessage', { message: 'Not your turn' });
        return;
      }
      
      // Apply move
      room.gameState = gameState;
      room.moves.push(gameState);
      
      // Update current turn
      room.currentTurn = playerColor === 'white' ? 'black' : 'white';
      
      // Apply clock increment for the player who just moved
      const timeKey = playerColor === 'white' ? 'whiteTime' : 'blackTime';
      room.timeControl[timeKey] += room.timeControl.increment;
      
      // Clear pre-moves for the player who just moved
      room.preMoves = room.preMoves.filter(pm => pm.color !== playerColor);
      
      // Notify opponent and spectators
      if (opponentSocketId) {
        io.to(opponentSocketId).emit('opponentMove', {
          move,
          gameState,
          remainingTime: room.timeControl
        });
      }
      
      // Notify spectators
      room.spectators.forEach(spectator => {
        io.to(spectator.id).emit('gameUpdate', {
          moveFrom: move.from,
          moveTo: move.to,
          gameState,
          playerColor,
          remainingTime: room.timeControl
        });
      });
      
      // Get user IDs to update records
      let whiteUserId = null;
      let blackUserId = null;
      
      // Find the ChessGame record and update it
      const game = await ChessGame.findOne({ gameId: roomId });
      if (game) {
        if (game.players.white.user) {
          whiteUserId = game.players.white.user;
        }
        if (game.players.black.user) {
          blackUserId = game.players.black.user;
        }
        
        // Add the move to the game record
        game.addMove({
          from: move.from,
          to: move.to,
          piece: move.piece || 'unknown',
          promotion: move.promotion,
          wasPreMove: false,
          fen: gameState,
          timestamp: new Date()
        });
      }
      
      // Log move activity for the player
      const userId = playerColor === 'white' ? whiteUserId : blackUserId;
      if (userId) {
        await ActivityLog.create({
          user: userId,
          username: playerColor === 'white' ? room.whiteName : room.blackName,
          actionType: 'chess_move',
          actionDetails: {
            roomId,
            from: move.from,
            to: move.to,
            piece: move.piece
          },
          performedAt: new Date()
        });
      }
      
      // Check if there are pre-moves for the new current turn and execute if valid
      const opponentPreMoves = room.preMoves.filter(pm => pm.color === room.currentTurn);
      if (opponentPreMoves.length > 0) {
        const preMove = opponentPreMoves[0]; // Take the first pre-move
        
        // Notify the opponent that their pre-move is being executed
        if (opponentSocketId) {
          io.to(opponentSocketId).emit('preMoveExecuted', {
            from: preMove.from,
            to: preMove.to,
            promotion: preMove.promotion
          });
        }
        
        // Remove this pre-move from the list
        room.preMoves = room.preMoves.filter(pm => pm !== preMove);
      }
    } catch (error) {
      console.error('Error in move:', error);
      socket.emit('errorMessage', { message: 'An error occurred while making the move' });
    }
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
  socket.on('gameOver', async ({ roomId, result, winner }) => {
    try {
      const room = gameRooms.get(roomId);
      if (!room) return;
      
      // Find the ChessGame record
      const game = await ChessGame.findOne({ gameId: roomId });
      if (!game) {
        console.error('Game not found:', roomId);
        return;
      }
      
      // Determine the game result in standard format
      let resultCode;
      let terminationReason;
      
      if (result.includes('checkmate')) {
        terminationReason = 'checkmate';
        resultCode = winner === 'white' ? '1-0' : '0-1';
      } else if (result.includes('timeout') || result.includes('time')) {
        terminationReason = 'timeout';
        resultCode = winner === 'white' ? '1-0' : '0-1';
      } else if (result.includes('resignation')) {
        terminationReason = 'resignation';
        resultCode = winner === 'white' ? '1-0' : '0-1';
      } else if (result.includes('draw') || result.includes('stalemate')) {
        resultCode = '1/2-1/2';
        
        if (result.includes('stalemate')) {
          terminationReason = 'stalemate';
        } else if (result.includes('repetition')) {
          terminationReason = 'threefold_repetition';
        } else if (result.includes('insufficient')) {
          terminationReason = 'insufficient_material';
        } else if (result.includes('fifty')) {
          terminationReason = 'fifty_move_rule';
        } else {
          terminationReason = 'agreement';
        }
      }
      
      // Update game result
      game.result = resultCode;
      game.termination = terminationReason;
      game.finalPosition = room.gameState;
      game.endTime = new Date();
      await game.save();
      
      // Update player stats
      if (game.players.white.user && game.players.black.user) {
        const whiteUser = await User.findById(game.players.white.user);
        const blackUser = await User.findById(game.players.black.user);
        
        if (whiteUser && blackUser) {
          // Update game stats
          whiteUser.stats.chess.gamesPlayed += 1;
          blackUser.stats.chess.gamesPlayed += 1;
          
          if (resultCode === '1-0') {
            whiteUser.stats.chess.wins += 1;
            blackUser.stats.chess.losses += 1;
          } else if (resultCode === '0-1') {
            blackUser.stats.chess.wins += 1;
            whiteUser.stats.chess.losses += 1;
          } else if (resultCode === '1/2-1/2') {
            whiteUser.stats.chess.draws += 1;
            blackUser.stats.chess.draws += 1;
          }
          
          // Calculate Elo rating changes
          const { newWhiteRating, newBlackRating } = calculateNewRatings(
            whiteUser.chessRating,
            blackUser.chessRating,
            resultCode
          );
          
          // Record rating changes
          game.players.white.ratingChange = newWhiteRating - whiteUser.chessRating;
          game.players.black.ratingChange = newBlackRating - blackUser.chessRating;
          
          // Update ratings
          whiteUser.chessRating = newWhiteRating;
          blackUser.chessRating = newBlackRating;
          
          // Save user updates
          await whiteUser.save();
          await blackUser.save();
          await game.save();
          
          // Update guild stats if users are in guilds
          if (whiteUser.guild) {
            const whiteGuild = await Guild.findById(whiteUser.guild);
            if (whiteGuild) {
              whiteGuild.stats.totalGames += 1;
              if (resultCode === '1-0') {
                whiteGuild.stats.totalWins += 1;
              }
              await whiteGuild.recalculateStats();
            }
          }
          
          if (blackUser.guild) {
            const blackGuild = await Guild.findById(blackUser.guild);
            if (blackGuild) {
              blackGuild.stats.totalGames += 1;
              if (resultCode === '0-1') {
                blackGuild.stats.totalWins += 1;
              }
              await blackGuild.recalculateStats();
            }
          }
          
          // Log activity
          const gameActivityDetails = {
            roomId,
            result: resultCode,
            termination: terminationReason,
            opponent: blackUser.username,
            ratingChange: game.players.white.ratingChange
          };
          
          await ActivityLog.create({
            user: whiteUser._id,
            username: whiteUser.username,
            actionType: 'chess_game_end',
            actionDetails: gameActivityDetails,
            performedAt: new Date()
          });
          
          gameActivityDetails.opponent = whiteUser.username;
          gameActivityDetails.ratingChange = game.players.black.ratingChange;
          
          await ActivityLog.create({
            user: blackUser._id,
            username: blackUser.username,
            actionType: 'chess_game_end',
            actionDetails: gameActivityDetails,
            performedAt: new Date()
          });
        }
      }
      
      // Stop the chess clock
      if (activeClocks.has(roomId)) {
        clearInterval(activeClocks.get(roomId));
        activeClocks.delete(roomId);
      }
      
      // Broadcast result to all players and spectators
      io.to(roomId).emit('gameOver', { result, winner });
    } catch (error) {
      console.error('Error in gameOver:', error);
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
            room.whiteName = newPlayer.name;
            io.to(newPlayer.id).emit('promotedToPlayer', {
              color: 'white',
              gameState: room.gameState,
              moves: room.moves
            });
          } else {
            room.black = newPlayer.id;
            room.blackName = newPlayer.name;
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
const PORT = process.env.CHESS_PORT || 10000;
let currentPort = PORT;
let retries = 0;
const MAX_RETRIES = 5;

function startServer(port) {
  server.listen(port, () => {
    console.log(`Chess server running on port ${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      retries += 1;
      if (retries <= MAX_RETRIES) {
        currentPort = port + retries;
        console.log(`Port ${port} is in use, trying ${currentPort} instead...`);
        startServer(currentPort);
      } else {
        console.error(`Could not find an available port after ${MAX_RETRIES} retries.`);
        // Inform main server about the failure
        process.send && process.send({ type: 'chess-server-failed' });
      }
    } else {
      console.error('Error starting chess server:', err);
    }
  });
}

startServer(currentPort);

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
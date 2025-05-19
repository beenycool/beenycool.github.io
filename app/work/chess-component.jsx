"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useTheme } from 'next-themes';
import { 
  RotateCcw, 
  ArrowLeftCircle, 
  ArrowRightCircle, 
  RefreshCcw,
  Info,
  Copy,
  UserPlus,
  Users,
  Clock,
  MessageSquare,
  Send,
  History,
  Award,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  ChevronDown,
  ChevronUp,
  Flag,
  Sparkles,
  User,
  Crown,
  Wand,
  BadgeAlert
} from 'lucide-react';

// Import UI components
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChessNotification } from '@/components/ui/chess-notification';
import { useKonamiCode } from '@/lib/useKonamiCode';
import { 
  KONAMI_CODE, 
  SPECIAL_POSITIONS, 
  SPECIAL_MOVE_SEQUENCES, 
  easterEggEffects,
  easterEggAnimations 
} from './chess-easter-eggs';

// Import custom CSS
import './theme.css';

// Use the existing backend API URL if available, or fallback to local Socket.io
const useExistingBackend = true;
const SOCKET_SERVER_URL = useExistingBackend 
  ? (typeof window !== 'undefined' && window.location.hostname === 'beenycool.github.io'
     ? 'https://beenycool-github-io.onrender.com' // External backend for GitHub Pages (removed /api/chess-socket)
     : '/api/chess-socket') // Local API route for development
  : 'http://localhost:3001';

// Password protection constants
const PASSWORD_KEY_PREFIX = 'chess_game_password_';
const SESSION_KEY_PREFIX = 'chess_session_';

// Player scoring algorithm
const calculatePlayerScore = (game, timeRemaining, moveHistory) => {
  // Initialize base score
  let score = 0;
  
  // Get final board position
  const position = game.board();
  
  // Material score (standard piece values)
  const pieceValues = {
    'p': 1,   // pawn
    'n': 3,   // knight
    'b': 3,   // bishop
    'r': 5,   // rook
    'q': 9,   // queen
    'k': 0    // king (no material value)
  };
  
  // Count material for both sides
  let whiteMaterial = 0;
  let blackMaterial = 0;
  
  position.forEach(row => {
    row.forEach(piece => {
      if (piece) {
        const pieceValue = pieceValues[piece.type.toLowerCase()];
        if (piece.color === 'w') {
          whiteMaterial += pieceValue;
        } else {
          blackMaterial += pieceValue;
        }
      }
    });
  });
  
  // Material difference score component
  const materialScore = game.turn() === 'w' ? whiteMaterial - blackMaterial : blackMaterial - whiteMaterial;
  score += materialScore * 10;
  
  // Time management score component
  // More time remaining = better time management
  const timeScore = Math.min(timeRemaining / 10, 50); // Cap at 50 points
  score += timeScore;
  
  // Position evaluation score component
  // Count center control (d4, d5, e4, e5)
  const centerSquares = ['d4', 'd5', 'e4', 'e5'];
  let centerControl = 0;
  
  centerSquares.forEach(square => {
    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      centerControl++;
    }
  });
  
  score += centerControl * 5;
  
  // Check for checkmate (bonus points)
  if (game.isCheckmate()) {
    score += 100;
  }
  
  // Penalty for stalemate
  if (game.isStalemate()) {
    score -= 20;
  }
  
  // Tactical play score - reward checks, captures, and threats
  const moveQualityScore = analyzeMoveQuality(moveHistory, game);
  score += moveQualityScore;
  
  return Math.max(0, Math.round(score)); // Ensure score is non-negative and rounded
};

// Analyze move quality for scoring
const analyzeMoveQuality = (moveHistory, game) => {
  let score = 0;
  let captureCount = 0;
  let checkCount = 0;
  
  // Create a temporary game to analyze moves
  const tempGame = new Chess();
  
  // Replay the game and analyze each move
  for (let i = 1; i < moveHistory.length; i++) {
    tempGame.load(moveHistory[i]);
    
    // Check if the last move was a capture
    const lastMove = tempGame.history({ verbose: true }).pop();
    if (lastMove && lastMove.captured) {
      captureCount++;
      
      // Bonus for capturing with lower value piece
      const capturingPieceValue = getPieceValue(lastMove.piece);
      const capturedPieceValue = getPieceValue(lastMove.captured);
      if (capturingPieceValue < capturedPieceValue) {
        score += (capturedPieceValue - capturingPieceValue) * 2;
      }
    }
    
    // Check if the move resulted in a check
    if (tempGame.inCheck()) {
      checkCount++;
    }
  }
  
  // Reward for tactical play
  score += captureCount * 3;
  score += checkCount * 5;
  
  return score;
};

// Helper to get piece value
const getPieceValue = (piece) => {
  const values = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0 };
  return values[piece] || 0;
};

export default function ChessComponent({ systemTheme }) {
  const [game, setGame] = useState(new Chess());
  const [boardWidth, setBoardWidth] = useState(480);
  const [moveHistory, setMoveHistory] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [fen, setFen] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  
  // Multiplayer state
  const [roomId, setRoomId] = useState("");
  const [playerColor, setPlayerColor] = useState("white");
  const [opponentConnected, setOpponentConnected] = useState(false);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [gameMode, setGameMode] = useState("local"); // "local" or "online"
  const [linkCopied, setLinkCopied] = useState(false);
  const [isYourTurn, setIsYourTurn] = useState(true);
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [spectatorCount, setSpectatorCount] = useState(0);
  
  // UI state
  const [timeControl, setTimeControl] = useState({ white: 600, black: 600 });
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showMatchmaking, setShowMatchmaking] = useState(false);
  const [isInMatchmaking, setIsInMatchmaking] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);
  const { theme, setTheme } = useTheme();
  const [darkMode, setDarkMode] = useState(systemTheme === 'dark');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showMoveList, setShowMoveList] = useState(false);
  const [highlightedSquares, setHighlightedSquares] = useState({});
  
  // Easter egg state
  const [easterEggNotification, setEasterEggNotification] = useState(null);
  const [activeAnimation, setActiveAnimation] = useState(null);
  const [secretVariation, setSecretVariation] = useState(null);
  const { success: konamiSuccess } = useKonamiCode();
  const [lastMove, setLastMove] = useState(null);
  const [isInCheck, setIsInCheck] = useState(false);
  const [customPieceStyle, setCustomPieceStyle] = useState('default'); // 'default', 'neo', '8bit'
  
  // Password protection state
  const [gamePassword, setGamePassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isResuming, setIsResuming] = useState(false);
  const [showSavedGamesModal, setShowSavedGamesModal] = useState(false);
  const [savedSessions, setSavedSessions] = useState([]);
  
  // Add player score state
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [showScores, setShowScores] = useState(false);
  
  const socketRef = useRef(null);
  const messageContainerRef = useRef(null);
  const audioRef = useRef({
    move: typeof Audio !== 'undefined' ? new Audio('/sounds/move.mp3') : null,
    capture: typeof Audio !== 'undefined' ? new Audio('/sounds/capture.mp3') : null,
    check: typeof Audio !== 'undefined' ? new Audio('/sounds/check.mp3') : null,
    castle: typeof Audio !== 'undefined' ? new Audio('/sounds/castle.mp3') : null,
    gameEnd: typeof Audio !== 'undefined' ? new Audio('/sounds/game-end.mp3') : null,
    notify: typeof Audio !== 'undefined' ? new Audio('/sounds/notify.mp3') : null,
  });
  
  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);
  
  // Connect to socket when component mounts
  useEffect(() => {
    if (gameMode === "online") {
      // Connect to the socket server with reconnection options
      socketRef.current = io(SOCKET_SERVER_URL, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
        transports: ['websocket', 'polling']
      });
      
      let connectionRetries = 0;
      const maxRetries = 3;
      
      // Connection error handling
      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        connectionRetries++;
        
        setChatMessages(prev => [...prev, {
          sender: 'System',
          message: `Connection error: ${error.message}. Trying to reconnect... (${connectionRetries}/${maxRetries})`,
          timestamp: new Date().toISOString(),
          system: true
        }]);
        
        // If we've tried too many times, switch to local mode
        if (connectionRetries >= maxRetries) {
          setChatMessages(prev => [...prev, {
            sender: 'System',
            message: `Unable to connect to online server. Switching to local mode.`,
            timestamp: new Date().toISOString(),
            system: true
          }]);
          
          // Disconnect and switch to local mode
          socketRef.current.disconnect();
          setGameMode("local");
          setShowChat(false);
          
          // Show a notification to the user
          if (audioRef.current?.notify) {
            audioRef.current.notify.play();
          }
        }
      });
      
      socketRef.current.on('connect', () => {
        console.log('Socket connected successfully');
        setChatMessages(prev => [...prev, {
          sender: 'System',
          message: 'Connected to game server',
          timestamp: new Date().toISOString(),
          system: true
        }]);
        
        // Join room if we have a roomId
        if (roomId) {
          socketRef.current.emit('joinRoom', { 
            roomId,
            username: playerName || 'Player'
          });
        }
      });
      
      // Set up event listeners
      socketRef.current.on('joinedAsColor', ({ color, timeControl }) => {
        setPlayerColor(color);
        setIsYourTurn(color === 'white');
        if (timeControl) {
          setTimeControl({
            white: timeControl.whiteTime,
            black: timeControl.blackTime
          });
        }
      });
      
      socketRef.current.on('opponentJoined', ({ opponentName }) => {
        setOpponentConnected(true);
        setWaitingForOpponent(false);
        setOpponentName(opponentName || 'Anonymous');
      });
      
      socketRef.current.on('passwordRequired', () => {
        setShowPasswordModal(true);
      });
      
      socketRef.current.on('passwordRejected', () => {
        setPasswordError("Incorrect password. Please try again.");
      });
      
      socketRef.current.on('gameResumed', ({ gameState, moveHistory, chatHistory, playerColor, opponentName, timeControl }) => {
        // Restore game state
        const newGame = new Chess(gameState);
        setGame(newGame);
        setFen(newGame.fen());
        
        // Restore move history
        if (moveHistory && moveHistory.length > 0) {
          setMoveHistory(moveHistory);
          setCurrentPosition(moveHistory.length - 1);
        }
        
        // Restore chat history
        if (chatHistory && chatHistory.length > 0) {
          setChatMessages(chatHistory);
        }
        
        // Restore player info
        if (playerColor) {
          setPlayerColor(playerColor);
          setIsYourTurn(newGame.turn() === (playerColor === 'white' ? 'w' : 'b'));
        }
        
        if (opponentName) {
          setOpponentName(opponentName);
          setOpponentConnected(true);
          setWaitingForOpponent(false);
        }
        
        // Restore time control
        if (timeControl) {
          setTimeControl(timeControl);
        }
        
        // Add system message
        setChatMessages(prev => [...prev, {
          sender: 'System',
          message: 'Game resumed successfully',
          timestamp: new Date().toISOString(),
          system: true
        }]);
      });
      
      socketRef.current.on('opponentMove', ({ move, gameState, remainingTime }) => {
        const newGame = new Chess(gameState);
        setGame(newGame);
        setFen(newGame.fen());
        
        // Update move history
        const newHistory = [...moveHistory, gameState];
        setMoveHistory(newHistory);
        setCurrentPosition(newHistory.length - 1);
        
        // Update clock if provided
        if (remainingTime) {
          setTimeControl(remainingTime);
        }
        
        // Set player's turn
        setIsYourTurn(true);
      });
      
      socketRef.current.on('clockUpdate', ({ white, black }) => {
        setTimeControl({ white, black });
      });
      
      socketRef.current.on('opponentDisconnected', ({ color }) => {
        // Handle opponent disconnection
        setChatMessages(prev => [...prev, {
          sender: 'System',
          message: `${color === 'white' ? 'White' : 'Black'} player disconnected`,
          timestamp: new Date().toISOString(),
          system: true
        }]);
      });
      
      socketRef.current.on('newMessage', (message) => {
        setChatMessages(prev => [...prev, message]);
      });
      
      socketRef.current.on('gameOver', ({ result, winner }) => {
        setGameResult({ result, winner });
        setIsYourTurn(false);
      });
      
      socketRef.current.on('spectatorJoined', ({ spectatorName, spectatorCount }) => {
        setSpectatorCount(spectatorCount);
        setChatMessages(prev => [...prev, {
          sender: 'System',
          message: `${spectatorName} joined as spectator`,
          timestamp: new Date().toISOString(),
          system: true
        }]);
      });
      
      socketRef.current.on('spectatorLeft', ({ spectatorCount }) => {
        setSpectatorCount(spectatorCount);
      });
      
      socketRef.current.on('gameHistory', ({ moves, chat }) => {
        if (moves) setMoveHistory(moves);
        if (chat) setChatMessages(chat);
      });
      
      socketRef.current.on('waitingForMatch', () => {
        setIsInMatchmaking(true);
      });
      
      socketRef.current.on('matchmakingCancelled', () => {
        setIsInMatchmaking(false);
      });
      
      socketRef.current.on('matchFound', ({ roomId, color, opponent, timeControl }) => {
        setRoomId(roomId);
        setPlayerColor(color);
        setIsYourTurn(color === 'white');
        setOpponentName(opponent);
        setOpponentConnected(true);
        setWaitingForOpponent(false);
        setIsInMatchmaking(false);
        setShowMatchmaking(false);
        
        if (timeControl) {
          setTimeControl({
            white: timeControl.initial,
            black: timeControl.initial
          });
        }
        
        // Update URL with room ID
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.set('room', roomId);
          window.history.pushState({}, '', url);
        }
      });
      
      // Request game history if joining an existing game
      if (roomId) {
        socketRef.current.emit('getGameHistory', { roomId });
      }
      
      // Clean up on unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [gameMode]);
  
  // Parse roomId from URL on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const roomIdParam = urlParams.get('room');
      
      if (roomIdParam) {
        setRoomId(roomIdParam);
        setGameMode("online");
        
        // Check if this room has a saved password
        const savedPassword = getGamePassword(roomIdParam);
        if (savedPassword) {
          // We have a saved password, check if we're the original player
          const sessions = getSavedSessions();
          const matchingSession = sessions.find(session => session.roomId === roomIdParam);
          
          if (matchingSession) {
            // We're resuming a previous session
            setIsResuming(true);
            setPlayerName(matchingSession.playerName || 'Player');
            setPlayerColor(matchingSession.playerColor || 'white');
            setPasswordProtected(true);
            setGamePassword(savedPassword);
            
            // Join the room with the saved password
            if (socketRef.current) {
              socketRef.current.emit('joinRoom', { 
                roomId: roomIdParam,
                username: matchingSession.playerName || 'Player',
                isResuming: true,
                password: savedPassword
              });
            }
          } else {
            // We need to enter the password
            setShowPasswordModal(true);
          }
        } else {
          // No password, join normally
          if (socketRef.current) {
            socketRef.current.emit('joinRoom', { 
              roomId: roomIdParam,
              username: playerName || 'Player'
            });
          }
        }
      }
    }
  }, [playerName]);

  // Theme synchronization
  useEffect(() => {
    setDarkMode(theme === 'dark');
  }, [theme]);

  // Konami code effect
  useEffect(() => {
    if (konamiSuccess) {
      const effect = easterEggEffects.konamiCodeEffect();
      setEasterEggNotification({ 
        title: effect.title,
        message: effect.message,
        variant: effect.variant,
        open: true 
      });
    }
  }, [konamiSuccess]);

  // Check for Easter Eggs after each move
  useEffect(() => {
    if (moveHistory.length === 0) return;
    
    // Only check for easter eggs in local mode
    if (gameMode !== 'local') return;
    
    // Check for special move sequences
    const currentMoves = game.history();
    
    Object.entries(SPECIAL_MOVE_SEQUENCES).forEach(([key, sequence]) => {
      // Check if the move sequence matches the beginning of one of our special sequences
      if (currentMoves.length >= sequence.length) {
        const lastMoves = currentMoves.slice(-sequence.length);
        if (JSON.stringify(lastMoves) === JSON.stringify(sequence)) {
          const effect = easterEggEffects.moveSequenceEffects[key]();
          setEasterEggNotification({
            title: effect.title,
            message: effect.message,
            variant: effect.variant,
            open: true
          });
          
          if (effect.animation) {
            setActiveAnimation(effect.animation);
            setTimeout(() => setActiveAnimation(null), 3000);
          }
          
          if (effect.sound && soundEnabled) {
            const audio = new Audio(effect.sound);
            audio.play();
          }
        }
      }
    });
    
    // Check for special positions
    const position = game.board();
    
    // Flatten the position and check against special positions
    const flatPosition = position.flat().filter(p => p !== null);
    
    Object.entries(SPECIAL_POSITIONS).forEach(([key, specialPos]) => {
      // Check if all pieces in the special position are on the board
      const match = specialPos.every(specPiece => 
        flatPosition.some(p => 
          p.type === specPiece.piece && 
          p.color === specPiece.color && 
          game.get(specPiece.square) !== null
        )
      );
      
      if (match) {
        const effect = easterEggEffects.positionEffects[key]();
        setEasterEggNotification({
          title: effect.title,
          message: effect.message,
          variant: effect.variant,
          open: true
        });
        
        if (effect.animation) {
          setActiveAnimation(effect.animation);
          setTimeout(() => setActiveAnimation(null), 3000);
        }
        
        if (effect.sound && soundEnabled) {
          const audio = new Audio(effect.sound);
          audio.play();
        }
      }
    });
  }, [moveHistory, game, gameMode, soundEnabled]);

  // Responsive board sizing
  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(480, window.innerWidth - 40);
      setBoardWidth(width);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set up initial position
  useEffect(() => {
    resetGame();
  }, []);

  // Update FEN when game changes
  useEffect(() => {
    if (game) {
      setFen(game.fen());
      
      // Check for game over conditions
      if (game.isGameOver()) {
        let result = 'draw';
        let winner = null;
        
        if (game.isCheckmate()) {
          winner = game.turn() === 'w' ? 'black' : 'white';
          result = `checkmate - ${winner} wins`;
        } else if (game.isDraw()) {
          if (game.isStalemate()) {
            result = 'draw - stalemate';
          } else if (game.isThreefoldRepetition()) {
            result = 'draw - threefold repetition';
          } else if (game.isInsufficientMaterial()) {
            result = 'draw - insufficient material';
          } else {
            result = 'draw - fifty move rule';
          }
        }
        
        setGameResult({ result, winner });
        
        // Send game over event in online mode
        if (gameMode === 'online' && socketRef.current) {
          socketRef.current.emit('gameOver', {
            roomId,
            result,
            winner
          });
        }
      }
    }
  }, [game, gameMode, roomId]);

  // Modify the existing code where the game ends (checkmate, draw, etc.)
  useEffect(() => {
    if (gameResult) {
      // Calculate scores
      const playerTimeRemaining = timeControl[playerColor];
      const opponentTimeRemaining = timeControl[playerColor === 'white' ? 'black' : 'white'];
      
      // Calculate scores based on final position and game history
      const pScore = calculatePlayerScore(game, playerTimeRemaining, moveHistory);
      const oScore = calculatePlayerScore(
        game, 
        opponentTimeRemaining, 
        moveHistory, 
        playerColor === 'white' ? 'b' : 'w'
      );
      
      setPlayerScore(pScore);
      setOpponentScore(oScore);
      setShowScores(true);
    }
  }, [gameResult]);

  // Handle a piece drop
  const onDrop = (sourceSquare, targetSquare) => {
    // In online mode, only allow moves if it's your turn
    if (gameMode === "online" && !isYourTurn) {
      return false;
    }
    
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // always promote to queen for simplicity
      });

      if (move === null) return false; // illegal move

      // Update game and history when a valid move is made
      setGame(new Chess(game.fen()));
      
      if (gameMode === "local") {
        const newHistory = [...moveHistory.slice(0, currentPosition), game.fen()];
        setMoveHistory(newHistory);
        setCurrentPosition(newHistory.length);
      }
      
      // In online mode, send move to opponent and switch turns
      if (gameMode === "online" && socketRef.current) {
        socketRef.current.emit('move', {
          roomId,
          move: {
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q',
            color: playerColor === 'white' ? 'w' : 'b'
          },
          gameState: game.fen()
        });
        
        setIsYourTurn(false);
      }
      
      return true;
    } catch (error) {
      return false;
    }
  };

  // Reset the game
  const resetGame = useCallback(() => {
    const newGame = new Chess();
    setGame(newGame);
    setMoveHistory([newGame.fen()]);
    setCurrentPosition(0);
    setGameResult(null);
    
    if (gameMode === "online") {
      setIsYourTurn(playerColor === "white");
    }
  }, [gameMode, playerColor]);

  // Undo last move
  const undoLastMove = useCallback(() => {
    // Only allow in local mode
    if (gameMode === "online") return;
    
    if (currentPosition > 0) {
      const newPosition = currentPosition - 1;
      const newGame = new Chess();
      newGame.load(moveHistory[newPosition]);
      setGame(newGame);
      setCurrentPosition(newPosition);
    }
  }, [currentPosition, moveHistory, gameMode]);

  // Redo move
  const redoMove = useCallback(() => {
    // Only allow in local mode
    if (gameMode === "online") return;
    
    if (currentPosition < moveHistory.length - 1) {
      const newPosition = currentPosition + 1;
      const newGame = new Chess();
      newGame.load(moveHistory[newPosition]);
      setGame(newGame);
      setCurrentPosition(newPosition);
    }
  }, [currentPosition, moveHistory, gameMode]);

  // Flip board orientation
  const flipBoard = useCallback(() => {
    // Only allow in local mode
    if (gameMode === "online") return;
    
    setGame(new Chess(game.fen()));
  }, [game, gameMode]);
  
  // Create a new game room
  const createGameRoom = () => {
    const newRoomId = uuidv4().substring(0, 8);
    setRoomId(newRoomId);
    setGameMode("online");
    setPlayerColor("white");
    setWaitingForOpponent(true);
    setIsYourTurn(true); // Creator goes first
    
    // Generate a password if password protection is enabled
    if (passwordProtected) {
      const newPassword = generateGamePassword();
      setGamePassword(newPassword);
      saveGamePassword(newRoomId, newPassword);
    }
    
    // Update URL with room ID
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('room', newRoomId);
      window.history.pushState({}, '', url);
    }
    
    // Connect and join room
    if (socketRef.current) {
      socketRef.current.emit('joinRoom', { 
        roomId: newRoomId,
        username: playerName || 'Player',
        hasPassword: passwordProtected
      });
    }
    
    resetGame();
  };
  
  // Start matchmaking
  const startMatchmaking = (e) => {
    e.preventDefault();
    
    if (!playerName) {
      alert('Please enter your name first');
      return;
    }
    
    setGameMode("online");
    
    // Send matchmaking request
    if (socketRef.current) {
      socketRef.current.emit('findMatch', {
        username: playerName,
        timeControl: {
          initial: 600, // 10 minutes default
          increment: 5  // 5 seconds increment
        }
      });
    }
  };
  
  // Cancel matchmaking
  const cancelMatchmaking = () => {
    if (socketRef.current) {
      socketRef.current.emit('cancelMatchmaking');
    }
    setIsInMatchmaking(false);
  };
  
  // Copy game link to clipboard
  const copyGameLink = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      setLinkCopied(true);
      
      // Reset copied status after 3 seconds
      setTimeout(() => {
        setLinkCopied(false);
      }, 3000);
    }
  };
  
  // Send chat message
  const sendChatMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socketRef.current) return;
    
    socketRef.current.emit('sendMessage', {
      roomId,
      message: newMessage.trim(),
      sender: playerName || 'Player',
      role: playerColor
    });
    
    // Add message locally to ensure it appears immediately
    setChatMessages(prev => [...prev, {
      sender: playerName || 'Player',
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      role: playerColor
    }]);
    
    setNewMessage('');
  };
  
  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Return to local mode
  const exitOnlineGame = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    
    setGameMode("local");
    setWaitingForOpponent(false);
    setOpponentConnected(false);
    setRoomId("");
    setPlayerColor("white");
    setIsYourTurn(true);
    setChatMessages([]);
    setGameResult(null);
    
    // Remove room from URL
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('room');
      window.history.pushState({}, '', url);
    }
    
    resetGame();
  };
  
  // Password protection functions
  const generateGamePassword = () => {
    // Generate a random 6-character alphanumeric password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 6; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };
  
  const saveGamePassword = (roomId, password) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Save password in localStorage
      window.localStorage.setItem(`${PASSWORD_KEY_PREFIX}${roomId}`, password);
      
      // Save session info
      const sessionInfo = {
        roomId,
        playerName,
        playerColor,
        timestamp: new Date().toISOString()
      };
      
      // Get existing sessions or initialize empty array
      const existingSessions = JSON.parse(window.localStorage.getItem(SESSION_KEY_PREFIX) || '[]');
      
      // Add new session, removing any duplicate for same roomId
      const updatedSessions = [
        ...existingSessions.filter(session => session.roomId !== roomId),
        sessionInfo
      ];
      
      // Save updated sessions
      window.localStorage.setItem(SESSION_KEY_PREFIX, JSON.stringify(updatedSessions));
    }
  };
  
  const getGamePassword = (roomId) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(`${PASSWORD_KEY_PREFIX}${roomId}`);
    }
    return null;
  };
  
  const getSavedSessions = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const sessions = JSON.parse(window.localStorage.getItem(SESSION_KEY_PREFIX) || '[]');
      // Sort by most recent first
      return sessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    return [];
  };
  
  const handlePasswordProtection = (e) => {
    e.preventDefault();
    
    if (!passwordProtected) {
      // Generate a password if enabling protection
      const newPassword = generateGamePassword();
      setGamePassword(newPassword);
      setPasswordProtected(true);
      
      // Save password
      if (roomId) {
        saveGamePassword(roomId, newPassword);
        
        // Notify server about password protection
        if (socketRef.current) {
          socketRef.current.emit('setRoomPassword', {
            roomId,
            hasPassword: true
          });
        }
      }
    } else {
      // Disabling password protection
      setGamePassword("");
      setPasswordProtected(false);
      
      // Remove password from storage
      if (typeof window !== 'undefined' && window.localStorage && roomId) {
        window.localStorage.removeItem(`${PASSWORD_KEY_PREFIX}${roomId}`);
        
        // Notify server about password removal
        if (socketRef.current) {
          socketRef.current.emit('setRoomPassword', {
            roomId,
            hasPassword: false
          });
        }
      }
    }
  };
  
  const verifyPassword = (e) => {
    e.preventDefault();
    
    // Get stored password for this room
    const storedPassword = getGamePassword(roomId);
    
    if (passwordInput === storedPassword) {
      // Password matches
      setPasswordError("");
      setShowPasswordModal(false);
      
      // Join the room
      if (socketRef.current) {
        socketRef.current.emit('joinRoom', { 
          roomId,
          username: playerName || 'Player',
          isResuming: true
        });
      }
      
      // Reset password input
      setPasswordInput("");
    } else {
      // Password doesn't match
      setPasswordError("Incorrect password. Please try again.");
    }
  };
  
  // Resume a saved game
  const resumeGame = (session) => {
    if (!session || !session.roomId) return;
    
    // Get the password for this room
    const savedPassword = getGamePassword(session.roomId);
    if (!savedPassword) {
      alert('Password not found for this game session');
      return;
    }
    
    // Set up session info
    setRoomId(session.roomId);
    setGameMode("online");
    setPlayerName(session.playerName || 'Player');
    setPlayerColor(session.playerColor || 'white');
    setIsResuming(true);
    setPasswordProtected(true);
    setGamePassword(savedPassword);
    
    // Update URL with room ID
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('room', session.roomId);
      window.history.pushState({}, '', url);
    }
    
    // Connect and join room
    if (socketRef.current) {
      socketRef.current.emit('joinRoom', { 
        roomId: session.roomId,
        username: session.playerName || 'Player',
        isResuming: true,
        password: savedPassword
      });
    }
    
    // Close the modal
    setShowSavedGamesModal(false);
  };
  
  // Load saved sessions on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessions = getSavedSessions();
      setSavedSessions(sessions);
    }
  }, []);

  return (
    <div className={`flex flex-col items-center min-h-screen p-4 bg-gray-50 text-gray-900 ${darkMode ? 'dark-mode dark:bg-gray-900 dark:text-gray-100' : ''}`}>
      <header className="w-full max-w-5xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Chess</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="control-button"
            title={soundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="control-button"
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>
      
      {/* Player name input (for online play) */}
      {!playerName && gameMode === "online" && (
        <div className="w-full max-w-md mb-6 game-room-container p-6 shadow-md">
          <form onSubmit={(e) => {
            e.preventDefault();
            const nameInput = e.target.elements.playerName;
            if (nameInput.value.trim()) {
              setPlayerName(nameInput.value.trim());
            }
          }}>
            <h3 className="font-bold text-lg mb-3">Enter Your Name</h3>
            <label className="block text-sm font-medium mb-2">To continue to the game:</label>
            <div className="flex gap-2">
              <input 
                name="playerName"
                className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700"
                placeholder="Your name"
                required
              />
              <button 
                type="submit"
                className="chess-button chess-button-primary"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Game mode selector */}
      <div className="w-full max-w-5xl mb-6">
        <div className="flex justify-between">
          <button 
            onClick={() => gameMode === "online" ? exitOnlineGame() : null}
            className={`py-2 px-4 rounded-l-md ${gameMode === "local" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
          >
            Local Game
          </button>
          
          {gameMode === "online" ? (
            <button 
              className="py-2 px-4 rounded-r-md bg-blue-600 text-white flex items-center gap-2"
            >
              <Users size={18} />
              Online Game
            </button>
          ) : (
            <div className="flex">
              <button 
                onClick={createGameRoom}
                className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white flex items-center gap-2"
              >
                <UserPlus size={18} />
                Create Game
              </button>
              <button 
                onClick={() => setShowMatchmaking(true)}
                className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white flex items-center gap-2"
              >
                <Users size={18} />
                Find Match
              </button>
              <button 
                onClick={() => setShowSavedGamesModal(true)}
                className="py-2 px-4 rounded-r-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white flex items-center gap-2"
              >
                <History size={18} />
                Saved Games
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Matchmaking dialog */}
      {showMatchmaking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="game-room-container p-6 shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Find a Match</h2>
            
            {isInMatchmaking ? (
              <div className="text-center py-8">
                <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="mb-4 text-lg">Looking for an opponent...</p>
                <button
                  onClick={cancelMatchmaking}
                  className="chess-button chess-button-primary bg-red-600 hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <form onSubmit={startMatchmaking}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Your Name:</label>
                  <input
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700"
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Time Control:</label>
                  <select className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700">
                    <option value="blitz">Blitz (5 min)</option>
                    <option value="rapid" selected>Rapid (10 min)</option>
                    <option value="classical">Classical (30 min)</option>
                  </select>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowMatchmaking(false)}
                    className="chess-button chess-button-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="chess-button chess-button-primary"
                  >
                    Find Opponent
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      
      {/* Share link (only in online mode) */}
      {gameMode === "online" && roomId && (
        <div className="w-full max-w-5xl mb-6 game-room-container p-4 shadow-md">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Game Room: <span className="font-mono">{roomId}</span></span>
              <div>
                {waitingForOpponent ? (
                  <span className="status-message status-warning inline-block animate-pulse">Waiting for opponent...</span>
                ) : (
                  <span className="status-message status-success inline-block">Opponent connected</span>
                )}
                {spectatorCount > 0 && (
                  <span className="ml-2 text-sm">({spectatorCount} spectator{spectatorCount !== 1 ? 's' : ''})</span>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center gap-2">
              <div className="flex-1 text-sm bg-gray-100 dark:bg-gray-700 py-1 px-2 rounded truncate font-mono">
                {typeof window !== 'undefined' ? window.location.href : ''}
              </div>
              <button 
                onClick={copyGameLink}
                className="chess-button chess-button-primary py-1 px-3"
              >
                <Copy size={16} />
                {linkCopied ? "Copied!" : "Copy Link"}
              </button>
            </div>
            
            {/* Password protection toggle */}
            {waitingForOpponent && (
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="password-protection"
                    checked={passwordProtected}
                    onChange={handlePasswordProtection}
                    className="h-4 w-4"
                  />
                  <label htmlFor="password-protection" className="text-sm">
                    Password protect this game
                  </label>
                </div>
                
                {passwordProtected && gamePassword && (
                  <div className="text-sm">
                    <span className="text-gray-500 mr-1">Password:</span>
                    <span className="font-mono font-medium">{gamePassword}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div className="player-info">
                <div className="player-avatar" style={{backgroundColor: playerColor === 'white' ? '#f0d9b5' : '#b58863', color: playerColor === 'white' ? '#000' : '#fff'}}>
                  {playerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="player-name">{playerName || 'You'}</div>
                  <div className="text-xs">{playerColor}</div>
                </div>
                <div className="player-time">{formatTime(timeControl[playerColor])}</div>
              </div>
              
              <div className="mx-3">
                {isYourTurn ? 
                  <span className="px-2 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full">Your turn</span> : 
                  <span className="px-2 py-1 text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded-full">Waiting</span>
                }
              </div>
              
              <div className="player-info">
                <div className="player-avatar" style={{backgroundColor: playerColor === 'black' ? '#f0d9b5' : '#b58863', color: playerColor === 'black' ? '#000' : '#fff'}}>
                  {opponentName ? opponentName.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <div className="player-name">{opponentName || 'Opponent'}</div>
                  <div className="text-xs">{playerColor === 'white' ? 'black' : 'white'}</div>
                </div>
                <div className="player-time">{formatTime(timeControl[playerColor === 'white' ? 'black' : 'white'])}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-auto">
          <div className={`game-room-container p-4 shadow-md ${isInCheck ? 'border-red-500 border-2' : ''}`}>
            <div className={`chess-board ${darkMode ? 'chess-board-dark' : ''}`}>
              <Chessboard 
                id="BasicBoard"
                boardWidth={boardWidth}
                position={fen}
                onPieceDrop={onDrop}
                boardOrientation={gameMode === "online" ? playerColor : "white"}
                customBoardStyle={{
                  borderRadius: '4px',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                }}
                customSquareStyles={{
                  ...highlightedSquares,
                  ...(lastMove ? {
                    [lastMove.from]: { backgroundColor: 'rgba(255, 255, 0, 0.3)' },
                    [lastMove.to]: { backgroundColor: 'rgba(255, 255, 0, 0.3)' }
                  } : {})
                }}
                customDarkSquareStyle={{ backgroundColor: darkMode ? '#40686a' : '#b58863' }}
                customLightSquareStyle={{ backgroundColor: darkMode ? '#6e8b8a' : '#f0d9b5' }}
              />
            </div>

            <div className="chess-controls mt-4">
              <button 
                onClick={undoLastMove} 
                disabled={currentPosition <= 0 || gameMode === "online"}
                className="control-button"
                title={gameMode === "online" ? "Undo unavailable in online games" : "Undo move"}
              >
                <ArrowLeftCircle size={20} />
              </button>
              <button 
                onClick={resetGame}
                disabled={gameMode === "online" && opponentConnected}
                className="control-button"
                title={gameMode === "online" && opponentConnected ? "Cannot reset during online game" : "Reset game"}
              >
                <RefreshCcw size={20} />
              </button>
              <button 
                onClick={flipBoard}
                disabled={gameMode === "online"}
                className="control-button"
                title={gameMode === "online" ? "Rotate unavailable in online games" : "Rotate board"}
              >
                <RotateCcw size={20} />
              </button>
              <button 
                onClick={redoMove} 
                disabled={currentPosition >= moveHistory.length - 1 || gameMode === "online"}
                className="control-button"
                title={gameMode === "online" ? "Redo unavailable in online games" : "Redo move"}
              >
                <ArrowRightCircle size={20} />
              </button>
              
              {gameMode === "online" && (
                <button 
                  onClick={() => setShowChat(!showChat)}
                  className={`control-button ${showChat ? 'bg-blue-600 text-white' : ''}`}
                  title="Toggle chat"
                >
                  <MessageSquare size={20} />
                </button>
              )}
              
              <button 
                onClick={() => setShowMoveList(!showMoveList)}
                className={`control-button ${showMoveList ? 'bg-blue-600 text-white' : ''}`}
                title="Move history"
              >
                <History size={20} />
              </button>
            </div>
            
            {/* Move list panel */}
            {showMoveList && (
              <div className="move-list mt-4">
                {moveHistory.length <= 1 ? (
                  <div className="text-center text-gray-500 py-2">No moves yet</div>
                ) : (
                  Array.from({ length: Math.ceil((moveHistory.length - 1) / 2) }).map((_, i) => {
                    const moveIndex = i + 1;
                    return (
                      <div key={moveIndex} className={`move-item ${currentPosition === moveIndex * 2 - 1 || currentPosition === moveIndex * 2 ? 'current-move' : ''}`}>
                        <div className="move-number">{moveIndex}.</div>
                        <div className="move-text">
                          <span className="move-text-white">
                            {moveIndex * 2 - 1 < moveHistory.length ? (
                              <button 
                                onClick={() => setCurrentPosition(moveIndex * 2 - 1)}
                                className="hover:text-blue-600"
                              >
                                {getMoveNotation(moveIndex * 2 - 1)}
                              </button>
                            ) : null}
                          </span>
                          <span className="move-text-black">
                            {moveIndex * 2 < moveHistory.length ? (
                              <button 
                                onClick={() => setCurrentPosition(moveIndex * 2)}
                                className="hover:text-blue-600"
                              >
                                {getMoveNotation(moveIndex * 2)}
                              </button>
                            ) : null}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
            
            {/* Game result banner */}
            {gameResult && (
              <div className="game-result bg-blue-100 dark:bg-blue-900">
                <div className="font-bold text-lg">
                  Game Over: {gameResult.result}
                </div>
                {gameResult.winner && (
                  <div className="mt-2">
                    <Award className="inline-block mr-1" size={20} />
                    <span className="text-lg font-medium">
                      {gameResult.winner === 'white' ? 'White' : 'Black'} wins!
                    </span>
                  </div>
                )}
                
                {/* Add new score display here */}
                {showScores && (
                  <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-md">
                    <h3 className="font-bold text-center mb-2">Player Scores</h3>
                    <div className="flex justify-between items-center">
                      <div className="text-center">
                        <div className="font-medium">{playerColor === 'white' ? 'White' : 'Black'}</div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{playerScore}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                      
                      <div className="text-xl font-bold text-gray-400">vs</div>
                      
                      <div className="text-center">
                        <div className="font-medium">{playerColor === 'white' ? 'Black' : 'White'}</div>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{opponentScore}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm text-center text-gray-600 dark:text-gray-400">
                      Score based on material, position, time management, and tactical play
                    </div>
                  </div>
                )}
                
                <div className="mt-3">
                  <button 
                    onClick={resetGame}
                    disabled={gameMode === "online" && opponentConnected}
                    className="chess-button chess-button-primary mx-auto"
                  >
                    <RefreshCcw size={16} className="mr-1" />
                    Play Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Side panel - chat or analysis */}
        <div className="w-full md:w-72 flex flex-col">
          {/* Chat panel (only in online mode) */}
          {gameMode === "online" && showChat && (
            <div className="game-room-container p-4 shadow-md flex flex-col h-96">
              <h3 className="font-bold mb-2 flex items-center">
                <MessageSquare size={16} className="mr-1" />
                Chat
              </h3>
              
              <div 
                ref={messageContainerRef}
                className="flex-1 overflow-y-auto mb-3 text-sm space-y-2 chat-container"
              >
                {chatMessages.length === 0 ? (
                  <p className="text-gray-500 italic p-4 text-center">No messages yet.</p>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`chat-message p-2 rounded-lg mb-1 ${
                        msg.system 
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-center italic' 
                          : msg.role === playerColor 
                            ? 'bg-blue-100 dark:bg-blue-900 ml-4 text-blue-800 dark:text-blue-200' 
                            : 'bg-gray-200 dark:bg-gray-700 mr-4'
                      }`}
                    >
                      {!msg.system && (
                        <div className="font-medium text-xs opacity-75 mb-1">
                          {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      )}
                      <div>{msg.message}</div>
                    </div>
                  ))
                )}
              </div>
              
              <form onSubmit={sendChatMessage} className="flex gap-1">
                <input
                  className="flex-1 p-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  placeholder="Type a message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`p-2 rounded-md ${
                    newMessage.trim() 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          )}
          
          <div className="game-room-container p-4 shadow-md mt-6">
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 w-full justify-between"
            >
              <div className="flex items-center">
                <Info size={18} className="mr-1" />
                <span>Game Information</span>
              </div>
              {showInfo ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {showInfo && (
              <div className="mt-3 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">How to Play</h2>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Drag and drop pieces to make a move</li>
                    <li>Use the controls to navigate moves or reset</li>
                    <li className={gameMode === "online" ? "text-gray-400" : ""}>
                      Undo/redo moves {gameMode === "online" ? "(local mode only)" : ""}
                    </li>
                  </ul>
                </div>
                
                {gameMode === "online" && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Online Play</h2>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Share the game link with your opponent</li>
                      <li>Use chat to communicate during the game</li>
                      <li>Chess clock tracks each player's time</li>
                    </ul>
                  </div>
                )}
                
                <div>
                  <h2 className="text-lg font-semibold mb-2">Keyboard Shortcuts</h2>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Arrow Left:</div>
                    <div>Previous move</div>
                    <div>Arrow Right:</div>
                    <div>Next move</div>
                    <div>R:</div>
                    <div>Reset game</div>
                    <div>F:</div>
                    <div>Flip board</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Password modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="game-room-container p-6 shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Password Required</h2>
            <p className="mb-4">This game is password protected. Please enter the password to join.</p>
            
            <form onSubmit={verifyPassword}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Game Password:</label>
                <input
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700"
                  type="password"
                  placeholder="Enter password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    exitOnlineGame();
                  }}
                  className="chess-button chess-button-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="chess-button chess-button-primary"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Saved games modal */}
      {showSavedGamesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="game-room-container p-6 shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Saved Games</h2>
            
            {savedSessions.length === 0 ? (
              <p className="text-center py-4 text-gray-500">No saved games found</p>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {savedSessions.map((session, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 dark:border-gray-700 rounded-md p-3 mb-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{session.playerName || 'Anonymous'}</div>
                        <div className="text-sm text-gray-500">
                          Room: <span className="font-mono">{session.roomId}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(session.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-medium">{session.playerColor}</div>
                        <button 
                          onClick={() => resumeGame(session)}
                          className="chess-button chess-button-primary !py-1 !px-2 text-sm"
                        >
                          Resume
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowSavedGamesModal(false)}
                className="chess-button chess-button-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
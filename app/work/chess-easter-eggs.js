import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Konami code sequence
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 
  'ArrowDown', 'ArrowDown', 
  'ArrowLeft', 'ArrowRight', 
  'ArrowLeft', 'ArrowRight', 
  'b', 'a'
];

// Special piece positions that trigger easter eggs
const SPECIAL_POSITIONS = {
  // Four knights in the center
  fourKnights: [
    { piece: 'n', color: 'w', square: 'd4' },
    { piece: 'n', color: 'w', square: 'e4' },
    { piece: 'n', color: 'b', square: 'd5' },
    { piece: 'n', color: 'b', square: 'e5' }
  ],
  // All pawns on their original squares
  originalPawns: [
    ...[...Array(8)].map((_, i) => ({ piece: 'p', color: 'w', square: String.fromCharCode(97 + i) + '2' })),
    ...[...Array(8)].map((_, i) => ({ piece: 'p', color: 'b', square: String.fromCharCode(97 + i) + '7' }))
  ],
  // Chess960 starting position
  chess960: [
    { piece: 'r', color: 'w', square: 'a1' },
    { piece: 'n', color: 'w', square: 'b1' },
    { piece: 'b', color: 'w', square: 'c1' },
    { piece: 'q', color: 'w', square: 'd1' },
    { piece: 'k', color: 'w', square: 'e1' },
    { piece: 'b', color: 'w', square: 'f1' },
    { piece: 'n', color: 'w', square: 'g1' },
    { piece: 'r', color: 'w', square: 'h1' },
    { piece: 'r', color: 'b', square: 'a8' },
    { piece: 'n', color: 'b', square: 'b8' },
    { piece: 'b', color: 'b', square: 'c8' },
    { piece: 'q', color: 'b', square: 'd8' },
    { piece: 'k', color: 'b', square: 'e8' },
    { piece: 'b', color: 'b', square: 'f8' },
    { piece: 'n', color: 'b', square: 'g8' },
    { piece: 'r', color: 'b', square: 'h8' }
  ],
  // Two White Rooks on the 7th rank (simplified)
  twoRooksOnSeventhWhite: [
    { piece: 'r', color: 'w', square: 'a7' },
    { piece: 'r', color: 'w', square: 'b7' }
  ]
};

// Special move sequences
const SPECIAL_MOVE_SEQUENCES = {
  scholar: ['e4', 'e5', 'Qh5', 'Nc6', 'Bc4', 'Nf6', 'Qxf7#'], // Scholar's mate
  fool: ['f3', 'e5', 'g4', 'Qh4#'], // Fool's mate
  immortal: ['e4', 'e5', 'f4', 'exf4', 'Bc4', 'Qh4+', 'Kf1', 'b5', 'Bxb5', 'Nf6', 'Nf3', 'Qh6', 'd3', 'Nh5', 'Nh4', 'Qg5', 'Nf5', 'c6', 'g4', 'Nf6', 'Rg1', 'cxb5', 'h4', 'Qg6', 'h5', 'Qg5', 'Qf3', 'Ng8', 'Bxf4', 'Qf6', 'Nc3', 'Bc5', 'Nd5', 'Qxb2', 'Bd6', 'Bxg1', 'e5', 'Qxa1+', 'Ke2', 'Na6', 'Nxg7+', 'Kd8', 'Qf6+'], // Start of the Immortal Game
  queensGambitAccepted: ['d4', 'd5', 'c4', 'dxc4'] // Queen's Gambit Accepted
};

// Easter egg effects
const easterEggEffects = {
  // Konami code effect - rains chess pieces
  konamiCodeEffect: () => {
    // Create confetti with chess piece shapes
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Return notification message
    return {
      title: "Konami Code Activated!",
      message: "You found a secret! Enjoy the confetti!",
      variant: "success"
    };
  },
  
  // Special position effects
  positionEffects: {
    fourKnights: () => {
      return {
        title: "The Four Knights!",
        message: "A powerful cavalry has assembled in the center!",
        variant: "special",
        animation: "knights-dance",
        sound: "/sounds/horse-neigh.mp3"
      };
    },
    originalPawns: () => {
      return {
        title: "Pawn Harmony",
        message: "All pawns in their original positions. So orderly!",
        variant: "info",
        animation: "pawn-wave"
      };
    },
    chess960: () => {
      return {
        title: "Fischer Random!",
        message: "You've recreated a Chess960 position!",
        variant: "special",
        animation: "board-rotate"
      };
    },
    twoRooksOnSeventhWhite: () => {
      return {
        title: "Pigs on the Seventh!",
        message: "White's rooks dominate the seventh rank!",
        variant: "special",
        sound: "/sounds/notify.mp3"
      };
    }
  },
  
  // Special move sequence effects
  moveSequenceEffects: {
    scholar: () => {
      return {
        title: "Scholar's Mate!",
        message: "You executed the classic Scholar's Mate!",
        variant: "special",
        animation: "checkmate-flash",
        sound: "/sounds/checkmate.mp3"
      };
    },
    fool: () => {
      return {
        title: "Fool's Mate!",
        message: "The quickest checkmate possible!",
        variant: "warning",
        animation: "fool-spotlight",
        sound: "/sounds/short-laugh.mp3"
      };
    },
    immortal: () => {
      return {
        title: "The Immortal Game!",
        message: "You're recreating Anderssen's famous Immortal Game!",
        variant: "epic",
        animation: "immortal-glow",
        sound: "/sounds/epic-reveal.mp3"
      };
    },
    queensGambitAccepted: () => {
      return {
        title: "Queen's Gambit Accepted!",
        message: "A classic opening unfolds. Bold move!",
        variant: "info"
      };
    }
  },
  
  // Secret chess variations
  chessVariations: {
    // Fog of War - pieces only visible near your pieces
    fogOfWar: {
      name: "Fog of War",
      description: "You can only see squares near your pieces.",
      activate: (game) => {
        // Implementation would hide opponent pieces not in "sight" of your pieces
        return {
          title: "Fog of War Activated",
          message: "The battlefield is shrouded in mystery...",
          variant: "special"
        };
      }
    },
    
    // Atomic Chess - captures cause explosions
    atomicChess: {
      name: "Atomic Chess",
      description: "Captures cause explosions affecting adjacent pieces.",
      activate: (game) => {
        // Implementation would remove pieces in a capture radius
        return {
          title: "Atomic Chess Activated",
          message: "Beware of explosions when capturing!",
          variant: "danger",
          sound: "/sounds/explosion.mp3"
        };
      }
    }
  }
};

// Custom animations for the easter eggs
const easterEggAnimations = {
  "knights-dance": {
    parent: {
      initial: { scale: 1 },
      animate: { scale: [1, 1.05, 1], transition: { duration: 0.5, repeat: 3 } }
    },
    children: {
      initial: { y: 0 },
      animate: { y: [0, -10, 0], transition: { duration: 0.3, repeat: 5 } }
    }
  },
  "pawn-wave": {
    parent: {
      initial: { opacity: 1 },
      animate: { opacity: 1 }
    },
    children: (i) => ({
      initial: { y: 0 },
      animate: { 
        y: [0, -5, 0], 
        transition: { 
          delay: i * 0.1, 
          duration: 0.3, 
          repeat: 1 
        } 
      }
    })
  },
  "board-rotate": {
    parent: {
      initial: { rotate: 0 },
      animate: { rotate: 360, transition: { duration: 1.5 } }
    }
  },
  "checkmate-flash": {
    parent: {
      initial: { backgroundColor: "rgba(255, 255, 255, 0)" },
      animate: { 
        backgroundColor: ["rgba(255, 255, 255, 0)", "rgba(255, 215, 0, 0.3)", "rgba(255, 255, 255, 0)"],
        transition: { duration: 1.2 }
      }
    }
  },
  "fool-spotlight": {
    parent: {
      initial: { boxShadow: "0 0 0 rgba(0, 0, 0, 0)" },
      animate: { 
        boxShadow: ["0 0 0 rgba(0, 0, 0, 0)", "0 0 30px rgba(255, 0, 0, 0.8)", "0 0 0 rgba(0, 0, 0, 0)"],
        transition: { duration: 1.5 }
      }
    }
  },
  "immortal-glow": {
    parent: {
      initial: { boxShadow: "0 0 0 rgba(0, 0, 0, 0)" },
      animate: { 
        boxShadow: ["0 0 0 rgba(0, 0, 0, 0)", "0 0 40px rgba(255, 215, 0, 0.6)", "0 0 0 rgba(0, 0, 0, 0)"],
        transition: { duration: 2, repeat: 1 }
      }
    }
  }
};

export { 
  KONAMI_CODE, 
  SPECIAL_POSITIONS, 
  SPECIAL_MOVE_SEQUENCES, 
  easterEggEffects,
  easterEggAnimations 
}; 
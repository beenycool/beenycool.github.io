# Chess Application

This directory contains the chess application with both local play and online multiplayer functionality.

## Features

### Chess Board and Gameplay
- Interactive chess board with drag-and-drop moves
- Full chess rules implementation with chess.js
- Move history, undo/redo, and board rotation
- Dark/light mode support
- Sound effects for moves and events
- Different piece styles

### Multiplayer Features
- Create and share game rooms with unique links
- Real-time gameplay via Socket.io
- Matchmaking system for finding random opponents
- In-game chat between players
- Chess clocks with configurable time controls
- Spectator mode for observers

### Post-Game Analysis
- Player scoring system based on:
  - Material advantage
  - Position quality
  - Time management
  - Tactical play (captures and checks)
- Game result announcements with score comparison
- Game history for review

### UI Elements
- Player information panels
- Move history with algebraic notation
- Game result announcements
- Sound toggles and visual customization

## Implementation Details

- **Frontend**: Next.js with React components
- **Chess Logic**: chess.js library
- **UI Components**: react-chessboard and custom components
- **Styling**: Tailwind CSS with custom theme
- **Real-time Communication**: Socket.io client
- **Backend**: Integrated with the existing application backend via API routes

## Local Development

The chess application is automatically included in the Next.js development server:

```bash
npm run dev
```

Visit http://localhost:3000/work to play locally.

## Sound Effects

The application uses sound effects for various chess actions. These files should be placed in `/public/sounds/`:
- move.mp3
- capture.mp3
- check.mp3
- castle.mp3
- game-end.mp3
- notify.mp3

## Player Scoring Algorithm

After each game, players receive scores based on:

1. **Material Score**: Points based on pieces remaining on the board (pawns=1, knights/bishops=3, rooks=5, queens=9)
2. **Position Score**: Points for controlling central squares and piece activity
3. **Time Management**: Points for having more time remaining on the clock
4. **Tactical Play**: Additional points for checks, captures, and tactical threats

The scoring system provides a way to evaluate play quality beyond just win/loss results. 
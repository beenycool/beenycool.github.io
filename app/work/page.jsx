import React from 'react';
import ChessClientWrapper from './client-wrapper';

export const metadata = {
  title: 'Chess | Beeny Cool',
  description: 'Play chess locally or online with friends through a custom multiplayer experience with dark mode, easter eggs, and animations.',
};

export default function ChessPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
      <main className="container mx-auto px-4">
        <ChessClientWrapper />
      </main>
    </div>
  );
} 
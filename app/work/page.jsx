import React from 'react';
import ChessClientWrapper from './client-wrapper';

export const metadata = {
  title: 'Chess | Beeny Cool',
  description: 'Play chess locally or online with friends through a custom multiplayer experience.',
};

export default function ChessPage() {
  return (
    <main className="container mx-auto px-4">
      <ChessClientWrapper />
    </main>
  );
} 
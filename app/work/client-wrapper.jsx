"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import { useTheme } from 'next-themes';

// Dynamic import for the Chess component
const ChessComponent = dynamic(
  () => import('./chess-component.jsx').then(mod => {
    if (mod.default) return mod.default;
    return mod;
  }),
  { ssr: false }
);

export default function ChessClientWrapper() {
  const { theme } = useTheme();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <ChessComponent systemTheme={theme} />
    </div>
  );
} 
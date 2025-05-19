"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamic import for the Chess component
const ChessComponent = dynamic(
  () => import('./chess-component.jsx').then(mod => {
    if (mod.default) return mod.default;
    return mod;
  }),
  { ssr: false }
);

export default function ChessClientWrapper() {
  return <ChessComponent />;
} 
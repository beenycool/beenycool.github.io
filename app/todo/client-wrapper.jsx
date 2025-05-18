"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamic import for the Todo component
const TodoComponent = dynamic(
  () => import('./todo-component.jsx').then(mod => {
    if (mod.default) return mod.default;
    return mod;
  }),
  { ssr: false }
);

export default function TodoClientWrapper() {
  return <TodoComponent />;
} 
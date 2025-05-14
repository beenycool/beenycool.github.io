"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Fix: Better handling of default exports to avoid hook errors
const AIMarkerComponent = dynamic(
  () => import('./aimarker.jsx').then(mod => {
    if (mod.default) return mod.default;
    return mod;
  }),
  { ssr: false }
);

export default function AIMarkerClientWrapper() {
  return <AIMarkerComponent />;
}
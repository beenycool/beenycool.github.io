"use client";

import dynamic from 'next/dynamic';

// Use dynamic import with ssr: false to prevent server-side rendering
const AIMarkerComponent = dynamic(() => import('./aimarker'), {
  ssr: false,
});

export default function AIMarkerClientWrapper() {
  return <AIMarkerComponent />;
}
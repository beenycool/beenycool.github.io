'use client';

import dynamic from 'next/dynamic';

// Use dynamic import with ssr: false to prevent server-side rendering
const AIMarker = dynamic(() => import('@/app/aimarker'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-[50vh]">Loading AI Marker...</div>
});

export default function ClientWrapper() {
  return <AIMarker />;
}
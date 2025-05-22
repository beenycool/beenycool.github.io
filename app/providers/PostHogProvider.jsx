'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

export function PostHogProvider({ children }) {
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Initialize PostHog
      posthog.init(
        // Use a public key that's safe to expose
        process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_placeholder_key',
        {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
          capture_pageview: true, // Automatically capture pageviews
          capture_pageleave: true, // Capture when users leave
          autocapture: true, // Capture button clicks, form submissions, etc.
          persistence: 'localStorage',
          disable_session_recording: false, // Enable session recording
          loaded: (posthog) => {
            if (process.env.NODE_ENV === 'development') {
              // Don't track in development
              posthog.opt_out_capturing();
            }
          },
        }
      );
    }
    
    // Clean up
    return () => {
      if (typeof window !== 'undefined') {
        posthog.shutdown();
      }
    };
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
} 
"use client";

import { useEffect } from 'react';
import { initializeApiHelpers } from '@/lib/api-helpers';

/**
 * APIInitializer - Component to initialize API helpers 
 * This component ensures API helpers are properly initialized early
 * in the application lifecycle to prevent timing issues or reference errors
 */
export function APIInitializer() {
  useEffect(() => {
    // verify that critical variables exist, but don't reinitialize
    if (typeof window !== 'undefined' && window.aV) {
      // Skip initialization and just set up API helpers
      try {
        console.log('API variables already initialized, setting up API helpers...');
        if (!window.API_HELPERS?.initialized) {
          initializeApiHelpers();
          window.API_HELPERS.initialized = true;
        } else {
          console.log('API helpers already initialized, skipping...');
        }
      } catch (error) {
        console.error('Error initializing API helpers from component:', error);
      }
    }
  }, []);

  // This component doesn't render anything visible
  return null;
} 
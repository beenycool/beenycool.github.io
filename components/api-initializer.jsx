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
    try {
      console.log('Initializing API helpers from component...');
      initializeApiHelpers();
    } catch (error) {
      console.error('Error initializing API helpers from component:', error);
    }
  }, []);

  // This component doesn't render anything visible
  return null;
} 
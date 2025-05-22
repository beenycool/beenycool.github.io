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
    // Use a short timeout to ensure DOM is fully ready
    // This helps avoid the temporal dead zone issues
    const timer = setTimeout(() => {
      try {
        console.log('Initializing API helpers from component...');
        // The window object should already have minimal initialization
        // from the script in <head>, so this is safer now
        initializeApiHelpers();
      } catch (error) {
        console.error('Error initializing API helpers from component:', error);
      }
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  // This component doesn't render anything visible
  return null;
} 
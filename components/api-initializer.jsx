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
    // Ensure critical variables exist before proceeding
    if (typeof window !== 'undefined') {
      window.aV = window.aV || {};
      window.API_HELPERS = window.API_HELPERS || {};
      window.BACKEND_STATUS = window.BACKEND_STATUS || { status: 'checking' };
    }

    // Use a short timeout to ensure DOM is fully ready
    // This helps avoid the temporal dead zone issues
    const timer = setTimeout(() => {
      try {
        console.log('Initializing API helpers from component...');
        // Check if we already have initialization
        if (!window.API_HELPERS?.initialized) {
          initializeApiHelpers();
          window.API_HELPERS.initialized = true;
        } else {
          console.log('API helpers already initialized, skipping...');
        }
      } catch (error) {
        console.error('Error initializing API helpers from component:', error);
        // Attempt recovery by reinitializing critical variables
        if (typeof window !== 'undefined') {
          window.aV = window.aV || {};
          window.API_HELPERS = window.API_HELPERS || {};
          window.BACKEND_STATUS = window.BACKEND_STATUS || { status: 'checking' };
        }
      }
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  // This component doesn't render anything visible
  return null;
} 
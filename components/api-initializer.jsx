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
    // Initialize variables if they don't exist yet
    if (typeof window !== 'undefined') {
      try {
        // Initialize aV if it doesn't exist
        if (!window.aV) {
          window.aV = {};
        }
        
        // Initialize API_HELPERS if it doesn't exist
        if (!window.API_HELPERS) {
          window.API_HELPERS = {};
        }
        
        console.log('API variables ensured, setting up API helpers...');
        if (!window.API_HELPERS?.initialized) {
          initializeApiHelpers();
          window.API_HELPERS.initialized = true;
        } else {
          console.log('API helpers already initialized, skipping...');
        }
      } catch (error) {
        console.error('Error initializing API helpers from component:', error);
        // Fallback: ensure basic variables exist
        if (typeof window !== 'undefined') {
          window.aV = window.aV || {};
          window.API_HELPERS = window.API_HELPERS || {};
        }
      }
    }
  }, []);

  // This component doesn't render anything visible
  return null;
} 
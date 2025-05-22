"use client";

/**
 * Simple API fallback helpers for handling GitHub Pages deployments
 * These functions provide basic standalone functionality without dependencies
 */

// DEFAULT BACKEND URL
const DEFAULT_BACKEND_URL = 'https://beenycool-github-io.onrender.com';

// Safely construct an API URL
export const safeConstructApiUrl = (endpoint, baseUrl = DEFAULT_BACKEND_URL) => {
  try {
    // Try to use the function from the window object if available
    if (typeof window !== 'undefined' && typeof window.constructApiUrl === 'function') {
      return window.constructApiUrl(endpoint);
    }
  } catch (error) {
    console.warn('Error using window.constructApiUrl, falling back to direct safe implementation');
  }

  // Fallback implementation
  // Make sure the endpoint starts with api/ (without leading slash)
  if (!endpoint.startsWith('/api/') && !endpoint.startsWith('api/')) {
    endpoint = 'api/' + endpoint;
  } else if (endpoint.startsWith('/api/')) {
    // Remove leading slash for consistency
    endpoint = endpoint.substring(1);
  }
  
  return `${baseUrl}/${endpoint}`;
};

// Safe API request function
export const safeApiRequest = async (endpoint, options = {}) => {
  try {
    const apiUrl = safeConstructApiUrl(endpoint);
    const response = await fetch(apiUrl, options);
    return response;
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error;
  }
};

// Export a function to check if we're on GitHub Pages
export const isSafeGitHubPages = () => {
  return typeof window !== 'undefined' && 
    (window.location.hostname.includes('github.io') || 
     window.location.hostname === 'beenycool.github.io');
};

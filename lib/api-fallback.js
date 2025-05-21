"use client";

/**
 * API fallback helpers for handling GitHub Pages deployments
 * These functions provide a robust fallback mechanism in case the main API helper fails
 */

// DEFAULT BACKEND URL
const DEFAULT_BACKEND_URL = 'https://beenycool-github-io.onrender.com';

// Safely construct an API URL even if the main helper fails
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

// Safe API request function that handles GitHub Pages deployment
export const safeApiRequest = async (endpoint, options = {}) => {
  try {
    // Determine the URL
    let apiUrl;
    
    // Try different methods to get the API URL
    if (typeof window !== 'undefined' && typeof window.constructApiUrl === 'function') {
      apiUrl = window.constructApiUrl(endpoint);
    } else {
      apiUrl = safeConstructApiUrl(endpoint);
    }
    
    // Make the actual request
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

// Safe initialization function
export const safeFallbackInit = () => {
  if (typeof window !== 'undefined') {
    // Only set these if they don't already exist
    if (typeof window.constructApiUrl !== 'function') {
      window.constructApiUrl = safeConstructApiUrl;
      console.log('API fallback: Installed window.constructApiUrl');
    }
    
    if (typeof window.safeApiRequest !== 'function') {
      window.safeApiRequest = safeApiRequest;
      console.log('API fallback: Installed window.safeApiRequest');
    }
    
    // For GitHub Pages, ensure we have a backend status
    if (isSafeGitHubPages() && (!window.BACKEND_STATUS || window.BACKEND_STATUS.status !== 'online')) {
      window.BACKEND_STATUS = { 
        status: 'online', 
        lastChecked: new Date().toLocaleTimeString(),
        isGitHubPages: true,
        usingFallbacks: true
      };
      console.log('API fallback: Set BACKEND_STATUS for GitHub Pages');
    }
  }
};

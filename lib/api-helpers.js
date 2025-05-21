"use client";

/**
 * API helpers for handling static export GitHub Pages deployment
 */

// Try to import fallback helpers, but don't fail if import fails
let safeFallbackInit;
try {
  // We use a dynamic import here to avoid circular dependencies
  import('./api-fallback').then(module => {
    safeFallbackInit = module.safeFallbackInit;
  }).catch(err => {
    console.warn('Failed to import API fallbacks:', err);
  });
} catch (error) {
  console.warn('Failed to set up API fallback import:', error);
}

// Get the API base URL based on environment
export const getApiBaseUrl = () => {
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  return isLocalhost
    ? 'http://localhost:3003' // Local development
    : 'https://beenycool-github-io.onrender.com'; // Production URL
};

// Detect if we're running on GitHub Pages
export const isGitHubPages = () => {
  return typeof window !== 'undefined' && 
    (window.location.hostname.includes('github.io') || 
     window.location.hostname === 'beenycool.github.io');
};

// Construct API URL for different environments
export const constructApiUrl = (endpoint) => {
  const API_BASE_URL = getApiBaseUrl();

  // Make sure the endpoint starts with api/ (without leading slash)
  if (!endpoint.startsWith('/api/') && !endpoint.startsWith('api/')) {
    endpoint = 'api/' + endpoint;
  } else if (endpoint.startsWith('/api/')) {
    // Remove leading slash for consistency
    endpoint = endpoint.substring(1);
  }
  
  // When running on GitHub Pages, redirect ALL API calls to the backend server directly
  if (isGitHubPages()) {
    // For GitHub Pages, remove the 'api/' prefix from the endpoint
    // as the backend server might not expect it
    if (endpoint.startsWith('api/')) {
      endpoint = endpoint.substring(4); // Remove 'api/' prefix
    }
    return `${API_BASE_URL}/${endpoint}`;
  }
  
  // For local development or other environments, use normal construction
  return `${API_BASE_URL}/${endpoint}`;
};

// Initialize the API helpers in the global scope
export const initializeApiHelpers = () => {
  if (typeof window !== 'undefined') {
    try {
      window.constructApiUrl = constructApiUrl;
      window.isGitHubPages = isGitHubPages;
      window.API_BASE_URL = getApiBaseUrl();
      
      // For GitHub Pages, set up additional helpers
      if (isGitHubPages()) {
        // Set local storage flag for GitHub Pages mode
        window.localStorage.setItem('USE_LOCAL_API', 'true');
        
        // Set up backend status for GitHub Pages
        window.BACKEND_STATUS = { 
          status: 'online', 
          lastChecked: new Date().toLocaleTimeString(),
          isGitHubPages: true,
          usingRemoteAPI: true
        };
        
        console.log('GitHub Pages mode activated - API calls will be redirected to backend');
      }
      
      console.log(`API helpers initialized: ${getApiBaseUrl()}, GitHub Pages: ${isGitHubPages()}`);
      
      // Return success
      return true;
    } catch (error) {
      console.error('Error initializing API helpers:', error);
      
      // Try to load fallback implementation if available
      try {
        if (typeof safeFallbackInit === 'function') {
          safeFallbackInit();
          console.log('API helpers fallback initialized');
          return true;
        }
      } catch (fallbackError) {
        console.error('Failed to initialize API helpers fallback:', fallbackError);
      }
      
      return false;
    }
  }
  
  return false;
};

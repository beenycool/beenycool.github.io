"use client";

/**
 * API helpers for handling static export GitHub Pages deployment
 */

// DEFAULT BACKEND URL - Move this to the top level
const DEFAULT_BACKEND_URL = 'https://beenycool-github-io.onrender.com';

// Get the API base URL based on environment - Don't rely on other imports
export const getApiBaseUrl = () => {
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  return isLocalhost
    ? 'http://localhost:3003' // Local development
    : DEFAULT_BACKEND_URL; // Production URL
};

// Detect if we're running on GitHub Pages - Don't rely on other imports
export const isGitHubPages = () => {
  return typeof window !== 'undefined' && 
    (window.location.hostname.includes('github.io') || 
     window.location.hostname === 'beenycool.github.io');
};

// Construct API URL for different environments - Don't rely on other imports
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
      // Set the helper functions on window
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
      
      // Create simple fallback helpers directly here, rather than importing them
      try {
        // Only set these if they don't already exist
        if (typeof window.constructApiUrl !== 'function') {
          window.constructApiUrl = (endpoint) => {
            // Simple implementation
            const baseUrl = DEFAULT_BACKEND_URL;
            if (!endpoint.startsWith('/') && !endpoint.startsWith('api/')) {
              endpoint = 'api/' + endpoint;
            } else if (endpoint.startsWith('/api/')) {
              endpoint = endpoint.substring(1);
            }
            return `${baseUrl}/${endpoint}`;
          };
        }
        
        if (isGitHubPages() && (!window.BACKEND_STATUS || window.BACKEND_STATUS.status !== 'online')) {
          window.BACKEND_STATUS = { 
            status: 'online', 
            lastChecked: new Date().toLocaleTimeString(),
            isGitHubPages: true,
            usingFallbacks: true
          };
        }
        
        console.log('API helpers fallbacks initialized');
        return true;
      } catch (fallbackError) {
        console.error('Failed to initialize API fallbacks:', fallbackError);
        return false;
      }
    }
  }
  return false;
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
      apiUrl = constructApiUrl(endpoint);
    }
    
    // Make the actual request
    const response = await fetch(apiUrl, options);
    return response;
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error;
  }
};

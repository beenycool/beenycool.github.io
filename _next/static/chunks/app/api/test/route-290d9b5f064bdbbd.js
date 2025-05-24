(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[450],{

/***/ 2452:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AW: () => (/* binding */ initializeApiHelpers),
/* harmony export */   constructApiUrl: () => (/* binding */ constructApiUrl),
/* harmony export */   getApiBaseUrl: () => (/* binding */ getApiBaseUrl),
/* harmony export */   sC: () => (/* binding */ isGitHubPages)
/* harmony export */ });
/* unused harmony export safeApiRequest */
/* __next_internal_client_entry_do_not_use__ getApiBaseUrl,isGitHubPages,constructApiUrl,safeApiRequest,initializeApiHelpers auto */ /**
 * API helpers for handling static export GitHub Pages deployment
 */ // DEFAULT BACKEND URL - Move this to the top level
const DEFAULT_BACKEND_URL = 'https://beenycool-github-io.onrender.com';
// Get the API base URL based on environment
function getApiBaseUrl() {
    const isLocalhost =  true && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    return isLocalhost ? 'http://localhost:3000' // Local development
     : 'https://beenycool-github-io.onrender.com'; // Production URL
}
;
// Detect if we're running on GitHub Pages
const isGitHubPages = ()=>{
    return  true && (window.location.hostname.includes('github.io') || window.location.hostname === 'beenycool.github.io');
};
// Construct API URL for different environments
const constructApiUrl = (endpoint)=>{
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
        return "".concat(API_BASE_URL, "/").concat(endpoint);
    }
    // For local development or other environments, use normal construction
    return "".concat(API_BASE_URL, "/").concat(endpoint);
};
// Safe API request function that handles GitHub Pages deployment
const safeApiRequest = async function(endpoint) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    try {
        // Determine the URL
        let apiUrl;
        // Try different methods to get the API URL
        if ( true && typeof window.constructApiUrl === 'function') {
            apiUrl = window.constructApiUrl(endpoint);
        } else {
            apiUrl = constructApiUrl(endpoint);
        }
        // Make the actual request
        const response = await fetch(apiUrl, options);
        return response;
    } catch (error) {
        console.error("API request to ".concat(endpoint, " failed:"), error);
        throw error;
    }
};
// Initialize the API helpers in the global scope
const initializeApiHelpers = ()=>{
    if (true) {
        try {
            // Ensure basic objects exist first
            window.aV = window.aV || {};
            window.API_HELPERS = window.API_HELPERS || {};
            window.BACKEND_STATUS = window.BACKEND_STATUS || {
                status: 'checking'
            };
            // Set the helper functions on window
            window.constructApiUrl = constructApiUrl;
            window.isGitHubPages = isGitHubPages;
            window.API_BASE_URL = getApiBaseUrl();
            // For GitHub Pages, set up additional helpers
            if (isGitHubPages()) {
                // Set local storage flag for GitHub Pages mode
                try {
                    window.localStorage.setItem('USE_LOCAL_API', 'true');
                } catch (storageError) {
                    console.warn('Could not set localStorage item:', storageError);
                }
                // Set up backend status for GitHub Pages
                window.BACKEND_STATUS = {
                    status: 'online',
                    lastChecked: new Date().toLocaleTimeString(),
                    isGitHubPages: true,
                    usingRemoteAPI: true
                };
                console.log('GitHub Pages mode activated - API calls will be redirected to backend');
            }
            console.log("Using API URL: ".concat(getApiBaseUrl(), ", GitHub Pages: ").concat(isGitHubPages()));
            // Return success
            return true;
        } catch (error) {
            console.error('Error initializing API helpers:', error);
            // Create simple fallback helpers directly here, rather than importing them
            try {
                // Ensure basic objects exist
                window.aV = window.aV || {};
                window.API_HELPERS = window.API_HELPERS || {};
                // Only set these if they don't already exist
                if (typeof window.constructApiUrl !== 'function') {
                    window.constructApiUrl = (endpoint)=>{
                        // Simple implementation
                        const baseUrl = DEFAULT_BACKEND_URL;
                        if (!endpoint.startsWith('/') && !endpoint.startsWith('api/')) {
                            endpoint = 'api/' + endpoint;
                        } else if (endpoint.startsWith('/api/')) {
                            endpoint = endpoint.substring(1);
                        }
                        return "".concat(baseUrl, "/").concat(endpoint);
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
                console.error('Failed to initialize API helpers fallback:', fallbackError);
                // Last resort: ensure the basic objects exist
                if (true) {
                    window.aV = window.aV || {};
                    window.API_HELPERS = window.API_HELPERS || {};
                }
            }
            return false;
        }
    }
    return false;
};


/***/ }),

/***/ 8425:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 2452));


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, [315,358], () => (__webpack_exec__(8425)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);
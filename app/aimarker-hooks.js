"use client";

import { useCallback, useRef, useEffect } from 'react';
import debounce from 'lodash.debounce';

// Properly defined hooks with clean function context
export const useSubjectDetection = (subjectKeywords, loading) => {
  // Hook to classify subject from text
  const classifySubjectAI = useCallback(async (answerText) => {
    if (!answerText || answerText.length < 20) return null;
    
    try {
      // Use keyword detection for subject classification
      for (const [subject, keywords] of Object.entries(subjectKeywords)) {
        for (const keyword of keywords) {
          if (answerText.toLowerCase().includes(keyword.toLowerCase())) {
            return subject;
          }
        }
      }
      
      return null;
    } catch (err) {
      console.error("Subject classification error:", err);
      return null;
    }
  }, [subjectKeywords]);

  // Create a ref to store the debounced function
  // This way, the same function instance persists across renders
  const debouncedFnRef = useRef(null);

  // Initialize the debounced function on mount or when dependencies change
  useEffect(() => {
    debouncedFnRef.current = debounce(async (text, subject, hasManuallySetSubject, allSubjects, setSubject, setDetectedSubject, setSuccess) => {
      if (loading) return; // Don't run while loading
      
      const detected = await classifySubjectAI(text);
      if (detected && detected !== subject && !hasManuallySetSubject.current) {
        // Store the previous subject to show a nice transition
        const prevSubject = allSubjects.find(s => s.value === subject)?.label || '';
        const newSubject = allSubjects.find(s => s.value === detected)?.label || '';
        
        setSubject(detected);
        setDetectedSubject(detected);
        
        // Show a success message with nice animation
        setSuccess({
          message: `Subject automatically detected as ${newSubject}`,
          detail: prevSubject ? `Changed from ${prevSubject}` : null,
          icon: 'detection'
        });
        
        setTimeout(() => setSuccess(null), 3000);
      }
    }, 1000);

    // Cleanup debounced function on unmount or before recreation
    return () => {
      if (debouncedFnRef.current) {
        debouncedFnRef.current.cancel();
      }
    };
  }, [classifySubjectAI, loading, subjectKeywords]);

  // Wrapper function that calls the current debounced function
  const debouncedClassifySubject = useCallback((...args) => {
    if (debouncedFnRef.current) {
      return debouncedFnRef.current(...args);
    }
  }, []);

  return { classifySubjectAI, debouncedClassifySubject };
};

// Backend status checker hook
export const useBackendStatus = (API_BASE_URL) => {
  const checkBackendStatus = useCallback(async (model) => {
    try {
      // Special case for GitHub Pages to always show the UI
      if (typeof window !== 'undefined' && 
          (window.location.hostname.includes('github.io') || 
           window.location.hostname === 'beenycool.github.io')) {
        console.log('Running on GitHub Pages - simulating online status for UI rendering');
        
        // Enable local API fallbacks when on GitHub Pages
        if (typeof window !== 'undefined') {
          try {
            // Set environment variable to use local API handlers
            window.localStorage.setItem('USE_LOCAL_API', 'true');
            
            // Don't try to create middleware endpoints on GitHub Pages
            // GitHub Pages can't handle POST requests (static hosting only)
          } catch (e) {
            console.warn('Failed to set up local API fallbacks:', e);
          }
          
          window.BACKEND_STATUS = { 
            status: 'online', 
            lastChecked: new Date().toLocaleTimeString(),
            isGitHubPages: true,
            usingLocalFallbacks: true
          };
        }
        
        return { 
          ok: true, 
          data: { 
            status: 'ok', 
            openaiClient: true, 
            apiKeyConfigured: true,
            isGitHubPages: true,
            usingLocalFallbacks: true
          },
          status: 'online'
        };
      }

      let retryCount = 0;
      const maxRetries = 3; // Try up to 4 times total (initial + 3 retries)
      
      while (retryCount <= maxRetries) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 12000); // Increased timeout to 12 seconds
          
                    // Use the constructApiUrl function if available
          const isGitHubPagesEnv = typeof window !== 'undefined' && 
            (window.location.hostname.includes('github.io') || window.location.hostname === 'beenycool.github.io');
          
          // Direct URL for GitHub Pages, otherwise use constructApiUrl
          const healthEndpoint = isGitHubPagesEnv
            ? `${API_BASE_URL}/health`
            : (typeof window !== 'undefined' && window.constructApiUrl 
                ? window.constructApiUrl('health')
                : `${API_BASE_URL}/api/health`);                    console.log(`Checking backend health at ${healthEndpoint}`);                    const response = await fetch(`${healthEndpoint}?timestamp=${Date.now()}`, {            method: 'GET',            signal: controller.signal,            mode: 'cors',            headers: {              'Cache-Control': 'no-cache, no-store, must-revalidate',              'Pragma': 'no-cache',              'Expires': '0'            }          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`Backend health check failed: ${response.status}`);
          }
          
          const data = await response.json();
          
          console.log('Backend health check data:', data);
          
          // Check if any model is available
          if (data.openaiClient !== true || data.apiKeyConfigured !== true) {
            return { 
              ok: false, 
              error: 'The backend API service is not properly configured. Please try again later.',
              status: 'error',
              data
            };
          }
          
          // Check if the selected model is available (if provided)
          if (model) {
            // Check for rate limiting or model availability
            if (model === "gemini-2.5-flash-preview-05-20" && data.rateLimited === true) {
              return {
                ok: false,
                error: 'Gemini 2.5 Flash Preview is rate limited. Please try again in a minute or choose another model.',
                status: 'rate_limited',
                data
              };
            }
          }
          
          return { 
            ok: true, 
            data,
            status: 'online' 
          };
        } catch (error) {
          if (retryCount === maxRetries) {
            // Don't retry if we've hit max retries, just throw the error
            throw error;
          }
          
          const waitTime = 2000 * (retryCount + 1); // Progressive backoff
          console.log(`Retry attempt ${retryCount + 1} for backend health check in ${waitTime}ms`);
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retryCount++;
        }
      }
    } catch (error) {
      console.error("Backend health check failed:", error);
      
      let errorMessage = error.message;
      let status = 'error';
      
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        errorMessage = 'Backend did not respond in time. The server may take up to 50 seconds to wake up.';
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Network connection to backend failed. Please check your internet connection and try again in a moment.';
        status = 'network';
      }
      
      return { 
        ok: false, 
        error: errorMessage,
        status
      };
    }
  }, [API_BASE_URL]);

  return { checkBackendStatus };
}; 
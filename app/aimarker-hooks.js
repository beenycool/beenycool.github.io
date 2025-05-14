"use client";

import { useCallback } from 'react';
import debounce from 'lodash.debounce';

// Fix 1: Move global hooks into a proper React function context
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

  // Debounced version of the classification function
  const debouncedClassifySubject = useCallback(
    debounce(async (text, subject, hasManuallySetSubject, allSubjects, setSubject, setDetectedSubject, setSuccess) => {
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
    }, 1000),
    [classifySubjectAI, loading]
  );

  return { classifySubjectAI, debouncedClassifySubject };
};

// Fix 2: Extracting backend status checker logic
export const useBackendStatus = (API_BASE_URL) => {
  const checkBackendStatus = useCallback(async (model) => {
    try {
      let retryCount = 0;
      const maxRetries = 3; // Try up to 4 times total (initial + 3 retries)
      
      while (retryCount <= maxRetries) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 12000); // Increased timeout to 12 seconds
          
          console.log(`Checking backend health at ${API_BASE_URL}/api/health`);
          
          const response = await fetch(`${API_BASE_URL}/api/health?timestamp=${Date.now()}`, {
            method: 'GET',
            signal: controller.signal,
            mode: 'cors',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          
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
            if (model === "google/gemini-2.5-pro-exp-03-25" && data.rateLimited === true) {
              return {
                ok: false,
                error: 'Gemini 2.5 Pro is rate limited. Please try again in a minute or choose another model.',
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
      
      if (error.name === 'AbortError') {
        errorMessage = 'Backend did not respond in time. Render\'s free tier servers may take up to 50 seconds to wake up.';
        status = 'timeout';
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
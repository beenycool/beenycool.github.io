'use client';

import { useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';

/**
 * SessionRecorder - Records user activity and screen captures
 * This component is invisible and should be included in layout components
 */
// Debounce helper function (moved outside the component)
function debounce(func, wait) {
  let timeout;
  const debouncedFunction = function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
  
  // Add cancel method to the debounced function
  debouncedFunction.cancel = function() {
    if (timeout) {
      clearTimeout(timeout);
    }
  };
  
  return debouncedFunction;
}

const SessionRecorder = () => {
  // Use refs for critical values
  const sessionIdRef = useRef(null);
  const lastCaptureTimeRef = useRef(0);
  const captureIntervalRef = useRef(null);
  const initializedRef = useRef(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  // Log user event
  const logEvent = useCallback(async (eventType, details) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      await axios.post(`${API_URL}/auth/record-event`, {
        sessionId: sessionIdRef.current,
        eventType,
        details,
        url: window.location.href
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error logging event:', error);
    }
  }, [API_URL, sessionIdRef]);

  // Capture screen with improved error handling and lazy loading
  const captureScreen = useCallback(async (eventType = 'periodic') => {
    // Check essential conditions first
    if (!initializedRef.current || !sessionIdRef.current) {
      console.debug('Session not initialized yet, skipping screen capture');
      return;
    }
    
    try {
      // Check for authentication
      if (typeof window === 'undefined' || typeof document === 'undefined') return;
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      // Update last capture time 
      lastCaptureTimeRef.current = Date.now();
      
      // Create a screenshot using html2canvas with lazy loading
      try {
        // Check if document is ready
        if (document.readyState !== 'complete') {
          console.debug('Document not ready, deferring screen capture');
          return;
        }
        
        // Check for html2canvas availability with dynamic import
        let html2canvas;
        
        if (window.html2canvas) {
          html2canvas = window.html2canvas;
        } else {
          // Attempt dynamic import with timeout to prevent hanging
          const importPromise = import('html2canvas').then(mod => mod.default);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('html2canvas import timeout')), 5000)
          );
          
          html2canvas = await Promise.race([importPromise, timeoutPromise]);
        }
        
        if (!html2canvas) {
          console.error('html2canvas not available');
          return;
        }
        
        // Perform the actual screenshot with optimized options
        const canvas = await html2canvas(document.body, {
          scale: 0.35, // Reduced scale for better performance
          logging: false,
          useCORS: true,
          foreignObjectRendering: false, // Disable for better compatibility
          ignoreElements: (element) => {
            // Expanded list of elements to ignore
            return element.classList?.contains('no-capture') ||
                  element.tagName === 'INPUT' ||
                  element.tagName === 'TEXTAREA' ||
                  element.getAttribute('type') === 'password' ||
                  element.classList?.contains('private') ||
                  element.id?.includes('password');
          },
          onclone: (clonedDoc) => {
            // Additional processing on the cloned document
            try {
              // Remove sensitive elements from clone
              const sensitiveElements = clonedDoc.querySelectorAll('input[type="password"], .sensitive-data');
              sensitiveElements.forEach(el => el.remove());
            } catch (e) {
              // Ignore errors in document processing
            }
          }
        });
        
        // Convert to data URL (compressed JPEG)
        const imageData = canvas.toDataURL('image/jpeg', 0.4); // Lower quality for smaller size
        
        // Send to server with timeout protection
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        try {
          await axios.post(`${API_URL}/auth/record-screen`, {
            sessionId: sessionIdRef.current,
            imageData,
            pageUrl: window.location.href,
            eventTriggered: eventType,
            timestamp: Date.now()
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            },
            signal: controller.signal
          });
        } catch (axiosError) {
          if (axiosError.name === 'AbortError' || axiosError.code === 'ECONNABORTED') {
            console.warn('Screen capture upload timed out');
          } else {
            throw axiosError;
          }
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (captureError) {
        console.error('Failed during screen capture process:', captureError);
      }
    } catch (error) {
      console.error('Error in capture screen:', error);
    }
  }, [API_URL]);

  // Handle clicks with improved null checking and error handling
  const handleClick = useCallback((e) => {
    if (!initializedRef.current || !sessionIdRef.current) return;
    
    try {
      // Safely check the event and target
      if (!e || !e.target) return;
      
      const target = e.target;
      
      // Don't capture every click, only meaningful interactions like buttons
      // Using optional chaining and type checking for enhanced safety
      if ((target?.tagName === 'BUTTON' ||
          target?.tagName === 'A' ||
          (target?.closest && (target.closest('button') || target.closest('a'))) ||
          target?.getAttribute?.('role') === 'button')) {
        
        // Get element info with null checks
        const elementInfo = {
          tagName: target.tagName || 'unknown',
          id: target.id || '',
          // Convert className to string if it's an object (SVGAnimatedString, etc.)
          className: typeof target.className === 'string' ? 
                    target.className : 
                    (target.className?.baseVal || ''),
          text: target.innerText?.substring(0, 50) || 
                target.textContent?.substring(0, 50) || ''
        };
        
        // Add additional context when available
        if (target.getAttribute('data-testid')) {
          elementInfo.testId = target.getAttribute('data-testid');
        }
        
        if (target.getAttribute('aria-label')) {
          elementInfo.ariaLabel = target.getAttribute('aria-label');
        }
        
        // Log the event with a small delay to prevent race conditions
        setTimeout(() => {
          logEvent('click', elementInfo);
        }, 0);
        
        // Capture screen on significant interactions, but with rate limiting
        if (Date.now() - lastCaptureTimeRef.current > 10000) { // If last capture was >10s ago
          // Slightly delay the capture to ensure the UI has updated
          setTimeout(() => {
            captureScreen('click');
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error in click handler:', error);
    }
  }, [logEvent, captureScreen]);
  
  // Memoized debounced function for input handling
  const debouncedActualInputHandler = useMemo(
    () =>
      debounce((e) => {
        const target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
          const elementInfo = {
            tagName: target.tagName,
            id: target.id,
            className: target.className,
            type: target.type,
            name: target.name,
          };
          // Don't log values for sensitive fields
          if (target.type !== 'password' && target.type !== 'email' && !target.name.includes('password')) {
            elementInfo.value = target.type === 'text' ? '(text entered)' : target.value;
          }
          logEvent('input', elementInfo); // logEvent is from outer scope
        }
      }, 1000),
    [logEvent] // Dependency: logEvent
  );

  // useCallback for the event listener, calling the memoized debounced handler
  const handleInput = useCallback(
    (e) => {
      debouncedActualInputHandler(e);
    },
    [debouncedActualInputHandler] // Dependency: the memoized debounced handler
  );

  // Initialize session recording - split into two separate effects for better initialization control
  // First effect: Only set up the session ID once
  useEffect(() => {
    try {
      // Only run once
      if (initializedRef.current) return;
      
      // Check for authentication
      if (typeof window === 'undefined') return;
      
      const token = localStorage.getItem('authToken');
      if (!token) return; // Only record authenticated sessions
      
      // Generate a unique session ID if one doesn't exist
      if (!sessionIdRef.current) {
        // Use a safer approach for generating UUID
        if (window.crypto && typeof window.crypto.randomUUID === 'function') {
          sessionIdRef.current = window.crypto.randomUUID();
        } else {
          sessionIdRef.current = Math.random().toString(36).substring(2, 15) + 
                                Math.random().toString(36).substring(2, 15);
        }
      }
      
      initializedRef.current = true;
    } catch (error) {
      console.error('Error setting up session ID:', error);
    }
  }, []);

  // Second effect: Set up event listeners and timers after session ID is initialized
  useEffect(() => {
    // SafeExec - helper to safely execute functions
    const safeExec = (fn) => {
      try {
        return fn();
      } catch (err) {
        console.error('Error in session recorder:', err);
        return null;
      }
    };
    
    // Only proceed if we're in browser context and session is initialized
    if (typeof window === 'undefined' || !initializedRef.current) return;
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return; // Only record authenticated sessions
      
      // Record page navigation first (doesn't depend on other initializations)
      safeExec(() => {
        logEvent('navigation', {
          url: window.location.href,
          title: document.title,
          referrer: document.referrer
        });
      });
      
      // Set up timer for screen captures with a delay
      const captureTimerSetup = setTimeout(() => {
        // Set up periodic capture
        captureIntervalRef.current = setInterval(() => {
          safeExec(() => captureScreen('periodic'));
        }, 60000); // Capture every minute
        
        // Initial capture with a delay to ensure DOM is fully loaded
        const initialCaptureTimer = setTimeout(() => {
          safeExec(() => captureScreen('initial'));
        }, 3000);
        
        return () => clearTimeout(initialCaptureTimer);
      }, 1000);
      
      // Set up event listeners
      safeExec(() => {
        window.addEventListener('click', handleClick);
        window.addEventListener('input', handleInput);
      });
      
      // Clean up function
      return () => {
        safeExec(() => {
          clearTimeout(captureTimerSetup);
          
          if (captureIntervalRef.current) {
            clearInterval(captureIntervalRef.current);
          }
          
          window.removeEventListener('click', handleClick);
          window.removeEventListener('input', handleInput);
          
          if (debouncedActualInputHandler && typeof debouncedActualInputHandler.cancel === 'function') {
            debouncedActualInputHandler.cancel();
          }
        });
      };
    } catch (error) {
      console.error('Error initializing session recorder:', error);
      return () => {}; // Return empty cleanup function
    }
  }, [captureScreen, handleClick, handleInput, logEvent, debouncedActualInputHandler]);
  
  // This component doesn't render anything
  return null;
};

export default SessionRecorder; 
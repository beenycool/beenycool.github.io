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
  const sessionIdRef = useRef(null);
  const lastCaptureTimeRef = useRef(0);
  const captureIntervalRef = useRef(null);
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

  // Capture screen
  const captureScreen = useCallback(async (eventType = 'periodic') => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      // Update last capture time
      lastCaptureTimeRef.current = Date.now();
      
      // Create a screenshot using html2canvas - use dynamic import to ensure it's loaded
      if (typeof window !== 'undefined') {
        // Check if html2canvas is available
        try {
          // Use the global instance if available, otherwise try to dynamically import it
          const html2canvas = window.html2canvas || await import('html2canvas').then(mod => mod.default);
          
          const canvas = await html2canvas(document.body, {
            scale: 0.5, // Scale down for performance and file size
            logging: false,
            useCORS: true,
            ignoreElements: (element) => {
              // Ignore elements with sensitive data
              return element.classList.contains('no-capture') ||
                    element.tagName === 'INPUT' ||
                    element.tagName === 'TEXTAREA';
            }
          });
          
          // Convert to data URL (compressed JPEG)
          const imageData = canvas.toDataURL('image/jpeg', 0.5);
          
          // Send to server
          await axios.post(`${API_URL}/auth/record-screen`, {
            sessionId: sessionIdRef.current,
            imageData,
            pageUrl: window.location.href,
            eventTriggered: eventType
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (importError) {
          console.error('Failed to load html2canvas:', importError);
        }
      }
    } catch (error) {
      console.error('Error capturing screen:', error);
    }
  }, [API_URL]);

  // Handle clicks
  const handleClick = useCallback((e) => {
    // Don't capture every click, only meaningful interactions like buttons
    const target = e.target;
    if (target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.role === 'button') {
      
      // Get element info
      const elementInfo = {
        tagName: target.tagName,
        id: target.id,
        className: target.className,
        text: target.innerText?.substring(0, 50) || ''
      };
      
      logEvent('click', elementInfo);
      
      // Capture screen on significant interactions
      if (Date.now() - lastCaptureTimeRef.current > 10000) { // If last capture was >10s ago
        captureScreen('click');
      }
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

  // Initialize session recording
  useEffect(() => {
    // Wrap initialization in a try-catch to prevent any potential errors from crashing the app
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return; // Only record authenticated sessions
      
      // Generate a unique session ID if one doesn't exist
      if (!sessionIdRef.current) {
        // Use a safer approach for generating UUID
        if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
          sessionIdRef.current = window.crypto.randomUUID();
        } else {
          sessionIdRef.current = Math.random().toString(36).substring(2, 15) + 
                                 Math.random().toString(36).substring(2, 15);
        }
      }
      
      // Start capture interval with a slight delay to ensure everything is initialized
      setTimeout(() => {
        captureIntervalRef.current = setInterval(() => {
          try {
            captureScreen();
          } catch (e) {
            console.error('Error in scheduled capture:', e);
          }
        }, 60000); // Capture every minute
        
        // Initial capture (with a small delay)
        setTimeout(() => {
          try {
            captureScreen();
          } catch (e) {
            console.error('Error in initial capture:', e);
          }
        }, 3000);
      }, 1000);
      
      // Record page navigation
      logEvent('navigation', {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer
      });
      
      // Set up event listeners
      window.addEventListener('click', handleClick);
      window.addEventListener('input', handleInput);
      
      // Clean up on unmount
      return () => {
        if (captureIntervalRef.current) {
          clearInterval(captureIntervalRef.current);
        }
        window.removeEventListener('click', handleClick);
        window.removeEventListener('input', handleInput);
        if (debouncedActualInputHandler && typeof debouncedActualInputHandler.cancel === 'function') {
          debouncedActualInputHandler.cancel();
        }
      };
    } catch (error) {
      console.error('Error initializing session recorder:', error);
    }
  }, [captureScreen, handleClick, handleInput, logEvent, API_URL, debouncedActualInputHandler]);
  
  // This component doesn't render anything
  return null;
};

export default SessionRecorder; 
'use client';

import { useEffect, useRef } from 'react';
import axios from 'axios';

/**
 * SessionRecorder - Records user activity and screen captures
 * This component is invisible and should be included in layout components
 */
const SessionRecorder = () => {
  const sessionIdRef = useRef(null);
  const lastCaptureTimeRef = useRef(0);
  const captureIntervalRef = useRef(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  
  // Initialize session recording
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return; // Only record authenticated sessions
    
    // Generate a unique session ID if one doesn't exist
    if (!sessionIdRef.current) {
      sessionIdRef.current = crypto.randomUUID ? crypto.randomUUID() : 
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    
    // Start capture interval
    captureIntervalRef.current = setInterval(captureScreen, 60000); // Capture every minute
    
    // Initial capture
    captureScreen();
    
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
      clearInterval(captureIntervalRef.current);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('input', handleInput);
    };
  }, []);
  
  // Handle clicks
  const handleClick = (e) => {
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
  };
  
  // Handle inputs (debounced)
  const handleInput = debounce((e) => {
    // Get element info but sanitize sensitive data
    const target = e.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
      const elementInfo = {
        tagName: target.tagName,
        id: target.id,
        className: target.className,
        type: target.type,
        name: target.name
      };
      
      // Don't log values for sensitive fields
      if (target.type !== 'password' && target.type !== 'email' && !target.name.includes('password')) {
        elementInfo.value = target.type === 'text' ? 
          '(text entered)' : // Don't record actual text content
          target.value;
      }
      
      logEvent('input', elementInfo);
    }
  }, 1000);
  
  // Capture screen
  const captureScreen = async (eventType = 'periodic') => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      // Update last capture time
      lastCaptureTimeRef.current = Date.now();
      
      // Create a screenshot using html2canvas
      if (typeof window !== 'undefined' && window.html2canvas) {
        const canvas = await window.html2canvas(document.body, {
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
      }
    } catch (error) {
      console.error('Error capturing screen:', error);
    }
  };
  
  // Log user event
  const logEvent = async (eventType, details) => {
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
  };
  
  // Debounce helper function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // This component doesn't render anything
  return null;
};

export default SessionRecorder; 
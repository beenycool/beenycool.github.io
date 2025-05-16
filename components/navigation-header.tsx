"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavigationHeader() {
  const [showDebugLink, setShowDebugLink] = useState(false);
  const pathname = usePathname();
  
  // Initialize from localStorage
  useEffect(() => {
    const savedValue = localStorage.getItem('showDebugLink');
    if (savedValue === 'true') {
      setShowDebugLink(true);
    }
  }, []);
  
  // Listen for Ctrl+Shift+D to show/hide debug link
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'd') {
        e.preventDefault();
        setShowDebugLink(prev => {
          const newValue = !prev;
          localStorage.setItem('showDebugLink', newValue.toString());
          return newValue;
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // If we're already on the debug page, always show the home link
  const isDebugPage = pathname === '/debug';
  
  // Only render the nav if debug link should be shown or we're on the debug page
  if (!showDebugLink && !isDebugPage) {
    return null;
  }
  
  return (
    <nav className="fixed top-2 right-2 z-50 bg-background/80 backdrop-blur-sm rounded-md shadow-sm px-2 py-1 border border-border">
      <ul className="flex items-center gap-2 text-xs">
        {isDebugPage && (
          <li>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
        )}
        {(showDebugLink || isDebugPage) && (
          <li>
            <Link 
              href="/debug" 
              className={`${isDebugPage ? 'text-primary' : 'text-muted-foreground hover:text-foreground'} transition-colors`}
            >
              Debug
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
} 
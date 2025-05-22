'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAnalytics } from '../hooks/useAnalytics';

// Create a wrapper component to handle useSearchParams
const LoginContent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const analytics = useAnalytics();
  
  // API base URL - updated to handle GitHub Pages deployment
  const API_URL = (() => {
    if (typeof window !== 'undefined') {
      // Check if we're in a GitHub Pages environment
      const isGitHubPages = window.location.hostname.includes('github.io');
      
      if (isGitHubPages) {
        // Use the Render backend URL for GitHub Pages
        return 'https://beenycool-github-io.onrender.com/api';
      }
    }
    
    // For local development or other environments, use the environment variable or default
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  })();
  
  // Track page view
  useEffect(() => {
    analytics.trackPageView('login_page');
  }, [analytics]);
  
  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      router.push(redirect);
    }
  }, [router, redirect]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (error) setError(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Validate form
      if (!formData.username || !formData.password) {
        setError('Username and password are required');
        setLoading(false);
        return;
      }
      
      if (!isLogin && !formData.email) {
        setError('Email is required for registration');
        setLoading(false);
        return;
      }
      
      console.log('Attempting authentication with API URL:', API_URL); // Debug log
      
      const endpoint = isLogin ? `${API_URL}/auth/login` : `${API_URL}/auth/register`;
      
      // Track authentication attempt
      analytics.trackEvent(isLogin ? 'login_attempt' : 'registration_attempt', {
        username: formData.username,
      });
      
      const response = await axios.post(endpoint, formData);
      
      // If successful, store token and redirect
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token);
        
        // Track successful authentication
        analytics.trackEvent(isLogin ? 'login_success' : 'registration_success', {
          username: formData.username,
          userId: response.data.user?.id,
        });
        
        // Identify the user in PostHog
        if (response.data.user) {
          analytics.identifyUser(response.data.user.id, {
            username: response.data.user.username,
            role: response.data.user.role,
          });
        }
        
        if (isLogin) {
          // For admin redirects, use window.location.href to force a full page reload
          if (redirect.includes('/admin')) {
            window.location.href = '/admin';
          } else {
            router.push(redirect);
          }
        } else {
          // For registration, show success message then redirect to login
          setSuccess(true);
          setIsLogin(true);
          setFormData({
            ...formData,
            password: ''
          });
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccess(false);
          }, 3000);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Authentication error:', err);
      
      // More detailed error handling
      let errorMessage = 'An error occurred. Please try again.';
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = err.response.data.message || errorMessage;
        console.error('Error response:', err.response.data);
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please try again later.';
        console.error('No response received:', err.request);
      }
      
      // Track authentication failure
      analytics.trackEvent(isLogin ? 'login_failure' : 'registration_failure', {
        username: formData.username,
        error: errorMessage,
      });
      
      setError(errorMessage);
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? (
              <>
                Or{' '}
                <button 
                  className="font-medium text-blue-600 hover:text-blue-500"
                  onClick={() => setIsLogin(false)}
                >
                  create a new account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button 
                  className="font-medium text-blue-600 hover:text-blue-500"
                  onClick={() => setIsLogin(true)}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
        
        {/* Success message */}
        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Registration successful! You can now log in.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            
            {!isLogin && (
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required={!isLogin}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            )}
            
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${isLogin ? 'rounded-b-md' : ''} focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              {isLogin ? (loading ? 'Signing in...' : 'Sign in') : (loading ? 'Creating account...' : 'Create account')}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
                Back to home
              </Link>
            </div>
            
            {isLogin && (
              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// Loading fallback for Suspense
const LoginFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <p className="mt-2 text-gray-600">Loading...</p>
    </div>
  </div>
);

// Main component with Suspense
const LoginPage = () => {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage; 
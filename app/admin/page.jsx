'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Components
import DashboardStats from './components/DashboardStats';
import ActiveSessions from './components/ActiveSessions';
import UserTable from './components/UserTable';
import SessionViewer from './components/SessionViewer';
import Leaderboards from './components/Leaderboards';
import GuildManager from './components/GuildManager';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [activeSessions, setActiveSessions] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [timeRange, setTimeRange] = useState(7); // 7 days default
  
  const router = useRouter();
  
  // API base URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  
  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      router.push('/login?redirect=/admin');
      return;
    }
    
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(`${API_URL}/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const userData = response.data.user;
        
        if (userData.role !== 'admin') {
          setError('Access denied. Admin permissions required.');
          router.push('/');
          return;
        }
        
        setUser(userData);
        setLoading(false);
      } catch (err) {
        console.error('Auth error:', err);
        
        setError('Authentication failed. Please log in again.');
        localStorage.removeItem('authToken');
        router.push('/login?redirect=/admin');
      }
    };
    
    checkAuth();
  }, [router, API_URL]);
  
  // Load dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await axios.get(`${API_URL}/admin/dashboard?days=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setDashboardData(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  }, [API_URL, timeRange]);
  
  // Load active sessions
  const fetchActiveSessions = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await axios.get(`${API_URL}/admin/sessions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setActiveSessions(response.data.sessions);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching active sessions:', err);
      setError('Failed to load active sessions');
      setLoading(false);
    }
  }, [API_URL]);
  
  // Load users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUsers(response.data.users);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
      setLoading(false);
    }
  }, [API_URL]);
  
  // When tab changes, load the required data
  useEffect(() => {
    if (!user) return; // Don't fetch if user is not authenticated

    // setLoading(true); // Consider setting loading true at the start of data fetching for a tab

    const loadTabData = async () => {
      try {
        switch (activeTab) {
          case 'dashboard':
            await fetchDashboardData();
            break;
          case 'sessions':
            await fetchActiveSessions();
            break;
          case 'users':
            await fetchUsers();
            break;
          // Add cases for 'leaderboards' and 'guilds' if they fetch data this way
          // For now, they seem to handle their own data fetching internally via API_URL prop
          default:
            break;
        }
      } catch (tabError) {
        // It's generally better for individual fetch functions to handle their own errors
        // and set specific error messages. This is a fallback.
        console.error(`Error loading data for tab ${activeTab}:`, tabError);
        setError(`Failed to load data for ${activeTab}`);
      } finally {
        // setLoading(false); // Set loading false after all data for the tab is fetched
      }
    };

    loadTabData();

  }, [activeTab, user, timeRange, fetchDashboardData, fetchActiveSessions, fetchUsers]); // Removed setError from dependencies as it causes re-runs
  
  // View session details
  const viewSessionDetails = async (sessionId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await axios.get(`${API_URL}/admin/sessions/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSelectedSession(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching session details:', err);
      setError('Failed to load session details');
      setLoading(false);
    }
  };
  
  // End user session
  const endUserSession = async (sessionId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      await axios.post(`${API_URL}/admin/sessions/end`, 
        { sessionId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Refresh sessions list
      fetchActiveSessions();
      setSelectedSession(null);
    } catch (err) {
      console.error('Error ending session:', err);
      setError('Failed to end session');
      setLoading(false);
    }
  };
  
  // Update user role
  const updateUserRole = async (userId, role) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      await axios.post(`${API_URL}/admin/users/role`, 
        { userId, role },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Refresh users list
      fetchUsers();
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role');
      setLoading(false);
    }
  };
  
  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p>Please wait while we verify your credentials.</p>
        </div>
      </div>
    );
  }
  
  if (error && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p>{error}</p>
          <button 
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          {user && (
            <div className="flex items-center space-x-4">
              <span>Welcome, {user.username}</span>
              <button 
                onClick={() => {
                  localStorage.removeItem('authToken');
                  router.push('/login');
                }}
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      
      <div className="container mx-auto py-8">
        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button 
            className={`px-4 py-2 ${activeTab === 'dashboard' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'sessions' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('sessions')}
          >
            Active Sessions
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'leaderboards' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('leaderboards')}
          >
            Leaderboards
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'guilds' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('guilds')}
          >
            Guilds
          </button>
        </div>
        
        {/* Time range selector for dashboard */}
        {activeTab === 'dashboard' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Range:
            </label>
            <select 
              className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
            >
              <option value={1}>Last 24 Hours</option>
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 3 Months</option>
            </select>
          </div>
        )}
        
        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 rounded-md bg-red-50 text-red-600">
            {error}
            <button 
              className="ml-2 text-red-800 underline"
              onClick={() => setError(null)}
            >
              Dismiss
            </button>
          </div>
        )}
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Tab content */}
        {!loading && (
          <>
            {activeTab === 'dashboard' && dashboardData && (
              <DashboardStats data={dashboardData} />
            )}
            
            {activeTab === 'sessions' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold mb-4">Active Sessions ({activeSessions.length})</h2>
                  <ActiveSessions 
                    sessions={activeSessions} 
                    onViewSession={viewSessionDetails}
                    onEndSession={endUserSession}
                  />
                </div>
                
                <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold mb-4">Session Viewer</h2>
                  {selectedSession ? (
                    <SessionViewer session={selectedSession} />
                  ) : (
                    <p className="text-gray-500">Select a session to view details</p>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">User Management</h2>
                <UserTable 
                  users={users} 
                  onUpdateRole={updateUserRole}
                />
              </div>
            )}
            
            {activeTab === 'leaderboards' && (
              <Leaderboards API_URL={API_URL} />
            )}
            
            {activeTab === 'guilds' && (
              <GuildManager API_URL={API_URL} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 
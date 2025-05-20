'use client';

import { useState } from 'react';

const ActiveSessions = ({ sessions, onViewDetails, onEndSession }) => {
  const [sortBy, setSortBy] = useState('lastActivity');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Sort sessions
  const sortedSessions = [...sessions].sort((a, b) => {
    if (sortBy === 'lastActivity') {
      const dateA = new Date(a.lastActivity);
      const dateB = new Date(b.lastActivity);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'username') {
      const nameA = a.user?.username || '';
      const nameB = b.user?.username || '';
      return sortOrder === 'asc' 
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else if (sortBy === 'ipAddress') {
      const ipA = a.ipAddress || '';
      const ipB = b.ipAddress || '';
      return sortOrder === 'asc' 
        ? ipA.localeCompare(ipB)
        : ipB.localeCompare(ipA);
    }
    return 0;
  });
  
  // Toggle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };
  
  // Calculate time elapsed
  const timeElapsed = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return `${diffSecs}s ago`;
    
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Active Sessions ({sessions.length})</h2>
        <p className="text-sm text-gray-500">Manage user sessions</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('username')}
              >
                User
                {sortBy === 'username' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('ipAddress')}
              >
                IP Address
                {sortBy === 'ipAddress' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Device
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('lastActivity')}
              >
                Last Activity
                {sortBy === 'lastActivity' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedSessions.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No active sessions found
                </td>
              </tr>
            ) : (
              sortedSessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {session.user ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {session.user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {session.user.email}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Anonymous</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.ipAddress || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.userAgent ? (
                      <div className="truncate max-w-xs" title={session.userAgent}>
                        {session.userAgent}
                      </div>
                    ) : (
                      'Unknown'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{formatDate(session.lastActivity)}</div>
                    <div className="text-xs text-gray-400">{timeElapsed(session.lastActivity)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onViewDetails(session.id)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEndSession(session.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      End Session
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveSessions; 
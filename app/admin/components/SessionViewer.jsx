'use client';

import React from 'react';

const SessionViewer = ({ session, onEndSession, onBack }) => {
  if (!session) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Select a session to view details</p>
      </div>
    );
  }
  
  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString();
  };
  
  // Calculate time left until expiration
  const calculateTimeLeft = (expiresAt) => {
    if (!expiresAt) return 'N/A';
    
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry - now;
    
    if (diffMs <= 0) return 'Expired';
    
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins % 60}m`;
    } else if (diffMins > 0) {
      return `${diffMins}m ${diffSecs % 60}s`;
    } else {
      return `${diffSecs}s`;
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Session Details</h2>
          <p className="text-sm text-gray-500">Information about the selected session</p>
        </div>
        <button 
          onClick={onBack}
          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
        >
          Back to List
        </button>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-semibold mb-4 pb-2 border-b">Session Information</h3>
            <div className="space-y-3">
              <div>
                <span className="block text-sm font-medium text-gray-500">Session ID</span>
                <span className="text-sm">{session.sessionId}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  session.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {session.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Created At</span>
                <span className="text-sm">{formatDate(session.createdAt)}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Last Activity</span>
                <span className="text-sm">{formatDate(session.lastActivity)}</span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">Expires</span>
                <span className="text-sm">
                  {formatDate(session.expiresAt)}
                  <span className="ml-2 text-xs text-gray-500">
                    ({calculateTimeLeft(session.expiresAt)} remaining)
                  </span>
                </span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">IP Address</span>
                <span className="text-sm">{session.ipAddress || 'Unknown'}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-semibold mb-4 pb-2 border-b">User Information</h3>
            {session.user ? (
              <div className="space-y-3">
                <div>
                  <span className="block text-sm font-medium text-gray-500">Username</span>
                  <span className="text-sm">{session.user.username}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Email</span>
                  <span className="text-sm">{session.user.email}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">User ID</span>
                  <span className="text-sm">{session.user.id}</span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Role</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    session.user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {session.user.role}
                  </span>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500">Account Created</span>
                  <span className="text-sm">{formatDate(session.user.createdAt)}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No user associated with this session</p>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-4 pb-2 border-b">Device Information</h3>
          <div>
            <span className="block text-sm font-medium text-gray-500">User Agent</span>
            <div className="mt-1 p-3 bg-gray-50 rounded text-sm break-words">
              {session.userAgent || 'Unknown'}
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <button
            onClick={() => onEndSession(session.sessionId)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            End Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionViewer; 
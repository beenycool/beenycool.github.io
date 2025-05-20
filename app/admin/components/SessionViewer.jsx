'use client';

import React from 'react';

const SessionViewer = ({ session }) => {
  if (!session || !session.session) { // session prop might be nested from the page { session: actualSessionData }
    return <p className="text-gray-500">No session data provided or session data is not in the expected format.</p>;
  }

  const actualSession = session.session; // The session data from controller
  const activities = session.activities || []; // The activities from controller

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Session Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">User:</p>
          <p className="font-medium">{actualSession.user ? actualSession.user.username : 'N/A'} ({actualSession.user ? actualSession.user.role : 'N/A'})</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Session ID:</p>
          <p className="font-medium break-all">{actualSession.sessionId || actualSession.id || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Start Time:</p>
          <p className="font-medium">{new Date(actualSession.createdAt || actualSession.startTime).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">End Time:</p>
          <p className="font-medium">{actualSession.endTime ? new Date(actualSession.endTime).toLocaleString() : (actualSession.isActive ? 'Active' : 'N/A')}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">IP Address:</p>
          <p className="font-medium">{actualSession.ipAddress || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">User Agent:</p>
          <p className="font-medium break-all">{actualSession.userAgent || 'N/A'}</p>
        </div>
      </div>

      <h4 className="text-lg font-semibold mb-3">User Activities During Session ({activities.length})</h4>
      {activities.length > 0 ? (
        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {activities.map((activity, index) => (
            <li key={activity.id || index} className="p-3 bg-gray-50 rounded-md border border-gray-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm text-gray-700">{activity.actionType.replace(/_/g, ' ').toUpperCase()}</span>
                <span className="text-xs text-gray-500">{new Date(activity.performedAt).toLocaleString()}</span>
              </div>
              {activity.actionDetails && Object.keys(activity.actionDetails).length > 0 && (
                <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded mt-1">
                  <pre className="whitespace-pre-wrap break-all">{JSON.stringify(activity.actionDetails, null, 2)}</pre>G
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No activities recorded for this user during this session.</p>
      )}
    </div>
  );
};

export default SessionViewer; 
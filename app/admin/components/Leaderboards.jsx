'use client';

import { useState } from 'react';
import Image from 'next/image';

const Leaderboards = ({ leaderboardData }) => {
  const [activeTab, setActiveTab] = useState('chess');
  
  if (!leaderboardData) {
    return <div className="bg-white shadow rounded-lg p-6">Loading leaderboards...</div>;
  }
  
  const { chess, guilds, activity } = leaderboardData;
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Leaderboards</h2>
        <p className="text-sm text-gray-500">Top performing users and guilds</p>
      </div>
      
      <div className="border-b">
        <div className="flex">
          <button
            className={`px-4 py-3 ${activeTab === 'chess' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('chess')}
          >
            Chess Ratings
          </button>
          <button
            className={`px-4 py-3 ${activeTab === 'guilds' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('guilds')}
          >
            Guilds
          </button>
          <button
            className={`px-4 py-3 ${activeTab === 'activity' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('activity')}
          >
            Most Active
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {activeTab === 'chess' && (
          <div>
            <h3 className="text-md font-semibold mb-3">Top Chess Players</h3>
            {chess && chess.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Player
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Games
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        W/L/D
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {chess.map((player, index) => (
                      <tr key={player.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Image 
                              src={player.avatar || '/default-avatar.png'} 
                              alt={player.username || 'Player'} 
                              width={40} 
                              height={40}
                              className="h-10 w-10 rounded-full" 
                            />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{player.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 font-medium">
                            {player.chessRating}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {player.stats?.chess?.gamesPlayed || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="text-green-600">{player.stats?.chess?.wins || 0}W</span> / 
                          <span className="text-red-600 mx-1">{player.stats?.chess?.losses || 0}L</span> / 
                          <span className="text-gray-600">{player.stats?.chess?.draws || 0}D</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No chess data available</p>
            )}
          </div>
        )}
        
        {activeTab === 'guilds' && (
          <div>
            <h3 className="text-md font-semibold mb-3">Top Guilds</h3>
            {guilds && guilds.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guild
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Members
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Win Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {guilds.map((guild, index) => (
                      <tr key={guild.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            {guild.logo ? (
                              <Image 
                                src={guild.logo} 
                                alt={guild.name} 
                                width={40} 
                                height={40}
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center text-sm font-medium text-purple-700">
                                {guild.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{guild.name}</div>
                              <div className="text-xs text-gray-500">Created by {guild.ownerName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {guild.stats?.memberCount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 py-1 rounded bg-purple-100 text-purple-800 font-medium">
                            {guild.stats?.averageRating || 1200}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {guild.stats?.totalGames ? (
                            <span className="font-medium">
                              {Math.round((guild.stats.totalWins / guild.stats.totalGames) * 100)}%
                            </span>
                          ) : (
                            'N/A'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No guild data available</p>
            )}
          </div>
        )}
        
        {activeTab === 'activity' && (
          <div>
            <h3 className="text-md font-semibold mb-3">Most Active Users</h3>
            {activity && activity.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sessions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activity.map((user, index) => (
                      <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Image 
                              src={user.avatar || '/default-avatar.png'} 
                              alt={user.username || 'User'} 
                              width={40} 
                              height={40}
                              className="h-10 w-10 rounded-full" 
                            />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.sessionCount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.actionCount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastActive ? new Date(user.lastActive).toLocaleString() : 'Never'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No activity data available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboards; 
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

const ChessUserPanel = ({ onJoinGuild, currentGuild }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guilds, setGuilds] = useState([]);
  const [showGuildList, setShowGuildList] = useState(false);
  const [chessRating, setChessRating] = useState(1200);
  const [recentGames, setRecentGames] = useState([]);
  
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`${API_URL}/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setUser(response.data.user);
          setChessRating(response.data.user.chessRating || 1200);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [API_URL]);
  
  // Fetch recent games and guild data when user is available
  useEffect(() => {
    if (!user) return;
    
    const fetchUserGames = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        const response = await axios.get(`${API_URL}/chess/my-games`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setRecentGames(response.data.games);
        }
      } catch (error) {
        console.error('Error fetching recent games:', error);
      }
    };
    
    const fetchGuilds = async () => {
      try {
        const response = await axios.get(`${API_URL}/guilds`);
        
        if (response.data.success) {
          setGuilds(response.data.guilds);
        }
      } catch (error) {
        console.error('Error fetching guilds:', error);
      }
    };
    
    fetchUserGames();
    fetchGuilds();
  }, [user, API_URL]);
  
  const handleJoinGuild = async (guildId) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        router.push('/login?redirect=/work');
        return;
      }
      
      const response = await axios.post(`${API_URL}/guilds/${guildId}/join`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Update user data with new guild
        setUser({
          ...user,
          guild: response.data.guild._id
        });
        
        // Call parent component's handler if provided
        if (onJoinGuild) {
          onJoinGuild(response.data.guild);
        }
        
        setShowGuildList(false);
      }
    } catch (error) {
      console.error('Error joining guild:', error);
      alert('Failed to join guild. You may already be in a guild.');
    }
  };
  
  const handleLeaveGuild = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        router.push('/login?redirect=/work');
        return;
      }
      
      const response = await axios.post(`${API_URL}/guilds/leave`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Update user data to remove guild
        setUser({
          ...user,
          guild: null
        });
        
        // Call parent component's handler if provided
        if (onJoinGuild) {
          onJoinGuild(null);
        }
      }
    } catch (error) {
      console.error('Error leaving guild:', error);
      alert('Failed to leave guild.');
    }
  };
  
  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow mb-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="p-4 bg-white rounded-lg shadow mb-4">
        <h3 className="text-lg font-semibold mb-2">Chess Player</h3>
        <p className="text-sm text-gray-600 mb-3">Sign in to track your stats and join guilds</p>
        <div className="flex space-x-2">
          <Link 
            href="/login?redirect=/work" 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
          >
            Sign In
          </Link>
          <Link 
            href="/login?redirect=/work" 
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-white rounded-lg shadow mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{user.username}</h3>
          <p className="text-sm text-gray-600">Rating: {chessRating}</p>
          
          {/* Stats */}
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <div className="bg-green-50 p-2 rounded">
              <div className="text-sm font-semibold text-green-600">{user.stats?.chess?.wins || 0}</div>
              <div className="text-xs text-gray-500">Wins</div>
            </div>
            <div className="bg-red-50 p-2 rounded">
              <div className="text-sm font-semibold text-red-600">{user.stats?.chess?.losses || 0}</div>
              <div className="text-xs text-gray-500">Losses</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-sm font-semibold text-gray-600">{user.stats?.chess?.draws || 0}</div>
              <div className="text-xs text-gray-500">Draws</div>
            </div>
          </div>
        </div>
        
        {/* Guild Badge */}
        {currentGuild ? (
          <div className="text-right">
            <div className="inline-block bg-indigo-50 border border-indigo-100 rounded-md p-2">
              <div className="text-xs text-gray-500">Guild</div>
              <div className="font-semibold text-indigo-700">{currentGuild.name}</div>
            </div>
            <button 
              onClick={handleLeaveGuild}
              className="mt-2 text-xs text-red-600 hover:text-red-800"
            >
              Leave Guild
            </button>
          </div>
        ) : (
          <div>
            <button 
              onClick={() => setShowGuildList(!showGuildList)}
              className="px-3 py-1 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600"
            >
              Join Guild
            </button>
            
            {showGuildList && (
              <div className="absolute mt-2 right-4 bg-white border rounded-md shadow-lg z-50 w-64">
                <div className="p-2 border-b">
                  <h4 className="font-semibold">Available Guilds</h4>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {guilds.length === 0 ? (
                    <p className="p-3 text-sm text-gray-500">No guilds available</p>
                  ) : (
                    <ul>
                      {guilds.map(guild => (
                        <li 
                          key={guild._id}
                          className="p-2 hover:bg-gray-50 border-b last:border-0 cursor-pointer"
                          onClick={() => handleJoinGuild(guild._id)}
                        >
                          <div className="font-medium">{guild.name}</div>
                          <div className="text-xs text-gray-500">
                            {guild.members.length} members • Avg: {guild.stats.averageRating}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Recent Games */}
      {recentGames.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">Recent Games</h4>
          <div className="space-y-1 text-sm">
            {recentGames.slice(0, 3).map((game, index) => {
              const isWhite = game.players.white.user === user.id;
              const opponent = isWhite ? game.players.black.username : game.players.white.username;
              const result = 
                (isWhite && game.result === '1-0') || (!isWhite && game.result === '0-1')
                  ? 'Win'
                  : (game.result === '1/2-1/2' ? 'Draw' : 'Loss');
              const ratingChange = isWhite ? game.players.white.ratingChange : game.players.black.ratingChange;
              
              return (
                <div key={index} className={`flex justify-between p-1 rounded ${
                  result === 'Win' ? 'bg-green-50' : 
                  result === 'Loss' ? 'bg-red-50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      isWhite ? 'bg-gray-100 border border-gray-300' : 'bg-gray-800'
                    }`}></span>
                    <span>{opponent}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">{result}</span>
                    <span className={`${
                      ratingChange > 0 ? 'text-green-600' : 
                      ratingChange < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {ratingChange > 0 ? '+' : ''}{ratingChange}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessUserPanel; 
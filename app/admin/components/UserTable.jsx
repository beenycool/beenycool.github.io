'use client';

import { useState } from 'react';

const UserTable = ({ users, onUpdateRole }) => {
  const [sortBy, setSortBy] = useState('username');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  
  // Filter users by search query
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return user.username.toLowerCase().includes(query) || 
           user.email.toLowerCase().includes(query);
  });
  
  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let compareA, compareB;
    
    if (sortBy === 'username') {
      compareA = a.username.toLowerCase();
      compareB = b.username.toLowerCase();
    } else if (sortBy === 'email') {
      compareA = a.email.toLowerCase();
      compareB = b.email.toLowerCase();
    } else if (sortBy === 'role') {
      compareA = a.role.toLowerCase();
      compareB = b.role.toLowerCase();
    } else if (sortBy === 'lastLogin') {
      compareA = a.lastLogin ? new Date(a.lastLogin) : new Date(0);
      compareB = b.lastLogin ? new Date(b.lastLogin) : new Date(0);
      return sortOrder === 'asc' ? compareA - compareB : compareB - compareA;
    }
    
    return sortOrder === 'asc' 
      ? compareA.localeCompare(compareB)
      : compareB.localeCompare(compareA);
  });
  
  // Handle sort
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
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    return date.toLocaleString();
  };
  
  // Start editing user role
  const startEditing = (user) => {
    setEditingUser(user);
    setSelectedRole(user.role);
  };
  
  // Save user role
  const saveUserRole = () => {
    if (editingUser && selectedRole && selectedRole !== editingUser.role) {
      onUpdateRole(editingUser.id, selectedRole);
    }
    setEditingUser(null);
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditingUser(null);
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Users ({filteredUsers.length})</h2>
            <p className="text-sm text-gray-500">Manage user accounts</p>
          </div>
          <div className="mt-2 md:mt-0">
            <input 
              type="text"
              placeholder="Search users..."
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('username')}
              >
                Username
                {sortBy === 'username' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('email')}
              >
                Email
                {sortBy === 'email' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('role')}
              >
                Role
                {sortBy === 'role' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('lastLogin')}
              >
                Last Login
                {sortBy === 'lastLogin' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  {searchQuery ? 'No users match your search' : 'No users found'}
                </td>
              </tr>
            ) : (
              sortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser && editingUser.id === user.id ? (
                      <select 
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingUser && editingUser.id === user.id ? (
                      <>
                        <button
                          onClick={saveUserRole}
                          className="text-green-600 hover:text-green-800 mr-3"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-red-600 hover:text-red-800"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEditing(user)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Change Role
                      </button>
                    )}
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

export default UserTable; 
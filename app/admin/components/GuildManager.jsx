'use client';

import { useState } from 'react';

const GuildManager = ({ guilds, onCreateGuild, onUpdateGuild, onDeleteGuild }) => {
  const [selectedGuild, setSelectedGuild] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: ''
  });
  
  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      logo: ''
    });
  };
  
  // Switch to create mode
  const handleStartCreate = () => {
    setSelectedGuild(null);
    setIsCreating(true);
    resetForm();
  };
  
  // Switch to edit mode
  const handleEditGuild = (guild) => {
    setSelectedGuild(guild);
    setIsCreating(false);
    setFormData({
      name: guild.name,
      description: guild.description || '',
      logo: guild.logo || ''
    });
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Submit form for create/update
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isCreating) {
      onCreateGuild(formData);
    } else if (selectedGuild) {
      onUpdateGuild(selectedGuild.id, formData);
    }
    
    // Reset form and state
    resetForm();
    setSelectedGuild(null);
    setIsCreating(false);
  };
  
  // Cancel form
  const handleCancel = () => {
    resetForm();
    setSelectedGuild(null);
    setIsCreating(false);
  };
  
  // Confirm delete guild
  const handleConfirmDelete = (guildId) => {
    if (window.confirm('Are you sure you want to delete this guild? This action cannot be undone.')) {
      onDeleteGuild(guildId);
      handleCancel();
    }
  };
  
  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Guild List */}
      <div className="md:col-span-1 bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Guilds ({guilds.length})</h2>
            <p className="text-sm text-gray-500">Manage guild communities</p>
          </div>
          <button 
            onClick={handleStartCreate}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create New
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-250px)]">
          {guilds.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No guilds found</p>
          ) : (
            <ul className="space-y-2">
              {guilds.map((guild) => (
                <li 
                  key={guild.id}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedGuild && selectedGuild.id === guild.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => handleEditGuild(guild)}
                >
                  <div className="flex items-center">
                    {guild.logo ? (
                      <img 
                        src={guild.logo} 
                        alt={guild.name} 
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center text-lg font-medium text-purple-700">
                        {guild.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{guild.name}</div>
                      <div className="text-xs text-gray-500">
                        {guild.stats?.memberCount || 0} members · Created {formatDate(guild.createdAt)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* Guild Form */}
      <div className="md:col-span-2 bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">
            {isCreating ? 'Create New Guild' : selectedGuild ? 'Edit Guild' : 'Guild Details'}
          </h2>
          <p className="text-sm text-gray-500">
            {isCreating ? 'Create a new guild community' : selectedGuild ? 'Update guild information' : 'Select a guild to view or edit'}
          </p>
        </div>
        
        <div className="p-6">
          {isCreating || selectedGuild ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Guild Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                    Logo URL
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      id="logo"
                      name="logo"
                      className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
                      value={formData.logo}
                      onChange={handleInputChange}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter a valid image URL for the guild logo
                  </p>
                </div>
                
                {selectedGuild && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Advanced Settings</h3>
                    <button
                      type="button"
                      onClick={() => handleConfirmDelete(selectedGuild.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      Delete Guild
                    </button>
                    <p className="mt-1 text-xs text-gray-500">
                      This action cannot be undone. All guild data will be permanently deleted.
                    </p>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isCreating ? 'Create Guild' : 'Update Guild'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <svg 
                className="mx-auto h-12 w-12 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No guild selected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a guild from the list to view or edit its details, or create a new guild.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleStartCreate}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create New Guild
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuildManager; 
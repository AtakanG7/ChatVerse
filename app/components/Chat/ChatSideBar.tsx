import React, { useEffect, useState } from 'react';
import { User } from '@prisma/client';
import { FaCompass, FaEdit, FaQuestionCircle } from 'react-icons/fa';

interface ChatSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  connections: User[];
  selectUser: (user: User) => void;
  onFeatureChange: (feature: 'posts' | 'search' | 'future') => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  toggleSidebar,
  selectUser,
  onFeatureChange,
  connections
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConnections = connections.filter(
    (user) =>  user && typeof user.name === 'string' && user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvatarInitials = (email: string) => {
    const initials = email.split('@')[0].charAt(0).toUpperCase();
    return initials;
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out rounded-r-3xl lg:relative lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4 h-full flex flex-col">
        {/* Header for the sidebar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Chats</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => onFeatureChange('search')}
              className="text-white hover:text-gray-300"
              aria-label="Search Users"
            >
              <FaCompass size={24} />
            </button>
            <button
              onClick={() => onFeatureChange('posts')}
              className="text-white hover:text-gray-300"
              aria-label="Show Posts"
            >
              <FaEdit size={24} />
            </button>
            <button
              onClick={() => onFeatureChange('future')}
              className="text-white hover:text-gray-300"
              aria-label="Future Features"
            >
              <FaQuestionCircle size={24} />
            </button>
          </div>
        </div>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search connections..."
          className="w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* User list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredConnections.map((user, index) => (
            <div
              key={index}
              onClick={() => selectUser(user)}
              className="p-3 cursor-pointer bg-gray-700 hover:bg-blue-600 text-white transition duration-200 rounded-lg mb-2 shadow-sm"
            >
              <div className="flex items-center gap-3">
                {/* Simple Avatar */}
                <div className="w-8 h-8 flex items-center justify-center bg-gray-500 text-white rounded-full flex-shrink-0">
                  {getAvatarInitials(user.email)}
                </div>
                <span className="text-white font-medium">{user.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar close button */}
        <button
          className="mt-4 lg:hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
          onClick={toggleSidebar}
        >
          Close
        </button>
      </div>
    </div>
  );
};

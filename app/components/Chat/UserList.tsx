import React, { useState, useEffect, useMemo } from 'react';
import { User } from '@prisma/client';
import { useChat } from '../../hooks/useChat';
import { FaUserCircle } from 'react-icons/fa'; // Import for user avatar

interface UserListProps {
  currentUserId: string;
  selectUser: (user: User) => void;
}

const dummyUser = {
  id: '',
  name: 'dummyUser',
  email: 'dummyUser',
  verified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  resetToken: null,
  resetTokenExpires: null,
} as const;

const UserList: React.FC<UserListProps> = ({ currentUserId, selectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { connections, connectToUser } = useChat();
  const [allUsers, setAllUsers] = useState<User[]>([dummyUser]);

  useEffect(() => {
    // Fetch all users
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/connections?userId=${currentUserId}`);
        const users = await response.json();
        setAllUsers([dummyUser, ...users]);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  // Memoize filtered users to avoid re-calculation on every render
  const filteredUsers = useMemo(() => {
    return allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) && user.id !== currentUserId
    );
  }, [allUsers, searchTerm, currentUserId]);

  const handleConnect = async (userId: string) => {
    try {
      await connectToUser(userId);
    } catch (error) {
      console.error('Failed to connect to user:', error);
    }
  };

  const isConnected = (userId: string) => connections.some((conn) => conn.id === userId);

  return (
    <div className="w-64 bg-gray-800 flex flex-col border-r border-gray-700">
      <div className="p-4">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredUsers.map((user, index) => (
          <div
            onClick={() => selectUser(user)}
            key={index}
            className="p-3 cursor-pointer hover:bg-gray-700 transition duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* User avatar */}
                <div className="w-10 h-10 bg-gray-500 rounded-full flex-shrink-0 flex items-center justify-center text-white text-2xl mr-3">
                  {user.id ? <img src={`/api/avatars/${user.id}`} alt={user.name} className="w-full h-full rounded-full object-cover" /> : <FaUserCircle />}
                </div>
                <span className="text-white">{user.name}</span>
              </div>
              {!isConnected(user.id) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnect(user.id);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition duration-300 ease-in-out"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;

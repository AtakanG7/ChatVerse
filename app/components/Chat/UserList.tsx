import React, { useState, useEffect } from 'react';
import { User } from '@prisma/client';
import { useChat } from '../../hooks/useChat';

interface UserListProps {
  currentUserId: string;
}

const UserList: React.FC<UserListProps> = ({ currentUserId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { connections, connectToUser } = useChat();
  const [allUsers, setAllUsers] = useState<User[] | undefined>(undefined);

  useEffect(() => {
    // Fetch all users
    const fetchUsers = async () => {
      const response = await fetch(`/api/connections?userId=${currentUserId}`);
      const users = await response.json();
      console.log(users)
      setAllUsers(users);
    };
    fetchUsers();
  }, []);

  const filteredUsers = allUsers ? allUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) && user.id !== currentUserId
  ) : [];

  const handleConnect = async (userId: string) => {
    await connectToUser(userId);
  };

  const isConnected = (userId: string) => connections.some(conn => conn.id === userId);

  return (
    <div className="w-64 bg-gray-800 flex flex-col">
      <div className="p-4">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredUsers.map((user) => (
          <div key={user.id} className="p-3 hover:bg-gray-700 transition duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-2 bg-green-500"></div>
                <span>{user.name}</span>
              </div>
              {!isConnected(user.id) && (
                <button
                  onClick={() => handleConnect(user.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
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

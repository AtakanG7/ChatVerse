import React, { useState, useEffect, useMemo } from 'react';
import { User } from '@prisma/client';
import { FaUser, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface SearchUsersProps {
  selectUser: (user: User) => void;
  user: User;
  connections: User[];
}

const PAGE_SIZE = 10;

const SearchUsers: React.FC<SearchUsersProps> = ({selectUser, user, connections}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if(searchTerm==='' || searchTerm===undefined) {
        return;
    }
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/users?query=${searchTerm}`);
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          toast.error('Failed to fetch users');
        }
      } catch (error) {
        toast.error('Error during fetching users');
      }
    };

    fetchUsers();
  }, [searchTerm]);



  useEffect(() => {
    const searchResults = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(searchResults);
  }, [searchTerm, users]);

  const paginatedUsers = useMemo(() => 
    filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE), 
    [filteredUsers, currentPage]
  );

  const handleConnect = async (userId: string) => {
    try {
      if(connections.some(conn => conn.id === userId)) {
        toast.info('Already friend!');
        return;
      }
      const response = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, connectedUserId: userId }),
      });
      if (response.ok) {
        toast.success(`Connected to ${filteredUsers.find(u => u.id === userId)?.name}`);
      } else if(response.status === 409) {
        toast.info('You are already friends with this user');
      } else{
        toast.error('Failed to connect to user');
      }
    } catch (error) {
      toast.error('Failed to connect to user:');
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white h-full flex flex-col">
      {/* Search input */}
      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* User list */}
      <div className="flex flex-col space-y-2 mb-4 flex-1 overflow-y-auto">
        {paginatedUsers.map((user) => (
          <div
            key={user.id}
            className="p-3 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition duration-300 ease-in-out cursor-pointer flex items-center justify-between"
            onClick={() => selectUser(user)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white text-xl">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <span className="text-white font-medium">{user.name}</span>
            </div>
            {!connections.some((conn) => conn.id === user.id) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleConnect(user.id);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full flex items-center"
              >
                <FaUserPlus />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 transition duration-300 ease-in-out"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-white">Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg transition duration-300 ease-in-out"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchUsers;


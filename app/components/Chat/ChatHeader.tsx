import React from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface ChatHeaderProps {
  currentUser: User;
  otherUser?: User;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ currentUser, otherUser }) => {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 flex items-center justify-between rounded-xl shadow-lg mx-4 my-2">
      <div className="flex items-center gap-4">
        {/* Other user avatar */}
        <div className="relative">
          <img
            className="w-10 h-10 rounded-full border-2 border-gray-600 shadow-md"
            src="https://picsum.photos/512"
            alt=""
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></span>
        </div>
        {/* Other user details */}
        <div className="text-left">
          <h2 className="text-white font-semibold text-lg">{otherUser?.name || 'Anonymous'}</h2>
          <p className="text-gray-400 text-sm">{otherUser?.email || 'No email provided'}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* Current user details */}
        <div className="text-right">
          <h2 className="text-white font-semibold text-lg">{currentUser.name}</h2>
          <p className="text-gray-400 text-sm">{currentUser.email}</p>
        </div>
        {/* Current user avatar */}
        <img
          className="w-10 h-10 rounded-full border-2 border-gray-600 shadow-md"
          src="https://picsum.photos/512"
          alt=""
        />
      </div>
    </div>
  );
};

export default ChatHeader;

import React from 'react';
import { MessageType } from '@/types/prisma';

interface MessageProps {
  msg: MessageType;
  isCurrentUser: boolean;
}

export const Message: React.FC<MessageProps> = ({ msg, isCurrentUser }) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`relative max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl shadow-md ${
          isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-200'
        }`}
      >
        <div className="flex items-end">
          <span className="block">{msg.content}</span>
          <span className={`ml-2 text-xs text-gray-300 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className={`absolute bottom-0 ${isCurrentUser ? 'right-0 -mr-1' : 'left-0 -ml-1'}`}>
          <div
            className={`w-3 h-3 transform rotate-45 ${
              isCurrentUser ? 'bg-blue-500' : 'bg-gray-700'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

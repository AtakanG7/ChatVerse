import React from 'react';
import Message from './Message';
import { MessageType } from '@/types/prisma';

interface MessageListProps {
  messages: MessageType[];
  currentUserId: string;
  onShare: (msg: MessageType) => void;
  onDelete: (msg: MessageType) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId, onShare, onDelete }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
      {messages.map((msg, index) => (
        <Message
          key={index}
          msg={msg}
          currentUserId={currentUserId}
          onShare={() => onShare(msg)}
          onDelete={() => onDelete(msg)}
        />
      ))}
    </div>
  );
};

export default MessageList;
// MessageList.tsx
import React, { useRef, useEffect } from 'react';
import { Message } from './Message';
import { MessageType } from '@/types/prisma';

interface MessageListProps {
  messages: MessageType[];
  currentUserId?: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={ref} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
      {messages.map((msg, index) => (
        <Message
          key={index}
          msg={msg}
          isCurrentUser={msg.senderId === currentUserId}
        />
      ))}
    </div>
  );
};

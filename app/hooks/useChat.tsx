'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@prisma/client';
import { MessageType } from '@/types/prisma';

interface ChatContextType {
  isLoading: boolean;
  connections: User[];
  messages: MessageType[];
  sendMessage: (recipientId: string, content: string) => void;
  connectToUser: (userId: string) => Promise<void>;
  handleShareMessage: (msg: MessageType) => void;
  handleDeleteMessage: (msg: MessageType) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode; currentUserId: string }> = ({ children, currentUserId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [connections, setConnections] = useState<User[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/');

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsLoading(false);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        setMessages(prev => [...prev, data.message]);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsLoading(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsLoading(false);
    };

    setSocket(ws);

    // Fetch initial connections
    fetchConnections();

    return () => {
      ws.close();
    };
  }, [currentUserId]);

  const fetchConnections = async () => {
    try {
      const response = await fetch(`/api/connections?userId=${currentUserId}`);
      const data = await response.json();
      setConnections(data);
    } catch (error) {
      console.error('Failed to fetch connections:', error);
    }
  };

  const sendMessage = (recipientId: string, content: string) => {
    if (socket) {
      socket.send(JSON.stringify({ type: 'message', recipientId, content }));
    }
  };

  const connectToUser = async (userId: string) => {
    try {
      const response = await fetch('/api/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: currentUserId, connectedUserId: userId }),
      });
      const newConnection = await response.json();
      setConnections(prev => [...prev, newConnection]);
    } catch (error) {
      console.error('Failed to connect to user:', error);
    }
  };

  const handleShareMessage = (msg: MessageType) => {
    console.log('Sharing message:', msg);
    // Implement share functionality
  };

  const handleDeleteMessage = (msg: MessageType) => {
    setMessages(messages.filter(m => m !== msg));
    // Implement delete functionality if needed
  };

  return (
    <ChatContext.Provider value={{ 
      isLoading, 
      connections, 
      messages, 
      sendMessage, 
      connectToUser,
      handleShareMessage,
      handleDeleteMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
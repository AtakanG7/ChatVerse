'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@prisma/client';
import { MessageType } from '@/types/prisma';
import io from 'socket.io-client';

interface ChatContextType {
  isLoading: boolean;
  connections: User[];
  messages: MessageType[];
  sendMessage: (recipientId: string, content: string) => void;
  connectToUser: (userId: string) => Promise<void>;
  currentChat: User[] | undefined;
  setCurrentChat: (user: User[]) => void;
  setMessages: (messages: MessageType[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setUser: (user: User | undefined) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [connections, setConnections] = useState<User[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [socket, setSocket] = useState<any>(null);
  const [currentChat, setCurrentChat] = useState<User[] | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const port = window.location.port || "3000"; 
    
    const newSocket = io(`${protocol}://${window.location.hostname}:${port}`);

    newSocket.on('connect', () => {
      setIsLoading(false);
    });

    newSocket.on('message', (message: MessageType) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('error', (error: any) => {
      setIsLoading(false);
    });

    newSocket.on('disconnect', () => {
      setIsLoading(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);
 
  useEffect(() => {
    if (socket && currentChat) {
      const roomIdentifier = [user?.id, currentChat[0].id].sort().join('-');
      socket.emit('joinRoom', roomIdentifier);
    }
  }, [currentChat, socket, user]);

  const sendMessage = (recipientId: string, content: string) => {
    if (socket) {
      const message: MessageType = {
        senderId: user?.id,
        recipientId,
        content,
        createdAt: new Date(),
      };
      const roomIdentifier = [user?.id, recipientId].sort().join('-');
      socket.emit('joinRoom', roomIdentifier);
      socket.emit('message', { room: roomIdentifier, message });
    }
  };

  const connectToUser = async (userId: string) => {
    try {
      const response = await fetch('/api/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user, connectedUserId: userId }),
      });
      const newConnection = await response.json();
      setConnections(prev => [...prev, newConnection]);
    } catch (error) {
      console.error('Failed to connect to user:', error);
    }
  };

  return (
    <ChatContext.Provider value={{ 
      isLoading, 
      connections, 
      messages, 
      sendMessage, 
      connectToUser,
      currentChat,
      setCurrentChat,
      setMessages,
      setIsLoading,
      setUser
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
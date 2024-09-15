import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify'; 
import { useChat } from '../../hooks/useChat';
import { ChatSidebar } from './ChatSideBar';
import ChatHeader from './ChatHeader';
import { MessageList } from './MessageList';
import MessageInput from './MessageInput';
import PostsScreen from '../Posts/PostsScreen';
import SearchUsers from '../Search/SearchUsers';
import { User } from '@prisma/client';

const dummyConnections: User[] = [
  {
    id: '66d2219ca8844f3b6cd0cc14',
    name: 'Super Dummy',
    email: 'dummy@example.com',
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    resetToken: null,
    resetTokenExpires: null,
  },
];

interface ChatContentProps {
  user: User;
}

export const ChatContent: React.FC<ChatContentProps> = ({ user }) => {
  const { isLoading, messages, sendMessage, currentChat, setCurrentChat, setMessages, setIsLoading, setUser} = useChat();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<'posts' | 'search' | 'future' | null>('posts');
  const [allConnections, setAllConnections] = useState<User[]>([]);
  const [client, setClient] = useState<User>();

  useEffect(() => {
    setAllConnections([...dummyConnections, ...allConnections]);
  }, []);

  useEffect(() => {
    if (!user || user===undefined) {
      return;
    }
    setClient(user);
    setUser(user);
    toast.success('Login successful');
  }, [user]);

  useEffect(() => {
    // Fetch initial connections
    fetchConnections();
  }, [client]);

  const fetchConnections = async () => {
    console.log('Fetching connections...');
    try {
      if (client === undefined) {
        console.log('Client is undefined, skipping fetching connections');
        return;
      }
      const response = await fetch(`/api/connections?userId=${client.id}`);
      console.log('Response status:', response.status);
      if (!response.ok) {
        if (response.status === 409) {
          console.log('Conflict error, you are already friends with this user');
          toast.error('You are already friends with this user');
        } else {
          console.error('Failed to fetch connections:', response);
          throw new Error('Failed to fetch connections');
        }
      }
      const data = await response.json();
      console.log('Fetched connections:', data);
      setAllConnections([...allConnections, ...data]);
      console.log('Updated connections:', allConnections);
      toast.success('Connections fetched successfully'); 
    } catch (error) {
      console.error('Failed to fetch connections:', error);
      toast.error('Failed to fetch connections'); 
    }
  };

  const fetchMessages = useCallback(async (userId1: string, userId2: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/messages?userId1=${userId1}&userId2=${userId2}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && currentChat) {
      fetchMessages(user.id, currentChat[0].id);
    }
  }, [user, currentChat, fetchMessages]);

  const handleSendMessage = useCallback((content: string, files: File[]) => {
    if (currentChat && currentChat.length > 0) {
      sendMessage(currentChat[0].id, content);
    } else {
      toast.error('No user selected for chat'); 
    }
  }, [currentChat, sendMessage]);

  const handleSelectUser = useCallback((selectedUser: User) => {
    setCurrentChat([selectedUser]);
    setCurrentFeature(null);
    setSidebarOpen(false);
    toast.info(`Selected user: ${selectedUser.name}`, { autoClose: 1000 });
  }, [setCurrentChat]);

  const handleFeatureChange = useCallback((feature: 'posts' | 'search' | 'future') => {
    setCurrentFeature(feature);
    setSidebarOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white md:flex-row">
      <ChatSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        connections={allConnections}
        selectUser={handleSelectUser}
        onFeatureChange={handleFeatureChange}
      />
      <div className="flex-1 flex flex-col">
        <div className="md:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 m-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
          </button>
        </div>
        {currentFeature === 'posts' ? (
          <PostsScreen currentUser={user} connections={allConnections} />
        ) : currentFeature === 'search' ? (
          <SearchUsers selectUser={handleSelectUser} user={user} connections={allConnections}/>
        ) : currentFeature === 'future' ? (
          <div className="p-4">Future Features Here</div> // Replace with actual future features component
        ) : (
          <>
            <ChatHeader
              currentUser={user}
              otherUser={currentChat && currentChat.length > 0 ? currentChat[0] : undefined}
            />
            <MessageList messages={messages} currentUserId={user.id}/>
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        )}
      </div>
    </div>
  );
};


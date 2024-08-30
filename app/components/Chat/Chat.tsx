import React, { useState, useEffect } from 'react';
import Skeleton from '../Common/Skeleton';
import EmailModal from '../Auth/EmailModal';
import CodeModal from '../Auth/CodeModal';
import UserList from './UserList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useAuth } from '../../hooks/useAuth';
import { ChatProvider, useChat } from '../../hooks/useChat';

const dummyUser = {
  id: 'dummy-id',
  name: 'Dummy User',
  email: 'dummy@example.com',
};

const ChatContent: React.FC = () => {
  const { user } = useAuth();
  const {
    isLoading,
    messages,
    sendMessage,
    handleShareMessage,
    handleDeleteMessage,
  } = useChat();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <UserList currentUserId={user?.id || dummyUser.id} />
      <div className="flex-1 flex flex-col bg-gray-700">
        <MessageList
          messages={messages}
          currentUserId={user?.id || dummyUser.id}
          onShare={handleShareMessage}
          onDelete={handleDeleteMessage}
        />
        <MessageInput onSendMessage={(content) => sendMessage(user?.id || dummyUser.id, content)} />
      </div>
    </div>
  );
};

const Chat: React.FC = () => {
  const { user, login, verifyCode } = useAuth();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!user) {
      setShowEmailModal(true);
    }
  }, [user]);

  const handleEmailSubmit = async (email: string) => {
    setEmail(email);
    try {
      await login(email);
      setShowEmailModal(false);
      setShowCodeModal(true);
    } catch (error) {
      console.error('Failed to send verification code:', error);
    }
  };

  const handleCodeSubmit = async (code: string) => {
    try {
      const isVerified = await verifyCode(email, code);
      if (isVerified) {
        setShowCodeModal(false);
      } else {
        // Handle invalid code (e.g., show error message to user)
      }
    } catch (error) {
      console.error('Failed to verify code:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  if (!user) {
    return (
      <>
        {showEmailModal && <EmailModal onSubmit={handleEmailSubmit} />}
        {showCodeModal && <CodeModal onSubmit={handleCodeSubmit} />}
      </>
    );
  }

  return (
    <ChatProvider currentUserId={user.id || dummyUser.id}>
      <ChatContent />
    </ChatProvider>
  );
};

export default Chat;
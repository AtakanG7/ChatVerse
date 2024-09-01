import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../hooks/useAuth';
import { ChatProvider, useChat } from '../../hooks/useChat';

import EmailModal from '../Auth/EmailModal';
import CodeModal from '../Auth/CodeModal';
import { ChatContent } from './ChatContent';

const ChatInterface: React.FC = () => {
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
      toast.error(`Failed to send verification code: ${error}`, {
        autoClose: 5000,
      });
    }
  };

  const handleCodeSubmit = async (code: string) => {
    try {
      const isVerified = await verifyCode(email, code);
      if (isVerified) {
        setShowCodeModal(false);
      } else {
        toast.error('Invalid verification code', {
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error(`Failed to verify code: ${error}`, {
        autoClose: 5000,
      });
    }
  };

  if (!user) {
    return (
      <>
        {showEmailModal && <EmailModal onSubmit={handleEmailSubmit} />}
        {showCodeModal && <CodeModal onSubmit={handleCodeSubmit} />}
        <ToastContainer />
      </>
    );
  }

  return (
    <ChatProvider>
      <ChatContent user={user}/>
      <ToastContainer />
    </ChatProvider>
  );
};

export default ChatInterface;

import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../hooks/useAuth';
import { ChatProvider } from '../../hooks/useChat';
import Head from 'next/head';

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

  return (
    <>
      <Head>
        <title>Chat Interface - Real-time Messaging | Atakan Gül</title>
        <meta name="description" content="Chat with friends and collaborate in real-time using the Chat App by Atakan Gül." />
        <meta name="keywords" content="chat, real-time, collaborate, messaging, Atakan Gül, find friends" />
        <link rel="canonical" href="https://chat.atakangul.com" />
        {/* Hidden meta tags for additional SEO */}
        <meta name="author" content="Atakan Gül" />
        <meta name="robots" content="index, follow" />
        <meta name="whois" content="Atakan Gül is a software developer specializing in real-time communication applications." />
        <meta name="faq" content="Who is Atakan Gül? Atakan Gül is a developer who created this real-time chat application using Next.js and WebSocket." />
        <meta name="faq" content="What is this app? This is a real-time chat application for finding friends, collaborating, and chatting." />
      </Head>
      { !user ? (
        <>
          {showEmailModal && <EmailModal onSubmit={handleEmailSubmit} />}
          {showCodeModal && <CodeModal onSubmit={handleCodeSubmit} />}
        </>
      ) : (
        <ChatProvider>
          <ChatContent user={user} />
        </ChatProvider>
      )}
      <ToastContainer />
    </>
  );
};

export default ChatInterface;

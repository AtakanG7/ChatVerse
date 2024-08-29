"use client";

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Skeleton from '../Common/Skeleton';
import EmailModal from '../Auth/EmailModal';
import CodeModal from '../Auth/CodeModal';
import Message from '../Chat/Message';

const socket = io(); 

const Chat = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    checkRegistrationStatus();
    socket.on('users', (users: User[]) => setUsers(users));
    socket.on('message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      socket.off('users');
      socket.off('message');
    };
  }, []);

  const checkRegistrationStatus = async () => {
    setTimeout(() => {
      setIsRegistered(false);
      setIsLoading(false);
      setShowEmailModal(true);
    }, 1500);
  };

  const handleEmailSubmit = async (email: string) => {
    setShowEmailModal(false);
    setShowCodeModal(true);
  };

  const handleCodeSubmit = async (code: string) => {
    setShowCodeModal(false);
    setIsRegistered(true);
  };

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      socket.emit('sendMessage', {
        userId: socket.id,
        name: 'John Doe',
        text: currentMessage,
      });
      setCurrentMessage('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Skeleton />
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <>
        {showEmailModal && <EmailModal onSubmit={handleEmailSubmit} />}
        {showCodeModal && <CodeModal onSubmit={handleCodeSubmit} />}
      </>
    );
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShareMessage = (msg: Message) => {
    console.log('Sharing message:', msg);
  };

  const handleDeleteMessage = (msg: Message) => {
    setMessages(messages.filter(m => m !== msg));
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-64 bg-gray-800 flex flex-col">
        <div className="p-4">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-3 hover:bg-gray-700 cursor-pointer transition duration-200">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span>{user.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-700">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, index) => (
              <Message
                key={index}
                msg={{ ...msg, createdAt: new Date(msg.createdAt) }}
                currentUserId={socket.id || ''}
                onShare={() => handleShareMessage(msg)}
                onDelete={() => handleDeleteMessage(msg)} 
              />
            ))}
          </div>

        <form onSubmit={sendMessage} className="p-4 bg-gray-800">
          <div className="flex items-center">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              className="flex-1 p-2 rounded-l bg-gray-700 text-white focus:outline-none"
              placeholder="Type a message..."
            />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-r hover:bg-indigo-700 transition duration-200 focus:outline-none">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;

type User = {
  id: string;
  name: string;
  status: 'online' | 'offline';
};

type Message = {
  userId: string;
  name: string;
  text: string;
  createdAt: string;
};

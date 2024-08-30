import React, { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [currentMessage, setCurrentMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      onSendMessage(currentMessage);
      setCurrentMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800">
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
  );
};

export default MessageInput;
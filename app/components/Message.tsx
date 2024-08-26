"use client";

import React, { useState } from 'react';
import { format } from 'date-fns';
import MessageOptions from './MessageOptions';

type Message = {
  id: string;
  userId: string;
  name: string;
  text: string;
  createdAt: Date;
}

const MessageComponent = ({ msg, currentUserId, onShare, onDelete }: {
  msg: Message;
  currentUserId: string;
  onShare: (message: Message) => void;
  onDelete?: (id: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(msg.text);

  const handleShare = () => {
    onShare(msg);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    onDelete?.(msg.userId);
  };

  const isCurrentUser = msg.userId === currentUserId;

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} group relative`}>
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${isCurrentUser ? 'bg-indigo-600' : 'bg-gray-600'}`}>
        <div className="font-bold">{msg.name}</div>
        {isEditing ? (
          <div>
            <input
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full p-1 bg-gray-700 text-white rounded"
            />
          </div>
        ) : (
          <div>{msg.text}</div>
        )}
        <div className="text-xs text-gray-400 mt-1">
          {format(new Date(msg.createdAt), 'HH:mm')}
        </div>
        <MessageOptions
          onShare={handleShare}
          onDelete={isCurrentUser ? handleDelete : (() => {})}
        />
      </div>
    </div>
  );
};

export default MessageComponent;


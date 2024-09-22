import React, { useState, useRef } from 'react';
import { Smile, Paperclip, Image, Send, Mic, MoreHorizontal } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface MessageInputProps {
  onSendMessage: (message: string, files: File[]) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMessage.trim() || files.length > 0) {
      onSendMessage(currentMessage, files);
      setCurrentMessage('');
      setFiles([]);
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setCurrentMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const triggerFileInput = (type: 'all' | 'image') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : '*';
      fileInputRef.current.click();
    }
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800 relative" style={{ zIndex: 18 }}>
      <div className="flex items-center bg-gray-700 rounded-lg overflow-hidden p-3 shadow-md">
        <input
          ref={inputRef}
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          className="flex-1 bg-transparent text-white focus:outline-none px-3 py-2 rounded-lg"
          placeholder="Message..."
        />
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-400 hover:text-white focus:outline-none p-2 rounded-full bg-gray-600 hover:bg-blue-600 transition-colors"
          >
            <MoreHorizontal className="w-6 h-6" />
          </button>
          <div className="hidden md:flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-400 hover:text-white focus:outline-none p-2 rounded-full bg-gray-600 hover:bg-blue-600 transition-colors"
            >
              <Smile className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => triggerFileInput('image')}
              className="text-gray-400 hover:text-white focus:outline-none p-2 rounded-full bg-gray-600 hover:bg-blue-600 transition-colors"
            >
              <Image className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => triggerFileInput('all')}
              className="text-gray-400 hover:text-white focus:outline-none p-2 rounded-full bg-gray-600 hover:bg-blue-600 transition-colors"
            >
              <Paperclip className="w-6 h-6" />
            </button>
            <button
              type="button"
              className="text-gray-400 hover:text-white focus:outline-none p-2 rounded-full bg-gray-600 hover:bg-blue-600 transition-colors"
            >
              <Mic className="w-6 h-6" />
            </button>
          </div>
          <button
            type="submit"
            className={`text-white focus:outline-none p-2 rounded-full bg-gray-600 hover:bg-blue-600 transition-colors ${
              currentMessage || files.length > 0 ? 'text-indigo-500 hover:text-indigo-600' : 'text-gray-400'
            }`}
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
      {showMobileMenu && (
        <div className="md:hidden flex justify-center mt-2 space-x-2">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-gray-400 hover:text-white focus:outline-none p-2 rounded-full bg-gray-600 hover:bg-blue-600 transition-colors"
          >
            <Smile className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={() => triggerFileInput('image')}
            className="text-gray-400 hover:text-white focus:outline-none p-2 rounded-full bg-gray-600 hover:bg-blue-600 transition-colors"
          >
            <Image className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={() => triggerFileInput('all')}
            className="text-gray-400 hover:text-white focus:outline-none p-2 rounded-full bg-gray-600 hover:bg-blue-600 transition-colors"
          >
            <Paperclip className="w-6 h-6" />
          </button>
          <button
            type="button"
            className="text-gray-400 hover:text-white focus:outline-none p-2 rounded-full bg-gray-600 hover:bg-blue-600 transition-colors"
          >
            <Mic className="w-6 h-6" />
          </button>
        </div>
      )}
      {showEmojiPicker && (
        <div className="absolute bottom-full mb-2 right-0 shadow-lg rounded-lg overflow-hidden">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" />
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />
      {files.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div key={index} className="bg-gray-700 text-white text-sm p-1 rounded-lg shadow-sm">
              {file.name}
            </div>
          ))}
        </div>
      )}
    </form>
  );
};

export default MessageInput;
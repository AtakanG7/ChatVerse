import React, { useRef, useEffect, useState } from 'react';
import { Message } from './Message';
import { MessageType } from '@/types/prisma';

interface MessageListProps {
  messages: MessageType[];
  currentUserId?: string;
}

interface AnimatedMessage extends MessageType {
  isAnimating: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [animatedMessages, setAnimatedMessages] = useState<AnimatedMessage[]>([]);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }

    // Update animated messages
    setAnimatedMessages(prevAnimated => {
      const newAnimated = messages.map(msg => {
        const existing = prevAnimated.find(am => am === msg);
        if (existing) {
          return existing;
        }
        return { ...msg, isAnimating: true };
      });

      // Start animation for new messages
      newAnimated.forEach(msg => {
        if (msg.isAnimating) {
          setTimeout(() => {
            setAnimatedMessages(current =>
              current.map(m => m === msg ? { ...m, isAnimating: false } : m)
            );
          }, 10);
        }
      });

      return newAnimated;
    });
  }, [messages]);

  const getMessageStyle = (isAnimating: boolean) => ({
    opacity: isAnimating ? 0 : 1,
    transform: `translateY(${isAnimating ? '20px' : '0'})`,
    transition: 'opacity 300ms, transform 300ms',
  });

  return (
    <div style={{
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.1,
      }}></div>
      <div 
        ref={ref} 
        style={{
          height: '100%',
          overflowY: 'auto',
          padding: '1rem',
          position: 'relative',
          zIndex: 10,
          maxHeight: 'calc(100vh - 300px)',
        }}
      >
        {animatedMessages.map((msg, index) => (
          <div key={index} style={getMessageStyle(msg.isAnimating)}>
            <Message
              msg={msg}
              isCurrentUser={msg.senderId === currentUserId}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
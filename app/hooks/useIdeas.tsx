'use client';
// app/hooks/useIdeas.ts
import { createContext, useContext, useState, useEffect } from 'react';

interface Idea {
  id: string;
  content: string;
  author: string;
  likes: number;
  comments: Comment[];
}

interface Comment {
  id: string;
  content: string;
  author: string;
}

interface IdeasContextType {
  ideas: Idea[];
  postIdea: (content: string) => Promise<void>;
  likeIdea: (ideaId: string) => Promise<void>;
  commentOnIdea: (ideaId: string, content: string) => Promise<void>;
}

const IdeasContext = createContext<IdeasContextType | undefined>(undefined);

export const IdeasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    // Fetch ideas on component mount
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const response = await fetch('/api/ideas');
      if (!response.ok) throw new Error('Failed to fetch ideas');
      const ideasData = await response.json();
      setIdeas(ideasData);
    } catch (error) {
      console.error('Fetch ideas error:', error);
    }
  };

  const postIdea = async (content: string) => {
    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error('Failed to post idea');
      const newIdea = await response.json();
      setIdeas(prev => [newIdea, ...prev]);
    } catch (error) {
      console.error('Post idea error:', error);
      throw error;
    }
  };

  const likeIdea = async (ideaId: string) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}/like`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to like idea');
      const updatedIdea = await response.json();
      setIdeas(prev => prev.map(idea => idea.id === ideaId ? updatedIdea : idea));
    } catch (error) {
      console.error('Like idea error:', error);
      throw error;
    }
  };

  const commentOnIdea = async (ideaId: string, content: string) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error('Failed to comment on idea');
      const updatedIdea = await response.json();
      setIdeas(prev => prev.map(idea => idea.id === ideaId ? updatedIdea : idea));
    } catch (error) {
      console.error('Comment on idea error:', error);
      throw error;
    }
  };

  return (
    <IdeasContext.Provider value={{ ideas, postIdea, likeIdea, commentOnIdea }}>
      {children}
    </IdeasContext.Provider>
  );
};

export const useIdeas = () => {
  const context = useContext(IdeasContext);
  if (context === undefined) {
    throw new Error('useIdeas must be used within an IdeasProvider');
  }
  return context;
};
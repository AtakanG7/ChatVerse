'use client';
import React, { useState } from 'react';
import { User } from '@prisma/client';
import { useIdeas } from '@/app/hooks/useIdeas';

interface Post {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
}

interface PostsScreenProps {
  currentUser: User;
  connections: User[];
}

const PostsScreen: React.FC<PostsScreenProps> = ({ currentUser, connections }) => {
  const { ideas, postIdea, likeIdea, commentOnIdea } = useIdeas();
  const [newPostContent, setNewPostContent] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostContent.trim()) {
      try {
        await postIdea(newPostContent, currentUser.id);
        setNewPostContent('');
        setCharCount(0);
      } catch (error) {
        console.error('Error creating post:', error);
      }
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    if (content.length <= 500) {
      setNewPostContent(content);
      setCharCount(content.length);
    }
  };

  const handleLikePost = async (ideaId: string) => {
    try {
      await likeIdea(ideaId, currentUser.id);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentPost = async (ideaId: string, content: string) => {
    try {
      await commentOnIdea(ideaId, content);
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  return (
    <div className="flex flex-col items-center overflow-y-auto p-6 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white min-h-screen">
      <div className="w-full max-w-2xl">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-teal-500">Posts</h2>
        <PostBox
          onCreatePost={handleCreatePost}
          newPostContent={newPostContent}
          charCount={charCount}
          handleTextChange={handleTextChange}
        />
        <div className="space-y-6">
          {ideas.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              onLike={() => handleLikePost(post.id)}
              onComment={(content) => handleCommentPost(post.id, content)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const PostBox: React.FC<{
  onCreatePost: (e: React.FormEvent) => void;
  newPostContent: string;
  charCount: number;
  handleTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ onCreatePost, newPostContent, charCount, handleTextChange }) => {
  return (
    <form onSubmit={onCreatePost} className="mb-8 bg-gray-800 p-6 rounded-2xl shadow-lg transition duration-200 hover:shadow-2xl">
      <textarea
        value={newPostContent}
        onChange={handleTextChange}
        className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
        placeholder="What's happening?"
        rows={4}
        maxLength={500}
      />
      <div className="flex justify-between items-center mt-4">
        <span className="text-gray-400 text-sm">{charCount}/500</span>
        <button
          type="submit"
          className="bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
        >
          Post
        </button>
      </div>
    </form>
  );
};

const PostItem: React.FC<{
  post: Post;
  onLike: () => void;
  onComment: (content: string) => void;
}> = ({ post, onLike, onComment }) => {
  const [commentContent, setCommentContent] = useState('');

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentContent(e.target.value);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentContent.trim()) {
      onComment(commentContent);
      setCommentContent('');
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {post.author.name[0]}
        </div>
        <div className="ml-4">
          <div className="font-semibold text-lg">{post.author.name}</div>
          <div className="text-gray-400 text-sm">
            {new Date(post.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
      <div className="text-gray-100 text-lg mb-4">{post.content}</div>
      <div className="flex justify-between items-center">
        <button
          onClick={onLike}
          className="text-teal-500 hover:text-teal-400 transition duration-300"
        >
          <i className="fas fa-heart"></i> Like
        </button>
        <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={commentContent}
            onChange={handleCommentChange}
            placeholder="Add a comment..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-full p-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
          />
          <button type="submit" className="bg-teal-500 text-white px-4 py-1 rounded-full hover:bg-teal-600 focus:outline-none transition duration-300">
            Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostsScreen;

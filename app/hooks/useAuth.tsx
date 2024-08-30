'use client';
// app/hooks/useAuth.ts
import React, { useState, useEffect, useContext, createContext } from 'react';
import { User } from '../../types/prisma';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth', {
        method: 'GET',
        credentials: 'include', // This is important to include cookies
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error('Failed to check session:', error);
    }
  };

  const login = async (email: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
    } catch (error) {
      console.error('Login error:', error);
      notify('Login failed. Please try again.');
      throw error;
    }
  };

  const verifyCode = async (email: string, token: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token }),
        credentials: 'include', // This is important to include cookies
      });
      if (!response.ok) throw new Error('Verification failed');
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        notify('Email verified. You can now login.');
        return true;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Verification error:', error);
      notify('Verification failed. Please try again.');
      return false;
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth', {
        method: 'DELETE',
        credentials: 'include', // This is important to include cookies
      });
      if (!response.ok) throw new Error('Logout failed');
      setUser(null);
      notify('Logged out successfully.');
    } catch (error) {
      console.error('Logout error:', error);
      notify('Logout failed. Please try again.');
    }
  };

  const notify = (message: string) => {
    toast(message, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 5000,
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, verifyCode }}>
      <ToastContainer />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
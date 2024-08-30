'use client';
import Chat from './components/Chat/Chat';
import { AuthProvider } from './hooks/useAuth';
import { ChatProvider } from './hooks/useChat';
import { IdeasProvider } from './hooks/useIdeas';

export default function Home() {
  return (
    <AuthProvider>
      <ChatProvider>
        <IdeasProvider>
          <main className="h-screen">
            <Chat />
          </main>
        </IdeasProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

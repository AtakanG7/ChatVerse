import { useState, useEffect, SetStateAction } from 'react';
import Chat from '../components/Chat';

export default function Home() {
  const [user, setUser] = useState<null | { id: string; name: string; }>(null);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const response = await fetch('/api/session');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    };
    checkSession();
  }, []);

  return <Chat />;
}

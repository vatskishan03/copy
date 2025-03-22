import { useState, useEffect, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

interface ContentLoadPayload {
  content: string;
  collaborators: string[];
}
interface ContentUpdatePayload {
  content: string;
}
interface UserPayload {
  userId: string;
  count: number;
}

export const useWebSocket = (url: string, token: string, onContentUpdate: (content: string) => void) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [collaborators, setCollaborators] = useState<string[]>([]);

  useEffect(() => {
    if (!token) return;
    const newSocket = io(url);

    newSocket.on('connect', () => {
      setConnected(true);
      newSocket.emit('join-room', token);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('content-load', ({ content, collaborators }: ContentLoadPayload) => {
      onContentUpdate(content);
      setCollaborators(collaborators);
    });

    newSocket.on('content-updated', ({ content }: ContentUpdatePayload) => {
      onContentUpdate(content);
    });

    newSocket.on('user-joined', ({ userId }: UserPayload) => {
      setCollaborators(prev => {
         if (!prev.includes(userId)) return [...prev, userId];
         return prev;
      });
    });

    newSocket.on('user-left', ({ userId }: UserPayload) => {
      setCollaborators(prev => prev.filter(id => id !== userId));
    });

    newSocket.on('error', (error: { message: string }) => {
      console.error('WebSocket error:', error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [url, token, onContentUpdate]);

  const updateContent = useCallback((content: string) => {
    if (socket && connected) {
      socket.emit('content-change', { token, content });
    }
  }, [socket, connected, token]);

  return {
    connected,
    collaborators,
    updateContent,
  };
};
import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface CursorPosition {
  userId: string;
  position: number;
}

interface Selection {
  userId: string;
  start: number;
  end: number;
}

interface ContentLoadPayload {
  content: string;
  collaborators: string[];
}

interface ContentUpdatePayload {
  content: string;
}

interface CursorUpdatePayload {
  userId: string;
  position: number;
}

interface SelectionUpdatePayload {
  userId: string;
  selection: {
    start: number;
    end: number;
  };
}

interface UserPayload {
  userId: string;
  count: number;
}

export const useWebSocket = (url: string, token: string) => {
  const [socket, setSocket] = useState<Socket | null>(null); 
  const [connected, setConnected] = useState(false);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [cursors, setCursors] = useState<CursorPosition[]>([]);
  const [selections, setSelections] = useState<Selection[]>([]);
  const contentRef = useRef('');


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
      contentRef.current = content;
      setCollaborators(collaborators);
    });

    newSocket.on('content-updated', ({ content }: ContentUpdatePayload) => {
      contentRef.current = content;
    });

    newSocket.on('cursor-update', ({ userId, position }: CursorUpdatePayload) => {
      setCursors(prev => {
        const filtered = prev.filter(c => c.userId !== userId);
        return [...filtered, { userId, position }];
      });
    });

    newSocket.on('selection-update', ({ userId, selection }: SelectionUpdatePayload) => {
      setSelections(prev => {
        const filtered = prev.filter(s => s.userId !== userId);
        return [...filtered, { userId, ...selection }];
      });
    });

    newSocket.on('user-joined', ({ userId, count }: UserPayload) => {
      setCollaborators(prev => [...prev, userId]);
    });

    newSocket.on('user-left', ({ userId, count }: UserPayload) => {
      setCollaborators(prev => prev.filter(id => id !== userId));
      setCursors(prev => prev.filter(c => c.userId !== userId));
      setSelections(prev => prev.filter(s => s.userId !== userId));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [url, token]);

  const updateContent = useCallback((content: string, cursor?: number) => {
    if (socket && connected) {
      socket.emit('content-change', { token, content, cursor });
    }
  }, [socket, connected, token]);

  const updateCursor = useCallback((position: number) => {
    if (socket && connected) {
      socket.emit('cursor-move', { token, position });
    }
  }, [socket, connected, token]);

  const updateSelection = useCallback((start: number, end: number) => {
    if (socket && connected) {
      socket.emit('selection-change', { token, selection: { start, end } });
    }
  }, [socket, connected, token]);

  return {
    socket,
    connected,
    collaborators,
    cursors,
    selections,
    updateContent,
    updateCursor,
    updateSelection,
    content: contentRef.current
  };
};
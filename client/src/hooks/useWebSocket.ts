import { useState, useEffect, useCallback } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export const useWebSocket = (
  url: string, 
  documentName: string
) => {
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const newProvider = new WebsocketProvider(url, documentName, ydoc);

    newProvider.on('status', ({ status }: { status: string }) => {
      setConnected(status === 'connected');
    });

    setProvider(newProvider);

    return () => {
      newProvider.disconnect();
    };
  }, [url, documentName]);

  const disconnect = useCallback(() => {
    if (provider) {
      provider.disconnect();
    }
  }, [provider]);

  const connect = useCallback(() => {
    if (provider) {
      provider.connect();
    }
  }, [provider]);

  return { provider, connected, disconnect, connect };
};
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useState, useEffect } from 'react';


export const useYjs = (snippetId: string, ydoc: Y.Doc) => {
    const [provider, setProvider] = useState<WebsocketProvider | null>(null);
    const [yText, setYText] = useState<Y.Text | null>(null);

    useEffect(() => {
        if(ydoc){
          const newProvider = new WebsocketProvider(
            'ws://localhost:3000/snippet', // Replace with your actual server URL
            snippetId,
            ydoc
          );
    
          // Get the Y.Text object representing the shared text
          const newYText = ydoc.getText('content');

          setYText(newYText);
          setProvider(newProvider);
        }

      return () => {
        if (provider) {
          provider.destroy(); // Clean up the provider on component unmount
        }
      };
    }, [ydoc, snippetId]);

    return { provider, yText };
};

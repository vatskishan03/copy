import React, { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { QuillBinding } from 'y-quill';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useAuth0 } from '@auth0/auth0-react';

const WEBSOCKET_ENDPOINT = 'ws://localhost:1234'; // Replace with your WebSocket server endpoint
const DOCUMENT_NAME = 'quill-demo';

const TextEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (!editorRef.current) return;

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(WEBSOCKET_ENDPOINT, DOCUMENT_NAME, ydoc);
    const ytext = ydoc.getText('quill');

    const editor = new Quill(editorRef.current, {
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block']
        ]
      },
      theme: 'snow'
    });

    const binding = new QuillBinding(ytext, editor);

    // Awareness (optional)
    const awareness = provider.awareness;
    awareness.setLocalStateField('user', {
      name: 'Anonymous', // You can set this to the user's name from Auth0
      color: '#' + Math.floor(Math.random() * 16777215).toString(16) // Random color
    });

    // Clean up
    return () => {
      binding.destroy();
      provider.disconnect();
    };
  }, []);

  const handleSave = async () => {
    try {
      const token = await getAccessTokenSilently();
      // Here you would typically send the document state to your server
      // This is just a placeholder for now
      console.log('Saving document...');
      // In a real application, you'd send the Yjs document state to your server
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Collaborative Text Editor</h2>
      <div ref={editorRef} className="h-64 border rounded-md"></div>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default TextEditor;
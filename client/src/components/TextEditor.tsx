import React, { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useAuth0 } from '@auth0/auth0-react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useLocalStorage } from '../hooks/useLocalStorage';

const WEBSOCKET_ENDPOINT = 'ws://localhost:1234';
const DOCUMENT_NAME = 'quill-demo';

const TextEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const { getAccessTokenSilently } = useAuth0();
  const { provider, connected } = useWebSocket(WEBSOCKET_ENDPOINT, DOCUMENT_NAME);
  const [lastEditedContent, setLastEditedContent] = useLocalStorage<string>('lastEditedContent', '');

  useEffect(() => {
    if (!editorRef.current || !provider) return;

    const ydoc = provider.doc;
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

    // Set initial content from localStorage if available
    if (lastEditedContent) {
      editor.setText(lastEditedContent);
    }

    // Save content to localStorage on change
    editor.on('text-change', () => {
      setLastEditedContent(editor.getText());
    });

    const awareness = provider.awareness;
    awareness.setLocalStateField('user', {
      name: 'Anonymous',
      color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    });

    return () => {
      binding.destroy();
    };
  }, [provider, lastEditedContent, setLastEditedContent]);

  const handleSave = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log('Saving document...');
      // Here you would send the document state to your server
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
      {connected ? (
        <p className="text-green-500 mt-2">Connected to server</p>
      ) : (
        <p className="text-red-500 mt-2">Disconnected from server</p>
      )}
    </div>
  );
};

export default TextEditor;
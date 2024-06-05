// frontend/src/components/TextEditor.tsx
import React, { useEffect, useRef, useState } from 'react';
import { createEditor, Editor, Transforms, Text } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { io } from 'socket.io-client';

import { useRecoilState } from 'recoil';
import { snippetState, errorState } from '../state/atoms';
import { Snippet } from '../../../shared/types';
import * as Y from 'yjs';

interface TextEditorProps {
  initialContent: Y.Doc; 
  canEdit: boolean;
  snippetId: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ initialContent, canEdit, snippetId }) => {
  const editorRef = useRef<Editor>(withReact(createEditor())); 
  const [value, setValue] = useState<any>(initialContent ? initialContent.getText('content').toJSON() : null); 
  const socket = useRef<any>(null);
  const [, setError] = useRecoilState(errorState);
  
  // Typeguard function to check if value is a Y.Doc
  const isYDoc = (value: any): value is Y.Doc => value instanceof Y.Doc;
  
  let ydoc: Y.Doc; 
  
  useEffect(() => {
    const editor = editorRef.current;
    // Initialize Socket.IO connection
    socket.current = io('/snippet');
    
    if (isYDoc(initialContent)) {
      ydoc = initialContent; // Set the initial content
      ydoc.on('update', updateEditor);
      setValue(ydoc.getText('content').toJSON());
    }
    
    socket.current.on('connect', () => {
      socket.current.emit('joinSnippet', snippetId); // Join the snippet room
    });

    function updateEditor() {
        setValue(ydoc.getText('content').toJSON());
    }

    socket.current.on('snippetUpdated', (changes: any) => {
      if (canEdit) {
        ydoc.transact(() => {
          changes.forEach((change: any) => {
            if (change.retain) {
              Transforms.move(editor, { distance: change.retain as number });
            } else if (change.insert) {
              Transforms.insertText(editor, change.insert);
            } else {
              Transforms.delete(editor, { distance: change.delete as number });
            }
          });
        });
        setValue(initialContent.getText('content').toJSON());
      }
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect(); // Clean up on unmount
        ydoc.off('update', updateEditor); // Remove the listener
      }
    };
  }, [snippetId, canEdit, initialContent]);

  const handleEdit = (newValue: any) => {
    setValue(newValue);
    if (!canEdit || !isYDoc(initialContent)) return;

    const oldText = initialContent?.getText('content');
    const newText = newValue.getText('content');

    const changes = ydoc.getText('content').toDelta(oldText, newText);
    socket.current.emit('updateSnippet', snippetId, changes);
  };

  return (
    <Slate editor={editorRef.current} value={value} onChange={handleEdit}>
      <Editable readOnly={!canEdit} />
    </Slate>
  );
};

export default TextEditor;


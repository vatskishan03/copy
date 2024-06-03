// frontend/src/components/TextEditor.tsx
import React, { useEffect, useRef, useState } from 'react';
import { createEditor, Editor, Transforms, Text } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { io } from 'socket.io-client';

import { useRecoilState } from 'recoil';
import { snippetState, errorState } from '../state/atoms';

interface TextEditorProps {
  initialContent: string;
  canEdit: boolean;
  snippetId: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ initialContent, canEdit, snippetId }) => {
  const editor = useRef(withReact(createEditor())).current;
  const socket = useRef<any>(null);
  const [snippet, setSnippet] = useRecoilState(snippetState);
  const [, setError] = useRecoilState(errorState);

  useEffect(() => {
    // Initialize Socket.IO connection
    socket.current = io('/snippet'); 

    socket.current.on('connect', () => {
      socket.current.emit('joinSnippet', snippetId); // Join the snippet room
    });

    socket.current.on('snippetUpdated', (changes: any) => {
      if (canEdit) {
        // Apply changes from other users
        changes.forEach((change: any) => {
          if(change.retain) {
            Transforms.move(editor, {distance: change.retain});
          }
          else if(change.insert) {
            Transforms.insertText(editor, change.insert);
          }
          else {
            Transforms.delete(editor, {distance: change.delete});
          }
        })
      }
    });

    return () => {
      socket.current.disconnect(); // Clean up on unmount
    };
  }, [snippetId, canEdit]);

  useEffect(() => {
    const ydoc = snippet.content;

    // Render initial content
    if (ydoc) {
      const initialValue = ydoc.getText('content').toJSON();
      editor.children = initialValue;
      Editor.normalize(editor, { force: true });
    }
  }, [snippet]);

  const handleEdit = (value: any) => {
    setSnippet({ ...snippet, content: value });
    if (!canEdit) return;

    const oldText = snippet?.content?.getText('content');
    const newText = value.getText('content');

    const changes = ydoc.getText('content').toDelta(oldText, newText);
    socket.current.emit('updateSnippet', snippetId, changes);
  };

  return (
    <Slate editor={editor} value={snippet?.content?.getText('content').toJSON() || [{ text: "" }]} onChange={handleEdit}>
      <Editable readOnly={!canEdit} />
    </Slate>
  );
};

export default TextEditor;


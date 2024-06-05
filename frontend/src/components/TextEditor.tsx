import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createEditor, Editor, Transforms } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { io } from 'socket.io-client';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { snippetState, errorState } from '../state/atoms';
import { Snippet } from '../../../shared/types';
import * as Y from 'yjs';
import { ReactEditor } from 'slate-react';
import { Descendant } from 'slate';         interface TextEditorProps {
  initialContent: Y.Doc;
  canEdit: boolean;
  snippetId: string;
}
const TextEditor: React.FC<TextEditorProps> = ({ initialContent, canEdit, snippetId }) => {
  const editorRef = useRef<ReactEditor>(null);
  const [value, setValue] = useState<Descendant[]>([{ text: '' }]); 
  const socket = useRef<any>(null);
  const setSnippet = useSetRecoilState(snippetState);
  const setError = useSetRecoilState(errorState);
  const isYDoc = (value: any): value is Y.Doc => value instanceof Y.Doc;
  let ydoc: Y.Doc;

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // Initialize Socket.IO connection
    socket.current = io('/snippet');
    socket.current.on('connect', () => {
      socket.current.emit('joinSnippet', snippetId); // Join the snippet room
      if (!ydoc) {
        ydoc = initialContent;
        ydoc.on('update', updateEditor);
        setValue([{text: ydoc.getText('content').toString()}]);
      }
    });

    function updateEditor() {
      setValue([{text: ydoc.getText('content').toString()}]);
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
        setValue([{text: ydoc.getText('content').toString()}]);
      }
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect(); // Clean up on unmount
        initialContent.off('update', updateEditor); // Remove the listener
      }
    };
  }, [snippetId, canEdit, initialContent]);

  const handleEdit =  useCallback((newValue: Descendant[]) => {
    setValue(newValue);
    if (!canEdit || !isYDoc(initialContent)) return;

    const ytext = initialContent.getText('content');
    
    ytext.applyDelta(newValue);

    const changes = ytext.toDelta();
    socket.current.emit('updateSnippet', snippetId, changes);
  }, [canEdit, initialContent, snippetId, socket]);


  return (
    <div>
    {editorRef.current && (
      <Slate editor={editorRef.current} initialValue={value} onChange={handleEdit}>
        <Editable readOnly={!canEdit} />
      </Slate>
    )}
    </div>
  );
};
export default TextEditor;

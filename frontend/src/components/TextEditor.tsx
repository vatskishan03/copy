import React, { useEffect, useRef, useState, useCallback } from "react";
import { createEditor, Editor, Transforms, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { io } from "socket.io-client";
import { useRecoilState, useSetRecoilState } from "recoil";
import { snippetState, errorState } from "../state/atoms";
import { Snippet } from 'shared/types';
import * as Y from "yjs";
import { ReactEditor } from "slate-react";

interface TextEditorProps {
  initialContent: Y.Doc;
  canEdit: boolean;
  snippetId: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ initialContent, canEdit, snippetId }) => {
  const editorRef = useRef<ReactEditor & Editor>(withReact(createEditor()));
  const [value, setValue] = useState<Descendant[]>([{ children: [{ text: '' }] }]);
  const socket = useRef<any>(null);
  const [snippet, setSnippet] = useRecoilState(snippetState);
  const setError = useSetRecoilState(errorState);
  const isYDoc = (value: any): value is Y.Doc => value instanceof Y.Doc;
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    socket.current = io('/snippet');
    socket.current.on('connect', () => {
      socket.current.emit('joinSnippet', snippetId);
      if (isYDoc(initialContent)) {
        setYdoc(initialContent);
      }
    });

    const updateEditor = () => {
      if (ydoc) {
        const updatedValue: Descendant[] = JSON.parse(ydoc.getText("content").toString());
        setValue(updatedValue);
        if (snippet) {
          setSnippet({
            ...snippet,
            content: ydoc,
            token: snippet.token || "", // Ensure token is a string
            _id: snippet._id,
            canEdit: snippet.canEdit,
            createdAt: snippet.createdAt,
            expiresAt: snippet.expiresAt
          });
        }
      }
    };

    if (ydoc) {
      ydoc.on('update', updateEditor);
    }

    socket.current.on('snippetUpdated', (changes: any) => {
      if (canEdit && ydoc) {
        ydoc.transact(() => {
          changes.forEach((change: any) => {
            if (change.retain) {
              Transforms.move(editorRef.current!, { distance: change.retain as number });
            } else if (change.insert) {
              Transforms.insertText(editorRef.current!, change.insert);
            } else {
              Transforms.delete(editorRef.current!, { distance: change.delete as number });
            }
          });
        });
        setValue([{ children: [{ text: ydoc.getText('content').toString() }] }]);
      }
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        if (ydoc) {
          ydoc.off('update', updateEditor);
        }
      }
    };
  }, [snippetId, canEdit, initialContent, snippet]);

  const handleEdit = useCallback((newValue: Descendant[]) => {
    setValue(newValue);
    if (!canEdit || !ydoc) return;

    const ytext = ydoc.getText('content');
    ytext.applyDelta(newValue);

    const changes = ytext.toDelta();
    socket.current.emit('updateSnippet', snippetId, changes);
  }, [canEdit, snippetId, ydoc]);

  return (
    <div>
      <Slate editor={editorRef.current} initialValue={value} onChange={handleEdit}>
        <Editable readOnly={!canEdit} />
      </Slate>
    </div>
  );
};

export default TextEditor;


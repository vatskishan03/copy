// client/src/components/TextEditor.tsx
import React, { useState } from 'react';

interface TextEditorProps {
  onSave: (content: string) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({ onSave }) => {
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (content.trim()) {
      onSave(content);
      setContent('');
    }
  };

  return (
    <div className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded"
        rows={4}
        placeholder="Type or paste your content here..."
      />
      <button
        onClick={handleSave}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Save to Clipboard
      </button>
    </div>
  );
};
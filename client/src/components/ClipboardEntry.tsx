// client/src/components/ClipboardEntry.tsx
import React, { useState } from 'react';
import { QRCodeGenerator } from './QRCodeGenerator';

interface ClipboardEntryProps {
  id: string;
  content: string;
  timestamp: Date;
  onDelete: (id: string) => void;
  onEdit: (id: string, newContent: string) => void;
}

export const ClipboardEntry: React.FC<ClipboardEntryProps> = ({
  id,
  content,
  timestamp,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [showQR, setShowQR] = useState(false);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(id, editedContent);
    }
    setIsEditing(!isEditing);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="border p-4 mb-4 rounded-lg shadow-md">
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full p-2 border rounded"
        />
      ) : (
        <p className="mb-2">{content}</p>
      )}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {timestamp.toLocaleString()}
        </span>
        <div>
          <button
            onClick={handleEdit}
            className="mr-2 px-2 py-1 bg-blue-500 text-white rounded"
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
          <button
            onClick={handleCopy}
            className="mr-2 px-2 py-1 bg-green-500 text-white rounded"
          >
            Copy
          </button>
          <button
            onClick={() => setShowQR(!showQR)}
            className="mr-2 px-2 py-1 bg-purple-500 text-white rounded"
          >
            {showQR ? 'Hide QR' : 'Show QR'}
          </button>
          <button
            onClick={() => onDelete(id)}
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
      {showQR && <QRCodeGenerator content={content} />}
    </div>
  );
};
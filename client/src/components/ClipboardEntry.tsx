import React from 'react';
import { format } from 'date-fns';

interface ClipboardItem {
  id: string;
  content: string;
  timestamp: Date;
}
interface ClipboardEntryProps {
  item: ClipboardItem;
  onDelete: () => void;
}

const ClipboardEntry: React.FC<ClipboardEntryProps> = ({ item, onDelete }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(item.content);
  };

  return (
    <li className="bg-gray-100 p-4 rounded-md">
      <div className="flex justify-between items-start">
        <div className="flex-grow mr-4">
          <p className="text-gray-800">{item.content}</p>
          <p className="text-sm text-gray-500 mt-1">
            {format(item.timestamp, 'MMM dd, yyyy HH:mm:ss')}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Copy
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};

export default ClipboardEntry;
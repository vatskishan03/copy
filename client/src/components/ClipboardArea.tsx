import React, { useState, useEffect } from 'react';
import ClipboardEntry from './ClipboardEntry';
import { useAuth0 } from '@auth0/auth0-react';

interface ClipboardItem {
  id: string;
  content: string;
  timestamp: Date;
}

const ClipboardArea: React.FC = () => {
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    fetchClipboardItems();
  }, []);

  const fetchClipboardItems = async () => {
    try {
      const token = await getAccessTokenSilently();
      // Fetch clipboard items from your API
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // });
      // const data = await response.json();
      // setClipboardItems(data);
      
      // For now, let's use dummy data
      setClipboardItems([
        { id: '1', content: 'Sample clipboard item 1', timestamp: new Date() },
        { id: '2', content: 'Sample clipboard item 2', timestamp: new Date() },
      ]);
    } catch (error) {
      console.error('Error fetching clipboard items:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getAccessTokenSilently();
      // Delete item from your API
      // await fetch(`YOUR_API_ENDPOINT/${id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // });
      setClipboardItems(clipboardItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting clipboard item:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Clipboard History</h2>
      {clipboardItems.length === 0 ? (
        <p className="text-gray-500">No clipboard items found.</p>
      ) : (
        <ul className="space-y-4">
          {clipboardItems.map(item => (
            <ClipboardEntry
              key={item.id}
              item={item}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClipboardArea;
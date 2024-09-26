import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { format } from 'date-fns';

interface Entry {
  id: string;
  content: string;
  timestamp: Date;
}

const RecentEntries: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    fetchRecentEntries();
  }, []);

  const fetchRecentEntries = async () => {
    try {
      const token = await getAccessTokenSilently();
      // In a real application, you would fetch data from your API
      // const response = await fetch('YOUR_API_ENDPOINT/recent-entries', {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // });
      // const data = await response.json();
      // setEntries(data);

      // For demonstration, we'll use dummy data
      setEntries([
        { id: '1', content: 'Recent entry 1', timestamp: new Date() },
        { id: '2', content: 'Recent entry 2', timestamp: new Date(Date.now() - 86400000) },
        { id: '3', content: 'Recent entry 3', timestamp: new Date(Date.now() - 172800000) },
      ]);
    } catch (error) {
      console.error('Error fetching recent entries:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Recent Entries</h2>
      {entries.length === 0 ? (
        <p className="text-gray-500">No recent entries found.</p>
      ) : (
        <ul className="space-y-4">
          {entries.map(entry => (
            <li key={entry.id} className="border-b pb-2">
              <p className="text-gray-800">{entry.content}</p>
              <p className="text-sm text-gray-500 mt-1">
                {format(entry.timestamp, 'MMM dd, yyyy HH:mm:ss')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentEntries;
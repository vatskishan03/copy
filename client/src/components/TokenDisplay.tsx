// src/components/TokenDisplay.tsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useClipboard } from '../hooks/useClipboard';

const TokenDisplay: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { copiedText, copyToClipboard } = useClipboard();

  const fetchAndCopyToken = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const success = await copyToClipboard(accessToken);
      if (success) {
        alert('Token copied to clipboard!');
      }
    } catch (error) {
      console.error('Error fetching or copying token:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Access Token</h2>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
        onClick={fetchAndCopyToken}
      >
        Fetch and Copy Token
      </button>
      {copiedText && (
        <p className="mt-2 text-sm text-gray-600">Token copied successfully!</p>
      )}
    </div>
  );
};

export default TokenDisplay;
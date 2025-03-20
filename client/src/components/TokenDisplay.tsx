import React, { useState } from 'react';
import { useClipboard } from '../hooks/useClipboard';

interface TokenResponse {
  token: string;
  expiresAt: string;
}

const TokenDisplay: React.FC = () => {
  const { copiedText, copyToClipboard } = useClipboard();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateAndCopyToken = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/snippets/token', {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to generate token');
      
      const data: TokenResponse = await response.json();
      setToken(data.token);
      await copyToClipboard(data.token);
    } catch (error) {
      console.error('Error generating token:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Share Token</h2>
      {token && (
        <div className="mb-4 p-4 bg-gray-50 rounded-md">
          <p className="text-lg font-semibold">Your Token: {token}</p>
          <p className="text-sm text-gray-600">Use this token to share your clipboard</p>
        </div>
      )}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 disabled:opacity-50"
        onClick={generateAndCopyToken}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate New Token'}
      </button>
      {copiedText && (
        <p className="mt-2 text-sm text-gray-600">Token copied to clipboard!</p>
      )}
    </div>
  );
};

export default TokenDisplay;
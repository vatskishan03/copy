// client/src/components/TokenDisplay.tsx
import React, { useState, useEffect } from 'react';

interface TokenDisplayProps {
  token: string;
  onRefresh: () => void;
}

export const TokenDisplay: React.FC<TokenDisplayProps> = ({ token, onRefresh }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
  };

  return (
    <div className="mb-4 p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Your Access Token</h2>
      <div className="flex items-center">
        <input
          type="text"
          value={token}
          readOnly
          className="flex-grow p-2 border rounded-l"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-green-500 text-white rounded-r"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <button
        onClick={onRefresh}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Refresh Token
      </button>
    </div>
  );
};
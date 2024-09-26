import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const TokenDisplay: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchToken = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      setToken(accessToken);
    } catch (error) {
      console.error('Error fetching token:', error);
      setToken(null);
    }
  };

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token)
        .then(() => {
          alert('Copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy token: ', err);
        });
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Access Token</h2>
      {token ? (
        <div>
          <p className="text-sm text-gray-600 mb-2">Your current access token:</p>
          <div className="bg-gray-100 p-4 rounded-md">
            <code className="text-xs break-all">{token}</code>
          </div>
          <button
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
            onClick={handleCopyToken}
          >
            Copy
          </button>
        </div>
      ) : (
        <p className="text-gray-500">No token available. Please log in.</p>
      )}
    </div>
  );
};

export default TokenDisplay;
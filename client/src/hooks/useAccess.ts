import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';

export const useAccessToken = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        setAccessToken(token);
      } catch (error) {
        console.error('Error getting access token', error);
      }
    };

    getToken();
  }, [getAccessTokenSilently]);

  return accessToken;
};
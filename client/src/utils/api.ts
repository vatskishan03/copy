// Automatically detect environment based on the current hostname
const isProd = window.location.hostname !== 'localhost';

// Use appropriate URLs based on environment
export const API_BASE_URL = isProd 
  ? 'https://copyit.onrender.com/api'  // Production backend URL
  : 'http://localhost:3001/api';       // Local development backend URL

export const WEBSOCKET_URL = isProd
  ? 'wss://copyit.onrender.com'        // Secure WebSocket for production (note: wss://)
  : 'ws://localhost:3001';             // Local WebSocket

export const api = {
  createSnippet: async (content: string) => {
    const response = await fetch(`${API_BASE_URL}/snippets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    return response.json();
  },
  getSnippet: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/snippets/${token}`);
    return response.json();
  },
  generateToken: async () => {
    const response = await fetch(`${API_BASE_URL}/snippets/token`, {
      method: 'POST',
    });
    return response.json();
  },
};

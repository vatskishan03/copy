// Automatically detect environment based on the current hostname
const isProd = window.location.hostname !== 'localhost';

export const API_BASE_URL = isProd 
  ? 'https://copy-mkuy.onrender.com/api'  
  : 'http://localhost:3001/api';       

export const WEBSOCKET_URL = isProd
  ? 'wss://copy-mkuy.onrender.com'        
  : 'ws://localhost:3001';         

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

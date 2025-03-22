const API_BASE_URL = process.env.APP_API_URL || 'http://localhost:3001/api';

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
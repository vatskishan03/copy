import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const createSnippet = async (content: string) => {
  const response = await api.post('/snippets', { content });
  return response.data;
};

export const getSnippet = async (token: string) => {
  const response = await api.get(`/snippets/${token}`);
  return response.data;
};

export const updateSnippet = async (token: string, content: string) => {
  const response = await api.put(`/snippets/${token}`, { content });
  return response.data;
};
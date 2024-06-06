// frontend/src/api/snippetService.ts
import axios from 'axios'; // You'll need to install axios: npm install axios
import { Snippet } from 'shared/types'; // Assuming you have shared types for Snippet

const API_BASE_URL = '/api/snippet'; // Update if your backend has a different base URL

export const createSnippet = async (content: string, canEdit: boolean) => {
  try {
    const response = await axios.post<Snippet>(`${API_BASE_URL}/create`, {
      content,
      canEdit,
    });
    return response.data;
  } catch (error) {
    // Handle errors (e.g., display an error message to the user)
    throw error;
  }
};

export const getSnippet = async (token: string) => {
  try {
    const response = await axios.get<Snippet>(`${API_BASE_URL}/${token}`);
    return response.data;
  } catch (error) {
    // Handle errors
    throw error;
  }
};

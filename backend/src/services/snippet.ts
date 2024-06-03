// backend/src/services/snippet.ts

import Snippet from '../models/snippet.model';
import { Types } from 'mongoose';
import generateToken from '../utils/tokenGenerator';
import UsedToken from '../models/usedToken.model'; 
interface SnippetData {
  content: string;
  canEdit: boolean;
  expiresAt?: Date; 
}

// Create a new snippet
async function createSnippet(data: SnippetData) {
    try {
      let token:string=generateToken(5); // Initialize token with an initial value
      let isUnique = false;
  
      while (!isUnique) { 
        const existingToken = await UsedToken.findOne({ token });
        const existingSnippet = await Snippet.findOne({ token });
        isUnique = !existingToken && !existingSnippet;
        if (!isUnique) {
            token = generateToken(5);
        }
      }

    const snippet = new Snippet({
      ...data,
      token, // Use the token generated in the loop
      // expiresAt: data.expiresAt // Add expiration if needed (calculate based on your logic)
    });

    return await snippet.save();
  } catch (error) {
    throw error; 
  }
}

// Get a snippet by its token
async function getSnippet(token: string) {
  try {
    return await Snippet.findOne({ token });
  } catch (error) {
    throw error; 
  }
}

export default {
  createSnippet,
  getSnippet,
};

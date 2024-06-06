import * as Y from 'yjs';
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
async function createSnippet(data: SnippetData): Promise<Snippet> {
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

    const ydoc = new Y.Doc();
    ydoc.getText('content').insert(0, data.content);
    const snippet = new Snippet({
      ...data,
      token, // Use the token generated in the loop
      // expiresAt: data.expiresAt // Add expiration if needed (calculate based on your logic)
    });
    const savedSnippet = await snippet.save();
    return {
      ...savedSnippet.toObject(),
      content: ydoc, // Include the Y.Doc in the returned object
    };
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

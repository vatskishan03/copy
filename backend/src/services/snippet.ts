// backend/src/services/snippet.ts
import * as Y from 'yjs';
import Snippet from '../models/snippet.model'; 
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
    let token: string = generateToken(5);
    let isUnique = false;

    while (!isUnique) {
      const existingToken = await UsedToken.findOne({ token });
      const existingSnippet = await Snippet.findOne({ token });
      isUnique = !existingToken && !existingSnippet;
      if (!isUnique) {
        token = generateToken(5);
      }
    }

    // Create the Y.Doc
    const ydoc = new Y.Doc();
    ydoc.getText('content').insert(0, data.content);

    const snippet = new Snippet({
      ...data,
      token, 
      content: ydoc.getText('content').toJSON(),
    });

    return await snippet.save(); 
  } catch (error) {
    throw error; 
  }
}

// Get a snippet by its token
async function getSnippet(token: string): Promise<Snippet|null> {
  try {
    const snippet = await Snippet.findOne({ token });
    if(snippet){
      const ydoc = new Y.Doc(); 
      ydoc.getText("content").insert(0, snippet.content as string);
      return {
        ...snippet.toObject(), 
        content: ydoc
      };
    }
    else{
      return null;
    }
  } catch (error) {
    throw error; 
  }
}

export default { createSnippet, getSnippet };

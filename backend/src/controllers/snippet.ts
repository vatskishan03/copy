// backend/src/controllers/snippet.ts

import { Request, Response } from 'express';
import snippetService from '../services/snippet';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const yDocs: { [snippetId: string]: Y.Doc } = {};
const undoManagers: { [snippetId: string]: Y.UndoManager } = {};

async function createSnippet(req: Request, res: Response) {
  try {
    const { content } = req.body; // Destructure only content here

    const snippet = await snippetService.createSnippet({content,canEdit:false}); // Assuming canEdit is always false for now.

    const ydoc = new Y.Doc();
    ydoc.getText('content').insert(0, content);
    yDocs[snippet.id] = ydoc;
    undoManagers[snippet.id] = new Y.UndoManager(ydoc.getText('content')); 

    const io = req.app.get('io') as any; // Get Socket.IO instance
    new WebsocketProvider(io.of('/snippet'), snippet.id, ydoc);

    res.status(201).json({
      message: 'Snippet created successfully',
      snippet,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the snippet' });
  }
}

async function getSnippet(req: Request, res: Response) {
  try {
    const { token } = req.params;

    const snippet = await snippetService.getSnippet(token);
    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }
    
    const ydoc = yDocs[snippet.id]; // Assuming you're storing the Y.Doc in memory

    // Pass the ydoc to the frontend
    res.status(200).json({
      snippet: {
        ...snippet.toObject(), // Convert to plain object before sending
        content: ydoc, // Send the latest content from the Y.Doc
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the snippet' });
  }
}
function updateSnippet(socket: any, snippetId: string, changes: any) {
  // ... (no changes needed here)
}

function undoSnippet(socket: any, snippetId: string) {
  // ... (no changes needed here)
}


export default { createSnippet, getSnippet, updateSnippet, undoSnippet };

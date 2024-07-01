import { Request, Response } from 'express';
import snippetService from '../services/snippet.js';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Snippet } from '../../../shared/types'; 
import { Server } from 'socket.io';

const yDocs: { [snippetId: string]: Y.Doc } = {};
const undoManagers: { [snippetId: string]: Y.UndoManager } = {};

async function createSnippet(req: Request, res: Response, io: Server) {
  try {
    const { content } = req.body;

    const snippet = await snippetService.createSnippet({ content, canEdit: false });

    const ydoc = new Y.Doc();
    ydoc.getText('content').insert(0, content);
    yDocs[snippet._id] = ydoc;  
    undoManagers[snippet._id] = new Y.UndoManager(ydoc.getText('content'));

    new WebsocketProvider('/snippet', snippet._id.toString(), ydoc);


    res.status(201).json({
      message: 'Snippet created successfully',
      snippet,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the snippet' });
  }
}

async function getSnippet(req: Request, res: Response, io: Server) { 
  try {
    const { token } = req.params;
    
    const snippet = await snippetService.getSnippet(token);
    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }

    // Fetch the ydoc from memory if it exists, otherwise create a new one
    let ydoc = yDocs[snippet._id.toString()];
    if (!ydoc) {
      ydoc = new Y.Doc();
      ydoc.getText('content').insert(0, snippet.content as string);
      yDocs[snippet._id.toString()] = ydoc;
    }
    new WebsocketProvider('/snippet', snippet._id.toString(), ydoc);
    res.status(200).json({
      snippet: snippet, // Send the snippet as a plain object
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
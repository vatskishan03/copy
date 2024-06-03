// backend/src/controllers/snippet.ts
import { Request, Response } from 'express';
import snippetService from '../services/snippet';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

// In-memory storage (replace with database persistence in production)
const yDocs: { [snippetId: string]: Y.Doc } = {};
const undoManagers: { [snippetId: string]: Y.UndoManager } = {};

async function createSnippet(req: Request, res: Response) {
  try {
    const { content, canEdit } = req.body;

    const snippet = await snippetService.createSnippet(content, canEdit);

    const ydoc = new Y.Doc();
    ydoc.getText('content').insert(0, content);
    yDocs[snippet.id] = ydoc;
    undoManagers[snippet.id] = new Y.UndoManager(ydoc.getText('content')); // Create UndoManager

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

    const ydoc = yDocs[snippet.id];
    const content = ydoc.getText('content').toString();

    res.status(200).json({
      snippet: {
        ...snippet,
        content,
      },
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'An error occurred while fetching the snippet' });
  }
}

function updateSnippet(socket: any, snippetId: string, changes: any) {
  const ydoc = yDocs[snippetId];
  if (!ydoc) {
    return;
  }

  ydoc.transact(() => {
    ydoc.getText('content').applyDelta(changes);
  });

  socket.to(snippetId).emit('snippetUpdated', changes);
}

function undoSnippet(socket: any, snippetId: string) {
  const ydoc = yDocs[snippetId];
  if (!ydoc) {
    return;
  }

  const undoManager = undoManagers[snippetId];

  if (undoManager.undoStack.length > 0) {
    undoManager.undo();

    const content = ydoc.getText('content').toString();
    socket.to(snippetId).emit('snippetUpdated', [{ delete: content.length }, { insert: content }]); // Full update for simplicity
  } else {
    // Optionally, send a "no more undo" message to the client
  }
}

export default { createSnippet, getSnippet, updateSnippet, undoSnippet };

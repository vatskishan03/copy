import { Request, Response } from 'express';
import * as snippetService from '../services/snippetService';
import { io } from '../app';

interface AuthenticatedRequest extends Request {
    user?: { id: string };
  }
export const createSnippet = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const userId = (req as AuthenticatedRequest).user?.id;
const result = await snippetService.createSnippet(content, userId);
    
    // Emit event for real-time updates
    io.emit('snippet-created', { token: result.token, content });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create snippet' });
  }
};

export const getSnippet = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const result = await snippetService.getSnippet(token);
    res.json(result);
} catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Snippet not found' || error.message === 'Snippet has expired') {
        res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to retrieve snippet' });
    }
}
  }
};

export const updateSnippet = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { content } = req.body;
    await snippetService.updateSnippet(token, content);
    
    // Emit event for real-time updates
    io.to(token).emit('snippet-updated', { token, content });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to update snippet' });
  }
};
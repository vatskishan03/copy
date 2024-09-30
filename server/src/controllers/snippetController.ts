import { Request, Response } from 'express';
import * as snippetService from '../services/snippetService';

interface RequestWithUser extends Request {
  user?: { id: string };
}

export const createSnippet = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const userId = (req as RequestWithUser).user?.id; // Assuming user info is attached to req by auth middleware
    const result = await snippetService.createSnippet(content, userId);
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
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to update snippet' });
  }
}




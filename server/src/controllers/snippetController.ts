import { Request, Response } from 'express';
import { snippetService } from '../services/snippetService';

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

export const createSnippet = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;
    const snippet = await snippetService.createSnippet(content, userId);
    res.status(201).json(snippet);
  } catch (error) {
    console.error('Error creating snippet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getSnippet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const snippet = await snippetService.getSnippet(id);
    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }
    res.json(snippet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve snippet' });
  }
};

// export const updateSnippet = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { content } = req.body;
//     const updatedSnippet = await snippetService.updateSnippet(id, content);
//     res.json(updatedSnippet);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update snippet' });
//   }
// };

// export const deleteSnippet = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     await snippetService.deleteSnippet(id);
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to delete snippet' });
//   }
// };

export const snippetController = {
  createSnippet,
  getSnippet,
  // updateSnippet,
  // deleteSnippet,
};

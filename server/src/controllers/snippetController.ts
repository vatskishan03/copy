import { Request, Response } from 'express';
import { snippetService } from '../services/snippetService';
import { logger } from '../config/logger';

export const createSnippet = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const snippet = await snippetService.createSnippet(content);
    res.status(201).json(snippet);
  } catch (error) {
    logger.error('Error creating snippet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSnippet = async (req: Request, res: Response) => {
  try {
    const { token } = req.params; 
    const snippet = await snippetService.getSnippet(token);
    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }
    res.json(snippet);
  } catch (error) {
    logger.error('Error retrieving snippet:', error);
    res.status(500).json({ error: 'Failed to retrieve snippet' });
  }
};

export const updateSnippet = async (req: Request, res: Response) => {
  try {
    const { token } = req.params; 
    const { content } = req.body;
    const updatedSnippet = await snippetService.updateSnippet(token, content);
    res.json(updatedSnippet);
  } catch (error) {
    logger.error('Error updating snippet:', error);
    res.status(500).json({ error: 'Failed to update snippet' });
  }
};

export const snippetController = {
  createSnippet,
  getSnippet,
  updateSnippet,
};
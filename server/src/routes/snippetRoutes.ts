import express from 'express';
import { snippetController } from '../controllers/snippetController';
import { validateSnippetCreation, validateSnippetRetrieval } from '../middlewares/inputvalidation';
import { handleValidationErrors } from '../middlewares/errorHandler';
import { cacheMiddleware } from '../middlewares/cacheMiddleware';
import { generateToken } from '../utils/tokenGenerator';

const router = express.Router();

// Generate token
router.post('/token', async (_req, res) => {
  try {
    const token = await generateToken();
    res.json({ 
      token, 
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// Create snippet
router.post('/', 
  validateSnippetCreation, 
  handleValidationErrors, 
  snippetController.createSnippet
);

// Get snippet by token
router.get('/:token', 
  validateSnippetRetrieval,
  handleValidationErrors,
  cacheMiddleware(60),
  snippetController.getSnippet
);

export default router;
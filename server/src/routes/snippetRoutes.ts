import express from 'express';
import { snippetController } from '../controllers/snippetController';
import { validateSnippetCreation, validateSnippetRetrieval } from '../middleware/validators';
import { handleValidationErrors } from '../middleware/errorHandler';
import { cacheMiddleware } from '../middlewares/cacheMiddleware';

const router = express.Router();

router.post('/token', async (_req, res) => {
  try {
    const token = await generateToken();
    res.json({ token, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// ... existing routes ...

export default router;
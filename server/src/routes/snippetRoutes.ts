import express from 'express';
import { snippetController } from '../controllers/snippetController';
import { validateSnippetCreation, validateSnippetRetrieval } from '../middlewares/inputvalidation';
import { handleValidationErrors } from '../middlewares/errorHandler';
import { cacheMiddleware } from '../middlewares/cacheMiddleware';

const router = express.Router();

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


// Update snippet (used by WebSocket service)
router.put('/:token',
  validateSnippetCreation,
  validateSnippetRetrieval,
  handleValidationErrors,
  snippetController.updateSnippet
);

export default router;
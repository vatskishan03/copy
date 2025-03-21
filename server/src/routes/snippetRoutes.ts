import express from 'express';
import { snippetController } from '../controllers/snippetController';
import { validateSnippetCreation, validateSnippetRetrieval, handleValidationErrors } from '../middlewares/inputvalidation';
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

// Update snippet 
router.put('/:token',
  validateSnippetCreation,
  validateSnippetRetrieval,
  handleValidationErrors,
  snippetController.updateSnippet
);

export default router;
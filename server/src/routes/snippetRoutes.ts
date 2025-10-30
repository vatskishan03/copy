import express from 'express';
import { snippetController } from '../controllers/snippetController';
import rateLimit from 'express-rate-limit';
import { validateSnippetCreation, validateSnippetRetrieval, handleValidationErrors } from '../middlewares/inputvalidation';

const router = express.Router();

// Narrow rate limit for mutation routes to protect DB under stress
const writeLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });
const writeLimiterDaily = rateLimit({ windowMs: 24 * 60 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });

// Create snippet
router.post('/', 
  writeLimiterDaily,
  writeLimiter,
  validateSnippetCreation, 
  handleValidationErrors, 
  snippetController.createSnippet
);

// Get snippet by token
router.get('/:token', 
  validateSnippetRetrieval,
  handleValidationErrors,
  snippetController.getSnippet
);

// Update snippet 
router.put('/:token',
  writeLimiter,
  validateSnippetCreation,
  validateSnippetRetrieval,
  handleValidationErrors,
  snippetController.updateSnippet
);

export default router;
import express from 'express';
import { checkJwt } from '../middleware/auth';
import { validateSnippetCreation, validateSnippetRetrieval, validateSnippetUpdate } from '../middleware/validators';
import { handleValidationErrors } from '../middleware/errorHandler';
import { snippetController } from '../controllers/snippetController';
import { cacheMiddleware } from '../middlewares/cacheMiddleware';

const router = express.Router();

router.post(
  '/',
  checkJwt,
  validateSnippetCreation,
  handleValidationErrors,
  snippetController.createSnippet
);
router.get(
  '/:token',
  validateSnippetRetrieval,
  handleValidationErrors,
  cacheMiddleware(60), // 1 minute cache
  snippetController.getSnippet
);
router.put(
  '/:token',
  checkJwt,
  validateSnippetUpdate,
  handleValidationErrors,
  snippetController.updateSnippet
);

export default router;
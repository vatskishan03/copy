import express from 'express';
import * as snippetController from '../controllers/snippetController';
import { validateSnippetCreation, validateSnippetRetrieval, validateSnippetUpdate, handleValidationErrors } from '../middlewares/inputValidation';
import { checkJwt } from '../middlewares/auth';

const router = express.Router();

router.post('/', checkJwt, validateSnippetCreation, handleValidationErrors, snippetController.createSnippet);
router.get('/:token', validateSnippetRetrieval, handleValidationErrors, snippetController.getSnippet);
router.put('/:token', checkJwt, validateSnippetUpdate, handleValidationErrors, snippetController.updateSnippet);

export default router;
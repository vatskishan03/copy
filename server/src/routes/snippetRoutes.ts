import express from 'express';
import * as snippetController from '../controllers/snippetController';
import { validateSnippetCreation, validateSnippetRetrieval, validateSnippetUpdate, handleValidationErrors } from '../middlewares/inputValidation';

const router = express.Router();

router.post('/', validateSnippetCreation, handleValidationErrors, snippetController.createSnippet);
router.get('/:token', validateSnippetRetrieval, handleValidationErrors, snippetController.getSnippet);
router.put('/:token', validateSnippetUpdate, handleValidationErrors, snippetController.updateSnippet);

export default router;
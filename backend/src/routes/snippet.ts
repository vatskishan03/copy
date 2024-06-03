import express from 'express';
import snippetController from '../controllers/snippet'; 

const router = express.Router();
const wrap = (fn: any) => (...args: any) => fn(...args).catch(args[2]); // Error handling middleware

// POST /api/snippet/create - Create a new snippet
router.post('/create', wrap(snippetController.createSnippet));

// GET /api/snippet/:token - Get a snippet by its token
router.get('/:token', wrap(snippetController.getSnippet));

export default router;
